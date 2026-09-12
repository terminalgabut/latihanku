// components/header.js
import headerTemplate from './headerView.js';

export default {
    name: 'HeaderComponent',
    template: headerTemplate,
    emits: ['toggle-sidebar']
}
    ;
