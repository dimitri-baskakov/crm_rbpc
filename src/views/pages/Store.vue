<template>
  <div style="background: #B9D2EA; height: 100vh; overflow: hidden;">
    <v-row
      class="rounded-b white"
      no-gutters
      style="max-height: 41px; height: 41px;"
    >
      <v-col
        class="align-center d-flex justify-space-between px-1"
        style="width: 356px; flex-basis: unset !important; -webkit-box-flex: unset !important;flex-grow: unset !important;"
      >
        <div class="align-center d-flex flex-nowrap" style="width: 100%;">
          <div>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon @click="getCategoryProducts({show_all_products_in_store_category: 'all'})" v-bind="attrs"
                        v-on="on"
                        tag="a" class="pa-1" v-if="showAllProductsStoreCategory === 'category'">mdi-eye-off</v-icon>
                <v-icon @click="getCategoryProducts({show_all_products_in_store_category: 'category'})" v-bind="attrs"
                        v-on="on"
                        tag="a" class="pa-1" v-else>mdi-eye</v-icon>
              </template>
              <span v-if="showAllProductsStoreCategory === 'category'">все товары</span>
              <span v-else>товары категории</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pr-2" @click="$eventHandle.$emit('close-tree')"
                        v-bind="attrs" v-on="on" tag="a">mdi-folder-outline</v-icon>
              </template>
              <span>закрыть категории</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pa-1" @click="$eventHandle.$emit('open-tree')"
                        v-bind="attrs" v-on="on" tag="a">mdi-folder-open-outline</v-icon>
              </template>
              <span>открыть категории</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pa-1" @click="createCategory" v-bind="attrs"
                        v-on="on" tag="a">mdi-plus-circle-outline</v-icon>
              </template>
              <span>создать категорию</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pa-1" @click="editCategory" v-bind="attrs"
                        v-on="on" tag="a" :disabled="!selectedStoreCategory">mdi-circle-edit-outline</v-icon>
              </template>
              <span>редактировать категорию</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pa-1" @click="deleteCategory" v-bind="attrs"
                        v-on="on" tag="a" :disabled="!selectedStoreCategory">mdi-delete-circle-outline</v-icon>
              </template>
              <span>удалить категорию</span>
            </v-tooltip>
          </div>
          <v-spacer></v-spacer>
          <v-menu
            :close-on-click="false"
            :close-on-content-click="false"
            bottom
            open-delay="500"
            open-on-hover
            persistent
          >
            <template v-slot:activator="{ on, attrs }">
              <div>
                <v-fab-transition
                  :leave-absolute="true"
                  :hide-on-leave="false"
                  origin="center center 0"
                >
                  <div
                    @click="editOffer"
                    class="pa-0 px-1 counting-box"
                    tag="a"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <div
                      class="heading"
                    >
                      0
                    </div>
                  </div>
                </v-fab-transition>
              </div>
            </template>
          </v-menu>
        </div>
      </v-col>
      <v-col
        class="d-flex"
        cols="8"
      >
        <v-row>
          <v-col class="my-0 pl-5" cols="12" md="6">
            <h3 class=""><b>{{ $t('products') }}</b> ({{ storeProductCount }})</h3>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <div
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-breadcrumbs
                    :items="openedCategories"
                    class="ma-0 pa-0 caption category-goods__breadcrumbs"
                    divider="<>"
                    style="cursor: default; max-height: 17px; overflow: hidden; user-select: none;"
                  ></v-breadcrumbs>
                </div>
              </template>
              <v-breadcrumbs
                :items="openedCategories"
                class="ma-0 pa-0 caption"
                dark
                divider="<>"
              ></v-breadcrumbs>
            </v-tooltip>
          </v-col>
          <v-col class="align-center d-flex justify-space-between category-goods__search" cols="6">
            <v-text-field
              @click:prepend-inner="clearSearch"
              @keyup.enter="$eventHandle.$emit('search', search)"
              class="text-body-2"
              dense
              dir="rtl"
              hide-details
              outlined
              prepend-inner-icon="mdi-close"
              single-line
              v-model="search"
              height="30px"
            ></v-text-field>
            <v-btn
              @click="$eventHandle.$emit('search', search)"
              class="ml-1 mr-0 search-button primary category-goods__search-button"
              small
            >
              {{ $t('search') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        class="align-center d-flex justify-end px-1"
        cols="1"
      >
        <div class="d-flex" style="width: 100%;">
          <v-btn
            @click="resetFilter"
            color="black"
            outlined
            small
            class="category-goods__search-clear"
          >
            {{ $t('reset') }}
          </v-btn>
          <span class="mx-5" v-show="requestStatus === 'loading'">
            <v-progress-circular indeterminate size="25"></v-progress-circular>
          </span>
          <v-spacer></v-spacer>
          <v-tooltip bottom open-delay="400">
            <template #activator="{ on, attrs }">
              <v-icon
                :disabled="!selectedStoreCategory"
                class="mx-2"
                tag="a"
                v-bind="attrs"
                v-on="on"
              >
                mdi-plus-circle-outline
              </v-icon>
            </template>
            <span>создать товар</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>

    <v-row
      class="flex-nowrap mt-1 pl-4 pr-4"
    >
      <v-col
        class="pa-1 rounded white category-goods__categories"
      >
        <category-tree
          class="category-goods__categories-wrapper p-1"
          :activeCategories="storeActiveCategories"
          :activeCategoryId="storeActiveCategoryId"
          :categoryTree="storeCategoryTree"
          :mode="'store'"
          @attach-product="$store.dispatch('attachStoreProducts', $event)"
          @input="getSelectedCategory"
          @move="$store.dispatch('moveStoreCategory', $event)"
        ></category-tree>
      </v-col>
      <v-col
        class="ml-1 pa-1 rounded white category-goods__content"
      >
        <v-data-table
          :headers="showHeaders"
          :items-per-page="parseInt(paginationMeta.perPage)"
          :items="items"
          @update:page="onUpdatePage"
          class="category-products-table store-product-table"
          disable-sort
          fixed-header
          height="calc(100vh - 100px)"
          hide-default-footer
          ref="table"
          show-select
          sort-by="products"
          v-model="selected"
        >
          <template #header.id="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="d-flex flex-column justify-center align-end pr-2"
              style="height: 100%;box-sizing: border-box;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
                class="d-flex justify-end"
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
                  <span class="font-12">
                    {{ 'ID' }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('date')}"
                class="d-flex justify-end"
                style="height: 33%;"
              >
                <sort-indicator
                  :columnName="'date'"
                  :options="options"
                ></sort-indicator>
                <div
                  @click="sortRows('date')"
                  class="d-flex"
                  style="cursor: pointer;"
                >
                  <span class="font-12">
                    {{ $t('date') }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('number')}"
                class="d-flex justify-end"
                style="height: 33%;"
              >
                <sort-indicator
                  :columnName="'number'"
                  :options="options"
                ></sort-indicator>
                <div
                  @click="sortRows('number')"
                  class="d-flex"
                  style="cursor: pointer;"
                >
                  <span class="font-12">
                    {{ $t('purchaseNum') }}
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template #header.image="{ header }">
            <span class="font-12">
              {{$t('image')}}
            </span>
          </template>
          <template #header.name="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="d-flex justify-space-between align-center px-3"
              style="box-sizing: border-box;"
            >
              <div
                class="d-flex justify-end"
              >
                <span class="font-12">
                  {{ $t('name') }}
                </span>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('category_name')}"
                class="d-flex flex-column justify-center align-end"
              >
                <div
                  class="d-flex justify-start"
                >
                  <span class="font-12">
                    {{ $t('sku_original') }}
                  </span>
                </div>
                <div class="d-flex align-center mt-1">
                  <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('category') }}
                  </span>
                </div>
              </div>
            </div>
            </div>
          </template>
          <template #header.manufacturer="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="d-flex flex-column justify-center align-end pr-2"
              style="box-sizing: border-box;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('manufacturer')}"
                class="d-flex justify-end"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('manufacturer') }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('vendor')}"
                class="d-flex justify-end mt-1"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('vendor') }}
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template #header.price="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="d-flex flex-column justify-center align-center"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('price')}"
                class="d-flex justify-center pr-3"
                style="width: 100%;margin-left: 48px;"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
                  <sort-indicator
                    :columnName="'price'"
                    :options="options"
                  ></sort-indicator>
                </div>
                <div
                  @click="sortRows('price')"
                  class="d-flex"
                  style="cursor: pointer;"
                >
                  <span class="font-12">
                    {{ $t('price') }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('var_price')}"
                class="d-flex justify-center"
                style="width: 100%;"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('with_var_price') }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('marginal_price')}"
                class="d-flex justify-center"
                style="width: 100%;margin-left: -48px;"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('marginal_price') }}
                  </span>
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
              class="d-flex justify-center"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('status') }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('warranty')}"
                class="d-flex justify-center mt-1"
                >
                  <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('warranty') }}
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template #header.serial_number="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="d-flex flex-column justify-center align-center"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('serial_number')}"
                class="d-flex justify-center"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('serial_number') }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('balance_warranty_term')}"
              class="d-flex justify-center mt-1"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    {{ $t('balance_warranty_term') }}
                  </span>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('warranty')}"
                class="d-flex justify-center mt-1"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator">
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
                  <span class="font-12">
                    Дата окончания
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template #item.id="{item}">
            <div 
            class="d-flex flex-column justify-center align-end bordered-left pr-3"
            style="height: 90%;"
            >
              <div class="font-16">{{ item.id }}</div>
              <div class="font-16 mt-1">{{ item.date | dateFormat }}</div>
              <div class="mt-1">
                <a class="font-16 text-blue" @click.prevent="editPurchase(item.purchase)">
                  {{ item.number }}
                </a>
              </div>
            </div>
          </template>
          <template #item.image="{ item }">
            <light-box 
            class="light-box"
            @click.stop.prevent 
            v-if="!!item.images && item.images.length" 
            :key="item.id" :images="item.images" 
            style="height: 95px !important;"
            />
          </template>
          <template #item.name="{ item }">
            <div 
              dir="rtl" 
              class="d-flex flex-column justify-space-around px-3 bordered-right"
              style="height: 90%;"
              >
                <div class="d-flex justify-space-between align-start">
                  <a
                    @click="editProduct(item)"
                  class="font-weight-black font-16 line-break-two"
                    draggable="true"
                  >
                    <div
                    class="text-blue font-16" 
                      :class="{'full-highlight-result': isFullSearch(item, 'name')}"
                      v-html="item.highlightResult._highlightResult.name.value"
                      v-if="!!item.highlightResult"
                    ></div>
                    <div v-else class="d-inline">
                      <span class="text-blue font-16" v-if="typeof item.name === 'object'" v-html="(item.name[$i18n.locale])"></span>
                      <span class="text-blue font-16" v-else v-html="(item.name)"></span>
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
                <span class="font-14">
                  {{ typeof item.category_name == 'string' ? JSON.parse(item.category_name)[$i18n.locale] : item.category_name[$i18n.locale] }}
                </span>
                <v-spacer></v-spacer>
                <span
                  @click.stop
                  class="font-14 ml-2 text-blue"
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
            class="d-flex flex-column justify-space-around align-end pr-3"
            style="height: 90%;">
              <a
                :href="item.url"
                class="text-decoration-none text-green-light font-16"
                target="_blank"
                v-if="!!item.url && !item.url.indexOf('http')"
              >{{ item.manufacturer }}</a>
              <span
                v-else
                class="font-16"
              >{{ item.manufacturer }}</span>
              <div>
                <span class="mr-2 font-12" v-if="!item.is_vendor_corrected" style="color: red"> *</span>
                <a
                  :href="item.link_manufacturer"
                  class="text-decoration-none text-blue font-16"
                  target="_blank"
                  v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')"
                >{{ item.vendor }}</a>
                <span class="font-16 color-blue" v-else>{{ item.vendor }}</span>
              </div>
            </div>
          </template>
          <template #item.price="{ item }">
            <div
            class="px-3 d-flex flex-column justify-space-around bordered-both"
            style="height: 90%;"
            >
              <div 
              class="text-center font-16" 
              style="margin-left: 48px;"
              >
                {{ item.purchase_producer_price }}
              </div>
              <div class="text-center font-16">
                {{ item.price }}
              </div>
              <div 
              class="text-center font-16" 
              style="margin-left: -48px;"
              >
                {{ item.purchase_marginal_price }}
              </div>
            </div>
          </template>
          <template #item.status="{ item }">
            <div class="d-flex flex-column justify-space-around align-center"
            style="height: 90%;"
            >
              <span
                class="font-16"
                :class="item.status == 'sold' && 'text-vendor'"
                >
                {{ $t(item.status) }}
              </span>
              <span
                class="font-16"
                style="color: #FBB03B;"
                >
                {{ balanceDate(item.date, item.warranty) }}
              </span>
            </div>
          </template>
          <template #item.serial_number="{ item }">
            <div 
            class="d-flex flex-column justify-space-around px-2 bordered-left"
            style="height: 90%;"
            >
              <span class="d-flex justify-start font-16 line-break-two">
                {{ item.serial_number }}
              </span>
              <div class="align-center d-flex justify-space-between mt-1">
                <span class="font-14" style="color: #3EC4FF;">
                  {{ balanceDate(item.date, item.warranty) }}
                </span>
                <span class="font-14" style="color: #3EC4FF;">
                  {{ item.warranty_expiration_date }}
                </span>
              </div>
            </div>
          </template>
        </v-data-table>

        <div 
        class="rounded main-page-pagination"
        v-if="items.length && !!!items[0].highlightResult"
        >
          <v-row justify="space-between">
            <v-col
            class="d-flex align-center pa-0 pl-2"
            cols="12" 
            md="1"
            >
              <v-text-field
                class="mt-3 ml-2 main-page-pagination__input"
                :value="storeProducts.meta.per_page"
                @keyup.enter="changeParams({...options, ...{ itemsPerPage: parseInt($event.target.value, 10), page: 1, search: search }}, 'change-params')"
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
              <div class="text-center pt-2">
                <v-pagination
                  class="main-page-pagination__wrapper"
                  :length="paginationMeta.pageCount"
                  @input="changeParams({...options, ...{ page: parseInt($event, 10), search: search }}, 'change-params')"
                  v-model="paginationMeta.page"
                ></v-pagination>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col
        class="ml-1 pa-1 rounded white category-goods__properties"
      >
        <v-expansion-panels
          :disabled="requestStatus === 'loading'"
          accordion
          dense
          style="max-height: calc(100vh - 50px); overflow-y: auto; overflow-x: hidden;"
        >
          <v-expansion-panel
            class="mb-2 rounded filters-expansion-panel"
            dense
            dir="rtl"
            v-if="vendors"
          >
            <v-expansion-panel-header
              class="pa-0 ma-0 text-right"
              color="#CCE3FF"
              hide-actions
            >
              <template v-slot:default="{ open }">
                <v-row no-gutters class="ma-0 pa-0 rounded">
                  <v-col
                    class="ma-0 pa-2 rounded"
                    cols="12"
                  >
                    {{ $t('vendors') }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="ma-0 pa-0 rounded-b text--secondary"
                    style="background: #EEEEEE;"
                  >
                    <v-fade-transition leave-absolute>
                      <div
                        v-if="!open"
                        key="1"
                      >
                        <v-checkbox
                          :key="vendor.id"
                          :label="vendor.name"
                          :value="vendor.id"
                          @change="getCategoryProducts({})"
                          @click.stop
                          class="ma-0 text-truncate"
                          color="primary"
                          dense
                          hide-details
                          v-for="vendor in vendors.data.filter(v => vendorIds.includes(v.id))"
                          v-model="vendorIds"
                        ></v-checkbox>
                      </div>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content
              class="pa-0 ma-0"
              color="#EEEEEE"
            >
              <v-checkbox
                :key="vendor.id"
                :label="vendor.name"
                :value="vendor.id"
                @change="getCategoryProducts({})"
                class="ma-0 text-truncate"
                color="primary"
                dense
                hide-details
                v-for="vendor in vendors.data"
                v-model="vendorIds"
              ></v-checkbox>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel
            :disabled="!filter.properties.length"
            :key="filter.id"
            class="mb-2 rounded filters-expansion-panel"
            dense
            dir="rtl"
            v-for="(filter, index) in filters"
          >
            <v-expansion-panel-header
              class="pa-0 ma-0 text-right"
              color="#CCE3FF"
              hide-actions
            >
              <template v-slot:default="{ open }">
                <v-row no-gutters class="ma-0 pa-0 rounded">
                  <v-col
                    class="ma-0 pa-2 rounded"
                    cols="12"
                  >
                    {{ filter.name }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="ma-0 pa-0 rounded-b text--secondary"
                    style="background: #EEEEEE;"
                  >
                    <v-fade-transition leave-absolute>
                      <div
                        v-if="!open"
                        key="1"
                      >
                        <v-checkbox
                          :key="property.id"
                          :label="property.name"
                          :value="property.id"
                          @change="getCategoryProducts({})"
                          @click.stop
                          class="ma-0 text-truncate"
                          color="primary"
                          dense
                          hide-details
                          v-for="property in filter.properties.filter(f => propertyIds[index] && propertyIds[index].includes(f.id))"
                          v-model="propertyIds[index]"
                        ></v-checkbox>
                      </div>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content
              class="pa-0 ma-0"
              color="#EEEEEE"
            >
              <v-row
                :key="property.id"
                class="d-flex ma-0 pa-0"
                no-gutters
                v-for="property in filter.properties"
              >
                <v-col
                class="d-flex align-center" 
                cols="12"
                >
                  <v-checkbox
                    :label="property.name"
                    :value="property.id"
                    @change="getCategoryProducts({})"
                    class="ma-0 text-truncate"
                    color="primary"
                    dense
                    hide-details
                    v-model="propertyIds[index]"
                  ></v-checkbox>
                  <v-spacer></v-spacer>
                  <v-icon
                    @click="editProperty(property)"
                    small
                  >mdi-pencil</v-icon>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row></v-row>

    <v-dialog
      :max-width="showForm == 'purchase' ? '1366px' : '1200px'"
      :retain-focus="false"
      max-height="61vh"
      persistent
      scrollable
      v-if="dialogMain"
      v-model="dialogMain"
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
          style="position: absolute; top: -55px; right: -65px; width: calc(1366px + 60px);"
          v-if="showForm == 'purchase' && $refs.purchaseForm"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="closeModal()"
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
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="()=>{}"
                class="dialog-action-button"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>
                  mdi-content-copy
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('copy') }}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <div
            class="ma-0 ml-3 pa-1 rounded white"
            dir="ltr"
          >
            <v-select
              :disabled="$refs.purchaseForm.isNotNewStatus || (!!$refs.purchaseForm.form.manufacturer_id && !!$refs.purchaseForm.purchaseProducts.length)"
              :items="$refs.purchaseForm.manufacturers || []"
              :label="$t('manufacturer')"
              class="dense-input"
              dense
              dir="ltr"
              height="25px"
              hide-details
              item-text="name"
              item-value="id"
              required
              style="width: 130px"
              v-if="purchase"
              v-model="$refs.purchaseForm.form.manufacturer_id"
            />
          </div>
          <div
            class="ma-0 ml-3 pa-1 rounded white"
            dir="ltr"
          >
            <v-select
              :disabled="$refs.purchaseForm.disabledStatus"
              :items="[
                {name: 'Предзаказ', value:'new'},
                {name: 'Склад', value:'store'},
              ]"
              :label="$t('status')"
              class="dense-input"
              dense
              dir="ltr"
              height="25px"
              hide-details
              item-text="name"
              item-value="value"
              required
              style="width: 130px"
              v-if="purchase"
              v-model="$refs.purchaseForm.form.status"
            ></v-select>
          </div>
          <div
            class="ma-0 pa-1 rounded white"
          >
            <v-text-field
              :label="$t('purchaseNumber')"
              :value="$refs.purchaseForm.form.serial_number"
              class="dense-input"
              dense
              dir="ltr"
              height="25px"
              hide-details
              readonly
              style="width: 130px"
            />
          </div>
          <v-btn
            class="black--text pa-4 my-0"
            color="#B9D2EA"
            small
            style="height: 40px"
          >
            <div class="py-3">{{ $t('purchase') }}</div>
          </v-btn>
        </div>
        <div
          class="d-flex justify-end "
          color="transparent"
          dark
          dir="rtl"
          style="position: absolute; top: -45px; right: -65px;"
          v-else-if="showForm == 'product'"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="$store.commit('setDialogMain', false)"
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
        <div
          color="transparent"
          dark
          class="d-flex justify-end "
          style="position: absolute; top: -45px; right: -65px;"
          dir="rtl"
          v-else
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="closeModal()"
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
                @click="$refs.categoryForm.saveCategory()"
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
          :style="'height: 85vh;'"
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA;"
        >
          <category-form
            :category="storeCategory"
            :categorySelect="storeCategorySelect"
            class="pa-3 white"
            ref="categoryForm"
            v-if="showForm === 'category'"
          />
          <category-product-form
            :product="product"
            :storeCategory="selectedStoreCategory"
            :storeCategorySelect="storeCategorySelect"
            ref="categoryProductForm"
            v-if="showForm === 'product'"
          />
          <purchase-form
            :purchase="purchase"
            ref="purchaseForm"
            v-if="showForm === 'purchase'"
          />
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
import dateFormat from "@/filters/date";
import dateMixin from "@/mixins/date";
import paginationMixin from "@/mixins/paginations";
import {debounce} from 'vue-debounce'
import {mapGetters} from 'vuex'

const dFn = debounce(fn => fn(), '400ms')

export default {
  name: "StoreProducts",
  components: {
    CategoryForm: () => import("@/views/components/category/CategoryForm"),
    CategoryProductForm: () => import("../components/category/CategoryProductForm"),
    CategoryProducts: () => import("../components/category/CategoryProducts"),
    CategoryTree: () => import("../components/category/CategoryTree"),
    LightBox: () => import("@/views/components/core/LightBox"),
    PurchaseForm: () => import("../components/purchases/PurchaseForm"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
    UploadFile: () => import("../components/core/UploadFile"),
  },
  filters: {dateFormat},
  mixins: [paginationMixin, dateMixin],
  data () {
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
      innerHeight: 900,
      search: '',
      selected: [],
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      selectedStoreCategories: [],
      selectedStoreCategory: null,
      showForm: '',
      showMenu: false,
      showSelectedHeadersMenu: false,
      snackbar: false,
    }
  },

  computed: {
    ...mapGetters([
      'storeActiveCategories',
      'storeActiveCategoryId',
      'dialogMain',
      'filters',
      'product',
      'purchase',
      'purchaseProducts',
      'requestStatus',
      'showAllProductsStoreCategory',
      'storeCategory',
      'storeCategorySelect',
      'storeCategoryTree',
      'storeProductCount',
      'storeProducts',
      'vendors',
    ]),

    items() {
      if (this.storeProducts && this.storeProducts.meta) {
        this.paginationMeta.page = +this.storeProducts.meta.current_page
        this.paginationMeta.perPage = +this.storeProducts.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.storeProducts.meta.total / this.storeProducts.meta.per_page)
        this.$nextTick(() => {
          this.options.itemsPerPage = +this.storeProducts.meta.per_page
          this.storeProducts.meta.sortBy && (this.options.sortBy = this.storeProducts.meta.sortBy)
          this.storeProducts.meta.sortDesc && (this.options.sortDesc = this.storeProducts.meta.sortDesc)
        })
        return this.storeProducts.data
      }
      return []
    },
    openedCategories() {
      let names = this.storeActiveCategories.map(item => {
        return {
          text: item.name[this.$i18n.locale],
        }
      })
      return names.reverse()
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
          selectedHeadersStore: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersStore'})
      }
    },

    selectedHeaders () {
      let selectedHeadersStore = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersStore')
      selectedHeadersStore = selectedHeadersStore && JSON.parse(selectedHeadersStore.value)
      return selectedHeadersStore
    },
  },

  async created() {
    this.initialize()

    await this.$store.dispatch('getVendors', {all: true})

    this.bindedOnTableClick = this.onTableClick.bind(this);
    this.bindedOnDragStart = this.onDragStart.bind(this);
    this.bindedOnDragEnd = this.onDragEnd.bind(this);

    this.$eventHandle.$on('change-page-store', (page) => {
      this.page = +page
      this.$store.dispatch('getStoreProducts', {
        page, perPage: this.perPage
      })
    })
    this.$eventHandle.$on('change-per-page-store', (perPage) => {
      this.perPage = +perPage
      this.$store.dispatch('getStoreProducts', {
        page: this.page, perPage
      })
    })

    this.headers = Object.values(this.headersMap)

    if (!!this.storeActiveCategoryId) {
      this.selectedStoreCategory = {id: this.storeActiveCategoryId}
      this.getCategoryProducts()
    } else {
      let settings = await this.$store.dispatch('getSettings', {settingsName: 'storeActiveCategories'})
      let json = settings && settings.length && settings.find(s => s.name == 'storeActiveCategories')
      let settingsValue = json && JSON.parse(json.value)
      let storeActiveCategoryId = settingsValue.storeActiveCategoryId
      let storeActiveCategories = settingsValue.storeActiveCategories
      if (storeActiveCategoryId && storeActiveCategories) {
        await this.getSelectedCategory({
          category: {id: storeActiveCategoryId},
          selectedCategories: storeActiveCategories,
        })
      }
    }
    await this.$store.dispatch('getStoreCategoryTree')
    this.setEventStoreCategory()

    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersStore'})
  },

  mounted() {
    this.innerHeight = window.innerHeight - 200
    this.$refs.table.$el.addEventListener('click', this.bindedOnTableClick);
  },

  async beforeDestroy() {
    if (this.storeActiveCategoryId && this.storeActiveCategories.length) {
      await this.$store.dispatch('saveSetting', {
        storeActiveCategories: JSON.stringify({
          storeActiveCategoryId: this.storeActiveCategoryId,
          storeActiveCategories: this.storeActiveCategories,
        })
      })
    }
    if (this.$refs.table) {
      this.$refs.table.$el.removeEventListener('click', this.bindedOnTableClick)
    }
    this._removeDragListeners();
  },

  destroyed() {
    this.$store.commit('setDialogMain', false)
    this.$store.commit('setStoreCategoryProducts', null)

    this.$eventHandle.$off('change-params')
    this.$eventHandle.$off('save-category')
    this.$eventHandle.$off('change-page-store')
    this.$eventHandle.$off('change-per-page-store')
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: 'ID', value: 'id', align: 'end', sortable: true, class: 'caption', width: 139},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption px-0', width: 130, cellClass: 'px-0 white'},
        {text: this.$t('name'), value: 'name', align: 'start', sortable: true, class: 'caption', width: "33%"},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: true, class: 'caption', width: 137},
        {text: this.$t('with_var_price'), value: 'price', align: 'center', sortable: true, class: 'caption', width: 121},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: true, class: 'caption', width: 110},
        {text: this.$t('serial_number'), value: 'serial_number', align: 'center', sortable: true, class: 'caption', width: 187}
      ]
    },

    editStorePurchase(item) {
      this.$store.dispatch('getPurchase', item.purchase).then(data => {
        this.$store.commit('setPurchaseProducts', data.products);
        this.$store.commit('setDialogMain', true);
        this.showForm = 'purchase'
      })
    },

    setEventStoreCategory() {
      this.$eventHandle.$on('save-category', (category) => {
        this.$store.dispatch('saveStoreCategory', category).then(resp => {
          if (!!category.id) {
            this.$eventHandle.$emit('change-node', resp)
            let activeCategories = this.storeActiveCategories
            Object.assign(activeCategories.find(c => category.id === c.id), resp)
            this.$store.commit('setStoreActiveCategories', activeCategories)
          } else {
            this.$eventHandle.$emit('add-node', resp)
          }
          this.$store.dispatch('resetStoreCategoryCache')
        })
      })

      this.$eventHandle.$on('change-params', (params) => {
        const { page, itemsPerPage } = params
        this.page = page
        this.perPage = itemsPerPage
        this.getCategoryProducts(params)
      })

      this.$eventHandle.$on('change-page', (page) => {
        this.page = page
        this.getCategoryProducts()
      })

      this.$eventHandle.$on('change-per-page', (perPage) => {
        this.perPage = perPage
        this.getCategoryProducts()
      })
    },

    createCategory() {
      const parent_id = this.selectedStoreCategory ? this.selectedStoreCategory.id : null
      this.$store.dispatch('getStoreCategory', {id: null, parent_id}).then(() => {
        this.$store.commit('setDialogMain', true)
        this.showForm = 'category'
      })
    },

    editCategory() {
      this.$store.dispatch('getStoreCategory', this.selectedStoreCategory).then(() => {
        this.$store.commit('setDialogMain', true)
        this.showForm = 'category'
      })
    },

    deleteCategory() {
      let category = this.selectedStoreCategory;
      let allow = !(!!category.children.length || !!category.products_count)
      this.showSwal(allow).then((res) => {
        if (allow && res) {
          this.$store.dispatch('deleteStoreCategory', category.id).then(() => {
            this.$store.commit('setStoreActiveCategories', this.storeActiveCategories.filter(c => c.id !== category.id))
            this.$store.commit('setStoreCategory', null)
            this.selectedStoreCategory = null
            this.$eventHandle.$emit('delete-node', category)
          })
        }
      })
    },

    editPurchase(purchase) {
      this.$store.dispatch('getPurchase', purchase).then(data => {
        this.$store.commit('setPurchaseProducts', data.products);
        this.$store.commit('setDialogMain', true);
        this.showForm = 'purchase'
      })
    },

    editProduct(item) {
      this.$store.dispatch('getEditProduct', {
        id: item.productId,
        var_price: item.price,
      }).then(() => {
        this.$store.commit('setDialogMain', true)
        this.showForm = 'product'
      })
    },

    showSwal(allow) {
      if (allow) {
        return this.$swal({
          title: this.$t('are-you-sure') + "!",
          icon: "warning",
          value: true,
          buttons: [this.$t('cancel'), this.$t('continue')],
        })
      } else {
        return this.$swal({
          title: this.$t("Невозможно удалить") + "!",
          icon: "warning",
          value: true,
          button: 'OK',
        })
      }
    },

    async getSelectedCategory (data) {
      this.search = null
      this.specificationIds = []
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      this.vendorIds = []
      this.selectedStoreCategory = data.category
      this.selectedStoreCategories = data.selectedCategories
      this.$store.commit('setStoreActiveCategoryId', this.selectedStoreCategory.id)
      this.$store.commit('setStoreActiveCategories', this.selectedStoreCategories)
      dFn(this.getCategoryProducts);
      await this.getCategoryFilters()
    },

    getCategoryProducts(params = {}) {
      if (!!params.hasOwnProperty('show_all_products_in_store_category')) {
        this.$store.commit('setShowAllProductsStoreCategory', params.show_all_products_in_store_category)
      }
      if (this.selectedStoreCategory) {
        params.category_id = this.selectedStoreCategory.id
      }
      params.show_all_products_in_store_category = this.showAllProductsStoreCategory
      params.perPage = this.perPage
      params.page = this.page
      params.pageName = 'storeCategory'
      this.$store.dispatch('getStoreProducts', params)
    },

    closeModal() {
      this.$store.commit('setDialogMain', false)
      this.showForm = ''
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
      return row.querySelector('.product-id').dataset.id;
    },
    _selectById(id) {
      const product = this.items.find(product => product.id == id);
      this.selected.push(product);
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
      this.items
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

    clearSearch () {
      this.search = null
      this.$eventHandle.$emit('change-params', {page: 1})
    },

    resetFilter() {
      this.specificationIds = []
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      this.vendorIds = []
      this.getCategoryProducts()
    },

    async getCategoryFilters() {
      await this.$store.dispatch('getVendors', {
        categoryId: this.storeActiveCategoryId,
      })
      await this.$store.dispatch('getCategoryFilters', {
        category_id: this.storeActiveCategoryId,
      })
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
      return this.search && text && text.replace(new RegExp(this.search, "gi"), match => {
        return '<span class="full-highlight-result">' + match + '</span>';
      }) || text
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
  },

  watch: {
    selected() {
      this._removeDragListeners();
      this._addDragListenersToSelectedProducts();
    },
    filters: function (val, oldVal) {
      this.propertyIds = {}
      for (let [index, filter] of val.entries()) {
        this.propertyIds[index] = []
      }
    },
  },
}
</script>
<style lang="scss">
  .store-product-table {
    .v-data-table__wrapper {
      overflow-y: scroll !important;
    }
    td:first-child {
      padding: 0 !important;
    }
  }
</style>
