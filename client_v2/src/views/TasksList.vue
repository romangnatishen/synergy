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

    <CModal
      :show.sync="KanbanDetailsVisible"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Komentarze z Kanban"
      size="lg"
      color="dark"
    >
      <CCardBody>
        <CDataTable
          :items="kanban_issue_comments"
          :fields="kanban_issue_comments_fields"
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
        <h6 class="modal-title">Komentarze z Kanban</h6>
        <CButtonClose @click="closeKanbanTaskDetails" class="text-white" />
      </template>
    </CModal>

    <CCardBody v-if="showCarusel === false">
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
        <template #status="{ item }">
          <td>
            <!-- <CBadge :color="getBadge(item.status)"> -->
            {{ item.status }}
            <!-- </CBadge> -->
          </td>
        </template>
        <template #info="{ item, index }">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="toggleDetails(item, index)"
            >
              <CIcon name="cil-pencil"> </CIcon>
            </CButton>
          </td>
        </template>
        <template #kanban="{ item }">
          <td class="py-2">
            <!-- <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="addToKanban(item)"
          >
            Dodaj
          </CButton> -->
            <CBadge
              :color="getBadge(item.kanbanArray)"
              v-for="(value, key) in item.kanbanArray"
              :key="key"
              @click="goToKanban(value.value)"
            >
              {{ value.label }}
            </CBadge>
          </td>
        </template>
        <template #details="{ item }">
          <CCollapse
            :show="Boolean(item._toggled)"
            :duration="collapseDuration"
          >
            <CCardHeader>
              <CButton
                color="success"
                square
                size="sm"
                class="button"
                @click="saveTaskChanges(item)"
              >
                Zapisz zmiany
              </CButton>
              <CButton
                size="sm"
                color="primary"
                class="button"
                @click="addToKanban(item)"
              >
                Dodaj do Kanban
              </CButton>

              <CButton
                size="sm"
                color="primary"
                class="button"
                @click="showKanbanTaskDetails(item)"
              >
                Historia Kanban
              </CButton>

              <CButton
                square
                color="info"
                size="sm"
                @click="openInRedmine(item)"
                class="button"
              >
                Otwórz w Redmine
              </CButton>

              <!-- href="https://tasks.axioma.pl/issues/14441" -->
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CSelect
                    label="Wykonawca"
                    :value.sync="item.assigned_Id"
                    :options="issue_executors"
                  />
                </CCol>
                <CCol>
                  <CSelect
                    label="Status"
                    :value.sync="item.status_id"
                    :options="issue_statuses"
                  />
                </CCol>
              </CRow>
              <!-- <CRow > -->
              <p></p>
              <p class="display:flex text-muted">
                <b>Opis:</b> {{ item.description }}
              </p>
              <CTextarea
                placeholder="Wprowadż komentarz w razie potrzeby"
                :value.sync="item.comment"
                horizontal
                rows="4"
              />
              <!-- </CRow> -->
              <!-- <CButton size="sm" color="info" class="ml-1">
              Delete
            </CButton> -->
            </CCardBody>
          </CCollapse>
        </template>
      </CDataTable>
    </CCardBody>
  </CCard>
</template>

<script>
import moment from 'moment';
import sequrityCheck from '../plugins/sequrityCheck';

const fields = [
  { key: 'info' },
  { key: 'id' },
  { key: 'status' },
  { key: 'assigned_to' },
  { key: 'created_on' },
  { key: 'subject' },
  { key: 'tracker' },
  { key: 'module' },
  { key: 'kanban' },
];
export default {
  name: 'TasksList',

  data() {
    return {
      showCarusel: true,
      projectId: 0,
      issue_statuses: [],
      issue_executors: [],
      dataArray: [],
      fields,
      details: [],
      selectedStatus: null,
      selectedExecutor: null,
      collapseDuration: 0,
      KanbanDetailsVisible: false,
      kanban_issue_comments: [],
      kanban_issue_comments_fields: [
        { key: 'user_name', label: 'Użytkownik' },
        { key: 'description', label: 'Opis' },
        { key: 'createdAt', label: 'Data zmiany' },
      ],
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

      const executorsDataObject = await this.$store.dispatch(
        'projects/projectMembers',
        { id: this.projectId }
      );
      if (executorsDataObject) {
        let executorsData = [];
        executorsDataObject.forEach((str) => {
          str.forEach((el) => {
            executorsData.push({
              value: el.user.id,
              label: el.user.name,
            });
          });
        });
        this.issue_executors = executorsData;
      } else {
        this.issue_executors = [];
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
                });
              });
            }
            if (resKanbanArray.length === 0) {
              resKanbanArray.push({
                value: 0,
                label: 'Czeka',
              });
            }

            projectsData.push({
              id: el.id,
              kanbanArray: resKanbanArray,
              assigned_to: assignedName,
              assigned_Id: assignedId,
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
            });
            this.dataArray = projectsData;
          });
        });
      } else {
        this.dataArray = [];
      }
    },

    async showKanbanTaskDetails(item) {
      this.KanbanDetailsVisible = true;

      const issueData = {
        taskId: Number(item.id).toString(),
        redmineQuery: {},
      };
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
        this.kanban_issue_comments = commentsData;
      } else {
        this.kanban_issue_comments = [];
      }
    },

    closeKanbanTaskDetails() {
      this.KanbanDetailsVisible = false;
      this.kanban_issue_comments = [];
    },

    goToKanban(value) {
      console.log(value);
    },
    getBadge(kananArray) {
      let res = 'warning';
      if (kananArray[0].value != 0) {
        res = 'success';
      }
      return res;
    },

    // getStatusDescription(kanbanArray) {
    //     let curArray = [];
    //     if (kanbanArray.length===0) {
    //         curArray.push('Czeka');
    //       } else {
    //         kanbanArray.forEach(el => curArray.push(el.label))
    //       }
    //     console.log(curArray);
    //     return curArray;

    //   },

    async addToKanban(item) {
      const foundExecutor = this.issue_executors.find(
        (el) => el.value === item.assigned_Id
      );
      const addData = {
        project_id: item.project.id,
        project_name: item.project.name,
        kanban_status_id: 1,
        executor_id: item.assigned_Id,
        executor_name: foundExecutor.label,
        issue_id: item.id,
        issue_name: item.subject,
      };
      const presentInKanban = item.kanbanArray.filter(
        (el) => Number(el.value) === Number(item.assigned_Id)
      );

      if (presentInKanban.length === 0) {
        item.kanbanArray = item.kanbanArray.filter(
          (arrItem) => arrItem.value != 0
        );
        const addValue = {
          value: item.assigned_Id,
          label: foundExecutor.label,
        };
        item.kanbanArray.push(addValue);
        await this.$store.dispatch('issues/addToKanban', addData);
        await this.saveTaskChanges(item);
      }
    },

    async saveTaskChanges(item) {
      const updateData = {
        taskId: Number(item.id).toString(),
        redmineQuery: {
          issue: {
            status_id: item.status_id,
            assigned_to_id: item.assigned_Id,
            notes: item.comment,
          },
        },
      };

      await this.$store
        .dispatch('issues/updateIssue', updateData)
        .then(async () => {
          const issueData = {
            taskId: Number(item.id).toString(),
            redmineQuery: {},
          };
          await this.$store.dispatch('issues/getIssue', issueData);
        });
    },

    async openInRedmine(item) {
      window.open('https://tasks.axioma.pl/issues/' + String(item.id));
    },

    toggleDetails(item) {
      const found = this.dataArray.find((el) => el.id === item.id);
      this.$set(found, '_toggled', !item._toggled);
      // this.collapseDuration = 300
      // this.$nextTick(() => { this.collapseDuration = 0})
    },
    onStatusChange() {
      // console.log("Status changed");
      // this.collapseDuration = 300
      // this.$nextTick(() => { this.collapseDuration = 0})
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
