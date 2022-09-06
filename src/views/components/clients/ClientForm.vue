<template>
  <v-card style="background: rgba(33, 33, 33, 0.08);">
    <v-card-actions dense>
      <v-spacer></v-spacer>
      <v-tooltip top open-delay="400">
        <template
          v-slot:activator="{ on, attrs }"
        >
          <v-btn
            @click="toggleReadonly"
            color="primary"
            elevation="6"
            fab
            light
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon dense>
              {{ client && client.readonly ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline' }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('editAvailability') }}</span>
      </v-tooltip>
      <v-tooltip top open-delay="400">
        <template
          v-slot:activator="{ on, attrs }"
        >
          <v-btn
            :loading="requestStatus === 'loading'"
            @click.prevent="saveClient"
            color="primary"
            elevation="6"
            fab
            light
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="25">
              mdi-content-save-outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('form.save') }}</span>
      </v-tooltip>
      <v-tooltip top open-delay="400">
        <template
          v-slot:activator="{ on, attrs }"
        >
          <v-btn
            @click="closeModal"
            color="primary"
            elevation="6"
            fab
            light
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="25">
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('close') }}</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-text style="background: white;">
      <div style="margin: 0 auto;">
        <v-form
          autocomplete="off"
          ref="form"
        >
          <v-alert
            v-if="!!errors"
            outlined
            type="warning"
            prominent
            border="left"
          >
            <span :key="field" v-for="(error, field) in errors">
              {{ field }} : {{ error['0'] }} <br>
            </span>
          </v-alert>
          <div>
            <ClientInfoHeader
              :Itemidx="1"
              :client="client || {}"
              :items="[]"
              :itemsMore="[]"
              :posts="posts"
              v-if="client"
            />
          </div>
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import {mapGetters} from 'vuex'
import dateFormat from "@/filters/date"
import ClientInfoHeader from "./ClientInfoHeader"

export default {
  name: "ClientForm",
  components: {
    ClientInfoHeader,
  },
  data: function () {
    return {
      date: null,
      modal: false,
      show: false,
      showName: '',
      statuses: [
        {
          name: this.$t('on'),
          value: true,
        },
        {
          name: this.$t('off'),
          value: false,
        },
      ],
      tab: null,
      vertical: false,
    }
  },

  computed: {
    ...mapGetters([
      'allClients',
      'errors',
      'posts',
      'requestStatus',
    ]),
  },

  props: ['client', 'disableSearch'],

  filters: {
    dateFormat
  },

  methods: {
    closeModal() {
      this.$store.commit('setDialog', false)
      this.$eventHandle.$emit('set-dialog', { name: 'addClientDialog', value: false })
    },

    async saveClient() {
      let response = await this.$store.dispatch('saveClient', this.client)
      this.$eventHandle.$emit('save-client', response)
    },

    generatePassword() {
      this.client.password = ' '
      setTimeout(() => {
        this.client.password = Math.random().toString(36).slice(-8)
      }, 500)
    },
    setClient(client) {
      this.client.status = client.status
      this.client.name = client.name
      this.client.surname = client.surname
      this.client.he_name = client.he_name
      this.client.company_name = client.company_name
      this.client.email = client.email
      this.client.mobile_phone = client.mobile_phone
      this.client.landline_phone = client.landline_phone
      this.client.city = client.city
      this.client.street = client.street
      this.client.house_number = client.house_number
      this.client.entry = client.entry
      this.client.floor = client.floor
      this.client.flat = client.flat
      this.client.login = client.login
      this.client.passport = client.passport
      this.client.note = client.note
      this.client.password = client.password
      this.client.post_address = client.post_address

      this.showName = false
      this.$store.commit('setAllClients', [])
    },

    closeName() {
      this.showName = ''
    },

    findClients(names) {
      let name = names === 'he_name' ? this.client.he_name : this.client.name
      if (!!name && names === 'he_name') {
        this.$store.dispatch('getClients', {he_name: name, all: 'all_he_name'}).then(() => {
          this.showName = names
        })
      } else if (!!name && names === 'ru_name') {
        this.$store.dispatch('getClients', {name, all: 'all_ru_name'}).then(() => {
          this.showName = names
        })
      } else {
        this.$store.commit('setAllClients', [])
      }
    },

    async toggleReadonly () {
      this.client.readonly = this.client.readonly ? false : true
      let response = await this.$store.dispatch('saveClient', this.client)
      this.$eventHandle.$emit('save-client', response)
    },
  },
}
</script>

<style scoped>
.password-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.client-name-list {
  width: 15%;
  position: absolute;
  top: 60px;
  background: white;
  z-index: 1;
  padding: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.client_names:hover {
  cursor: default;
  background: #f6f6f6;
}
</style>
