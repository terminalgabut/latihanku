// components/headerView.js

export default `
    <header class="app-header">
        <div class="header-container">
            <!-- Sidebar Toggle Button (Mobile) -->
            <button 
                type="button"
                class="btn-icon sidebar-toggle" 
                @click="$emit('toggle-sidebar')" 
                title="Buka Menu"
            >
                <i class="fa-solid fa-bars"></i>
            </button>

            <!-- Brand / Logo -->
            <router-link to="/" class="header-brand">
                <i class="fa-solid fa-bolt text-cyan"></i>
                <span>Garmin CSV Hub</span>
            </router-link>
            
            <!-- Navigation Action Right -->
            <div class="header-actions">
                <router-link to="/settings" class="btn-icon" title="Pengaturan">
                    <i class="fa-solid fa-gear"></i>
                </router-link>
                <router-link to="/profil" class="btn-icon" title="Profil">
                    <i class="fa-solid fa-circle-user"></i>
                </router-link>
            </div>
        </div>
    </header>
`
  ;
