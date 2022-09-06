<template>
  <div 
  class="grey lighten-5 pa-1"
  style="height: 100vh;"
  >
    <div class="d-flex justify-space-between">
      <h3 class="font-weight-light pl-4">
        Вендоры
      </h3> 
      <div style="float: right">
        <v-icon
          class="pr-6 py-1"
          @click="createItem"
          tag="a"
          >
          mdi-plus-circle-outline
        </v-icon>
      </div>
    </div>
    <div 
    class="items-table"
    style="height: calc(100vh - 98px);"
    >
      <v-scroll-y-transition mode="out-in">
        <v-data-table
          class="settings-vendors mt-3"
          ref="table"
          :headers="headers"
          :items="items"
          hide-default-footer
          :items-per-page="parseInt(paginationMeta.perPage)"
        >
          <template #header.id="{ header }">
            <div class="d-flex justify-center align-center font-12">
              ID
            </div>
          </template>
          <template #header.src="{ header }">
            <div class="d-flex justify-center align-center font-12">
              {{$t('logo')}}
            </div>
          </template>
          <template #header.name="{ header }">
            <div class="d-flex justify-center align-center font-12">
              {{$t('name')}}
            </div>
          </template>
          <template #header.products_count="{ header }">
            <div class="d-flex justify-center align-center font-12">
              {{$t('products_count')}}
            </div>
          </template>
          <template #header.is_corrected="{ header }">
            <div class="d-flex justify-center align-center font-12">
              {{$t('corrected')}}
            </div>
          </template>
          <template #header.actions="{ header }">
            <div class="d-flex justify-center align-center font-12">
              {{$t('actions')}}
            </div>
          </template>
          <template #item.id="{ item }">
            <div class="d-flex justify-center align-center px-2 font-14">
              {{item.id}}
            </div>
          </template>
          <template #item.src="{ item }">
            <div class="d-flex justify-center align-center font-14 px-2 bordered-both"
            style="height: 90%;"
            >
              <v-img 
              v-if="!!item.src" 
              :src="item.src" 
              aspect-ratio="1.7" 
              width="70" 
              height="56px"
              contain
              ></v-img>
            </div>
          </template>
          <template #item.name="{ item }">
            <div class="d-flex justify-end align-center px-2 font-14">
              {{item.name}}
            </div>
          </template>
          <template #item.products_count="{ item }">
            <div class="d-flex justify-end align-center px-2 font-14 bordered-left"
            style="height: 90%;"
            >
              {{item.products_count}}
            </div>
          </template>
          <template #item.is_corrected="{ item }">
            <div class="d-flex justify-center align-center px-2 bordered-both"
            style="height: 90%;">
              <v-simple-checkbox 
            v-model="item.is_corrected" 
            disabled></v-simple-checkbox>
            </div>
          </template>
          <template #item.actions="{ item }">
            <div class="product-actions d-flex justify-center align-center">
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
    <div>
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
              @keyup.enter="changePerPage($event, 'change-per-page-vendor')"
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
              @input="selectedPage($event, 'change-page-vendor')"
            />
          </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-dialog 
    v-if="dialog" 
    v-model="dialog" 
    class="settings-vendors__modal"
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
            <div>
              <v-text-field
                v-model="vendor.name"
                label="Name"
                required
              />
              <v-file-input
                v-model="files"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                :label="$t('logo')"
              />

              <v-checkbox
                v-model="vendor.is_corrected"
                :label="$t('corrected')"
              />
            </div>
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
  data: () => ({
    headers: [],
    files: [],
  }),
  mixins: [paginationMixin],

  computed: {
    ...mapGetters([
      'dialog',
      'vendors',
      'vendor',
      'requestStatus',
      'errors'
    ]),
    items() {
      if (this.vendors) {
        this.paginationMeta.page = this.vendors.meta.current_page
        this.paginationMeta.perPage = this.vendors.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.vendors.meta.total / this.vendors.meta.per_page)
        return this.vendors.data
      }
      return []
    },
  },

  created() {
    this.$store.dispatch('getVendors')
    this.initialize();

    this.$eventHandle.$on('change-page-vendor', (page) => {
      this.page = page
      this.$store.dispatch('getVendors', {
        page, perPage: this.perPage
      })
    })

    this.$eventHandle.$on('change-per-page-vendor', (perPage) => {
      this.perPage = perPage
      this.$store.dispatch('getVendors', {
        page: this.page, perPage
      })
    })
  },

  destroyed() {
    this.$store.commit('setDialog', false)
    this.$store.commit('setVendors', null)

    this.$eventHandle.$off('change-page-vendor')
    this.$eventHandle.$off('change-per-page-vendor')
  },
  methods: {
    initialize() {
      this.headers = [
        {text: 'ID', value: 'id', align: 'start', sortable: true, class: 'caption', width: 100},
        {text: this.$t('logo'), value: 'src', align: 'start', sortable: true, class: 'caption', width: 70},
        {text: this.$t('name'), value: 'name', align: 'end', sortable: true, class: 'caption'},
        {text: this.$t('products_count'), value: 'products_count', align: 'end', sortable: true, class: 'caption'},
        {text: this.$t('corrected'), value: 'is_corrected', align: 'end', sortable: true, class: 'caption', width: 120},
        {text: this.$t('actions'), value: 'actions', align: 'end', sortable: false, class: 'caption', width: 120},
      ]
    },
    createItem() {
      this.$store.dispatch('getVendor').then(() => {
        this.$store.commit('setDialog', true)
      })
    },
    editItem(item) {
      this.$store.dispatch('getVendor', item).then(() => {
        this.$store.commit('setDialog', true)
      })
    },

    saveItem() {
      if (this.files) {
        this.vendor.logo = [this.files]
        this.files = []
      }
      this.$store.dispatch('saveVendor', this.vendor)
    },

    deleteItem(item) {
      this.showSwal().then((res) => {
        if (res) {
          this.$store.dispatch('deleteVendor', item)
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
  .settings-vendors {
    th {
      height: 56px !important;
      position: relative;
      span {
        height: 56px !important;
        background-color: #CCE3FF !important;
        border-radius: 3px !important;
      }
      .v-data-table-header__icon {
        position: absolute !important;
        top: 0 !important;
        left: 10px !important;
        background-color: transparent !important;
      }
    }
    td {
      height: 56px !important;
      padding: 0 !important;
    }
    &__modal {
      .v-text-field__details {
        display: none !important;
      }
    }
  }
</style>
