<template>
  <div>
    <CCard>
      <CNavbar>
        <CForm inline>
          <CButton color="outline-primary" class="my-2 my-sm-0" type="submit"
            >Poprzedni</CButton
          >
          <CInput
            class="datePicker"
            v-model="date_from"
            type="date"
            horizontal
          />
          <CInput class="datePicker" v-model="date_to" type="date" horizontal />
          <CButton color="outline-primary" class="my-2 my-sm-0" type="submit"
            >Następny</CButton
          >
        </CForm>

        <div class="btn-group float-right">
          <CButton
            @click="initialize"
            color="success"
            class="my-2 my-sm-0"
            type="submit"
            >Odśwież
          </CButton>
        </div>
      </CNavbar>
    </CCard>
    <CCard>
      <CCardBody>
        <CTabs>
          <CTab
            v-for="(value, key) in projectsArray"
            :key="key"
            :title="value.name"
          >
            <div
              v-for="(executorValue, executorKey) in getCurrentExecutorsArray(
                value.filterStr
              )"
              :key="executorKey"
            >
              <p></p>
              <CRow>
                <CCol sm="5">
                  <CButton
                    color="outline-primary"
                    class="my-2 my-sm-0"
                    type="submit"
                    >{{ executorValue.name }}
                  </CButton>
                  <!-- <div class="small text-muted">November 2017</div> -->
                </CCol>
              </CRow>
              <!-- <CRow class="text-center">
                <CCol md sm="12" class="mb-sm-2 mb-0">
                  <div class="text-muted">Visits</div>
                  <strong>29.703 Users (40%)</strong>
                  <CProgress
                    class="progress-xs mt-2"
                    :precision="1"
                    color="success"
                    :value="40"
                  />
                </CCol>
                <CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
                  <div class="text-muted">Unique</div>
                  <strong>24.093 Users (20%)</strong>
                  <CProgress
                    class="progress-xs mt-2"
                    :precision="1"
                    color="info"
                    :value="20"
                  />
                </CCol>
                <CCol md sm="12" class="mb-sm-2 mb-0">
                  <div class="text-muted">Pageviews</div>
                  <strong>78.706 Views (60%)</strong>
                  <CProgress
                    class="progress-xs mt-2"
                    :precision="1"
                    color="warning"
                    :value="60"
                  />
                </CCol>
                <CCol md sm="12" class="mb-sm-2 mb-0">
                  <div class="text-muted">New Users</div>
                  <strong>22.123 Users (80%)</strong>
                  <CProgress
                    class="progress-xs mt-2"
                    :precision="1"
                    color="danger"
                    :value="80"
                  />
                </CCol>
                <CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
                  <div class="text-muted">Bounce Rate</div>
                  <strong>Average Rate (40.15%)</strong>
                  <CProgress
                    class="progress-xs mt-2"
                    :precision="1"
                    :value="40"
                  />
                </CCol>
              </CRow> -->
              <ProjectStatisticsChart
                :chartDataSet="executorValue.dataSet"
                :chartLabels="chartLabels"
                style="height: 300px; margin-top: 40px"
              />
            </div>
          </CTab>
          <CTab title="Czas pracy w Hubstaff"> </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import ProjectStatisticsChart from '../components/ProjectStatisticsChart';
import sequrityCheck from '../plugins/sequrityCheck';
import moment from 'moment';
import { getStyle, hexToRgba } from '@coreui/utils/src';

export default {
  name: 'Dashboard',
  components: {
    ProjectStatisticsChart,
  },
  data() {
    return {
      selected: 'Month',
      date_from: moment(new Date()).format('YYYY-MM-DD'),
      date_to: moment(new Date()).format('YYYY-MM-DD'),
      projectsArray: [],
      executorsArray: [],
      chartLabels: [],
    };
  },
  async created() {
    sequrityCheck(this);
    this.initialize();
  },

  methods: {
    getCurrentExecutorsArray(filterProject) {
      const result = this.executorsArray.filter(
        (executor) => executor.filterProjectStr === filterProject
      );
      // console.log(result);
      return result;
    },

    getFormatedDateLabel(curDate) {
      let dateStr = curDate.substring(5, 10);
      dateStr = dateStr.replace('-', '/');
      let timeStr = curDate.substring(11, 16);
      return dateStr + '(' + timeStr + ')';
    },

    async getExecutorsArray() {
      const executorsFilter = {
        date_from: this.date_from,
        date_to: this.date_to,
      };
      const statisticsExecutors = await this.$store.dispatch(
        'projects/getStatisticsProjectExecutors',
        executorsFilter
      );
      const resArray = [];
      for await (let element of statisticsExecutors.data) {
        let curExecutor = JSON.parse(element.assigned_to);
        if (curExecutor != null) {
          curExecutor.filterProjectStr = element.project;
          curExecutor.filterAssignedStr = element.assigned_to;

          const statusesFilter = {
            date_from: this.date_from,
            date_to: this.date_to,
            project: element.project,
            assigned_to: element.assigned_to,
          };

          const statusesData = await this.$store.dispatch(
            'projects/getStatisticsProjectStatuses',
            statusesFilter
          );

          const brandSuccess = getStyle('success') || '#4dbd74';
          const brandInfo = getStyle('info') || '#20a8d8';
          const brandDanger = getStyle('danger') || '#f86c6b';

          let statusObject = {
            label: '',
            key: '',
            backgroundColor: hexToRgba(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: brandInfo,
            borderWidth: 2,
            data: [],
          };
          let executorDataSet = [];
          statusesData.data.forEach((statusItem) => {
            if (statusObject.key != statusItem.status) {
              if (statusObject.data.length > 0) {
                statusObject.data = Array.from(statusObject.data);
                executorDataSet.push(JSON.parse(JSON.stringify(statusObject)));
              }
              statusObject.key = statusItem.status;
              statusObject.label = JSON.parse(statusItem.status).name;
              statusObject.data = [];
            } else {
              statusObject.data.push(Number(statusItem.issue_cnt));
            }
          });
          curExecutor.dataSet = executorDataSet;
          resArray.push(JSON.parse(JSON.stringify(curExecutor)));
        }
      }
      return resArray;
    },

    async initialize() {
      const periodsFilter = {
        date_from: this.date_from,
        date_to: this.date_to,
      };

      const statisticsPeriods = await this.$store.dispatch(
        'projects/getStatisticsPeriods',
        periodsFilter
      );

      this.chartLabels = [];
      if (statisticsPeriods.data) {
        statisticsPeriods.data.forEach((element) => {
          this.chartLabels.push(this.getFormatedDateLabel(element.stat_date));
        });
      }

      this.executorsArray = await this.getExecutorsArray();
      console.log(this.executorsArray);

      const statisticsProjects = await this.$store.dispatch(
        'projects/getStatisticsProjects',
        periodsFilter
      );
      this.projectsArray = [];
      if (statisticsProjects.data) {
        statisticsProjects.data.forEach((element) => {
          const curProject = JSON.parse(element.project);
          curProject.filterStr = element.project;
          this.projectsArray.push(curProject);
        });
      }

      // const statisticsStatuses = await this.$store.dispatch(
      //   'projects/getStatisticsProjectStatuses',
      //   periodsFilter
      // );

      // console.log('periods', statisticsPeriods);
      // console.log('projects', statisticsProjects);
      // console.log('statuses', statisticsStatuses);
      // console.log('executors', statisticsExecutors);

      // const brandSuccess = getStyle('success') || '#4dbd74';
      // const brandInfo = getStyle('info') || '#20a8d8';
      // const brandDanger = getStyle('danger') || '#f86c6b';

      // let elements = 27;
      // const data1 = [];
      // const data2 = [];
      // const data3 = [];

      // for (let i = 0; i <= elements; i++) {
      //   // data1.push(random(50, 200));
      //   // data2.push(random(80, 100));
      //   // data3.push(65);
      // }
      // const dataSet = [
      //   {
      //     label: 'My First dataset',
      //     backgroundColor: hexToRgba(brandInfo, 10),
      //     borderColor: brandInfo,
      //     pointHoverBackgroundColor: brandInfo,
      //     borderWidth: 2,
      //     data: data1,
      //   },
      //   {
      //     label: 'My Second dataset',
      //     backgroundColor: 'transparent',
      //     borderColor: brandSuccess,
      //     pointHoverBackgroundColor: brandSuccess,
      //     borderWidth: 2,
      //     data: data2,
      //   },
      //   {
      //     label: 'My Third dataset',
      //     backgroundColor: 'transparent',
      //     borderColor: brandDanger,
      //     pointHoverBackgroundColor: brandDanger,
      //     borderWidth: 1,
      //     borderDash: [8, 5],
      //     data: data3,
      //   },
      // ];

      // console.log(projectData);
    },

    color(value) {
      let $color;
      if (value <= 25) {
        $color = 'info';
      } else if (value > 25 && value <= 50) {
        $color = 'success';
      } else if (value > 50 && value <= 75) {
        $color = 'warning';
      } else if (value > 75 && value <= 100) {
        $color = 'danger';
      }
      return $color;
    },
  },
};
</script>

<style lang="scss" scoped>
.datePicker {
  margin-right: 10px;
  margin-left: 10px;
}
</style>
