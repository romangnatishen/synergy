<template>
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
        <!-- <template #status="{item}">
          <td>
            <CBadge :color="getBadge(item.status)">
              {{item.status}}
            </CBadge>
          </td>
        </template> -->
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

