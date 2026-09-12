// js/services/csvAggregator.js
import { Logger } from './debug.js';

/**
 * Parser CSV ringan tanpa eksternal library
 */
function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx] !== undefined ? values[idx] : null;
        });
        return row;
    });
}

/**
 * Helper untuk konversi detik per KM ke format MM:SS
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
        // 1. Baca isi ketiga file CSV secara paralel
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

        // 2. Ekstraksi Data Utama dari session.csv (Baris Pertama)
        const session = sessionRows[0];

        const totalDistMeters = parseFloat(session.total_distance || session.distance || 0);
        const totalDistanceKm = Number((totalDistMeters / 1000).toFixed(2));
        const totalDurationS = parseFloat(session.total_elapsed_time || session.total_timer_time || 0);
        
        // Kalkulasi Avg Pace (total_duration_s / total_distance_km)
        const avgPaceSecPerKm = totalDistanceKm > 0 ? (totalDurationS / totalDistanceKm) : 0;
        const avgPaceFormatted = formatPace(avgPaceSecPerKm);

        // 3. Ekstraksi laps_data dari lap.csv (Sesuai Spesifikasi Poin 2)
        const lapsData = lapRows.map((lap, index) => {
            return {
                lap_index: parseInt(lap.lap_index || index, 10),
                start_time: lap.start_time || null,
                end_time: lap.end_time || null,
                elapsed_time_s: parseFloat(lap.total_elapsed_time || lap.total_timer_time || 0),
                distance_m: parseFloat(lap.total_distance || 0),
                avg_speed_ms: parseFloat(lap.avg_speed || 0),
                max_speed_ms: parseFloat(lap.max_speed || 0),
                avg_heart_rate: parseInt(lap.avg_heart_rate || 0, 10),
                max_heart_rate: parseInt(lap.max_heart_rate || 0, 10),
                avg_cadence: parseInt(lap.avg_cadence || lap.avg_running_cadence || 0, 10),
                lap_trigger: lap.lap_trigger || 'manual'
            };
        });

        // 4. Ekstraksi record_summary dari record.csv (Sesuai Spesifikasi Poin 3)
        const routeData = [];
        const kmSplits = [];
        let currentTargetKm = 1;
        let kmStartTime = 0;
        let maxPower = 0;
        let totalPower = 0;
        let powerSampleCount = 0;

        recordRows.forEach((row, idx) => {
            const timeSec = parseFloat(row.timestamp_seconds || idx);
            const distMeters = parseFloat(row.distance || 0);
            const distKm = distMeters / 1000;
            const speedMs = parseFloat(row.enhanced_speed || row.speed || 0);
            const hr = parseInt(row.heart_rate || 0, 10);
            const lat = row.position_lat ? parseFloat(row.position_lat) : null;
            const lng = row.position_long ? parseFloat(row.position_long) : null;
            const power = parseInt(row.power || 0, 10);

            // Akumulasi Power
            if (power > 0) {
                if (power > maxPower) maxPower = power;
                totalPower += power;
                powerSampleCount++;
            }

            // Simpan Ringkasan Telemetri Rute (t, d, s, hr, lat, lng)
            routeData.push({
                t: timeSec,
                d: Number(distMeters.toFixed(2)),
                s: Number(speedMs.toFixed(2)),
                hr: hr,
                lat: lat,
                lng: lng
            });

            // Agregasi Split per 1 KM
            if (distKm >= currentTargetKm) {
                const splitDurationSec = timeSec - kmStartTime;
                const splitPaceSec = splitDurationSec; // Durasi untuk tepat 1 KM
                
                kmSplits.push({
                    km: currentTargetKm,
                    duration_seconds: Math.round(splitDurationSec),
                    pace_formatted: formatPace(splitPaceSec),
                    avg_hr: hr, // HR pada penanda KM
                    elevation_gain_m: parseFloat(row.altitude || 0)
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

        // 5. Susun Payload Baris Tunggal Tabel 'activities' (Sesuai Spesifikasi Poin 1)
        const payload = {
            activity_date: new Date(session.start_time || session.timestamp || new Date()).toISOString(),
            sport: session.sport || 'running',
            sub_sport: session.sub_sport || 'generic',
            total_distance_km: totalDistanceKm,
            total_duration_s: Number(totalDurationS.toFixed(2)),
            avg_pace_min_km: avgPaceFormatted,
            avg_heart_rate: parseInt(session.avg_heart_rate || 0, 10),
            max_heart_rate: parseInt(session.max_heart_rate || 0, 10),
            avg_cadence: parseInt(session.avg_cadence || session.avg_running_cadence || 0, 10),
            total_calories: parseInt(session.total_calories || 0, 10),
            total_ascent_m: Number(parseFloat(session.total_ascent || 0).toFixed(2)),
            total_laps: parseInt(session.num_laps || lapsData.length || 1, 10),
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
