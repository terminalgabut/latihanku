// js/components/header.js
import headerView from './headerView.js';

export default {
    ...headerView,
    emits: ['toggle-sidebar'],
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
