<template>
  <div>
    <v-data-table
      :headers="showHeaders"
      :items-per-page="parseInt(paginationMeta.perPage)"
      :items="items"
      :server-items-length="totalStoreProducts"
      @click:row="clickRow"
      @item-selected="itemSelected"
      @toggle-select-all="toggleSelectAll"
      @update:page="onUpdatePage"
        class="category-products-table category-products-top-row"
      dense
      disable-sort
      fixed-header
      hide-default-footer
      ref="table"
      show-select
      height="100%"
      style="height: calc(100% - 26px); padding-bottom: 4.5px"
      v-model="selectedPurchaseProducts"
    >
      <template #header.id="{ header }">
          <div
            @contextmenu="showSelectedHeaders"
            class="text-right column justify-center"
            style="height: 100%;"
          >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
            class="d-flex justify-end"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
              <sort-indicator
                :columnName="'id'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('id')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="font-8">
                {{ 'ID' }}
              </div>
            </div>
          </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('date')}"
            class="d-flex justify-end mt-1"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
              <sort-indicator
                :columnName="'date'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('date')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="font-8">
                {{ $t('date') }}
              </div>
            </div>
          </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('number')}"
            class="d-flex justify-end mt-1"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
              <sort-indicator
                :columnName="'number'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('number')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="font-8">
                {{ $t('purchaseNum') }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #header.image="{ header }">
        <div class="font-8">
          Изобажения
        </div>
      </template>
      <template #header.name="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex justify-space-between pl-5 pr-2"
          style="box-sizing: border-box;"
        >
          <div
            class="d-flex justify-end"
          >
            <div class="font-8">
              {{ $t('name') }}
            </div>
          </div>
          <div class="mt-1">
            <div
              class="d-flex justify-start"
            >
              <div class="font-8">
                {{ $t('sku_original') }}
              </div>
            </div>
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('category_name')}"
              class="d-flex justify-end mt-1"
            >
              <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
                <sort-indicator
                  :columnName="'category_name'"
                  :options="options"
                ></sort-indicator>
              </div>
              <div
                @click="sortRows('category_name')"
                class="d-flex"
                style="cursor: pointer;"
              >
                <div class="font-8">
                  {{ $t('category') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #header.manufacturer="{ header }">
          <div
            @contextmenu="showSelectedHeaders"
            class="text-right column justify-center"
            style="height: 100%;"
          >
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('manufacturer')}"
              class="d-flex justify-end"
            >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
              <sort-indicator
                :columnName="'manufacturer'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('manufacturer')"
                class="d-flex"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8">
                  {{ $t('manufacturer') }}
                </div>
              </div>
            </div>
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('vendor')}"
              class="d-flex justify-end mt-1"
            >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
              <sort-indicator
                :columnName="'vendor'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('vendor')"
                class="d-flex"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8">
                  {{ $t('vendor') }}
                </div>
              </div>
            </div>
          </div>
      </template>
      <template #header.price="{ header }">
          <div
            @contextmenu="showSelectedHeaders"
            class="text-right column"
            style="height: 100%;"
          >
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('producer_price')}"
              class="d-flex justify-end"
              style="height: 33%;"
            >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -7px;"
            >
              <sort-indicator
                :columnName="'producer_price'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('producer_price')"
                class="d-flex line-break-one"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8 line-break-one"
                >
                  {{ $t('price') }}
                </div>
              </div>
            </div>
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('var_price')}"
              class="d-flex justify-center"
              style="height: 33%;"
            >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -11px;"
            >
              <sort-indicator
                :columnName="'with_var_price'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('with_var_price')"
                class="d-flex line-break-one"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8 line-break-one">
                  {{ $t('with_var_price') }}
                </div>
              </div>
            </div>
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('marginal_price')}"
              class="d-flex justify-start"
              style="height: 33%;"
            >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -15px;"
            >
              <sort-indicator
                :columnName="'marginal_price'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('marginal_price')"
                class="d-flex line-break-one"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8 line-break-one">
                  {{ $t('marginal_price') }}
                </div>
              </div>
            </div>
          </div>
      </template>
      <template #header.status="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column justify-center align-center"
          style="height: 100%;"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('status')}"
            class="d-flex justify-end"
          >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -20px;"
            >
              <sort-indicator
                :columnName="'status'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('status')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center font-8">
                {{ $t('status') }}
              </div>
            </div>
          </div>
          <div
          :class="{'font-weight-black primary--text': options.sortBy.includes('warranty')}"
            class="d-flex justify-end mt-1"
          >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -20px;"
            >
              <sort-indicator
                :columnName="'warranty'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('warranty')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center font-8">
                {{ $t('warranty') }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #header.serial_number="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column justify-center align-center"
          style="height: 100%;"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('serial_number')}"
            class="d-flex justify-end"
          >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -20px;"
            >
              <sort-indicator
                :columnName="'serial_number'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('serial_number')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center font-8">
                {{ $t('serial_number') }}
              </div>
            </div>
          </div>
          <div
          :class="{'font-weight-black primary--text': options.sortBy.includes('balance_warranty_term')}"
            class="d-flex justify-end mt-1"
          >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -20px;"
            >
              <sort-indicator
                :columnName="'balance_warranty_term'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('balance_warranty_term')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center font-8">
                {{ $t('balance_warranty_term') }}
              </div>
            </div>
          </div>
          <div
          :class="{'font-weight-black primary--text': options.sortBy.includes('warranty')}"
            class="d-flex justify-end mt-1"
          >
            <div 
            class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            style="margin-left: -20px;"
            >
              <sort-indicator
                :columnName="'warranty'"
                :options="options"
              ></sort-indicator>
            </div>
            <div
              @click="sortRows('warranty')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center font-8">
                Дата окончания
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #item.id="{item}">
        <div
          class="product-id d-flex flex-column justify-center align-end bordered-left"
          style="height: 90%;" 
          draggable="true"
          :id="`product-${item.id}`"
          :data-id="item.id"
        >
          <div class="font-12">{{ item.id }}</div>
          <div class="font-12">{{ item.date | dateFormat }}</div>
          <a class="font-12 text-blue" @click.stop.prevent="editPurchase(item.purchase)">
            {{ item.number }}
          </a>
        </div>
      </template>
      <template #item.image="{ item }">
        <light-box 
        @click.stop.prevent 
        v-if="!!item.images && item.images.length" 
        :key="item.id" 
        :images="item.images" 
        class="light-box"
          style="height: 56px;"
        />
      </template>
      <template #item.name="{ item }">
        <div 
          class="d-flex justify-space-between align-start"
          dir="rtl"
        >
          <div class="mr-3">
            <a
              @click.stop="openCategoryProductDialog(item)"
              class="text-h3 font-weight-black text-blue font-12"
              draggable="true"
            >
              <div
                :class="{'full-highlight-result': isFullSearch(item, 'name')}"
                v-html="item.highlightResult._highlightResult.name.value"
                v-if="!!item.highlightResult" class="highlightResult d-inline text-blue font-12 line-break-two"
              ></div>
              <div v-else class="d-inline">
              <span class="text-blue font-12 line-break-two" v-if="typeof item.name === 'object'" v-html="(item.name[$i18n.locale])"></span>
              <span class="text-blue font-12 line-break-two" v-else v-html="(item.name)"></span>
              </div>
            </a>
          </div>
          <div>
            <v-tooltip
              open-delay="400"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click.stop="copyToClipboard(typeof item.name === 'object' ? item.name[$i18n.locale] : item.name)"
                  class="copy-icon pa-0 ma-0"
                  small
                  tag="a"
                  v-bind="attrs"
                  v-on="on"
                >mdi-content-copy</v-icon>
              </template>
              <span>{{ 'копировать' }}</span>
            </v-tooltip>
          </div>
        </div>
        <div
          :class="{'full-highlight-result': isFullSearch(item, 'sku_original')}"
          class="highlightResult font-12"
          dir="rtl"
          v-html="item.highlightResult._highlightResult.sku_original.value"
          v-if="!!item.highlightResult"
        ></div>
        <div
          class="align-center d-flex justify-space-between mt-1 font-12"
          dir="rtl"
          v-else
        >
          <div class="fon-12 mr-2">
            {{ typeof item.category_name == 'string' ? JSON.parse(item.category_name)[$i18n.locale] : item.category_name[$i18n.locale] }}
          </div>
          <div class="d-flex align-start">
            <span
              @click.stop
              class="font-12 ml-2 text-blue"
              v-html="(item.sku_original)"
            ></span>
            <div>
              <v-tooltip
                open-delay="400"
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click.stop="copyToClipboard(item.sku_original)"
                    class="copy-icon pa-0 ma-0"
                    small
                    tag="a"
                    v-bind="attrs"
                    v-on="on"
                  >mdi-content-copy</v-icon>
                </template>
                <span>{{ 'копировать' }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </template>
      <template #item.manufacturer="{ item }">
        <div 
        class="d-flex flex-column justify-space-between bordered-left" 
        style="height: 90%;" 
        >
          <a
            :href="item.url"
            class="text-decoration-none font-12 text-green-light line-break-one"
            target="_blank"
            v-if="!!item.url && !item.url.indexOf('http')"
          >{{ item.manufacturer }}</a>
          <span
            v-else
            class="font-12 line-break-one"
          >{{ item.manufacturer }}</span>
          <span v-if="!item.is_vendor_corrected" style="color: red"> *</span>
          <a
            :href="item.link_manufacturer"
            class="text-decoration-none font-12 text-blue line-break-one"
            target="_blank"
            v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')"
          >{{ item.vendor }}</a>
          <span class="font-12 line-break-one" v-else>{{ item.vendor }}</span>
        </div>
      </template>
      <template #item.price="{ item }">
        <div
          style="height: 90%;"
          class="px-2 bordered-both d-flex flex-column justify-space-between"
        >
          <div class="text-right font-12">
            {{ item.purchase_producer_price }}
          </div>
          <div class="text-center font-12">
            {{ item.price }}
          </div>
          <div class="mb-1 text-left font-12">
            {{ item.purchase_marginal_price }}
          </div>
        </div>
      </template>
      <template #item.status="{ item }">
        <div class="d-flex flex-column justify-space-between align-center"
        style="height: 90%;"
        >
            <div class="font-12" :style="item.status == 'sold' && 'color: #69D169;'">
            {{ $t(item.status) }}
          </div>
          <div class="font-12" style="color: #FBB03B;">
            {{ item.warranty }} мес.
          </div>
        </div>
      </template>
      <template #item.serial_number="{ item }">
        <div 
        class="d-flex flex-column justify-space-between align-start bordered-left px-1"
        style="height: 90%;"
        >
          <div class="font-12 d-flex jsutify-start">
            {{ item.serial_number }}
          </div>
          <div 
          class="align-center d-flex justify-space-between mt-1"
          style="width: 100%;"
          >
            <div class="font-12" style="color: #3EC4FF;">
              {{ balanceDate(item.date, item.warranty) }}
            </div>
            <div class="font-12" style="color: #3EC4FF;">
              {{ item.warranty_expiration_date }}
            </div>
          </div>
        </div>
      </template>
    </v-data-table>
    <div 
    class="pagination-row popup-pagination pt-1"
    v-if="items.length"
    >
      <v-text-field
        :value="groupsData.meta.per_page"
        @keyup.enter="changeParams({...options, ...{ itemsPerPage: parseInt($event.target.value, 10), page: 1, search: searchText }}, 'change-params')"
        class="mt-1 ml-2 font-8"
        dense
        label="Количество"
        max="2000"
        min="1"
        type="number"
      ></v-text-field>

      <div class="text-center">
        <v-pagination
          :length="paginationMeta.pageCount"
          @input="changeParams({...options, ...{ page: parseInt($event, 10), search: searchText }}, 'change-params')"
          v-model="paginationMeta.page"
        ></v-pagination>
      </div>
    </div>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-model="dialog"
      v-if="dialog && showForm === 'purchase'"
    >
      <v-card>
        <div class="d-flex justify-end pa-2">
        </div>
        <div class="pr-5 pl-5 pb-6">
          <purchase-form
            :purchase="purchase"
            v-if="showForm === 'purchase'"
          ></purchase-form>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-if="dialog && showForm === 'product'"
      v-model="dialog"
      width="85vw"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;"
      >
        <div
          color="transparent"
          dark
          class="d-flex justify-end "
          style="position: absolute; top: -45px; right: -65px;"
          dir="rtl"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="$store.commit('setDialog', false)"
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
                :loading="requestStatus === 'loading'"
                @click="$refs.categoryProductForm.saveProduct()"
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
        </div>
        <v-card-text
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA; height: 100vh;"
        >
          <category-product-form
            :product="product"
            :storeCategory="selectedStoreCategory"
            :storeCategorySelect="storeCategorySelect"
            ref="categoryProductForm"
            v-if="showForm === 'product'"
          ></category-product-form>
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

    <v-snackbar
      :transition="'slide-x-reverse-transition'"
      color="rgba(0, 0, 0, 0.6)"
      right
      timeout="3000"
      top
      v-model="snackbar"
    >
      {{ 'текст скопирован' }}
    </v-snackbar>
  </div>
</template>

<script>
import dateFormat from "../../../filters/date"
import dateMixin from "@/mixins/date";
import paginationMixin from "@/mixins/paginations"
import {mapGetters} from "vuex"

export default {
  name: "CategoryStoreProducts",
  components: {
    CategoryProductForm: () => import("../category/CategoryProductForm"),
    LightBox: () => import("@/views/components/core/LightBox"),
    PurchaseForm: () => import("../purchases/PurchaseForm"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
  },
  data() {
    return {
      _timerId: 0,
      clearSortInterval: 0,
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
      selectedPurchaseProducts: [],
      selectedStoreCategories: [],
      selectedStoreCategory: null,
      showForm: '',
      showMenu: false,
      showSelectedHeadersMenu: false,
      snackbar: false,
    }
  },

  filters: {
    dateFormat
  },

  props: ['groupsData', 'category_id', 'manufacturerNames', 'search', 'searchText'],
  mixins: [dateMixin, paginationMixin],

  computed: {
    ...mapGetters([
      'dialog',
      'product',
      'purchase',
      'requestStatus',
      'saleProducts',
      'storeCategorySelect',
      'vendors',
    ]),

    items() {
      this.selectedPurchaseProducts = this.saleProducts
      this.$eventHandle.$on('sync-selected-products', (groupIds) => {
        this.selectedPurchaseProducts = this.selectedPurchaseProducts.filter(gr => groupIds.indexOf(gr.id) !== -1)
      })
      if (!!this.groupsData && !!this.groupsData.data) {
        this.paginationMeta.page = +this.groupsData.meta.current_page
        this.paginationMeta.perPage = +this.groupsData.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.groupsData.meta.total / this.groupsData.meta.per_page)
        this.$nextTick(() => {
          this.options.itemsPerPage = +this.groupsData.meta.per_page
          this.groupsData.meta.sortBy && (this.options.sortBy = this.groupsData.meta.sortBy)
          this.groupsData.meta.sortDesc && (this.options.sortDesc = this.groupsData.meta.sortDesc)
        })
        return this.groupsData.data
      }
      return []
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
          selectedHeadersPurchasedProducts: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersPurchasedProducts'})
      }
    },

    selectedHeaders () {
      let selectedHeadersPurchasedProducts = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersPurchasedProducts')
      selectedHeadersPurchasedProducts = selectedHeadersPurchasedProducts && JSON.parse(selectedHeadersPurchasedProducts.value)
      return selectedHeadersPurchasedProducts
    },

    totalStoreProducts () {
      if (!!this.groupsData && !!this.groupsData.meta) {
        return parseInt(this.groupsData.meta.total, 10)
      }
      return 0
    },

    pageCount () {
      if (!!this.groupsData && !!this.groupsData.meta) {
        return Math.ceil(this.totalStoreProducts / parseInt(this.options.itemsPerPage, 10)) || 1
      }
      return 1
    },

    itemsPerPage () {
      return this.groupsData && this.groupsData.meta && +this.groupsData.meta.per_page || 5
    }
  },

  async created() {
    this.initialize()

    this.headers = Object.values(this.headersMap)
    await this.$store.dispatch('getVendors', {all: true})

    this.headers = Object.values(this.headersMap)
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersStore'})
  },

  mounted() {
    this.options.itemsPerPage = +this.itemsPerPage
    this.selectedPurchaseProducts = this.saleProducts
    this.$eventHandle.$on('sync-selected-products', (groupIds) => {
      this.selectedPurchaseProducts = this.selectedPurchaseProducts.filter(gr => groupIds.indexOf(gr.id) !== -1)
    })

    this.innerHeight = window.innerHeight - 200
    this.$refs.table.$el.addEventListener('click', this.bindedOnTableClick)
  },

  destroyed() {
    this.$eventHandle.$off('sync-selected-products')
  },

  methods: {
    _deselectAll() {
      this.selected = [];
    },

    initialize() {
      this.headersMap = [
        {text: 'ID', value: 'id', align: 'end', sortable: true, class: 'caption', width: 80},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption px-0', cellClass: 'px-0 white', width: 83},
        {text: this.$t('name'), value: 'name', align: 'start', sortable: true, class: 'caption', width: "34%"},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: true, class: 'caption', width: 96},
        {text: this.$t('with_var_price'), value: 'price', align: 'center', sortable: true, class: 'caption', width: 87},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: true, class: 'caption', width: 79},
        {text: this.$t('serial_number'), value: 'serial_number', align: 'center', sortable: true, class: 'caption', width: 134},
      ]
    },

    async editPurchase(purchase) {
      let data = await this.$store.dispatch('getPurchase', purchase)
      await this.$store.commit('setPurchaseProducts', data.products);
      this.showForm = 'purchase'
      this.$store.commit('setDialog', true)
    },

    clickRow(purchaseProduct) {
      this.selected(purchaseProduct)
    },

    itemSelected(value) {
      this.selected(value.item)
    },

    toggleSelectAll(selected) {
      this.selectedPurchaseProducts = []
      this.$store.commit('setSaleProducts', [])
      if (selected.value) {
        this.selectedPurchaseProducts = selected.items
        this.selectedPurchaseProducts.forEach(purchaseProduct => {
          this.addSaleProduct(purchaseProduct)
        })
      }
      this.$eventHandle.$emit('updateSaleCost')
    },

    selected(purchaseProduct) {
      if (!!this.selectedPurchaseProducts.find(gr => gr.id === purchaseProduct.id)) {
        this.selectedPurchaseProducts = this.selectedPurchaseProducts.filter(pproduct => pproduct.id !== purchaseProduct.id)
        this.removeSaleProduct(purchaseProduct)
      } else {
        this.selectedPurchaseProducts.push(purchaseProduct)
        this.addSaleProduct(purchaseProduct)
      }
      this.$eventHandle.$emit('updateSaleCost')
    },

    addSaleProduct(purchaseProduct) {
      let saleProducts = this.saleProducts
      if (!saleProducts.some(sp => sp.id === purchaseProduct.id)) {
        saleProducts.push(purchaseProduct)
      }
      this.$store.commit('setSaleProducts', saleProducts)
    },

    removeSaleProduct(purchaseProduct) {
      let saleProducts = this.saleProducts
      saleProducts = saleProducts.filter(sproduct => sproduct.id !== purchaseProduct.id)
      this.$store.commit('setSaleProducts', saleProducts)
    },

    editProduct(item) {
      this.$store.dispatch('getEditProduct', {
        id: item.productId,
        var_price: item.price,
      }).then(() => {
        this.$store.commit('setDialog', true)
        this.showForm = 'product'
      })
    },

    closeModal() {
      this.$store.commit('setDialog', false)
      this.showForm = ''
    },

    sortRows: function(sortKey) {
      // this.options.sortDesc[0] = !this.options.sortDesc[0]
      // this.options.sortBy = []
      // this.options.sortBy.push(sortKey)
      if (this.requestStatus === 'loading') {
        return
      }
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
    
    onUpdatePage(e) {
      this._deselectAll();
    },

    async copyToClipboard (text) {
      this.snackbar = true
      if (!navigator.clipboard) {
        let textArea = document.createElement("textarea")
        textArea.value = text
        // Avoid scrolling to bottom
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          let successful = document.execCommand('copy')
          // let msg = successful ? 'successful' : 'unsuccessful'
          // console.log('Fallback: Copying text command was ' + msg)
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err)
        }
        document.body.removeChild(textArea)
        return
      }
      try {
        await navigator.clipboard.writeText(text)
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
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
  },

  watch: {
    search: function(val, oldVal) {
      this.changeParams({...this.options, ...{sortLocale: this.$i18n.locale, search: this.search}}, 'change-params')
    },
  },
}
</script>

<style lang="scss">
.highlightResult em {
  font-weight: bold;
  background: yellow;
}
</style>
