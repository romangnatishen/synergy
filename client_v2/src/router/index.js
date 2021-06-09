import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Kanban = () => import('@/views/Kanban')
const TasksList = () => import('@/views/TasksList')
const ProjectsList = () => import('@/views/ProjectsList')

// Views - Pages
const Login = () => import('@/views/pages/Login')

// Users
const UserList = () => import('@//views/UserList')
const UserForm = () => import('@//views/UserForm')

// Plugins
const Calendar = () => import('@//views/Calendar')

// Apps -> Invoice

// Apps -> Email

Vue.use(Router)

export default new Router(
  {
    mode: 'hash', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
  
    routes: 
    [
      {
        path: '/',
        redirect: '/login',
        name: 'LoginBasic',
        component: {render (c) { return c('router-view') }},
        children: [
          {
            path: 'login',
            name: 'Login',
            component: Login
          }
        ]
      },
      {
        path: '/dashboardbasic',
        redirect: '/dashboard',
        name: 'Home',
        component: TheContainer,
        children: 
        [
          {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard
          },     
        ]
      },
      {
        path: '/users',
        name: 'UsersBasic',
        component: TheContainer,
        children: 
        [
          {
            path: '/userslist',
            name: 'UsersList',
            component: UserList
          },          
          {
            path: '/userform',
            name: 'UserForm',
            component: UserForm
          },  
        ]
      },
      {
        path: '/plugins',
        name: 'Plugins',
        component: TheContainer,
        children: 
          [
            {
              path: '/kanban',
              name: 'Kanban',
              component: Kanban
            },
            {
              path: '/taskslist',
              name: 'TasksList',
              component: TasksList
            },
            {
              path: '/projectslist',
              name: 'ProjectsList',
              component: ProjectsList
            },
          ]  
      },
      {
        path: '/organizer',
        name: 'Organizer',
        component: TheContainer,
        children: 
          [
            {
              path: '/calendar',
              name: 'Calendar',
              component: Calendar
            },
          ]  
      },
    ]
  }
)

