<template>
  <div 
  class="v-data-table grey lighten-5 pa-1"
  style="height: 100vh"
  >
    <div class="v-data-table__wrapper settings-system">
      <table>
        <thead class="v-data-table-header">
        <tr>
          <th 
          class="caption"
          style="width: 93%;"
          >
            <span class="font-12">
              Наименование настроек
            </span>
          </th>
          <th 
          class="caption"
          style="width: 7%;"
          >
            <span class="font-12">
              Действия
            </span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <div class="d-flex justify-start align-center px-2 bordered-right"
            style="height: 90%;"
            >
              {{ $t('VAT') }}
            </div>
          </td>
          <td>
            <div class="d-flex justify-center align-center px-2">
              <v-icon
                small
                @click="editItem('settingsVat')"
              >mdi-pencil
              </v-icon>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-start align-center px-2 bordered-right"
            style="height: 90%;"
            >
              {{ $t('warranty') }}
            </div>
          </td>
          <td>
            <div class="d-flex justify-center align-center px-2">
              <v-icon
                small
                @click="editItem('settingsWarranties')"
              >mdi-pencil
              </v-icon>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-start align-center px-2 bordered-right"
            style="height: 90%;"
            >
              {{ $t('pagination_settings') }}
            </div>
            </td>
          <td>
            <div class="d-flex justify-center align-center px-2">
              <v-icon
                small
                @click="editItem('paginationSettings')"
              >mdi-pencil
              </v-icon>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-start align-center px-2 bordered-right"
            style="height: 90%;"
            >
              {{ $t('manufacturers') }}
            </div>
          </td>
          <td>
            <div class="d-flex justify-center align-center px-2">
              <v-icon
                small
                @click="editItem('manufacturerSettings')"
              >mdi-pencil
              </v-icon>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-start align-center px-2 bordered-right"
            style="height: 90%;"
            >
              {{ $t('visa') }}
            </div>
            </td>
          <td>
            <div class="d-flex justify-center align-center px-2">
              <v-icon
                small
                @click="editItem('settingsVisa')"
              >mdi-pencil
              </v-icon>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-start align-center px-2 bordered-right"
            style="height: 90%;"
            >
              {{ $t('payment') }}
            </div>
          </td>
          <td>
            <div class="d-flex justify-center align-center px-2">
              <v-icon
                small
                @click="editItem('settingsPayment')"
              >mdi-pencil
              </v-icon>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <v-dialog
        class="settings-system__modal"
        v-if="dialog"
        v-model="dialog"
        :width="formBlock === 'settingsVat' || formBlock === 'settingsVisa' || formBlock === 'settingsPayment' ? 400 : 900"
        persistent
      >
        <v-card>
        <div 
        class="align-center d-flex flex-nowrap"
        color="transparent" 
        dark 
        style="position: absolute; top: -42px; right: -52px; width: 460px;" 
        dir="rtl"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="$store.commit('setDialog', false)"  
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
            <span>Закрыть</span>
          </v-tooltip>
          <v-tooltip v-if="formBlock === 'settingsVat'" top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="saveSetting('settingsVat')"  
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
          <v-tooltip v-if="formBlock === 'settingsWarranties'" top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="saveSetting('settingsWarranties')"
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
          <v-tooltip v-if="formBlock === 'settingsWarranties'" top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="addSetting('settingsWarranties')" 
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Добавить</span>
          </v-tooltip>
          <v-tooltip v-if="formBlock === 'paginationSettings'" top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="saveSetting('paginationSettings')"
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
          <v-tooltip v-if="formBlock === 'manufacturerSettings'" top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="saveSetting('manufacturerSettings')"
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
          <v-tooltip v-if="formBlock === 'settingsVisa'" top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="saveSetting('settingsVisa')"
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
          <v-tooltip v-if="formBlock === 'settingsPayment'" top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                @click="saveSetting('settingsPayment')"
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
        </div>
          <div class="pa-2">
            <div v-if="formBlock === 'settingsVat'">
              <div style="display: flex">
                <v-text-field v-model="data" :label="$t('VAT')"/>
              </div>
            </div>
            <div v-if="formBlock === 'settingsWarranties'">
              <table style="width: 100%">
                <thead class="v-data-table-header">
                <tr>
                  <th>
                    <span class="font-12">
                      {{ $t('name') }}
                    </span>
                  </th>
                  <th>
                    <span class="font-12">
                      {{ $t('value') }}
                    </span>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr class="" v-for="(warranty, i) in data">
                  <td class="text-start">
                    <v-text-field class="ma-3" v-model="warranty.name"/>
                  </td>
                  <td class="text-start">
                    <v-text-field class="ma-3" v-model="warranty.value"/>
                  </td>
                  <td class="text-start">
                    <v-icon class="float-right ml-5" @click="deleteSetting(i, 'settingsWarranties')">
                      mdi-close
                    </v-icon>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-if="formBlock === 'paginationSettings'">
              <table style="width: 100%">
                <thead class="v-data-table-header">
                <tr>
                  <th class="text-start">{{ $t('name') }}</th>
                  <th class="text-start" style="width: 200px">{{ $t('value') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr class="" v-for="(item, i) in data">
                  <td class="text-start">
                    {{ $t(item.name) }}
                  </td>
                  <td class="text-start">
                    <v-text-field v-model="item.value"/>
                  </td>
                  <td></td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-if="formBlock === 'manufacturerSettings'">
              <table style="width: 100%">
                <thead class="v-data-table-header">
                <tr>
                  <th class="text-start">{{ $t('name') }}</th>
                  <th class="text-start" style="width: 200px">{{ $t('deliver_cost') }}</th>
                  <th class="text-start pl-2" style="width: 200px">{{ $t('deliver_cost_with_vat') }}</th>
                  <th class="text-start pl-2" style="width: 100px">{{ $t('paymentPercent') }}</th>
                </tr>
                </thead>
                <tbody>
                  <delivery-table-row
                    :item="item"
                    :key="item.id"
                    v-for="item in data"
                  ></delivery-table-row>
                </tbody>
              </table>
            </div>
            <div v-if="formBlock === 'settingsVisa'">
              <div style="display: flex">
                <v-text-field v-model="data.value" :label="$t('visa')"/>
              </div>
            </div>
            <div v-if="formBlock === 'settingsPayment'">
              <div style="display: flex">
                <v-text-field v-model="data.value" :label="$t('payment')"/>
              </div>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>


<script>
import {mapGetters} from 'vuex'
import DeliveryTableRow from '../components/systemSettings/DeliveryTableRow.vue'

export default {
  components: { DeliveryTableRow },
  name: "SystemSettings",
  data: () => ({
    formBlock: '',
    data: null
  }),

  computed: {
    ...mapGetters([
      'dialog',
    ]),
  },

  destroyed() {
    this.$store.commit('setDialog', false)
  },

  methods: {
    editItem(settingsName) {
      this.$store.dispatch('getSettings', {settingsName}).then((data) => {
        this.$store.commit('setDialog', true);
        this.formBlock = settingsName
        this.data = data
      })
    },


    addSetting(settingsName) {
      if (settingsName === 'settingsWarranties') {
        this.data.push({name: '', value: '',})
      }
      if (settingsName === 'settings') {
        this.data.push({name: '', value: '',})
      }
    },

    deleteSetting(i, settingsName) {
      if (settingsName === 'settingsWarranties') {
        this.data.splice(i, 1)
      }
      if (settingsName === 'settings') {
        this.data.splice(i, 1)
      }
    },

    saveSetting(settingsName) {

      switch (settingsName) {
        case 'paginationSettings':
          this.$store.dispatch('saveSetting', {
            paginationSettings: this.data,
          }).then(() => this.$store.commit('setDialog', false))
          break;
        case 'settingsVat':
          this.$store.dispatch('saveSetting', {
            settingsVat: this.data,
          }).then(() => this.$store.commit('setDialog', false))
          break;
        case 'settingsWarranties':
          this.$store.dispatch('saveSetting', {
            settingsWarranties: this.data,
          }).then(() => this.$store.commit('setDialog', false))
          break;
        case 'manufacturerSettings':
          this.$store.dispatch('saveSetting', {
            manufacturerSettings: this.data,
          }).then(() => this.$store.commit('setDialog', false))
          break;
        case 'settingsVisa':
          this.$store.dispatch('saveSetting', {
            settingsVisa: this.data.value,
          }).then(() => this.$store.commit('setDialog', false))
          break;
        case 'settingsPayment':
          this.$store.dispatch('saveSetting', {
            settingsPayment: this.data.value,
          }).then(() => this.$store.commit('setDialog', false))
          break;
        default:
          this.$store.dispatch('saveSetting', {
            settings: this.data,
          }).then(() => this.$store.commit('setDialog', false))
      }
    }
  },
}
</script>

<style lang="scss">
  .settings-system {
    .v-text-field__details {
      display: none !important;
    }
  }
</style>
