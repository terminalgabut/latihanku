// js/services/csvAggregator.js

import { Logger } from './debug.js';

/**
 * Helper konversi angka string (mendukung format desimal koma '2426,10' & titik)
 */
function safeFloat(val, fallback = 0) {
    if (val === null || val === undefined || val === '') return fallback;
    const normalized = String(val).trim().replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? fallback : parsed;
}

function safeInt(val, fallback = 0) {
    if (val === null || val === undefined || val === '') return fallback;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? fallback : parsed;
}

/**
 * Parser string tanggal Garmin (contoh: "08/09/2026, 04.34.12") ke ISO String
 */
function parseGarminDate(dateStr) {
    if (!dateStr) return new Date().toISOString();
    
    // Jika formatnya "DD/MM/YYYY, HH.MM.SS"
    if (dateStr.includes(',')) {
        const parts = dateStr.split(',');
        const [datePart, timePart] = parts;
        const [day, month, year] = datePart.trim().split('/');
        const timeClean = timePart.trim().replace(/\./g, ':');
        
        const isoLike = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeClean}`;
        const parsed = new Date(isoLike);
        if (!isNaN(parsed.getTime())) return parsed.toISOString();
    }
    
    const directParse = new Date(dateStr);
    return isNaN(directParse.getTime()) ? new Date().toISOString() : directParse.toISOString();
}

/**
 * Parser CSV pintar: Menangani quote "..." dan koma desimal tanpa merusak struktur kolom
 */
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    // Regex untuk memisahkan baris CSV secara presisi berdasarkan koma luar (bukan di dalam kutipan)
    const splitCSVLine = (line) => {
        const result = [];
        let start = 0;
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
            } else if (line[i] === ',' && !inQuotes) {
                result.push(line.substring(start, i).trim().replace(/^"|"$/g, ''));
                start = i + 1;
            }
        }
        result.push(line.substring(start).trim().replace(/^"|"$/g, ''));
        return result;
    };

    const headers = splitCSVLine(lines[0]);

    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = splitCSVLine(line);
        const row = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx] !== undefined ? values[idx] : null;
        });
        return row;
    });
}

/**
 * Helper konversi detik/KM ke format MM:SS
 */
function formatPace(paceSecondsPerKm) {
    if (!paceSecondsPerKm || isNaN(paceSecondsPerKm) || !isFinite(paceSecondsPerKm)) return '0:00';
    const mins = Math.floor(paceSecondsPerKm / 60);
    const secs = Math.floor(paceSecondsPerKm % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Agregasi 3 CSV Garmin menjadi 1 Payload Supabase
 */
export async function processGarminCSVs(files) {
    Logger.info('Memulai pemrosesan 3 CSV sesuai Mapping Final...', 'ENGINE');

    if (!files.record || !files.lap || !files.session) {
        throw new Error('Ketiga file CSV (record, lap, session) wajib diunggah.');
    }

    try {
        const [recordText, lapText, sessionText] = await Promise.all([
            files.record.text(),
            files.lap.text(),
            files.session.text()
        ]);

        const recordRows = parseCSV(recordText);
        const lapRows = parseCSV(lapText);
        const sessionRows = parseCSV(sessionText);

        Logger.info(`Parsed rows -> Record: ${recordRows.length}, Lap: ${lapRows.length}, Session: ${sessionRows.length}`, 'ENGINE');

        if (sessionRows.length === 0) {
            throw new Error('Data session.csv kosong atau format tidak valid.');
        }

        // 1. Ekstraksi Data Utama dari session.csv
        const session = sessionRows[0];

        const totalDistMeters = safeFloat(session.total_distance);
        const totalDistanceKm = Number((totalDistMeters / 1000).toFixed(2));
        const totalDurationS = safeFloat(session.total_elapsed_time || session.total_timer_time);
        
        const avgPaceSecPerKm = totalDistanceKm > 0 ? (totalDurationS / totalDistanceKm) : 0;
        const avgPaceFormatted = formatPace(avgPaceSecPerKm);

        // 2. Ekstraksi laps_data dari lap.csv
        const lapsData = lapRows.map((lap, index) => {
            return {
                lap_index: safeInt(lap.message_index, index),
                start_time: parseGarminDate(lap.start_time),
                end_time: parseGarminDate(lap.timestamp),
                elapsed_time_s: safeFloat(lap.total_elapsed_time || lap.total_timer_time),
                distance_m: safeFloat(lap.total_distance),
                avg_speed_ms: safeFloat(lap.enhanced_avg_speed || lap.avg_speed),
                max_speed_ms: safeFloat(lap.enhanced_max_speed || lap.max_speed),
                avg_heart_rate: safeInt(lap.avg_heart_rate),
                max_heart_rate: safeInt(lap.max_heart_rate),
                avg_cadence: safeInt(lap.avg_cadence || lap.avg_running_cadence),
                lap_trigger: lap.lap_trigger || 'manual'
            };
        });

        // 3. Ekstraksi record_summary dari record.csv
        const routeData = [];
        const kmSplits = [];
        let currentTargetKm = 1;
        let kmStartTime = 0;
        let maxPower = 0;
        let totalPower = 0;
        let powerSampleCount = 0;

        recordRows.forEach((row, idx) => {
            const timeSec = safeFloat(row.timestamp_seconds, idx);
            const distMeters = safeFloat(row.distance);
            const distKm = distMeters / 1000;
            const speedMs = safeFloat(row.enhanced_speed || row.speed);
            const hr = safeInt(row.heart_rate);
            const lat = row.position_lat ? safeFloat(row.position_lat) : null;
            const lng = row.position_long ? safeFloat(row.position_long) : null;
            const power = safeInt(row.power);

            if (power > 0) {
                if (power > maxPower) maxPower = power;
                totalPower += power;
                powerSampleCount++;
            }

            routeData.push({
                t: timeSec,
                d: Number(distMeters.toFixed(2)),
                s: Number(speedMs.toFixed(2)),
                hr: hr,
                lat: lat,
                lng: lng
            });

            if (distKm >= currentTargetKm) {
                const splitDurationSec = timeSec - kmStartTime;
                
                kmSplits.push({
                    km: currentTargetKm,
                    duration_seconds: Math.round(splitDurationSec),
                    pace_formatted: formatPace(splitDurationSec),
                    avg_hr: hr,
                    elevation_gain_m: safeFloat(row.enhanced_altitude || row.altitude)
                });

                kmStartTime = timeSec;
                currentTargetKm++;
            }
        });

        const recordSummary = {
            total_samples: recordRows.length,
            max_power: maxPower,
            avg_power: powerSampleCount > 0 ? Math.round(totalPower / powerSampleCount) : 0,
            km_splits: kmSplits,
            route_data: routeData
        };

        // 4. Susun Payload Akhir
        const payload = {
            activity_date: parseGarminDate(session.start_time || session.timestamp),
            sport: session.sport || 'running',
            sub_sport: session.sub_sport || 'generic',
            total_distance_km: totalDistanceKm,
            total_duration_s: Number(totalDurationS.toFixed(2)),
            avg_pace_min_km: avgPaceFormatted,
            avg_heart_rate: safeInt(session.avg_heart_rate),
            max_heart_rate: safeInt(session.max_heart_rate),
            avg_cadence: safeInt(session.avg_cadence || session.avg_running_cadence),
            total_calories: safeInt(session.total_calories),
            total_ascent_m: Number(safeFloat(session.total_ascent).toFixed(2)),
            total_laps: safeInt(session.num_laps, lapsData.length),
            laps_data: lapsData,
            record_summary: recordSummary
        };

        Logger.sync('activities', 'SUCCESS');
        return payload;

    } catch (err) {
        Logger.error('csvAggregator.js', err);
        throw err;
    }
}
