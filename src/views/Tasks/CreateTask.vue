<template>
  <div class="row">
    <div class="col-md-12">
      <form @submit.prevent="submit">
        <div class="form-body mb-3">
          <h1 class="h3 mb-3 fw-normal">Create a new task</h1>
          <div v-if="errors.server" class="text-danger">{{ errors.server }}</div>

          <div class="row">
            <!-- Project Dropdown -->
            <div class="col-md-6 form-group">
              <label for="project">Select Project</label>
              <select v-model="data.project_id" name="project" id="project" class="form-control select" required>
                <option value="" disabled>Select a project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.title }}
                </option>
              </select>
              <div v-if="errors.project_id" class="text-danger">{{ errors.project_id }}</div>
            </div>

            <!-- Task Title Input -->
            <div class="col-md-6 form-group">
              <label for="title">Task Title</label>
              <input v-model="data.title" type="text" class="form-control" name="title" id="title" placeholder="First task" required>
              <div v-if="errors.title" class="text-danger">{{ errors.title }}</div>
            </div>

            <!-- Task Priority Dropdown -->
            <div class="col-md-6 form-group">
              <label for="priority">Task Priority</label>
              <select v-model="data.priority" name="priority" id="priority" class="form-control select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div v-if="errors.priority" class="text-danger">{{ errors.priority }}</div>
            </div>

            <!-- Task Deadline Input -->
            <div class="col-md-6 form-group">
              <label for="deadline">Task Deadline</label>
              <input v-model="data.deadline" type="date" class="form-control" name="deadline" id="deadline" placeholder="deadline">
              <div v-if="errors.deadline" class="text-danger">{{ errors.deadline }}</div>
            </div>
            
            <!-- Task Description -->
            <div class="col-md-6 form-group">
              <label for="description">Task Description</label>
              <textarea v-model="data.description" rows="4" class="form-control" name="description" id="description" placeholder="Description"></textarea>
              <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
            </div>
          </div>

        </div>
        <button class="btn btn-primary w-100 py-2" :disabled="loading" type="submit">
          <span v-if="loading">Submitting...</span>
          <span v-else>Submit</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "CreateTask",
  setup() {
    const data = reactive({
      title: '',
      description: '',
      priority: '',
      deadline: '',
      project_id: ''
    });

    const projects = reactive<any[]>([]);

    const errors = reactive<any>({
      title: null,
      description: null,
      priority: null,
      deadline: null,
      project_id: null,
      server: null,
    });

    const router = useRouter();
    const apiEndpoint = process.env.VUE_APP_API_URL + '/tasks/store';
    const projectsEndpoint = process.env.VUE_APP_API_URL + '/projects';

    const loading = ref(false);

    const fetchProjects = async () => {
      try {
        const response = await fetch(projectsEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          credentials: 'include',
        });
        projects.splice(0, projects.length, ...(await response.json()));
      } catch (error) {
        console.error('Error fetching projects:', error);
        errors.server = 'A network error occurred while fetching projects. Please try again later.';
      }
    };

    onMounted(fetchProjects);

    const submit = async () => {
      Object.keys(errors).forEach(key => errors[key] = null);
      loading.value = true;

      try {
        const response = await fetch(apiEndpoint, {
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
            errors.priority = errorData.errors?.priority?.[0] || null;
            errors.deadline = errorData.errors?.deadline?.[0] || null;
            errors.project_id = errorData.errors?.project_id?.[0] || null;
          } else {
            errors.server = errorData.message || `Error: ${response.statusText}`;
          }
          loading.value = false;
          return;
        }

        data.title = '';
        data.description = '';
        data.priority = '';
        data.deadline = '';
        data.project_id = '';

        alert("New Task Created Successfully");
        router.push('/tasks');

      } catch (error) {
        console.error('Error during create task:', error);
        errors.server = 'A network error occurred. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    return {
      data,
      errors,
      projects,
      submit,
      loading,
    };
  }
};
</script>
