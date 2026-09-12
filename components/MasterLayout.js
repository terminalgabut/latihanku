// components/MasterLayout.js
import layoutView from './layoutView.js';
import Header from './header.js';
import Sidebar from './sidebarView.js';

export default {
    ...layoutView, // Menggabungkan template dari layoutView.js
    components: {
        'header-component': Header,
        'sidebar-component': Sidebar
    },
    setup() {
        const { ref, watch, nextTick, onMounted } = Vue;
        const isSidebarOpen = ref(false);

        // Helper untuk render ikon Lucide jika tersedia
        const refreshIcons = () => {
            nextTick(() => {
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
            });
        };

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value;
            // Kunci scroll pada body HP Android jika sidebar terbuka
            document.body.style.overflow = isSidebarOpen.value ? 'hidden' : '';
        };

        return {
            isSidebarOpen,
            toggleSidebar,
            refreshIcons
        };
    },
    watch: {
        // Tutup sidebar mobile otomatis & re-initialize ikon Lucide saat pindah halaman
        '$route'() {
            this.isSidebarOpen = false;
            document.body.style.overflow = '';
            
            if (this.$log) this.$log.info('Route changed, refreshing Lucide icons...');
            this.refreshIcons();
        }
    },
    mounted() {
        if (this.$log) this.$log.info('Master Layout Mounted');
        this.refreshIcons();
    }

};
