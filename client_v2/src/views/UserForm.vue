<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>{{ getUserTittle() }}</strong>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CInput
            placeholder="Email"
            v-model="email"
            label="Email"
            horizontal
          />
          <CInput placeholder="Nazwa" v-model="name" label="Nazwa" horizontal />
          <CSelect
            label="Status"
            :value.sync="user_status"
            horizontal
            :options="status_list"
            placeholder="Bierzący status"
          />
          <CInput
            type="password"
            placeholder="Klicz API do integracji z Redmine"
            v-model="apiKey"
            label="Klucz API"
            horizontal
          />
          <CInput
            type="password"
            v-model="password"
            autocomplete="current-password"
            horizontal
            label="Hasło"
            placeholder="Wprowadż hasło..."
          />
          <CInput
            type="password"
            v-model="password_confirmation"
            horizontal
            autocomplete="current-password"
            label="Potwierdzenie hasła"
            placeholder="Potwierdzenie hasła..."
          />
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton @click="createUser()" type="submit" size="sm" color="success"
          ><CIcon name="cil-check-circle" /> Sapisz zmiany</CButton
        >
        <CButton @click="goBack()" type="reset" size="sm" color="info"
          ><CIcon name="cil-ban" /> Cofnij</CButton
        >
        <!-- <CButton @click="removeUser()" v-if="id>0" size="sm" color="danger"><CIcon name="cil-ban"/> Usuń bierzący</CButton> -->
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import sequrityCheck from '../plugins/sequrityCheck';

export default {
  name: 'Forms',
  data() {
    return {
      id: 0,
      email: '',
      name: '',
      user_status: 0,
      show: true,
      apiKey: '',
      password: '',
      password_confirmation: '',
      horizontal: { label: 'col-3', input: 'col-9' },
      formCollapsed: true,
    };
  },
  async created() {
    sequrityCheck(this);

    if (this.$route.params) {
      if (this.$route.params.dataObject) {
        this.user_status = this.$route.params.dataObject.user_status;
        this.id = this.$route.params.dataObject.id;
        this.email = this.$route.params.dataObject.email;
        this.name = this.$route.params.dataObject.name;
        // this.apiKey = this.$route.params.dataObject.redmine_api_key;
        this.user_status = this.$route.params.dataObject.user_status;
      }
    }

    // await this.$store.dispatch("clients/findAll", {}).then(
    //   (result)=>{
    //     var resArray = [];
    //     if (result.data) {
    //       for(var i of result.data) {
    //         resArray.push({ value: i.id, label: i.name});
    //       }
    //     }
    //     this.clients_list = resArray;
    //   })

    // const currentProfile = this.$store.getters['profile/getProfile'];
    // if (currentProfile) {
    //   this.role_list.push({ value: 4, label: 'Uzytkownik klienta'});
    //   if (currentProfile.role===1) {
    //     this.role_list.push({ value: 1, label: 'Globalny administrator'});
    //     this.role_list.push({ value: 2, label: 'Globalny użytkownik'});
    //     this.role_list.push({ value: 3, label: 'Administrator klienta'});

    //     this.clients_list.push({ value: null, label: "<<Nie wybrano>>>"});

    //   } else if (currentProfile.role===2) {
    //     this.role_list.push({ value: 3, label: 'Administrator klienta'});
    //     this.role_list.push({ value: 2, label: 'Globalny użytkownik'});
    //   }
    //   else if (currentProfile.role===3) {
    //     this.role_list.push({ value: 3, label: 'Administrator klienta'});
    //   }
    //   if (currentProfile.client_id&&!this.id) {
    //     this.client_id = currentProfile.client_id;
    //     this.role = 4;
    //     this.user_status = 1;
    //   }

    // }
    // role_list () {
    //   return [
    //     { value: 1, label: 'Globalny administrator'},
    //     { value: 2, label: 'Globalny użytkownik'},
    //     { value: 3, label: 'Administrator klienta'},
    //     { value: 4, label: 'Uzytkownik klienta'},
    //   ]
    // },
  },

  computed: {
    status_list() {
      return [
        { value: 1, label: 'Aktywny' },
        { value: 2, label: 'Zablokowany' },
      ];
    },

    showClientID() {
      return this.client_id;
    },
  },
  methods: {
    getUserTittle() {
      if (this.id > 0) {
        return 'Profil użytkownika ' + String(this.name);
      } else return 'Nowy użytkownik';
    },

    validator(val) {
      return val ? val.length >= 4 : false;
    },

    async removeAwizo() {
      const awizoAddParams = {
        params: {
          id: this.id,
        },
      };

      if (this.id > 0) {
        await this.$store
          .dispatch('profile/remove', awizoAddParams)
          .then((result) => {
            this.$router.push({ path: '/userslist' });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    goBack() {
      this.$router.push({ path: '/userslist' });
    },

    async createUser() {
      const userAddParams = {
        params: {
          id: this.id,
        },
        body: {
          user_status: this.user_status,
          email: this.email,
          name: this.name,
          redmine_api_key: this.apiKey,
          password: this.password,
          // weighing_date:this.weighing_date,
          // net_weight:this.net_weight,
        },
      };
      let res = '';

      if (this.id === 0) {
        res = await this.$store.dispatch('profile/registration', userAddParams);
      } else {
        res = await this.$store.dispatch('profile/update', userAddParams);
      }
      if (res) {
        this.$router.push({ path: '/userslist' });
      }
    },
  },
};
</script>
