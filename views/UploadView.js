export default {
    name: 'UploadView',
    template: `
        <div class="upload-page max-w-3xl mx-auto py-6">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <i class="fa-solid fa-cloud-arrow-up text-cyan"></i>
                    Import CSV Garmin
                </h1>
                <p class="text-slate-400 text-sm mt-1">Unggah berkas CSV aktivitas Garmin kamu untuk dianalisis.</p>
            </div>

            <!-- Drop Zone Area -->
            <div 
                class="border-2 border-dashed rounded-xl p-8 text-center transition-all bg-slate-900/40"
                :class="{
                    'border-cyan bg-cyan/5': isDragging,
                    'border-slate-700 hover:border-slate-500': !isDragging
                }"
                @dragover.prevent="onDragOver"
                @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop"
            >
                <div class="flex flex-col items-center justify-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan text-xl mb-1">
                        <i class="fa-solid fa-file-csv"></i>
                    </div>

                    <div v-if="!selectedFile">
                        <p class="text-slate-200 font-medium">Tarik & lepas file CSV di sini</p>
                        <p class="text-slate-500 text-xs mt-1">atau pilih berkas dari komputer kamu</p>
                        
                        <label class="inline-block mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg cursor-pointer border border-slate-700 transition-colors">
                            Pilih Berkas
                            <input type="file" accept=".csv" class="hidden" @change="onFileSelect" />
                        </label>
                    </div>

                    <div v-else class="flex flex-col items-center">
                        <p class="text-cyan font-semibold text-sm">{{ selectedFile.name }}</p>
                        <p class="text-slate-500 text-xs mt-0.5">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
                        
                        <div class="flex gap-2 mt-4">
                            <button 
                                @click="handleUpload" 
                                :disabled="isLoading"
                                class="px-5 py-2 bg-cyan text-slate-950 font-bold text-sm rounded-lg hover:bg-cyan/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
                            >
                                <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
                                <span>{{ isLoading ? 'Memproses...' : 'Mulai Upload' }}</span>
                            </button>
                            <button 
                                @click="selectedFile = null" 
                                :disabled="isLoading"
                                class="px-3 py-2 bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feedback Message -->
            <div 
                v-if="statusMessage" 
                class="mt-4 p-4 rounded-lg text-sm flex items-center gap-3 border"
                :class="{
                    'bg-emerald-950/40 border-emerald-800/50 text-emerald-400': uploadStatus === 'success',
                    'bg-rose-950/40 border-rose-800/50 text-rose-400': uploadStatus === 'error'
                }"
            >
                <i :class="uploadStatus === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'"></i>
                <span>{{ statusMessage }}</span>
            </div>
        </div>
    `
};
