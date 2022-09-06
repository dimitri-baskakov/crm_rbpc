<template>
  <div 
  class="grey lighten-5 pa-1"
  style="height: 100vh;"
  >
    <div class="d-flex justify-space-between">
      <h3 class="font-weight-light pl-4">
        Поставщики
      </h3> 
      <div style="float: right">
        <v-icon
          class="pr-6 py-1"
          @click="createItem"
          tag="a">mdi-plus-circle-outline
        </v-icon>
      </div>
    </div>
    <div 
    class="items-table"
    style="height: calc(100vh - 98px);"
    >
      <v-scroll-y-transition mode="out-in">
        <v-data-table
          class="settings-manufacturers mt-3"
          ref="table"
          :headers="headers"
          :items="items"
          hide-default-footer
          :items-per-page="parseInt(paginationMeta.perPage)"
        >
          <template #header.id="{ header }">
            <span class="font-12">
              ID
            </span>
          </template>
          <template #header.name="{ header }">
            <span class="font-12">
              {{$t('name')}}
            </span>
          </template>
          <template #header.actions="{ header }">
            <span class="font-12">
              {{$t('actions')}}
            </span>
          </template>
          <template #item.id="{item}">
            <div
              class="d-flex justify-center align-center px-2 font-14"
              :id="`product-${item.id}`"
              :data-id="item.id"
            >
              {{ item.id }}
            </div>
          </template>
          <template #item.name="{item}">
            <div class="d-flex justify-start align-center px-2 font-14 bordered-both"
            style="height: 90%;"
            >
              {{ item.name }}
            </div>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex justify-center align-center px-2"
            style="height: 90%;"
            >
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >mdi-pencil
              </v-icon>

              <v-icon
                small
                @click="deleteItem(item)"
              >mdi-delete
              </v-icon>
            </div>
          </template>
        </v-data-table>
      </v-scroll-y-transition>
    </div>

    <div class="rounded main-page-pagination" v-if="items.length" >
      <v-row class="rounded" justify="space-between">
        <v-col 
        class="d-flex align-center pa-0 pl-2"
        cols="12" 
        md="1"
        >
          <v-text-field
            class="mt-3 ml-2 main-page-pagination__input"
            label="Количество"
            type="number"
            min="1"
            @keyup.enter="changePerPage($event, 'change-per-page')"
            :value="paginationMeta.perPage"
          />
        </v-col>

        <v-col 
        cols="12" 
        md="11"
        >
          <div class="pt-2">
            <v-pagination
              class="main-page-pagination__wrapper"
              v-model="paginationMeta.page"
              :length="paginationMeta.pageCount"
              @input="selectedPage($event, 'change-page')"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <v-dialog 
    v-if="dialog" 
    v-model="dialog"
    class="settings-manufacturers__modal"
    max-width="400px" 
    height="300px"
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
              @click="closeModal"  
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
            <span>{{ $t('close') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
                class="dialog-action-button" 
                :disabled="requestStatus === 'loading'"
                @click="saveItem"  
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
          <v-form ref="form">
            <v-alert
              v-if="!!errors"
              outlined
              type="warning"
              prominent
              border="left"
            >
              <span v-for="(error, field) in errors">
                {{ field }} : {{ error['0'] }} <br>
              </span>
            </v-alert>
            <v-text-field
              v-model="manufacturer.name"
              :label="$t('manufacturer')"
            ></v-text-field>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import paginationMixin from "@/mixins/paginations";

export default {
  mixins: [paginationMixin],

  data: () => ({
    headers: [],
    selected: [],
  }),

  created() {
    this.$store.dispatch('getManufacturers')
    this.initialize();

    this.$eventHandle.$on('change-page', (page) => {
      this.page = page
      this.$store.dispatch('getManufacturers', {
        page, perPage: this.perPage
      })
    })

    this.$eventHandle.$on('change-per-page', (perPage) => {
      this.perPage = perPage
      this.$store.dispatch('getManufacturers', {
        page: this.page, perPage
      })
    })
  },

  destroyed() {
    this.$store.commit('setDialog', false)
    this.$store.commit('setManufacturers', null)
    this.$eventHandle.$off('change-per-page')
    this.$eventHandle.$off('change-page')
  },

  computed: {
    ...mapGetters([
      'dialog',
      'manufacturers',
      'manufacturer',
      'requestStatus',
      'errors'
    ]),
    items() {
      if (this.manufacturers && this.manufacturers.meta) {
        this.paginationMeta.page = this.manufacturers.meta && this.manufacturers.meta.current_page || 1
        this.paginationMeta.perPage = this.manufacturers.meta && this.manufacturers.meta.per_page || 10
        this.paginationMeta.pageCount = Math.ceil(this.manufacturers.meta.total / this.manufacturers.meta.per_page)
        return this.manufacturers.data
      }
      return []
    },
  },


  methods: {
    initialize() {
      this.headers = [
        {text: 'ID', value: 'id', align: 'start', sortable: false, class: 'caption', cellClass: 'font-12', width: 40},
        {text: this.$t('name'), value: 'name', align: 'start', sortable: false, class: 'caption', cellClass: 'font-12'},
        {text: this.$t('actions'), value: 'actions', align: 'end', sortable: false, class: 'caption', cellClass: 'font-12', width: 150},
      ]
    },

    createItem() {
      this.$store.dispatch('getManufacturer').then(() => {
        this.$store.commit('setDialog', true)
      })
    },

    editItem(item) {
      this.$store.dispatch('getManufacturer', item).then(() => {
        this.$store.commit('setDialog', true)
      })
    },

    saveItem() {
      let manufacturer = this.manufacturer
      this.$store.dispatch('saveManufacturer', manufacturer)
    },

    deleteItem(item) {
      this.showSwal().then((res) => {
        if (res) {
          this.$store.dispatch('deleteManufacturer', item)
        }
      })
    },

    showSwal() {
      return this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      })
    },

    closeModal() {
      this.$store.commit('setDialog', false)
      this.showForm = ''
    },
  },
}
</script>

<style lang="scss">
  .settings-manufacturers {
    th {
        height: 56px !important;
      span {
        height: 56px !important;
        background-color: #CCE3FF !important;
        border-radius: 3px !important;
      }
    }
    td {
      padding: 0 !important;
    }
    &__modal {
      .v-text-field__details {
        display: none !important;
      }
    }
  }
</style>
