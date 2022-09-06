<template>
  <div>
    <v-data-table
      :headers="showHeaders"
      :item-class="itemClass"
      :items="products"
      :server-items-length="totalProducts"
      @contextmenu:row="getMenu"
      @dblclick:row="(e, { item }) => $eventHandle.$emit('edit-product', item)"
      @update:page="onUpdatePage"
      class="category-products-table category-goods__table"
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
          class="d-flex flex-column align-end"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
            class="d-flex flex-wrap pr-2"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
              <div class="font-12">
                {{ 'ID тов.' }}
              </div>
            </div>
          </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('group_id')}"
            class="d-flex justify-end mt-1 pr-2"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
              <div class="font-12">
                {{ 'ID гр.' }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #header.image="{ header }">
        <div class="font-12">
          Изобажения
        </div>
      </template>
      <template #header.name="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex justify-space-between align-center"
        >
          <div
            class="d-flex pl-2"
          >
            <div class="d-flex">
              <div class="font-12">
                {{ $t('name') }}
              </div>
            </div>
          </div>
          <div
            class="d-flex justify-end pr-2"
          >
            <div class="d-flex">
              <div class="font-12">
                {{ $t('sku_original') }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #header.manufacturer="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column align-end"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('manufacturer')}"
            class="d-flex justify-end pr-2"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
              <div class="font-12">
                {{ $t('manufacturer') }}
              </div>
            </div>
          </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('vendor')}"
            class="d-flex justify-end mt-1 pr-2"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
              <div class="font-12">
                {{ $t('vendor') }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #header.producer_price="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column"
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('producer_price')}"
            class="d-flex justify-center"
            style="width: 100%; margin-left: 48px;"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
                <div class="font-12">
                  {{ $t('price') }}
                </div>
              </div>
            </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('var_price')}"
            class="w-100 d-flex justify-center"
            style="width: 100%;"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
                <div class="font-12">
                  {{ $t('with_var_price') }}
                </div>
              </div>
            </div>
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('marginal_price')}"
            class="d-flex justify-center"
            style="width: 100%; margin-right: 48px;"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
              <div class="font-12">
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
        >
          <div
            :class="{'font-weight-black primary--text': options.sortBy.includes('status')}"
            class="d-flex justify-center"
            style="margin-left: -10px;"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
              <div class="font-12">
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
          class="product-id text-center d-flex flex-column justify-space-around bordered-left"
          style="height: 90%;"
        >
          <div class="font-14">{{ item.id }}</div>
          <div class="mt-2 font-weight-black">
            <a class="text-blue font-14" @click.prevent="editGroup(item.group_id)">
              {{ item.group_id }}
            </a>
          </div>
        </div>
      </template>
      <template #item.image="{ item }">
        <light-box 
        class="light-box"
        @click.stop.prevent 
        v-if="!!item.images && item.images.length" 
        :key="item.id" 
        :images="item.images" 
        style="height: 100px;"
        />
      </template>
      <template #item.name="{ item }">
        <div 
        class="d-flex flex-column justify-space-between"
        style="height: 67%;"
        >
          <div dir="rtl" class="align-start d-flex justify-space-between pr-2">
            <a
              @click.prevent.stop="$eventHandle.$emit('edit-product', item)"
              class="font-16 text-blue line-break-two"
              draggable="true"
            >
              <div
                :class="{'full-highlight-result': isFullSearch(item, 'name')}"
                v-html="item.highlightResult._highlightResult.name.value"
                v-if="!!item.highlightResult" class="highlightResult d-inline"
              ></div>
              <div v-else class="d-inline">
                <span class="font-16 text-blue line-break-two" v-if="typeof item.name === 'object'" v-html="highlightSearch(item.name[$i18n.locale])"></span>
                <span class="font-16 text-blue line-break-two" v-else v-html="highlightSearch(item.name)"></span>
              </div>
            </a>
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
            class="align-start d-flex justify-end mt-1"
            dir="rtl"
            v-else
          >
            <span
              @click.stop
              class="text-blue font-14 ml-3"
              v-html="highlightSearch(item.sku_original)"
            ></span>
            <div class="pl-2">
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
        class="d-flex flex-column justify-space-around align-end bordered-both"
        style="height: 90%;"
        >
           <a
            :href="item.url"
            class="text-decoration-none font-14 text-green-light pr-2"
            target="_blank"
            v-if="!!item.url && !item.url.indexOf('http')"
          >{{ item.manufacturer }}</a>
          <span
            v-else
            class="font-14 text-green-light pr-2"
          >{{ item.manufacturer }}</span>
          <br>
          <span class="font-12 pr-2" v-if="!item.is_vendor_corrected" style="color: red"> *</span>
          <a
            :href="item.link_manufacturer"
            class="text-decoration-none font-14 text-blue pr-2"
            target="_blank"
            v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')"
          >{{ item.vendor }}</a>
          <span class="font-14 text-blue pr-2" v-else>{{ item.vendor }}</span>
        </div>
      </template>
      <template #item.producer_price="{ item }">
        <div 
        class="text-center font-14"
        style="margin-left: 48px;"
        >
          {{ item.producer_price }}
        </div>
        <div class="mt-1 text-center font-14">
          {{ item.var_price }}
        </div>
        <div 
        class="mt-1 text-center font-14" 
        style="margin-right: 48px;"
        >
          {{ item.marginal_price }}
        </div>
      </template>
      <template #item.status="{ item }">
        <div 
        class="d-flex justify-space-around align-center bordered-left"
        style="height: 90%;"
        >
          <div class="font-14" :style="{'color': item.status_color}">
            {{ item.status }}<br/>
            <span class="font-14" dir="rtl">{{ item.status_text }}</span>
          </div>
        </div>
      </template>
    </v-data-table>

    <div class="rounded d-flex justify-space-between align-center category-product__offer-pagination-wrapper" 
    v-if="products.length"
    style="height: 50px;" 
    >
        
      <div style="width: 100px;">
        <v-text-field
          :value="productData.meta.per_page"
          @keyup.enter="changeParams({...options, ...{ itemsPerPage: parseInt($event.target.value, 10), page: 1, search: searchText }}, 'change-params')"
          class="mt-3 ml-2 category-products__offer-pagination-input"
          dense
          label="Количество"
          max="2000"
          min="1"
          type="number"
        ></v-text-field>
      </div>
      <v-pagination
        class="category-products__offer-pagination"
        :length="paginationMeta.pageCount"
        @input="changeParams({...options, ...{ page: parseInt($event, 10), search: searchText }}, 'change-params')"
        v-model="paginationMeta.page"
      >
      </v-pagination>
    </div>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      persistent
      scrollable
      v-if="showForm"
      v-model="showForm"
      width="85vw"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;"
      >
        <div
          class="align-center d-flex flex-nowrap"
          color="transparent"
          dark
          dir="rtl"
          style="position: absolute; top: -55px; right: -65px; width: calc(85vw + 60px);"
          v-if="$refs.groupProductForm"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="showForm = false"
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
                @click="$refs.groupProductForm.saveGroupProduct()"
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
            class="ma-0 ml-3 pa-1 rounded white"
          >
            <v-text-field
              :label="$t('category')"
              :value="$refs.groupProductForm.group.product.root_category.name[this.$i18n.locale]"
              class="dense-input"
              dense
              dir="ltr"
              height="25px"
              hide-details
              readonly
              style="width: 300px"
            />
          </div>
          <div
            class="ma-0 pa-1 rounded white"
          >
            <v-text-field
              :label="$t('groupId')"
              class="dense-input mr-3"
              dense
              dir="ltr"
              height="25px"
              hide-details
              readonly
              style="width: 130px"
              v-model="$refs.groupProductForm.group.id"
            />
          </div>
          <v-btn
            class="black--text pa-4 my-0 mr-3"
            color="#B9D2EA"
            small
            style="height: 40px;"
          >
            <div class="py-3">{{ $t('group') }}</div>
          </v-btn>
        </div>
        <group-product-form
          @close="showForm=false"
          @saved="savedGroup"
          ref="groupProductForm"
          v-if="showForm === 'groupProduct'"
        ></group-product-form>
      </v-card>
    </v-dialog>

    <v-menu
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
      v-model="showMenu"
    >
      <template>
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              @click="addProductToGroup"
              v-if="groupId"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Добавить товар в группу №{{ groupId }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              @click="editGroup(groupId)"
              v-if="groupId"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Редактировать группу №{{ groupId }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="createGroupProduct">
              <v-list-item-content>
                <v-list-item-title>
                  Объединить товары
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              @click="$emit('removeGroup', {id:0, groupIds: groupIds.join()})"
              v-if="groupId"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Удалить группы (№{{ groupIds.join() }})
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="createGroups">
              <v-list-item-content>
                <v-list-item-title>
                  Создать группы
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click.stop="dialogForSpecification = true">
              <v-list-item-content>
                <v-list-item-title>
                  Добавить характеристику
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click.stop="dialogForDeleteSpecification = true">
              <v-list-item-content>
                <v-list-item-title>
                  Удалить характеристику
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              @click.stop="deleteSelectedProducts"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Выключить товары (удалить)
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              @click.stop="restoreSelectedProducts"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Включить товары
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              @click.stop="addProductsToOfferCart"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Добавить в предложение
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-menu>

    <v-dialog
      max-height="100vh"
      max-width="600px"
      persistent
      v-model="dialogForSpecification"
    >
      <v-card style="background: rgba(33, 33, 33, 0.08); overflow: hidden;">
        <v-card-actions dense>
          <v-spacer></v-spacer>
          <v-tooltip top open-delay="400">
            <template
              #activator="{ on, attrs }"
            >
              <v-btn
                :disabled="!(specificationName && specificationValue)"
                @click="createSpecification"
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
                @click="dialogForSpecification = false"
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
          <v-container>
            <v-text-field
              label="Наименование"
              v-model="specificationName"
            ></v-text-field>
          </v-container>
          <v-container>
            <v-text-field
              label="Значение"
              v-model="specificationValue"
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      max-height="100vh"
      max-width="600px"
      persistent
      v-model="dialogForDeleteSpecification"
    >
      <v-card style="background: rgba(33, 33, 33, 0.08); overflow: hidden;">
        <v-card-actions dense>
          <v-spacer></v-spacer>
          <v-tooltip top open-delay="400">
            <template
              #activator="{ on, attrs }"
            >
              <v-btn
                :disabled="!specificationName"
                @click="deleteSpecification"
                color="primary"
                elevation="6"
                fab
                light
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="25">
                  mdi-delete-forever-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.delete') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template
              #activator="{ on, attrs }"
            >
              <v-btn
                @click="dialogForDeleteSpecification = false"
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
          <v-container>
            <v-text-field
              label="Наименование"
              v-model="specificationName"
            ></v-text-field>
          </v-container>
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
      <!-- <template
        #activator="{ on, attrs }"
      >
        <v-btn
          color="grey"
          fab
          style="position: absolute; right: 0; top: 70px; z-index: 3;"
          v-bind="attrs"
          v-on="on"
          x-small
        >
          <v-icon>mdi-view-column-outline</v-icon>
        </v-btn>
      </template> -->
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
import product from "@/store/product";
import {mapGetters} from "vuex";
import LongPress from 'vue-directive-long-press'

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
      clearSortInterval: 0,
      contextMenuSelectedId: null,
      dialogForDeleteSpecification: false,
      dialogForSpecification: false,
      groupId: null,
      groupIds: [],
      headers: [],
      headersMap: [],
      menuX: 0,
      menuY: 0,
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
      selected: [],
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      showForm: false,
      showMenu: false,
      showSelectedHeadersMenu: false,
      snackbar: false,
      specificationName: null,
      specificationValue: null,
    }
  },

  directives: {
    'long-press': LongPress
  },

  props: ['productData', 'category_id', 'searchText'],

  mixins: [paginationMixin],

  computed: {
    ...mapGetters([
      'offer',
      'offerProducts',
      'requestStatus',
      'settings',
    ]),

    products() {
      if (this.productData && this.productData.meta) {
        this.paginationMeta.page = +this.productData.meta.current_page
        this.paginationMeta.perPage = +this.productData.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.productData.meta.total / this.productData.meta.per_page)
        this.$nextTick(() => {
          this.options.itemsPerPage = +this.productData.meta.per_page
          this.productData.meta.sortBy && (this.options.sortBy = this.productData.meta.sortBy)
          this.productData.meta.sortDesc && (this.options.sortDesc = this.productData.meta.sortDesc)
        })
        return this.productData.data
      }
      return []
    },

    showHeaders () {
      return this.selectedHeadersData && this.headers.filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
    },

    totalProducts () {
      if (!!this.productData && !!this.productData.meta) {
        return parseInt(this.productData.meta.total, 10)
      }
      return 0
    },

    pageCount () {
      if (!!this.productData && !!this.productData.meta) {
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
          selectedHeadersCategoryProducts: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersCategoryProducts'})
      }
    },

    selectedHeaders () {
      let selectedHeadersCategoryProducts = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersCategoryProducts')
      selectedHeadersCategoryProducts = selectedHeadersCategoryProducts && JSON.parse(selectedHeadersCategoryProducts.value)
      return selectedHeadersCategoryProducts
    },
  },

  async created() {
    this.initialize();
    this.bindedOnTableClick = this.onTableClick.bind(this);
    this.bindedOnDragStart = this.onDragStart.bind(this);
    this.bindedOnDragEnd = this.onDragEnd.bind(this);

    this.headers = Object.values(this.headersMap)
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.table.$el.addEventListener('click', this.bindedOnTableClick);
    })
  },
  beforeDestroy() {
    this.$refs.table.$el.removeEventListener('click', this.bindedOnTableClick);
    this._removeDragListeners();
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: 'ID', value: 'id', align: 'center', sortable: false, class: 'caption px-1', cellClass: 'text-h4', width: 103},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption px-0', cellClass: 'px-0 white', width: 139},
        {text: this.$t('name'), value: 'name', align: 'start', sortable: false, class: 'caption', width: '43%'},
        {text: this.$t('manufacturer'), value: 'manufacturer', sortable: false, align: 'center', class: 'caption',  width: '12%'},
        {text: this.$t('price'), value: 'producer_price', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4', width: 134},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4', width: '10%'},
      ];
    },
    onUpdatePage(e) {
      this._deselectAll();
    },
    onTableClick(e) {
      const row = e.target.closest('tr');
      if (!row) return;
      if (e.target.closest('a')) return;
      if (e.target.closest('.product-actions')) return;
      e.preventDefault();

      if (!e.shiftKey) {
        this._handleSimpleClick(row);
      } else {
        this._handleShiftClick(row);
      }
    },
    _handleSimpleClick(row) {
      const id = this._getIdByRow(row);
      const isNotSelected = (this.selected.findIndex(selected => selected.id == id) === -1);

      if (isNotSelected) {
        this._selectById(id);
      } else {
        this._deselectById(id);
      }
    },
    _handleShiftClick(row) {
      document.getSelection().removeAllRanges();
      const clickedId = this._getIdByRow(row);

      if (!this.selected.length) {
        this._selectById(clickedId);
      } else {
        const lastSelectedId = [...this.selected].pop().id;
        const lastSelectedRow = this._getRowById(lastSelectedId);
        const currentRow = this._getRowById(clickedId);
        const position = currentRow.compareDocumentPosition(lastSelectedRow);
        this._deselectAll();

        if (position === Node.DOCUMENT_POSITION_PRECEDING) {
          this._selectByDirection(clickedId, lastSelectedId, 'previous');
        } else if (position === Node.DOCUMENT_POSITION_FOLLOWING) {
          this._selectByDirection(clickedId, lastSelectedId, 'next');
        }
      }
    },
    _getRowById(id) {
      const idTd = document.getElementById(`product-${id}`);
      return idTd ? idTd.closest('tr') : null;
    },
    _getIdByRow(row) {
      return row.querySelector('.product-id') && row.querySelector('.product-id').dataset.id;
    },
    _selectById(id) {
      if (id) {
        const product = this.products.find(product => product.id == id);
        this.selected.push(product);
      }
    },
    _selectByDirection(currentId, lastSelectedId, direction) {
      let current = this._getRowById(currentId);
      let id = currentId;

      while (lastSelectedId != id) {
        this._selectById(id);
        current = current[`${direction}ElementSibling`];
        id = this._getIdByRow(current);
      }
      this._selectById(lastSelectedId);
    },
    _deselectById(id) {
      const index = this.selected.findIndex(selected => selected.id == id);
      this.selected.splice(index, 1);
    },
    _deselectAll() {
      this.selected = [];
    },
    _removeDragListeners() {
      this.products
        .map(product => product.id)
        .forEach(id => {
          const row = this._getRowById(id);
          if (row) {
            row.removeAttribute('draggable');
            row.removeEventListener('dragstart', this.bindedOnDragStart);
            row.removeEventListener('dragend', this.bindedOnDragEnd);
          }
        });
    },
    _addDragListenersToSelectedProducts() {
      this.selected
        .map(item => item.id)
        .forEach(id => {
          const row = this._getRowById(id);
          if (row) {
            row.setAttribute('draggable', true);
            row.addEventListener('dragstart', this.bindedOnDragStart);
            row.addEventListener('dragend', this.bindedOnDragEnd);
          }
        });
    },
    onDragStart(e) {
      e.dataTransfer.setData('text/plain', this.selected.map(item => item.id).join(','));
      e.dataTransfer.setDragImage(this._generateImageAndAppendToBody(), 0, 0);
      e.dataTransfer.effectAllowed = 'move';
    },
    _generateImageAndAppendToBody() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'indigo';
      ctx.fillRect(0, 0, 200, 28);
      ctx.font = '15px Roboto';
      ctx.fillStyle = 'white';
      ctx.fillText(this._getDraggedText(), 15, 18);
      const image = new Image();
      image.src = canvas.toDataURL();
      image.id = 'dragged-image';
      document.body.appendChild(image);
      return image;
    },
    _getDraggedText() {
      return `${this.selected.length} элемент${this._getSuffix()} выбран${this.selected.length > 1 ? 'о' : ''}`;
    },
    _getSuffix() {
      return (this.selected.length === 1) ? '' : (
        (this.selected.length >= 2 && this.selected.length <= 4) ? 'а' : 'ов'
      );
    },
    onDragEnd(e) {
      document.getElementById('dragged-image').remove();
      this._deselectAll();
    },

    isFullSearch(item, arrt) {
      return item[arrt].toLowerCase().includes(item.search.toLowerCase())
    },

    getMenu(e, { item }) {
      this.contextMenuSelectedId = item.id
      if (!this.selected.length) {
        this.selected.push(item)
      }
      for (let item of this.selected) {
        this.groupId = item.group_id
      }
      this.groupIds = this.selected.map(s => s.group_id)
      this.showMenu = false
      this.menuX = e.clientX
      this.menuY = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
      e.preventDefault()
    },

    createGroupProduct() {
      let productIds = this.selected.map(pr => pr.id);
      this.$store.dispatch('getNewGroupProduct', {
        productIds: productIds.join(','),
        category_id: this.category_id,
      }).then(() => {
        this.showForm = 'groupProduct'
      }).catch(e => {
        return this.$swal({
          title: (e.data.message),
          icon: "warning",
          value: true,
          button: 'OK',
        })
      })
    },

    editGroup(groupId) {
      this.$store.dispatch('getGroupProduct', {
        id: groupId,
        category_id: this.category_id,
      }).then(() => {
        this.showForm = 'groupProduct'
      })
    },

    addProductToGroup() {
      this.$store.dispatch('addProductToGroup', {
        id: this.groupId,
        category_id: this.category_id,
        newProductIds: this.selected.filter(product => !product.group_id).map(product => product.id).join(',')
      }).then(() => {
        this.showForm = 'groupProduct'
      })
    },

    createGroups() {
      this.$store.dispatch('createGroups', {
        productIds: this.selected.map(product => product.id).join(',')
      }).then(data => {
        this.productData.data = this.productData.data.map(product => {
          if (!!data[product.id]) {
            product.group_id = data[product.id]
          }
          return product;
        })
        this.selected = [];
      })
    },

    savedGroup(group) {
      this.showForm = false;
      this.productData.data = this.productData.data.map(product => {
        if (group.productIds.find(id => +id === product.id)) {
          product.group_id = group.id
        }
        return product;
      })
      this.selected = [];
    },

    createSpecification() {
      this.$store.dispatch('saveSpecificationToManyProducts', {
        productIds: this.selected.map(p => p.id),
        name: this.specificationName,
        value: this.specificationValue
      }).then(() => {
        this.selected = []
        this.dialogForSpecification = false
      })
    },

    async deleteSpecification() {
      await this.$store.dispatch('deleteSpecificationToManyProducts', {
        productIds: this.selected.map(p => p.id),
        name: this.specificationName,
      })
      this.selected = []
      this.dialogForDeleteSpecification = false
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

    highlightSearch(text) {
      return this.searchText && text && text.replace(new RegExp(this.searchText, "gi"), match => {
        return '<span class="full-highlight-result">' + match + '</span>';
      }) || text
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

    deleteSelectedProducts () {
      let productsIds = this.selected.map(s => s.id)
      this.$eventHandle.$emit('delete-selected-products', productsIds)
      this.selected = []
      this.showMenu = false
    },

    restoreSelectedProducts () {
      let productsIds = this.selected.map(s => s.id)
      this.$eventHandle.$emit('restore-selected-products', productsIds)
      this.selected = []
      this.showMenu = false
    },

    async addProductsToOfferCart () {
      let offerProductIds = this.offerProducts.map(offerProduct => offerProduct.id)
      this.selected = this.selected.filter(s => !offerProductIds.includes(s.id))
      if (this.selected.length == 0) {
        this.showMenu = false
        return
      }
      let offerProducts = this.offerProducts
      offerProducts = offerProducts.concat(this.selected)
      await this.$store.commit('setOfferProducts', offerProducts)
      this.offer.products = this.offerProducts.map(pr => ({
        group_id: pr.group_id,
        id: pr.id,
        percent: pr.percent || null,
        price: pr.var_price,
        qty: pr.qty || 1,
        warranty: pr.warranty,
        producer_price: pr.producer_price,
        marginal_price: pr.marginal_price,
      }))
      let savedOffer = await this.$store.dispatch('saveOffer', this.offer)
      savedOffer && Object.assign(this.offer, savedOffer)
      if (this.offer.products) {
        await this.$store.commit('setOfferProducts', this.offer.products.map(product => {
          product.qty = product.pivot.qty
          product.price = product.pivot.price
          product.warranty = product.pivot.warranty
          product.percent = product.pivot.percent
          product.groupProducts = (product.group && product.group.products) || []
          product.producer_price = product.pivot.producer_price
          product.marginal_price = product.pivot.marginal_price
          
          return product
        }))
      }
      offerProductIds = this.offerProducts.map(offerProduct => offerProduct.id)
      await this.$store.dispatch('saveOfferProductsPositions', {offer_id: this.offer.id, offerProductIds})
      await this.$store.dispatch('saveSetting', {
        cartOfferId: this.offer.id || null,
      })
      this.selected = []
      this.showMenu = false
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

    onClearSortStart(sortKey) {
      console.log(sortKey)
      this.clearSortInterval = setInterval(() => {
        console.log(sortKey)
        let sortIndex = this.options.sortBy.indexOf(sortKey)
        if (sortIndex > -1) {
          this.options.sortBy.splice(sortIndex, 1)
          this.options.sortDesc.splice(sortIndex, 1)
        }
      }, 700)
    },

    onClearSortStop() {
      clearInterval(this.clearSortInterval)
    },
  },

  watch: {
    selected() {
      this._removeDragListeners();
      this._addDragListenersToSelectedProducts();
      this.$emit('selected', this.selected);
    },
  },
}
</script>

<style lang="scss">
.category-goods__table {
  td:first-child {
    padding-left: 0 !important;
  }
}
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

.menu {
  position: fixed;
}

.popup-dialog__card-text {
  background: white;
  border-radius: 4px;
  padding: 0 !important;
  overflow: hidden !important;
}

.copy-icon:hover {
  color: black;
}
</style>
