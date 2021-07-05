<template>
  <CCard>
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
        <template #status="{ item }">
          <td>
            {{ item.status }}
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
            <CBadge
              :color="getBadge(item.kanban_executors)"
              v-for="(value, key) in item.kanban_executors"
              :key="key"
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
            <CCardBody>
              <CTabs>
                <CTab title="Redmine">
                  <p></p>
                  <CRow>
                    <CCol>
                      <CSelect
                        label="Wykonawca"
                        :value.sync="item.assigned_Id"
                        :options="item.issue_executors"
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
                  <p></p>
                  <p class="display:flex text-muted">
                    <b>Opis:</b> {{ item.description }}
                  </p>
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      id="message"
                      v-model="item.comment"
                      name="body"
                      rows="5"
                      placeholder="Wprowadż komentarz"
                    ></textarea>
                  </div>
                  <p></p>
                  <CAlert
                    v-if="item.showSuccessfullRedmineNotification"
                    :show.sync="alertTime"
                    closeButton
                    color="success"
                    fade
                  >
                    Zmiany zostały zapisane pomyślnie
                  </CAlert>
                  <p></p>
                  <CForm inline>
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
                      square
                      color="info"
                      size="sm"
                      @click="openInRedmine(item)"
                      class="button"
                    >
                      Otwórz w Redmine
                    </CButton>
                  </CForm>
                </CTab>
                <CTab title="Kanban">
                  <p></p>
                  <CRow>
                    <CCol class="executors-list">
                      <CSelect
                        label="Wykonawca"
                        :value.sync="item.executor_id"
                        :options="item.issue_executors"
                      />
                      <p></p>
                      <CButton
                        size="sm"
                        color="success"
                        class="button"
                        @click="
                          addIssueUser(
                            item,
                            item.executor_id,
                            item.kanban_executors,
                            3
                          )
                        "
                      >
                        Dodaj wykonawcę
                      </CButton>
                      <p></p>
                      <CListGroup>
                        <CListGroupItem
                          v-for="(value, key) in item.kanban_executors"
                          :key="key"
                        >
                          {{ value.label }}
                          <div class="btn-group float-right">
                            <CButton
                              size="sm"
                              color="danger"
                              class="button"
                              @click="deleteFromKanban(item, value)"
                            >
                              Usuń
                            </CButton>
                          </div>
                        </CListGroupItem>
                      </CListGroup>
                    </CCol>
                    <CCol class="executors-list">
                      <CSelect
                        label="Monitorują"
                        :value.sync="item.monitor_id"
                        :options="item.issue_executors"
                      />
                      <p></p>
                      <CButton
                        size="sm"
                        color="success"
                        class="button"
                        @click="
                          addIssueUser(
                            item,
                            item.monitor_id,
                            item.kanban_monitors,
                            1
                          )
                        "
                      >
                        Dodaj monitorującego
                      </CButton>
                      <p></p>
                      <CListGroup>
                        <CListGroupItem
                          v-for="(value, key) in item.kanban_monitors"
                          :key="key"
                        >
                          {{ value.label }}
                          <div class="btn-group float-right">
                            <CButton
                              size="sm"
                              color="danger"
                              class="button"
                              @click="deleteIssueUser(item, value, 1)"
                            >
                              Usuń
                            </CButton>
                          </div>
                        </CListGroupItem>
                      </CListGroup>
                    </CCol>
                    <CCol class="executors-list">
                      <CSelect
                        label="Testują"
                        :value.sync="item.tester_id"
                        :options="item.issue_executors"
                      />
                      <p></p>
                      <CButton
                        size="sm"
                        color="success"
                        class="button"
                        @click="
                          addIssueUser(
                            item,
                            item.tester_id,
                            item.kanban_testers,
                            2
                          )
                        "
                      >
                        Dodaj testującego
                      </CButton>
                      <p></p>
                      <CListGroup>
                        <CListGroupItem
                          v-for="(value, key) in item.kanban_testers"
                          :key="key"
                        >
                          {{ value.label }}
                          <div class="btn-group float-right">
                            <CButton
                              size="sm"
                              color="danger"
                              class="button"
                              @click="deleteIssueUser(item, value, 2)"
                            >
                              Usuń
                            </CButton>
                          </div>
                        </CListGroupItem>
                      </CListGroup>
                    </CCol>
                  </CRow>
                  <p></p>
                  <label>Komentarze</label>
                  <CDataTable
                    v-if="item.kanban_issue_comments.length > 0"
                    :items="item.kanban_issue_comments"
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
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      id="message"
                      v-model="item.kanban_comment"
                      name="body"
                      rows="5"
                      placeholder="Wprowadż komentarz"
                    ></textarea>
                  </div>
                  <p></p>
                  <CForm inline>
                    <CButton
                      size="sm"
                      color="success"
                      class="button"
                      @click="showKanbanTaskDetails(item)"
                    >
                      Dodaj komentarz
                    </CButton>
                  </CForm>
                </CTab>
              </CTabs>
            </CCardBody>
          </CCollapse>
        </template>
      </CDataTable>
    </CCardBody>
  </CCard>
</template>

<script>
import hostSettings from '../plugins/hostSettings';
import generalFunctions from '../plugins/generalFunctions';

export default {
  name: 'TasksTable',
  props: {
    dataArray: Array,
    issue_statuses: Array,
  },

  data() {
    return {
      collapseDuration: 0,
      KanbanDetailsVisible: false,
      fields: [
        { key: 'info' },
        { key: 'id' },
        { key: 'status' },
        { key: 'assigned_to' },
        { key: 'created_on' },
        { key: 'subject' },
        { key: 'tracker' },
        { key: 'module' },
        // { key: 'kanban' },
      ],
      kanban_issue_comments_fields: [
        { key: 'user_name', label: 'Użytkownik' },
        { key: 'description', label: 'Opis' },
        { key: 'createdAt', label: 'Data zmiany' },
      ],
      alertTime: 0,
    };
  },

  methods: {
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

    getBadge(kananArray) {
      let res = 'warning';
      if (kananArray[0].value != 0) {
        res = 'success';
      }
      return res;
    },

    async addIssueUser(item, userId, userArray, userType) {
      const foundExecutor = item.available_users.find(
        (el) => el.value === userId
      );
      const addValue = {
        value: userId,
        label: foundExecutor.text,
      };

      if (userType === 3) {
        await this.addToKanban(item, addValue);
      }

      const addData = {
        issue_id: item.id,
        user_id: userId,
        user_name: foundExecutor.text,
        user_type: userType,
      };

      const presentInUserArray = userArray.filter(
        (el) => Number(el.value) === Number(userId)
      );

      if (presentInUserArray.length === 0) {
        userArray.push(addValue);
        await this.$store.dispatch('issues/addIssueUser', addData);
      }
    },

    async deleteIssueUser(item, value, userType) {
      const deleteData = JSON.stringify({
        where: {
          issue_id: item.id,
          user_id: value.value,
          user_type: userType,
        },
      });

      await this.$store.dispatch('issues/deleteIssueUser', deleteData);
      if (userType === 1) {
        item.kanban_monitors = item.kanban_monitors.filter(
          (arrItem) => arrItem.value != value.value
        );
      } else if (userType === 2) {
        item.kanban_testers = item.kanban_testers.filter(
          (arrItem) => arrItem.value != value.value
        );
      }
    },

    async changeIssueStatusInKanban(item, issue_id) {
      const kanban_data = generalFunctions.kanbanData();
      const kanbanStatus = kanban_data.find(
        (status) => status.redmine_status_id === item.status_id
      );

      const updateFilter = {
        where: {
          issue_id: issue_id,
        },
      };
      const updateContent = {
        kanban_status_id: kanbanStatus.id,
      };

      const updateData = {
        updateFilter: JSON.stringify(updateFilter),
        updateContent: JSON.stringify(updateContent),
      };
      await this.$store.dispatch(
        'issues/updateKanbanIssue',
        updateData,
        updateData
      );
    },

    async addToKanban(item, executor) {
      const kanban_data = generalFunctions.kanbanData();
      const kanbanStatus = kanban_data.find(
        (status) => status.redmine_status_id === item.status_id
      );
      const foundExecutor = item.available_users.find(
        (el) => el.value === executor.value
      );

      const currentRedmineUser = await this.$store.dispatch(
        'projects/findCurrentRedmineUser'
      );

      const presentInKanban = item.kanban_executors.filter(
        (el) => Number(el.value) === Number(executor.value)
      );
      if (presentInKanban.length === 0) {
        item.kanban_executors = item.kanban_executors.filter(
          (arrItem) => arrItem.value != 0
        );
        const addValue = {
          value: executor.value,
          label: foundExecutor.text,
          kanban_status: kanbanStatus.id,
        };
        item.kanban_executors.push(addValue);
      }
      const deleteFilter = {
        issue_id: item.id,
        executor_name: executor.label,
        executor_id: executor.value,
      };
      const updateData = JSON.stringify(deleteFilter);
      await this.$store.dispatch(
        'issues/deleteKanbanIssue',
        updateData,
        updateData
      );

      if (item.status_id != 1) {
        const addData = {
          project_id: item.project.id,
          project_name: item.project.name,
          kanban_status_id: kanbanStatus.id,
          executor_id: executor.value,
          executor_name: foundExecutor.text,
          issue_id: item.id,
          issue_name: item.subject,
          auditor_id: currentRedmineUser.data.user.id,
          auditor_name:
            '' +
            currentRedmineUser.data.user.firstname +
            ' ' +
            currentRedmineUser.data.user.lastname,
        };
        await this.$store.dispatch('issues/addToKanban', addData);
      }
    },

    async deleteFromKanban(item, value) {
      await this.deleteIssueUser(item, value, 3);

      const currentRedmineUser = await this.$store.dispatch(
        'projects/findCurrentRedmineUser'
      );

      const deleteFilter = {
        issue_id: item.id,
        executor_name: value.label,
        executor_id: value.value,
        auditor_id: currentRedmineUser.data.user.id,
        auditor_name:
          '' +
          currentRedmineUser.data.user.firstname +
          ' ' +
          currentRedmineUser.data.user.lastname,
      };
      const updateData = JSON.stringify(deleteFilter);

      const deleteRes = await this.$store.dispatch(
        'issues/deleteKanbanIssue',
        updateData,
        updateData
      );
      if (deleteRes.data === true) {
        item.kanban_executors = item.kanban_executors.filter(
          (arrItem) => arrItem.value != value.value
        );
      }
    },

    async saveTaskChanges(item) {
      console.log(item);
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
      console.log('redmine query', updateData);
      await this.$store
        .dispatch('issues/updateIssue', updateData)
        .then(async () => {
          const issueData = {
            taskId: Number(item.id).toString(),
            redmineQuery: {},
          };
          await this.$store.dispatch('issues/getIssue', issueData);
        });

      if (item.kanban_executors.length === 0) {
        this.addIssueUser(item, item.executor_id, item.kanban_executors, 3);
      } else {
        for await (let executor of item.kanban_executors) {
          await this.addToKanban(item, executor);
        }
      }
      const foundDataArrayIssue = this.dataArray.find(
        (element) => element.id === item.id
      );
      console.log('found issue', foundDataArrayIssue);
      if (foundDataArrayIssue) {
        foundDataArrayIssue.status_id = item.status_id;
        foundDataArrayIssue.assigned_Id = item.assigned_Id;
      }

      item.showSuccessfullRedmineNotification = true;
      this.alertTime = 3;
    },

    async openInRedmine(item) {
      window.open(`${hostSettings.TASKS_HOST}` + String(item.id));
    },

    async fillIssueUsers(item) {
      const projectId = item.project?.id;
      if (projectId) {
        const executorsDataObject = await this.$store.dispatch(
          'projects/projectMembers',
          { id: projectId }
        );
        if (executorsDataObject) {
          let executorsData = [];
          let usersData = [];
          executorsDataObject.forEach((str) => {
            str.forEach((el) => {
              executorsData.push({
                value: el.user.id,
                label: el.user.name,
              });
              usersData.push({
                value: el.user.id,
                text: el.user.name,
              });
            });
          });
          item.issue_executors = executorsData;
          item.available_users = usersData;
        } else {
          item.issue_executors = [];
        }
      }

      const issueData = {
        taskId: Number(item.id).toString(),
      };
      const issue_users = await this.$store.dispatch(
        'issues/findIssueUsers',
        issueData
      );
      if (issue_users.data) {
        issue_users.data.forEach((el) => {
          let currentArray;
          if (el.user_type === 1) {
            currentArray = item.kanban_monitors;
          } else if (el.user_type === 2) {
            currentArray = item.kanban_testers;
          } else if (el.user_type === 3) {
            currentArray = item.kanban_executors;
          }
          const presentInArray = currentArray.filter(
            (curUser) => Number(curUser.value) === Number(el.user_id)
          );
          const addValue = {
            value: el.user_id,
            label: el.user_name,
          };
          if (presentInArray.length === 0) {
            currentArray.push(addValue);
          }
        });
      }
    },

    async toggleDetails(item) {
      // console.log(item.kanban_executors);
      if (item._toggled === false) {
        await this.fillIssueUsers(item);
      }
      const found = this.dataArray.find((el) => el.id === item.id);
      this.$set(found, '_toggled', !item._toggled);
    },
  },
};
</script>
<style src="spinkit/spinkit.min.css"></style>

<style scoped>
.executors-list {
  vertical-align: top;
}
</style>

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
