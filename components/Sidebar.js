export default {
    name: 'SidebarComponent',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close-sidebar'],
    template: `
        <aside class="app-sidebar">
            <div class="sidebar-container">
                <div class="sidebar-logo">
                    <div class="brand-box">
                        <i class="fa-solid fa-bolt text-cyan"></i>
                    </div>
                    <span class="brand-title">GARMIN<span class="text-cyan">HUB</span></span>
                </div>

                <nav class="sidebar-nav">
                    <div class="sidebar-section-title">Main Menu</div>
                    
                    <router-link to="/" class="sidebar-item" active-class="is-active" exact>
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <span>Import CSV</span>
                    </router-link>
                </nav>

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
    `
};
