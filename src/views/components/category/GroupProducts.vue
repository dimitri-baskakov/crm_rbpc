<template>
  <div>
    <v-data-table
      :headers="showHeaders"
      :item-class="itemClass"
      :items="groupProducts"
      :server-items-length="totalProducts"
      @contextmenu:row="getMenu"
      @dblclick:row="viaEditGroup"
      class="category-products-table"
      dense
      fixed-header
      height="calc(100vh - 100px)"
      hide-default-footer
      multi-sort
      ref="table"
      show-select
      v-model="selected"
    >

      <template #header.id="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right"
          style="height: 100%;"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
            class="d-flex justify-end"
            style="height: 100%;"
          >
            <sort-indicator
              :columnName="'id'"
              :options="options"
            ></sort-indicator>
            <div
              @click="sortRows('id')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center">
                {{ 'ID' }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #header.name="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right"
          style="height: 100%;"
        >
          <div
            class="d-flex justify-end"
            style="height: 50%;"
          >
            <div class="d-flex">
              <div class="align-self-center">
                {{ $t('name') }}
              </div>
            </div>
          </div>
          <div
            class="d-flex justify-end"
            style="height: 50%;"
          >
            <div class="d-flex">
              <div class="align-self-center">
                {{ $t('sku_original') }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #header.vendor="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right"
          style="height: 100%;"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('vendor')}"
            class="d-flex justify-end"
            style="height: 100%;"
          >
            <sort-indicator
              :columnName="'vendor'"
              :options="options"
            ></sort-indicator>
            <div
              @click="sortRows('vendor')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center">
                {{ $t('vendor') }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #header.warranty="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right"
          style="height: 100%;"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('warranty')}"
            class="d-flex justify-end"
            style="height: 100%;"
          >
            <sort-indicator
              :columnName="'warranty'"
              :options="options"
            ></sort-indicator>
            <div
              @click="sortRows('warranty')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center">
                {{ $t('warranty') }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #header.producer_price="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right"
          style="height: 100%;"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('producer_price')}"
            class="d-flex justify-end"
            style="height: 33%;"
          >
            <sort-indicator
              :columnName="'producer_price'"
              :options="options"
            ></sort-indicator>
            <div
              @click="sortRows('producer_price')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center">
                {{ $t('price') }}
              </div>
            </div>
          </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('var_price')}"
            class="d-flex justify-end"
            style="height: 33%;"
          >
            <sort-indicator
              :columnName="'var_price'"
              :options="options"
            ></sort-indicator>
            <div
              @click="sortRows('var_price')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center">
                {{ $t('with_var_price') }}
              </div>
            </div>
          </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('marginal_price')}"
            class="d-flex justify-end"
            style="height: 33%;"
          >
            <sort-indicator
              :columnName="'marginal_price'"
              :options="options"
            ></sort-indicator>
            <div
              @click="sortRows('marginal_price')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center">
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
            <sort-indicator
              :columnName="'status'"
              :options="options"
            ></sort-indicator>
            <div
              @click="sortRows('status')"
              class="d-flex"
              style="cursor: pointer;"
            >
              <div class="align-self-center">
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
          class="product-id"
        >{{ item.id }}</div>
      </template>

      <template #item.name="{ item }">
        <div class="align-center d-flex justify-space-between text-h3 font-weight-black" dir="rtl">
          <a
            @click.prevent.stop="editGroup(item)"
            class="text-h3 font-weight-black"
            style="color: #2979FF;"
          >
            <div
              :class="{'full-highlight-result': isFullSearch(item, 'name')}"
              class="highlightResult"
              v-html="item.highlightResult._highlightResult.name.value"
              v-if="!!item.highlightResult"
            ></div>
            <div dir="rtl" v-else class="d-inline">
              <span v-if="typeof item.name === 'object'" v-html="highlightSearch(item.name[$i18n.locale])"></span>
              <span v-else v-html="highlightSearch(item.name)"></span>
            </div>
          </a>
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
          class="highlightResult"
          dir="rtl"
          v-html="item.highlightResult._highlightResult.sku_original.value"
          v-if="!!item.highlightResult"
        ></div>
        <div
          class="align-center d-flex justify-space-between mt-1"
          dir="rtl"
          v-else
        >
          <span
            @click.stop
            class="text-h4"
            v-html="highlightSearch(item.sku_original)"
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
      </template>
      <template #item.image="{ item }">
        <v-row class="pa-0 ma-0" style="min-height: 140px;" align="center">
          <v-col @click.stop.prevent class="pt-1 pb-0 ma-0">
            <light-box @click.stop.prevent v-if="!!item.images && item.images.length" :key="item.id" :images="item.images" class="light-box"/>
          </v-col>
        </v-row>
      </template>

      <template #item.producer_price="{ item }">
        <div v-if="item.product">
          <div class="text-right">
            {{ item.product.producer_price }}
          </div>
          <div class="mt-1 text-center">
            {{ item.product.var_price }}
          </div>
          <div class="mt-1 text-left">
            {{ item.product.marginal_price }}
          </div>
        </div>
      </template>

      <template #item.vendor="{ item }">
        <a
          :href="item.vendor_link"
          class="text-decoration-none text-h3"
          style="color: #64DD17;"
          target="_blank"
          v-if="!!item.vendor_link && !item.vendor_link.indexOf('http')"
        >{{ item.vendor }}</a>
        <span v-else>{{ item.vendor }}</span>
      </template>

      <template #item.status="{ item }">
        <div
          :style="{'color': item.product.status_color}"
          v-if="item.product"
        >
          {{ item.product.status }}<br/>
          <span style="font-size: 10px" dir="rtl">{{ item.product.status_text }}</span>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="product-actions">
          <v-icon
            small class="mr-2"
            @click="editGroup(item)"
          >mdi-pencil
          </v-icon>

          <v-icon
            small
            @click="$emit('remove', item)"
          >mdi-delete
          </v-icon>
        </div>
      </template>
    </v-data-table>

    <v-container v-if="groupProducts.length">
      <v-row justify="space-between">
        <v-col cols="12" md="1">
          <v-text-field
            :value="groupData.meta.per_page"
            @keyup.enter="changeParams({...options, ...{ itemsPerPage: parseInt($event.target.value, 10), page: 1, search: searchText }}, 'change-params')"
            label="Количество"
            min="1"
            type="number"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="11">
          <div class="text-center pt-2">
            <v-pagination
              :length="paginationMeta.pageCount"
              @input="changeParams({...options, ...{ page: parseInt($event, 10) }}, 'change-params')"
              v-model="paginationMeta.page"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-if="showForm"
      v-model="showForm"
      persistent>
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
      v-model="showMenu"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
    >
      <template>
        <v-list dense v-if="selected.length">
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  @click="$emit('remove', {id:0, groupIds: selected.map(group => group.id).join(',')})">
                  Удалить
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  @click="mergeGroups">
                  Объединить группу
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-menu>

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
import {mapGetters} from "vuex"

export default {
  name: 'CategoryProducts',
  components: {
    GroupProductForm: () => import("../../components/category/GroupProductForm"),
    LightBox: () => import("@/views/components/core/LightBox"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
  },
  data() {
    return {
      _timerId: 0,
      contextMenuSelectedId: null,
      headers: [],
      menuX: 0,
      menuY: 0,
      oldSortBy: [],
      oldSortDesc: [],
      options: {
        groupBy: [],
        groupDesc: [],
        itemsPerPage: 11,
        multiSort: true,
        mustSort: false,
        page: 1,
        sortBy: [],
        sortDesc: [],
        sortLocale: this.$i18n.locale,
      },
      selected: [],
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      showForm: false,
      showMenu: false,
      showSelectedHeadersMenu: false,
      snackbar: false,
    }
  },
  props: ['groupData', 'category_id', 'searchText'],
  mixins: [paginationMixin],

  computed: {
    ...mapGetters([
      'settings',
    ]),

    groupProducts() {
      if (this.groupData) {
        this.paginationMeta.page = +this.groupData.meta.current_page
        this.paginationMeta.perPage = +this.groupData.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.groupData.meta.total / this.groupData.meta.per_page)
        this.$nextTick(() => {
          this.options.itemsPerPage = this.groupData.meta.per_page
          this.groupData.meta.sortBy && (this.options.sortBy = this.groupData.meta.sortBy)
          this.groupData.meta.sortDesc && (this.options.sortDesc = this.groupData.meta.sortDesc)
        })
        return this.groupData.data
      }
      return []
    },

    showHeaders () {
      return this.selectedHeadersData && this.headers.filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
    },

    totalProducts () {
      if (!!this.groupData && !!this.groupData.meta) {
        return parseInt(this.groupData.meta.total, 10)
      }
      return 0
    },

    pageCount () {
      if (!!this.groupData && !!this.groupData.meta) {
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
          selectedHeadersGroupProducts: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersGroupProducts'})
      }
    },

    selectedHeaders () {
      let selectedHeadersGroupProducts = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersGroupProducts')
      selectedHeadersGroupProducts = selectedHeadersGroupProducts && JSON.parse(selectedHeadersGroupProducts.value)
      return selectedHeadersGroupProducts
    },
  },

  async created() {
    this.initialize();

    this.headers = Object.values(this.headersMap)
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersGroupProducts'})
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: 'ID', value: 'id', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h3', width: 100},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption px-0', width: 130, cellClass: 'px-0'},
        {text: this.$t('name'), value: 'name', align: 'start', sortable: false, class: 'caption'},
        {text: this.$t('vendor'), value: 'vendor', align: 'end', sortable: false, class: 'caption', width: 130},
        {text: this.$t('warranty'), value: 'warranty', align: 'end', sortable: false, class: 'caption', cellClass: 'text-h4', width: 115},
        {text: this.$t('price'), value: 'producer_price', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4', width: 120},
        {text: this.$t('status'), value: 'status', align: 'end', sortable: false, class: 'caption', cellClass: 'text-h4', width: 110},
      ];
    },

    viaEditGroup(e, data) {
      this.editGroup(data.item)
    },

    editGroup(group) {
      this.$store.dispatch('getGroupProduct', {
        id: group.id,
        category_id: this.category_id
      }).then(() => {
        this.showForm = 'groupProduct'
      })
    },

    getMenu(e, { item }) {
      this.contextMenuSelectedId = item.id
      if (!this.selected.length) {
        this.selected.push(item)
      }
      this.showMenu = false
      this.menuX = e.clientX
      this.menuY = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
      e.preventDefault()
    },

    savedGroup() {
      this.showForm = false
    },

    isFullSearch(item, arrt) {
      return item[arrt].toLowerCase().includes(item.search.toLowerCase())
    },

    mergeGroups() {
      let groupWithManyProducts = this.selected.filter(group => group.products.length > 1)

      if (groupWithManyProducts.length > 1) {
        return this.$swal({
          title: 'У выбранных групп имеются много товаров!',
          icon: "warning",
          value: true,
          button: 'OK',
        })
      } else {
        this.$store.dispatch('mergeGroupProduct', {
          groupIds: this.selected.map(group => group.id).join(','),
        }).then(() => {
          this.$emit('fetch')
        })
      }
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

    highlightSearch(text) {
      return this.searchText && text && text.replace(new RegExp(this.searchText, "gi"), match => {
        return '<span class="full-highlight-result">' + match + '</span>';
      }) || text
    },

    showSelectedHeaders (e) {
      this.showSelectedHeadersMenu = false
      this.selectedHeadersMenuX = e.clientX
      this.selectedHeadersMenuY = e.clientY
      this.$nextTick(() => {
        this.showSelectedHeadersMenu = true
      })
      e.preventDefault()
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
  }
}
</script>

<style lang="scss">
#dragged-image {
  position: fixed;
  left: -300px;
  top: -300px;
}

.highlightResult em {
  font-weight: bold;
}

.full-highlight-result {
  font-weight: bold;
  background: yellow;
}
</style>
