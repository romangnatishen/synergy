<template>
  <CCard>
    <CCardBody
      v-if="showCarusel === true"
      class="c-app flex-row align-items-center"
    >
      <div class="sk-grid carusel-body">
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
      :show.sync="showEventDetails"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Szczegóły wydarzenia"
      size="lg"
      color="dark"
    >
      <CCardBody>
        <CInput v-model="eventTittle" placeholder="Temat" horizontal />
        <CSelect
          :options="projectList"
          :value.sync="filterProject"
          placeholder="Projekt"
          horizontal
        />
        <CTextarea
          v-model="eventDescription"
          placeholder="Opis wydarzenia"
          horizontal
          rows="4"
        />
        <CForm inline class="date-rows">
          <CInput
            class="date-items"
            label="Od"
            v-model="dateFrom"
            type="date"
            horizontal
          />
          <CSelect
            :options="hoursArray"
            :value.sync="start_hours"
            add-wrapper-classes="ml-2"
          />
          <CSelect
            :options="minutesArray"
            :value.sync="start_minutes"
            add-wrapper-classes="ml-2"
          />
        </CForm>
        <CForm inline class="date-rows">
          <CInput
            class="date-items"
            label="Do"
            v-model="dateTo"
            type="date"
            horizontal
          />
          <CSelect
            :options="hoursArray"
            :value.sync="end_hours"
            add-wrapper-classes="ml-2"
          />
          <CSelect
            :options="minutesArray"
            :value.sync="end_minutes"
            add-wrapper-classes="ml-2"
          />
        </CForm>
        <CRow class="switch-items">
          <CSwitch
            class="mx-1"
            color="primary"
            name="inviteOthers"
            :checked.sync="addOtherParticepants"
          />
          <h6 class="switch-description">Dołącz innych</h6>
        </CRow>

        <CDataTable
          v-if="addOtherParticepants === true"
          :items="users"
          :fields="fields"
          column-filter
          table-filter
          items-per-page-select
          :items-per-page="5"
          sorter
          pagination
          clickable-rows
          hover
          @row-clicked="rowClicked"
        >
          <template #select="{ item }">
            <td>
              <CInputCheckbox
                :checked="item._selected"
                @update:checked="() => check(item)"
                custom
              />
            </td>
          </template>
        </CDataTable>
      </CCardBody>
      <template #header>
        <h6 class="modal-title">Szczegóły wydarzenia</h6>
        <CButtonClose @click="cancelEventModification" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="saveEvent()" color="success">Zapisz zmiany</CButton>
        <CButton @click="cancelEventModification" color="danger"
          >Cofnij</CButton
        >
      </template>
    </CModal>

    <CCardHeader>
      <CForm inline>
        <CSelect
          class="header-items"
          :options="executorsList"
          :value.sync="filterExecutor"
          label="Kalendarz  "
          add-wrapper-classes="ml-2"
        />

        <CSelect
          class="header-items"
          :options="['month', 'week']"
          :value.sync="displayPeriod"
          label="Wariant  "
          add-wrapper-classes="ml-2"
        />

        <CButton color="success" @click="addNewEvent()">
          <CIcon name="cil-notes" /> Dodaj wydarzenie
        </CButton>
      </CForm>
    </CCardHeader>
    <CCardBody v-if="showCarusel === false">
      <calendar-view
        id="calendar"
        :events="eventsArray"
        enable-drag-drop
        :show-date="showDate"
        :displayPeriodUom="displayPeriod"
        currentPeriodLabel="icons"
        :class="themeClasses"
        @click-date="onClickDay"
        @click-event="onClickEvent"
        @drop-on-date="onDrop"
        @show-date-change="setShowDate"
        ref="calendarView"
      >
        <calendar-view-header
          slot="header"
          slot-scope="{ headerProps }"
          :header-props="headerProps"
          @input="setShowDate"
        />
      </calendar-view>
    </CCardBody>
    <CCardFooter>
      <CForm inline>
        <h4 class="ml-auto my-auto">
          <CBadge v-if="message" color="primary">{{ message }}</CBadge>
        </h4>
      </CForm>
    </CCardFooter>
  </CCard>
</template>

<script>
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin,
} from 'vue-simple-calendar';

import 'vue-simple-calendar/static/css/default.css';
import 'vue-simple-calendar/static/css/holidays-us.css';

// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css';
import generalFunctions from '../plugins/generalFunctions';

const currDate = new Date();
const currYear = currDate.getFullYear();
const currMonth = currDate.getMonth();

// const sampleEvents = [
//   {
//     title: 'All Day Event very long title',
//     allDay: true,
//     startDate: new Date(currYear, currMonth, 0),
//     endDate: new Date(currYear, currMonth, 1),
//   },
//   {
//     title: 'Long Event',
//     startDate: new Date(currYear, currMonth, 7),
//     endDate: new Date(currYear, currMonth, 10),
//   },

//   {
//     title: 'DTS STARTS',
//     startDate: new Date(currYear + 1, 2, 13, 0, 0, 0),
//     endDate: new Date(currYear + 1, 2, 20, 0, 0, 0),
//   },

//   {
//     title: 'DTS ENDS',
//     startDate: new Date(currYear + 1, 10, 6, 0, 0, 0),
//     endDate: new Date(currYear + 1, 10, 13, 0, 0, 0),
//   },

//   {
//     title: 'Some Event',
//     startDate: new Date(currYear, currMonth, 9, 0, 0, 0),
//     endDate: new Date(currYear, currMonth, 9, 0, 0, 0),
//   },
//   {
//     title: 'Conference',
//     startDate: new Date(currYear, currMonth, 11),
//     endDate: new Date(currYear, currMonth, 13),
//     desc: 'Big conference for important people',
//     classes: 'orange'
//   },
//   {
//     title: 'Meeting',
//     startDate: new Date(currYear, currMonth, 12, 10, 30, 0, 0),
//     endDate: new Date(currYear, currMonth, 12, 12, 30, 0, 0),
//     desc: 'Pre-meeting meeting, to prepare for the meeting',
//   },
//   {
//     title: 'Lunch',
//     startDate: new Date(currYear, currMonth, 12, 12, 0, 0, 0),
//     endDate: new Date(currYear, currMonth, 12, 13, 0, 0, 0),
//     desc: 'Power lunch',
//   },
//   {
//     title: 'Meeting',
//     startDate: new Date(currYear, currMonth, 14, 14, 0, 0, 0),
//     endDate: new Date(currYear, currMonth, 14, 15, 0, 0, 0),
//   },
//   {
//     title: 'Happy Hour',
//     startDate: new Date(currYear, currMonth, 12, 17, 0, 0, 0),
//     endDate: new Date(currYear, currMonth, 12, 17, 30, 0, 0),
//     desc: 'Most important meal of the day',
//     classes: 'primary'
//   },
//   {
//     title: 'Dinner',
//     startDate: new Date(currYear, currMonth, 26, 20, 0, 0, 0),
//     endDate: new Date(currYear, currMonth, 26, 21, 0, 0, 0),
//     classes: 'success'
//   },
//   {
//     title: 'Birthday Party',
//     startDate: new Date(currYear, currMonth, 13, 7, 0, 0),
//     endDate: new Date(currYear, currMonth, 13, 10, 30, 0),
//   },
//   {
//     title: 'Birthday Party 2',
//     startDate: new Date(currYear, currMonth, 24, 17, 0, 0),
//     endDate: new Date(currYear, currMonth, 24, 18, 30, 0),
//     classes: 'primary'
//   },
//   {
//     title: 'Late Night Event',
//     startDate: new Date(currYear, currMonth, 17, 19, 30, 0),
//     endDate: new Date(currYear, currMonth, 18, 2, 0, 0),
//     classes: 'danger'
//   },
//   {
//     title: 'Multi-day Event',
//     startDate: new Date(currYear, currMonth, 20, 19, 30, 0),
//     endDate: new Date(currYear, currMonth, 22, 2, 0, 0),
//   }
// ]

export default {
  name: 'Calendar',
  mixins: [CalendarMathMixin],
  data: function () {
    return {
      message: '',
      showCarusel: false,
      showEventDetails: false,
      addOtherParticepants: false,
      hoursArray: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ],
      minutesArray: [
        '00',
        '05',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
        '55',
      ],
      eventTittle: '',
      eventDescription: '',
      dateFrom: '',
      dateTo: '',
      start_hours: '',
      start_minutes: '',
      end_hours: '',
      end_minutes: '',
      showDate: currDate,
      displayPeriod: 'month',
      useDefaultTheme: true,
      useHolidayTheme: true,
      executorsList: [],
      filterExecutor: '',
      filterProject: 0,
      projectList: [],
      currentEvent: 0,
      eventsArray: [],
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

  components: {
    CalendarView,
    CalendarViewHeader,
  },
  computed: {
    themeClasses() {
      return {
        'theme-default': this.useDefaultTheme,
        'holiday-us-traditional': this.useHolidayTheme,
        'holiday-us-official': this.useHolidayTheme,
      };
    },
  },
  methods: {
    clearNewEventFields() {
      this.currentEvent = 0;
      this.filterProject = 0;
      this.eventTittle = '';
      this.eventDescription = '';
      this.dateFrom = '';
      this.dateTo = '';
      this.start_hours = '';
      this.start_minutes = '';
      this.end_hours = '';
      this.end_minutes = '';
    },

    async initialize() {
      this.executorsList = await generalFunctions.redmineExecutorsList(
        this.$store
      );
      const projectData = await this.$store.dispatch('projects/findAll', {});
      if (projectData) {
        projectData.forEach((el) => {
          el.forEach((projectItem) => {
            this.projectList.push({
              value: projectItem.id,
              label: projectItem.name,
            });
          });
        });
      }
    },

    cancelEventModification() {
      this.showEventDetails = false;
      this.clearNewEventFields();
    },

    async saveEvent() {
      const eventData = {
        params: {
          id: this.currentEvent,
        },
        body: {
          tittle: this.eventTittle,
          project_id: this.filterProject,
          description: this.eventDescription,

          start_date: this.dateFrom,
          start_hours: this.start_hours,
          start_minutes: this.start_minutes,

          end_date: this.dateTo,
          end_hours: this.end_hours,
          end_minutes: this.end_minutes,
        },
      };
      let resEvent;
      if (this.currentEvent > 0) {
        resEvent = await this.$store.dispatch(
          'calendar/updateEvent',
          eventData
        );
      } else {
        resEvent = await this.$store.dispatch(
          'calendar/createEvent',
          eventData
        );
      }

      if (resEvent.data?.id) {
        let curStartDate =
          Date.parse(this.dateFrom) + Number(this.start_hours) + 3600;
        if (this.start_minutes != '') {
          curStartDate = curStartDate + Number(this.start_minutes) * 60;
        }
        let curEndDate =
          Date.parse(this.dateTo) + Number(this.end_hours) + 3600;
        if (this.end_minutes != '') {
          curEndDate = curEndDate + Number(this.end_minutes) * 60;
        }
        const resultArray = this.eventsArray.filter(
          (el) => el.id != resEvent.data.id
        );

        this.eventsArray = resultArray;
        this.eventsArray.push({
          id: resEvent.data.id,
          title: this.eventTittle,
          description: this.eventDescription,
          project_id: this.filterProject,
          startDate: curStartDate,
          dateFrom: this.dateFrom,
          startHours: this.start_hours,
          startMinutes: this.start_minutes,
          dateTo: this.dateTo,
          endDate: curEndDate,
          endHours: this.end_hours,
          endMinutes: this.end_minutes,
          classes: 'success',
        });
      }
      this.showEventDetails = false;
      this.clearNewEventFields();
    },

    modifyEvent(event) {
      if (event.originalEvent) {
        const currentEvent = event.originalEvent;
        this.currentEvent = currentEvent.id;
        this.eventTittle = currentEvent.title;
        this.filterProject = currentEvent.project_id;
        this.eventDescription = currentEvent.description;

        this.dateFrom = currentEvent.dateFrom;
        this.start_hours = currentEvent.startHours;
        this.start_minutes = currentEvent.startMinutes;

        this.dateTo = currentEvent.dateTo;
        this.end_hours = currentEvent.endHours;
        this.end_minutes = currentEvent.endMinutes;

        this.showEventDetails = true;
      }
    },

    addNewEvent() {
      this.showEventDetails = true;
    },
    setShowDate(d) {
      this.showDate = d;
    },
    onClickDay(d) {
      this.message = `You clicked: ${d.toLocaleDateString()}`;
    },
    onClickEvent(e) {
      this.modifyEvent(e);
    },
    onDrop(event, date) {
      this.message = `Moved: ${
        event.title || event.id
      } to ${date.toLocaleDateString()}`;
      // Determine the delta between the old start date and the date chosen,
      // and apply that delta to both the start and end date to move the event.
      const eLength = this.dayDiff(event.startDate, date);
      event.originalEvent.startDate = this.addDays(event.startDate, eLength);
      event.originalEvent.endDate = this.addDays(event.endDate, eLength);
    },
  },
};
</script>

<style src="spinkit/spinkit.min.css"></style>

<style lang="scss">
@import '../assets/scss/style';

.carusel-body {
  margin: auto;
}

.date-rows {
  margin-top: 10px;
  vertical-align: middle;
}

.switch-items {
  vertical-align: middle;
  margin-top: 10px;
  margin-left: 10px;
}
.switch-description {
  margin-left: 10px;
  vertical-align: middle;
}

.date-items {
  margin-right: 20px;
}

.header-items {
  margin-left: 10px;
  margin-right: 10px;
  vertical-align: middle;
}
#calendar {
  color: $body-color;
  height: 63vh;
  margin-left: auto;
  margin-right: auto;
}
.theme-default .cv-event {
  background-color: #c8ced3;
  border-color: $table-border-color;
  color: $body-color;
}
.theme-default .cv-event.success {
  background-color: $success;
  border-color: lighten($success, 5%);
}
.theme-default .cv-event.danger {
  background-color: $danger;
}
.theme-default .cv-event.primary {
  background-color: #20a8d8;
}
.theme-default .cv-event.orange {
  background-color: #f8cb00;
  border-color: lighten(#f8cb00, 5%);
}
.theme-default .cv-day.today {
  background-color: $gray-300;
}
.theme-default .cv-day.today > .cv-day-number {
  background-color: #20a8d8;
  border-radius: 50%;
  position: absolute;
  left: 0;
}
.theme-default .cv-day.past {
  background-color: $body-bg;
}
.theme-default .cv-day.outsideOfMonth {
  background-color: $body-bg;
}
.theme-default .cv-weeks,
.theme-default .cv-day {
  border-color: $table-border-color;
}
.theme-default .cv-header,
.theme-default .cv-header-days,
.theme-default .cv-header-day {
  background-color: #e4e5e6;
  border-color: $table-border-color;
  border-style: solid;
}
.theme-default .cv-header-nav > button {
  color: $body-color;
  background-color: $input-bg;
  border-color: $input-border-color;
}
.theme-default .cv-day.draghover {
  box-shadow: inset 0 0 0.2em 0.2em #321fdb;
}
</style>
