<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="5">
          <CCard class="p-4">
            <CCardBody>
              <CForm>
                <h1>Login</h1>
                <p class="text-muted">
                  Portal do organizacji współpracy na projektach
                </p>
                <CInput
                  v-model="login"
                  placeholder="Nazwa użytkownika"
                  autocomplete="username email"
                >
                  <template #prepend-content
                    ><CIcon name="cil-user"
                  /></template>
                </CInput>
                <CInput
                  v-model="password"
                  placeholder="Hasło"
                  type="password"
                  autocomplete="curent-password"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                </CInput>
                <CAlert
                  color="danger"
                  :show.sync="invalidUserData"
                  closeButton
                  fade
                >
                  Nie udało się zalogować. Sprawdż poprawność wprowadzonych
                  danych.
                  <!-- <CProgress
                    :max="10"
                    :value="invalidUserData"
                    height="3px"
                    color="danger"
                    animate
                  /> -->
                </CAlert>
                <CCol>
                  <CButton color="primary" @click="userLogin()"
                    >Zaloguj się</CButton
                  >
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { DeviceUUID } from 'device-uuid';

export default {
  name: 'Login',
  data: () => ({
    invalidUserData: false,
    login: '',
    password: '',
    message: '',
    uuid: '',
  }),
  mounted() {
    this.uuid = new DeviceUUID().get();
    // const du = new DeviceUUID().parse();
    // console.log(du);
  },

  methods: {
    async userLogin() {
      if (!this.login) {
        this.message = 'Login is required';
        return;
      }
      if (!this.password) {
        this.message = 'Password is required';
        return;
      }
      await this.$store
        .dispatch('profile/login', {
          email: this.login,
          password: this.password,
          uuid: this.uuid,
        })
        .then(async (res) => {
          localStorage.setItem('access_token', res.data.access_token);
          await this.$store
            .dispatch('profile/fetchProfile')
            .then((fetchProfileRes) => {
              this.$router.push({ name: 'Dashboard' });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
