// views/uploadView.js
export default `
    <div class="upload-page max-w-3xl mx-auto py-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <i class="fa-solid fa-cloud-arrow-up text-cyan"></i>
                Import 3 File CSV Garmin
            </h1>
            <p class="text-slate-400 text-sm mt-1">Unggah file Record, Lap, dan Session untuk dianalisis.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- Record File Card -->
            <div class="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                    <span class="text-xs font-semibold text-cyan uppercase tracking-wider">1. Record CSV</span>
                    <p class="text-sm font-medium text-slate-200 mt-1 truncate">{{ files.record ? files.record.name : 'Belum dipilih' }}</p>
                </div>
                <button @click="triggerFileSelect('record')" class="mt-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                    {{ files.record ? 'Ganti File' : 'Pilih File' }}
                </button>
                <input type="file" ref="recordInput" class="hidden" @change="e => handleFileChange(e, 'record')" />

            </div>

            <!-- Lap File Card -->
            <div class="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                    <span class="text-xs font-semibold text-cyan uppercase tracking-wider">2. Lap CSV</span>
                    <p class="text-sm font-medium text-slate-200 mt-1 truncate">{{ files.lap ? files.lap.name : 'Belum dipilih' }}</p>
                </div>
                <button @click="triggerFileSelect('lap')" class="mt-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                    {{ files.lap ? 'Ganti File' : 'Pilih File' }}
                </button>
                
                <input type="file" ref="lapInput" class="hidden" @change="e => handleFileChange(e, 'lap')" />
            </div>

            <!-- Session File Card -->
            <div class="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                    <span class="text-xs font-semibold text-cyan uppercase tracking-wider">3. Session CSV</span>
                    <p class="text-sm font-medium text-slate-200 mt-1 truncate">{{ files.session ? files.session.name : 'Belum dipilih' }}</p>
                </div>
                <button @click="triggerFileSelect('session')" class="mt-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                    {{ files.session ? 'Ganti File' : 'Pilih File' }}
                </button>
                
                <input type="file" ref="sessionInput" class="hidden" @change="e => handleFileChange(e, 'session')" />

            </div>
        </div>

        <!-- Tombol Proses -->
        <div class="flex flex-col gap-3">
            <button 
                @click="processFiles" 
                :disabled="!isReadyToProcess || isProcessing"
                class="w-full py-3 bg-cyan text-slate-950 font-bold text-sm rounded-xl hover:bg-cyan/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan/10"
            >
                <i v-if="isProcessing" class="fa-solid fa-circle-notch fa-spin"></i>
                <span>{{ isProcessing ? 'Memproses Data CSV...' : 'Proses & Agregasi Data' }}</span>
            </button>
        </div>

        <!-- Preview & Tombol Kirim ke Supabase -->
        <div v-if="payloadPreview" class="mt-6 p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <h3 class="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-circle-check text-emerald-400"></i>
                Data Siap Disimpan ke Supabase
            </h3>
            <p class="text-xs text-slate-400 mb-4">Agregasi berhasil dilakukan. Silakan kirim data ke database.</p>
            <button 
                @click="submitToSupabase" 
                :disabled="isSubmitting"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
                <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin"></i>
                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan ke Supabase' }}</span>
            </button>
        </div>
    </div>
`;
