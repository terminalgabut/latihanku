export default `
    <div class="app-layout" :class="{ 'sidebar-open': isSidebarOpen }">
        <!-- Header Fixed Top -->
        <header-component @toggle-sidebar="toggleSidebar"></header-component>

        <!-- Sidebar Drawer -->
        <sidebar-component 
            :is-open="isSidebarOpen"
            @close-sidebar="toggleSidebar"
        ></sidebar-component>

        <!-- Main Viewport Area -->
        <div class="app-viewport">
            <main class="app-content">
                <div class="view-container">
                    <router-view></router-view>
                </div>
            </main>
        </div>
    </div>
`
  ;
