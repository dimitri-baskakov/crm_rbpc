<template>
  <div class="" style="">
      <v-data-table
        :headers="showHeaders"
        :item-class="itemClass"
        :items="items"
        :server-items-length="totalProducts"
        @click:row="clickRow"
        @item-selected="itemSelected"
        @toggle-select-all="toggleSelectAll"
        class="category-products-table category-products-top-row assembly-product-table"
        fixed-header
        height="100%"
        hide-default-footer
        multi-sort
        ref="table"
        show-select
        style="height: calc(100% - 30px); padding-bottom: 4.5px"
        v-model="selectedProducts"
      >

        <template #header.id="{ header }">
          <div
            @contextmenu="showSelectedHeaders"
            class="text-right column justify-center"
          >
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
              class="d-flex justify-end"
              style="padding-right: 4px !important;"
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
                <div class="align-self-center font-8">
                  {{ 'ID тов.' }}
                </div>
              </div>
            </div>
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('group_id')}"
              class="d-flex justify-end mt-1"
            >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
              <sort-indicator
                :columnName="'group_id'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('group_id')"
                class="d-flex"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8">
                  {{ 'ID гр.' }}
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
            class="justify-space-between align-center"
          >
            <div
              class="d-flex ml-3"
            >
              <div class="d-flex">
                <div class="align-self-center font-8">
                  {{ $t('name') }}
                </div>
              </div>
            </div>
            <div
              class="d-flex justify-end mr-3"
            >
              <div class="d-flex">
                <div class="align-self-center font-8">
                  {{ $t('sku_original') }}
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
        <template #header.producer_price="{ header }">
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
                class="d-flex"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8">
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
                :columnName="'var_price'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('var_price')"
                class="d-flex"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8">
                  {{ $t('var_price') }}
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
            style="margin-left: -12px;"
            >
              <sort-indicator
                :columnName="'marginal_price'"
                :options="options"
              ></sort-indicator>
              </div>
              <div
                @click="sortRows('marginal_price')"
                class="d-flex"
                style="cursor: pointer;"
              >
                <div class="align-self-center font-8">
                  {{ $t('marginal_price') }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #header.status="{ header }">
          <div
            @contextmenu="showSelectedHeaders"
            class="text-right"
            style="height: 100%;"
          >
            <div
              :class="{'font-weight-black primary--text': options.sortBy.includes('status')}"
              class="d-flex justify-end"
              style="height: 100%;"
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
          </div>
        </template>
        <template #item.id="{item}">
          <div
            :data-id="item.id"
            :id="`product-${item.id}`"
            class="product-id d-flex flex-column justify-space-around bordered-left"
            style="height: 90%;"
          >
            <div class="font-12">{{ item.id }}</div>
            <div class="mt-2 font-weight-black">
              <a class="font-12 text-blue" @click.prevent.stop="editGroup(item.group_id)">
                {{ item.group_id }}
              </a>
            </div>
          </div>
        </template>
        <template #item.image="{ item }">
          <light-box 
          class="light-box px-1"
          @click.stop.prevent 
          v-if="!!item.images && item.images.length" 
          :key="item.id" :images="item.images" 
          style="height: 57px;"
          />
        </template>
        <template #item.name="{ item }">
          <div dir="rtl" class="align-start d-flex justify-space-between">
            <div class="mr-3">
              <a
                @click.prevent.stop="openCategoryProductDialog(item.id)"
                class="text-h3 font-weight-black text-blue font-12"
                draggable="true"
              >
                <div
                  :class="{'full-highlight-result': isFullSearch(item, 'name')}"
                  v-html="item.highlightResult._highlightResult.name.value"
                  v-if="!!item.highlightResult" class="highlightResult d-inline text-blue font-12 line-break-two"
                ></div>
                <div v-else class="d-inline">
                  <span class="text-blue font-12 line-break-two" v-if="typeof item.name === 'object'" v-html="highlightSearch(item.name[$i18n.locale])"></span>
                  <span class="text-blue font-12 line-break-two" v-else v-html="highlightSearch(item.name)"></span>
                </div>
              </a>
            </div>
            <div class="pl-2">
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
                <span>{{ $t('copy') }}</span>
              </v-tooltip>
            </div>
          </div>
          <div
            :class="{'full-highlight-result': isFullSearch(item, 'sku_original')}"
            class="highlightResult font-12 text-blue"
            dir="rtl"
            v-html="item.highlightResult._highlightResult.sku_original.value"
            v-if="!!item.highlightResult"
          ></div>
          <div
            class="d-flex justify-end align-center mt-1"
            dir="rtl"
            v-else
          >
            <span
              @click.stop
              class="text-blue font-12 line-break-one"
              v-html="highlightSearch(item.sku_original)"
            ></span>
            <div class="mr-3 pl-2">
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
        </template>
        <template #item.manufacturer="{ item }">
          <div
          class="d-flex flex-column justify-space-around bordered-left pr-3" 
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
        <template #item.producer_price="{ item }">
          <div
            style="height: 90%;"
            class="px-2 bordered-both d-flex flex-column justify-space-between"
          >
            <div class="text-right font-12">
              {{ item.producer_price }}
            </div>
            <div class="text-center font-12">
              {{ item.var_price }}
            </div>
            <div class="text-left font-12">
              {{ item.marginal_price }}
            </div>
          </div>
        </template>
        <template #item.status="{ item }">
          <div class="font-12 text-center" :style="{'color': item.status_color}">
            {{ item.status }}
            <span class="d-block text-center font-12" dir="rtl">{{ item.status_text }}</span>
          </div>
        </template>
      </v-data-table>
    <div v-if="items.length" 
    class="pagination-row popup-pagination pt-1"
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
      persistent
      v-if="showForm"
      v-model="showForm"
    >
      <v-card>
        <div class="d-flex justify-end pa-2">
          <v-icon class="" large @click="showForm = false">mdi-close</v-icon>
        </div>
        <div class="pr-5 pl-5 pb-6">
          <group-product-form @saved="savedGroup"/>
        </div>
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
import paginationMixin from "@/mixins/paginations";
import {mapGetters} from "vuex";

export default {
  name: "CategoryProducts",
  components: {
    LightBox: () => import("@/views/components/core/LightBox"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
    GroupProductForm: () => import("../../components/category/GroupProductForm"),
  },
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
      selectedProducts: [],
      showForm: false,
      showSelectedHeadersMenu: false,
      snackbar: false,
    }
  },

  props: ['warranties', 'groupsData', 'category_id', 'manufacturerNames', 'searchText'],
  mixins: [paginationMixin],

  computed: {
    ...mapGetters([
      'assemblyProducts',
      'requestStatus',
      'settings',
    ]),

    items() {
      this.selectedProducts = this.assemblyProducts
      this.$eventHandle.$on('sync-selected-products', (groupIds) => {
        this.selectedProducts = this.selectedProducts.filter(gr => groupIds.indexOf(gr.id) !== -1)
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

    totalProducts () {
      if (!!this.groupsData && !!this.groupsData.meta) {
        return parseInt(this.groupsData.meta.total, 10)
      }
      return 0
    },

    pageCount () {
      if (!!this.groupsData && !!this.groupsData.meta) {
        return Math.ceil(this.totalProducts / parseInt(this.options.itemsPerPage, 10)) || 1
      }
      return 1
    },

    selectedHeadersData: {
      get: function () {
        return this.selectedHeaders || this.headers.map(h => h.value)
      },
      set: async function (newValue) {
        await this.$store.dispatch('saveSetting', {
          selectedHeadersCategoryProductsAssembly: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersCategoryProductsAssembly'})
      }
    },

    selectedHeaders () {
      let selectedHeadersCategoryProductsAssembly = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersCategoryProductsAssembly')
      selectedHeadersCategoryProductsAssembly = selectedHeadersCategoryProductsAssembly && JSON.parse(selectedHeadersCategoryProductsAssembly.value)
      return selectedHeadersCategoryProductsAssembly
    },
  },

  async created() {
    this.initialize();
    this.headers = Object.values(this.headersMap)
  },

  destroyed() {
    this.$eventHandle.$off('sync-selected-products')
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: 'ID', value: 'id', align: 'center', sortable: false, class: 'caption px-1', cellClass: 'text-h4', width: 60},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption px-0', cellClass: 'px-0 white',  width: 105},
        {text: this.$t('name'), value: 'name', align: 'start', sortable: false, class: 'caption', width: "42%"},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: false, class: 'caption', cellClass: 'text-h4', width: 114},
        {text: this.$t('price'), value: 'producer_price', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4 px-0', width: 96},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: false, class: 'caption', width: 90}
      ];
    },

    clickRow(group) {
      this.selected(group)
    },

    itemSelected(value) {
      this.selected(value.item)
    },

    toggleSelectAll(selected) {
      this.selectedProducts = []
      this.$store.commit('setAssemblyProducts', [])
      if (selected.value) {
        this.selectedProducts = selected.items
        this.selectedProducts.forEach(group => {
          this.addAssemblyProduct(group)
        })
      }
      this.$eventHandle.$emit('updateAssemblyCost')
    },

    selected(group) {
      if (!!this.selectedProducts.find(gr => gr && gr.id === group.id)) {
        this.selectedProducts = this.selectedProducts.filter(gr => gr && gr.id !== group.id)
        this.removeAssemblyProduct(group)
      } else {
        this.selectedProducts.push(group)
        this.addAssemblyProduct(group)
      }
      this.$eventHandle.$emit('updateAssemblyCost')
    },

    addAssemblyProduct(product) {
      let assemblyProductBase = this.assemblyProducts.find(ap => !!ap && ap.root_category.id === product.root_category.id)
      // console.log(assemblyProductBase.pivot)
      this.$set(product, 'pivot', {})
      this.$set(product, 'manufacturer_id', Object.keys(this.manufacturerNames).find(key => this.manufacturerNames[key] == product.manufacturer))
      this.$set(product.pivot, 'qty', 1)
      this.$set(product, 'price', product.var_price)
      this.$set(product, 'percent', null)
      this.$set(product.pivot, 'max_selectable_qty', (!!assemblyProductBase.pivot && (assemblyProductBase.pivot.checkbox || assemblyProductBase.requred) && assemblyProductBase.pivot.max_selectable_qty) || 1)
      this.$set(product, 'in_box_qty', 1)
      this.$set(product, 'main', false)
      this.$set(product.pivot, 'checkbox', !!assemblyProductBase.pivot && assemblyProductBase.pivot.checkbox)
      this.$set(product.pivot, 'required', !!assemblyProductBase.pivot && assemblyProductBase.pivot.required)
      this.$set(product, 'position', this.assemblyProducts.length)
      this.$set(product, 'show', true)
      if (!!product.warranty) {
        if (!this.warranties.find(w => w.value === parseInt(product.warranty, 10))) {
          this.warranties.push({name: product.warranty, value: parseInt(product.warranty, 10)})
        }
      }
      let assemblyProducts = this.assemblyProducts
      if (!assemblyProducts.some(sp => sp.id === product.id)) {
        assemblyProducts.push(product)
      }

      let sortByPrice = function(obj1, obj2) {
        return obj1.var_price - obj2.var_price
      }

      let categoryIds = ([...new Set(assemblyProducts.map(ap => ap && ap.root_category.id) || [])]).filter(apId => apId != undefined) || []

      let sortedAssemblyProducts = this.assemblyProducts.sort(sortByPrice)
      let groupedAssemblyProducts = []
      let groupIndex = 0
      sortedAssemblyProducts.map((ap, indx) => {
        groupIndex = ((ap && ap.root_category.id && (parseInt(categoryIds.indexOf(ap.root_category.id)) + 1)) || 1) * 10000
        if (ap) {
          groupedAssemblyProducts[(groupIndex + indx)] = ap
        }
      })
      groupedAssemblyProducts = groupedAssemblyProducts.filter(Boolean)

      let positionedAssemblyProducts = groupedAssemblyProducts.map((gap, indx) => {
        if (gap) {
          gap.position = indx
        }
        return gap
      })
      this.$store.commit('setAssemblyProducts', positionedAssemblyProducts)

      // this.$store.commit('setAssemblyProducts', assemblyProducts)
    },

    removeAssemblyProduct(product) {
      let assemblyProducts = this.assemblyProducts;
      assemblyProducts = assemblyProducts.filter(op => op && op.id !== product.id)
      this.$store.commit('setAssemblyProducts', assemblyProducts)
    },

    highlightSearch(text) {
      return this.searchText && text && text.replace(new RegExp(this.searchText, "gi"), match => {
        return '<span class="full-highlight-result">' + match + '</span>';
      }) || text
    },

    itemClass (item) {
      let cssClass = []
      if (item.deleted_at) {
        cssClass.push('deleted-product')
      }
      if (item.id == this.contextMenuSelectedId && this.showMenu) {
        cssClass.push('context-menu-selected')
      }
      return cssClass
    },

    sortRows: function(sortKey) {
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

    async copyToClipboard (text) {
      this.snackbar = true
      if (!navigator.clipboard) {
        let textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          let successful = document.execCommand('copy')
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

    editGroup(groupId) {
      this.$store.dispatch('getGroupProduct', {
        id: groupId,
        category_id: this.category_id
      }).then(() => {
        this.showForm = 'groupProduct'
      })
    },

    savedGroup() {
      this.showForm = false
    },

    async openCategoryProductDialog(id) {
      await this.$store.dispatch('getEditProduct', {id})
      this.$store.commit('setDialog', true)
    },
  },
}
</script>

<style lang="scss">
.highlightResult em {
  font-weight: bold;
  background: yellow;
}

.full-highlight-result {
  font-weight: bold;
  background: yellow;
}
</style>
