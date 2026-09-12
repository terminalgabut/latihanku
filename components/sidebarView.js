// js/components/sidebarView.js

export default {
  name: 'SidebarView',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <aside class="app-sidebar" :class="{ 'is-open': isOpen }">
      
      <!-- Brand Logo / Header Sidebar -->
      <div style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 28px; height: 28px; background-color: var(--accent-cyan); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: #000;">
            <i data-lucide="zap" style="width: 16px; height: 16px;"></i>
          </div>
          <span style="font-weight: 800; font-size: 0.95rem; letter-spacing: -0.02em; color: var(--text-primary);">
            RUN<span style="color: var(--accent-cyan);">HUB</span>
          </span>
        </div>

        <!-- Tombol Tutup Mobile -->
        <button 
          @click="$emit('close-sidebar')" 
          class="btn-menu-toggle" 
          style="width: 28px; height: 28px;"
          aria-label="Tutup Sidebar"
        >
          <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>
      </div>

      <!-- Navigasi Menu Ringkas -->
      <nav class="sidebar-nav" style="flex: 1;">
        <span class="metric-label" style="padding: 0.5rem 0.75rem 0.25rem 0.75rem; font-size: 0.625rem;">Navigasi Utama</span>
        
        <router-link to="/" class="nav-item" exact-active-class="is-active">
          <i data-lucide="layout-grid"></i>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/upload" class="nav-item" exact-active-class="is-active">
          <i data-lucide="upload-cloud"></i>
          <span>Import CSV</span>
        </router-link>

        <router-link to="/activities" class="nav-item" exact-active-class="is-active">
          <i data-lucide="activity"></i>
          <span>Aktivitas</span>
        </router-link>
      </nav>

      <!-- Footer Info Status Sync -->
      <div style="padding: 1rem; border-top: 1px solid var(--border-color); background-color: var(--bg-main);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
          <span class="metric-label" style="font-size: 0.625rem;">Supabase Sync</span>
          <span style="width: 8px; height: 8px; background-color: var(--accent-green); border-radius: 50%;"></span>
        </div>
        <p style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); margin: 0;">Connected</p>
      </div>

    </aside>

`
};
