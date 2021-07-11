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
                value.id
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
                    >{{ executorValue.executor_name }}
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
          <!-- <CTab title="Czas pracy w Hubstaff"> </CTab> -->
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
import generalFunctions from '../plugins/generalFunctions';

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

      const statisticsPeriods = await this.$store.dispatch(
        'projects/getStatisticsPeriods',
        executorsFilter
      );

      const statisticsStatuses = await this.$store.dispatch(
        'projects/getStatisticsStatuses',
        executorsFilter
      );

      this.chartLabels = [];
      if (statisticsPeriods.data) {
        statisticsPeriods.data.forEach((element) => {
          this.chartLabels.push(this.getFormatedDateLabel(element.stat_date));
        });
      }

      const statisticsExecutors = await this.$store.dispatch(
        'projects/getStatisticsProjectExecutors',
        executorsFilter
      );

      const resArray = [];
      for await (let element of statisticsExecutors.data) {
        let curExecutor = {
          executor_id: element.executor_id,
          executor_name: element.executor_name,
          filterProjectStr: element.project_id,
          filterAssignedStr: element.executor_id,
        };
        if (curExecutor != null) {
          const statusesFilter = {
            date_from: this.date_from,
            date_to: this.date_to,
            project_id: element.project_id,
            executor_id: element.executor_id,
          };

          const statusesData = await this.$store.dispatch(
            'projects/getStatisticsProjectStatuses',
            statusesFilter
          );

          const executorDataSet = [];
          statisticsStatuses.data.forEach((statusItem) => {
            const issuePeriodArray = [];
            let issueTotalCount = 0;
            statisticsPeriods.data.forEach((periodItem) => {
              const foundData = statusesData.data.find((el) => {
                if (
                  el.stat_date === periodItem.stat_date &&
                  Number(el.kanban_status_id) ===
                    Number(statusItem.kanban_status_id)
                ) {
                  return el;
                }
              });
              let issueCount = 0;
              if (foundData) {
                issueCount = foundData.issue_cnt;
              }
              issueTotalCount = issueTotalCount + issueCount;
              issuePeriodArray.push(issueCount);
            });
            let currentLabel = '';
            const kanbanItem = generalFunctions
              .kanbanData()
              .find(
                (kanbanItem) => kanbanItem.id === statusItem.kanban_status_id
              );
            if (kanbanItem) {
              currentLabel = kanbanItem.title;
            }

            let statusObject = {
              label: currentLabel,
              key: statusItem.kanban_status_id,
              backgroundColor: hexToRgba('#FFFFFF', 10),
              borderColor: kanbanItem.color,
              pointHoverBackgroundColor: kanbanItem.color,
              borderWidth: 2,
              data: issuePeriodArray,
            };
            if (issueTotalCount > 0) {
              executorDataSet.push(JSON.parse(JSON.stringify(statusObject)));
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

      const statisticsProjects = await this.$store.dispatch(
        'projects/getStatisticsProjects',
        periodsFilter
      );
      this.projectsArray = [];
      if (statisticsProjects.data) {
        statisticsProjects.data.forEach((element) => {
          const curProject = {
            name: element.project_name,
            id: element.project_id,
          };
          this.projectsArray.push(curProject);
        });
      }

      this.executorsArray = await this.getExecutorsArray();
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
