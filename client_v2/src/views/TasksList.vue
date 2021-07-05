<template>
  <CCard>
    <CCardBody
      v-if="showCarusel === true"
      class="c-app flex-row align-items-center"
    >
      <div class="sk-grid">
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
        <div class="sk-grid-cube"></div>
      </div>
    </CCardBody>

    <CCardBody v-if="showCarusel === false">
      <TasksTable :dataArray="dataArray" :issue_statuses="issue_statuses" />
    </CCardBody>
  </CCard>
</template>

<script>
import moment from 'moment';
import sequrityCheck from '../plugins/sequrityCheck';
import TasksTable from '../components/TasksTable.vue';

export default {
  name: 'TasksList',
  components: {
    TasksTable,
  },
  data() {
    return {
      showCarusel: true,
      projectId: 0,
      issue_statuses: [],
      issue_executors: [],
      dataArray: [],
      collapseDuration: 0,
    };
  },

  async created() {
    sequrityCheck(this);
    this.showCarusel = true;
    await this.initialize()
      .then(() => {
        this.showCarusel = false;
      })
      .catch((err) => {
        console.log(err);
        this.showCarusel = false;
      });
  },

  methods: {
    async initialize() {
      if (this.$route.params) {
        this.projectId = this.$route.params.projectId;
      } else {
        const storeFilterProject =
          this.$store.getters['projects/getFilterProject'];
        if (storeFilterProject) {
          this.projectId = storeFilterProject;
          // console.log("got project id from store");
        }
      }

      const statusesDataObject = await this.$store.dispatch(
        'issues/findIssueStatuses',
        {}
      );
      if (statusesDataObject) {
        let statusesData = [];
        statusesDataObject.data.issue_statuses.forEach((el) => {
          statusesData.push({
            value: el.id,
            label: el.name,
          });
        });
        this.issue_statuses = statusesData;
      } else {
        this.issue_statuses = [];
      }

      const dataObject = await this.$store.dispatch('issues/findAll', {
        project_id: this.projectId,
        include: 'journals',
        status_id: 'open',
      });

      const params = {
        where: {
          project_id: this.projectId,
        },
      };
      const kanbanTasks = await this.$store.dispatch(
        'issues/getKanbanIssueByProject',
        params
      );

      if (dataObject) {
        let projectsData = [];
        dataObject.forEach((str) => {
          str.forEach((el) => {
            if (!el.estimated_hours) {
              el.estimated_hours = 0;
            }
            let assignedName = '';
            let assignedId = '';
            if (el.assigned_to) {
              assignedName = el.assigned_to['name'];
              assignedId = el.assigned_to['id'];
            }

            let statusName = '';
            let statusId = '';
            if (el.assigned_to) {
              statusName = el.status['name'];
              statusId = el.status['id'];
            }
            let trackerName = '';
            if (el.assigned_to) {
              trackerName = el.tracker['name'];
            }

            let moduleValue = '';
            if (el.custom_fields) {
              const moduleField = el.custom_fields.find(
                (arrItem) => arrItem.id === 12
              );
              if (moduleField) {
                moduleValue = moduleField.value;
              }
            }

            let resKanbanArray = [];
            const kanbanTasksArray = kanbanTasks.data;
            if (kanbanTasksArray) {
              const kanbanArray = kanbanTasksArray.filter(
                (arrItem) =>
                  arrItem.project_id === el.project.id &&
                  arrItem.issue_id === el.id
              );

              kanbanArray.forEach((el) => {
                resKanbanArray.push({
                  value: el.executor_id,
                  label: el.executor_name,
                  kanban_status: el.kanban_status_id,
                });
              });
            }

            projectsData.push({
              id: el.id,
              kanban_executors: resKanbanArray,
              kanban_monitors: [],
              kanban_testers: [],
              issue_executors: [],
              available_users: [],
              assigned_to: assignedName,
              assigned_Id: assignedId,
              executor_id: assignedId,
              author: el.author,
              created_on: moment(el.created_on).format('YYYY-MM-DD'),
              description: el.description,
              due_date: moment(el.due_date).format('YYYY-MM-DD'),
              estimated_hours: el.estimated_hours,
              priority: el.priority,
              project: el.project,
              start_date: moment(el.start_date).format('YYYY-MM-DD'),
              status: statusName,
              status_id: statusId,
              subject: el.subject,
              tracker: trackerName,
              module: moduleValue,
              comment: '',
              _toggled: false,
              kanban_issue_comments: [],
              monitor_id: assignedId,
              tester_id: assignedId,
              showSuccessfullRedmineNotification: false,
            });
            this.dataArray = projectsData;
          });
        });
      } else {
        this.dataArray = [];
      }
      // console.log(this.dataArray);
    },
  },
};
</script>

<style src="spinkit/spinkit.min.css"></style>

<style scoped>
.card-body div {
  margin: auto;
}

.is-grouped {
  display: inline-block;
}

.button:not(:last-child) {
  margin-right: 10px;
}
</style>
