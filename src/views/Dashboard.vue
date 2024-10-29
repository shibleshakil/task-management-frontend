<template>
    <div class="row">
        <div class="col-xl-3 col-sm-6 col-12">
            <div class="card">
                <div class="card-content">
                    <div class="card-body">
                        <div class="text-center">
                            <h3><span v-if="isLoaded">{{ data.total_tasks }}</span><span v-else>Loading...</span></h3>
                            <span>Total Task</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12">
            <div class="card">
                <div class="card-content">
                    <div class="card-body">
                        <div class="text-center">
                            <h3><span v-if="isLoaded">{{ data.pending_tasks }}</span><span v-else>Loading...</span></h3>
                            <span>Pending Task</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12">
            <div class="card">
                <div class="card-content">
                    <div class="card-body">
                        <div class="text-center">
                            <h3><span v-if="isLoaded">{{ data.processing_tasks }}</span><span v-else>Loading...</span></h3>
                            <span>Processing Task</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12">
            <div class="card">
                <div class="card-content">
                    <div class="card-body">
                        <div class="text-center">
                            <h3><span v-if="isLoaded">{{ data.completed_tasks }}</span><span v-else>Loading...</span></h3>
                            <span>Completed Task</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-5">
        <h2>Upcoming Tasks</h2>
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
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="row mt-5">
        <h2>Tasks Overview</h2>
        <div class="col-md-12">
            <form @submit.prevent="submitFilter">
                <div class="row">
                    <div class="col-md-3">
                        <select v-model="data.project_id" name="project" id="project" class="form-control select">
                            <option value="" disabled>Select a project</option>
                            <option v-for="project in projects" :key="project.id" :value="project.id">
                            {{ project.title }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select v-model="data.priority" name="priority" id="priority" class="form-control select">
                            <option value="" disabled>Select priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select v-model="data.status" name="status" id="status" class="form-control select">
                            <option value="" disabled>Select status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-primary w-100" type="submit">Filter</button>
                    </div>
                </div>
            </form>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Sl</th>
                    <th scope="col">Project</th>
                    <th scope="col">Task Title</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Deadline</th>
                    <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(task, index) in filteredTasks" :key="task.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ task.project.title }}</td>
                    <td>{{ task.title }}</td>
                    <td>{{ task.priority }}</td>
                    <td>{{ task.deadline }}</td>
                    <td>{{ task.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';

 export default{
    name: 'Dashboard',
    

  setup() {
    const data = reactive({
      total_tasks: 0,
      completed_tasks: 0,
      pending_tasks: 0,
      processing_tasks: 0,
      project_id: '',
      priority: '',
      status: '',
    });


    const isLoaded = ref(false);
    const apiEndpoint = `${process.env.VUE_APP_API_URL}/get-tasks-statistics`;

    // Fetch task data when the component is mounted
    const fetchTaskSatistics = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error("Failed to fetch task data.");
            const task = await response.json();
                data.total_tasks = task.total_tasks ?? 0;
                data.completed_tasks = task.completed_tasks ?? 0;
                data.pending_tasks = task.pending_tasks ?? 0;
                data.processing_tasks = task.processing_tasks ?? 0;
                isLoaded.value = true;
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    
    const tasks = ref([]);

    const fetchTasks = async () => {
      try {
        const response = await fetch(process.env.VUE_APP_API_URL + '/get-upcoming-tasks', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        tasks.value = await response.json();
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const projects = ref([]) // Reactive array to store fetched projects

    const projectsEndpoint = process.env.VUE_APP_API_URL + '/projects'; // Define the projects API endpoint

    const fetchProjects = async () => {
        try {
            const response = await fetch(projectsEndpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                credentials: 'include',
            });
            projects.value = await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    
    const filteredTasks = ref([]);

    const submitFilter = async () => {
        try {
            // Construct query parameters from the data object
            const queryParams = new URLSearchParams({
            project_id: data.project_id,
            priority: data.priority,
            status: data.status
            }).toString();

            const response = await fetch(`${process.env.VUE_APP_API_URL}/tasks?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            credentials: 'include',
            });

            filteredTasks.value = await response.json();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    onMounted(() => {
      fetchTaskSatistics();
      fetchTasks();
      fetchProjects();
    });


    return {
      data,
      isLoaded,
      tasks,
      projects,
      submitFilter,
      filteredTasks,

    };
  },
};

</script>