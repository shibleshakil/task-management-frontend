<template>
  <div class="row">
    <div class="col-md-12">
      <form v-if="isLoaded" @submit.prevent="submit">
        <div class="form-body mb-3">
          <h1 class="h3 mb-3 fw-normal">Edit Task</h1>
          <div v-if="errors.server" class="text-danger">{{ errors.server }}</div>

          <div class="row">
            <!-- Project Selection -->
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
            
            <!-- Task Title -->
            <div class="col-md-6 form-group">
              <label for="title">Task Title</label>
              <input v-model="data.title" type="text" class="form-control" name="title" id="title" placeholder="Task title" required>
              <div v-if="errors.title" class="text-danger">{{ errors.title }}</div>
            </div>

            <!-- Task Priority -->
            <div class="col-md-6 form-group">
              <label for="priority">Task Priority</label>
              <select v-model="data.priority" name="priority" id="priority" class="form-control select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div v-if="errors.priority" class="text-danger">{{ errors.priority }}</div>
            </div>

            <!-- Task Status -->
            <div class="col-md-6 form-group">
              <label for="status">Task Status</label>
              <select v-model="data.status" name="status" id="status" class="form-control select">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
              <div v-if="errors.status" class="text-danger">{{ errors.status }}</div>
            </div>

            <!-- Task Deadline -->
            <div class="col-md-6 form-group">
              <label for="deadline">Task Deadline</label>
              <input v-model="data.deadline" type="date" class="form-control" name="deadline" id="deadline">
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
          <span v-else>Update Task</span>
        </button>
      </form>
      <div v-else class="loading-spinner">Loading...</div> <!-- Simple loading state -->
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "EditTask",

  setup() {
    const data = reactive({
      title: '',
      description: '',
      priority: '',
      status: '',
      deadline: '',
      project_id: '' // Include project ID
    });

    const projects = reactive<any[]>([]); // To store fetched projects
    const errors = reactive<any>({
      title: null,
      description: null,
      priority: null,
      status: null,
      deadline: null,
      project_id: null,
      server: null,
    });

    const isLoaded = ref(false);
    const loading = ref(false);


    const router = useRouter();
    const route = useRoute();

    const taskId = route.params.taskId;
    const apiEndpoint = `${process.env.VUE_APP_API_URL}/tasks/${taskId}/edit`;
    const updateApiEndpoint = `${process.env.VUE_APP_API_URL}/tasks/${taskId}/update`;
    const projectsEndpoint = `${process.env.VUE_APP_API_URL}/projects`; // API endpoint for projects

    // Fetch task data when the component is mounted
    const fetchTask = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch task data.");
        const task = await response.json();
        data.title = task.title;
        data.description = task.description;
        data.priority = task.priority;
        data.status = task.status;
        data.deadline = task.deadline;
        data.project_id = task.project_id; // Bind the project ID
        isLoaded.value = true;
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    // Fetch the list of projects
    const fetchProjects = async () => {
      try {
        const response = await fetch(projectsEndpoint, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch projects.");
        const fetchedProjects = await response.json();
        projects.splice(0, projects.length, ...fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    onMounted(() => {
      fetchTask();
      fetchProjects(); // Fetch projects on mount
    });

    const submit = async () => {
      Object.keys(errors).forEach(key => errors[key] = null);
      loading.value = true;

      try {
        const response = await fetch(updateApiEndpoint, {
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
            errors.status = errorData.errors?.status?.[0] || null;
            errors.deadline = errorData.errors?.deadline?.[0] || null;
            errors.project_id = errorData.errors?.project_id?.[0] || null;
          } else {
            errors.server = errorData.message || `Error: ${response.statusText}`;
          }
          loading.value = false;
          return;
        }

        alert("Task updated successfully");
        router.push('/tasks');
      } catch (error) {
        console.error("Error updating task:", error);
        errors.server = 'A network error occurred. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    return {
      data,
      errors,
      projects,
      isLoaded,
      submit,
      loading,
    };
  },
};
</script>
