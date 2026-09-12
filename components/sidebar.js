// js/components/sidebar.js
import sidebarView from './sidebarView.js';

export default {
    ...sidebarView,
    emits: ['close-sidebar'],
    mounted() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    },
    updated() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }
};
