<template>
  <div class="pa-0">
    <v-row
      class="rounded white category-products__tooltip"
      no-gutters
      style="max-height: 41px; height: 41px;"
    >
      <v-col
        class="align-center d-flex justify-space-between category-products__tooltip-col pl-1 pr-2"
        cols="2"
      >
        <div
          :style="isNotNewStatus ? 'pointer-events: none;' : ''"
          class="d-flex justify-space-between align-center flex-nowrap"
          style="width: 100%;"
        >
          <div class="d-flex align-center">
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="getCategoryProducts({show_all_products_in_purchase: showAllProductsPurchase === 'category' ? 'all' : 'category'})"
                  class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  small
                  plain
                  style="background: white;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    {{ showAllProductsPurchase === 'category' ? 'mdi-eye-off' : 'mdi-eye' }}
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ showAllProductsPurchase === 'category' ? 'все товары' : 'товары категории' }}
              </span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="$eventHandle.$emit('close-tree')"
                  class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  plain
                  small
                  style="background: white;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    mdi-folder-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>закрыть категории</span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="$eventHandle.$emit('open-tree')"
                  class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  plain
                  small
                  style="background: white;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    mdi-folder-open-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>открыть категории</span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="getCategoryProducts({show_deleted_products: (showDeletedProducts === 'active' && 'all') || (showDeletedProducts === 'all' && 'trashed') || 'active'})"
                  class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  small
                  plain
                  style="background: white;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    {{ (showDeletedProducts === 'active' && 'mdi-circle-outline') || (showDeletedProducts === 'all' && 'mdi-adjust') || 'mdi-circle-off-outline' }}
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ (showDeletedProducts === 'all' && 'показывать все') || (showDeletedProducts === 'trashed' && 'только выключенные') || 'кроме выключенных' }}
              </span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="getCategoryProducts({show_available_products: (showAvailableProducts === 'all' && 'available') || 'all'})"
                  class="pa-0 category-products__tooltip-buttons"
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
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-fab-transition
                  :leave-absolute="true"
                  :hide-on-leave="false"
                  origin="center center 0"
                >
                  <div
                    :key="purchaseProducts.length"
                    class="counting-box category-producte__counting-box d-flex justify-center align-center pa-0"
                  >
                    <div class="heading font-8">
                      {{ purchaseProducts.length || '0' }}
                    </div>
                  </div>
                </v-fab-transition>
              </div>
            </template>
            <span class="font-8">{{ $t('products_count') }}</span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col
        class="align-center d-flex justify-space-between pl-0 category-products__tooltip-col"
        cols="4"
      >
        <div
          class="align-center d-flex flex-nowrap"
          style="width: 100%;"
        >
          <div class="font-12">
            ₪ {{ (form.real_purchase_cost || 0) | toFix }}
          </div>
          <v-menu
            :close-on-content-click="false"
            color="white"
            class="category-products__tooltip-menu"
            offset-x
            open-delay="500"
            open-on-hover
            style="background-color: white;"
            top
          >
            <template #activator="{ on, attrs }">
              <v-btn
                :color="form.description == null ? 'black' : 'primary'"
                @click="addNoteDialog = true"
                class="mx-1"
                icon
                plain
                small
                style=" background: transparent;"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-playlist-edit
                </v-icon>
              </v-btn>
            </template>
            <v-list
              class="px-2 rounded"
            >
              <v-textarea
                readonly
                bottom
                dir="rtl"
                hide-details
                rows="1"
                style="min-width: 350px; width: 30vw;"
                v-model="form.description"
              ></v-textarea>
            </v-list>
          </v-menu>
        </div>
      </v-col>
      <v-col
      class="align-center d-flex justify-space-between px-1 category-products__tooltip-col"
      cols="4"
      >
        <div
          class="align-center d-flex flex-nowrap"
          style="width: 100%;"
        >
          <v-spacer></v-spacer>
          <v-text-field
            :disabled="isNotNewStatus"
            @click:prepend-inner="clearSearch"
            @keyup.enter="() => { page = 1; getCategoryProducts({search}); }"
            class="text-body-2 pa-0 category-products__tooltip-input"
            dense
            dir="rtl"
            height="18px"
            hide-details
            outlined
            prepend-inner-icon="mdi-close"
            single-line
            v-model="search"
          ></v-text-field>
          <v-btn
            :disabled="isNotNewStatus"
            @click="() => { page = 1; getCategoryProducts({search}); }"
            class="ml-1 mr-0 primary category-products__tooltip-search"
            small
          >
            {{ $t('search') }}
          </v-btn>
        </div>
      </v-col>
      <v-col
        class="align-center d-flex justify-space-between px-1"
        cols="2"
      >
        <v-btn
          :disabled="isNotNewStatus"
          @click="resetFilter"
          class=" category-products__tooltip-reset"
          outlined
          small
        >
          {{ $t('reset') }}
        </v-btn>
        <span class="mx-5" v-show="requestStatus === 'loading'">
          <v-progress-circular indeterminate size="25"></v-progress-circular>
        </span>
        <v-spacer></v-spacer>
        <v-tooltip top open-delay="400">
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="!selectedCategory"
              @click="() => {}"
              class="pa-0 category-products__tooltip-buttons"
              color="black"
              icon
              plain
              small
              style="background: white;"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row
      :style="`height: calc(${(45 - dragPosition)}vh - 22px)`"
      class="mt-1 flex-nowrap"
      no-gutters
      v-show="!serialNumberActiveProductId"
    >
      <v-col
        class="pa-1 rounded white category-form__categories"
      >
        <category-tree
          :categoryTree="categoryTree"
          :activeCategories="purchaseActiveCategories"
          :activeCategoryId="purchaseActiveCategoryId"
          :mode="'products'"
          class="category-form__categories-wrapper font-12"
          @input="getSelectedCategory"
          v-if="!isNotNewStatus"
          style="overflow-y: scroll; overflow-x: hidden; height: 100%;"
        ></category-tree>
      </v-col>
      <v-col
        class="ml-1 pa-1 rounded white category-form__content"
        style="height: 100%;"
      >
        <purchase-category-products
          :dateNumber="dateNumber"
          :productData="categoryProducts"
          :searchText="searchText"
          :warranties="warranties"
          style="overflow: hidden; height: 100%;"
          v-if="showCatalog"
        />
      </v-col>
      <v-col
        class="ml-1 pa-1 rounded white category-form__properties"
      >
        <v-expansion-panels
          :disabled="requestStatus === 'loading' || isNotNewStatus"
          :readonly="isNotNewStatus"
          :style="isNotNewStatus ? 'pointer-events: none;' : ''"
          accordion
          dense
          style="max-height: 100%; overflow-y: auto; overflow-x: hidden;"
        >
          <v-expansion-panel
            class="rounded filters-expansion-panel"
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
                    class="ma-0 pa-2 rounded font-10"
                    cols="12"
                  >
                    {{ $t('vendors') }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="ma-0 pa-0 rounded-b text--secondary font-10"
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
                          class="ma-0 text-truncate font-10"
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
              class="pa-0 ma-0 font-10"
              color="#EEEEEE"
            >
              <v-checkbox
                :key="vendor.id"
                :label="vendor.name"
                :value="vendor.id"
                @change="getCategoryProducts({})"
                class="ma-0 text-truncate font-10"
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
            class="mb-2 rounded filters-expansion-panel font-10"
            dense
            dir="rtl"
            v-for="(filter, index) in filters"
          >
            <v-expansion-panel-header
              class="pa-0 ma-0 text-right font-10"
              color="#CCE3FF"
              hide-actions
            >
              <template v-slot:default="{ open }">
                <v-row no-gutters class="ma-0 pa-0 rounded font-10">
                  <v-col
                    class="ma-0 pa-2 rounded font-10"
                    cols="12"
                  >
                    {{ filter.name }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="ma-0 pa-0 rounded-b text--secondary font-10"
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
                          class="ma-0 text-truncate font-10"
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
                class="d-flex ma-0 pa-0 font-10"
                no-gutters
                v-for="property in filter.properties"
              >
                <v-col cols="12">
                  <v-checkbox
                    :label="property.name"
                    :value="property.id"
                    @change="getCategoryProducts({})"
                    class="ma-0 text-truncate font-10"
                    color="primary"
                    dense
                    hide-details
                    v-model="propertyIds[index]"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row
      :style="`height: calc(${(42 - dragPosition)}vh - 60px); overflow: hidden;`"
      class="mt-1 flex-nowrap"
      no-gutters
      v-if="!!serialNumberActiveProductId"
    >
      <v-col
        class="pa-1 rounded white"
        cols="12"
        style="height: 100%;"
      >
        <v-row
          class="flex-nowrap"
        >
          <v-col
            class="d-flex justify-center"
            cols="4"
            style="height: 100%;"
          >
            <v-img
              :height="`calc(${(40 - dragPosition)}vh - 60px)`"
              :src="serialNumberActiveProduct.images[0] && serialNumberActiveProduct.images[0].src"
              contain
            ></v-img>
          </v-col>
          <v-col class="pb-0">
            <div class="purchase-qr-popup">
              <v-row class="ma-0">
                <v-col
                  class="pa-2 rounded purchase-qr-popup-title"
                  style="background: #CCE3FF;"
                >
                  <div class="text-h4">
                    {{ $t('name') }}
                  </div>
                  <div
                    :class="{'grey--text':  $refs.serialNumberInput && $refs.serialNumberInput.isFocused}"
                    class="purchase-qr-popup__title"
                    auto-grow
                    dir="rtl"
                    hide-details
                    v-html="serialNumberActiveProduct.name[$i18n.locale]"
                    v-if="typeof serialNumberActiveProduct.name === 'object'"
                  ></div>
                  <div
                    :class="{'grey--text':  $refs.serialNumberInput && $refs.serialNumberInput.isFocused}"
                    class="purchase-qr-popup__title"
                    :label="$t('form.name')"
                    auto-grow
                    dir="rtl"
                    hide-details
                    v-else
                    v-html="serialNumberActiveProduct.name"
                  ></div>
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-1">
                <v-col
                  :height="`${Math.min(Math.max(2.5-dragPosition/5, 1), 6)}rem;`"
                  class="pa-2 rounded"
                  style="background: #EEEEEE; height: 100%;"
                >
                  <v-text-field
                    :height="`${Math.min(Math.max(2.5-dragPosition/5, 1), 6)}rem;`"
                    :label="$t('serial_number')"
                    :readonly="isNotNewStatus"
                    :style="`font-size: ${Math.min(Math.max(2.5-dragPosition/5, 1), 6)}rem; line-height: ${Math.min(Math.max(2.5-dragPosition/5, 1), 6)}rem;`"
                    @focus="$event.target.select()"
                    @keyup.enter="changeSerialNumberNo() && $event.target.select()"
                    autofocus
                    class="purchase-qr-popup__sn responsive-input"
                    dense
                    dir="rtl"
                    hide-details
                    ref="serialNumberInput"
                    v-model="serialNumberActiveProduct.serial_numbers[serialNumberNo].serial_number"
                  >
                    <template #append>
                      <v-btn
                        @click="serialNumberActiveProduct.serial_numbers[serialNumberNo].serial_number = null"
                        color="primary"
                        icon
                        plain
                        small
                        style="background: transparent;"
                      >
                        <v-icon :style="`font-size: 25px;`">mdi-close</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row
                class="ma-0 mt-1"
                justify="space-between"
              >
                <v-col
                  class="pa-0 purchase-qr-popup__close"
                  cols="auto"
                >
                  <v-tooltip
                    open-delay="400"
                    right
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="closeScanSerialNumber()"
                        :color="$refs.serialNumberInput.isFocused ? 'primary' : 'black'"
                        icon
                        plain
                        style="background: transparent;"
                        v-bind="attrs"
                        v-on="on"
                        x-large
                      >
                        <v-icon x-large>mdi-select-all</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('closeScanSerialNumber') }}</span>
                  </v-tooltip>
                </v-col>
                <v-col
                  class="pa-0 rounded"
                  cols="auto"
                >
                  <v-btn
                    @click="changeSerialNumberNo()"
                    class="mx-0 text-h1"
                    plain
                    ref="serialNumberButton"
                    style="background: transparent;"
                    x-large
                  >
                    <div class="d-flex primary--text">
                      <div style="color: #FFC400; font-weight: 700;">{{ serialNumberNo + 1 }}</div>
                      <div style="font-weight: 700;">/</div>
                      <div style="font-weight: 700;">{{ serialNumberActiveProduct.serial_numbers.length }}</div>
                    </div>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      :style="`height: calc(${(42 + dragPosition)}vh - 22px); max-height: calc(85vh - 45px);`"
      class="mt-1 flex-nowrap"
      no-gutters
    > 
      <v-col
        class="pa-1 rounded white category-products__fields"
      >
        <div style="height: 100%; overflow: hidden;">
          <v-row
            class="rounded pa-1"
            style="background: #B9D2EA;"
            no-gutters
          >
            <v-col
              class="px-1 rounded white category-products__fields-textField"
              style="width: calc(50% - 2.25px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('purchaseDate')"
                class="category-products__offer-date offer-date pb-1"
                height="25px"
                hide-details
                plain
                type="date"
                v-model="form.date"
                style="width: 100%;"
              ></v-text-field>
            </v-col>
            <v-col
              class="px-1 rounded white ml-1 category-products__fields-textField"
              style="width: calc(50% - 2.25px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('expensesCost')"
                class="offer-date pb-1"
                height="25px"
                hide-details
                type="number"
                v-model="form.expenses_cost"
              ></v-text-field>
            </v-col>
            <v-col
              class="px-1 rounded white category-products__fields-textField mt-1"
              style="width: calc(50% - 2.25px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('purchase_cost')"
                :value="(form.purchase_cost || 0) | toFix"
                class="category-products__offer-date offer-date pb-1"
                height="25px"
                hide-details
                readonly
                type="number"
              ></v-text-field>
            </v-col>
            <v-col
              class="px-1 rounded white ml-1 category-products__fields-textField mt-1"
              style="width: calc(50% - 2.25px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('differenceCost')"
                :value="((form.real_purchase_cost - form.purchase_cost) || 0) | toFix"
                class="offer-date pb-1"
                height="25px"
                hide-details
                readonly
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            class="rounded mt-2 pa-1"
            style="background: #B9D2EA;"
            no-gutters
          >
            <v-col
              class="align-center d-flex justify-center rounded white  category-products__fields-textField"
              style="width: 32px !important; flex-shrink: 0;"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <div
                      :key="purchaseProducts.length"
                      class="counting-box category-producte__counting-box pa-0 px-1"
                    >
                      <div class="heading font-8">
                        {{ purchaseProducts.length || '0' }}
                      </div>
                    </div>
                  </div>
                </template>
                <span>{{ $t('products_count') }}</span>
              </v-tooltip>
            </v-col>
            <v-col
              class="align-center d-flex justify-center rounded white ml-1  category-products__fields-textField"
              style="width: 32px !important; flex-shrink: 0;"
            >
              <v-menu
                :close-on-content-click="false"
                color="white"
                offset-x
                open-delay="500"
                open-on-hover
                style="background-color: white;"
                top
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    :color="form.description == null ? 'black' : 'primary'"
                    @click="addNoteDialog = true"
                    class="mx-1"
                    dir="rtl"
                    icon
                    plain
                    small
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>
                      mdi-playlist-edit
                    </v-icon>
                  </v-btn>
                </template>
                <v-list
                  class="px-2 rounded"
                >
                  <v-textarea
                    readonly
                    bottom
                    dir="rtl"
                    hide-details
                    rows="1"
                    style="min-width: 350px; width: 30vw;"
                    v-model="form.description"
                  ></v-textarea>
                </v-list>
              </v-menu>
            </v-col>
            <v-col 
            class="px-1 rounded white pb-1 ml-1 
            category-products__fields-textField"
            style="width: calc(100% - 73px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('amount')"
                :value="(form.real_purchase_cost || 0) | toFix"
                height="25px"
                hide-details
                prefix="₪"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            class="rounded mt-2 mb-4 pa-1 category-products__file-upload"
            no-gutters
            style="background: #B9D2EA; position: relative;"
          >
            <v-col
              class="align-center rounded white"
            >
              <div v-if="purchaseProducts.length">
                <VueFullScreenFileDrop @drop='onDrop'/>
                <v-row class="ma-0 pa-0 text-center">
                  <v-col 
                  class="pa-0 ma-0" 
                  cols="5"
                  >
                    <div
                      class="pa-1 rounded grey--text category-products__file-upload-type"
                      style="background: #CCE3FF; cursor: pointer;"
                    >Документы</div>
                  </v-col>
                  <v-col 
                  cols="3"
                  class="pa-0 ma-0"
                  >
                    <div
                      :class="{ 'primary--text': offerFilesGroup === 2 }"
                      :style="offerFilesGroup === 2 && 'background: #CCE3FF;'"
                      @click="offerFilesGroup = 2"
                      class="pa-1 rounded grey--text category-products__file-upload-type"
                      style="background: #EEEEEE; cursor: pointer;"
                    >Другое</div>
                  </v-col>
                  <v-col 
                  class="pa-0 ma-0" 
                  cols="4"
                  >
                    <input ref="fileUpload" id="purchase-doc" type="file" style="display: none;" multiple @change="addDocs">
                    <div 
                    class="d-flex align-center" 
                    style="margin-top: 2.5px; height: 19px !important;"
                    >
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            :disabled="!selectedCategory"
                            @click="$refs.fileUpload.click()"
                            class="pa-0 category-products__file-upload-button"
                            color="black"
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            tile
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-upload</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('downloadFile') }}</span>
                      </v-tooltip>
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            @click="allDownload"
                            class="pa-0 category-products__file-upload-button"
                            color="black"
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-cloud-download</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('downloadAllFiles') }}</span>
                      </v-tooltip>
                    </div>
                  </v-col>
                </v-row>
                <v-list 
                class="category-products__file-upload-list"
                dense
                >
                  <v-list-item
                    class="pl-2 pr-0"
                    v-for="file of purchase.purchaseFiles"
                  >
                    <v-list-item-content 
                    class="category-products__file-upload-item"
                    >
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-list-item-title
                            class="category-products__file-upload-title"
                            v-bind="attrs"
                            v-on="on"
                          >{{ file.fileName }}</v-list-item-title>
                        </template>
                        <span>{{ file.fileName }}</span>
                      </v-tooltip>
                    </v-list-item-content>
                    <v-list-item-icon
                    class="category-products__file-upload-item-buttons"
                    >
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            @click="forceDownload(file.src, file.fileName)"
                            class="pa-0 category-products__file-upload-item-btn"
                            color="black"
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('downloadFile') }}</span>
                      </v-tooltip>
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            :href="file.src"
                            class="pa-0 category-products__file-upload-item-btn"
                            color="black"
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            tag="a"
                            target="_blank"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('showFile') }}</span>
                      </v-tooltip>
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            @click="removePurchaseFile(file)"
                            class="pa-0 category-products__file-upload-item-btn"
                            color="black"
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-close-thick</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('removeFile') }}</span>
                      </v-tooltip>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-list-item
                    class="pl-2 pr-0"
                    v-for="file of files"
                  >
                    <v-list-item-content
                    class="category-products__file-upload-item"
                    >
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-list-item-title
                            class="category-products__file-upload-title"
                            v-bind="attrs"
                            v-on="on"
                          >{{ file.name }}</v-list-item-title>
                        </template>
                        <span>{{ file.name }}</span>
                      </v-tooltip>
                    </v-list-item-content>
                    <v-list-item-icon
                    class="category-products__file-upload-item-buttons"
                    >
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            class="pa-0 category-products__file-upload-item-btn"
                            color="black"
                            disabled
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('downloadFile') }}</span>
                      </v-tooltip>
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            class="pa-0 category-products__file-upload-item-btn"
                            color="black"
                            disabled
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('showFile') }}</span>
                      </v-tooltip>
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            @click="removeFile(file)"
                            class="pa-0 category-products__file-upload-item-btn"
                            color="black"
                            icon
                            plain
                            rounded
                            small
                            style="background: white;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-close-thick</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('removeFile') }}</span>
                      </v-tooltip>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col
        class="pa-1 ml-1 ma-0 rounded white"
        style="height: 100%; overflow: hidden;"
      >
        <purchase-products
          :dateNumber="dateNumber"
          :isNotNewStatus="isNotNewStatus"
          :manufacturerNames="manufacturerNames"
          :purchaseDate="form.date"
          :purchaseProducts="purchaseProducts"
          :warranties="warranties"
          style="overflow: hidden; height: 100%;"
        />
      </v-col>
    </v-row>

    <div
      @wheel.prevent="(event) => { dragPosition -= event.deltaY/20 }"
      style="position: absolute; top: 7vh; right: -60px; z-index: 4; height: 80vh;"
    >
      <v-slider
        class="drag-slider"
        color="white"
        max="42"
        min="-42"
        style="min-height: 80vh; height: 80vh;"
        thumb-size="80"
        v-model="dragPosition"
        vertical
      ></v-slider>
    </div>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-if="dialog"
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
            :category="product && product.root_category"
            :categorySelect="categorySelect"
            :product="product"
            ref="categoryProductForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="90vh"
      max-width="800px"
      persistent
      v-model="addNoteDialog"
      width="45vw"
    >
      <v-card
        class="rounded category-products__group-note"
      >
        <div
          color="transparent"
          dark
          class="align-center d-flex flex-nowrap"
          style="position: absolute; top: -45px; right: -59px; width: calc(45vw + 60px); max-width: 860px;"
          dir="rtl"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="addNoteDialog = false"
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
                @click="savePurchase"
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
          <v-btn
            class="black--text pa-4 my-0"
            color="#B9D2EA"
            small
          >
            <div class="py-3">{{ $t('note') }}</div>
          </v-btn>
        </div>
        <v-card-text>
          <v-container>
            <v-textarea
              dir="rtl"
              rows="1"
              v-model="purchase.description"
            ></v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import VueFullScreenFileDrop from '../../../helpers/vue-full-screen-file-drop'
import {debounce} from 'vue-debounce'
import PurchaseCategoryProducts from "./CategoryProducts";
import PurchaseProducts from "./PurchaseProducts";
import toFix from "../../../filters/toFix";
import {property} from 'lodash';
import CategoryTree from "../category/CategoryTree";
import paginationMixin from "@/mixins/paginations";
import handleFilesMixin from "@/mixins/handleFiles";

const dFn = debounce(fn => fn(), '400ms')

export default {
  name: "PurchaseForm",
  components: {
    CategoryProductForm: () => import("../../components/category/CategoryProductForm"),
    CategoryTree,
    PurchaseCategoryProducts,
    PurchaseProducts,
    VueFullScreenFileDrop,
  },

  props: ['item', 'purchase', 'storeProducts'],
  mixins: [paginationMixin, handleFilesMixin],
  data () {
    return {
      addNoteDialog: false,
      dateNumber: null,
      disabledStatus: false,
      dragPosition: 0,
      files: [],
      form: {
        manufacturer_id: null,
      },
      page: 1,
      perPage: 0,
      propertyIds: {},
      search: '',
      searchText: '',
      selectedCategories: [],
      selectedCategory: null,
      serialNumberNo: 0,
      showAvailableProducts: 'all',
      showDeletedProducts: 'active',
      specificationIds: [],
      vendorIds: [],
      warranties: [],
    }
  },

  property: {
    property
  },

  filters: {
    toFix,
  },

  computed: {
    ...mapGetters([
      'categoryProducts',
      'categorySelect',
      'categoryTree',
      'dialog',
      'filters',
      'manufacturerNames',
      'manufacturers',
      'product',
      'purchaseActiveCategories',
      'purchaseActiveCategoryId',
      'purchaseProducts',
      'requestStatus',
      'settings',
      'showAllProductsPurchase',
      'vendors',
    ]),

    isNotNewStatus() {
      return this.purchase.status !== 'new'
    },

    showCatalog() {
      return !!this.form.manufacturer_id
    },

    serialNumberActiveProduct () {
      return (this.purchaseProducts && this.purchaseProducts.find(pp => pp.id == this.serialNumberActiveProductId)) || null
    },

    serialNumberActiveProductId: {
      get: function () {
        return this.$store.getters.serialNumberActiveProductId
      },
      set: async function (newValue) {
        await this.$store.dispatch('changeSerialNumberActiveProductId', newValue)
      }
    },
  },

  async created() {
    this.$store.dispatch('changeSerialNumberActiveProductId', null)

    if (!!this.purchaseActiveCategoryId) {
      this.selectedCategory = {id: this.purchaseActiveCategoryId}
      this.getCategoryProducts();
    } else {
      let settings = await this.$store.dispatch('getSettings', {settingsName: 'purchaseActiveCategories'})
      let json = settings && settings.length && settings.find(s => s.name == 'purchaseActiveCategories')
      let settingsValue = json && JSON.parse(json.value)
      let purchaseActiveCategoryId = settingsValue.purchaseActiveCategoryId
      let purchaseActiveCategories = settingsValue.purchaseActiveCategories
      if (purchaseActiveCategoryId && purchaseActiveCategories) {
        await this.getSelectedCategory({
          category: {id: purchaseActiveCategoryId},
          selectedCategories: purchaseActiveCategories,
        })
      }
    }
    await this.$store.dispatch('getCategoryTree')

    if (!this.isNotNewStatus) {
      this.$store.dispatch('getManufacturers', {all: true})
    }
    if (!!this.purchase.purchaseFiles) {
      this.purchase.purchaseFiles = this.purchase.purchaseFiles.map(file => {
        file.fileName = file.src.split('/').pop()
        return file;
      })
    }

    this.form = this.purchase
    if (this.form.date) {
      this.form.date = new Date(this.purchase.date).toISOString().substr(0, 10)
    } else {
      this.form.date = new Date().toISOString().substr(0, 10)
    }

    const date = new Date()
    const dateTimeFormat = new Intl.DateTimeFormat('en', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    let formatToParts = [];
    dateTimeFormat.formatToParts(date).forEach(item => {
      formatToParts[item.type] = item.value
    })
    this.dateNumber = `${formatToParts.day}${formatToParts.month}${formatToParts.year}${formatToParts.hour}${formatToParts.minute}`;
    this.form.serial_number = this.form.serial_number ?? this.dateNumber

    this.$eventHandle.$on('updateCost', (cost) => this.updateCost(cost))
    this.$eventHandle.$on('updatePurchaseCost', () => {
      let purchaseCost = this.purchaseProducts.reduce((accumulator, currentValue) => {
        return accumulator + (parseFloat(currentValue.price) * currentValue.qty);
      }, 0)
      this.updateCost(purchaseCost)
    })

    this.$eventHandle.$on('change-per-page-purchase-products', (perPage) => {
      this.perPage = perPage
      this.getCategoryProducts();
    })

    this.$eventHandle.$on('change-page-purchase-products', (page) => {
      this.page = page
      this.getCategoryProducts();
    })

    this.$eventHandle.$on('disable-status', () => {
      this.setDisableStatus();
    })

    this.$eventHandle.$on('change-params', (params) => {
      const { page, itemsPerPage } = params
      this.page = page
      this.perPage = itemsPerPage
      this.getCategoryProducts(params)
    })

    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
      this.purchaseProducts.map(pr => {
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

    this.dragPosition = Number.parseInt(this.purchase.slider_position) || 0

    await this.$store.dispatch('getVendors', {all: true})
  },

  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, {passive: true})
    for (let [index, filter] of this.filters.entries()) {
      this.propertyIds[index] = []
    }
  },

  async beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true})
    }
    if (this.purchaseActiveCategoryId && this.purchaseActiveCategories.length) {
      await this.$store.dispatch('saveSetting', {
        purchaseActiveCategories: JSON.stringify({
          purchaseActiveCategoryId: this.purchaseActiveCategoryId,
          purchaseActiveCategories: this.purchaseActiveCategories,
        })
      })
    }
  },

  destroyed() {
    this.$eventHandle.$off('change-page-purchase-products')
    this.$eventHandle.$off('change-params')
    this.$eventHandle.$off('change-per-page-purchase-products')
    this.$eventHandle.$off('disable-status')
    this.$eventHandle.$off('updateCost')
    this.$eventHandle.$off('updatePurchaseCost')
    this.$store.commit('setCategoryProducts', null)
    this.$store.commit('setDialog', false)
    this.$store.commit('setPurchaseProducts', [])
    this.$store.commit('setManufacturerNames', [])
    this.$store.dispatch('resetCategoryCache').then(() => {
      this.$store.commit('setCategories')
    })
    this.$store.dispatch('resetStoreCategoryCache')
  },

  methods: {
    onResize() {
      this.innerHeight = window.innerHeight - 100
    },

    getSearchProducts() {
      if (!!this.search) {
        this.searchText = this.search
        this.$store.dispatch('getSearchProducts', {search: this.search})
          .then(() => {
            this.$store.commit('setPurchaseActiveCategories', [])
            this.$store.commit('setPurchaseActiveCategoryId', null)
          })
      }
    },

    setDisableStatus() {
      if (this.purchase.status === 'store') {
        this.disabledStatus = true;
        return
      }
      this.disabledStatus = !!this.purchaseProducts.find(product => product.serial_numbers.find(s => s.serial_number === ''))
    },

    updateCost(cost) {
      this.form.purchase_cost = cost
      let expenses_cost = parseFloat(this.form.expenses_cost)
      if (!expenses_cost || isNaN(expenses_cost)) {
        this.form.real_purchase_cost = this.form.purchase_cost
      } else {
        this.form.real_purchase_cost = expenses_cost
      }
    },

    async getSelectedCategory(data) {
      this.search = null
      this.vendorIds = []
      this.selectedCategory = data.category
      this.selectedCategories = data.selectedCategories
      this.$store.commit('setPurchaseActiveCategoryId', this.selectedCategory.id)
      this.$store.commit('setPurchaseActiveCategories', this.selectedCategories)
      this.page = 1
      dFn(this.getCategoryProducts)
      await this.getCategoryFilters()
    },

    clientsFilter (item, queryText, itemText) {
      const textOne = (item.name || '').toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1
    },

    clientsFilterRtl (item, queryText, itemText) {
      const textOne = (item.he_name || '').toLowerCase()
      const textTwo = (item.company_name || '').toLowerCase()
      const textThree = (item.client_surname || '').toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1 ||
        textThree.indexOf(searchText) > -1
    },

    async getCategoryFilters() {
      await this.$store.dispatch('getVendors', {
        categoryId: this.purchaseActiveCategoryId,
      })
      await this.$store.dispatch('getCategoryFilters', {
        category_id: this.purchaseActiveCategoryId,
      })
    },

    resetFilter () {
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      this.vendorIds = []
      this.specificationIds = []
      dFn(this.getCategoryProducts)
    },

    async getCategoryProducts(params = {}) {
      if (!!params.hasOwnProperty('show_all_products_in_purchase')) {
        this.$store.commit('setShowAllProductsPurchase', params.show_all_products_in_purchase)
      }
      if (this.selectedCategory) {
        params.category_id = this.selectedCategory.id
      }
      params.show_all_products_in_purchase = this.showAllProductsPurchase
      params.perPage = this.perPage
      params.page = this.page
      params.pageName = 'purchase'
      params.manufacturer_id = this.form.manufacturer_id
      params.mode = 'products'
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
        delete params.specificationIds
        delete params.propertyIds
      }
      let result = await this.$store.dispatch('getCategoryProducts', params)
      if (result.data && result.data.meta) {
        this.showDeletedProducts = result.data.meta.showDeletedProducts
        this.showAvailableProducts = result.data.meta.showAvailableProducts
      }
    },

    closeModal() {
      this.$store.commit('setDialogMain', false)
    },

    removeFile(file) {
      this.files = this.files.filter(f => f.name !== file.name)
    },

    removePurchaseFile(file) {
      this.purchase.purchaseFiles = this.purchase.purchaseFiles.filter(f => f.id !== file.id)
    },

    onDrop(formData, files) {
      this.files = [...files, ...this.files]
    },

    addDocs(event) {
      this.files = [...event.target.files, ...this.files]
    },

    async savePurchase() {
      this.form.products = this.purchaseProducts.map(product => {
        return {
          id: product.id,
          qty: product.qty,
          serial_numbers: product.serial_numbers,
          warranty: product.warranty,
          price: product.price,
          purchase_producer_price: product.purchase_producer_price,
          purchase_marginal_price: product.purchase_marginal_price,
          category_name: product.root_category.name,
        }
      })
      this.form.files = this.files
      this.form.slider_position = this.dragPosition
      await this.$store.dispatch('savePurchase', this.form)
    },

    allDownload() {
      for (let file of this.form.purchaseFiles) {
        this.forceDownload(file.src, file.fileName)
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

    clearSearch () {
      this.search = null
      this.$eventHandle.$emit('change-params', {page: 1})
    },

    closeScanSerialNumber () {
      this.serialNumberActiveProductId = null
    },

    changeSerialNumberNo () {
      this.serialNumberNo = (this.serialNumberNo < this.serialNumberActiveProduct.serial_numbers.length - 1) ? this.serialNumberNo + 1 : 0
      this.$nextTick(() => {
        this.$refs.serialNumberInput.focus()
      })
    },
  },

  watch: {
    'form.expenses_cost'() {
      this.updateCost(this.form.purchase_cost)
    },
    'form.manufacturer_id'(manufacturer_id) {
      if (!this.isNotNewStatus) {
        this.$store.dispatch('getCategoryTree', {
          manufacturer_id: manufacturer_id
        })
      }
    },
    filters: function (val, oldVal) {
      this.propertyIds = {}
      for (let [index, filter] of val.entries()) {
        this.propertyIds[index] = []
      }
    },
    serialNumberActiveProductId: function (val, oldVal) {
      this.serialNumberNo = 0
      if (this.$refs.serialNumberInput && val) {
        this.$nextTick(() => {
          this.$refs.serialNumberInput.focus()
        })
      }
    },
    'form.manufacturer_id': function (val, oldVal) {
      this.getCategoryProducts()
    },
  }
}
</script>

<style lang="scss">
.purchase-qr-popup {
  overflow: hidden;
  height: 100%;
  &-title {
    height: 200px;
  }
  &__title {
    font-size: 48px; 
    line-height: 56px; 
    font-weight: 700;
    display: -webkit-box !important;
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  &__sn {
    input {
      padding-left: 40px !important;
    }
    .v-input__append-inner {
      position: absolute;
      top: 24px !important;
      left: 0px !important;
    }
    input {
      font-size: 40px !important;
      font-weight: 700 !important;
    }
  }
  &__close {
    .v-btn {
      width: 60px !important;
      height: 60px !important;
    }
    .v-btn__content,
    .v-icon {
      width: 100% !important;
      height: 100% !important;
      font-size: 60px !important;
    }
  }
}
.break {
  word-break: break-all;
}
</style>
