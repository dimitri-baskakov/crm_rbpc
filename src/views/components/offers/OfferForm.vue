<template>
  <div class="pa-0">
    <div style="float: right;">
      <div
        class="template-offers"
        v-if="showTemplateOffers"
      >
        <v-list
          class="template-offers-list rounded elevation-5 pa-0"
          dense
          v-click-outside="closeTemplateOffers"
        >
          <v-list-item
            :key="index"
            @click="setOffer(templateOffer)"
            class="template-offers-name rounded"
            v-for="(templateOffer, index) of templateOffers"
          >
            <v-list-item-content>
              <v-list-item-title class="d-flex flex-row">
                <span
                  class="flex-grow-1 flex-shrink-0 mr-2"
                  style="border-bottom: 1px solid lightgrey;"
                >
                  {{ templateOffer.name }}
                </span>
                <div class="counting-box mx-2 pa-0 px-1">
                  <div class="heading">
                    {{ templateOffer.products && templateOffer.products.length || '0' }}
                  </div>
                </div>
                <span
                  class="font-weight-black mx-2"
                  style="border-bottom: 1px solid lightgrey; min-width: 70px"
                >
                  ₪ {{ templateOffer.amount }}
                </span>
                <v-icon
                  @click.stop="removeTemplateOffer(templateOffer)"
                  class="ml-2"
                  style="float: right"
                  tag="a"
                >mdi-close</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </div>
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
                  @click="getCategoryProducts({show_all_products_in_purchase: showAllProductsPurchase === 'category' ? 'all' : 'category'})"
                  class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  small
                  plain
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
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="getCategoryProducts({show_deleted_products: (showDeletedProducts === 'active' && 'all') || (showDeletedProducts === 'all' && 'trashed') || 'active'})"
                  class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  small
                  plain
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
                    :key="offerProducts.length"
                    class="counting-box category-producte__counting-box d-flex justify-center align-center pa-0"
                  >
                    <div class="heading font-8">
                      {{ offerProducts.length || '0' }}
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
          :style="isNotNewStatus ? 'pointer-events: none;' : ''"
          class="align-center d-flex flex-nowrap"
          style="width: 100%;"
        >
          <div class="font-12" style="cursor: pointer;" @click="setAmount(amountSaved)">
            ₪ {{ amountSaved | toFix }}
          </div>
          <v-menu
            class="category-products__tooltip-menu"
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
                :color="offer.note == null ? 'black' : 'primary'"
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
                v-model="offer.note"
              ></v-textarea>
            </v-list>
          </v-menu>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <div
                class="counting-circle category-products__counting-circle d-flex align-center justify-center"
                v-bind="attrs"
                v-on="on"
              >
                <div class="heading font-8">{{ manufacturerDelivers.length || '0' }}</div>
              </div>
            </template>
            <span class="font-8">{{ $t('manufacturersCount') }}</span>
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
            hide-details
            height="18px"
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
          :disabled="isNotNewStatus"
          @click="resetFilter"
          color="black"
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
              style="background: transparent;"
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
          :activeCategories="activeCategories"
          :activeCategoryId="activeCategoryId"
          :categoryTree="categoryTree"
          :mode="'products'"
          class="category-form__categories-wrapper font-12"
          @input="getSelectedCategory"
          style="overflow-y: scroll; overflow-x: hidden; height: 100%;"
          v-if="!isNotNewStatus"
        ></category-tree>
      </v-col>
      <v-col
        class="ml-1 pa-1 rounded white category-form__content"
        style="height: 100%;"
      >
        <category-products
          :category_id="activeCategoryId"
          :groupsData="!isNotNewStatus ? categoryProducts : {}"
          :isNotNewStatus="isNotNewStatus"
          :manufacturerNames="manufacturerNames"
          :searchText="search"
          :style="isNotNewStatus ? 'pointer-events: none;' : ''"
          :warranties="warranties"
          style="overflow: hidden; height: 100%;"
        ></category-products>
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
                :label="$t('offerDate')"
                class="category-products__offer-date offer-date pb-1"
                height="25px"
                hide-details
                plain
                type="date"
                v-model="offer.date"
              ></v-text-field>
            </v-col>
            <v-col
              class="px-1 rounded white ml-1 category-products__fields-textField"
              style="width: calc(50% - 2.25px) !important;"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('date_available')"
                class="offer-date pb-1"
                height="25px"
                hide-details
                type="date"
                v-model="offer.date_available"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            class="rounded mt-2 pa-1"
            style="background: #B9D2EA;"
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
                v-if="offer"
                v-model="offer.client_name"
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
              class="pb-1 px-1 mb-1 rounded white category-products__fields-textField"
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
                v-if="offer"
                v-model="offer.client_he_fullname"
              >
                <template #item="{ item }">
                  <div style="text-align: right; width: 100%;" dir="rtl">{{ `${item.surname || '-'} ${item.he_name || '-'}` }}</div>
                </template>
              </v-autocomplete>
            </v-col>
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
                v-if="offer"
                v-model="offer.client_email"
              ></v-text-field>
            </v-col>
            <v-col
              class="align-center d-flex ml-1 rounded white category-products__fields-textField"
              style="width: 32px !important;"
            >
              <v-tooltip top open-delay="400">
                <template #activator="{ on, attrs }">
                  <v-btn
                    :color="offer.send_mail ? 'primary' : 'black'"
                    :style="isNotNewStatus ? 'pointer-events: none;' : ''"
                    @click="offer.send_mail = !offer.send_mail"
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
            <v-col
              class="pb-1 px-1 mt-1 rounded white category-products__fields-textField"
              style="width: 100% !important;"
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
                v-if="offer"
                v-model="offer.client_he_firm_passport"
              >
                <template #item="{ item }">
                  <div style="text-align: right; width: 100%;" dir="rtl">{{ `${item.company_name || '-'} ${item.passport || '-'}` }}</div>
                </template>
              </v-autocomplete>
            </v-col>
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
                    :value="offer.vat_price | toFix"
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
                v-if="calculateMode === 'auto'"
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
                    :color="calculateMode === 'auto' ? 'primary' : 'black'"
                    @click="changeCalculateMode(calculateMode === 'auto' ? 'manual' : 'auto')"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>
                      {{ calculateMode === 'auto' ? 'mdi-check-circle-outline' : 'mdi-circle-outline' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ calculateMode === 'auto' ? $t('autoMode') : $t('manualMode') }}</span>
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
                    :disabled="isNotNewStatus || !offer.delivery"
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
                    :color="offer.delivery ? 'primary' : 'black'"
                    @click="offer.delivery = !offer.delivery"
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
                v-if="calculateMode === 'auto'"
                v-model="autoMargin"
              ></v-text-field>
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('marginWithVatManual')"
                height="25px"
                hide-details
                v-else
                v-model="offer.manual_margin"
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
                    :color="offer.visa ? 'primary' : 'black'"
                    @click="offer.visa = !offer.visa"
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
                <span>Виза {{ offer.visa_percent }}% - это наценка на конечную стоимость, взята из настроек.</span>
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
                v-model="offerAmountWithoutVat"
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
                    :color="!offer.payment ? 'black' : 'primary'"
                    @click="offer.payment = !offer.payment"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>
                      {{ (offer.payment && 'mdi-bank-off') || 'mdi-bank' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ (offer.payment && `Оплата товаров поставщику визой.`) || 'Оплата товаров поставщику банковским переводом.' }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row
            :style="!offer.client_id ? 'pointer-events: none; color: white;' : ''"
            class="rounded mt-2 mb-4 pa-1 category-products__file-upload"
            no-gutters
          >
            <v-col class="align-center rounded white">
              <div>
                <VueFullScreenFileDrop @drop='onDrop'/>
                <v-row class="ma-0 pa-0 text-center">
                  <v-col 
                  cols="5"
                  class="pa-0">
                    <div
                      :class="{ 'primary--text': offerFilesGroup === 1 }"
                      :style="offerFilesGroup === 1 && 'background: #CCE3FF;'"
                      @click="offerFilesGroup = 1"
                      class="pa-1 rounded grey--text category-products__file-upload-type"
                      style="background: #EEEEEE; cursor: pointer;"
                    >{{ $t('documents') }}</div>
                  </v-col>
                  <v-col 
                  cols="3"
                  class="mx-0 pa-0"
                  >
                    <div
                      :class="{ 'primary--text': offerFilesGroup === 2 }"
                      :style="offerFilesGroup === 2 && 'background: #CCE3FF;'"
                      @click="offerFilesGroup = 2"
                      class="pa-1 rounded grey--text category-products__file-upload-type"
                      style="background: #EEEEEE; cursor: pointer;"
                    >{{ $t('another') }}</div>
                  </v-col>
                  <v-col 
                  cols="4"
                  class="pa-0"
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
                    v-for="file of (offer.offerFiles && offer.offerFiles.filter(sf => sf.group === offerFilesGroup)) || []"
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
                            @click="openFileDialog(file.src)"
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
                            :disabled="file.fileName && file.fileName.includes(`offer-${offer.offer_number}`)"
                            @click="removeOfferFile(file)"
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
        <offer-products
          :isNotNewStatus="isNotNewStatus"
          :manufacturerNames="manufacturerNames"
          :offer="offer"
          :offerProducts="offerProducts"
          :warranties="warranties"
          style="overflow: hidden; height: 100%;"
        ></offer-products>
      </v-col>
    </v-row>
    <div
      @wheel.prevent="(event) => { dragPosition -= event.deltaY/20 }"
      style="position: absolute; top: 7vh; right: -60px; z-index: 4; height: 80vh;"
    >
      <!-- dense -->
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

    <v-dialog v-model="dialogForTemplate" persistent max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-text-field
              label="Введите имя"
              v-model="templateOfferName"
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="dialogForTemplate = false">
            Закрыть
          </v-btn>
          <v-btn color="success" text @click="createTemplate(templateOfferName)" :disabled="!templateOfferName">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
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
                :disabled="!offerProducts.length"
                :loading="requestStatus === 'loading'"
                @click="saveOffer"
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
              v-model="offer.note"
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
        :client="Object.assign({}, client)"
        :disable-search="true"
      />
    </v-dialog>

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
          class="d-flex justify-end"
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
            :category="product.root_category"
            :categorySelect="categorySelect"
            :product="product"
            ref="categoryProductForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-model="fileDialog"
      width="90vw"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;"
      >
        <div
          color="transparent"
          dark
          class="d-flex flex-nowrap"
          style="position: absolute; top: -45px; right: -65px;"
          dir="rtl"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="fileDialog = false"
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
          <v-spacer></v-spacer>
          <v-btn
            :href="fileDialogSrc"
            target="_blank"
            class="black--text pa-4 my-0"
            color="#B9D2EA"
            small
          >
            <div class="py-3">{{ fileDialogSrc }}</div>
          </v-btn>
        </div>
        <v-card-text
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA; height: 100vh;"
        >
          <v-container>
            <iframe
              :src="`https://docs.google.com/viewer?url=${fileDialogSrc}&embedded=true`"
              frameborder="0"
              style="width: 100%; height: 90vh;"
              v-if="fileDialog"
            ></iframe>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueFullScreenFileDrop from '../../../helpers/vue-full-screen-file-drop'
import handleFilesMixin from "@/mixins/handleFiles"
import paginationMixin from "@/mixins/paginations"
import toFix from "../../../filters/toFix"
import {debounce} from 'vue-debounce'
import {mapGetters} from 'vuex'

const dFn = debounce(fn => fn(), '400ms')

export default {
  name: "OfferForm",
  components: {
    CategoryGroups: () => import("./CategoryGroups"),
    CategoryProductForm: () => import("../../components/category/CategoryProductForm"),
    CategoryProducts: () => import("./CategoryProducts"),
    CategoryTree: () => import("../category/CategoryTree"),
    ClientForm: () => import("../../components/clients/ClientForm"),
    OfferProducts: () => import("./OfferProducts"),
    VueFullScreenFileDrop,
  },

  props: {
    offer: Object,
    noClientUnset: Boolean,
  },
  mixins: [paginationMixin, handleFilesMixin],
  data () {
    return {
      addClientDialog: false,
      addNoteDialog: false,
      calculateMode: 'auto',
      delivers: [],
      dialogForTemplate: false,
      disabledStatus: false,
      dragPosition: 0,
      fileDialog: false,
      fileDialogSrc: null,
      files: [],
      innerHeight: 900,
      offerFilesGroup: 1,
      propertyIds: {},
      search: '',
      searchText: '',
      selectedCategories: [],
      selectedCategory: null,
      showAvailableProducts: 'all',
      showCategoryFilters: false,
      showDeletedProducts: 'active',
      showManufacturerDeliver: false,
      showTemplateOffers: false,
      specificationIds: [],
      templateOfferName: null,
      vendorIds: [],
      warranties: [],
    }
  },

  filters: {
    toFix,
  },

  computed: {
    ...mapGetters([
      'activeCategories',
      'activeCategoryId',
      'categoryGroups',
      'categoryProducts',
      'categorySelect',
      'categoryTree',
      'client',
      'allClients',
      'dialog',
      'filters',
      'manufacturerNames',
      'manufacturers',
      'offerProducts',
      'offers',
      'product',
      'requestStatus',
      'showAllProductsPurchase',
      'templateOffers',
      'vendors',
    ]),

    manufacturerDelivers() {
      let manufacturerDelivers = []
      if (this.offerProducts.length && this.manufacturers && this.manufacturers.length) {
        let offerManufacturerNames = this.offerProducts.map(p => (!!p && p.manufacturer && p.manufacturer.name) || (!!p && p.manufacturer) || (!!p && p.manufacturer_id))
        manufacturerDelivers = this.manufacturers.filter(manufacturer => !!offerManufacturerNames.find(name => name == manufacturer.name || name == manufacturer.id))
      }
      return manufacturerDelivers
    },

    productsMargin () {
      let offerVatPrice = 0
      let offerMarginalPrice = 0
      if (this.offerProducts && this.offerProducts.length && this.manufacturers && this.manufacturers.length) {
        offerVatPrice = this.offerProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.var_price) *
              parseFloat(product.qty)
            )
          ) || 0, 0)
        offerMarginalPrice = this.offerProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.marginal_price) *
              parseFloat(product.qty)
            )
          ) || 0, 0)
      }
      return (parseFloat(offerMarginalPrice || 0) - parseFloat(offerVatPrice || 0))
    },

    result1 () {
      let result1 = parseFloat(this.offer.vat_price || 0) + ((this.offer.delivery && parseFloat(this.manufacturerDeliverCost)) || 0)
      return result1
    },

    result2 () {
      let result2 = parseFloat(this.result1) + parseFloat((this.calculateMode === 'auto' ? this.productsMargin : this.offer.manual_margin) || 0)
      return result2
    },

    amountNew () {
      if (this.isNotNewStatus) {
        return this.offer.amount
      }
      let amountNew = this.result2 * ((this.offer.visa && (100 + parseFloat(this.offer.visa_percent)) / 100) || 1)
      return Math.round(amountNew * 100) / 100
    },

    manufacturerDeliverCost() {
      if (this.isNotNewStatus) {
        return this.offer.delivery_cost
      }
      let deliverCost = this.manufacturerDelivers.reduce((total, manufacturer) => {
        return total + Number.parseFloat(manufacturer.deliver_cost) || 0
      }, 0) * (this.offer.payment ? (100 + parseFloat(this.offer.payment_percent || 0)) / 100 : 1)
      return Math.round((deliverCost * 117 / 100) * 100) / 100
    },

    isNotNewStatus() {
      return this.offer.status !== 'new'
    },

    autoMargin: {
      get: function () {
        let amount = Number.parseFloat(this.offer.amount) * ((this.offer.visa && 100 / (100 + Number.parseFloat(this.offer.visa_percent))) || 1)
        let autoMargin = ((amount - ((this.offer.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.offer.vat_price)) || 0)
        return Math.round(autoMargin * 100) / 100
      },
      set: function (newVal) {
        this.offer.amount = parseFloat(newVal || 0)
      }
    },

    autoMarginWithoutVat () {
      return Math.round((Number.parseFloat(this.autoMargin || 0) / 117 * 100) * 100) / 100
    },

    manualMargin: {
      get: function () {
        return Math.round(((Number.parseFloat(this.offer.amount) * ((this.offer.visa && 100 / (100 + Number.parseFloat(this.offer.visa_percent))) || 1) - ((this.offer.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.offer.vat_price)) || 0) * 100) / 100 || null
      },
      set: function (newVal) {
        this.offer.amount = Math.round(((this.offer.amount + Number.parseFloat(newVal)) || 0) * 100) / 100 || null
      },
    },

    manualMarginWithoutVat: {
      get: function() {
        return Math.round((Number.parseFloat(this.offer.manual_margin || 0) / 117 * 100) * 100) / 100 || null
      },
      set: function(newVal) {
        this.offer.manual_margin = Math.round((Number.parseFloat(newVal || 0) * 100 / 117) * 100) / 100 || null
      }
    },

    offerAmountWithoutVat: {
      get: function () {
        return Math.round((Number.parseFloat(this.offer.amount || 0) / 117 * 100) * 100) / 100 || null
      },
      set: function (newVal) {
        this.offer.amount = Math.round((Number.parseFloat(newVal || 0) * 117 / 100) * 100) / 100
      },
    },

    'offer.marginal_price': {
      get: function () {
        if (this.offerProducts && this.offerProducts.length) {
          return this.offerProducts.reduce((total, product) => total + parseFloat(product.marginal_price) * parseFloat(product.qty), 0)
        } else {
          return 0
        }
      },
      set: function (newVal) {
        this.offer.marginal_price = Math.round(((Number.parseFloat(newVal)) || 0) * 100) / 100
      },
    },

    amountSaved () {
      let offer = this.offers && this.offers.data ? this.offers.data.find(o => o.id === this.offer.id) || {} : {}
      return offer.amount || 0
    },
  },

  async created() {
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

    this.$store.dispatch('getTemplateOffers')
    this.$store.dispatch('getCategoryTree')
    this.$store.dispatch('getManufacturers', {all: true})
    this.$eventHandle.$on('change-per-page-products', (perPage) => {
      this.perPage = perPage
      this.getCategoryProducts();
    })

    if (!!this.offer.offerFiles) {
      this.offer.offerFiles = this.offer.offerFiles.map(file => {
        file.fileName = file.src.split('/').pop()
        return file
      })
    }

    this.$eventHandle.$on('change-page-products', (page) => {
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

    if (!this.offer.offer_number) {
      this.offer.offer_number = this.getNewOfferNumber()
    }

    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
      this.offerProducts.map(product => {
        let productWarranty = parseInt(product.warranty, 10)
        if (!!productWarranty) {
          if (!this.warranties.find(w => w.value === productWarranty)) {
            this.warranties.push({name: product.warranty, value: productWarranty})
          }
          product.warranty = productWarranty
        }
        return product
      })
    })

    this.$store.dispatch('getSettings', {settingsName: 'settingsVisa'}).then((data) => {
      this.offer.visa_percent = data.value
    })
    this.$store.dispatch('getSettings', {settingsName: 'settingsPayment'}).then((data) => {
      this.offer.payment_percent = data.value
    })

    this.$eventHandle.$on('updateVatPriceCost', (offerVatPriceCost) => this.updateVatPriceCost(offerVatPriceCost))
    this.$eventHandle.$on('updateMarginalCost', (marginalCost) => this.updateMarginalCost(marginalCost))
    this.$eventHandle.$on('updateOfferCost', () => {
      let offerVatPriceCost = this.offerProducts.reduce((accumulator, currentValue) => {
        return accumulator + (parseFloat(currentValue.var_price) * currentValue.qty);
      }, 0)
      let offerMarginalCost = this.offerProducts.reduce((accumulator, currentValue) => {
        return accumulator + (parseFloat(currentValue.marginal_price) * currentValue.qty);
      }, 0)
      this.updateVatPriceCost(offerVatPriceCost)
      this.updateMarginalCost(offerMarginalCost)
    })

    this.offer.client_id && this.$store.dispatch('getClient', {id: this.offer.client_id})

    this.offer && this.offer.id && this.changeCalculateMode(this.offer.auto_margin && 'auto' || 'manual')

    this.$store.dispatch('getClients', {all: true})

    this.setEventProduct()

    this.$eventHandle.$on('set-dialog', (payload) => this[payload.name] = payload.value);
    this.$eventHandle.$on('save-client', (payload) => {
      if (payload && payload.id) {
        this.$store.dispatch('getClients', {all: true})
        this.$store.dispatch('getClient', {id: payload.id})
        this.offer.client_id = payload.id
      }
    });

    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersCategoryProductsOffer'})

    await this.$store.dispatch('getVendors', {all: true})
    if (!this.isNotNewStatus) {
      this.calculatePrice()
    }
    if (this.offer.visa === null) {
      this.offer.visa = true
    }
    if (this.offer.delivery === null) {
      this.offer.delivery = true
    }
    if (this.offer.payment === null) {
      this.offer.payment = true
    }
    if (this.offer.auto_margin === null) {
      this.offer.auto_margin = true
    }
    if (this.offer.auto_margin !== null) {
      this.calculateMode = (this.offer.auto_margin === true && 'auto') || 'manual'
    }

    this.setAmount(this.amountSaved)
  },

  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, {passive: true})
    for (let [index, filter] of this.filters.entries()) {
      this.propertyIds[index] = []
    }
    this.offerFilesGroup = 1
  },

  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true})
    }
  },

  destroyed() {
    if (this.$route.path == '/categories') {
      return
    }
    this.$eventHandle.$off('change-page-products')
    this.$eventHandle.$off('change-params')
    this.$eventHandle.$off('change-per-page-products')
    this.$eventHandle.$off('disable-status')
    this.$eventHandle.$off('save-client')
    this.$eventHandle.$off('save-product')
    this.$eventHandle.$off('updateMarginalCost')
    this.$eventHandle.$off('updateOfferCost')
    this.$eventHandle.$off('updateVatPriceCost')
    this.$store.commit('setOfferProducts', [])
    this.$store.commit('setCategoryProducts', [])
    this.$store.commit('setCategories', null)
    this.$store.commit('setManufacturerNames', [])
    this.$store.commit('setManufacturers', [])
    this.$store.commit('setActiveCategoryId', null)
    this.$store.commit('setActiveCategories', [])
    this.$store.commit('setSettings', [])
    !this.noClientUnset && this.$store.commit('setClient', {})
  },

  methods: {
    onResize() {
      this.innerHeight = window.innerHeight - 100
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

    async getCategoryFilters() {
      await this.$store.dispatch('getVendors', {
        categoryId: this.activeCategoryId,
      })
      await this.$store.dispatch('getCategoryFilters', {
        category_id: this.activeCategoryId,
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
      let marginalOfferPrice = 0
      let productsPrice = 0
      if (this.offerProducts && this.offerProducts.length) {
        productsPrice = this.offerProducts.reduce((total, product) => total + (product && (parseFloat(product.var_price) * parseFloat(product.qty)) || 0), 0)
        marginalOfferPrice = this.offerProducts.reduce((total, product) => total + parseFloat(product.marginal_price) * parseFloat(product.qty), 0)
      }
      this.offer.delivery_cost = this.manufacturerDeliverCost

      if (this.offerProducts && this.offerProducts.length && this.manufacturers && this.manufacturers.length) {
        let offerVatPrice = this.offerProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.var_price) *
              parseFloat(product.qty)
            )
          ) || 0, 0) * (this.offer.payment ? (100 + parseFloat(this.offer.payment_percent || 0)) / 100 : 1)
        this.updateVatPriceCost(Math.round(offerVatPrice * 100) / 100)
        let offerMarginalPrice = this.offerProducts.reduce(
          (total, product) => total + (
            product && (
              parseFloat(product.marginal_price) *
              parseFloat(product.qty)
            )
          ) || 0, 0)
        this.updateMarginalCost(Math.round(offerMarginalPrice * 100) / 100)
      }

      this.offer.amount = Number.parseFloat(this.offer.vat_price || 0)

      if (this.calculateMode === 'manual') {
        this.offer.amount += Number.parseFloat(this.offer.manual_margin || 0)
      } else {
        this.offer.amount += Number.parseFloat(marginalOfferPrice - productsPrice)
      }
      if (this.offer.delivery) {
        this.offer.amount += Number.parseFloat(this.manufacturerDeliverCost || 0)
      }
      if (this.offer.visa) {
        this.offer.amount = this.offer.amount * (100 + Number.parseFloat(this.offer.visa_percent)) / 100
      }
      this.offer.amount = Math.round(this.offer.amount * 100) / 100
    },

    setDisableStatus() {
      if (this.offer.status === 'store') {
        this.disabledStatus = true;
      }
    },

    updateVatPriceCost(vatPriceCost) {
      this.offer.vat_price = vatPriceCost
    },

    updateMarginalCost(marginalCost) {
      this.offer.marginal_price = marginalCost
    },

    // updateManualMargin(manualMargin) {
    //   this.offer.manual_margin = (manualMargin / 100 * 17) + Number(manualMargin)
    //   // this.offer.amount = Number.parseFloat(this.offer.vat_price) + Number.parseFloat(this.offer.manual_margin)
    // },

    closeManufacturerDeliver() {
      this.showManufacturerDeliver = false
    },

    async getSelectedCategory(data) {
      this.search = null
      this.vendorIds = []
      this.selectedCategory = data.category
      this.selectedCategories = data.selectedCategories
      this.$store.commit('setActiveCategoryId', this.selectedCategory.id)
      this.$store.commit('setActiveCategories', this.selectedCategories)
      this.page = 1
      dFn(this.getCategoryProducts)
      await this.getCategoryFilters()
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
      params.pageName = 'offer'
      // params.mode = 'groupProducts'
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
        // delete params.show_all_products_in_purchase
        delete params.category_id
        delete params.specificationIds
        delete params.propertyIds
        // this.$store.commit('setActiveCategoryId', null)
        // this.$store.commit('setActiveCategories', [])
        // this.$store.commit('setCategories', null)
      }
      let result = await this.$store.dispatch('getCategoryProducts', params)
      if (result.data && result.data.meta) {
        this.showDeletedProducts = result.data.meta.showDeletedProducts
        this.showAvailableProducts = result.data.meta.showAvailableProducts
      }
    },

    closeModal() {
      this.$store.commit('setDialogMain', false)
      this.$eventHandle.$emit('set-dialog', { name: 'addOfferDialog', value: false })
    },

    async saveOffer() {
      let cartOfferId = await this.$store.dispatch('getSettings', {settingsName: 'cartOfferId'})
      cartOfferId = cartOfferId[0] && cartOfferId[0].value || null
      if (cartOfferId && this.offer.id == cartOfferId) {
        await this.$store.dispatch('saveSetting', {
          cartOfferId: null,
        })
      }

      this.offer.products = this.offerProducts.map(pr => {
        return {
          group_id: pr.group_id,
          id: pr.id,
          percent: pr.percent,
          price: pr.price,
          qty: pr.qty,
          warranty: pr.warranty,
          producer_price: pr.producer_price,
          marginal_price: pr.marginal_price,
        }
      })

      this.offer.files = this.files

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

      let offerProductIds = this.offerProducts.map(offerProduct => offerProduct.id)
      await this.$store.dispatch('saveOfferProductsPositions', {offer_id: this.offer.id, offerProductIds})

      await this.$store.dispatch('getOffer', this.offer)
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

      if (!!this.offer.offerFiles) {
        this.offer.offerFiles = this.offer.offerFiles.map(file => {
          file.fileName = file.src.split('/').pop()
          return file
        })
      }
      this.files = []

      this.offer.client_he_firm_passport = this.client
      this.offer.client_he_fullname = this.client

      this.setAmount(this.amountSaved)
    },

    setOfferDeliverCost(e, manufacturer) {
      // this.manufacturerDelivers.find(m => m.id === manufacturer.id) = !e.target.checked
      // if (e.target.checked) {
      //   this.manufacturerDelivers.push(manufacturer)
      // } else {
      //   this.manufacturerDelivers = this.manufacturerDelivers.filter(m => m.id === manufacturer.id)
      // }
      // if (e.target.checked) {
      //   this.manufacturerDelivers.push(manufacturer)
      // } else {
      //   this.manufacturerDelivers = this.manufacturerDelivers.filter(m => m.id === manufacturer.id)
      // }
    },

    changeCalculateMode(mode) {
      this.calculateMode = mode
      this.offer.auto_margin = (mode != 'manual')
      if (mode === 'manual') {
        this.updateVatPriceCost(this.offer.vat_price)
      } else {
        this.updateMarginalCost(this.offer.marginal_price)
      }
    },

    closeTemplateOffers() {
      this.showTemplateOffers = false
    },

    setOffer(templateOffer) {
      if (
        !this.offer.id ||
        this.offer.status === 'completed'
      ) {
        templateOffer.offer_number = this.getNewOfferNumber()
      } else {
        templateOffer.offer_number = this.offer.offer_number
        templateOffer.date = this.offer.date
      }

      let products = templateOffer.products.map(product => {
        product.qty = product.pivot.qty
        product.price = product.pivot.price
        product.warranty = product.pivot.warranty
        product.percent = product.pivot.percent
        product.groupProducts = (product.group && product.group.products) || []
        product.manufacturer = product.manufacturer_id
        // product.producer_price = product.pivot.producer_price
        // product.marginal_price = product.pivot.marginal_price

        return product
      })

      templateOffer.status = 'new'
      templateOffer.visa = true
      templateOffer.delivery = true
      templateOffer.payment = true
      templateOffer.visa_percent = this.offer.visa_percent
      templateOffer.payment_percent = this.offer.payment_percent
      templateOffer.id = this.offer.id
      if (this.client) {
        templateOffer.client_id = this.client.id
        templateOffer.client_email = this.client.person && this.client.person.email
        templateOffer.client_he_name = this.client.person && this.client.person.he_name
        templateOffer.client_name = this.client.person && this.client.person.name
        templateOffer.client_surname = this.client.person && this.client.person.surname
        templateOffer.client_passport = this.client.passport
        templateOffer.client_mobile_phone = this.client.person && this.client.person.mobile_phone
        templateOffer.client_he_fullname_firm = this.client.person && (this.client.person.he_name || this.client.person.surname || this.client.person.company_name) && `${this.client.person.he_name || ''} ${this.client.person.surname || ''} / ${this.client.person.company_name || ''}` || ''
      }

      this.$store.commit('setOfferProducts', products)
      this.$store.commit('setOffer', {...templateOffer})
      this.showTemplateOffers = false
    },

    removeTemplateOffer(templateOffer) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          this.$store.dispatch('deleteOfferTemplate', templateOffer.id)
        }
      })
    },

    offerCleaning() {
      this.$eventHandle.$emit('sync-selected-products', []);
      this.$store.commit('setOfferProducts', [])
    },

    createTemplate(templateOfferName) {
      this.dialogForTemplate = false
      let offer = this.offer
      offer.id = null
      offer.offer_name = templateOfferName
      offer.products = this.offerProducts
      this.$store.dispatch('saveOfferTemplate', offer)
      this.$store.dispatch('getTemplateOffers')
    },

    setEventProduct () {
      this.$eventHandle.$on('save-product', (product) => {
        this.$store.dispatch('saveProduct', product).then((response) => {
          // let products = this.categoryProducts
          // let newProduct = response.data
          // newProduct.manufacturer = !!newProduct.manufacturer ? newProduct.manufacturer.name : ''
          // if (products) {
          //   if (!!product.id) {
          //     Object.assign(products.data.find(p => product.id === p.id), newProduct)
          //   } else {
          //     products.data.unshift(newProduct)
          //   }
          // }
          // this.$store.commit('setCategoryProducts', products)
          this.$store.dispatch('resetCategoryCache')
        })
      })
    },

    changeClient (client) {
      if (this.offer.status !== 'new') {
        this.offer.offer_number = this.getNewOfferNumber()
      }
      this.offer.status = 'new'
      if (client && client.id) {
        this.$store.dispatch('getClient', {id: client.id})
      } else {
        this.$store.commit('setClient', {})
      }
    },

    clearClient () {
      if (this.offer.status !== 'new') {
        this.offer.offer_number = this.getNewOfferNumber()
      }
      this.offer.status = 'new'
      this.$store.commit('setClient', {})
    },

    getNewOfferNumber () {
      let now = new Date()
      this.offer.date = `${now.getFullYear()}-${(now.getMonth()+101).toString().substring(1)}-${(now.getDate()+100).toString().substring(1)}`
      let offerNumber = this.offers.data.map(of => of.offer_number)
      return offerNumber.length ? Math.max.apply(null, offerNumber) + 1 : 120121
    },

    async buildSale() {
      await this.$store.dispatch('buildSale', this.offer)
    },

    clearSearch () {
      this.search = null
      this.$eventHandle.$emit('change-params', {page: 1})
    },

    onDrop(formData, files) {
      this.files = [...files, ...this.files]
      // this.files = [...files.forEach(f => f.group = this.offerFilesGroup), ...this.files]
    },

    addDocs(event) {
      this.files = [...event.target.files, ...this.files]
      // this.files = [...event.target.files.forEach(f => f.group = this.offerFilesGroup), ...this.files]
    },

    allDownload() {
      for (let file of this.offer.offerFiles) {
        this.forceDownload(file.src, file.fileName)
      }
    },

    removeOfferFile(file) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          this.offer.offerFiles = this.offer.offerFiles.filter(f => f.id !== file.id)
        }
      })
    },

    openFileDialog(src) {
      this.fileDialog = true
      this.fileDialogSrc = src
    },

    changeAmount ($event, oldVal) {
      if (this.offer.auto_margin) {
        this.offer.amount = parseFloat($event.target.value)
      } else {
        this.offer.manual_margin = parseFloat(this.offer.manual_margin || 0) + (parseFloat($event.target.value) - parseFloat(oldVal)) * ((this.offer.visa && 100 / (100 + parseFloat(this.offer.visa_percent))) || 1)
      }
    },

    setAmount (newVal) {
      if (this.offer.auto_margin) {
        this.offer.amount = parseFloat(newVal)
        let elem = this.$refs.amountNew.$el
        let inputEl = elem.querySelector('input')
        inputEl.value = newVal
      } else {
        this.offer.manual_margin = parseFloat(this.offer.manual_margin || 0) + (parseFloat(newVal) - parseFloat(this.amountNew)) * ((this.offer.visa && 100 / (100 + parseFloat(this.offer.visa_percent))) || 1)
      }
    },
  },

  watch: {
    'offer.auto_margin': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.products': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.manual_margin': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.marginal_price': function (val, oldVal) {
      this.updateMarginalCost(this.offer.marginal_price)
      this.updateVatPriceCost(this.offer.vat_price)
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.vat_price': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.visa': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.payment': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.delivery': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'offer.status': function (val, oldVal) {
      if (val === 'new' && oldVal === 'completed') {
        this.offer.offer_number = this.getNewOfferNumber()
      }
    },
    'offer.amount': function (val, oldVal) {
      if (this.calculateMode === 'manual') {
        this.offer.manual_margin = this.manualMargin
      }
    },
    manufacturerDeliverCost: function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    client: function(val, oldVal) {
      this.offer.client_email = (val.person && val.person.email) || null
      this.offer.client_he_fullname_firm = val.person && (val.person.he_name || val.person.surname || val.company_name) && `${val.person.he_name || ''} ${val.person.surname || ''} / ${val.company_name || ''}` || ''
      this.offer.client_he_name = (val.person && val.person.he_name) || null
      this.offer.client_id = val.id
      this.offer.client_mobile_phone = (val.person && val.person.mobile_phone) || null
      this.offer.client_name = (val.person && val.person.name) || null
      this.offer.client_passport = val.passport
      this.offer.client_surname = (val.person && val.person.surname) || null
      this.offer.client_he_firm_passport = val
      this.offer.client_he_fullname = val
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

.template-offers {
  position: relative;
}

.template-offers-list {
  position: absolute;
  overflow: auto;
  max-height: 45vh;
  right: 130px;
  top: 10px;
  min-width: 600px;
  background: white;
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.template-offers-name:hover {
  background: #eeeeee;
  cursor: pointer;
}

.visa {
  width: 10px;
  position: relative;
}

.visa label {
  top: -20px !important;
  left: -34px !important;
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

/* .v-data-table table th {
  background: #DFDFDF !important;
  text-overflow: ellipsis;
  white-space: nowrap;
} */
</style>
