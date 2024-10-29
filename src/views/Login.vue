<template>
  <div class="form-signin w-100 m-auto">
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input v-model="data.email" type="email" class="form-control" name="email" id="email" placeholder="name@example.com" required>
        <label for="email">Email address</label>
        <!-- Display validation error for email -->
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
      </div>

      <div class="form-floating">
        <input v-model="data.password" type="password" class="form-control" name="password" id="password" placeholder="Password" required>
        <label for="password">Password</label>
        <!-- Display validation error for password -->
        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
      </div>

      <!-- Display generic or server error message -->
      <div v-if="errors.server" class="text-danger">{{ errors.server }}</div>

      <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
  </div>
</template>

<script lang="ts">

import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Login",

  setup() {
    const data = reactive({
      email: '',
      password: ''
    });

    const errors = reactive<any>({
      email: null,
      password: null,
    });

    const router = useRouter();
    const apiEndpoint = process.env.VUE_APP_API_URL + '/login';

    const submit = async () => {
        Object.keys(errors).forEach(key => errors[key] = null);

        try {
            const response = await fetch(apiEndpoint, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify(data)
            });        

            if (!response.ok) {
              const errorData = await response.json();

              if (response.status === 422) {
                  // Laravel validation errors (status 422)
                  errors.name = errorData.errors?.name?.[0] || null;
                  errors.email = errorData.errors?.email?.[0] || null;
                  errors.password = errorData.errors?.password?.[0] || null;
              } else {
                  errors.server = errorData.message || `Error: ${response.statusText}`;
              }

              return; // Stop further execution if there are errors
            }

            await router.push('/');
        } catch (error) {
            console.error('Error during Login:', error);
            errors.server = 'A network error occurred. Please try again later.';
        }
    };

    return {
      data,
      errors,
      submit,
    };
  }
};
</script>
