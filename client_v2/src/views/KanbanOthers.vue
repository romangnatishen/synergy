<template>
  <div>
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
    </CCard>
    <CModal
      :show.sync="showTaskDetails"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Szczegóły zadania"
      size="lg"
      color="dark"
    >
      <CCardBody>
        <b>{{ foundIssueProjectName }}</b>
        <h6>{{ foundIssueDescription }}</h6>
        <p></p>
        <CTextarea
          v-model="foundIssueComment"
          placeholder="Wprowadż komentarz"
          horizontal
          rows="4"
        />

        <CDataTable
          :items="issue_comments"
          :fields="issue_comments_fields"
          items-per-page-select
          :items-per-page="5"
          hover
          sorter
          pagination
          table-filter
          cleaner
        >
        </CDataTable>
      </CCardBody>
      <template #header>
        <h6 class="modal-title">Szczegóły zadania</h6>
        <CButtonClose @click="showTaskDetails = false" class="text-white" />
      </template>
      <template #footer>
        <CButton v-if="issueIsFound" @click="addKanbanComment()" color="success"
          >Zapisz zmiany</CButton
        >
        <CButton color="info" @click="openInRedmine">
          Otwórz w Redmine
        </CButton>

        <CButton
          v-if="allowDeleteIssue"
          color="danger"
          @click="deleteFromKanban"
        >
          Usuń z kanban
        </CButton>

        <CButton @click="cancelIssueModification()" color="danger"
          >Cofnij</CButton
        >
      </template>
    </CModal>

    <CRow v-if="showCarusel === false">
      <CCol>
        <CSelect
          label="Wykonawca"
          horizontal
          :value.sync="filterExecutor"
          :options="executorsList"
        />
      </CCol>
      <CCol>
        <CButton
          class="panel-button"
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="refreshKanban()"
        >
          Odśwież
        </CButton>
      </CCol>
    </CRow>
    <CCard>
      <CCardBody v-if="kanban_data.length > 0">
        <CTabs>
          <CTab
            v-for="column in kanban_data"
            :title="column.title"
            :key="column.id"
          >
            <template slot="title">
              {{ column.title }}
              <CBadge color="primary" shape="pill"
                ><strong>{{ column.tasks.length }}</strong></CBadge
              >
            </template>
            <CDataTable
              :items="column.tasks"
              :fields="taskFields"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              table-filter
              cleaner
            >
              <template #issue_id="{ item }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="toggleDetails(item)"
                  >
                    {{ item.issue_id }}
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import generalFunctions from '../plugins/generalFunctions';

export default {
  name: 'App',
  components: {},
  data() {
    return {
      showCarusel: true,
      issueIsFound: false,
      showTaskDetails: false,
      showNewTaskButton: true,
      showNewTask: false,
      issueToFind: null,

      foundIssue: null,
      allowDeleteIssue: false,
      foundIssueProjectName: null,
      foundIssueDescription: null,
      foundIssueComment: '',

      executorsList: [],
      filterExecutor: 0,
      projectsList: [],
      filterProject: 0,
      kanban_data: [],

      taskFields: [
        { key: 'project_name', label: 'Projekt' },
        { key: 'issue_id', label: 'Nr. zadania' },
        { key: 'issue_name', label: 'Opis' },
        { key: 'estimated_hours', label: 'Il. godzin' },
        { key: 'due_date', label: 'Data oddania' },
      ],
      issue_comments: [],
      issue_comments_fields: [
        { key: 'user_name', label: 'Użytkownik' },
        { key: 'description', label: 'Opis' },
        { key: 'createdAt', label: 'Data zmiany' },
      ],
    };
  },

  async created() {
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

  computed: {},

  methods: {
    async openInRedmine() {
      window.open(
        'https://tasks.axioma.pl/issues/' + String(this.foundIssue.issue_id)
      );
    },

    async refreshKanban() {
      this.kanban_data = [
        { id: 1, redmine_status_id: 8, title: 'Zaplanowane', tasks: [] },
        { id: 2, redmine_status_id: 2, title: 'Na wykonaniu', tasks: [] },
        { id: 3, redmine_status_id: 3, title: 'Sprawdzenie', tasks: [] },
        { id: 4, redmine_status_id: 7, title: 'Zawieszone', tasks: [] },
        { id: 5, redmine_status_id: 5, title: 'Do poprawy', tasks: [] },
      ];

      for await (let kanbanItem of this.kanban_data) {
        const params = {
          where: {
            executor_id: this.filterExecutor,
            kanban_status_id: kanbanItem.id,
          },
        };
        const kanbanIssueList = await this.$store.dispatch(
          'issues/getKanbanIssueByProject',
          params,
          params
        );
        const dataArray = kanbanIssueList.data;
        if (dataArray) {
          let tasks = [];
          for await (let el of dataArray) {
            // dataArray.forEach(el => {
            let important_issue = 0;
            if (el.important_issue != null) {
              important_issue = el.important_issue;
            }

            const issueData = {
              taskId: Number(el.issue_id).toString(),
              redmineQuery: {},
            };
            const currentIssue = await this.$store.dispatch(
              'issues/getIssue',
              issueData
            );
            let estimated_hours;
            let due_date;
            if (currentIssue) {
              estimated_hours = currentIssue.data?.issue?.estimated_hours;
              due_date = currentIssue.data?.issue?.due_date;
            }
            if (!estimated_hours) {
              estimated_hours = 'brak';
            }
            if (!due_date) {
              due_date = 'brak';
            }
            tasks.push({
              id: el.id,
              kanban_status_id: kanbanItem.id,
              issue_id: el.issue_id,
              issue_name: el.issue_name,
              project_name: el.project_name,
              important_issue: important_issue,
              estimated_hours: estimated_hours,
              due_date: due_date,
              executor_id: el.executor_id,
              executor_name: el.executor_name,
              auditor_id: el.auditor_id,
              auditor_name: el.auditor_name,
            });
          }
          kanbanItem.tasks = tasks;
        }
      }
    },

    async initialize() {
      this.executorsList = await generalFunctions.redmineExecutorsList(
        this.$store
      );
    },

    async addKanbanComment() {
      const currentProfile = this.$store.getters['profile/getProfile'];
      if (currentProfile) {
        const addData = {
          issue_id: this.foundIssue.issue_id,
          user_id: currentProfile.id,
          user_name: currentProfile.name,
          description: this.foundIssueComment,
        };
        await this.$store.dispatch('issues/addKanbanComment', addData);
      }

      this.issueToFind = null;
      this.foundIssue = null;
      this.foundIssueProjectName = null;
      this.foundIssueDescription = null;
      this.issueIsFound = false;
      this.showTaskDetails = false;
      this.showNewTaskButton = true;
      this.foundIssueComment = '';
    },

    async deleteFromKanban() {
      if (this.foundIssue) {
        const currentStatus = Number(this.foundIssue.kanban_status_id) - 1;
        const tasksFrom = this.kanban_data[currentStatus].tasks;
        const index = tasksFrom.indexOf(this.foundIssue);
        if (index > -1) {
          tasksFrom.splice(index, 1);

          const deleteFilter = {
            where: {
              issue_id: this.foundIssue.issue_id,
              executor_id: this.filterExecutor,
            },
          };
          const updateData = {
            deleteFilter: JSON.stringify(deleteFilter),
          };
          await this.$store.dispatch(
            'issues/deleteKanbanIssue',
            updateData,
            updateData
          );

          // const redmineUpdateFilter = {
          //     where:
          //       {
          //           issue_id: this.foundIssue.issue_id,
          //       }
          //   };
          // const redmineUpdateContent = {
          //   kanban_status_id:6
          //   };
          // const redmineUpdateData = {
          //   updateFilter:JSON.stringify(redmineUpdateFilter),
          //   updateContent:JSON.stringify(redmineUpdateContent)
          // };
          // await this.makeChangesInRedmine(redmineUpdateData);
        }
      }
      this.showTaskDetails = false;
    },

    async makeChangesInRedmine(issueData) {
      const currentProfile = this.$store.getters['profile/getProfile'];

      if (currentProfile) {
        const addData = {
          issue_id: issueId,
          user_id: currentProfile.id,
          user_name: currentProfile.name,
          description: modificationComment,
        };
        await this.$store.dispatch('issues/addKanbanComment', addData);
      }
    },

    async toggleDetails(issue) {
      const currentRedmineUser = await this.$store.dispatch(
        'projects/findCurrentRedmineUser'
      );

      this.allowDeleteIssue = false;
      if (
        (issue.executor_id === currentRedmineUser.data.user.id ||
          issue.auditor_id === currentRedmineUser.data.user.id) &&
        issue.kanban_status_id === 1
      ) {
        this.allowDeleteIssue = true;
      }

      this.showTaskDetails = true;

      this.showNewTaskButton = false;

      const issueData = {
        taskId: Number(issue.issue_id).toString(),
        redmineQuery: {},
      };

      this.foundIssue = issue;
      this.foundIssueProjectName = issue.project_name;
      this.foundIssueDescription = issue.issue_name;
      this.issueIsFound = true;

      const currentComments = await this.$store.dispatch(
        'issues/findKanbanCommentsByIssueId',
        issueData
      );

      if (currentComments) {
        let commentsData = [];
        currentComments.data.forEach((el) => {
          commentsData.push({
            ...el,
          });
        });
        this.issue_comments = commentsData;
      } else {
        this.issue_comments = [];
      }
    },
  },
};
</script>

<style src="spinkit/spinkit.min.css"></style>

<style>
.carusel-body {
  margin: auto;
}

.panel-button {
  margin: 5px;
}

.issue_header {
  width: 95%;
  border-radius: 10px;
  background-color: ghostwhite;
}

.issue_card {
  width: 95%;
  border-radius: 15px;
}

.important_issue {
  background-color: lightsalmon;
}

.normal_issue {
  background-color: white;
}

.dropdown {
  list-style-type: none;
  right: 5px;
  float: right;
}

.sticky {
  position: fixed;
  bottom: 60px;
  right: 0;
  width: 300px;
  border: 3px solid #73ad21;
}

@media screen and (max-width: 4000px) {
  .task-board {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .task-column {
    width: 25%;
  }
  .add_button {
    position: fixed;
    z-index: 99999;
    bottom: 60px;
    right: 100px;
  }
}
</style>
