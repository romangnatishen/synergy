<template>
  <CCard>
    <CModal
      :show.sync="projectDetailsVisible"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Szczegóły projektu"
      size="lg"
      color="dark"
    >
      <CCardBody>
        <div v-if="showCaruselInDetails===true"
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
          </div>
              
        <CDataTable v-if="showCaruselInDetails===false"
          :items="projectTasksSummary"
          :fields="projectTasksSummaryFields"
          items-per-page-select
          :items-per-page="50"
          hover
          sorter
          pagination
          table-filter
          cleaner
        >
        </CDataTable>
      </CCardBody>
      <template #header>
        <h6 class="modal-title">Szczegóły projektu</h6>
        <CButtonClose
          @click="projectDetailsVisible=false"
          class="text-white"
        />
      </template>
      <template #footer>
        <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="goToProject(currentProjectId)"
        >
            Przejdż do zadań projektu
        </CButton>
      </template>

    </CModal>

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
    <CCardBody>
      <CDataTable
        :items="dataArray"
        :fields="fields"
        column-filter
        items-per-page-select
        :items-per-page="10"
        hover
        sorter
        pagination
        table-filter
        cleaner
      >
        <template #id="{ item }">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="showProjectDetails(item.id)"
            >
              Info
            </CButton>
          </td>
        </template>
        <template #name="{ item }">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="goToProject(item.id)"
            >
              {{ item.name }}
            </CButton>
          </td>
        </template>
      </CDataTable>
    </CCardBody>
  </CCard>
</template>

<script>
import moment from 'moment';
import sequrityCheck from '../plugins/sequrityCheck';

const fields = [
  { key: 'id', title: 'Kod', _style: 'max-width:10%' },
  { key: 'name', title: 'Nazwa' },
  { key: 'created_on', title: 'Utworzono' },
];

export default {
  name: 'AdvancedTables',

  data() {
    return {
      currentProjectId:0,
      projectDetailsVisible: false,
      projectTasksSummary:[],
      projectTasksSummaryFields : [
        { key: 'assigned_to_name', title: 'Wykonawca'},
        { key: 'status_name', title: 'Status' },
        { key: 'count', title: 'Ilość' },
        { key: 'kanbanCount', title: 'W Kanbanie' },
      ],
      showCaruselInDetails : false,
      showCarusel: true,
      dataArray: [],
      // dataArray: usersData.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
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
      await this.$store
        .dispatch('projects/findAll', {})
        .then((dataObject) => {
          let projectsData = [];
          dataObject.forEach((str) => {
            str.forEach((el) => {
              projectsData.push({
                created_on: moment(el.created_on).format('YYYY-MM-DD'),
                id: el.id,
                is_public: el.is_public,
                name: el.name,
                status: el.stauts,
                updated_on: moment(el.updated_on).format('YYYY-MM-DD'),
              });
            });
          });
          this.dataArray = projectsData;
        })
        .catch((err) => {
          console.log(err);
          this.dataArray = [];
        });
    },

    getBadge(status) {
      switch (status) {
        case 'Active':
          return 'success';
        case 'Inactive':
          return 'secondary';
        case 'Pending':
          return 'warning';
        case 'Banned':
          return 'danger';
        default:
          'primary';
      }
    },

    async showProjectDetails(projectId) {
      this.currentProjectId = projectId;
      this.showCaruselInDetails = true;

      this.projectDetailsVisible = true;
      const dataObject = await this.$store.dispatch('issues/findAll', {
        project_id: projectId,
        include: 'journals',
        status_id: 'open',
      });

      const params = {
        where: {
          project_id: projectId,
        },
      };
      
      const kanbanTasks = await this.$store.dispatch(
        'issues/getKanbanIssueByProject',
        params
      );

      const currentprojectTasksSummary = [];
      dataObject.forEach(el => {
        el.forEach(currentIssue => {
          let issueUser = currentIssue.author;
          if (currentIssue.assigned_to) {
            issueUser = currentIssue.assigned_to;
          } 
          const foundInSummary = currentprojectTasksSummary.find(
            sumEl => (sumEl.status.id===currentIssue.status.id&&sumEl.assigned_to.id===issueUser.id)
            );
          const foundInKanban = kanbanTasks.data.find(
            kanbanEl => (kanbanEl?.issue_id===currentIssue.id&&kanbanEl?.executor_id===currentIssue.assigned_to.id)
            );
          if (foundInSummary) {
            foundInSummary.count = foundInSummary.count + 1;
            if (foundInKanban) {
              foundInSummary.kanbanCount = foundInSummary.kanbanCount + 1;
            }
          } else {
              currentprojectTasksSummary.push(
                {
                  status : currentIssue.status,
                  status_name : currentIssue.status.name,
                  assigned_to : issueUser,
                  assigned_to_name : issueUser.name,
                  count : 1,
                  kanbanCount : (foundInKanban) ? 1 : 0
                }
              );
          }
        })
      })
      this.projectTasksSummary = currentprojectTasksSummary;
      this.showCaruselInDetails = false;
      this.currentProjectId = 0;

    },
    toggleDetails(item) {
      this.$set(this.dataArray[item.id], '_toggled', !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },

    async goToProject(projectId) {
      this.showCaruselInDetails = false;
      if (projectId) {        
        this.$store.dispatch('projects/setFilterProject', projectId);
        this.$router.push({
          name: 'TasksList',
          params: { projectId: projectId },
        });
      }
    },
  },
};
</script>

<style src="spinkit/spinkit.min.css"></style>

<style scoped>
.card-body div {
  margin: auto;
}
</style>
