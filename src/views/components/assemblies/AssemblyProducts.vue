<template>
  <div>
    <v-data-table
      :headers="showHeaders"
      :item-class="itemClass"
      :items-per-page="-1"
      :items="assemblyProducts"
      class="category-products-table assembly-products-table offers-products__group"
      fixed-header
      height="100%"
      hide-default-footer
      sort-by="position"
      style="height: 100%;"
    >
      <template #header.select="{ header }">
        <div class="column">
          <div>
            <!-- <v-checkbox
            class="offers-product-group__header-checkbox"
            ></v-checkbox> -->
          </div>
        </div>
      </template>
      <template #header.id="{ header }">
        <div @contextmenu="showSelectedHeaders">
          <div class="offers-product-group__header-id mr-2">
            <span class="text-end font-8 d-block">{{ 'ID тов.' }}</span>
            <span class="text-end font-8 d-block mt-1">{{ 'ID гр.' }}</span>
          </div>
        </div>
      </template>
      <template #header.image="{ header }">
        <span class="text-center font-8">
          Изображения
        </span>
      </template>
      <template #header.name="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex justify-space-between align-center"
        >
          <span class="justify-end font-8 ml-3 d-block">{{ $t('sku_original') }}</span>
          <div class="mr-3">
            <span class="font-8 d-block text-end">{{ $t('name') }}</span>
            <span class="font-8 d-block text-end mt-1">Категория</span>
          </div>
        </div>
      </template>
      <template #header.manufacturer="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right"
        >
         <div class="column">
            <span class="justify-end text-gray font-8 d-block">{{ $t('manufacturer') }}</span>
            <span class="justify-end text-gray font-8 d-block mt-1">{{ $t('vendor') }}</span>
          </div>
        </div>
      </template>
      <template #header.var_price="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-center"
        >
          <div 
          class="column justify-space-around" 
          style="height: 100% !important;"
          >
            <span 
            class="justify-end font-8 line-break-one d-block" 
            style="line-height: 8px !important;"
            >{{ $t('price') }}</span>
            <span 
            class="justify-center font-8 line-break-one d-block" 
            style="line-height: 8px !important;"
            >{{ $t('var_price') }}</span>
            <span 
            class="justify-start font-8 line-break-one d-block" 
            style="line-height: 8px !important;"
            >{{ $t('marginal_price') }}</span>
          </div>
        </div>
      </template>
      <template #header.status="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-center"
        >
          <div class="column">
            <div class="justify-center font-8">{{ $t('status') }}</div>
            <div class="justify-center font-8 mt-1">{{ $t('warranty') }}</div>
          </div>
        </div>
      </template>
      <template #header.status="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right"
        >
          <div class="column">
            <div class="justify-end font-8">{{ $t('status') }}</div>
            <div class="justify-end font-8">{{ $t('warranty') }}</div>
          </div>
        </div>
      </template>
      <template #header.qty="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-center"
        >
          <div class="column font-8">
            <div>{{ $t('qty') }}</div>
          </div>
        </div>
      </template>
      <template #header.max_selectable_qty="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-center"
        >
          <div class="column">
            <span class="font-8">Лимит</span>
          </div>
        </div>
      </template>
      <template #header.pivot.position="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-center"
        >
          <div class="column">
            <span class="font-8">№</span>
          </div>
        </div>
      </template>
      <template v-slot:group.header="{ group, headers, toggle, isOpen }">
            <td :colspan="headers.length">
                <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
                    <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                    <v-icon v-else>mdi-chevron-down</v-icon>
                </v-btn>
                {{ group }}
            </td>
      </template>
      <template #body="{ items, headers }">
        <tbody>
            <assembly-product
              :assembly="assembly"
              :collapsedCategories="collapsedCategories"
              :headers="headers"
              :index="index"
              :isNotNewStatus="isNotNewStatus"
              :item="item"
              :key="item.id"
              :manufacturerNames="manufacturerNames"
              :vendor="allVendors.find(v => v.id == item.vendor_id)"
              :warranties="warranties"
              @copyToClipboard="copyToClipboard"
              v-for="(item, index) in items"
            />
        </tbody>
      </template>
    </v-data-table>

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
            v-for="(header, i) in headersMap"
            :key="`item-${i}`"
            :value="header.value"
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
import AssemblyProduct from "./AssemblyProduct"
import {mapGetters} from "vuex"

export default {
  name: 'AssemblyProducts',
  components: {
    AssemblyProduct,
  },
  mounted() {
    // console.log('this.assemblyProducts',this.assemblyProducts);
  },
  updated() {
    // console.log('this.assemblyProducts',this.assemblyProducts);
  },

  computed: {
    ...mapGetters([
      'allVendors',
      'settings',
      'collapsedCategories',
    ]),

    showHeaders () {
      return this.selectedHeadersData && this.headers.filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
    },

    selectedHeadersData: {
      get: function () {
        return this.selectedHeaders || this.headers.map(h => h.value)
      },
      set: async function (newValue) {
        await this.$store.dispatch('saveSetting', {
          selectedHeadersAssemblyProducts: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersAssemblyProducts'})
      }
    },

    selectedHeaders () {
      let selectedHeadersAssemblyProducts = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersAssemblyProducts')
      selectedHeadersAssemblyProducts = selectedHeadersAssemblyProducts && JSON.parse(selectedHeadersAssemblyProducts.value)
      return selectedHeadersAssemblyProducts
    },
  },

  props: ['assemblyProducts', 'manufacturerNames', 'assembly', 'isNotNewStatus'],

  data () {
    return {
      headers: [],
      headersMap: [],
      assemblies: [],
      selectedCategory: {},
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      showSelectedHeadersMenu: false,
      snackbar: false,
      warranties: [],
    }
  },

  created() {
    this.initialize()
    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
      this.assemblyProducts.map(pr => {
        let war = parseInt(pr.warranty)
        if (!!war) {
          if (!this.warranties.find(w => w.value === war)) {
            this.warranties.push({name: pr.warranty, value: war})
          }
          pr.warranty = war
        }
        return pr
      })
    })
    this.headers = Object.values(this.headersMap)
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: this.$t('select'), value: 'select', align: 'center', sortable: false, class: 'caption', width: 28},
        {text: 'ID товара / ID группы', value: 'id', align: 'center', sortable: true, class: 'caption px-1', cellClass: 'text-h4', width: 60},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption ', cellClass: 'px-0 white', width: 111},
        {text: this.$t('name'), sortable: false, align: 'start', value: 'name', width: '36%'},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: true, class: 'caption', cellClass: 'text-h4', width: 113},
        {text: this.$t('with_var_price'), sortable: false, align: 'center', value: 'var_price', width: 96},
        {text: this.$t('status'), sortable: false, align: 'center', value: 'status', width: 78},
        {text: this.$t('qty'), sortable: false, align: 'center', value: 'qty', width: 53},
        {text: this.$t('limit'), sortable: false, align: 'center', value: 'max_selectable_qty', width: 54},
        {text: '№', value: 'pivot.position', align: 'center', sortable: false, class: 'caption', width: 39},
        {text: '', value: 'actions', align: 'center', sortable: false, class: 'caption', width: 32}
      ]
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

    showSelectedHeaders (e) {
      e.preventDefault()
      this.showSelectedHeadersMenu = false
      this.selectedHeadersMenuX = e.clientX
      this.selectedHeadersMenuY = e.clientY
      this.$nextTick(() => {
        this.showSelectedHeadersMenu = true
      })
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
  },
}
</script>

<style>
.v-data-table-header__icon {
  display: none !important;
}

.group_id-th {
  max-width: 120px;
}
</style>
