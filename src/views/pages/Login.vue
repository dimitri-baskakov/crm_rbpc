<template>
  <v-app id="login">
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>
                  {{$t('loginTitle')}}
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-alert
                  v-if="requestStatus === 'error'"
                  outlined
                  type="warning"
                  prominent
                  border="left"
                >
                  {{ requestMessage }}
                </v-alert>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    :label="$t('valid.email')"
                    required
                    @keyup="resetValidation"
                  />
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="showPassword ? 'text' : 'password'"
                    :label="$t('password')"
                    counter
                    required
                    @click:append="showPassword = !showPassword"
                    @keyup="resetValidation"
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="disabled"
                  color="primary"
                  @click="validate"
                >
                  {{$t('loginBtn')}}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
  import {mapGetters} from 'vuex'

  export default {
    data: () => ({
      valid: true,
      email: '',
      showPassword: false,
      password: '',
      errorMessage: '',
    }),

    computed:{
      ...mapGetters(['requestStatus', 'requestMessage']),
      disabled(){
        return !this.valid || this.requestStatus === 'loading'
      },
      emailRules(){
        return [
          v => !!v || this.$t('valid.required'),
          v => /.+@.+\..+/.test(v) || this.$t('valid.email'),
        ];
      },
      rules(){
        return {
          required: value => !!value || this.$t('valid.required'),
          min: v => v.length >= 6 || this.$t('valid.min'),
        };
      },
    },

    methods: {
      validate() {
        if (this.$refs.form.validate()) {
          this.login();
        }
      },
      login: function () {
        let email = this.email
        let password = this.password
        this.$store.dispatch('login', {email, password}).then(() => this.$router.push('/'))
      },
      reset() {
        this.$refs.form.reset()
      },
      resetValidation() {
        this.$store.commit('setRequestStatus', '')
        this.$store.commit('setRequestMessage', '')
        this.$refs.form.resetValidation()
      },
    },
  }
</script>
