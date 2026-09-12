// js/app.js
import { router } from './router.js';
import MasterLayout from '../components/MasterLayout.js';
import { Logger } from './services/debug.js';

const app = Vue.createApp({
    components: { 
        'layout-wrapper': MasterLayout 
    },
    template: `<layout-wrapper />`
});

// Global Error Handler untuk log di browser mobile
app.config.errorHandler = (err, instance, info) => {
    Logger.error(`Vue Global Error [${info}]:`, err);
    console.error('Vue Error:', err);
};

app.use(router);

try {
    app.mount('#app');
    Logger.info('App: Mounted successfully to #app');
} catch (err) {
    console.error('Critical Mount Error:', err);
    if (Logger) Logger.error('Critical Mount Error:', err)
;
}
