<template>
  <div class="pb-1" style="background: #B9D2EA; height: 100vh; overflow: hidden;">
    <v-row
      class="rounded-b white"
      no-gutters
      style="max-height: 41px; height: 41px;"
    >
      <v-col
        class="align-center d-flex justify-space-between px-2"
        cols="12"
        md="3"
      >
        {{ $t('purchases') }}
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        md="7"
      ></v-col>
      <v-col
        class="align-center d-flex justify-end px-1"
        cols="12"
        md="2"
      >
        <div class="d-flex" style="width: 100%;">
          <span class="mx-5" v-show="requestStatus === 'loading'">
            <v-progress-circular indeterminate size="25"></v-progress-circular>
          </span>
          <v-spacer></v-spacer>
          <v-tooltip bottom open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="createItem"
                class="ma-0 pa-0"
                color="black"
                icon
                plain
                small
                style="background: transparent;"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('createPurchase') }}</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>

    <v-row
      class="flex-nowrap app-wrapper"
    >
      <v-col
        class="rounded white app-inner-wrapper"
        cols="12"
        md="12"
        style="max-height: 100vh; overflow: hidden;"
      >
          <!-- :server-items-length="totalPurchases" -->
        <v-data-table
          :headers="showHeaders"
          :items-per-page="parseInt(paginationMeta.perPage)"
          :items="items"
          @dblclick:row="viaEditItem"
          class="category-products-table"
          disable-sort
          fixed-header
          height="calc(100vh - 98px)"
          hide-default-footer
          item-key="id"
        >
          <template #header.id="{ header }">
            <div 
            class="flex-column align-start pl-3"
            @contextmenu="showSelectedHeaders"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
                class="d-flex justify-start"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
                  <sort-indicator
                    :columnName="'id'"
                    :options="options"
                  ></sort-indicator>
                </div>
                <div
                  @click="sortRows('id')"
                  class="d-flex font-12"
                  style="cursor: pointer;"
                >
                  {{ 'ID' }}
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('serial_number')}"
                class="d-flex justify-start mt-1"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
                  <sort-indicator
                    :columnName="'serial_number'"
                    :options="options"
                  ></sort-indicator>
                </div>
                <div
                  @click="sortRows('serial_number')"
                  class="d-flexx font-12"
                  style="cursor: pointer;"
                >
                  {{ $t('purchaseNum') }}
                </div>
              </div>
            </div>
          </template>
          <template #header.date="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="text-right"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('date')}"
                class="d-flex justify-center"
                style="margin-left: -18px;"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
                  <sort-indicator
                    :columnName="'date'"
                    :options="options"
                  ></sort-indicator>
                </div>
                <div
                  @click="sortRows('date')"
                  class="d-flex font-12"
                  style="cursor: pointer;"
                >
                  {{ $t('date') }}
                </div>
              </div>
            </div>
          </template>
          <template #header.productsCount="{ header }">
            <div class="text-center font-12">
              Кол-во
            </div>
          </template>
          <template #header.manufacturerName="{ header }">
            <div class="text-center font-12">
              Поставщики
            </div>
          </template>
          <template #header.purchaseFilesCount="{ header }">
            <div class="d-flex align-center">
              <div 
              class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator"
              style="margin-left: -10px;"
              >
                  <sort-indicator
                    :columnName="'purchaseFilesCount'"
                    :options="options"
                  ></sort-indicator>
                </div>
              <span 
              class="text-center font-12" 
              @click="sortRows('purchaseFilesCount')"
              style="cursor: pointer;"
              >
                Документы
              </span>
            </div>
          </template>
          <template #header.description="{ header }">
            <div class="text-center font-12">
              Заметка
            </div>
          </template>
          <template #header.real_purchase_cost="{ header }">
            <div @contextmenu="showSelectedHeaders">
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('real_purchase_cost')}"
                class="d-flex align-center"
                style="margin-left: -24px;"
              >
              <div 
              class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator"
              >
                <sort-indicator
                  :columnName="'real_purchase_cost'"
                  :options="options"
                ></sort-indicator>
                </div>
                <div
                  @click="sortRows('real_purchase_cost')"
                  class="d-flex font-12"
                  style="cursor: pointer;"
                >
                  {{ $t('price') }}
                </div>
              </div>
            </div>
          </template>
          <template #header.status="{ header }">
            <div @contextmenu="showSelectedHeaders">
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('status')}"
                class="d-flex align-center"
              >
                <div 
                class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator"
                style="margin-left: -24px;"
                >
                  <sort-indicator
                    :columnName="'status'"
                    :options="options"
                  ></sort-indicator>
                </div>
                <div
                  @click="sortRows('status')"
                  class="d-flex font-12"
                  style="cursor: pointer;"
                >
                  {{ $t('status') }}
                </div>
              </div>
            </div>
          </template>
          <template #header.actions="{ header }">
            <div class="text-center font-12">
              Инструменты
            </div>
          </template>
          <template #item.id="{item}">
            <div
              class="d-flex flex-column align-start pl-4"
              style="margin-left: 20px;"
            >
              <div class="font-16">{{ item.id }}</div>
              <div class="mt-0">
                <a class="text-blue font-16" @click.prevent="editItem(item)">
                  {{ item.serial_number }}
                </a>
              </div>
            </div>
          </template>
          <template #item.date="{ item }">
            <span class="text-center font-16">
              {{ item.date | dateFormat }}
            </span>
          </template>
          <template #item.productsCount="{ item }">
            <div class="text-center font-16">
              {{item.productsCount}}
            </div>
          </template>
          <template #item.manufacturerName="{ item }">
            <span class="text-vendor font-16">
              {{ item.manufacturerName }}
            </span>
          </template>
          <template #item.purchaseFilesCount="{ item }">
            <v-menu
              :close-on-content-click="false"
              :disabled="item.purchaseFilesCount == 0"
              open-delay="500"
              open-on-hover
              style="background-color: white;"
              top
            >
              <template #activator="{ on, attrs }">
                <div
                  :style="item.purchaseFilesCount > 0 ? 'color: #2979FF;' : 'black'"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span class="font-16">{{ item.purchaseFilesCount }}</span>
                  <v-btn
                    :color="item.purchaseFilesCount == 0 ? 'grey' : 'primary'"
                    class="mx-2"
                    icon
                    plain
                    small
                    style="background: transparent;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon
                    class="d-flex justify-center align-center mb-0"
                    :class="item.purchaseFilesCount == 0 ? '' : 'text-green'"
                    >
                      mdi-file-document-outline
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <v-list
                class="rounded pa-0 documents-count__popup"
              >
                <v-list-item
                  class="d-flex justify-between align-center documents-count__item px-0 my-1"
                  v-for="file of item.purchaseFiles"
                >
                  <v-list-item-content
                  class="documents-count__content mr-1 pa-0 px-1"
                  >
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }">
                        <v-list-item-title
                          v-bind="attrs"
                          v-on="on"
                        >{{ file.src.split(/[/]+/).pop() }}</v-list-item-title>
                      </template>
                      <span>{{ file.src }}</span>
                    </v-tooltip>
                  </v-list-item-content>
                  <v-list-item-icon
                  class="documents-count__icon d-flex align-center ma-0"
                  >
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          @click="forceDownload(file.src, file.src)"
                          class="ma-0 pa-0"
                          color="black"
                          icon
                          plain
                          rounded
                          small
                          style="background: transparent;"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="font-10">mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('downloadFile') }}</span>
                    </v-tooltip>
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :href="file.src"
                          class="ma-0 pa-0"
                          color="black"
                          icon
                          plain
                          rounded
                          small
                          style="background: transparent;"
                          tag="a"
                          target="_blank"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="font-10">mdi-eye</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('showFile') }}</span>
                    </v-tooltip>
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :disabled="item.status != 'new'"
                          @click="removePurchaseFile(item, file)"
                          class="ma-0 pa-0"
                          color="black"
                          icon
                          plain
                          rounded
                          small
                          style="background: transparent;"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="font-10">mdi-close-thick</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('removeFile') }}</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template #item.description="{ item }">
            <v-menu
              :close-on-content-click="false"
              :disabled="item.description == null"
              offset-x
              open-delay="500"
              open-on-hover
              style="background-color: white;"
              top
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <span class="font-16 text-green" v-if="!!item.description">{{ 'есть' }}</span>
                  <span class="font-16" v-else>{{ 'нет' }}</span>
                  <v-btn
                    :class="item.description == null ? 'mx-2' : 'mx-1'"
                    :color="item.description == null ? 'grey' : 'primary'"
                    icon
                    plain
                    small
                    style="background: transparent;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon
                    class="d-flex justify-center align-center"
                    :class="!!item.description ? 'text-green' : ''"
                    >
                      mdi-playlist-edit
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <v-list
                class="px-2 rounded"
                style="
                max-width: 350px; 
                width: 30vw; 
                max-height: 300px;
                overflow-y: auto;
                left: calc(50% - 15vw);
                "
              >
              <div 
                v-if="!!item.description"
                class="text-end"
                style="width: 100%; height: 100%;"
                >
                  {{item.description}}
                </div>
                <v-textarea
                v-else
                  :readonly="true"
                  dir="rtl"
                  hide-details
                  rows="1"
                  style="width: 100%; height: 100%;"
                  v-model="item.description"
                ></v-textarea>
              </v-list>
            </v-menu>
          </template>
          <template #item.real_purchase_cost="{item}">
            <div 
            class="bordered-both d-flex justify-center align-center font-16" 
            style="height: 90%;">

              {{ item.real_purchase_cost }}
            </div>
          </template>
          <template #item.status="{ item }">
            <div 
            class="font-16"
            :class="(item.status == 'new' && 'text-vendor')"
            >
              {{ (item.status == 'new' && $t('purchaseStatusNew'))|| $t(item.status) }}
            </div>
          </template>
          <template #item.actions="{ item }">
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="editItem(item)"
                  class="ma-0 pa-0"
                  color="black"
                  icon
                  plain
                  small
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>
                {{ $t('edit') }}
              </span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="item.status != 'new'"
                  @click="deleteItem(item)"
                  class="ma-0 pa-0"
                  color="black"
                  icon
                  plain
                  small
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>
                {{ $t('delete') }}
              </span>
            </v-tooltip>
          </template>
        </v-data-table>

        <div class="rounded main-page-pagination" v-if="items.length">
          <v-row class="rounded" justify="space-between">
            <v-col
            class="d-flex align-center pa-0 pl-2"
            cols="12" 
            md="1"
            >
              <v-text-field
                :value="paginationMeta.perPage"
                @keyup.enter="changePerPage($event, 'change-per-page')"
                class="mt-3 ml-2 main-page-pagination__input"
                dense
                label="Количество"
                max="2000"
                min="1"
                type="number"
              ></v-text-field>
            </v-col>

            <v-col
            cols="12" 
            md="11"
            >
              <div class="text-center">
                <v-pagination
                  class="main-page-pagination__wrapper"
                  :length="paginationMeta.pageCount"
                  @input="selectedPage($event, 'change-page')"
                  v-model="paginationMeta.page"
                ></v-pagination>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-dialog
      :retain-focus="false"
      max-width="1366px"
      width="100%"
      height="70vh"
      persistent
      scrollable
      v-if="dialogMain"
      v-model="dialogMain"
      class="category-products__modal"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;"
      >
        <div
          class="align-center d-flex flex-nowrap model-header"
          color="transparent"
          dark
          dir="rtl"
          style="position: absolute; top: -57px; right: -65px; width: calc(1366px + 60px);"
          v-if="$refs.purchaseForm"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="$refs.purchaseForm.closeModal()"
                class="dialog-action-button"
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
                :disabled="!purchaseProducts.length"
                :loading="requestStatus === 'loading'"
                @click="$refs.purchaseForm.savePurchase()"
                class="dialog-action-button mr-3"
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
          <v-spacer></v-spacer>
          <div
            class="ma-0 pa-0 ml-3 rounded white inp-form d-flex justify-center align-center"
            style="width: 130px !important; height: 40px !important;"
            dir="ltr"
          >
            <v-select
              :disabled="$refs.purchaseForm.isNotNewStatus || (!!$refs.purchaseForm.form.manufacturer_id && !!$refs.purchaseForm.purchaseProducts.length)"
              :items="$refs.purchaseForm.manufacturers || []"
              :label="$t('manufacturer')"
              class="category-products__dense-select"
              dense
              width="100%"
              dir="ltr"
              hide-details
              item-text="name"
              item-value="id"
              required
              v-if="purchase"
              v-model="$refs.purchaseForm.form.manufacturer_id"
            />
          </div>
          <div
            class="ma-0 ml-3 pa-0 rounded white inp-form"
            dir="ltr"
            style="width: 150px !important; height: 40px !important;"
          >
            <v-select
              :disabled="$refs.purchaseForm.disabledStatus"
              :items="[
                {name: 'Предзаказ', value:'new'},
                {name: 'Склад', value:'store'},
              ]"
              :label="$t('status')"
              class="category-products__dense-select"
              dense
              dir="ltr"
              hide-details
              item-text="name"
              item-value="value"
              required
              width="100%"
              v-if="purchase"
              v-model="$refs.purchaseForm.form.status"
            ></v-select>
          </div>
          <div
            class="ma-0 pa-0 rounded white inp-form d-flex justify-center align-center"
            style="width: 150px !important; height: 40px !important;"
          >
            <v-text-field
              :label="$t('purchaseNumber')"
              :value="$refs.purchaseForm.form.serial_number"
              class="category-products__dense-input font-12"
              dense
              dir="ltr"
              hide-details
              readonly
              style="width: 100%"
            />
          </div>
          <v-btn
            class="black--text inp-form font-14"
            color="#B9D2EA"
            style="width: 105px !important; height: 40px !important; padding: 0"
            small
          >
            <div class="py-3">{{ $t('purchase') }}</div>
          </v-btn>
        </div>
        <v-card-text
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA;"
        >
          <purchase-form
            :purchase="purchase"
            ref="purchaseForm"
          ></purchase-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      :position-x="selectedHeadersMenuX"
      :position-y="selectedHeadersMenuY"
      absolute
      max-height="35vh"
      max-width="70vw"
      v-model="showSelectedHeadersMenu"
    >
      <v-list
        flat
      >
        <v-list-item-group
          multiple
          v-model="selectedHeadersData"
        >
          <v-list-item
            :key="`item-${i}`"
            :value="header.value"
            v-for="(header, i) in headersMap"
          >
            <template #default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ header.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>


<script>
import {mapGetters} from 'vuex'
import dateFormat from "../../filters/date";
import paginationMixin from "@/mixins/paginations";

export default {
  name: "Purchase",
  components: {
    PurchaseForm: () => import("../components/purchases/PurchaseForm"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
  },
  mixins: [paginationMixin],
  data () {
    return {
      _timerId: 0,
      headers: [],
      headersMap: [],
      oldSortBy: [],
      oldSortDesc: [],
      options: {
        groupBy: [],
        groupDesc: [],
        itemsPerPage: 10,
        multiSort: true,
        mustSort: false,
        page: 1,
        sortBy: [],
        sortDesc: [],
        sortLocale: this.$i18n.locale,
      },
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      showForm: false,
      showSelectedHeadersMenu: false,
    }
  },

  filters: {
    dateFormat
  },

  computed: {
    ...mapGetters([
      'dialogMain',
      'errors',
      'purchase',
      'purchaseProducts',
      'purchases',
      'requestStatus',
    ]),

    items() {
      if (this.purchases) {
        this.paginationMeta.page = +this.purchases.meta.current_page
        this.paginationMeta.perPage = +this.purchases.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.purchases.meta.total / this.purchases.meta.per_page)
        return this.purchases.data
      }
      return []
    },

    totalPurchases () {
      if (!!this.purchases && !!this.purchases.meta) {
        return parseInt(this.purchases.meta.total, 10)
      }
      return 0
    },

    showHeaders () {
      return this.selectedHeadersData && this.headers.filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
    },

    selectedHeadersData: {
      get: function () {
        return this.selectedHeaders || this.headers.map(h => h.value)
      },
      set: async function (newValue) {
        await this.$store.dispatch('saveSetting', {
          selectedHeadersPurchases: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersPurchases'})
      }
    },

    selectedHeaders () {
      let selectedHeadersPurchases = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersPurchases')
      selectedHeadersPurchases = selectedHeadersPurchases && JSON.parse(selectedHeadersPurchases.value)
      return selectedHeadersPurchases
    },
  },

  async created() {
    this.$store.dispatch('getPurchases')
    this.initialize()

    this.$eventHandle.$on('change-page', (page) => {
      this.page = +page
      this.$store.dispatch('getPurchases', {
        page, perPage: this.perPage
      })
    })

    this.$eventHandle.$on('change-per-page', (perPage) => {
      this.perPage = +perPage
      this.$store.dispatch('getPurchases', {
        page: this.page, perPage
      })
    })

    this.headers = Object.values(this.headersMap)
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeaders'})
  },

  destroyed() {
    this.$store.commit('setDialogMain', false)
    this.$store.commit('setPurchases', null)
    this.$eventHandle.$off('change-per-page')
    this.$eventHandle.$off('change-page')
  },

  methods: {
    createItem() {
      this.$store.dispatch('getPurchase').then(() => {
        this.$store.commit('setDialogMain', true)
      })
    },
    initialize() {
      this.headersMap = [
        {text: 'ID / номер', value: 'id', align: 'start', sortable: true, class: 'caption', width: 208},
        {text: this.$t('date'), value: 'date', align: 'center', sortable: true, class: 'caption', width: '11.3%'},
        {text: this.$t('qty'), value: 'productsCount', align: 'center', sortable: true, class: 'caption', sortable: false, width: '11.3%'},
        {text: this.$t('manufacturers'), value: 'manufacturerName', align: 'center', sortable: true, class: 'caption', width: '11.3%'},
        {text: this.$t('documents'), value: 'purchaseFilesCount', align: 'center', sortable: true, class: 'caption', sortable: false, width: '11.3%'},
        {text: this.$t('note'), value: 'description', align: 'center', sortable: true, class: 'caption', sortable: false, width: '11.3%'},
        {text: this.$t('price'), value: 'real_purchase_cost', align: 'center', sortable: true, class: 'caption', width: '11.3%'},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: true, class: 'caption', width: '11.3%'},
        {text: this.$t('actions'), value: 'actions', align: 'center', class: 'caption', sortable: false, width: 112},
      ]
    },

    viaEditItem(e, data) {
      this.editItem(data.item)
    },

    editItem(item) {
      this.$store.dispatch('getPurchase', item).then(data => {
        this.$store.commit('setPurchaseProducts', data.products);
        this.$store.commit('setDialogMain', true);
      })
    },

    deleteItem(item) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          this.$store.dispatch('deletePurchase', item.id)
        }
      })
    },

    updateOptions: function(options) {
      this.$store.dispatch('getPurchases', {
        ...this.options,
        page: this.page,
        perPage: this.perPage,
        sortLocale: this.$i18n.locale,
      })
    },

    showSelectedHeaders (e) {
      e.preventDefault()
      this.showSelectedHeadersMenu = false
      this.selectedHeadersMenuX = e.clientX
      this.selectedHeadersMenuY = e.clientY
      this.$nextTick(() => {
        this.showSelectedHeadersMenu = true
      })
    },

    sortRows: function(sortKey) {
      clearTimeout(this._timerId)
      let sortIndex = this.options.sortBy.indexOf(sortKey)
      if (sortIndex == -1) {
        this.options.sortDesc.push('false')
        this.options.sortBy.push(sortKey)
      } else if (sortIndex > -1 && this.options.sortDesc[sortIndex] == 'false') {
        this.options.sortDesc.splice(sortIndex, 1, 'true')
      } else if (sortIndex > -1 && this.options.sortDesc[sortIndex] == 'true' && this.options.sortBy.length == 1) {
        this.options.sortDesc.splice(sortIndex, 1, 'false')
      } else {
        this.options.sortBy.splice(sortIndex, 1)
        this.options.sortDesc.splice(sortIndex, 1)
      }
      this._timerId = setTimeout(async () => {
        if (JSON.stringify([...this.options.sortBy]) != this.oldSortBy || JSON.stringify([...this.options.sortDesc]) != this.oldSortDesc) {
          this.changeParams(this.options, 'change-params')
          this.oldSortBy = JSON.stringify([...this.options.sortBy])
          this.oldSortDesc = JSON.stringify([...this.options.sortDesc])
        }
      }, 3500)
    },

    async removePurchaseFile(item, file) {
      item.purchaseFiles = item.purchaseFiles.filter(f => f.id !== file.id)
      await this.$store.dispatch('savePurchase', item)
    },
  },
}
</script>
