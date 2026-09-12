// js/views/UploadView.js
import { Logger } from '../services/debug.js';

export default {
  name: 'UploadView',
  data() {
    return {
      files: {
        record: null,
        lap: null,
        session: null
      },
      isProcessing: false,
      isUploading: false,
      parsedResult: null,
      errorMessage: ''
    };
  },
  computed: {
    isReadyToProcess() {
      return this.files.record && this.files.lap && this.files.session;
    }
  },
  methods: {
    handleFileSelect(type, event) {
      const file = event.target.files[0];
      if (file) {
        this.files[type] = file;
        Logger.info(`UI: File ${type} terpilih: ${file.name}`);
      }
    },
    async triggerProcess() {
      if (!this.isReadyToProcess) return;
      this.isProcessing = true;
      this.errorMessage = '';
      
      try {
        // Panggilan ke parser csvAggregator.js akan ditempatkan di sini
        Logger.info('UI: Memulai pemrosesan 3 CSV...');
      } catch (err) {
        this.errorMessage = 'Gagal memproses file CSV: ' + err.message;
        Logger.error('UI Error:', err);
      } finally {
        this.isProcessing = false;
      }
    }
  },
  template: `
    <div class="p-4 max-w-2xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-white tracking-wide">Import Activity CSV</h1>
        <p class="text-xs text-slate-400">Pilih 3 file CSV dari dekoder Garmin Anda</p>
      </div>

      <!-- 3 Zone Upload Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <!-- Record Zone -->
        <label class="relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all"
               :class="files.record ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
          <i class="fa-solid fa-route text-2xl mb-2" :class="files.record ? 'text-cyan-400' : 'text-slate-500'"></i>
          <span class="text-xs font-semibold text-slate-200">Record CSV</span>
          <span class="text-[10px] text-slate-400 mt-1 truncate max-w-[120px]">
            {{ files.record ? files.record.name : 'Pilih File' }}
          </span>
          <input type="file" accept=".csv" class="hidden" @change="handleFileSelect('record', $event)" />
        </label>

        <!-- Lap Zone -->
        <label class="relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all"
               :class="files.lap ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
          <i class="fa-solid fa-flag-checkered text-2xl mb-2" :class="files.lap ? 'text-emerald-400' : 'text-slate-500'"></i>
          <span class="text-xs font-semibold text-slate-200">Lap CSV</span>
          <span class="text-[10px] text-slate-400 mt-1 truncate max-w-[120px]">
            {{ files.lap ? files.lap.name : 'Pilih File' }}
          </span>
          <input type="file" accept=".csv" class="hidden" @change="handleFileSelect('lap', $event)" />
        </label>

        <!-- Session Zone -->
        <label class="relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all"
               :class="files.session ? 'border-purple-500 bg-purple-950/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
          <i class="fa-solid fa-chart-pie text-2xl mb-2" :class="files.session ? 'text-purple-400' : 'text-slate-500'"></i>
          <span class="text-xs font-semibold text-slate-200">Session CSV</span>
          <span class="text-[10px] text-slate-400 mt-1 truncate max-w-[120px]">
            {{ files.session ? files.session.name : 'Pilih File' }}
          </span>
          <input type="file" accept=".csv" class="hidden" @change="handleFileSelect('session', $event)" />
        </label>

      </div>

      <!-- Action Button -->
      <button @click="triggerProcess"
              :disabled="!isReadyToProcess || isProcessing"
              class="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              :class="isReadyToProcess && !isProcessing 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 cursor-pointer' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'">
        <i v-if="isProcessing" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else class="fa-solid fa-bolt"></i>
        <span>{{ isProcessing ? 'Memproses Telemetri...' : 'Proses & Pratinjau' }}</span>
      </button>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="p-3 bg-red-950/50 border border-red-500/50 rounded-xl text-xs text-red-300">
        {{ errorMessage }}
      </div>

      <!-- Preview Section (Muncul setelah diproses) -->
      <div v-if="parsedResult" class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-4">
        <h3 class="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-2">Pratinjau Ringkasan (1 Baris)</h3>
        
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="bg-slate-900/60 p-2.5 rounded-lg">
            <span class="text-[10px] text-slate-400 block">TOTAL JARAK</span>
            <span class="text-lg font-bold text-cyan-400 tabular-nums">{{ parsedResult.total_distance_km }} KM</span>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg">
            <span class="text-[10px] text-slate-400 block">AVG PACE</span>
            <span class="text-lg font-bold text-emerald-400 tabular-nums">{{ parsedResult.avg_pace_min_km }}</span>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg">
            <span class="text-[10px] text-slate-400 block">AVG HR</span>
            <span class="text-lg font-bold text-rose-400 tabular-nums">{{ parsedResult.avg_heart_rate }} BPM</span>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg">
            <span class="text-[10px] text-slate-400 block">TOTAL SPLIT 1KM</span>
            <span class="text-lg font-bold text-purple-400 tabular-nums">{{ parsedResult.record_summary.km_splits.length }}</span>
          </div>
        </div>

        <button class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all">
          Kirim ke Supabase
        </button>
      </div>

    </di
v>
  `
};
