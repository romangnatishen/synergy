<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <!-- <slot name="header">
              <CIcon name="cil-grid"/> {{caption}}
            </slot> -->
            <CButton
              v-if="allowAddNew"
              :color="getColor(0)"
              class="m-2"
              shape="pill"
              @click="addNewUser()"
            >
              Dodaj
            </CButton>
            <CButton
              :color="getColor(0)"
              class="m-2"
              shape="pill"
              variant="outline"
              @click="initialize()"
            >
              Odśwież
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :sorter="true"
              :column-filter="true"
              :responsive="true"
              :items="dataArray"
              :fields="datafields"
              :items-per-page="10"
              pagination
            >
              <template #user_status="{ item }">
                <td>
                  <CBadge :color="getBadge(item.user_status)">{{
                    getStatusDescription(item.user_status)
                  }}</CBadge>
                </td>
              </template>
              <template #email="{ item }">
                <td class="py-2">
                  <CButton
                    @click="editUser(item.id)"
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                  >
                    {{ item.email }}
                  </CButton>
                </td>
              </template>
            </CDataTable>
            <!-- <CTableWrapper
          :items="dataArray"
          :fields="datafields"
          :tableFilter='{ external: true, lazy: true }'
          :columnFilter='{ external: true, lazy: true }'
          hover
          striped
          bordered
          small
          fixed
          caption="Awizacje"
        /> -->
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
// import CTableWrapper from './base/Table'
import sequrityCheck from '../plugins/sequrityCheck';

export default {
  name: 'Tables',
  data: () => ({
    allowAddNew: true,
    dataArray: [],
    user_status_list: [],
    datafields: [
      // {key:'id', label:'Kod'},
      { key: 'email', label: 'Email' },
      { key: 'name', label: 'Nazwa' },
      { key: 'user_status', label: 'Status' },
      { key: 'id', label: 'Kod' },
    ],
  }),
  created() {
    sequrityCheck(this);
    this.initialize();
  },

  // components: { CTableWrapper },

  methods: {
    getBadge(status) {
      return status === 'Aktywny'
        ? 'success'
        : status === 'Zablokowany'
        ? 'danger'
        : 'primary';
    },

    getStatusDescription(status) {
      return status === 'Aktywny'
        ? 'Aktywny'
        : status === 'Zablokowany'
        ? 'Zablokowany'
        : 'Brak statusu';
    },

    async initialize() {
      const currentProfile = this.$store.getters['profile/getProfile'];
      if (currentProfile) {
        if (currentProfile.role === 4) {
          this.allowAddNew = false;
        }
      }
      const dataObject = await this.$store.dispatch('profile/findAll', {});
      if (dataObject) {
        this.dataArray = dataObject.data;
      } else return (this.dataArray = []);

      // this.roles_list.push({ value: 1, label: 'Globalny administrator'});
      // this.roles_list.push({ value: 2, label: 'Globalny użytkownik'});
      // this.roles_list.push({ value: 3, label: 'Administrator klienta'});
      // this.roles_list.push({ value: 4, label: 'Uzytkownik klienta'});

      this.user_status_list.push({ value: 1, label: 'Aktywny' });
      this.user_status_list.push({ value: 2, label: 'Zablokowany' });

      // const clients_list = await this.$store.dispatch("clients/findAll", {});
      // if (clients_list) {
      //   this.clients_list = clients_list.data;

      // } else
      //   return this.clients_list = []

      if (this.dataArray) {
        for (let item of this.dataArray) {
          // const clientResult = this.clients_list.find(curClient => curClient.id === item.client_id);
          // if (clientResult) {
          //   item.client_id = clientResult.name;
          // } else {
          //   item.client_id = "";
          // }

          // const roleResult = this.roles_list.find(curRole => curRole.value === item.role);
          // if (roleResult) {
          //   item.role = roleResult.label;
          // } else {
          //   item.role = "";
          // }

          const statusResult = this.user_status_list.find(
            (curStatus) => curStatus.value === item.user_status
          );
          if (statusResult) {
            item.user_status = statusResult.label;
          } else {
            item.user_status = '';
          }
        }
      }
    },

    async editUser(userId) {
      const dataObject = await this.$store.dispatch('profile/findByPk', {
        params: {
          id: Number(userId),
        },
      });
      if (dataObject) {
        this.$router.push({ name: 'UserForm', params: { dataObject } });
      }
      // this.editedIndex = this.dataArray.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    addNewUser() {
      this.$router.push({ name: 'UserForm' });
    },
    getColor(pos) {
      const colorArray = ['success'];
      return colorArray[pos];
    },
  },
};
</script>
