// components/sidebar.js
import sidebarTemplate from './sidebarView.js';

export default {
    name: 'SidebarComponent',
    template: sidebarTemplate,
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close-sidebar']
}
    ;
