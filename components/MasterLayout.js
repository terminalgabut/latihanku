import Header from './Header.js';
import Sidebar from './Sidebar.js';

export default {
    name: 'MasterLayout',
    components: {
        'header-component': Header,
        'sidebar-component': Sidebar
    },
    setup() {
        const { ref } = Vue;
        const isSidebarOpen = ref(false);

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value;
            document.body.style.overflow = isSidebarOpen.value ? 'hidden' : '';
        };

        return {
            isSidebarOpen,
            toggleSidebar
        };
    },
    watch: {
        '$route'() {
            this.isSidebarOpen = false;
            document.body.style.overflow = '';
        }
    },
    template: `
        <div class="app-layout" :class="{ 'sidebar-open': isSidebarOpen }">
            <div 
                v-if="isSidebarOpen" 
                class="sidebar-overlay"
                @click="toggleSidebar"
            ></div>

            <sidebar-component :is-open="isSidebarOpen"></sidebar-component>

            <div class="app-viewport">
                <header-component @toggle-sidebar="toggleSidebar"></header-component>
                
                <main class="app-content">
                    <div class="view-container">
                        <router-view></router-view>
                    </div>
                </main>
            </div>
        </div>
   
    `
};
