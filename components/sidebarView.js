// components/sidebarView.js

export default `
    <aside class="app-sidebar">
        <div class="sidebar-container">
            <!-- Brand Logo -->
            <div class="sidebar-logo">
                <div class="brand-box">
                    <i class="fa-solid fa-bolt text-cyan"></i>
                </div>
                <span class="brand-title">GARMIN<span class="text-cyan">HUB</span></span>
            </div>

            <!-- Navigation Links -->
            <nav class="sidebar-nav">
                <div class="sidebar-section-title">Main Menu</div>
                
                <router-link to="/" class="sidebar-item" active-class="is-active" exact>
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>Import CSV</span>
                </router-link>

                <router-link to="/dashboard" class="sidebar-item" active-class="is-active">
                    <i class="fa-solid fa-chart-simple"></i>
                    <span>Dashboard</span>
                </router-link>

                <router-link to="/activities" class="sidebar-item" active-class="is-active">
                    <i class="fa-solid fa-person-running"></i>
                    <span>Activities</span>
                </router-link>

                <router-link to="/advanced-analytics" class="sidebar-item" active-class="is-active">
                    <i class="fa-solid fa-chart-line text-green"></i>
                    <span>Adv Analytics</span>
                </router-link>

                <router-link to="/coach" class="sidebar-item" active-class="is-active">
                    <i class="fa-solid fa-wand-magic-sparkles text-cyan"></i>
                    <span>AI Coach</span>
                </router-link>

                <router-link to="/training-log" class="sidebar-item" active-class="is-active">
                    <i class="fa-solid fa-calendar-days"></i>
                    <span>Training Log</span>
                </router-link>

                <router-link to="/performance-settings" class="sidebar-item" active-class="is-active">
                    <i class="fa-solid fa-sliders"></i>
                    <span>Settings</span>
                </router-link>
            </nav>

            <!-- Status Box / Footer Sidebar -->
            <div class="sidebar-footer">
                <div class="status-card">
                    <div class="status-header">
                        <span class="status-label">Supabase Sync</span>
                        <span class="status-dot"></span>
                    </div>
                    <div class="status-value">Ready & Connected</div>
                </div>
            </div>
        </div>
    </aside>
`;
