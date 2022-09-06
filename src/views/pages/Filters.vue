<template>
  <div
  class="grey lighten-5 pa-1"
  style="height: 100vh"
  >
    <v-row 
    no-gutters
    style="height: 100%;"
    >
      <v-col 
      class="pa-1 rounded white category-goods__categories"
      style="height: 100%;"
      >
        <v-card 
        class="ma-0"
        style="height: 100%; padding: 5px;" 
        outlined 
        tile
        >
          <div class="d-flex justify-space-between">
            <h3 class="font-weight-light"><b>{{ $t('categories') }}</b> ({{ productCount }})</h3>
            <div>
              <span style="float: right">
                <v-icon class="pr-2" @click="$eventHandle.$emit('close-tree')"
                        tag="a">mdi-folder-outline</v-icon>
                <v-icon class="pa-1" @click="$eventHandle.$emit('open-tree')"
                        tag="a">mdi-folder-open-outline</v-icon>
              </span>
            </div>
          </div>
          <div 
          :style="`overflow-y: scroll; overflow-x: auto; height: ${innerHeight}px;`">
            <category-tree
          class="category-goods__categories-wrapper p-1"
              :activeCategories="activeCategories"
              :activeCategoryId="activeCategoryId"
              :categoryTree="categoryTree"
              :mode="'products'"
              @attach-product="$store.dispatch('attachProducts', $event)"
              @input="getSelectedCategory"
              @move="$store.dispatch('moveCategory', $event)"
            />
          </div>
        </v-card>
      </v-col>
      <v-col
      style="height: 100%;"
      >
        <v-card 
        class="ma-0"
        style="padding: 5px; height: calc(60vh - 34px)" 
        outlined 
        tile
        >
          <div 
          style="overflow-y:scroll; overflow-x:auto; height: 100%;">
            <v-data-table
              class="settings-filters"
              :headers="filterHeaders"
              :items-per-page="1000"
              :items="filters"
              dense
              fixed-header
              hide-default-footer
            >
              <template #body="{ items }">
                <tbody>
                <tr
                  :draggable="isFiltersDraggable"
                  :id="index"
                  :key="item.id"
                  @dragover.prevent
                  @dragstart="dragstartFilter"
                  @drop.prevent="dropFilter"
                  class="filter-row"
                  v-for="(item, index) in items"
                >
                  <td>
                    <div class="d-flex justify-center align-center bordered-right font-14"
                    style="height: 90%;"
                    >
                      {{ item.id }}
                    </div>
                  </td>
                  <td>
                    <div 
                    class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    @click="openFilterDialog(item)"
                    v-if="item && item.specifications || item && item.specificationsWithProperties"
                    >
                      {{
                        (item.specifications && item.specifications.length && item.specifications[0].manufacturer) ||
                        (item.specificationsWithProperties && item.specificationsWithProperties.length && item.specificationsWithProperties[0].manufacturer) ||
                        '---'
                      }}
                      </div>
                  </td>
                  <td>
                    <div 
                    class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    @click="openFilterDialog(item)"
                    dir="rtl"
                    v-if="item && item.specifications || item && item.specificationsWithProperties"
                    >
                      {{
                        (item.specifications && item.specifications.length && item.specifications[0].value) ||
                        (item.specificationsWithProperties && item.specificationsWithProperties.length && item.specificationsWithProperties[0].value) ||
                        '---'
                      }}
                    </div>
                  </td>
                  <td>
                    <div 
                    class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    @click="openFilterDialog(item)"
                    dir="rtl"
                    v-if="item && item.specifications || item && item.specificationsWithProperties"
                  >
                      {{
                        (item.specifications && item.specifications.length && item.specifications[0].name) ||
                        (item.specificationsWithProperties && item.specificationsWithProperties.length && item.specificationsWithProperties[0].name) ||
                        '---'
                      }}
                    </div>
                  </td>
                  <td>
                    <div 
                    class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    dir="rtl"
                    >
                      <input
                        class="filter-field"
                        type="text"
                        v-model="item.name"
                        @change="updateFilter($event, item)"
                      >
                    </div>
                  </td>
                  <td>
                    <div 
                    class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    >
                    <v-checkbox
                      v-model="item.show"
                      @change="updateFilter($event, item)"
                    />
                    </div>
                  </td>
                  <td v-if="item">
                    <div 
                    class="d-flex flex-column justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    >
                    <div class="font-14" :class="{'red--text': (item.properties && item.properties.length == 0) && (item.specificationsWithProperties && item.specificationsWithProperties.length > 0)}">
                      {{ (item.specificationsWithProperties && item.specificationsWithProperties.length) || 0 }}
                    </div>
                    <div class="font-14" :class="{'green--text': (item.specifications && item.specifications.length) || 0}">
                      {{ (item.specifications && item.specifications.length) || 0 }}
                    </div>
                  </div>
                  </td>
                  <td>
                    <div 
                    class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    >
                      {{ item.position }}
                    </div>
                  </td>
                  <td>
                    <div 
                    class="d-flex justify-center align-center font-14 px-2"
                    style="height: 90%;"
                    >
                      <v-icon
                        tag="a" small
                        class="mr-2"
                        @click="removeFilter(item)"
                        >
                          mdi-close
                      </v-icon>
                    </div>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-data-table>
          </div>
        </v-card>
        <v-card 
        class="ma-0 mt-2"
        style="
        padding: 5px;
        height: 40vh" 
        outlined 
        tile
        >
          <div
            v-if="specifications"
            class="mr-3 mb-2"
            dir="rtl"
          >
            <v-icon
              @click="specificationRefresh" 
              tag="a"
            >mdi-refresh</v-icon>
            <span class="font-14">
              ({{ countSpecifications }})
            </span>
          </div>
          <div style="overflow-y:scroll; overflow-x:auto;">
            <v-data-table
              class="settings-filters"
              :headers="headers"
              :items-per-page="1000"
              :items="specifications"
              dense
              fixed-header
              hide-default-footer
            >
              <template #item.count="{ item }">
                <div class="d-flex justify-center align-center bordered-right font-14 px-2"
                style="height: 90%;"
                @click="showSpecificationsByName(item)"
                >
                  ( {{ item.count }} )
                </div>
              </template>

              <template #item.manufacturer="{ item }">
                <div class="d-flex justify-center align-center bordered-right font-14 px-2"
                style="height: 90%;"
                @click="showSpecificationsByName(item)"
                >
                  {{ item.manufacturer }}
                </div>
              </template>

              <template #item.value="{ item }">
                <div class="d-flex align-center bordered-right font-14 px-2"
                style="height: 90%;"
                dir="rtl" 
                @click="showSpecificationsByName(item)">
                  {{ item.value }}
                </div>
              </template>

              <template #item.name="{ item }">
                <div class="d-flex align-center bordered-right font-14 px-2"
                style="height: 90%;"
                dir="rtl" @click="showSpecificationsByName(item)">
                  {{ item.name }}
                </div>
              </template>

              <template #item.filter="{ item }">
                <div class="d-flex justify-center align-center bordered-right font-14 px-2"
                style="height: 90%;"
                dir="rtl"
                >
                  <input type="text" class="filter-field" @keypress.enter="setFilterName($event, item)">
                </div>
              </template>

              <template #item.actions="props">
                <div class="d-flex justify-center align-center font-14"
                style="height: 90%;"
                >
                  <v-icon
                  @click.stop="deleteSpecificationByCategory(props.item)"
                    small
                  >mdi-close</v-icon>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      :retain-focus="false"
      :scrollable="true"
      :width="['filterCategory'].find(f => f === showForm) ? 600 : null"
      @keydown.esc="$store.commit('setDialog', false)"
      max-height="100vh"
      persistent
      style="position: relative;"
      v-if="dialog"
      v-model="dialog"
    >
      <v-overlay :value="requestStatus === 'loading'">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card style="background: rgba(33, 33, 33, 0.08); overflow: hidden;">
        <v-card-actions dense>
          <v-spacer></v-spacer>
           <v-tooltip top open-delay="400">
            <template
              #activator="{ on, attrs }"
            >
              <v-btn
                @click="saveFilter"
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
              #activator="{ on, attrs }"
            >
              <v-btn
                @click="$store.commit('setDialog', false)"
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
        <v-card-text class="popup-dialog__card-text">
          <div class="pr-5 pl-5 pb-6">
            <div v-if="showForm === 'filterCategory'">

              <h4>Применить для категории:</h4>
              <v-radio-group v-model="form.parent_category_id" :mandatory="false">
                <v-radio
                  v-for="category in parentCategories"
                  :label="category.name[$i18n.locale]"
                  :value="category.id"
                />
              </v-radio-group>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :persistent="true"
      :retain-focus="false"
      :scrollable="true"
      @keydown.esc="closeFilterDialog()"
      max-height="100vh"
      max-width="90%"
      style="position: relative;"
      v-model="activeFilterDialog"
    >
      <v-overlay :value="requestStatus === 'loading'">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card style="background: rgba(33, 33, 33, 0.08);">
        <v-card-actions dense>
          <div style="width: 100%;" dir="rtl" class="white--text">
            <h2 class="pa-0 ma-0 text-center">{{ activeFilter && activeFilter.name }}</h2>
          </div>
          <v-spacer></v-spacer>
          <div style="position: absolute;top: 0;right: -60px;">
            <v-tooltip top open-delay="400">
            <template
              #activator="{ on, attrs }"
            >
              <v-badge
                :content="activeFilter && activeFilter.specifications && activeFilter.specifications.length"
                bottom
                left
                overlap
                style="z-index: 2;"
              >
              </v-badge>
            </template>
            <template
              #activator="{ on, attrs }"
            >
              <v-btn 
                class="dialog-action-button" 
                :disabled="!!(activeFilter && activeFilter.specifications && activeFilter.specifications.length == 0)"
                @click="propertyRefresh"
                color="black" 
                fab 
                icon 
                v-bind="attrs"
                v-on="on" 
                x-small
              >
                <v-icon>
                  mdi-refresh
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('unite') }}</span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template
                #activator="{ on, attrs }"
              >
                <v-btn 
                  class="dialog-action-button" 
                  @click="closeFilterDialog()"
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
          </div>
        </v-card-actions>
        <v-card-text class="popup-dialog__card-text">
          <!-- <div class="specifications"> -->
          <v-data-table
            :headers="propertiesHeaders"
            class="pt-1 pb-1 pl-1"
            :items-per-page="propertiesPerPage"
            :items="activeFilter ? activeFilter.properties : []"
            :style="`overflow-y:scroll; overflow-x:auto; height: ${innerHeight / 65 * 35 }px`"
            dense
            fixed-header
            v-show="activeFilter"
          >
            <template #body="props">
              <tbody>
                <tr
                  :draggable="true"
                  :id="propertyIndex"
                  :key="property.id"
                  @dragover.prevent
                  @dragstart="dragstartProperty"
                  @drop.prevent="dropProperty"
                  class="product-specification-row"
                  v-for="(property, propertyIndex) in props.items"
                >
                  <td>
                    <div class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    >
                      {{ property.id }}
                    </div>
                  </td>
                  <td>
                    <div class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    >
                      ({{ property.countProductSpecifications }})
                    </div>
                    </td>
                  <td>
                    <div class="d-flex align-center bordered-right font-14 px-2"
                    dir="rtl"
                    style="height: 90%;"
                    >
                      <v-edit-dialog
                        :return-value.sync="property.name"
                        @save="updateProperty($event, property)"
                      >
                        {{ property.name }}
                        <template #input>
                          <v-text-field
                            counter
                            dir="rtl"
                            label="Изменить"
                            single-line
                            v-model="property.name"
                          ></v-text-field>
                        </template>
                      </v-edit-dialog>
                    </div>
                  </td>
                  <td class="text-start">
                    <div class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    >
                      <v-checkbox
                        @change="updateProperty($event, property)"
                        v-model="property.show"
                      ></v-checkbox>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex justify-center align-center bordered-right font-14 px-2"
                    style="height: 90%;"
                    >
                      {{ property.position }}
                    </div>
                  </td>
                  <td>
                    <div class="d-flex justify-center align-center font-14 px-2"
                    style="height: 90%;"
                    >
                      <v-tooltip top open-delay="400">
                        <template
                          #activator="{ on, attrs }"
                        >
                          <v-icon
                          class="mr-2"
                          @click="showPropertyDialaog(property)"
                          small
                          tag="a"
                          >
                            mdi-format-list-bulleted
                          </v-icon>
                        </template>
                        <span>{{ 'Смотреть сгруппированные' }}</span>
                      </v-tooltip>
                      <v-tooltip top open-delay="400">
                        <template
                          #activator="{ on, attrs }"
                        >
                          <v-icon
                          @click="removeProperty(property, activeFilter)"
                          small
                          >
                            mdi-close
                          </v-icon>
                        </template>
                        <span>{{ 'Разгруппировать' }}</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <v-data-table
            :headers="specificationsHeaders"
            :items-per-page="specificationsPerPage"
            :items="activeFilter ? uniqueSpecifications(activeFilter.specifications) : []"
            :style="`overflow-y:scroll; overflow-x:scroll; height: ${innerHeight / 3}px`"
            class="pa-1"
            dense
            fixed-header
            v-show="activeFilter"
          >
            <template #item.count="props">
              <div class="d-flex justify-center align-center bordered-right font-14 px-2"
              style="height: 90%;"
              >
                ({{ props.item.count }})
              </div>
            </template>
            <template #item.value="props">
              <div class="d-flex justify-center align-center bordered-right font-14 px-2"
              style="height: 90%;"
              >
                {{ props.item.value }}
              </div>
            </template>
            <template #item.commonValue="props">
              <div class="d-flex justify-center align-center bordered-right font-14 px-2"
              style="height: 90%;"
              >
                <input
                  @keypress.enter="setPropertyName($event, props.item, activeFilter)"
                  class="filter-field"
                  dir="rtl"
                  type="text"
                  v-model="props.item.commonValue"
                >
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :persistent="true"
      :retain-focus="false"
      :scrollable="true"
      @keydown.esc="hidePropertyDialog()"
      max-height="100vh"
      max-width="90%"
      style="position: relative;"
      v-model="activePropertyDialog"
    >
      <v-overlay :value="requestStatus === 'loading'">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card style="background: rgba(33, 33, 33, 0.08); overflow: hidden;">
        <v-card-actions dense>
          <div style="width: 100%;" dir="rtl" class="white--text">
            <h2 class="pa-0 ma-0 text-center">{{ activeProperty && activeProperty.name }}</h2>
          </div>
          <v-spacer></v-spacer>
           <v-tooltip top open-delay="400">
            <template
              #activator="{ on, attrs }"
            >
              <v-btn
                @click="hidePropertyDialog()"
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
        <v-card-text class="popup-dialog__card-text">
          <v-data-table
            :headers="activePropertyHeaders"
            :items-per-page="specificationsWithPropertiesPerPage"
            :items="uniqueSpecifications(activeProperty.product_specifications)"
            class="pt-1 pb-1 pl-1"
            dense
            fixed-header
            v-show="activePropertyDialog"
          >
            <template #item.manufacturer="props">
              {{ props.item.product && props.item.product.manufacturer && props.item.product.manufacturer.name }}
            </template>
            <template #item.count="props">
              ({{ props.item.count }})
            </template>
            <template #item.value="props">
              {{ props.item.value }}
            </template>
            <template #item.commonValue="props">
              {{ activeProperty.name }}
            </template>
            <template #item.actions="props">
              <v-btn
                @click="unsetSpecifications(props.item, activeFilter)"
                icon
                tag="a"
              >
                <v-icon
                  small
                >mdi-close</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <!-- </div> -->
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :persistent="true"
      :retain-focus="false"
      :scrollable="true"
      @keydown.esc="specificationsByNameDialog = false"
      max-height="100vh"
      max-width="90%"
      style="position: relative;"
      v-model="specificationsByNameDialog"
    >
      <v-overlay :value="requestStatus === 'loading'">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card style="background: rgba(33, 33, 33, 0.08);">
        <v-card-actions dense>
          <v-spacer></v-spacer>
          <div style="position: absolute;top: 0;top: -30px;right: -60px;">
            <v-tooltip top open-delay="400">
            <template
              #activator="{ on, attrs }"
            >
              <v-btn 
                class="dialog-action-button" 
                @click="specificationsByNameDialog = false"
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
          </div>
        </v-card-actions>
        <v-card-text class="popup-dialog__card-text">
          <v-data-table
            :headers="specificationsByNameHeaders"
            :items="specificationsByName"
            :page.sync="specificationsByNamePage"
            style="overflow-x: auto; overflow-y: scroll;"
            class="pt-1 pb-1 pl-1"
            dense
            fixed-header
          >
            <template #item.manufacturer="props">
              <div class="d-flex justify-center align-center bordered-right font-14 px-2"
              style="height: 90%;"
              >
                {{ props.item.manufacturer }}
              </div>
            </template>
            <template #item.value="props">
              <div class="d-flex align-center bordered-right font-14 px-2"
              style="height: 90%;"
              dir="rtl"
              >
                {{ props.item.value }}
              </div>
            </template>
            <template #item.name="props">
              <div class="d-flex align-center font-14 px-2"
              style="height: 90%;"
              dir="rtl"
              >
              {{ props.item.name }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "Filters",
  components: {
    CategoryTree: () => import("../components/category/CategoryTree"),
  },
  data: function () {
    return {
      activeFilterDialog: false,
      activeProperty: {},
      activePropertyDialog: false,
      activePropertyHeaders: [],
      filterHeaders: [],
      form: {},
      headers: [],
      innerHeight: 900,
      isFiltersDraggable: true,
      isMobile: false,
      manufacturerIds: [],
      manufacturers: [],
      parentCategories: [],
      productSpecificationIds: [],
      propertiesHeaders: [],
      propertiesPerPage: 1,
      selectedCategories: [],
      selectedCategory: null,
      showForm: '',
      specificationShow: false,
      specificationsByName: [],
      specificationsByNameDialog: false,
      specificationsByNameHeaders: [],
      specificationsByNamePage: 1,
      specificationsHeaders: [],
      specificationsPerPage: 10,
      specificationsWithPropertiesPerPage: 5,
    }
  },

  async created() {
    if (!!this.activeCategoryId) {
      this.selectedCategory = {id: this.activeCategoryId}
    }
    await this.$store.dispatch('getSettings', {settingsName: 'paginationSettings'})
    this.initialize()
    await this.$store.dispatch('getCategoryTree')
  },

  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, {passive: true})
  },

  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true})
    }
  },

  computed: {
    ...mapGetters([
      'activeCategories',
      'activeCategoryId',
      'categoryTree',
      'dialog',
      'filters',
      'productCount',
      'requestStatus',
      'showAllProductsCategory',
      'specifications',
      'settings',
    ]),

    openedCategories() {
      let names = this.activeCategories.map(item => {
        return item.name[this.$i18n.locale]
      })
      return names.reverse().join(' <> ')
    },

    activeFilter() {
      return this.filters.find(filter => filter.specificationShow == true)
    },

    countSpecifications() {
      if (this.specifications && this.specifications.length) {
        return this.specifications.reduce((total, specification) => total + specification.count, 0)
      }
      return 0
    }
  },

  destroyed() {
    this.$store.commit('setCategories', null)
    this.$store.commit('setFilters', [])
    this.$store.commit('setSpecifications', [])
  },

  methods: {
    initialize() {
      this.filterHeaders = [
        {text: 'ID', value: 'id', align: 'start', sortable: false, class: 'caption', width: 50},
        {text: 'Вендоры', value: 'specification.manufacturer', align: 'start', sortable: false, class: 'caption', width: 100},
        {text: this.$t('propertiesExample'),value: 'specification.value',align: 'end',sortable: false,class: 'caption', width: '15%'},
        {text: this.$t('specificationExample'), value: 'specification.name', align: 'end', sortable: false, class: 'caption', width: '15%'},
        {text: this.$t('filterName'), value: 'name', align: 'end', sortable: false, class: 'caption', width: '25%'},
        {text: this.$t('show'), value: 'show', align: 'start', sortable: false, class: 'caption', width: '9%'},
        {text: 'Количество', value: 'countFilterSpecifications', align: 'start', sortable: false, class: 'caption', width: '9%'},
        {text: this.$t('position'), value: 'position', align: 'end', sortable: false, class: 'caption', width: '9%'},
        {text: this.$t('actions'), value: 'actions', align: 'center', sortable: false, class: 'caption', width: '9%'},
      ];
      this.headers = [
        {text: 'Количество', value: 'count', align: 'start', sortable: false, class: 'caption', width: '10%'},
        {text: this.$t('manufacturer'), sortable: false, value: 'manufacturer', width: '15%'},
        {text: this.$t('propertiesExample'), value: 'value', align: 'end', sortable: false, class: 'caption', width: '25%'},
        {text: this.$t('specification'), value: 'name', align: 'end', sortable: false, class: 'caption', width: '25%'},
        {text: this.$t('filterName'), value: 'filter', align: 'end', sortable: false, class: 'caption', width: '30%'},
        {text: 'Удалить', value: 'actions', align: 'center', sortable: false, class: 'caption', width: 50},
      ];
      this.propertiesHeaders = [
        {text: 'ID', sortable: false, value: 'id', width: '9%'}, 
        {text: 'Количество', sortable: false, value: 'countProductSpecifications', width: '15%'},
        {text: 'Единое значение', sortable: false, value: 'name'},
        {text: this.$t('show'), value: 'show', align: 'start', sortable: false, class: 'caption', width: '9%'},
        {text: this.$t('position'), value: 'position', align: 'end', sortable: false, class: 'caption', width: '9%'},
        {text: this.$t('actions'), value: 'actions', align: 'center', sortable: false, class: 'caption', width: 100},
      ]
      this.specificationsHeaders = [
        {text: this.$t('manufacturer'), sortable: false, value: 'manufacturer', width: '12%'},
        {text: 'Количество', sortable: false, value: 'count', width: '15%'},
        {text: this.$t('value'), sortable: false, value: 'value', width: '25%'},
        {text: this.$t('name'), sortable: false, value: 'name', width: '25%'},
        {text: 'Единое значение', sortable: false, value: 'commonValue', width: '25%'},
      ]
      this.specificationsByNameHeaders = [
        {text: this.$t('manufacturer'), sortable: false, value: 'manufacturer', width: '12%'},
        {text: this.$t('value'), sortable: false, value: 'value', width: '44%'},
        {text: this.$t('name'), sortable: false, value: 'name', width: '44%'},
      ]
      this.activePropertyHeaders = [
        {text: this.$t('manufacturer'), sortable: false, value: 'manufacturer'},
        {text: 'Количество', sortable: false, value: 'count', width: 150},
        {text: this.$t('value'), sortable: false, value: 'value'},
        {text: 'Единое значение', sortable: false, value: 'commonValue'},
        {text: this.$t('name'), sortable: false, value: 'name'},
        {text: this.$t('actions'), value: 'actions', align: 'center', sortable: false, class: 'caption', width: 100},
      ]

      this.specificationsWithPropertiesPerPage = +this.settings.find(s => s.name == 'per_page_specifications_with_properties').value || -1

      this.propertiesPerPage = +this.settings.find(s => s.name == 'per_page_properties').value || -1

      this.specificationsPerPage = +this.settings.find(s => s.name == 'per_page_specifications').value || -1
    },

    onResize() {
      this.isMobile = window.innerWidth < 600
      this.innerHeight = window.innerHeight - 100
    },

    getSelectedCategory(data) {
      this.$store.dispatch('getFilters', {category_id: data.category.id}).then(res => {
        this.manufacturerIds = res.manufacturerIds
        this.manufacturers = res.manufacturers
        this.productSpecificationIds = res.productSpecificationIds
      })
      this.selectedCategory = data.category
      this.selectedCategories = data.selectedCategories
      this.$store.commit('setActiveCategoryId', this.selectedCategory.id)
      this.$store.commit('setActiveCategories', this.selectedCategories)
    },

    setFilterName(e, specification) {
      this.form.parent_category_id = this.selectedCategory.id
      this.form.category_id = this.selectedCategory.id
      this.form.filterName = e.target.value
      this.form.saveFilterParamsfilterName = e.target.value
      this.form.specificationName = specification.name
      if (this.selectedCategories && this.selectedCategories.length > 1) {
        this.parentCategories = this.selectedCategories.reverse()
        this.showForm = 'filterCategory'
        this.$store.commit('setDialog', true)
      } else {
        this.$store.dispatch('saveFilter', this.form).then(() => {
          this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})
        })
      }
      e.target.value = ''
    },

    setActiveFilter(filter) {
      let activeFilter = this.filters.find(f => +f.id == +filter.id)
      activeFilter && (activeFilter.specificationShow = true)
    },

    async setPropertyName(e, specification, filter) {
      this.form.parent_category_id = this.selectedCategory.id
      this.form.category_id = this.selectedCategory.id
      this.form.filter_id = filter.id
      this.form.propertyName = e.target.value
      this.form.specificationName = specification.name
      this.form.specificationValue = specification.value

      await this.$store.dispatch('saveProperty', this.form)
      await this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})
      
      this.setActiveFilter(filter)
      e.target.value = ''
    },

    async updateProperty(e, property) {
      await this.$store.dispatch('saveProperty', {
        id: property.id,
        name: property.name,
        show: property.show,
      })
    },

    async removeProperty(property, filter) {
      await this.$store.dispatch('deleteProperty', {
        propertyId: property.id
      })
      await this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})

      this.setActiveFilter(filter)
    },

    async unsetSpecifications(productSpecification, filter) {
      await this.$store.dispatch('unsetSpecifications', {
        specificationValue: productSpecification.value,
        specificationId: productSpecification.specification_id,
        propertyId: productSpecification.property_id,
        filterId: filter.id,
      })
      await this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})

      this.setActiveFilter(filter)
      await this.showPropertyDialaog({id: productSpecification.property_id})
    },

    openFilterDialog(item) {
      item.specificationShow = true
      this.isFiltersDraggable = false
      this.activeFilterDialog = true
    },

    closeFilterDialog() {
      this.activeFilterDialog = false
      this.activeFilter.specificationShow = false
      this.isFiltersDraggable = true
      this.hidePropertyDialog()
    },

    async showPropertyDialaog(property) {
      this.activeProperty = await this.$store.dispatch('getProperty', {
        propertyId: property.id
      })
      this.activePropertyDialog = true
    },

    async hidePropertyDialog() {
      this.activeProperty = {}
      this.activePropertyDialog = false
    },

    saveFilter() {
      this.$store.dispatch('saveFilter', this.form).then(() => {
        this.$store.commit('setDialog', false)
        this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})
      })
    },

    updateFilter(e, filter) {
      this.$store.dispatch('saveFilter', {
        id: filter.id,
        name: filter.name,
        show: filter.show,
        category_id: this.selectedCategory.id
      }).then(() => {
        this.$store.dispatch('getFilters', {
          category_id: this.selectedCategory.id
        })
      })
    },

    removeFilter(filter) {
      this.$store.dispatch('deleteFilter', {filterId: filter.id}).then(() => {
        this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})
      })
    },

    async dropFilter(e) {
      let fromIndex = e.dataTransfer.getData('row_index');
      let toIndex = e.target.closest('.filter-row').id;

      let filters = this.filters
      filters = this.arrayMove(filters, fromIndex, toIndex)
      filters = filters.map(filter => filter.id)
      await this.$store.dispatch('saveFilterParams', {
        category_id: this.selectedCategory.id,
        filters,
      })
      await this.$store.dispatch('getFilters', {
        category_id: this.selectedCategory.id
      })
    },

    async dropProperty(e) {
      let fromIndex = e.dataTransfer.getData('row_index');
      let toIndex = e.target.closest('.product-specification-row').id;

      let properties = this.activeFilter.properties
      properties = this.arrayMove(properties, fromIndex, toIndex)
      let position = 0
      properties = properties.map(property => {
        property.position = ++position
        return property.id
      })
      await this.$store.dispatch('saveFilterProperties', {filter_id: this.activeFilter.id, properties})
    },

    dragstartFilter(e) {
      e.dataTransfer.setData('row_index', e.target.id)
    },

    dragstartProperty(e) {
      e.dataTransfer.setData('row_index', e.target.id)
    },

    arrayMove(arr, fromIndex, toIndex) {
      let element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      return arr
    },

    async specificationRefresh() {
      let res = await this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      })
      if (res) {
        await this.$store.dispatch('specificationRefresh', {
          specificationIds: this.productSpecificationIds.join(','),
          filterIds: this.filters.map(f => f.id).join(','),
        })
        this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})
      }
    },

    async propertyRefresh() {
      let res = await this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      })
      if (res) {
        await this.$store.dispatch('propertyRefresh', {
          productSpecificationIds: this.activeFilter.specifications.map(s => s.id).join(','),
          filterId: this.activeFilter.id,
        })
        let activeFilter = this.filters.find(f => +f.id == +this.activeFilter.id)

        await this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})
        this.setActiveFilter(activeFilter)
      }
    },

    uniqueSpecifications(specifications = []) {
      let specificationsCounts = {}
      let uniqueSpecifications = []
      specifications.forEach(s => {
        !specificationsCounts[s.manufacturer] && (specificationsCounts[s.manufacturer] = {})
        !specificationsCounts[s.manufacturer][s.name] &&(specificationsCounts[s.manufacturer][s.name] = {})
        specificationsCounts[s.manufacturer][s.name][s.value] = (specificationsCounts[s.manufacturer][s.name][s.value] || 0) + 1
      })

      specifications.forEach(s => {
        s.count = specificationsCounts[s.manufacturer][s.name][s.value]
        !uniqueSpecifications.some(us => (us.manufacturer == s.manufacturer && us.name == s.name && us.value == s.value)) && uniqueSpecifications.push(s)
      })

      return uniqueSpecifications
    },

    uniqueSpecificationsById(productSpecifications = []) {
      let specificationsCounts = {}
      let uniqueSpecifications = []
      productSpecifications.forEach(s => {
        specificationsCounts[s.specification_id] = (specificationsCounts[s.specification_id] || 0) + 1
      })

      productSpecifications.forEach(s => {
        s.count = specificationsCounts[s.specification_id]
        !uniqueSpecifications.some(us => us.specification_id == s.specification_id) && uniqueSpecifications.push(s)
      })

      return uniqueSpecifications
    },

    async deleteSpecificationByCategory(specification) {
      let res = await this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      })
      if (res) {
        await this.$store.dispatch('deleteSpecificationByCategory', {
          categoryId: this.activeCategoryId,
          name: specification.name,
        })
        this.$store.dispatch('getFilters', {category_id: this.selectedCategory.id})
      }
    },

    async showSpecificationsByName(item) {
      this.specificationsByName = await this.$store.dispatch('getSpecificationsByName', {
        categoryId: this.activeCategoryId,
        name: item.name,
      })
      this.specificationsByNamePage = 1
      this.specificationsByNameDialog = true
    },
  },
}
</script>

<style lang="scss">
.settings-filters {
  th {
    span {
      font-size: 12px !important;
      padding: 0 4px !important;
      box-sizing: border-box !important;
    }
  }
  td {
    padding: 0 !important;
  }
}

</style>

<style scoped lang="scss">
.filter-field {
  border: 1px solid rgba(73, 175, 80, 0.68);
  border-radius: 5px;
  padding: 0 5px;
  width: 100%;
}

.break {
  word-break: break-all;
  font-size: 12px;
}

.specification-wrap {
  position: relative;
}

.specifications-wrap {
  position: absolute;
  top: 1px;
  z-index: 1;
  min-width: 100%;
  width: 200%;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  height: 50vh;
}

.specifications {
  height: 100%;
  overflow-y: scroll;
}

.specification {
  padding: 40px;
}

.product-specification {
  display: flex;
  justify-content: space-between;
}

.list {
  position: absolute;
  right: 10px;
  top: 40px;
  background: white;
  padding: 11px 10px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-height: 600px;
  max-width: 300px;
  overflow-y: scroll;
}

.close-button {
  position: absolute;
  left: -20px;
  top: -20px;
  z-index: 2;
}

.v-data-table table th {
  background: #DFDFDF !important;
}

.popup-dialog__card-text {
  background: white;
  border-radius: 4px;
  padding: 0 !important;
}
</style>
