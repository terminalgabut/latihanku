// views/UploadView.js
export default `
<div class="upload-view animate-in">
    <!-- Header Section -->
    <header class="upload-header">
        <h1>Unggah Telemetri Garmin</h1>
        <p>Pilih 3 file CSV mentah (record, lap, session) untuk diolah</p>
    </header>

    <!-- 3 Zone Upload Grid -->
    <div class="upload-grid">
        <!-- Zone Record -->
        <div 
            class="upload-zone-card" 
            :class="{ 'is-active--record': files.record }"
            @click="triggerFileSelect('record')"
        >
            <i class="fa-solid" :class="files.record ? 'fa-circle-check' : 'fa-file-csv'"></i>
            <span class="upload-zone-card__title">RECORD.CSV</span>
            <span class="upload-zone-card__filename">
                {{ files.record ? files.record.name : 'Pilih File' }}
            </span>
            <input 
                type="file" 
                ref="recordInput" 
                accept=".csv" 
                class="hidden" 
                @change="handleFileChange($event, 'record')"
            />
        </div>

        <!-- Zone Lap -->
        <div 
            class="upload-zone-card" 
            :class="{ 'is-active--lap': files.lap }"
            @click="triggerFileSelect('lap')"
        >
            <i class="fa-solid" :class="files.lap ? 'fa-circle-check' : 'fa-file-csv'"></i>
            <span class="upload-zone-card__title">LAP.CSV</span>
            <span class="upload-zone-card__filename">
                {{ files.lap ? files.lap.name : 'Pilih File' }}
            </span>
            <input 
                type="file" 
                ref="lapInput" 
                accept=".csv" 
                class="hidden" 
                @change="handleFileChange($event, 'lap')"
            />
        </div>

        <!-- Zone Session -->
        <div 
            class="upload-zone-card" 
            :class="{ 'is-active--session': files.session }"
            @click="triggerFileSelect('session')"
        >
            <i class="fa-solid" :class="files.session ? 'fa-circle-check' : 'fa-file-csv'"></i>
            <span class="upload-zone-card__title">SESSION.CSV</span>
            <span class="upload-zone-card__filename">
                {{ files.session ? files.session.name : 'Pilih File' }}
            </span>
            <input 
                type="file" 
                ref="sessionInput" 
                accept=".csv" 
                class="hidden" 
                @change="handleFileChange($event, 'session')"
            />
        </div>
    </div>

    <!-- Action Button -->
    <button 
        class="btn-process" 
        :disabled="!isReadyToProcess || isProcessing"
        @click="processFiles"
    >
        <i class="fa-solid" :class="isProcessing ? 'fa-spinner fa-spin' : 'fa-bolt'"></i>
        <span>{{ isProcessing ? 'Mengolah Data...' : 'Mulai Unggah & Olah Data' }}</span>
    </button>

    <!-- Preview Card Section (Tampil setelah kalkulasi selesai) -->
    <div v-if="payloadPreview" class="preview-card animate-in">
        <div class="preview-card__title">Ringkasan Sesi Lari (1 Baris Supabase)</div>
        
        <div class="preview-grid">
            <div class="preview-metric-box">
                <div class="text-xs text-muted">Jarak Total</div>
                <div class="text-lg font-bold text-cyan">{{ payloadPreview.total_distance_km }} KM</div>
            </div>
            <div class="preview-metric-box">
                <div class="text-xs text-muted">Pace Rata-rata</div>
                <div class="text-lg font-bold text-green">{{ payloadPreview.avg_pace_min_km }} /km</div>
            </div>
            <div class="preview-metric-box">
                <div class="text-xs text-muted">Heart Rate Rata-rata</div>
                <div class="text-lg font-bold text-primary">{{ payloadPreview.avg_heart_rate }} BPM</div>
            </div>
            <div class="preview-metric-box">
                <div class="text-xs text-muted">Total Elevasi</div>
                <div class="text-lg font-bold text-primary">{{ payloadPreview.total_ascent_m }} m</div>
            </div>
        </div>

        <button 
            class="btn-submit-supabase" 
            :disabled="isSubmitting"
            @click="submitToSupabase"
        >
            <i class="fa-solid" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'"></i>
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan ke Supabase' }}</span>
        </button>
    </div>
</di
v>
`;
