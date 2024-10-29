<template>
    <div class="row">
      <div class="col-md-12">
        <form @submit.prevent="submit">
          <div class="form-body mb-3">

            <h1 class="h3 mb-3 fw-normal">Create a new Project</h1>
            <div v-if="errors.server" class="text-danger">{{ errors.server }}</div>

            <div class="row">
                <div class="col-md-6 form-group">
                    <label for="title">Project Title</label>
                    <input v-model="data.title" type="text" class="form-control" name="title" id="title" placeholder="First project" required>
                    <div v-if="errors.title" class="text-danger">{{ errors.title }}</div>
                </div>

                <div class="col-md-6 form-group">
                    <label for="description">Project description</label>
                    <textarea v-model="data.description" rows="4" class="form-control" name="description" id="description" placeholder="Description"></textarea>
                    <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
                </div>
            </div>

          </div>
          <button class="btn btn-primary w-100 py-2" type="submit">Submit</button>
        </form>
      </div>
    </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "CreateProject",

  setup() {
    const data = reactive({
      title: '',
      description: '',
      priority: '',
      deadline: '',
    });

    const errors = reactive<any>({
      title: null,
      description: null,
      priority: null,
      deadline: null,
      server: null,
    });

    const router = useRouter();
    const apiEndpoint = process.env.VUE_APP_API_URL + '/projects/store';

    const submit = async () => {
        Object.keys(errors).forEach(key => errors[key] = null);

        try {
            const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Access-Control-Allow-Origin': 'No'
            },
            credentials: 'include',
            body: JSON.stringify(data)
            });        

            if (!response.ok) {
            const errorData = await response.json();

            if (response.status === 422) {
                // validation errors (status 422)
                errors.title = errorData.errors?.title?.[0] || null;
                errors.description = errorData.errors?.description?.[0] || null;
                errors.priority = errorData.errors?.priority?.[0] || null;
                errors.deadline = errorData.errors?.deadline?.[0] || null;
            } else {
                errors.server = errorData.message || `Error: ${response.statusText}`;
            }

            return; // Stop further execution if there are errors
            }

            // Clear the form by reinitializing `data`
            data.title = '';
            data.description = '';
            data.priority = '';
            data.deadline = '';

            // Use a short timeout to ensure the form visually clears before alert
            setTimeout(() => {
                alert("New project Created Successfully");
                router.push('/projects');
            }, 0);

        } catch (error) {
            console.error('Error during create project:', error);
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
