// js/layouts/layoutView.js

export default {
  name: 'LayoutView',
  template: `
    <div id="app" class="app-layout">
        
        <!-- Header Sticky -->
        <header-component @toggle-sidebar="toggleSidebar"></header-component>

        <!-- App Container (Sidebar + Content) -->
        <div class="app-container">
            
            <!-- Mobile Overlay Slide-over -->
            <div 
                class="sidebar-overlay" 
                :class="{ 'is-active': isSidebarOpen }"
                @click="toggleSidebar"
            ></div>

            <!-- Sidebar Drawer -->
            <sidebar-component 
                :is-open="isSidebarOpen"
                @close-sidebar="toggleSidebar"
            ></sidebar-component>

            <!-- Main Content Area -->
            <main class="main-content">
                <div class="view-container">
                    <router-view></router-view>
                </div>
            </main>

        </div>
    </div>
  
`
};
