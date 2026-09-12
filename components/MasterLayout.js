import layoutTemplate from './layoutView.js';
import Header from './header.js';
import Sidebar from './sidebarView.js';

export default {
    name: 'MasterLayout',
    template: layoutTemplate, // Langsung pasang string template di sini
    components: {
        'header-component': Header,
        'sidebar-component': Sidebar
    },
    setup() {
        const { ref, nextTick } = Vue;
        const isSidebarOpen = ref(false);

        const refreshIcons = () => {
            nextTick(() => {
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
            });
        };

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value;
            if (isSidebarOpen.value) {
                document.body.classList.add('sidebar-open');
                document.body.style.overflow = 'hidden';
            } else {
                document.body.classList.remove('sidebar-open');
                document.body.style.overflow = '';
            }
        };

        return {
            isSidebarOpen,
            toggleSidebar,
            refreshIcons
        };
    },
    watch: {
        '$route'() {
            this.isSidebarOpen = false;
            document.body.classList.remove('sidebar-open');
            document.body.style.overflow = '';
            this.refreshIcons();
        }
    },
    mounted() {
        this.refreshIcons();
    }
    
};
