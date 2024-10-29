<template>
    <div class="py-12">
      <div class="d-flex justify-content-end">
        <router-link to="/projects-create" class="link-btn">New Project</router-link>
      </div>
  
      <div class="row">
        <div class="col-md-12">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Sl</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, index) in projects" :key="project.id">
                <td>{{ index + 1 }}</td>
                <td>{{ project.title }}</td>
                <td>{{ project.description }}</td>
                <td>
                  <!-- Edit button -->
                  <router-link :to="`/projects/${project.id}/edit`" class="btn btn-secondary btn-sm me-1">
                    Edit
                  </router-link>
  
                  <!-- Delete button -->
                  <button class="btn btn-danger btn-sm" @click="deleteProject(project.id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'Project',
    setup() {
      const projects = ref([]);
  
      const fetchProjects = async () => {
        try {
          const response = await fetch(process.env.VUE_APP_API_URL + '/projects', {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });
          projects.value = await response.json();
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };

  
      const deleteProject = async (projectId) => {
        if (confirm('Are you sure you want to delete this project?')) {
          try {
            await fetch(`${process.env.VUE_APP_API_URL}/projects/${projectId}/delete`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
            });
            alert('Project deleted successfully.');
            fetchProjects(); // Refresh the project list
          } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
          }
        }
      };
  
      onMounted(fetchProjects);
  
      return {
        projects,
        deleteProject
      };
    }
  };
  </script>
  