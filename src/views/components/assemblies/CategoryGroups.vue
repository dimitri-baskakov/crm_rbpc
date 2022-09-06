<template>
  <div class="items-table" style="height: 35vh;">
    <v-scroll-y-transition mode="out-in">
      <v-data-table
        :headers="showHeaders"
        :items-per-page="parseInt(paginationMeta.perPage, 10)"
        :items="items"
        @click:row="clickRow"
        @item-selected="itemSelected"
        @toggle-select-all="toggleSelectAll"
        class="elevation-1"
        dense
        fixed-header
        hide-default-footer
        ref="table"
        show-select
        sort-by="items"
        v-model="selectedGroups"
      >
        <template #header>
          <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            bottom
            left
            max-height="35vh"
            max-width="70vw"
            offset-x
            offset-y
          >
            <template
              v-slot:activator="{ on, attrs }"
            >
              <v-btn
                color="grey"
                fab
                style="position: absolute; right: 0; top: 10px; z-index: 3;"
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>mdi-view-column-outline</v-icon>
              </v-btn>
            </template>
            <v-list
              flat
            >
              <v-list-item-group
                active-class=""
                multiple
                v-model="selectedHeaders"
              >
                <v-list-item
                  :key="`item-${i}`"
                  :value="header"
                  v-for="(header, i) in headersMap"
                >
                  <template v-slot:default="{ active }">
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
        </template>

        <template v-slot:item.name="{ item }">
          <div v-if="!!item.highlightResult" class="highlightResult"
               :class="{'full-highlight-result': isFullSearch(item, 'name')}"
               v-html="item.highlightResult._highlightResult.name.value"></div>
          <div v-else>
            <span v-if="typeof item.name === 'object'" v-html="highlightSearch(item.name[$i18n.locale])"></span>
            <span v-else v-html="highlightSearch(item.name)"></span>
          </div>
        </template>

        <template v-slot:item.image="{ item }">
          <light-box v-if="!!item.images && item.images.length" :key="item.id" :images="item.images"/>
        </template>

        <template v-slot:item.manufacturer="{ item }">
          <a v-if="!!item.product.url && !item.product.url.indexOf('http')" :href="item.product.url"
             target="_blank">{{ manufacturerNames[item.product.manufacturer_id] }}
          </a>
          <span v-else>{{ manufacturerNames[item.product.manufacturer_id] }}</span>
        </template>

        <template v-slot:item.sku_original="{ item }">
          <div v-if="!!item.highlightResult"
               class="highlightResult"
               :class="{'full-highlight-result': isFullSearch(item, 'sku_original')}"
               v-html="item.highlightResult._highlightResult.sku_original.value"></div>
          <div v-else v-html="highlightSearch(item.sku_original)"></div>
        </template>

        <template v-slot:item.vendor="{ item }">
          <a v-if="!!item.vendor_link && !item.vendor_link.indexOf('http')" :href="item.vendor_link"
             target="_blank">{{ item.vendor }}</a>
          <span v-else>{{ item.vendor }}</span>
        </template>

        <template v-slot:item.status="{ item }">
          <div :style="{'color': item.product.status_color}" v-if="item.product">
            {{ item.product.status }}<br/>
            <span style="font-size: 10px" dir="rtl">{{ item.product.status_text }}</span>
          </div>
        </template>
      </v-data-table>
    </v-scroll-y-transition>

    <v-container v-if="items.length && !!!items[0].highlightResult">
      <v-row justify="space-between">
        <v-col cols="12" md="1">
          <v-text-field
            label="Количество"
            type="number"
            min="1"
            @keyup.enter="changePerPage($event, 'change-per-page-products')"
            :value="paginationMeta.perPage"
          />
        </v-col>
        <v-col cols="12" md="11">
          <div class="text-center pt-2">
            <v-pagination
              v-model="paginationMeta.page"
              :length="paginationMeta.pageCount"
              @input="selectedPage($event, 'change-page-products')"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import paginationMixin from "@/mixins/paginations";
import LightBox from "@/views/components/core/LightBox";

export default {
  name: "CategoryGroups",
  components: {LightBox},
  data: () => ({
    headers: [],
    headersMap: [],
    selectedGroups: [],
    selectedHeaders: [],
  }),

  props: ['warranties', 'groupsData', 'category_id', 'manufacturerNames', 'searchText'],
  mixins: [paginationMixin],

  computed: {
    ...mapGetters([
      'settProducts'
    ]),
    items() {
      if (!!this.groupsData && !!this.groupsData.data) {
        this.paginationMeta.page = this.groupsData.meta.current_page
        this.paginationMeta.perPage = this.groupsData.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.groupsData.meta.total / this.groupsData.meta.per_page)
        return this.groupsData.data
      }
      return []
    },
    
    showHeaders () {
      return this.headers.filter(s => this.selectedHeaders.includes(s));
    },
  },

  created() {
    this.initialize();
    this.selectedGroups = this.settProducts.map(p => p.group)
    this.$eventHandle.$on('sync-selected-products', (groupIds) => {
      this.selectedGroups = this.selectedGroups.filter(gr => groupIds.indexOf(gr.id) !== -1)
    })

    this.headers = Object.values(this.headersMap)
    this.selectedHeaders = this.headers
  },

  destroyed() {
    this.$eventHandle.$off('sync-selected-products')
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: 'ID', value: 'id', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption'},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('name'), value: 'name', align: 'end', sortable: true, class: 'caption'},
        {text: this.$t('sku_original'), value: 'sku_original', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('vendor'), value: 'vendor', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('var_price'), value: 'var_price', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('cost'), value: 'marginal_price', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('status'), value: 'status', align: 'end', sortable: true, class: 'caption'},
      ];
    },

    clickRow(group) {
      this.selected(group)
    },

    itemSelected(value) {
      this.selected(value.item)
    },

    toggleSelectAll(selected) {
      this.selectedGroups = []
      this.$store.commit('setSettProducts', [])
      if (selected.value) {
        this.selectedGroups = selected.items
        this.selectedGroups.forEach(group => {
          this.addSettProduct(group)
        })
      }
      this.$eventHandle.$emit('updateSettCost')
    },

    selected(group) {
      if (!!this.selectedGroups.find(gr => gr.id === group.id)) {
        this.selectedGroups = this.selectedGroups.filter(gr => gr.id !== group.id)
        this.removeSettProduct(group)
      } else {
        this.selectedGroups.push(group)
        this.addSettProduct(group)
      }
      this.$eventHandle.$emit('updateSettCost')
    },

    addSettProduct(group) {
      let product = group.product
      product.qty = 1
      product.price = group.var_price
      product.percent = null
      product.images = group.images
      product.groupProducts = group.products
      if (!!group.warranty) {
        if (!this.warranties.find(w => w.value === parseInt(group.warranty, 10))) {
          this.warranties.push({name: group.warranty, value: parseInt(group.warranty, 10)})
        }
      }
      let settProducts = this.settProducts;
      settProducts.push(product)
      this.$store.commit('setSettProducts', settProducts)
    },

    removeSettProduct(group) {
      let product = group.product
      let settProducts = this.settProducts;
      settProducts = settProducts.filter(pr => pr.id !== product.id)
      this.$store.commit('setSettProducts', settProducts)
    },

    highlightSearch(text) {
      return this.searchText && text.replace(new RegExp(this.searchText, "gi"), match => {
        return '<span class="full-highlight-result">' + match + '</span>';
      }) || text
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
