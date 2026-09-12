// js/router.js
import { Logger } from './services/debug.js';

// Load Komponen Utama (Fokus Sesi Ini)
import UploadView from '../views/upload.js';

/* --- FITUR MENDATANG (LAZY LOAD) ---
const Dashboard = () => import('./views/dashboard.js');
const AdvancedAnalytics = () => import('./views/advancedAnalytics.js');
const Activities = () => import('./views/activities.js');
const Analysis = () => import('./views/AnalysisView.js');
const ActivityDetail = () => import('./views/activityDetail.js'); 
const WeightTrainingDetail = () => import('./views/WeightTrainingDetail.js');
const TrainingLog = () => import('./views/TrainingLogView.js');
const Settings = () => import('./views/settings.js');
const Coach = () => import('./views/coach.js');
const Sleep = () => import('./views/sleep.js');
const Movement = () => import('./views/MovementEngine.js');
const Tobacco = () => import('./views/TobaccoEngine.js');
*/

const routes = [
    { 
        path: '/', 
        name: 'uploadview',
        component: UploadView,
        meta: { title: 'Import Activity CSV' }
    },
    { 
        path: '/upload', 
        redirect: '/' 
    },
    
    /* --- FITUR MENDATANG ---
    { 
        path: '/dashboard', 
        name: 'dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard Training [Fitur Mendatang]' }
    },
    { 
        path: '/activities', 
        name: 'activities',
        component: Activities,
        meta: { title: 'Daftar Aktivitas [Fitur Mendatang]' }
    },
    { 
        path: '/activity/:id', 
        name: 'activity-detail',
        component: ActivityDetail,
        props: true 
    }, 
    { 
        path: '/performance-settings', 
        name: 'settings',
        component: Settings,
        meta: { title: 'Pengaturan Zona [Fitur Mendatang]' }
    },
    */

    // Wildcard Fallback: Redirect ke Beranda Upload jika rute tidak ditemukan
    { 
        path: '/:pathMatch(.*)*', 
        redirect: '/' 
    }
];

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

// Navigation Guard untuk Debugging & Reset State Mobile UI
router.beforeEach((to, from, next) => {
    Logger.info(`Router: Navigating from ${from.path} to ${to.path}`);
    
    // Hapus kelas overlay mobile jika ada
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = '';

    // Update Title Browser
    if (to.meta && to.meta.title) {
        document.title = `${to.meta.title} - Garmin Hub`;
    } else {
        document.title = 'Garmin CSV Hub';
    }
    
    next();
});

router.afterEach((to) => {
    window.scrollTo(0, 0);
    Logger.info(`Router: Successfully loaded route [${String(to.name)}]
`);
});
