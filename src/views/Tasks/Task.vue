<template>
  <div class="py-12">
    <div class="d-flex justify-content-end">
      <router-link to="/tasks-create" class="link-btn">New Task</router-link>
    </div>

    <div class="row">
      <div class="col-md-12">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Sl</th>
              <th scope="col">Project</th>
              <th scope="col">Task Title</th>
              <th scope="col">Priority</th>
              <th scope="col">Deadline</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, index) in tasks" :key="task.id">
              <td>{{ index + 1 }}</td>
              <td>{{ task.project.title }}</td>
              <td>{{ task.title }}</td>
              <td>{{ task.priority }}</td>
              <td>{{ task.deadline }}</td>
              <td>{{ task.status }}</td>
              <td>
                <!-- Edit button (always enabled) -->
                <router-link :to="`/tasks/${task.id}/edit`" class="btn btn-secondary btn-sm me-1">
                  Edit
                </router-link>

                <!-- Start button -->
                <button
                  class="btn btn-success btn-sm me-1"
                  @click="startTask(task.id)"
                  :disabled="loadingStart[task.id]"
                >
                  <span v-if="loadingStart[task.id]">Starting...</span>
                  <span v-else>Start</span>
                </button>

                <!-- Complete button -->
                <button
                  class="btn btn-primary btn-sm me-1"
                  @click="completeTask(task.id)"
                  :disabled="loadingComplete[task.id]"
                >
                  <span v-if="loadingComplete[task.id]">Completing...</span>
                  <span v-else>Complete</span>
                </button>

                <!-- Delete button -->
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteTask(task.id)"
                  :disabled="loadingDelete[task.id]"
                >
                  <span v-if="loadingDelete[task.id]">Deleting...</span>
                  <span v-else>Delete</span>
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
  name: 'Task',
  setup() {
    const tasks = ref([]);
    const loadingStart = ref({});
    const loadingComplete = ref({});
    const loadingDelete = ref({});

    const fetchTasks = async () => {
      try {
        const response = await fetch(process.env.VUE_APP_API_URL + '/tasks', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        tasks.value = await response.json();
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const startTask = async (taskId) => {
      if (confirm('Are you sure you want to start this task?')) {
        loadingStart.value[taskId] = true;
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/tasks/${taskId}/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });
          if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message);
            return;
          }
          alert('Task started successfully.');
          fetchTasks();
        } catch (error) {
          console.error('Error starting task:', error);
          alert('Failed to start task. Please try again.');
        } finally {
          loadingStart.value[taskId] = false;
        }
      }
    };

    const completeTask = async (taskId) => {
      if (confirm('Are you sure you want to complete this task?')) {
        loadingComplete.value[taskId] = true;
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/tasks/${taskId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });
          if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message);
            return;
          }
          alert('Task completed successfully.');
          fetchTasks();
        } catch (error) {
          console.error('Error completing task:', error);
          alert('Failed to complete task. Please try again.');
        } finally {
          loadingComplete.value[taskId] = false;
        }
      }
    };

    const deleteTask = async (taskId) => {
      if (confirm('Are you sure you want to delete this task?')) {
        loadingDelete.value[taskId] = true;
        try {
          await fetch(`${process.env.VUE_APP_API_URL}/tasks/${taskId}/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });
          alert('Task deleted successfully.');
          fetchTasks();
        } catch (error) {
          console.error('Error deleting task:', error);
          alert('Failed to delete task. Please try again.');
        } finally {
          loadingDelete.value[taskId] = false;
        }
      }
    };

    onMounted(fetchTasks);

    return {
      tasks,
      loadingStart,
      loadingComplete,
      loadingDelete,
      startTask,
      completeTask,
      deleteTask
    };
  }
};
</script>
