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
        <CDataTable
          :items="project_details"
          :fields="project_details_fields"
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
        <h6 class="modal-title">Szczegóły projektu</h6>
        <CButtonClose @click="projectDetailsVisible===false" class="text-white"/>
      </template>
    </CModal>

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
        <template #id="{item}">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="goToProject(item.id)"
            >
              {{item.id}}
            </CButton>
          </td>
        </template>
        <template #name="{item}">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="showProjectDetails(item.id)"
            >
              {{item.name}}
            </CButton>
          </td>
        </template>
      </CDataTable>
    </CCardBody>
  </CCard>
</template>

<script>
import moment from "moment";
import sequrityCheck from '../plugins/sequrityCheck'


const fields = [

  { key:'id', title:'Kod', _style:'max-width:10%'},
  { key:'name', title:'Nazwa'},
  { key:'created_on', title: 'Utworzono'},

// { 
  //   key: 'show_modal', 
  //   label: '', 
  //   _style: 'min-width:1%'
  // }
]

export default {

  name: 'AdvancedTables',

  data () {
      return {
        projectDetailsVisible:false,
        project_details:[],
        project_details_fields:[],
        showCarusel:true,
        dataArray:[],
    // dataArray: usersData.map((item, id) => { return {...item, id}}),
        fields,
        details: [],
        collapseDuration: 0
    }
  },

async created() {
    sequrityCheck(this);
    this.showCarusel = true;
    await this.initialize().then(() => {
      this.showCarusel = false;
    }).catch((err) => {
        console.log(err);
        this.showCarusel = false;
    });
  },


methods: {

  async initialize() {
      await this.$store.dispatch("projects/findAll", {}).then((dataObject)=>{
          let projectsData = [];
          dataObject.forEach(str => {
            str.forEach(el => {
              projectsData.push({
                created_on:moment(el.created_on).format('YYYY-MM-DD'),
                id:el.id,
                is_public:el.is_public,
                name:el.name,
                status:el.stauts,
                updated_on:moment(el.updated_on).format('YYYY-MM-DD')
              })
          })
          });
          this.dataArray = projectsData;   

      }).catch(err=>{
        console.log(err);
        this.dataArray = [];
      });
  },

  getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: 'primary'
      }
    },

  async showProjectDetails(projectId) {

    this.projectDetailsVisible = true;
    const dataObject = await this.$store.dispatch("issues/findAll",{
      project_id:projectId,
      include:"journals",
      status_id:"open"
      });

    const params = {
      where: {
            project_id: projectId
        }
      };
    const kanbanTasks = await this.$store.dispatch("issues/getKanbanIssueByProject", params);

    console.log('project tasks', dataObject);
    console.log('kanban tasks', kanbanTasks);

  },
  toggleDetails (item) {
    this.$set(this.dataArray[item.id], '_toggled', !item._toggled)
    this.collapseDuration = 300
    this.$nextTick(() => { this.collapseDuration = 0})
  },

  async goToProject(projectId) {      
        if (projectId) {
          this.$store.dispatch("projects/setFilterProject", projectId);
          this.$router.push({ name: "TasksList" , params:{projectId:projectId}});
        }
      },
  }
}
</script>

<style src="spinkit/spinkit.min.css"></style>

<style scoped>
.card-body div{
  margin: auto;
}
</style>

