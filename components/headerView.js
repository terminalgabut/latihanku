// js/components/headerView.js

export default {
  name: 'HeaderView',
  template: `
    <header class="app-header">
      <div class="header-brand">
        <!-- Button Toggle Menu (Hanya Tampil di Mobile Android) -->
        <button 
          @click="$emit('toggle-sidebar')" 
          class="btn-menu-toggle" 
          title="Buka Menu Navigasi"
          aria-label="Toggle Sidebar"
        >
          <i data-lucide="menu"></i>
        </button>

        <!-- Logo / Title Application -->
        <router-link to="/" class="header-title" style="text-decoration: none;">
          <i data-lucide="activity" class="text-cyan"></i>
          <span>GARMIN<span class="brand-accent">HUB</span></span>
        </router-link>
      </div>

      <!-- Right Action Bar -->
      <div class="header-nav">
        <router-link to="/upload" class="btn-menu-toggle" title="Upload CSV">
          <i data-lucide="upload-cloud"></i>
        </router-link>
      </div>
    </header>
  `

};
