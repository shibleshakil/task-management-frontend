<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Task Management</router-link>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="!auth">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="!auth">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li class="nav-item" v-if="auth">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item" v-if="auth">
            <router-link class="nav-link" to="/projects">Projects</router-link>
          </li>
          <li class="nav-item" v-if="auth">
            <router-link class="nav-link" to="/tasks">Tasks</router-link>
          </li>
          <li class="nav-item" v-if="auth">
            <button class="nav-link btn" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();

    // Computed property to track authentication state from Vuex store
    const auth = computed(() => store.state.authenticated);

    // Logout function to clear state and redirect to login page
    const logout = async () => {
      await fetch(process.env.VUE_APP_API_URL + '/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });

      await router.push('/login');

    }

    return {
      auth,
      logout
    }
  },
};
</script>
