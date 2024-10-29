import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Create the Vue app
const app = createApp(App);

// Global navigation guard to check authentication state
router.beforeEach(async (to, from, next) => {
  try {
    const response = await fetch(`${process.env.VUE_APP_API_URL}/user`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      const userData = await response.json();
      store.dispatch('setAuth', true); // Set authenticated state to true
    } else {
      store.dispatch('setAuth', false); // Set authenticated state to false
            
    }
  } catch {
    store.dispatch('setAuth', false);
  }
  
  next(); // Continue to the next route
});

// Use store and router
app.use(store).use(router).mount('#app');
