<template>
  <div class="pa-0">
    <v-row
      class="rounded white category-products__tooltip"
      no-gutters
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
                  @click="getCategoryProducts({show_all_products_in_store_category: showAllProductsStoreCategory === 'category' ? 'all' : 'category'})"
                    class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  small
                  plain
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    {{ showAllProductsStoreCategory === 'category' ? 'mdi-eye-off' : 'mdi-eye' }}
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ showAllProductsStoreCategory === 'category' ? 'все товары' : 'товары категории' }}
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
                    :key="saleProducts.length"
                    class="counting-box category-producte__counting-box d-flex justify-center align-center pa-0"
                  >
                    <div class="heading font-8">
                      {{ saleProducts.length || '0' }}
                    </div>
                  </div>
                </v-fab-transition>
              </div>
            </template>
            <span>{{ $t('products_count') }}</span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col
        class="d-flex align-center justify-start pl-0 category-products__tooltip-col sales-products-count"
        cols="4"
      >
        <div class="d-flex flex-column justfy-center align-center">
          <h3 class="font-8">
            <b>{{ $t('products') }}</b> 
            ({{ productCount ? productCount : 0 }})
          </h3>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <div
                v-on="on"
                v-bind="attrs"
              >
                <v-breadcrumbs
                  :items="openedCategories"
                  class="ma-0 pa-0 caption category-goods__breadcrumbs font-8"
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
        class="align-center d-flex justify-space-between px-1 category-products__tooltip-col"
        cols="2"
      >
        <v-btn
          class=" category-products__tooltip-reset"
          :disabled="isNotNewStatus"
          @click="resetFilter"
          color="black"
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
              <v-icon>
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row
      :style="`height: calc(${(45 - dragPosition)}vh - 22px); max-height: calc(85vh - 45px);`"
      class="mt-1 flex-nowrap"
      no-gutters
    > 
      <v-col
        class="pa-1 rounded white category-form__categories"
      >
        <category-tree
          class="category-form__categories-wrapper font-12"
          :activeCategories="activeStoreCategories || []"
          :activeCategoryId="activeStoreCategoryId"
          :categoryTree="storeCategoryTree || []"
          :mode="'store'"
          @attach-product="$store.dispatch('attachStoreProducts', $event)"
          @input="getSelectedCategory"
          @move="$store.dispatch('moveStoreCategory', $event)"
          style="overflow-y: scroll; overflow-x: hidden; height: 100%;"
          v-if="!isNotNewStatus"
        ></category-tree>
      </v-col>
      <v-col
        class="ml-1 pa-1 rounded white category-form__content"
        style="height: 100%;"
      >
        <category-store-products
          :category_id="activeStoreCategoryId"
          :groupsData="!isNotNewStatus ? storeProducts : null"
          :isNotNewStatus="isNotNewStatus"
          :manufacturerNames="manufacturerNames"
          :search="searchStoreProducts"
          :style="isNotNewStatus ? 'pointer-events: none;' : ''"
          :warranties="warranties"
          style="overflow: hidden; height: 100%;"
        ></category-store-products>
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
      :style="`height: calc(${(42 + dragPosition)}vh - 22px); max-height: calc(85vh - 45px);`"
      class="mt-1 flex-nowrap"
      no-gutters
    > 
      <v-col
        class="pa-1 rounded white category-products__fields"
      >
        <div
        class="category-form__offer-data"
        >
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
                :label="$t('saleDate')"
                class="category-products__offer-date offer-date pb-1"
                height="25px"
                hide-details
                plain
                type="date"
                v-model="sale.date"
              ></v-text-field>
            </v-col>
            <v-col
              class="px-1 rounded white ml-1 category-products__fields-textField"
              style="width: calc(50% - 2.25px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('saleNumber')"
                class="offer-date pb-1"
                height="25px"
                hide-details
                readonly
                v-model="sale.sale_number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            class="rounded mt-2 pa-1"
            style="background: #B9D2EA; padding-bottom: 0 !important;"
            no-gutters
          >
            <v-col 
            class="px-1 rounded white pb-1  
            category-products__fields-textField"
            style="width: calc(100% - 36.5px) !important;"
            >
              <v-autocomplete
                :filter="clientsFilter"
                :item-text="item => `${(item.person && item.person.name) || '-'}`"
                :items="allClients || []"
                :label="$t('clientNameRu')"
                :return-object="true"
                @change="changeClient"
                @click:clear="clearClient"
                height="25px"
                hide-details
                v-if="sale"
                v-model="sale.client_name"
              ></v-autocomplete>
            </v-col>
            <v-col
              class="align-center d-flex rounded white ml-1  category-products__fields-textField"
              style="width: 32px !important; flex-shrink: 0;"
            >
              <v-btn
                @click="addClientDialog = true"
                class="ma-0 pa-0"
                color="black"
                dir="rtl"
                icon
                plain
                style="background: white;"
              >
                <v-icon large>
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </v-col>
            <v-col class="mt-1" cols="12"></v-col>
            <v-col
              class="px-1 rounded white pb-1 category-products__fields-textField"
              style="width: 100% !important;"
            >
              <v-autocomplete
                :filter="clientsFilterRtl"
                :item-text="item => `${(item.person && item.person.surname) || '-'} ${(item.person && item.person.he_name) || '-'}`"
                :items="allClients || []"
                :label="$t('clientFullnameHe')"
                :return-object="true"
                @change="changeClient"
                @click:clear="clearClient"
                dir="rtl"
                height="25px"
                hide-details
                v-if="sale"
                v-model="sale.client_he_fullname"
              >
                <template #item="{ item }">
                  <div style="text-align: right; width: 100%;" dir="rtl">{{ `${item.surname || '-'} ${item.he_name || '-'}` }}</div>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col class="mt-1" cols="12"></v-col>
            <v-col
              class="px-1 rounded white pb-1 category-products__fields-textField"
              style="width: calc(100% - 36.5px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('clientEmail')"
                clearable
                height="25px"
                hide-details
                v-if="sale"
                v-model="sale.client_email"
              ></v-text-field>
            </v-col>
            <v-col
              class="align-center d-flex ml-1 rounded white category-products__fields-textField"
              style="width: 32px !important;"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-btn
                    :color="sale.send_mail ? 'primary' : 'black'"
                    :style="isNotNewStatus ? 'pointer-events: none;' : ''"
                    @click="sale.send_mail = !sale.send_mail"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>
                      mdi-email-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('sendToEmail') }}</span>
              </v-tooltip>
            </v-col>
            <v-col class="mt-1" cols="12"></v-col>
            <v-col
              class="pb-1 px-1 rounded white category-products__fields-textField"
            >
              <v-autocomplete
                :filter="clientsFilterRtl"
                :item-text="item => `${item.company_name || '-'} ${item.passport || '-'}`"
                :items="allClients || []"
                :label="$t('clientFirmPassportHe')"
                :return-object="true"
                @change="changeClient"
                @click:clear="clearClient"
                dir="rtl"
                height="25px"
                hide-details
                v-if="sale"
                v-model="sale.client_he_firm_passport"
              >
                <template #item="{ item }">
                  <div style="text-align: right; width: 100%;" dir="rtl">{{ `${item.company_name || '-'} ${item.passport || '-'}` }}</div>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col class="mt-1" cols="12"></v-col>
          </v-row>
          <v-row
            class="rounded mt-2 pa-1"
            style="background: #B9D2EA;"
            no-gutters
          >
            <v-col 
            class="pb-1 px-1 rounded white category-products__fields-textField"
            style="width: calc(50% - 20.5px) !important"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-text-field
                    :disabled="isNotNewStatus"
                    :label="$t('productsPrice')"
                    :value="sale.vat_price | toFix"
                    height="25px"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <span>{{ 'Сумма стоимости всех товаров с НДС.' }}</span>
              </v-tooltip>
            </v-col>
            <v-col 
            class="ml-1 px-1 rounded white category-products__fields-textField"
            style="width: calc(50% - 20.5px) !important"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('margin')"
                height="25px"
                hide-details
                readonly
                v-if="sale.calculate_mode === 'auto'"
                v-model="autoMarginWithoutVat"
              ></v-text-field>
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('marginManual')"
                :readonly="true"
                height="25px"
                hide-details
                v-else
                v-model="manualMarginWithoutVat"
              ></v-text-field>
            </v-col>
            <v-col
              class="align-center d-flex rounded white category-products__fields-textField ml-1"
              cols="auto"
              style="width: 32px !important;"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-btn
                    :style="isNotNewStatus ? 'pointer-events: none;' : ''"
                    :color="sale.calculate_mode === 'auto' ? 'primary' : 'black'"
                    @click="changeCalculateMode(sale.calculate_mode === 'auto' ? 'manual' : 'auto')"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>
                      {{ sale.calculate_mode === 'auto' ? 'mdi-check-circle-outline' : 'mdi-circle-outline' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ sale.calculate_mode === 'auto' ? $t('autoMode') : $t('manualMode') }}</span>
              </v-tooltip>
            </v-col>
            <v-col class="mt-1" cols="12"></v-col>
            <v-col
              class="pb-1 px-1 rounded white category-products__fields-textField"
              style="width: calc(50% - 38.75px) !important"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-text-field
                    :disabled="isNotNewStatus || !sale.delivery"
                    :label="$t('delivery')"
                    :value="manufacturerDeliverCost"
                    height="25px"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <span>{{ 'Стоимость доставки от всех поставщиков с НДС. Из настроек.' }}</span>
              </v-tooltip>
            </v-col>
            <v-col
              class="align-center d-flex ml-1 rounded white  category-products__fields-textField"
              cols="auto"
              style="width: 32px !important"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-btn
                    :style="isNotNewStatus ? 'pointer-events: none;' : ''"
                    :color="sale.delivery ? 'primary' : 'black'"
                    @click="sale.delivery = !sale.delivery"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>mdi-truck-delivery-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{ 'Включение или выключение стоимости доставки. Стоимость доставки взята из настроек и просуммирована по всем поставщикам.' }}</span>
              </v-tooltip>
            </v-col>
            <v-col 
              class="ml-1 pb-1 px-1 rounded white category-products__fields-textField"
              style="width: calc(50% - 38.75px) !important"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('marginWithVat')"
                height="25px"
                hide-details
                readonly
                v-if="sale.calculate_mode === 'auto'"
                v-model="autoMargin"
              ></v-text-field>
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('marginWithVatManual')"
                height="25px"
                hide-details
                v-else
                v-model="sale.manual_margin"
              ></v-text-field>
            </v-col>
            <v-col
              class="align-center d-flex ml-1 rounded white category-products__fields-textField"
              cols="auto"
              style="width: 32px !important"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-btn
                    :style="isNotNewStatus ? 'pointer-events: none;' : ''"
                    :color="sale.visa ? 'primary' : 'black'"
                    @click="sale.visa = !sale.visa"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>
                      mdi-credit-card-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>Виза {{ sale.visa_percent }}% - это наценка на конечную стоимость, взята из настроек.</span>
              </v-tooltip>
            </v-col>
            <v-col class="mt-1" cols="12"></v-col>
            <v-col 
            class="pb-1 px-1 rounded white category-products__fields-textField"
            style="width: calc(50% - 20.5px) !important"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('amount')"
                height="25px"
                hide-details
                prefix="₪"
                readonly
                v-model="saleAmountWithoutVat"
              ></v-text-field>
            </v-col>
            <v-col 
              class="ml-1 px-1 rounded white category-products__fields-textField"
              style="width: calc(50% - 20.5px) !important"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('amountWithVat')"
                :value="amountNew"
                @input.native="changeAmount($event, amountNew)"
                height="25px"
                hide-details
                prefix="₪"
                ref="amountNew"
              ></v-text-field>
            </v-col>
            <v-col
              class="align-center d-flex rounded white category-products__fields-textField ml-1"
              cols="auto"
              style="width: 32px !important;"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-btn
                    :style="isNotNewStatus ? 'pointer-events: none;' : ''"
                    :color="!sale.payment ? 'black' : 'primary'"
                    @click="sale.payment = !sale.payment"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>
                      {{ (sale.payment && 'mdi-bank-off') || 'mdi-bank' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ (sale.payment && `Оплата товаров поставщику визой.`) || 'Оплата товаров поставщику банковским переводом.' }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row
            :style="!sale.client_id ? 'pointer-events: none; color: white;' : ''"
            class="rounded mt-2 mb-4 pa-1 category-products__file-upload"
            no-gutters
          >
            <v-col class="align-center rounded white">
              <div>
                <VueFullScreenFileDrop @drop='onDrop'/>
                <v-row class="ma-0 pa-0 text-center">
                  <v-col 
                  cols="5"
                  class="pa-0 ma-0">
                    <div
                      :class="{ 'primary--text': saleFilesGroup === 1 }"
                      :style="saleFilesGroup === 1 && 'background: #CCE3FF;'"
                      @click="saleFilesGroup = 1"
                      class="pa-1 rounded grey--text category-products__file-upload-type"
                      style="background: #EEEEEE; cursor: pointer;"
                    >{{ $t('documents') }}</div>
                  </v-col>
                  <v-col 
                  cols="3"
                  class="pa-0 ma-0"
                  >
                    <div
                      :class="{ 'primary--text': saleFilesGroup === 2 }"
                      :style="saleFilesGroup === 2 && 'background: #CCE3FF;'"
                      @click="saleFilesGroup = 2"
                      class="pa-1 rounded grey--text category-products__file-upload-type"
                      style="background: #EEEEEE; cursor: pointer;"
                    >{{ $t('another') }}</div>
                  </v-col>
                  <v-col 
                  cols="4"
                  class="pa-0 ma-0"
                  >
                    <input ref="fileUpload" id="purchase-doc" type="file" style="display: none;" multiple @change="addDocs">
                    <div 
                    class="d-flex align-center" 
                    style="margin-top: 2.5px; height: 19px !important;"
                    >
                      <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
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
                    v-for="file of (sale.saleFiles && sale.saleFiles.filter(sf => sf.group === saleFilesGroup)) || []"
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
                            @click="removeSaleFile(file)"
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
                    <!-- v-for="file of files.filter(sf => sf.group === saleFilesGroup)" -->
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
          <!-- style="height: 100%;" -->
        <sale-products
          :isNotNewStatus="isNotNewStatus"
          :manufacturerNames="manufacturerNames"
          :sale="sale"
          :saleProducts="saleProducts"
          :warranties="warranties"
          style="overflow: hidden; height: 100%;"
        ></sale-products>
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
      max-height="90vh"
      max-width="800px"
      persistent
      v-model="addNoteDialog"
      width="45vw"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA;"
      >
        <div
          color="transparent"
          dark
          class="align-center d-flex flex-nowrap"
          style="position: absolute; top: -45px; right: -65px; width: calc(45vw + 60px); max-width: 860px;"
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
                :disabled="!saleProducts.length"
                :loading="requestStatus === 'loading'"
                @click="saveSale"
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
              rows="7"
              v-model="sale.note"
            ></v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      max-width="95%"
      max-height="100vh"
      persistent
      scrollable
      v-model="addClientDialog"
    >
      <client-form
        :client="client"
      ></client-form>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-model="addOfferDialog"
    >
      <offer-form :offer="offer"></offer-form>
    </v-dialog>
  <!-- </v-card> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import VueFullScreenFileDrop from '../../../helpers/vue-full-screen-file-drop'
import {debounce} from 'vue-debounce'
import toFix from "../../../filters/toFix"
import paginationMixin from "@/mixins/paginations"
import handleFilesMixin from "@/mixins/handleFiles"
// import { Tree } from '../../../helpers/draggable-nested-tree'
import CategoryStoreProducts from './CategoryStoreProducts.vue'

const dFn = debounce(fn => fn(), '400ms')

export default {
  name: "SaleForm",
  components: {
    CategoryStoreProducts,
    CategoryStoreProducts: () => import("./CategoryStoreProducts"),
    CategoryTree: () => import("../category/CategoryTree"),
    ClientForm: () => import("../../components/clients/ClientForm"),
    GroupProducts: () => import("../../components/category/GroupProducts"),
    OfferForm: () => import("../../components/offers/OfferForm"),
    SaleProducts: () => import("./SaleProducts"),
    VueFullScreenFileDrop,
  },

  props: {
    sale: Object,
    noClientUnset: Boolean,
  },
  mixins: [
    paginationMixin,
    handleFilesMixin
  ],
  data () {
    return {
      addClientDialog: false,
      addNoteDialog: false,
      addOfferDialog: false,
      delivers: [],
      disabledStatus: false,
      dragPosition: 0,
      files: [],
      innerHeight: 900,
      // productsPrice: 0,
      propertyIds: {},
      saleExpensesAuto: 0,
      saleFilesGroup: 1,
      search: null,
      searchStoreProducts: null,
      selectedCategories: [],
      selectedCategory: null,
      selectedStoreCategories: [],
      selectedStoreCategory: null,
      showCategoryFilters: false,
      showManufacturerDeliver: false,
      specificationIds: [],
      warranties: [],
      vendorIds: [],
    }
  },

  filters: {
    toFix,
  },

  computed: {
    ...mapGetters([
      'activeCategories',
      // 'activeCategoryId',
      'activeStoreCategories',
      'activeStoreCategoryId',
      // 'categoryGroups',
      // 'categoryTree',
      'client',
      'allClients',
      'filters',
      'manufacturerNames',
      'manufacturers',
      'offers',
      'offersPaid',
      'requestStatus',
      'saleProducts',
      'sales',
      'showAllProductsPurchase',
      'showAllProductsStoreCategory',
      'storeCategory',
      'storeCategorySelect',
      'storeCategoryTree',
      'storeProducts',
      'vendors',
      'productCount',
    ]),

    openedCategories() {
      let names = this.activeCategories.map(item => {
        return {
          text: item.name[this.$i18n.locale],
        }
      })
      return names.reverse()
    },

    manufacturerDelivers() {
      let manufacturerDelivers = []
      if (this.saleProducts.length && this.manufacturers && this.manufacturers.length) {
        let saleManufacturerNames = this.saleProducts.map(p => (!!p && p.manufacturer && p.manufacturer.name) || (!!p && p.manufacturer) || (!!p && p.manufacturer_id))
        manufacturerDelivers = this.manufacturers.filter(manufacturer => !!saleManufacturerNames.find(name => name === manufacturer.name || name == manufacturer.id))
      }
      return manufacturerDelivers
    },

    manufacturerDeliverCost() {
      if (this.isNotNewStatus) {
        return this.sale.delivery_cost
      }
      let deliverCost = this.manufacturerDelivers.reduce((total, manufacturer) => {
        return total + Number.parseFloat(manufacturer.deliver_cost || 0)
      }, 0) * (this.sale.payment ? (100 + parseFloat(this.sale.payment_percent || 0)) / 100 : 1)
      return Math.round((deliverCost * 117 / 100) * 100) / 100
    },

    isNotNewStatus() {
      return this.sale.status !== 'new'
    },

    // distinctVendorIds () {
    //   return [...new Set(this.categoryProducts.data.map(cp => cp.vendor_id))]
    // },
    offer: {
      get: function () {
        return this.$store.getters.offer
      },
      set: function (offer) {
        this.$store.dispatch('setOffer', offer)
        // this.$store.commit('setOffer', {})
      },
    },

    saleAmountWithoutVat: {
      get: function () {
        return Math.round((Number.parseFloat(this.sale.amount || 0) / 117 * 100) * 100) / 100 || null
      },
      set: function (newVal) {
        this.sale.amount = Math.round((Number.parseFloat(newVal || 0) * 117 / 100) * 100) / 100
      },
    },

    autoMargin: {
      get: function () {
        // return Math.round(((Number.parseFloat(this.sale.amount) * ((this.sale.visa && 100 / (100 + Number.parseFloat(this.sale.visa_percent))) || 1) - (Number.parseFloat(this.sale.expenses))) || 0) * 100) / 100
        let amount = Number.parseFloat(this.sale.amount) * ((this.sale.visa && 100 / (100 + Number.parseFloat(this.sale.visa_percent))) || 1)
        let autoMargin = ((amount - ((this.sale.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.sale.vat_price)) || 0)
        return Math.round(autoMargin * 100) / 100
      },
      set: function () {
        this.sale.amount = parseFloat(newVal || 0)
      }
    },

    autoMarginWithoutVat () {
      return Math.round((Number.parseFloat(this.autoMargin || 0) / 117 * 100) * 100) / 100
    },

    manualMargin: {
      get: function () {
        // return Math.round(((Number.parseFloat(this.sale.amount) * ((this.sale.visa && 0 && 100 / (100 + Number.parseFloat(this.sale.visa_percent))) || 1) - (Number.parseFloat(this.sale.expenses))) || 0) * 100) / 100 || null
        return Math.round(((Number.parseFloat(this.sale.amount) * ((this.sale.visa && 100 / (100 + Number.parseFloat(this.sale.visa_percent))) || 1) - ((this.sale.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.sale.vat_price)) || 0) * 100) / 100 || null
      },
      set: function (newVal) {
        this.sale.amount = Math.round(((this.sale.amount + Number.parseFloat(newVal)) || 0) * 100) / 100 || null
      },
    },

    manualMarginWithoutVat: {
      get: function() {
        return Math.round((Number.parseFloat(this.sale.manual_margin || 0) / 117 * 100) * 100) / 100 || null
        // return Math.round((parseFloat(this.manualMargin || 0) / 117 * 100) * 100) / 100 || null
      },
      set: function(newVal) {
        // if (newVal) {
        this.sale.manual_margin = Math.round((Number.parseFloat(newVal || 0) * 100 / 117) * 100) / 100 || null
        // }
      }
    },

    productsMargin () {
      let saleVatPrice = 0
      let saleMarginalPrice = 0
      if (this.saleProducts && this.saleProducts.length && this.manufacturers && this.manufacturers.length) {
        saleVatPrice = this.saleProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.price)
            )
          ) || 0, 0)
        saleMarginalPrice = this.saleProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.purchase_marginal_price)
            )
          ) || 0, 0)
      }
      return (parseFloat(saleMarginalPrice || 0) - parseFloat(saleVatPrice || 0))
    },

    result1 () {
      let result1 = parseFloat(this.sale.vat_price || 0) + ((this.sale.delivery && parseFloat(this.manufacturerDeliverCost)) || 0)
      return result1
    },

    result2 () {
      let result2 = parseFloat(this.result1) + parseFloat((this.sale.calculate_mode === 'auto' ? this.productsMargin : this.sale.manual_margin) || 0)
      return result2
    },

    amountNew () {
      if (this.isNotNewStatus) {
        return this.sale.amount
      }
      let amountNew = this.result2 * ((this.sale.visa && (100 + parseFloat(this.sale.visa_percent)) / 100) || 1)
      return Math.round(amountNew * 100) / 100
    },

    amountSaved () {
      let sale = this.sales.data ? this.sales.data.find(o => o.id === this.sale.id) || {} : {}
      return sale.amount || 0
    },

    'sale.margin': {
      get: function () {
        if (this.saleProducts && this.saleProducts.length) {
          return this.saleProducts.reduce((total, product) => total + parseFloat(product.purchase_marginal_price), 0)
        } else {
          return 0
        }
      },
      set: function (newVal) {
        this.sale.margin = Math.round(((Number.parseFloat(newVal)) || 0) * 100) / 100
      },
    },
  },

  async created() {
    await this.$store.dispatch('getStoreCategoryTree')
    this.setEventStoreCategory()

    if (!!this.sale.saleFiles) {
      this.sale.saleFiles = this.sale.saleFiles.map(file => {
        file.fileName = file.src.split('/').pop()
        return file
      })
    }

    this.$store.dispatch('getCategoryTree')
    this.$store.dispatch('getManufacturers', {all: true})
    this.$eventHandle.$on('change-per-page-products', (perPage) => {
      this.perPage = perPage
      this.getCategoryProducts();
    })

    this.$eventHandle.$on('change-page-products', (page) => {
      this.page = page
      this.getCategoryProducts();
    })

    this.$eventHandle.$on('change-params', (params) => {
      const { page } = params
      this.page = page
      this.getCategoryProducts(params)
    })

    this.$eventHandle.$on('disable-status', () => {
      this.setDisableStatus();
    })

    if (this.sale.products) {
      this.$store.commit('setSaleProducts', this.sale.products)
    }

    if (!this.sale.sale_number) {
      this.sale.sale_number = this.getNewSaleNumber()
    }

    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
      this.saleProducts.map(product => {
        let productWarranty = parseInt(product.warranty)
        if (!!productWarranty) {
          if (!this.warranties.find(w => w.value === productWarranty)) {
            this.warranties.push({name: product.warranty, value: productWarranty})
          }
          product.warranty = productWarranty
        }
        return product
      })
    })

    this.$eventHandle.$on('updateVatPriceCost', (saleVatPriceCost) => this.updateVatPriceCost(saleVatPriceCost))
    this.$eventHandle.$on('updateSaleCost', () => {
      let saleVatPriceCost = this.saleProducts.reduce((accumulator, currentValue) => {
        // return accumulator + parseFloat(currentValue.var_price);
        return accumulator + parseFloat(currentValue.price)
      }, 0)
      this.updateVatPriceCost(saleVatPriceCost)
    })

    this.sale.client_id && this.$store.dispatch('getClient', {id: this.sale.client_id})
    
    this.$store.dispatch('getClients', {all: true})

    if (this.sale.offer_id) {
      await this.$store.dispatch('getOffer', {id: this.sale.offer_id})
    }

    this.setEventProduct()

    this.$eventHandle.$on('set-dialog', (payload) => this[payload.name] = payload.value)
    this.$eventHandle.$on('save-client', (payload) => {
      if (payload && payload.id) {
        this.$store.dispatch('getClient', {id: payload.id})
        this.sale.client_id = payload.id
      }
    })

    this.$store.dispatch('getSettings', {settingsName: 'settingsVisa'}).then((data) => {
      this.sale.visa_percent = data.value
    })
    this.$store.dispatch('getSettings', {settingsName: 'settingsPayment'}).then((data) => {
      this.sale.payment_percent = data.value
    })

    if (!this.sale.calculate_mode) {
      // this.sale.calculate_mode = 'auto'
      this.$set(this.sale, 'calculate_mode', 'auto')
    }
    this.calculatePrice()

    this.dragPosition = Number.parseInt(this.sale.slider_position) || 0

    if (this.sale.visa === null) {
      this.sale.visa = true
    }
    if (this.sale.delivery === null) {
      this.sale.delivery = true
    }
    if (this.sale.payment === null) {
      this.sale.payment = true
    }
    // if (this.sale.auto_margin === null) {
    //   this.sale.auto_margin = true
    // }
    if (this.sale.calculate_mode === null) {
      this.sale.calculate_mode = 'auto'
    }

    this.setAmount(this.amountSaved)
  },

  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, {passive: true})
    this.getSelectedCategory({
      category: { id: 1 },
      selectedCategories: [
        { id: 1 }
      ]
    })
    this.getCategoryProducts()
    for (let [index, filter] of this.filters.entries()) {
      this.propertyIds[index] = []
    }
    this.saleFilesGroup = 1
  },

  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true})
    }
  },

  destroyed() {
    this.$eventHandle.$off('change-params')
    this.$eventHandle.$off('change-page-products')
    this.$eventHandle.$off('change-per-page-products')
    this.$eventHandle.$off('disable-status')
    this.$eventHandle.$off('save-client')
    this.$eventHandle.$off('save-product')
    this.$eventHandle.$off('updateSaleCost')
    this.$eventHandle.$off('updateVatPriceCost')
    this.$store.commit('setActiveStoreCategoryId', null)
    this.$store.commit('setCategories', null)
    this.$store.commit('setCategoryProducts', [])
    !this.noClientUnset && this.$store.commit('setClient', {})
    this.$store.commit('setManufacturerNames', [])
    this.$store.commit('setManufacturers', [])
    this.$store.commit('setOffer', {})
    this.$store.commit('setSaleProducts', [])
    this.$store.commit('setSettings', [])
    this.$store.commit('setStoreCategories', [])
  },

  methods: {
    onResize() {
      this.innerHeight = window.innerHeight - 100
    },

    resetFilter () {
      dFn(this.getCategoryProducts)
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      this.specificationIds = []
    },

    async getCategoryFilters() {
      // await this.$store.dispatch('getVendors', {
      //   vendorIds: this.distinctVendorIds.join()
      // })
      await this.$store.dispatch('getCategoryFilters', {
        category_id: this.activeStoreCategoryId,
      })
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

    calculatePrice () {
      let marginalSalePrice = 0
      let productsPrice = 0
      if (this.saleProducts && this.saleProducts.length) {
        productsPrice = this.saleProducts.reduce((total, product) => total + parseFloat(product.price), 0)
        marginalSalePrice = this.saleProducts.reduce((total, product) => total + parseFloat(product.purchase_marginal_price), 0)
      }
      // this.saleExpensesAuto = Math.round((productsPrice + this.manufacturerDeliverCost) * 100) / 100
      // if (this.sale.calculate_mode === 'manual') {
      //   this.sale.amount = parseFloat(this.sale.expenses)
      //   this.sale.amount += Number.parseFloat(this.sale.manual_margin || 0)
      // } else {
      //   this.sale.expenses = Math.round((this.saleExpensesAuto) * 100) / 100
      //   this.sale.amount = parseFloat(this.sale.expenses)
      //   this.sale.amount += Math.round((marginalSalePrice - productsPrice) * 100) / 100
      //   if (this.sale.visa) {
      //     this.sale.amount = this.sale.amount * (100 + Number.parseFloat(this.sale.visa_percent)) / 100
      //   }
      // }

      // if (this.sale.calculate_mode === 'manual') {
      //   // this.sale.amount += Number.parseFloat(this.manualMargin || 0)
      //   // this.sale.amount = Math.round((this.sale.amount + (Number.parseFloat(newVal) - parseFloat(this.manualMargin)) || 0) * 100) / 100
      // } else {
      //   // this.sale.amount += Number.parseFloat(this.autoMargin)
      //   // this.sale.amount += Number.parseFloat(this.sale.marginal_price - this.sale.vat_price)
      // }

      // this.sale.amount = Math.round((this.sale.amount) * 100) / 100

      this.sale.delivery_cost = this.manufacturerDeliverCost

      if (this.saleProducts && this.saleProducts.length && this.manufacturers && this.manufacturers.length) {
        let saleVatPrice = this.saleProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.price)
            )
          ) || 0, 0) * (this.sale.payment ? (100 + parseFloat(this.sale.payment_percent || 0)) / 100 : 1)
        this.updateVatPriceCost(Math.round(saleVatPrice * 100) / 100)
        let saleMarginalPrice = this.saleProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.purchase_marginal_price)
            )
          ) || 0, 0)
        this.updateMarginalCost(Math.round(saleMarginalPrice * 100) / 100)
      }

      this.sale.amount = Number.parseFloat(this.sale.vat_price || 0)

      if (this.sale.calculate_mode === 'manual') {
        this.sale.amount += Number.parseFloat(this.sale.manual_margin || 0)
      } else {
        this.sale.amount += Number.parseFloat(marginalSalePrice - productsPrice)
      }
      if (this.sale.delivery) {
        this.sale.amount += Number.parseFloat(this.manufacturerDeliverCost || 0)
      }
      if (this.sale.visa) {
        this.sale.amount = this.sale.amount * (100 + Number.parseFloat(this.sale.visa_percent)) / 100
      }
      this.sale.amount = Math.round(this.sale.amount * 100) / 100
    },

    getSearchProducts() {
      if (!!this.search) {
        this.$store.dispatch('getSearchProducts', {search: this.search})
          .then(() => {
            this.$store.commit('setPurchaseActiveCategories', [])
            this.$store.commit('setPurchaseActiveCategoryId', null)
          })
      }
    },

    // clientData(sale) {
    //   if (sale.client_email) {
    //     this.$store.dispatch('getClientByEmail', {email: sale.client_email}).then(client => {
    //       if (sale.client_email === client.email) {
    //         sale.client_he_name = client.he_name
    //         sale.client_name = client.name
    //         sale.client_surname = client.surname
    //         sale.client_passport = client.passport
    //         sale.client_mobile_phone = client.mobile_phone
    //       }
    //     })
    //   }
    // },

    setDisableStatus() {
      if (this.sale.status === 'store') {
        this.disabledStatus = true;
      }
    },

    setEventStoreCategory() {
      this.$eventHandle.$on('save-category', (category) => {
        this.$store.dispatch('saveStoreCategory', category).then(resp => {
          if (!!category.id) {
            this.$eventHandle.$emit('change-node', resp)
            let activeCategories = this.activeStoreCategories
            Object.assign(activeCategories.find(c => category.id === c.id), resp)
            this.$store.commit('setActiveStoreCategories', activeCategories)
          } else {
            this.$eventHandle.$emit('add-node', resp)
          }
          // this.closeModal()
          this.$store.dispatch('resetStoreCategoryCache')
        })
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

    updateVatPriceCost(vatPriceCost) {
      this.sale.vat_price = vatPriceCost
    },

    updateMarginalCost(marginCost) {
      this.sale.margin = marginCost
    },

    // updateManualMargin(manualMargin) {
    //   this.sale.manual_margin = (manualMargin / 100 * 17) + Number(manualMargin)
    // },

    closeManufacturerDeliver() {
      this.showManufacturerDeliver = false
    },

    async getSelectedCategory(data) {
      this.search = null
      this.selectedStoreCategory = data.category
      this.selectedStoreCategories = data.selectedCategories
      this.$store.commit('setActiveStoreCategoryId', this.selectedStoreCategory.id)
      this.$store.commit('setActiveStoreCategories', this.selectedStoreCategories)
      await this.changeParams({...{sortLocale: this.$i18n.locale, page: 1}}, 'change-params')
      // this.page = 1
      // dFn(this.getCategoryProducts);
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
      params.pageName = 'sale'
      // params.pageName = 'storeCategory'
      params.mode = 'groupProducts'
      if (this.specificationIds.length) {
        params.specificationIds = this.specificationIds.join()
      }
      // if (this.propertyIds.length) {
      //   params.propertyIds = this.propertyIds.join()
      // }
      if (Object.values(this.propertyIds).find(v => v.length)) {
        params.propertyIds = JSON.stringify(this.propertyIds)
      }
      // if (this.vendorIds.length) {
      //   params.vendorIds = this.vendorIds.join()
      // }
      // this.$store.dispatch('getCategoryProducts', params)
      if (params.search) {
        // delete params.show_all_products_in_purchase
        delete params.category_id
        delete params.specificationIds
        delete params.propertyIds
        // this.$store.commit('setActiveCategoryId', null)
        // this.$store.commit('setActiveCategories', [])
        // this.$store.commit('setCategories', null)
      }
      this.$store.dispatch('getStoreProducts', params)
    },

    closeModal() {
      // this.$eventHandle.$emit('set-dialog', { name: 'addSaleDialog', value: false })
      this.$store.dispatch('setOpenedDialogs', { name: 'addSale', value: false })
    },

    async saveSale() {
      if (this.sale.status == 'completed') {
        this.sale.products = this.saleProducts.filter(sp => sp.status != 'sold')
      } else {
        this.sale.products = this.saleProducts
      }
      // .map(pr => {
      //   return {
      //     id: pr.id,
      //     warranty_client: pr.warranty_client,
      //     position: pr.position,
      //   }
      // })

      this.sale.files = this.files

      this.sale.slider_position = this.dragPosition

      let savedSale = await this.$store.dispatch('saveSale', this.sale)
      savedSale && Object.assign(this.sale, savedSale)

      if (this.sale.products) {
        await this.$store.commit('setSaleProducts', this.sale.products)
      }

      let saleProductIds = this.saleProducts.map(saleProduct => saleProduct.id)
      await this.$store.dispatch('saveSaleProductsPositions', {sale_id: this.sale.id, saleProductIds})

      await this.$store.dispatch('getSale', this.sale)
      if (this.sale.products) {
        await this.$store.commit('setSaleProducts', this.sale.products)
      }

      if (!!this.sale.saleFiles) {
        this.sale.saleFiles = this.sale.saleFiles.map(file => {
          file.fileName = file.src.split('/').pop()
          return file
        })
      }
      this.files = []

      this.sale.client_he_firm_passport = this.client
      this.sale.client_he_fullname = this.client

      if (this.sale.status == 'completed') {
        this.$store.dispatch('resetStoreCategoryCache')
      }

      this.setAmount(this.amountSaved)
    },

    saleCleaning() {
      this.$eventHandle.$emit('sync-selected-products', []);
      this.$store.commit('setSaleProducts', [])
    },

    setEventProduct () {
      this.$eventHandle.$on('save-product', (product) => {
        this.$store.dispatch('saveProduct', product).then((response) => {
          let products = this.categoryProducts
          let newProduct = response.data
          newProduct.manufacturer = !!newProduct.manufacturer ? newProduct.manufacturer.name : ''
          if (products) {
            if (!!product.id) {
              Object.assign(products.data.find(p => product.id === p.id), newProduct)
            } else {
              products.data.unshift(newProduct)
            }
          }
          this.$store.commit('setCategoryProducts', products)
          // this.$eventHandle.$emit('set-dialog', { name: 'addSaleDialog', value: false })
          this.$store.dispatch('setOpenedDialogs', { name: 'addSale', value: false })
          this.$store.dispatch('resetCategoryCache')
        })
      })
    },

    changeClient (client) {
      if (this.sale.status !== 'new') {
        this.sale.sale_number = this.getNewSaleNumber()
      }
      this.sale.status = 'new'
      if (client && client.id) {
        this.$store.dispatch('getClient', {id: client.id})
      } else {
        this.$store.commit('setClient', {})
      }
    },

    changeOffer (offer) {
      if (this.sale.status !== 'new') {
        this.sale.sale_number = this.getNewSaleNumber()
      }
      this.sale.status = 'new'

      if (offer.client_id) {
        this.$store.dispatch('getClient', {id: offer.client_id})
      }

      this.sale.amount = +offer.amount
      this.sale.expenses = this.sale.expenses
      // this.sale.margin = +this.sale.amount - +this.sale.expenses
      // if (offer && offer.id) {
      //   this.$store.dispatch('getOffer', {id: offer.id})
      // } else {
      //   this.$store.commit('setOffer', {})
      // }
    },

    clearClient () {
      if (this.sale.status !== 'new') {
        this.sale.sale_number = this.getNewSaleNumber()
      }
      this.sale.status = 'new'
      this.$store.commit('setClient', {})
    },

    clearOffer () {
      if (this.sale.status !== 'new') {
        this.sale.sale_number = this.getNewSaleNumber()
      }
      this.sale.status = 'new'
      this.$store.commit('setOffer', {})
    },

    getNewSaleNumber () {
      let now = new Date()
      this.sale.date = `${now.getFullYear()}-${(now.getMonth()+101).toString().substring(1)}-${(now.getDate()+100).toString().substring(1)}`
      let saleNumber = this.sales.data.map(of => of.sale_number)
      return saleNumber.length ? Math.max.apply(null, saleNumber) + 1 : 26890
    },

    onDrop(formData, files) {
      this.files = [...files, ...this.files]
      // this.files = [...files.forEach(f => f.group = this.saleFilesGroup), ...this.files]
    },

    addDocs(event) {
      console.log('--------')
      console.log(event)
      console.log('--------')
      this.files = [...event.target.files, ...this.files]
      // this.files = [...event.target.files.forEach(f => f.group = this.saleFilesGroup), ...this.files]
    },

    removeFile(file) {
      this.files = this.files.filter(f => f.name !== file.name)
    },
    
    removeSaleFile(file) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          this.sale.saleFiles = this.sale.saleFiles.filter(f => f.id !== file.id)
        }
      })
    },

    allDownload() {
      for (let file of this.sale.saleFiles) {
        this.forceDownload(file.src, file.fileName)
      }
    },

    // offersPaidFilter (item, queryText, itemText) {
    //   const textOne = (item.name || '').toLowerCase()
    //   const searchText = queryText.toLowerCase()

    //   return textOne.indexOf(searchText) > -1
    // },

    clearSearch () {
      this.search = null
      this.$eventHandle.$emit('change-params', {page: 1})
    },

    changeAmount ($event, oldVal) {
      if (this.sale.calculate_mode === 'auto') {
        this.sale.amount = parseFloat($event.target.value)
      } else {
        this.sale.manual_margin = parseFloat(this.sale.manual_margin || 0) + (parseFloat($event.target.value) - parseFloat(oldVal)) * ((this.sale.visa && 100 / (100 + parseFloat(this.sale.visa_percent))) || 1)
      }
    },

    setAmount (newVal) {
      if (this.sale.calculate_mode === 'auto') {
        this.sale.amount = parseFloat(newVal)
        let elem = this.$refs.amountNew.$el
        let inputEl = elem.querySelector('input')
        inputEl.value = newVal
      } else {
        this.sale.manual_margin = parseFloat(this.sale.manual_margin || 0) + (parseFloat(newVal) - parseFloat(this.amountNew)) * ((this.sale.visa && 100 / (100 + parseFloat(this.sale.visa_percent))) || 1)
      }
    },

    changeCalculateMode(mode) {
      this.calculateMode = mode
      this.sale.calculate_mode = mode
      // this.sale.auto_margin = (mode != 'manual')
      if (mode === 'manual') {
        this.updateVatPriceCost(this.sale.vat_price)
      } else {
        this.updateMarginalCost(this.sale.margin)
      }
    },
  },

  watch: {
    'sale.auto_margin': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    'sale.products': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    'sale.calculate_mode': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    // 'sale.marginal_price': function (val, oldVal) {
    //   this.updateMarginalCost(this.sale.marginal_price)
    //   this.updateVatPriceCost(this.sale.vat_price)
    //   if (!this.isNotNewStatus) {
    //     this.calculatePrice()
    //   }
    // },

    'sale.amount': function (val, oldVal) {
      // this.sale.margin = Math.round((this.sale.amount - this.sale.expenses) * 100) / 100
      if (this.sale.calculate_mode === 'manual') {
        this.sale.manual_margin = this.manualMargin
      }
    },

    'sale.payment': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    // 'sale.margin': function (val, oldVal) {
    //   this.calculatePrice()
    // },

    'sale.expenses': function (val, oldVal) {
      if (!val) {
        this.sale.calculate_mode = 'auto'
      }
      // this.calculatePrice()
    },

    'saleProducts.length': function (val, oldVal) {
      this.calculatePrice()
    },

    'sale.status': function (val, oldVal) {
      if (val === 'new' && oldVal === 'completed') {
        this.sale.sale_number = this.getNewSaleNumber()
      }
    },

    'sale.visa': function (val, oldVal) {
      // if (val) {
      //   this.sale.amount = this.sale.amount * (100 + Number.parseFloat(this.sale.visa_percent)) / 100
      // } else {
      //   this.sale.amount = this.sale.amount / (100 + Number.parseFloat(this.sale.visa_percent)) * 100
      // }
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    'sale.manual_margin': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    'sale.margin': function (val, oldVal) {
      this.updateMarginalCost(this.sale.margin)
      this.updateVatPriceCost(this.sale.vat_price)
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    'sale.vat_price': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    'sale.delivery': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    manufacturerDeliverCost: function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },

    // manualMargin: function (val, oldVal) {
    //   // console.log(val)
    //   // if (!this.isNotNewStatus) {
    //   //   this.calculatePrice()
    //   // }
    //   // if (val) {
    //   //   // this.sale.amount = Math.round((this.sale.amount + (Number.parseFloat(val) - parseFloat(oldVal)) || 0) * 100) / 100
    //   // }
    // },

    // 'sale.manual_margin': function (val, oldVal) {
    //   if (!this.isNotNewStatus) {
    //     this.calculatePrice()
    //   }
    // },

    client: function(val, oldVal) {
      this.sale.client_email = (val.person && val.person.email) || null
      this.sale.client_he_fullname_firm = val.person && (val.person.he_name || val.person.surname || val.company_name) && `${val.person.he_name || ''} ${val.person.surname || ''} / ${val.company_name || ''}` || ''
      this.sale.client_he_name = (val.person && val.person.he_name) || null
      this.sale.client_id = val.id
      this.sale.client_mobile_phone = (val.person && val.person.mobile_phone) || null
      this.sale.client_name = (val.person && val.person.name) || null
      this.sale.client_passport = val.passport
      this.sale.client_surname = (val.person && val.person.surname) || null
      this.sale.client_he_firm_passport = val
      this.sale.client_he_fullname = val
    },

    offer: function(val, oldVal) {
      this.sale.offer_id = val.id
      this.sale.offer_number = val.offer_number
      this.sale.name = this.sale.name || val.name
    },

    filters: function (val, oldVal) {
      this.propertyIds = {}
      for (let [index, filter] of val.entries()) {
        this.propertyIds[index] = []
      }
    },
  }
}
</script>

<style>
.radio {
  transform: scale(1.5);
  cursor: pointer;
  margin-top: 25px;
  margin-left: -10px;
}

/* .offer-date input[type=date] {
  width: 100px;
} */

.offer-manufacturers-field {
  position: relative;
}

.offer-manufacturers-list {
  position: absolute;
  left: 10px;
  bottom: 60px;
  background: white;
  padding: 5px 10px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.send-mail {
  width: 10px;
  position: relative;
}

.send-mail label {
  text-align: center;
  top: -30px !important;
  left: -50px !important;
}

.popup-dialog__card-text {
  background: white;
  border-radius: 4px;
  padding: 0 !important;
  overflow: hidden !important;
}

.v-data-table table th {
  background: #DFDFDF !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.break {
  word-break: break-all;
}
</style>
