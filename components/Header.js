export default {
    name: 'HeaderComponent',
    emits: ['toggle-sidebar'],
    template: `
        <header class="app-header">
            <div class="header-container">
                <button 
                    type="button"
                    class="btn-icon sidebar-toggle" 
                    @click="$emit('toggle-sidebar')" 
                    title="Buka Menu"
                >
                    <i class="fa-solid fa-bars"></i>
                </button>

                <router-link to="/" class="header-brand">
                    <i class="fa-solid fa-bolt text-cyan"></i>
                    <span>Garmin CSV Hub</span>
                </router-link>
                
                <div class="header-actions">
                    <button type="button" class="btn-icon" title="Status">
                        <i class="fa-solid fa-circle-check text-green"></i>
                    </button>
                </div>
            </div>
        </header>
    `
};
