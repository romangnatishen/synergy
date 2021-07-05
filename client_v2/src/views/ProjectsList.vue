<template>
  <CCard>
    <CModal
      :show.sync="projectSettingsVisible"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Ustawienia projektu"
      size="lg"
      color="dark"
    >
      <CCardBody>
        <CRow>
          <CCol>
            <CSelect
              label="Projekt w Hubstaff"
              horizontal
              :value.sync="currentHubstaff_id"
              :options="hubstaff_projects"
            />
          </CCol>
        </CRow>
        <p></p>
        <CRow class="switch-items">
          <CSwitch
            class="mx-1"
            color="success"
            name="enableStats"
            :checked.sync="enableProjectStatistics"
          />
          <h6 class="switch-description">Włącz statystyki z Redmine</h6>
        </CRow>
      </CCardBody>
      <template #header>
        <h6 class="modal-title">Ustawienia projektu</h6>
        <CButtonClose
          @click="cancelProjectSettingsModification"
          class="text-white"
        />
      </template>
      <template #footer>
        <CButton @click="saveProjectSettings" color="success"
          >Zapisz zmiany</CButton
        >
        <CButton @click="cancelProjectSettingsModification" color="danger"
          >Cofnij
        </CButton>
      </template>
    </CModal>

    <CModal
      :show.sync="projectDetailsVisible"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Szczegóły projektu"
      size="lg"
      color="dark"
    >
      <CCardBody>
        <div
          v-if="showCaruselInDetails === true"
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

        <CDataTable
          v-if="showCaruselInDetails === false"
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
          @click="projectDetailsVisible = false"
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
            <CForm inline>
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="showProjectSettings(item)"
              >
                <CIcon name="cil-settings"> </CIcon>
              </CButton>
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="showProjectDetails(item.id)"
              >
                <CIcon name="cil-grid"> </CIcon>
              </CButton>
            </CForm>
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
      currentProjectId: 0,
      currentProjectName: '',
      projectSettingsVisible: false,
      projectDetailsVisible: false,
      projectTasksSummary: [],
      projectTasksSummaryFields: [
        { key: 'assigned_to_name', title: 'Wykonawca' },
        { key: 'status_name', title: 'Status' },
        { key: 'count', title: 'Ilość' },
        { key: 'kanbanCount', title: 'W Kanbanie' },
      ],
      showCaruselInDetails: false,
      showCarusel: true,
      dataArray: [],
      hubstaff_projects: [],
      currentHubstaff_id: 0,
      enableProjectStatistics: false,
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
        .dispatch('projects/findAllInRedmine', {})
        .then((dataObject) => {
          let projectsData = [];
          dataObject.forEach((str) => {
            str.forEach((el) => {
              projectsData.push({
                created_on: moment(el.created_on).format('YYYY-MM-DD'),
                id: el.id,
                is_public: el.is_public,
                hubstaff_id: 0,
                enableProjectStatistics: false,
                name: el.name,
                _classes: '',
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

      for await (let projectItem of this.dataArray) {
        const projectParams = {
          redmine_id: projectItem.id,
        };
        const projectSettings = await this.$store.dispatch(
          'projects/getProjectSettings',
          projectParams
        );
        if (projectSettings.data) {
          projectItem.hubstaff_id = projectSettings.data.hubstaff_id;
          projectItem.enableProjectStatistics =
            projectSettings.data.bg_monitoring;
          projectItem._classes = 'bg-light';
        }
      }
      // console.log(this.dataArray);
      await this.$store
        .dispatch('projects/findAllHubstaffProjects', {})
        .then((hubstaffObject) => {
          let projectsData = [];
          hubstaffObject.data.projects.forEach((str) => {
            projectsData.push({
              value: str.id,
              label: str.name,
              status: str.status,
            });
          });
          this.hubstaff_projects = projectsData;
        })
        .catch((err) => {
          console.log(err);
          this.hubstaff_projects = [];
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
      dataObject.forEach((el) => {
        el.forEach((currentIssue) => {
          let issueUser = currentIssue.author;
          if (currentIssue.assigned_to) {
            issueUser = currentIssue.assigned_to;
          }
          const foundInSummary = currentprojectTasksSummary.find(
            (sumEl) =>
              sumEl.status.id === currentIssue.status.id &&
              sumEl.assigned_to.id === issueUser.id
          );
          const foundInKanban = kanbanTasks.data.find(
            (kanbanEl) =>
              kanbanEl?.issue_id === currentIssue.id &&
              kanbanEl?.executor_id === currentIssue.assigned_to.id
          );
          if (foundInSummary) {
            foundInSummary.count = foundInSummary.count + 1;
            if (foundInKanban) {
              foundInSummary.kanbanCount = foundInSummary.kanbanCount + 1;
            }
          } else {
            currentprojectTasksSummary.push({
              status: currentIssue.status,
              status_name: currentIssue.status.name,
              assigned_to: issueUser,
              assigned_to_name: issueUser.name,
              count: 1,
              kanbanCount: foundInKanban ? 1 : 0,
            });
          }
        });
      });
      this.projectTasksSummary = currentprojectTasksSummary;
      this.showCaruselInDetails = false;
      this.currentProjectId = 0;
    },

    async showProjectSettings(item) {
      this.projectSettingsVisible = true;
      this.currentProjectId = item.id;
      this.currentProjectName = item.name;
      this.currentHubstaff_id = item.hubstaff_id;
      this.enableProjectStatistics = item.enableProjectStatistics;
    },

    cancelProjectSettingsModification() {
      this.projectSettingsVisible = false;
      this.currentProjectId = 0;
      this.currentProjectName = '';
      this.currentHubstaff_id = 0;
      this.enableProjectStatistics = false;
    },

    async saveProjectSettings() {
      if (this.currentHubstaff_id) {
        const foundProject = this.dataArray.find(
          (projectItem) => projectItem.id === this.currentProjectId
        );
        if (foundProject) {
          foundProject.hubstaff_id = this.currentHubstaff_id;
          foundProject.enableProjectStatistics = this.enableProjectStatistics;
        }
        const projectSettings = {
          redmine_id: this.currentProjectId,
          name: this.currentProjectName,
          hubstaff_id: this.currentHubstaff_id,
          bg_monitoring: this.enableProjectStatistics,
        };
        this.$store.dispatch('projects/saveProjectSettings', projectSettings);
      }
      this.projectSettingsVisible = false;
      this.currentProjectId = 0;
      this.currentProjectName = '';
      this.currentHubstaff_id = 0;
      this.enableProjectStatistics = false;
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

<style lang="scss" scoped>
@import '../assets/scss/style';

.switch-items {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-left: 0;

  @media screen and(max-width: 568px) {
    margin-left: -5px;
  }
}

.switch-description {
  margin-left: 10px;
  vertical-align: middle;
  margin-bottom: 0;
}
</style>
