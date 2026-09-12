// views/upload.js
import uploadTemplate from './UploadView.js';
import { processGarminCSVs } from '../js/services/csvAggregator.js';
import { supabase } from '../js/services/supabase.js';
import { Logger } from '../js/services/debug.js';

export default {
    name: 'UploadView',
    template: uploadTemplate,
    setup() {
        const { ref, computed } = Vue;

        // State Reactive File CSV
        const files = ref({
            record: null,
            lap: null,
            session: null
        });

        // Element Refs Input File
        const recordInput = ref(null);
        const lapInput = ref(null);
        const sessionInput = ref(null);

        // State Loading & Preview
        const isProcessing = ref(false);
        const isSubmitting = ref(false);
        const payloadPreview = ref(null);

        // Computed: Validasi 3 file wajib diisi
        const isReadyToProcess = computed(() => {
            return files.value.record && files.value.lap && files.value.session;
        });

        // Trigger file picker dari JS
        const triggerFileSelect = (type) => {
            if (type === 'record' && recordInput.value) recordInput.value.click();
            if (type === 'lap' && lapInput.value) lapInput.value.click();
            if (type === 'session' && sessionInput.value) sessionInput.value.click();
        };

        // Handler Perubahan File Input
        const handleFileChange = (event, type) => {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                files.value[type] = selectedFile;
                payloadPreview.value = null; // Reset preview jika file diubah
                Logger.info(`File ${type} terpilih: ${selectedFile.name}`, 'UPLOAD');
            }
        };

        // Handler Olah 3 CSV via csvAggregator.js
        const processFiles = async () => {
            if (!isReadyToProcess.value) return;

            isProcessing.value = true;
            try {
                const payload = await processGarminCSVs(files.value);
                payloadPreview.value = payload;
                Logger.info('Agregasi 3 CSV berhasil!', 'UPLOAD');
            } catch (err) {
                Logger.error('UploadView - Gagal memproses CSV', err);
                alert(`Gagal memproses file CSV: ${err.message}`);
            } finally {
                isProcessing.value = false;
            }
        };

        // Handler Kirim Payload ke Supabase
        const submitToSupabase = async () => {
            if (!payloadPreview.value) return;

            isSubmitting.value = true;
            try {
                const { data, error } = await supabase
                    .from('activities')
                    .insert([payloadPreview.value])
                    .select();

                if (error) throw error;

                Logger.info('Data berhasil disimpan ke Supabase!', 'SUPABASE');
                alert('Aktivitas lari berhasil disimpan!');
                
                // Reset State setelah berhasil
                files.value = { record: null, lap: null, session: null };
                payloadPreview.value = null;

            } catch (err) {
                Logger.error('UploadView - Gagal simpan ke Supabase', err);
                alert(`Gagal menyimpan ke Supabase: ${err.message}`);
            } finally {
                isSubmitting.value = false;
            }
        };

        return {
            files,
            recordInput,
            lapInput,
            sessionInput,
            isProcessing,
            isSubmitting,
            payloadPreview,
            isReadyToProcess,
            triggerFileSelect,
            handleFileChange,
            processFiles,
            submitToSupabase
        };
    }
};
