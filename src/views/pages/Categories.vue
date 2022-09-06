<template>
  <div style="background: #B9D2EA; max-height: 100vh; overflow: hidden;">
    <v-row
      class="rounded-b white"
      no-gutters
      style="max-height: 41px; height: 41px;"
    >
      <v-col
        class="align-center d-flex justify-space-between px-1"
        style="width: 356px; flex-basis: unset !important; -webkit-box-flex: unset !important;flex-grow: unset !important;"
      >
        <div class="align-center d-flex justify-space-between flex-nowrap" style="width: 100%;">
          <div class="d-flex align-center">
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pa-1" @click="changeMode" tag="a" v-bind="attrs" v-on="on"
                        v-if="mode === 'products'">mdi-format-list-bulleted</v-icon>
                <v-icon class="pa-1 red rounded" @click="changeMode" tag="a" v-else>mdi-format-line-spacing</v-icon>
              </template>
              <span v-if="mode === 'products'">группированные товары</span>
              <span v-else>товары</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon @click="getCategoryProducts({show_all_products_in_category: 'all'})" v-bind="attrs"
                        v-on="on"
                        tag="a" class="pa-1" v-if="showAllProductsCategory === 'category'">mdi-eye-off</v-icon>
                <v-icon @click="getCategoryProducts({show_all_products_in_category: 'category'})" v-bind="attrs"
                        v-on="on"
                        tag="a" class="pa-1" v-else>mdi-eye</v-icon>
              </template>
              <span v-if="showAllProductsCategory === 'category'">все товары</span>
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
                <v-icon class="pa-1" @click="$eventHandle.$emit('create-category', selectedCategory)" v-bind="attrs"
                        v-on="on" tag="a">mdi-plus-circle-outline</v-icon>
              </template>
              <span>создать категорию</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pa-1" @click="$eventHandle.$emit('edit-category', selectedCategory)" v-bind="attrs"
                        v-on="on" tag="a" :disabled="!selectedCategory">mdi-circle-edit-outline</v-icon>
              </template>
              <span>редактировать категорию</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon class="pa-1" @click="$eventHandle.$emit('delete-category', selectedCategory)" v-bind="attrs"
                        v-on="on" tag="a" :disabled="!selectedCategory">mdi-delete-circle-outline</v-icon>
              </template>
              <span>удалить категорию</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-icon
                  @click="getCategoryProducts({show_deleted_products: 'all'})"
                  class="pa-1"
                  tag="a"
                  v-bind="attrs"
                  v-if="showDeletedProducts === 'active'"
                  v-on="on"
                >mdi-circle-outline</v-icon>
                <v-icon
                  @click="getCategoryProducts({show_deleted_products: 'trashed'})"
                  class="pa-1"
                  tag="a"
                  v-bind="attrs"
                  v-else-if="showDeletedProducts === 'all'"
                  v-on="on"
                >mdi-adjust</v-icon>
                <v-icon
                  @click="getCategoryProducts({show_deleted_products: 'active'})"
                  class="pa-1"
                  tag="a"
                  v-bind="attrs"
                  v-else
                  v-on="on"
                >mdi-circle-off-outline</v-icon>
              </template>
              <span v-if="showDeletedProducts === 'all'">показывать все</span>
              <span v-else-if="showDeletedProducts === 'trashed'">только выключенные</span>
              <span v-else>кроме выключенных</span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="getCategoryProducts({show_available_products: (showAvailableProducts === 'all' && 'available') || 'all'})"
                  class="ma-0 pa-0"
                  color="black"
                  icon
                  plain
                  small
                  style="background: white;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    {{ (showAvailableProducts === 'available' && 'mdi-store') || 'mdi-store-remove' }}
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ (showAvailableProducts === 'all' && 'показать все, вместе с недоступными') || 'только доступные товары' }}
              </span>
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
                    :disabled="!selectedCategory"
                    :key="offerProducts.length"
                    @click="editOffer"
                    class="pa-0 px-1 counting-box"
                    tag="a"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <div
                      class="heading"
                      v-if="offerProducts"
                    >
                      {{ offerProducts.length || 0 }}
                    </div>
                  </div>
                </v-fab-transition>
              </div>
            </template>
            <div
              class="white rounded pa-0 ma-0"
              style="border: 3px solid #B9D2EA !important;"
            >
              <offer-products
                :isNotNewStatus="isNotNewStatus"
                :manufacturerNames="manufacturerNames"
                :offer="offer"
                :offerProducts="offerProducts"
                style="width: 60vw; max-width: 1600px; overflow: hidden;"
                class="white mt-1 mx-1"
              ></offer-products>
            </div>
          </v-menu>
        </div>
      </v-col>
      <v-col 
        class="d-flex justify-space-between align-center category-goods__search"
        style="width: calc(100% - 580px); flex-basis: unset !important; -webkit-box-flex: unset !important;flex-grow: unset !important;"
        >
          <div class="ml-2">
            <h3 class="font-16"><b>{{ $t('products') }}</b> ({{ productCount }})</h3>
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
          </div>
          <div
          class="d-flex justify-space-between align-center"
          style="max-width: 500px; width: 100%;"
          >
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
            ></v-text-field>
            <v-btn
              @click="$eventHandle.$emit('search', search)"
              class="ml-1 mr-0 search-button primary category-goods__search-button"
              small
            >
              {{ $t('search') }}
            </v-btn>
          </div>
      </v-col>
      <v-col
        class="d-flex justify-space-between align-center px-1"
        style="width: 224px; flex-basis: unset !important; -webkit-box-flex: unset !important;flex-grow: unset !important;"
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
                :disabled="!selectedCategory"
                @click="createProduct"
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
          :activeCategories="activeCategories"
          :activeCategoryId="activeCategoryId"
          :categoryTree="categoryTree"
          :mode="mode"
          @attach-product="$store.dispatch('attachProducts', $event)"
          @input="getSelectedCategory"
          @move="$store.dispatch('moveCategory', $event)"
        ></category-tree>
      </v-col>
      <v-col
        class="ml-1 pa-1 rounded white category-goods__content"
      >
        <category-products
          :category_id="activeCategoryId"
          :key="activeCategoryId"
          :productData="categoryProducts"
          :searchText="search"
          @removeGroup="removeGroup"
          @selected="selectedProducts = $event"
          v-if="mode === 'products'"
        />
        <group-products
          :category_id="activeCategoryId"
          :groupData="categoryGroups"
          :searchText="search"
          @fetch="getCategoryProducts"
          @remove="removeGroup"
          v-if="mode === 'groupProducts'"
        />
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
                <v-col class="d-flex" cols="12">
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

    <v-row
      class="mt-4"
      no-gutters
    ></v-row>

      <!-- product card modal -->
    <v-dialog
      max-width="1200px"
      :width="['product'].find(f => f === showForm) ? '100%' : ['category', 'property', 'specification'].some(f => f === showForm) ? 450 : null"
      :style="['product'].find(f => f === showForm) ? 'height: 100%;' : 'height: 65vh;'"
      persistent
      scrollable
      v-if="dialog"
      v-model="dialog"
      height="90vh"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA"
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
                @click="closeModal"
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
                @click="showForm === 'specification' ? saveSpecification() : showForm === 'property' ? saveProperty() : saveForm()"
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
          style="overflow: hidden;"
        >
          <category-form
            :category="category"
            :categorySelect="categorySelect"
            class="pa-3 white"
            v-if="showForm === 'category'"
          />
          <category-product-form
            :category="selectedCategory"
            :categorySelect="categorySelect"
            :product="product"
            v-if="showForm === 'product'"
          />
          <div v-if="showForm === 'specification'" style="text-align: right">
            <v-text-field
              label="Введите имя"
              v-model="selectedSpecification.name"
            ></v-text-field>
          </div>
          <div v-if="showForm === 'property'" style="text-align: right">
            <v-text-field
              label="Введите имя"
              v-model="selectedProperty.name"
            ></v-text-field>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      persistent
      scrollable
      v-if="dialogMain"
      v-model="dialogMain"
      width="85vw"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;"
      >
        <div
          color="transparent"
          dark
          class="align-center d-flex flex-nowrap"
          style="position: absolute; top: -45px; right: -65px; width: calc(85vw + 60px);"
          dir="rtl"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="$refs.offerForm.closeModal()"
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
                :disabled="!offerProducts.length"
                :loading="requestStatus === 'loading'"
                @click="$refs.offerForm.saveOffer()"
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
                @click="$refs.offerForm.dialogForTemplate = true"
                class="dialog-action-button"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>
                  mdi-plus-box-multiple-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('addOfferTemplates') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="$refs.offerForm.showTemplateOffers = true"
                class="dialog-action-button"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>
                  mdi-text-box-multiple-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('offerTemplates') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                :disabled="offer.status !== 'new'"
                @click="$refs.offerForm.offerCleaning()"
                class="dialog-action-button"
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
            <span>{{ $t('form.clear') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                :disabled="!offer.id"
                :href="offer.attach_file"
                class="dialog-action-button"
                color="black"
                fab
                icon
                tag="a"
                target="_blank"
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>
                  mdi-file-pdf-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('showPdf') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                :disabled="offer.status !== 'paid'"
                :loading="requestStatus === 'loading'"
                @click="$refs.offerForm.buildSale()"
                class="dialog-action-button"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>
                  mdi-briefcase-variant-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buildSale') }}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <div
            class="ma-0 ml-3 pa-1 rounded white"
          >
            <v-text-field
              :readonly="offer.status !== 'new'"
              :label="$t('offerName')"
              class="dir-rtl dense-input"
              dense
              dir="rtl"
              height="25px"
              hide-details
              style="width: 300px"
              v-model="offer.name"
            />
          </div>
          <div
            class="ma-0 ml-3 pa-1 rounded white"
            dir="ltr"
          >
            <v-select
              :items="[
                {name: 'Новый', value:'new'},
                {name: 'Завершен', value:'completed'},
                {name: 'Оплачен', value:'paid'},
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
              v-if="offer"
              v-model="offer.status"
            />
          </div>
          <div
            class="ma-0 pa-1 rounded white"
          >
            <v-text-field
              :label="$t('offerNumber')"
              :value="offer.offer_number"
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
          >
            <div class="py-3">{{ $t('offer') }}</div>
          </v-btn>
        </div>
        <v-card-text
          :style="'height: 85vh;'"
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA;"
        >
          <offer-form
            :offer="offer"
            ref="offerForm"
          ></offer-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {debounce} from 'vue-debounce'

const dFn = debounce(fn => fn(), '400ms')

export default {
  components: {
    CategoryForm: () => import("../components/category/CategoryForm"),
    CategoryProductForm: () => import("../components/category/CategoryProductForm"),
    CategoryProducts: () => import("../components/category/CategoryProducts"),
    CategoryTree: () => import("../components/category/CategoryTree"),
    GroupProducts: () => import("../components/category/GroupProducts"),
    OfferForm: () => import("../components/offers/OfferForm"),
    OfferProducts: () => import("../components/category/OfferProducts"),
    UploadFile: () => import("../components/core/UploadFile"),
  },
  data: () => ({
    cartOfferId: null,
    innerHeight: 900,
    isMobile: false,
    mode: 'products',
    page: 1,
    perPage: 0,
    propertyIds: {},
    search: '',
    searchText: '',
    selectedCategories: [],
    selectedCategory: null,
    selectedProducts: [],
    selectedProperty: null,
    selectedSpecification: null,
    showAvailableProducts: 'all',
    showCategoryDialog: false,
    showCategoryFilters: false,
    showDeletedProducts: 'active',
    showForm: '',
    specificationIds: [],
    vendorIds: [],
  }),

  async created() {
    let cartOfferId = await this.$store.dispatch('getSettings', {settingsName: 'cartOfferId'})
    this.cartOfferId = cartOfferId[0] && cartOfferId[0].value || null
    let res = await this.$store.dispatch('getOffer', this.cartOfferId ? {id: this.cartOfferId} : null)
    if (Object.keys(res).length == 0) {
      await this.$store.dispatch('saveSetting', {
        cartOfferId: null,
      })
      await this.$store.dispatch('getOffer', null)
    }
    if (this.offer.products) {
      this.$store.commit('setOfferProducts', this.offer.products.map(product => {
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

    await this.$store.dispatch('getVendors', {all: true})

    if (!!this.activeCategoryId) {
      this.selectedCategory = {id: this.activeCategoryId}
      this.getCategoryProducts()
    } else {
      let settings = await this.$store.dispatch('getSettings', {settingsName: 'activeCategories'})
      let json = settings && settings.length && settings.find(s => s.name == 'activeCategories')
      let settingsValue = json && JSON.parse(json.value)
      let activeCategoryId = settingsValue.activeCategoryId
      let activeCategories = settingsValue.activeCategories
      if (activeCategoryId && activeCategories) {
        await this.getSelectedCategory({
          category: {id: activeCategoryId},
          selectedCategories: activeCategories,
        })
      }
    }
    await this.$store.dispatch('getCategoryTree')
    this.setEventProduct();
    this.setEventCategory();
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersCategoryProducts'})
  },

  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, {passive: true})
    for (let [index, filter] of this.filters.entries()) {
      this.propertyIds[index] = []
    }
  },

  async beforeDestroy() {
    if (this.activeCategoryId && this.activeCategories.length) {
      await this.$store.dispatch('saveSetting', {
        activeCategories: JSON.stringify({
          activeCategoryId: this.activeCategoryId,
          activeCategories: this.activeCategories,
        })
      })
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true})
    }
  },

  computed: {
    ...mapGetters([
      'activeCategories',
      'activeCategoryId',
      'category',
      'categoryGroups',
      'categoryProducts',
      'categorySelect',
      'categoryTree',
      'dialog',
      'dialogMain',
      'filters',
      'manufacturerNames',
      'offer',
      'offerProducts',
      'product',
      'productCount',
      'requestStatus',
      'showAllProductsCategory',
      'vendors',
    ]),

    openedCategories() {
      let names = this.activeCategories.map(item => {
        return {
          text: item.name[this.$i18n.locale],
        }
      })
      return names.reverse()
    },

    distinctVendorIds () {
      return [...new Set(this.categoryProducts && this.categoryProducts.data.map(cp => cp.vendor_id) || [])]
    },

    isNotNewStatus () {
      return this.offer && this.offer.status !== 'new'
    },
  },

  destroyed() {
    this.$store.commit('setDialog', false)
    this.$store.commit('setDialogMain', false)
    this.$store.commit('setCategoryProducts', null)
    this.$store.commit('setCategories', null)

    this.$eventHandle.$off('change-params')
    this.$eventHandle.$off('create-category')
    this.$eventHandle.$off('delete-category')
    this.$eventHandle.$off('delete-product');
    this.$eventHandle.$off('edit-category')
    this.$eventHandle.$off('edit-product');
    this.$eventHandle.$off('reset-tree')
    this.$eventHandle.$off('save-category')
    this.$eventHandle.$off('save-product');
    this.$eventHandle.$off('search')
    this.$eventHandle.$off('delete-selected-products')
    this.$eventHandle.$off('restore-selected-products')
  },

  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 600
      this.innerHeight = window.innerHeight - 100
    },

    setEventCategory() {
      this.$eventHandle.$on('create-category', (category) => {
        const parent_id = category ? category.id : null
        this.$store.dispatch('getCategory', {id: null, parent_id}).then(() => {
          this.$store.commit('setDialog', true)
          this.showForm = 'category'
        })
      })

      this.$eventHandle.$on('edit-category', (category) => {
        this.$store.dispatch('getCategory', category).then(() => {
          this.$store.commit('setDialog', true)
          this.showForm = 'category'
        })
      })

      this.$eventHandle.$on('delete-category', (category) => {
        let productAllow = !(!!category.children.length || !!category.products_count.productCount)
        this.showSwal(productAllow).then((res) => {
          if (productAllow) {
            if (res) {
              this.$store.dispatch('deleteCategory', category.id)
                .then(() => {
                  this.$store.commit('setActiveCategories', this.activeCategories.filter(c => c.id !== category.id))
                  this.selectedCategory = null
                  this.$store.commit('setCategory', null)
                  this.$eventHandle.$emit('delete-node', category)
                })
            }
          }
        })
      })

      this.$eventHandle.$on('save-category', (category) => {
        this.$store.dispatch('saveCategory', category).then(resp => {
          if (!!category.id) {
            this.$eventHandle.$emit('change-node', resp)
            let activeCategories = this.activeCategories
            Object.assign(activeCategories.find(c => category.id === c.id), resp)
            this.$store.commit('setActiveCategories', activeCategories)
          } else {
            this.$eventHandle.$emit('add-node', resp)
          }
          this.$store.dispatch('resetCategoryCache')
        })
      })

      this.$eventHandle.$on('reset-tree', () => {
        this.$store.dispatch('resetCategoryCache')
      });
    },

    createProduct() {
      this.$store.dispatch('getNewProduct', {category_id: this.selectedCategory.id}).then(() => {
        this.$store.commit('setDialog', true)
        this.showForm = 'product'
      })
    },

    setEventProduct() {
      this.$eventHandle.$on('edit-product', (product) => {
        this.$store.dispatch('getEditProduct', product).then(() => {
          this.$store.commit('setDialog', true)
          this.showForm = 'product'
        })
      });

      this.$eventHandle.$on('save-product', (product) => {
        this.$store.dispatch('saveProduct', product).then((response) => {
          let products = this.categoryProducts
          let newProduct = response.data;
          newProduct.manufacturer = !!newProduct.manufacturer ? newProduct.manufacturer.name : ''
          if (products) {
            if (!!product.id) {
              Object.assign(products.data.find(p => product.id === p.id), newProduct)
            } else {
              products.data.unshift(newProduct)
            }
          }
          this.$store.commit('setCategoryProducts', products)
          this.$store.dispatch('resetCategoryCache')
        })
      });

      this.$eventHandle.$on('delete-product', (product) => {
        this.showSwal().then((res) => {
          if (res) {
            this.$store.dispatch('deleteProduct', product.id)
              .then(() => {
                let products = this.categoryProducts
                products.data = products.data.filter(p => p.id !== product.id)
                this.$store.commit('setCategoryProducts', products)
                this.$store.dispatch('resetCategoryCache')
              })
          }
        })
      });

      this.$eventHandle.$on('change-params', (params) => {
        const { page, itemsPerPage } = params
        this.page = page
        this.perPage = itemsPerPage
        this.getCategoryProducts(params)
      })

      this.$eventHandle.$on('search', (search) => {
        this.searchText = search
        this.getCategoryProducts({search: search, initPage: 1})
      })

      this.$eventHandle.$on('delete-selected-products', (productsIds) => {
        this.showSwal().then((res) => {
          if (res) {
            this.$store.dispatch('deleteSelectedProducts', productsIds)
              .then(async () => {
                await this.getCategoryProducts()
                this.$store.dispatch('resetCategoryCache')
              })
          }
        })
      })

      this.$eventHandle.$on('restore-selected-products', (productsIds) => {
        this.showSwal().then((res) => {
          if (res) {
            this.$store.dispatch('restoreSelectedProducts', productsIds)
              .then(async () => {
                await this.getCategoryProducts()
                this.$store.dispatch('resetCategoryCache')
              })
          }
        })
      })
    },

    showSwal(allow = true) {
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

    async getSelectedCategory(data) {
      this.search = null
      this.specificationIds = []
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      this.vendorIds = []
      this.selectedCategory = data.category
      this.selectedCategories = data.selectedCategories
      this.$store.commit('setActiveCategoryId', this.selectedCategory.id)
      this.$store.commit('setActiveCategories', this.selectedCategories)
      this.page = 1
      dFn(this.getCategoryProducts);
      await this.getCategoryFilters()
    },

    async getCategoryProducts(params = {}) {
      if (!!params.hasOwnProperty('show_all_products_in_category')) {
        this.$store.commit('setShowAllProductsCategory', params.show_all_products_in_category)
      }
      if (this.selectedCategory) {
        params.category_id = this.selectedCategory.id
      }
      params.show_all_products_in_category = this.showAllProductsCategory
      params.perPage = this.perPage
      params.page = this.page
      params.pageName = 'category'
      params.mode = this.mode
      if (this.specificationIds.length) {
        params.specificationIds = this.specificationIds.join()
      }
      if (Object.values(this.propertyIds).find(v => v.length)) {
        params.propertyIds = JSON.stringify(this.propertyIds)
      }
      if (this.vendorIds.length) {
        params.vendorIds = this.vendorIds.join()
      }
      if (params.search) {
        delete params.category_id
      }
      if (params.initPage) {
        params.page = 1
      }
      let result = await this.$store.dispatch('getCategoryProducts', params)
      if (result.data && result.data.meta) {
        this.showDeletedProducts = result.data.meta.showDeletedProducts
        this.showAvailableProducts = result.data.meta.showAvailableProducts
      }
    },

    closeModal() {
      this.$store.commit('setDialog', false)
      this.showForm = ''
    },

    changeMode() {
      this.specificationIds = []
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      if (this.mode === 'products') {
        this.mode = 'groupProducts'
      } else {
        this.mode = 'products'
      }
      this.getCategoryProducts()
    },
    removeGroup(params) {
      this.showSwal().then((res) => {
        if (res) {
          this.$store.dispatch('deleteGroupProduct', params).then(() => {
            this.getCategoryProducts()
            this.$store.dispatch('resetCategoryCache')
          })
        }
      })
    },

    async getCategoryFilters() {
      await this.$store.dispatch('getVendors', {
        categoryId: this.activeCategoryId,
      })
      await this.$store.dispatch('getCategoryFilters', {
        category_id: this.activeCategoryId,
      })
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

    editSpecification(specification) {
      this.$store.commit('setDialog', true)
      this.showForm = 'specification'
      this.selectedSpecification = specification
    },

    editProperty(property) {
      this.$store.commit('setDialog', true)
      this.showForm = 'property'
      this.selectedProperty = property
    },

    saveSpecification() {
      this.$store.dispatch('saveSpecification', {
        id: this.selectedSpecification.id,
        specificationName: this.selectedSpecification.name,
        category_id: this.selectedCategory.id,
        allCategory: this.showAllProductsCategory
      }).then(() => {
        this.closeModal()
        this.$store.dispatch('getFilters', {
          category_id: this.selectedCategory.id
        })
      })
    },

    saveProperty() {
      this.$store.dispatch('saveProperty', {
        id: this.selectedProperty.id,
        name: this.selectedProperty.name,
        category_id: this.selectedCategory.id,
        allCategory: this.showAllProductsCategory
      }).then(() => {
        this.closeModal()
        this.$store.dispatch('getFilters', {
          category_id: this.selectedCategory.id
        })
      })
    },
    clearSearch () {
      this.search = null
      this.$eventHandle.$emit('change-params', {page: 1})
    },
    saveCategory () {
      this.setLocaleData('ru')
      this.$eventHandle.$emit('save-category', this.category)
    },
    setLocaleData (loc) {
      for (let locale of this.$locales) {
        this.category.name[locale] = !!this.category.name[locale] ? this.category.name[locale] : this.category.name[loc]
      }
    },
    saveForm () {
      if (this.showForm === 'category') {
        this.saveCategory()
      } else if (this.showForm === 'product') {
        this.$eventHandle.$emit('save-product-from-categories')
      }
    },
    editOffer () {
      this.$store.commit('setDialogMain', true)
    },
  },
  watch: {
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
.product-card {
  &__modal {
    max-height: auto !important;
  }
}
.list-wrapper {
  position: absolute;
  right: 100px;
  top: 0px;
  background: white;
  z-index: 3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.list {
  background: white;
  padding: 0px 5px;
  max-height: calc(100vh - 55px);
  overflow-y: scroll;
}
.tr:hover {
  background: #f5f5f5;
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.v-data-table table th {
  background: #DFDFDF !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-button:hover {
  background-color: #1565C0 !important;
}
</style>
