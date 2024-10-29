<template>
    <h2 class="text-center">{{ message }}</h2>
</template>
  
  <script lang="ts">
  import {onMounted, ref} from 'vue';
  import {useStore} from "vuex";
  
  export default {
    name: "Home",
    setup() {
        const message = ref('Welcome to Task Management !');
        const store = useStore();
  
        onMounted(async () => {
            try {
                const apiEndpoint = process.env.VUE_APP_API_URL + '/user';

                const response = await fetch(apiEndpoint, {
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include'
                });
        
                const content = await response.json();
        
                message.value = `Hi ${content.name}`;
        
                await store.dispatch('setAuth', true);
            } catch (e) {
                await store.dispatch('setAuth', false);
            }
        });
  
        return {
            message
        }
    }
  }
  </script>