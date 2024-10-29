<template>
  <Navbar />
  <main class="container my-3" v-if="!auth">
    <router-view/>
    
    <p class="mt-5 mb-3 text-body-secondary">&copy; Task Management</p>
  </main>
</template>
<script>
  import Navbar from './components/Navbar.vue';

import { onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  components:{
      Navbar,
      
    },
  name: 'App',
  setup() {
    const store = useStore();

    // On app load, check if user is authenticated
    onMounted(async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/user`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          store.dispatch('setAuth', true);
        } else {
          store.dispatch('setAuth', false);
        }
      } catch {
        store.dispatch('setAuth', false);
      }
    });
  },
};
</script>


<style>
html,
body {
  height: 100%;
}

.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}


.select {
	background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);
	background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
	background-size: 5px 5px, 5px 5px, 0px 1.5em;
	background-repeat: no-repeat;
}

.select:focus {
	background-image:
		linear-gradient(45deg, green 50%, transparent 50%),
		linear-gradient(135deg, transparent 50%, green 50%),
		linear-gradient(to right, #ccc, #ccc);
	background-position:
		calc(100% - 15px) 1em,
		calc(100% - 20px) 1em,
		calc(100% - 2.5em) 0.5em;
	background-size:
		5px 5px,
		5px 5px,
		0px 1.5em;
	background-repeat: no-repeat;
	border-color: #000;
	outline: 0;
}

.link-btn{
  background-color: #0d6efd;
  border: #0d6efd;
  color: #fff;
  border-radius: 0.25rem;
  padding: 5px 10px;
  text-decoration: none;
}
</style>