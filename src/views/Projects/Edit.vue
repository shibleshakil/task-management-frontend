<template>
    <div class="row">
      <div class="col-md-12">
        <form  v-if="isLoaded" @submit.prevent="submit">
          <div class="form-body mb-3">
            <h1 class="h3 mb-3 fw-normal">Edit Project</h1>
            <div v-if="errors.server" class="text-danger">{{ errors.server }}</div>
  
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="title">Project Title</label>
                <input v-model="data.title" type="text" class="form-control" name="title" id="title" placeholder="project title" required>
                <div v-if="errors.title" class="text-danger">{{ errors.title }}</div>
              </div>
  
              <div class="col-md-6 form-group">
                <label for="description">Project Description</label>
                <textarea v-model="data.description" rows="4" class="form-control" name="description" id="description" placeholder="Description"></textarea>
                <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
              </div>
            </div>
          </div>
          <button class="btn btn-primary w-100 py-2" type="submit">Update project</button>
        </form>
        <div v-else class="loading-spinner">Loading...</div> <!-- Simple loading state -->
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { reactive, ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  
  export default {
    name: "EditProject",
  
    setup() {
      const data = reactive({
        title: '',
        description: '',
      });
  
      const errors = reactive<any>({
        title: null,
        description: null,
        server: null,
      });
  
      const isLoaded = ref(false);
      const router = useRouter();
      const route = useRoute();
      const projectId = route.params.projectId;
      const apiEndpoint = `${process.env.VUE_APP_API_URL}/projects/${projectId}/edit`;
      const updateapiEndpoint = `${process.env.VUE_APP_API_URL}/projects/${projectId}/update`;
  
      // Fetch project data when the component is mounted
      const fetchproject = async () => {
        try {
          const response = await fetch(apiEndpoint, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          if (!response.ok) throw new Error("Failed to fetch project data.");
          const project = await response.json();
          data.title = project.title;
          data.description = project.description;
          isLoaded.value = true; // Mark as loaded after successful fetch
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };
  
      onMounted(fetchproject);
  
      const submit = async () => {
        Object.keys(errors).forEach(key => errors[key] = null);
  
        try {
          const response = await fetch(updateapiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
  
            if (response.status === 422) {
              errors.title = errorData.errors?.title?.[0] || null;
              errors.description = errorData.errors?.description?.[0] || null;
            } else {
              errors.server = errorData.message || `Error: ${response.statusText}`;
            }
            return;
          }
  
          alert("project updated successfully");
          router.push('/projects');
        } catch (error) {
          console.error("Error updating project:", error);
          errors.server = 'A network error occurred. Please try again later.';
        }
      };
  
      return {
        data,
        errors,
        isLoaded,
        submit,
      };
    },
  };
  </script>
  