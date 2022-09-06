<template>
  <div class="pb-1 offers" style="background: #B9D2EA; max-height: 100vh; overflow: hidden;">
    <v-row
      class="rounded-b white"
      no-gutters
      style="max-height: 45px; height: 45px;"
    >
      <v-col
        class="align-center d-flex justify-space-between px-2"
        cols="12"
        md="3"
      >
        {{ $t('productsHistory') }}
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
            <span>{{ '' }}</span>
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
              @contextmenu="showSelectedHeaders"
              class="d-flex flex-column justify-center align-end pr-2"
              style="height: 100%;"
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
                  <div class="font-12">
                    {{ 'ID' }}
                  </div>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('date')}"
                class="d-flex justify-end"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
                  <div class="font-12">
                    {{ $t('date') }}
                  </div>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('number')}"
                class="d-flex justify-end"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
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
                  <div class="font-12">
                    {{ $t('purchaseNum') }}
                  </div>
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
              class="text-center"
              style="height: 100%;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('status')}"
                class="d-flex justify-center"
                style="margin-left: -24px;"
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
            </div>
          </template>
          <template #item.id="{item}">
            <div class="d-flex flex-column justify-center align-end pr-2">
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
                  @click="openCategoryProductDialog(item)"
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
                <span class="mr-2 font-16" v-if="!item.is_vendor_corrected" style="color: red"> *</span>
                <a
                  :href="item.link_manufacturer"
                  class="text-decoration-none text-blue font-12"
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
            <span
              class="font-16"
              :class="item.status == 'sold' && 'text-vendor'"
              >
              {{ $t(item.status) }}
            </span
            >
          </template>
          <template #item.serial_number="{ item }">
            <div 
            class="d-flex flex-column justify-space-around px-2 bordered-left"
            style="height: 90%;"
            >
              <span class="d-flex justify-start font-16 line-break-two">
                {{ item.serial_number }}
              </span>
              <div 
              class="d-flex justify-space-between align-center mt-1"
              >
                <span class="font-14" style="color: #FBB03B;">
                  {{ item.warranty }} мес.
                </span>
                <span class="font-14" style="color: #3EC4FF;">
                  {{ balanceDate(item.date, item.warranty) }}
                </span>
              </div>
            </div>
          </template>
        </v-data-table>

        <div class="rounded main-page-pagination">
          <v-row class="rounded" justify="space-between">
            <v-col
            class="d-flex align-center pa-0 pl-2"
            cols="12" 
            md="1"
            >
              <v-text-field
                :value="paginationMeta.perPage"
                @keyup.enter="changePerPage($event, 'change-per-page-purchased-products')"
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
                  @input="selectedPage($event, 'change-page-purchased-products')"
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
      class="category-products__modal"
      max-width="1366px"
      width="100%"
      height="70vh"
      persistent
      scrollable
      v-if="dialogMain && showForm == 'purchase'"
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
            class="black--text pa-4 my-0 mr-3"
            style="width: 105px; height: 40px;"
            color="#B9D2EA"
            small
          >
            <div class="py-3">{{ $t('purchase') }}</div>
          </v-btn>
        </div>
        <v-card-text
          :style="'height: 85vh;'"
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
    <v-dialog
      :retain-focus="false"
      class="category-products__modal"
      max-width="1366px"
      width="100%"
      max-height="60vh"
      persistent
      scrollable
      v-if="dialogMain && showForm == 'categoryProduct'"
      v-model="dialogMain"
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
        <v-card-text
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA; height: 100vh;"
        >
          <category-product-form
            :category="product.root_category"
            :categorySelect="categorySelect"
            :product="product"
            ref="categoryProductForm"
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
import {mapGetters} from 'vuex'
import {debounce} from 'vue-debounce'
import dateMixin from "@/mixins/date";
import paginationMixin from "@/mixins/paginations";
import dateFormat from "@/filters/date";

const dFn = debounce(fn => fn(), '400ms')

export default {
  name: "PurchasedProducts",
  components: {
    CategoryProductForm: () => import("../components/category/CategoryProductForm"),
    CategoryProducts: () => import("../components/category/CategoryProducts"),
    LightBox: () => import("@/views/components/core/LightBox"),
    PurchaseForm: () => import("../components/purchases/PurchaseForm"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
    UploadFile: () => import("../components/core/UploadFile"),
  },
  props: ['purchaseDate'],
  mixins: [paginationMixin, dateMixin],
  filters: {dateFormat},

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
      showForm: '',
      showSelectedHeadersMenu: false,
      snackbar: false,
      warranties: [],
    }
  },

  async created() {
    this.$store.dispatch('getPurchasedProducts')
    this.initialize()

    this.$store.dispatch('getCategoryTree')

    this.$eventHandle.$on('change-page-purchased-products', (page) => {
      this.page = +page
      this.$store.dispatch('getPurchasedProducts', {
        page,
        perPage: this.perPage,
      })
    })
    this.$eventHandle.$on('change-per-page-purchased-products', (perPage) => {
      this.perPage = +perPage
      this.options.itemsPerPage = +perPage
      this.$store.dispatch('getPurchasedProducts', {
        page: this.page, perPage
      })
    })

    this.headers = Object.values(this.headersMap)
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersPurchasedProducts'})
  },

  destroyed() {
    this.$eventHandle.$off('change-page-purchased-products')
    this.$eventHandle.$off('change-per-page-purchased-products')
    this.$store.commit('setCategories', null)
    this.$store.commit('setDialog', false)
    this.$store.commit('setDialogMain', false)
    this.$store.commit('setPurchasedProducts', null)
  },

  computed: {
    ...mapGetters([
      'categorySelect',
      'dialog',
      'dialogMain',
      'product',
      'purchase',
      'purchaseProducts',
      'purchasedProducts',
      'requestStatus',
    ]),

    items() {
      if (this.purchasedProducts) {  
        this.paginationMeta.page = +this.purchasedProducts.meta.current_page
        this.paginationMeta.perPage = +this.purchasedProducts.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.purchasedProducts.meta.total / this.purchasedProducts.meta.per_page)
        return this.purchasedProducts.data
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
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: 'ID', value: 'id', align: 'end', sortable: true, class: 'caption', width: 146},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption px-0', cellClass: 'px-0 white', width: 140},
        {text: this.$t('name'), value: 'name', align: 'start', sortable: true, class: 'caption', width: "37%"},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: true, class: 'caption', width: 163},
        {text: this.$t('with_var_price'), value: 'price', align: 'center', sortable: true, class: 'caption', width: 169},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: true, class: 'caption', width: 129},
        {text: this.$t('serial_number'), value: 'serial_number', align: 'center', sortable: true, class: 'caption', width: "18%"},
      ]
    },

    viaEditItem(e, data) {
      this.editPurchase(data.item.purchase)
    },

    editPurchase(purchase) {
      this.$store.dispatch('getPurchase', purchase).then(data => {
        this.$store.commit('setPurchaseProducts', data.products);
        this.$store.commit('setDialogMain', true);
        this.showForm = 'purchase'
      })
    },

    closeModal() {
      this.$store.commit('setDialogMain', false)
      this.showForm = ''
    },

    async openCategoryProductDialog(item) {
      await this.$store.dispatch('getEditProduct', {id: item.productId})
      this.showForm = 'categoryProduct'
      this.$store.commit('setDialogMain', true)
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
