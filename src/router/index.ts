import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Project from '@/views/Projects/Project.vue'
import CreateProject from '@/views/Projects/Create.vue'
import EditProject from '@/views/Projects/Edit.vue'
import EditTask from '@/views/Tasks/EditTask.vue'
import CreateTask from '@/views/Tasks/CreateTask.vue'
import Task from '@/views/Tasks/Task.vue'
import Dashboard from '@/views/Dashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {path: '', component: Home},
  {path: '/dashboard', component: Dashboard},
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  {path: '/projects', component: Project},
  {path: '/projects-create', component: CreateProject},
  {path: '/projects/:projectId/edit', component: EditProject },
  {path: '/tasks', component: Task},
  {path: '/tasks-create', component: CreateTask},
  {path: '/tasks/:taskId/edit', component: EditTask },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
