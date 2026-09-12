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
