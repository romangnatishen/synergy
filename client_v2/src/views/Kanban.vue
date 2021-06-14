<template>
  <div>
    <CCard>
      <CCardBody v-if="showCarusel===true" class="c-app flex-row align-items-center">
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

    <div v-if="showCarusel===false" class="add_button">
      <CButton        
        btn-lg
        color="success"
        size="sm"
        @click="refreshKanban()"      >
        <CIcon name="cil-notes"/> Odśwież
      </CButton>
      <CButton
        btn-lg
        color="success"
        v-if="showNewTaskButton"
        @click="showNewTaskForm()"
        >
        <CIcon name="cil-notes"/> Dodaj
      </CButton>
    </div>
    <div class="task-board" v-if="showCarusel===false">
        <div class="task-column"
        v-for="column in kanban_data"
        :key="column.id"
        >
        <div>
          <div>
            <strong>{{column.title}}</strong>
          </div>
        </div>
          <draggable :delay="draggableConfig.delay"
                     :touchStartThreshold="draggableConfig.touchStartThreshold"
                     :id="column.id"
                     :key="column.id"
                     :list="column.tasks"
                     :animation="200"
                     group="tasks"
                     class="draggable-container"
                     @change="columnChanged">
              <!-- <CCard @dragend="updateKanban(task)" class="card text-white bg-success mb-3" style="width: 95%; bg-primary" -->

              <!-- <CCard class="card mb-3" style="width: 95%; bg-success" -->
            <CCard class="issue_card"
            v-for="(task) in column.tasks"
            :key="task.id"
            :task="task"
            :column_id="column.id"
            >
              <CCardHeader v-bind:class="[task.important_issue > 0 ? important_issue : normal_issue]">
                <CRow>
                  <CCol>
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(task)"
                  >
                      {{task.issue_id}}
                    </CButton>
                  </CCol>
                  <CCol>
                    <CDropdown class="dropdown"
                      placement="bottom-end"
                      in-nav
                    >
                      <template #toggler>
                        <CHeaderNavLink>
                          <CIcon name="cil-settings"/>
                          <!-- <CBadge shape="pill" color="warning"></CBadge> -->
                        </CHeaderNavLink>
                      </template>
                        <CDropdownItem @click="moveToAnotherStatus(task,true)">Do następnej kolumny</CDropdownItem>
                        <CDropdownItem @click="moveToAnotherStatus(task,false)">Do poprzedniej kolumny</CDropdownItem>
                        <CDropdownItem @click="makeTaskImportant(task)"> Poproś o pilne wykonanie </CDropdownItem>
                        <CDropdownItem @click="closeTask(task,true)">Zamknij zadanie</CDropdownItem>
                        <CDropdownItem @click="deleteTask(task,true)">Usuń z Kanban</CDropdownItem>
                    </CDropdown>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                  <strong>{{task.project_name}}</strong>
                  <div>{{task.issue_name}}</div>
              </CCardBody>
              <CCardFooter>
                <CRow>
                  <CCol>
                    {{task.due_date}}
                  </CCol>
                  <CCol>
                    {{task.estimated_hours}}
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </draggable>
        </div>
    </div>

    <CModal
      :show.sync="showNewTask"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Nowe zadadanie"
      size="lg"
      color="dark"
    >
    <CCardBody>
      <CRow>
        <CCol>
          <CInput
            label="Numer zadania"
            v-model="issueToFind"
            type="number"
            horizontal
          />
        </CCol>
        <CCol>
          <CButton @click="findIssue()" color="info"><CIcon name="cil-check-circle"/></CButton>
        </CCol>
      </CRow>
      <b v-if="!issueIsFound">Wyszukaj zadanie</b>
      <b v-if="issueIsFound">{{foundIssueProjectName}}</b>
      <h6 v-if="issueIsFound">{{foundIssueDescription}}</h6>

    </CCardBody>
      <template #header>
        <h6 class="modal-title">Nowe zadanie</h6>
        <CButtonClose @click="cancelNewTaskForm()" class="text-white"/>
      </template>
      <template #footer>
        <CButton v-if="issueIsFound" @click="addIssueToKanban()" color="success">Dodaj do Kanban</CButton>
        <CButton @click="cancelNewTaskForm" color="danger">Cofnij</CButton>
      </template>
    </CModal>

      <CModal
        :show.sync="showTaskDetails"
        :no-close-on-backdrop="true"
        :centered="true"
        title="Szczegóły zadania"
        size="lg"
        color="dark"
      >
      <CCardBody>
        <b >{{foundIssueProjectName}}</b>
        <h6>{{foundIssueDescription}}</h6>
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
          <CButtonClose @click="showTaskDetails = false" class="text-white"/>
        </template>
        <template #footer>
          <CButton v-if="issueIsFound" @click="addKanbanComment()" color="success">Zapisz zmiany</CButton>
          <CButton
            color="info"
            @click="openInRedmine"
          >
            Otwórz w Redmine
          </CButton>

          <CButton @click="cancelIssueModification()" color="danger">Cofnij</CButton>
        </template>
      </CModal>
  </div>

</div>

</template>

<script>
import draggable from "vuedraggable";
import generalFunctions from '../plugins/generalFunctions'
import { throttle } from 'throttle-debounce';

export default {
  name: "App",
  components: {
    draggable
  },
  data() {
    return {
      draggableConfig: {
        delay: 0,
        threshold: 0,
      },
      showCarusel:true,
      issueIsFound:false,
      showTaskDetails:false,
      showNewTaskButton: true,
      showNewTask:false,
      issueToFind:null,

      foundIssue:null,
      foundIssueProjectName:null,
      foundIssueDescription:null,
      foundIssueComment:"",

      executorsList: [],
      filterExecutor:0,
      projectsList: [],
      filterProject:0,
      kanban_data: [],
      issue_comments: [],
      issue_comments_fields : [
      { key:'user_name', label:'Użytkownik'},
      { key:'description', label:'Opis'},
      { key:'createdAt', label:'Data zmiany'},
    ]};
  },

  async created() {
    this.showCarusel = true;
    await this.initialize().then(() => {
      this.showCarusel = false;
    }).catch((err) => {
        console.log(err);
        this.showCarusel = false;
    });
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },

  computed: {

  important_issue: function () {
    return {
      'important_issue': true
     }
  },

  normal_issue: function () {
    return {
      'normal_issue': true
     }
  },
},

  methods: {

    onResize: throttle(1000, false, function (){
      const isMobile = window.innerWidth <= 568;
      if (isMobile) {
        this.draggableConfig = {
          delay: 200,
          touchStartThreshold: 10
        }
      } else {
        this.draggableConfig = {
          delay: 0,
          touchStartThreshold: 0
        }
      }
    }),

  async toggleDetails(issue) {

    this.showTaskDetails = true;
    this.foundIssue = null;
    this.foundIssueProjectName=null;
    this.foundIssueDescription=null;
    this.issueIsFound = false;
    this.showNewTaskButton = false;

    const issueData = {
      taskId: Number(issue.issue_id).toString(),
      redmineQuery: {}
    };
    const currentIssue = await this.$store.dispatch("issues/getIssue", issueData);
    if (currentIssue) {
      this.foundIssue = currentIssue.data.issue;
      this.foundIssueProjectName=currentIssue.data.issue.project.name;
      this.foundIssueDescription=currentIssue.data.issue.subject;
      this.issueIsFound = true;
    }

    const currentComments = await this.$store.dispatch("issues/findKanbanCommentsByIssueId", issueData);

    if (currentComments) {
      let commentsData = [];
      currentComments.data.forEach(el => {
        commentsData.push(
          {
            ...el
          },
        )
      });
      this.issue_comments = commentsData;
    } else {
      this.issue_comments = []
    }

  },

  async openInRedmine() {
    window.open('https://tasks.axioma.pl/issues/'+String(this.foundIssue.id));
  },

  cancelIssueModification() {
    this.showTaskDetails = false;
    this.showNewTaskButton = true;
    this.foundIssueComment = '';
  },

  async findIssue(){

    this.foundIssue = null;
    this.foundIssueProjectName=null;
    this.foundIssueDescription=null;
    this.issueIsFound = false;

    const issueData = {
      taskId: Number(this.issueToFind).toString(),
      redmineQuery: {}
    };
    const currentIssue = await this.$store.dispatch("issues/getIssue", issueData);
    if (currentIssue) {

      this.foundIssue = currentIssue.data.issue;
      this.foundIssueProjectName=currentIssue.data.issue.project.name;
      this.foundIssueDescription=currentIssue.data.issue.subject;
      this.issueIsFound = true;
    }
  },

  async addKanbanComment() {

    const currentProfile = this.$store.getters['profile/getProfile'];
     if (currentProfile) {
      const addData = {
        issue_id:this.foundIssue.id,
        user_id:currentProfile.id,
        user_name:currentProfile.name,
        description:this.foundIssueComment
      };

      let presentInKanban = false;
      this.kanban_data.forEach(kanban_item => {
        const kanbanRes = kanban_item.tasks.filter(el =>
          Number(el.issue_id) === Number(this.foundIssue.issue_id)
        );
        if (kanbanRes.length > 0) {
          presentInKanban = true;
        }
      })
      if (presentInKanban===false) {
        await this.$store.dispatch("issues/addKanbanComment", addData);
      }
    }

    this.issueToFind = null;
    this.foundIssue = null;
    this.foundIssueProjectName=null;
    this.foundIssueDescription=null;
    this.issueIsFound = false;

    await this.refreshKanban();
    this.showTaskDetails = false;
    this.showNewTaskButton = true;
    this.foundIssueComment = '';
  },

  async addIssueToKanban() {

    const foundExecutor = this.executorsList.find(el => el.value===this.filterExecutor);
    if (foundExecutor) {
      const addData = {
        project_id:this.foundIssue.project.id,
        project_name:this.foundIssue.project.name,
        kanban_status_id:1,
        executor_id: this.filterExecutor,
        executor_name: foundExecutor.label,
        issue_id:this.foundIssue.id,
        issue_name:this.foundIssue.subject
      };

      let presentInKanban = false;
      this.kanban_data.forEach(kanban_item => {
        const kanbanRes = kanban_item.tasks.filter(el =>
          Number(el.issue_id) === Number(this.foundIssue.issue_id)
        );
        if (kanbanRes.length > 0) {
          presentInKanban = true;
        }
      })
      if (presentInKanban===false) {
        await this.$store.dispatch("issues/addToKanban", addData);
      }
    }

    this.issueToFind = null;
    this.foundIssue = null;
    this.foundIssueProjectName=null;
    this.foundIssueDescription=null;
    this.issueIsFound = false;

    await this.refreshKanban();
    this.showNewTask = false;
    this.showNewTaskButton = true;
  },

  showNewTaskForm() {
    this.showNewTask = true;
    this.showNewTaskButton = false;

  },

 cancelNewTaskForm() {

    this.foundIssue = null;
    this.issueToFind = null;
    this.foundIssueProjectName=null;
    this.foundIssueDescription=null;
    this.issueIsFound = false;
    this.showNewTask = false;
    this.showNewTaskButton = true;

  },

  async refreshKanban() {
    if (this.filterExecutor) {
      this.kanban_data =  [
        {id:1, redmine_status_id:8, title: "Zaplanowane",tasks: []},
        {id:2, redmine_status_id:2, title:"Na wykonaniu", tasks:[]},
        {id:3, redmine_status_id:3, title:"Sprawdzenie", tasks:[]},
        {id:4, redmine_status_id:7, title:"Zawieszone", tasks:[]},
        {id:5, redmine_status_id:5, title:"Do poprawy", tasks:[]}
      ]

      for await (let kanbanItem of this.kanban_data) {
        const params = {
          where:{
              executor_id:this.filterExecutor,
              kanban_status_id:kanbanItem.id
            }
        };
        const kanbanIssueList = await this.$store.dispatch("issues/getKanbanIssueByProject", params, params);
        const dataArray = kanbanIssueList.data;
        if (dataArray) {
          let tasks = [];
          for await (let el of dataArray) {
          // dataArray.forEach(el => {
            let important_issue = 0;
            if (el.important_issue != null) {
              important_issue = el.important_issue
              }

            const issueData = {
              taskId: Number(el.issue_id).toString(),
              redmineQuery: {}
            };

            const currentIssue = await this.$store.dispatch("issues/getIssue", issueData);
            let estimated_hours; let due_date;
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
            tasks.push(
              {
                id: el.id,
                kanban_status_id:kanbanItem.id,
                issue_id: el.issue_id,
                issue_name: el.issue_name,
                project_name: el.project_name,
                important_issue: important_issue,
                estimated_hours:estimated_hours,
                due_date:due_date
              }
            );
          }
          kanbanItem.tasks = tasks;
        }
      }

    }
  },

  async initialize() {
              
    const currentRedmineUser = await this.$store.dispatch("projects/findCurrentRedmineUser");
    if (currentRedmineUser) {
      this.filterExecutor = currentRedmineUser.data.user.id;
      await this.refreshKanban();
    }
  },

  moveToBeginning(issue) {
    console.log(issue);
  },

  async makeChangesInRedmine(issueData) {

    const currentProfile = this.$store.getters['profile/getProfile'];

    if (currentProfile) {

      const updateFilter = JSON.parse(issueData.updateFilter);
      const updateContent = JSON.parse(issueData.updateContent);

      const issueId = updateFilter.where.issue_id;
      let redmineStatusId = 0;
      let modificationComment = "";
      if (updateContent.kanban_status_id) {
        const statusId = this.kanban_data.find(el=> el.id === updateContent.kanban_status_id);
        redmineStatusId = statusId.redmine_status_id;
        modificationComment = `Zmiana statusu zadania na: ${statusId.title}`;
      } else if (updateContent.acceptIssue === true) {
        redmineStatusId = 4;
        modificationComment = 'Usunięto zadanie z Kanban';
      }

      const updateData = {
        taskId: Number(issueId).toString(),
        redmineQuery: {
          issue: {
            status_id: redmineStatusId
          }
        }
      };

      await this.$store.dispatch("issues/updateIssue", updateData);

      const addData = {
        issue_id:issueId,
        user_id:currentProfile.id,
        user_name:currentProfile.name,
        description:modificationComment
      };
      await this.$store.dispatch("issues/addKanbanComment", addData);
    }


  },

  async moveToAnotherStatus(issue,moveForward) {

    let actionIsPossible = false;
    let currentStatus = 0;
    let newStatus = 0;

    if (issue) {
      currentStatus = Number(issue.kanban_status_id) - 1;
      if (moveForward===true) {
        newStatus = Number(issue.kanban_status_id);
      } else {
        newStatus = Number(issue.kanban_status_id) -2;
      }
    }

    if ((currentStatus>=0&&currentStatus<=this.kanban_data.length-1)&&(newStatus>=0&&newStatus<=this.kanban_data.length-1)) {
      actionIsPossible = true;
    }

    if (actionIsPossible) {
      const tasksFrom = this.kanban_data[currentStatus].tasks;
      const tasksTo = this.kanban_data[newStatus].tasks;
      tasksTo.push({...issue,kanban_status_id:newStatus+1});
      const index = tasksFrom.indexOf(issue);
      if (index > -1) {
        tasksFrom.splice(index, 1);

        const updateFilter = {
            where:
              {
                  issue_id: issue.issue_id,
                  // executor_id: this.filterExecutor
              }
          };
        const updateContent = {
          kanban_status_id:newStatus+1
          };
        const updateData = {
          updateFilter:JSON.stringify(updateFilter),
          updateContent:JSON.stringify(updateContent)
        };

        await this.$store.dispatch("issues/updateKanbanIssue", updateData, updateData);
        await this.makeChangesInRedmine(updateData);

      }
    }
  },

  moveBack(issue) {
    console.log(issue);
  },

  async closeTask(issue) {
    if (issue) {
      const currentStatus = Number(issue.kanban_status_id) - 1;
      const tasksFrom = this.kanban_data[currentStatus].tasks;
      const index = tasksFrom.indexOf(issue);
      if (index > -1) {
        tasksFrom.splice(index, 1);
        const deleteFilter = {
            where:
              {
                  issue_id: issue.issue_id,
                  // executor_id: this.filterExecutor
              }
          };
        const updateData = {
          deleteFilter:JSON.stringify(deleteFilter),
        };
        await this.$store.dispatch("issues/deleteKanbanIssue", updateData, updateData);

        const redmineUpdateFilter = {
            where:
              {
                  issue_id: issue.issue_id,
                  // executor_id: this.filterExecutor
              }
          };
        const redmineUpdateContent = {
          acceptIssue:true
          };
        const redmineUpdateData = {
          updateFilter:JSON.stringify(redmineUpdateFilter),
          updateContent:JSON.stringify(redmineUpdateContent)
        };
        await this.makeChangesInRedmine(redmineUpdateData);

      }
    }
  },

async deleteTask(issue) {
    if (issue) {
      const currentStatus = Number(issue.kanban_status_id) - 1;
      const tasksFrom = this.kanban_data[currentStatus].tasks;
      const index = tasksFrom.indexOf(issue);
      if (index > -1) {
        tasksFrom.splice(index, 1);
        const deleteFilter = {
            where:
              {
                  issue_id: issue.issue_id,
                  executor_id: this.filterExecutor
              }
          };
        const updateData = {
          deleteFilter:JSON.stringify(deleteFilter),
        };
        await this.$store.dispatch("issues/deleteKanbanIssue", updateData, updateData);

        const redmineUpdateFilter = {
            where:
              {
                  issue_id: issue.issue_id,
              }
          };
        const redmineUpdateContent = {
          kanban_status_id:6
          };
        const redmineUpdateData = {
          updateFilter:JSON.stringify(redmineUpdateFilter),
          updateContent:JSON.stringify(redmineUpdateContent)
        };
        await this.makeChangesInRedmine(redmineUpdateData);

      }
    }
  },

  async makeTaskImportant(issue) {

    const updateFilter = {
        where:
          {
              issue_id: issue.issue_id,
              executor_id: this.filterExecutor
          }
      };
    const updateContent = {
      important_issue:1
      };
    const updateData = {
      updateFilter:JSON.stringify(updateFilter),
      updateContent:JSON.stringify(updateContent)
    };
    await this.$store.dispatch("issues/updateKanbanIssue", updateData, updateData);

  },

  async columnChanged(column) {
    let column_id;
    let issue_id;

    this.kanban_data.forEach((el)=>
      {
        const foundTask = el.tasks.find(cTask => cTask.issue_id===column.removed?.element.issue_id);
        if (foundTask) {
          column_id = el.id;
          issue_id = foundTask.issue_id;
        }
      });
      if (column_id&&issue_id) {

        const updateFilter = {
            where:
              {
                  issue_id: issue_id,
                  // executor_id: this.filterExecutor
              }
          };
        const updateContent = {
          kanban_status_id:column_id
          };
        const updateData = {
          updateFilter:JSON.stringify(updateFilter),
          updateContent:JSON.stringify(updateContent)
        };
        await this.$store.dispatch("issues/updateKanbanIssue", updateData, updateData);
        await this.makeChangesInRedmine(updateData);

      }

  },

  }
};
</script>

<style src="spinkit/spinkit.min.css"></style>

<style scoped>
.draggable-container {
  height: 100%;
}
</style>

<style>

 .carusel-body{
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
  float:right;
}

.sticky {
  position: fixed;
  bottom: 60px;
  right: 0;
  width: 300px;
  border: 3px solid #73AD21;
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
    z-index:99999;
    bottom: 60px;
    right: 100px;
  }
}

@media screen and (max-width: 700px) {
  .task-board {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .task-column {
    width: 100%;
  }
  .add_button {
    position: fixed;
    z-index:99999;
    bottom: 60px;
    right: 20px;
  }
}
</style>
