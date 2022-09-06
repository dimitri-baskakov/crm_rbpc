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
                  @click="getCategoryProducts({show_all_products_in_assembly: showAllProductsAssembly === 'category' ? 'all' : 'category'})"
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
                    {{ showAllProductsAssembly === 'category' ? 'mdi-eye-off' : 'mdi-eye' }}
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ showAllProductsAssembly === 'category' ? 'все товары' : 'товары категории' }}
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
            <v-tooltip bottom open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="!selectedCategory"
                  @click="$eventHandle.$emit('edit-category', selectedCategory)"
                  class="pa-0 category-products__tooltip-buttons"
                  color="black"
                  icon
                  plain
                  small
                  style="background: white;"
                  tag="a"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-circle-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>редактировать категорию</span>
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
                    :key="assemblyProducts.length"
                    class="counting-box category-producte__counting-box d-flex justify-center align-center pa-0"
                    style="width: auto !important;"
                  >
                    <div class="heading font-8">
                      {{ assemblyProducts.filter(p => p && p.pivot.main).length }} / {{ assemblyProducts.length || '0' }}
                    </div>
                  </div>
                </v-fab-transition>
              </div>
            </template>
            <span class="font-8">{{ $t('products_count') }}</span>
          </v-tooltip>
          <!-- <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <div
                  class="counting-box pa-0 px-1"
                >
                  <div class="heading">
                    {{ assemblyProductsCategoriesCount || '0' }}
                  </div>
                </div>
              </div>
            </template>
            <span>{{ $t('products_count') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <div
                class="counting-circle d-flex align-center justify-center mx-2"
                v-bind="attrs"
                v-on="on"
              >
                <div class="heading">{{ manufacturerDelivers.length || '0' }}</div>
              </div>
            </template>
            <span>{{ $t('manufacturersCount') }}</span>
          </v-tooltip> -->
        </div>
      </v-col>
      <v-col
      class="align-center d-flex flex-nowrap category-products__tooltip-col"
      style="width: 100%;"
      cols="2"
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
              style=" background: transparent;"
          top
        >
          <template #activator="{ on, attrs }">
            <v-btn
              :color="assembly.note == null ? 'black' : 'primary'"
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
              v-model="assembly.note"
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
              <div class="font-8">{{ manufacturerDelivers.length || '0' }}</div>
            </div>
          </template>
          <span class="font-8">{{ $t('manufacturersCount') }}</span>
        </v-tooltip>
        <v-tooltip top open-delay="400">
          <template #activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <div
                class="counting-hexagon category-producte__counting-hexagon mx-2"
              >
                <div class="font-8 heading"
                >
                  {{ assemblyProductsCategoriesCount || '0' }}
                </div>
              </div>
            </div>
          </template>
          <span>{{ $t('sectionsCount') }}</span>
        </v-tooltip>
        <div>
          <span
            class="text-center font-12"  
            style="color:#F15A24"
            v-if="!assembly.detectStatus"
          >
            {{ $t('unavailable') }}
          </span>
        </div>
      </v-col>
      <v-col
        class="align-center d-flex justify-space-between pl-0 category-products__tooltip-col"
        cols="6"
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
        cols="12"
        md="2"
      >
        <v-btn
          :disabled="isNotNewStatus"
          class=" category-products__tooltip-reset"
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
      :style="`height: calc(${(45 - dragPosition)}vh - 22px);`"
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
            class=" rounded filters-expansion-panel"
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
      :style="`height: calc(${(42 + dragPosition)}vh - 22px);`"
      class="mt-1 flex-nowrap"
      no-gutters
    > 
      <v-col
        class="pa-1 rounded white category-products__fields"
      >
        <div
        class="offer-data category-form__offer-data"
        >
          <v-row
            class="rounded pa-1"
            style="background: #B9D2EA;"
            no-gutters
          >
            <v-col
              class="rounded white category-products__fields-select pl-1 pr-1"
            >
              <v-select
                :disabled="isNotNewStatus"
                :item-text="'name_ru'"
                :items="(sections && sections.data) || []"
                :label="$t('selectSection')"
                clearable
                hide-details
                item-value="id"
                return-object
                v-model="assembly.section"
              ></v-select>
            </v-col>
          </v-row>
          <v-row
            class="rounded mt-2 pa-1"
            style="background: #B9D2EA;"
            no-gutters
          >
            <v-col
              class="rounded white category-products__fields-textField pl-1 pr-1"
            >
              <v-text-field
                :disabled="isNotNewStatus"
                :label="$t('sku')"
                :value="assembly.sku"
                class="category-products__offer-date offer-date pb-1"
                height="25px"
                hide-details
                readonly
              ></v-text-field>
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
                    class="category-products__offer-date offer-date pb-1"
                    :value="assembly.vat_price | toFix"
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
                    :disabled="isNotNewStatus || !assembly.delivery"
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
                    :color="assembly.delivery ? 'primary' : 'black'"
                    @click="assembly.delivery = !assembly.delivery"
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
                v-model="assembly.manual_margin"
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
                    :color="assembly.visa ? 'primary' : 'black'"
                    @click="assembly.visa = !assembly.visa"
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
                <span>Виза {{ assembly.visa_percent }}% - это наценка на конечную стоимость, взята из настроек.</span>
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
                hide-details
                prefix="₪"
                v-model="assemblyAmountWithoutVat"
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
                    :color="!assembly.payment ? 'black' : 'primary'"
                    @click="assembly.payment = !assembly.payment"
                    class="ma-0 pa-0"
                    icon
                    plain
                    style="background: white;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>
                      {{ (assembly.payment && 'mdi-bank-off') || 'mdi-bank' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ (assembly.payment && `Оплата товаров поставщику визой.`) || 'Оплата товаров поставщику банковским переводом.' }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col
        class="pa-1 ml-1 ma-0 rounded white"
        style="height: 100%; overflow: hidden;"
      >
        <assembly-products
          :isNotNewStatus="isNotNewStatus"
          :manufacturerNames="manufacturerNames"
          :assembly="assembly"
          :assemblyProducts="assemblyProducts"
          :warranties="warranties"
          style="overflow: hidden; height: 100%;"
        ></assembly-products>
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
              v-model="templateAssemblyName"
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="dialogForTemplate = false">
            Закрыть
          </v-btn>
          <v-btn color="success" text @click="createTemplate(templateAssemblyName)" :disabled="!templateAssemblyName">
            Сохранить
          </v-btn>
        </v-card-actions>
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
                :disabled="!assemblyProducts.length"
                :loading="requestStatus === 'loading'"
                @click="saveAssembly"
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
              v-model="assembly.note"
            ></v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
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
      :width="450"
      height="90vh"
      max-width="1200px"
      persistent
      scrollable
      style="height: 65vh;"
      v-model="dialogCategory"
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
                @click="() => { dialogCategory = false; }"
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
                @click="saveCategory()"
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
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import paginationMixin from "@/mixins/paginations"
import toFix from "../../../filters/toFix"
import {debounce} from 'vue-debounce'
import {mapGetters} from 'vuex'

const dFn = debounce(fn => fn(), '400ms')

export default {
  name: "AssemblyForm",
  components: {
    AssemblyProducts: () => import("./AssemblyProducts"),
    CategoryForm: () => import("../../components/category/CategoryForm"),
    CategoryGroups: () => import("./CategoryGroups"),
    CategoryProductForm: () => import("../../components/category/CategoryProductForm"),
    CategoryProducts: () => import("./CategoryProducts"),
    CategoryTree: () => import("../category/CategoryTree"),
  },

  props: ['assembly'],
  mixins: [paginationMixin],
  data () {
    return {
      addNoteDialog: false,
      calculateMode: 'auto',
      delivers: [],
      dialogForTemplate: false,
      disabledStatus: false,
      dragPosition: 0,
      innerHeight: 900,
      propertyIds: {},
      search: '',
      searchText: '',
      selectedCategories: [],
      selectedCategory: null,
      showAvailableProducts: 'all',
      showCategoryFilters: false,
      showDeletedProducts: 'active',
      showManufacturerDeliver: false,
      showTemplateAssemblies: false,
      specificationIds: [],
      templateAssemblyName: null,
      vendorIds: [],
      warranties: [],
      dialogCategory: false,
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
      'category',
      'categorySelect',
      'categoryTree',
      'dialog',
      'filters',
      'manufacturerNames',
      'manufacturers',
      'assemblyProducts',
      'assemblies',
      'product',
      'requestStatus',
      'showAllProductsAssembly',
      'vendors',
      'sections',
    ]),

    manufacturerDelivers() {
      let manufacturerDelivers = []
      if (this.assemblyProducts.length && this.manufacturers && this.manufacturers.length) {
        let assemblyManufacturerNames = this.assemblyProducts.map(p => (!!p && p.pivot.main && p.manufacturer && p.manufacturer.name) || (!!p && p.pivot.main && p.manufacturer) || (!!p && p.pivot.main && p.manufacturer_id))
        manufacturerDelivers = this.manufacturers.filter(manufacturer => !!assemblyManufacturerNames.find(name => name == manufacturer.name || name == manufacturer.id))
      }
      return manufacturerDelivers
    },

    productsMargin () {
      let assemblyVatPrice = 0
      let assemblyMarginalPrice = 0
      if (this.assemblyProducts && this.assemblyProducts.length && this.manufacturers && this.manufacturers.length) {
        assemblyVatPrice = this.assemblyProducts.reduce(
          (total, product) => total + (
            product && product.pivot.main && (
              parseFloat(product.var_price) *
              parseFloat(product.pivot.qty)
            )
          ) || 0, 0)
        assemblyMarginalPrice = this.assemblyProducts.reduce(
          (total, product) => total + (
            product && product.pivot.main && (
              parseFloat(product.marginal_price) *
              parseFloat(product.pivot.qty)
            )
          ) || 0, 0)
      }
      return (parseFloat(assemblyMarginalPrice || 0) - parseFloat(assemblyVatPrice || 0))
    },

    result1 () {
      let result1 = parseFloat(this.assembly.vat_price || 0) + ((this.assembly.delivery && parseFloat(this.manufacturerDeliverCost)) || 0)
      return result1
    },

    result2 () {
      let result2 = parseFloat(this.result1) + parseFloat((this.calculateMode === 'auto' ? this.productsMargin : this.assembly.manual_margin) || 0)
      return result2
    },

    amountNew () {
      if (this.isNotNewStatus) {
        return this.assembly.amount
      }
      let amountNew = this.result2 * ((this.assembly.visa && (100 + parseFloat(this.assembly.visa_percent)) / 100) || 1)
      return Math.round(amountNew * 100) / 100
    },

    manufacturerDeliverCost() {
      if (this.isNotNewStatus) {
        return this.assembly.delivery_cost
      }
      let deliverCost = this.manufacturerDelivers.reduce((total, manufacturer) => {
        return total + Number.parseFloat(manufacturer.deliver_cost) || 0
      }, 0) * (this.assembly.payment ? (100 + parseFloat(this.assembly.payment_percent || 0)) / 100 : 1)
      return Math.round((deliverCost * 117 / 100) * 100) / 100
    },

    isNotNewStatus() {
      return this.assembly.status !== 'enabled'
    },

    autoMargin: {
      get: function () {
        // return Math.round(((Number.parseFloat(this.assembly.amount) * ((this.assembly.visa && 100 / (100 + Number.parseFloat(this.assembly.visa_percent))) || 1) - ((this.assembly.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.assembly.vat_price || 0)) || 0) * 100) / 100
        let amount = Number.parseFloat(this.assembly.amount) * ((this.assembly.visa && 100 / (100 + Number.parseFloat(this.assembly.visa_percent))) || 1)
        let autoMargin = ((amount - ((this.assembly.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.assembly.vat_price)) || 0)
        return Math.round(autoMargin * 100) / 100
      },
      set: function (newVal) {
        this.assembly.amount = parseFloat(newVal || 0)
      }
    },

    autoMarginWithoutVat () {
      return Math.round((Number.parseFloat(this.autoMargin || 0) / 117 * 100) * 100) / 100
    },

    manualMargin: {
      get: function () {
        return Math.round(((Number.parseFloat(this.assembly.amount) * ((this.assembly.visa && 100 / (100 + Number.parseFloat(this.assembly.visa_percent))) || 1) - ((this.assembly.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.assembly.vat_price)) || 0) * 100) / 100 || null
      },
      set: function (newVal) {
        this.assembly.amount = Math.round(((this.assembly.amount + Number.parseFloat(newVal)) || 0) * 100) / 100 || null
      },
    },

    // 'assembly.manual_margin': {
    //   get: function () {
    //     return Math.round(((Number.parseFloat(this.assembly.amount) * ((this.assembly.visa && 100 / (100 + Number.parseFloat(this.assembly.visa_percent))) || 1) - ((this.assembly.delivery && Number.parseFloat(this.manufacturerDeliverCost)) || 0) - Number.parseFloat(this.assembly.vat_price) * ((this.assembly.payment && (100 + Number.parseFloat(this.assembly.payment_percent)) / 100) || 1)) || 0) * 100) / 100
    //   },
    //   set: function (newVal) {
    //     this.assembly.amount = Math.round(((this.assembly.amount + Number.parseFloat(newVal)) || 0) * 100) / 100
    //   },
    // },

    manualMarginWithoutVat: {
      get: function() {
        return Math.round((Number.parseFloat(this.assembly.manual_margin || 0) / 117 * 100) * 100) / 100 || null
      },
      set: function(newVal) {
        // this.assembly.amount = Math.round(((this.assembly.amount + Number.parseFloat(newVal)) || 0) * 100) / 100
        this.assembly.manual_margin = Math.round((Number.parseFloat(newVal) * 100 / 117) * 100) / 100 || null
      }
    },

    assemblyAmountWithoutVat: {
      get: function () {
        return Math.round((Number.parseFloat(this.assembly.amount || 0) / 117 * 100) * 100) / 100 || null
      },
      set: function (newVal) {
        this.assembly.amount = Math.round((Number.parseFloat(newVal || 0) * 117 / 100) * 100) / 100
      },
    },

    'assembly.marginal_price': {
      get: function () {
        if (this.assemblyProducts && this.assemblyProducts.length) {
          return this.assemblyProducts.reduce((total, product) => total + (product && product.pivot.main && parseFloat(product.marginal_price) * parseFloat(product.pivot.qty)) || 0, 0)
        } else {
          return 0
        }
      },
      set: function (newVal) {
        this.assembly.marginal_price = Math.round(((Number.parseFloat(newVal)) || 0) * 100) / 100
      },
    },

    assemblyProductsCategoriesCount () {
      let categories = [...new Set(this.assemblyProducts && this.assemblyProducts.map(ap => ap && ap.root_category && ap.root_category.id) || [])]
      return categories.length || '0'
    },

    amountSaved () {
      let assembly = this.assemblies.data ? this.assemblies.data.find(o => o.id === this.assembly.id) || {} : {}
      return assembly.amount || 0
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

    this.$eventHandle.$on('disable-status', () => {
      this.setDisableStatus();
    })

    this.$eventHandle.$on('change-params', (params) => {
      const { page, itemsPerPage } = params
      this.page = page
      this.perPage = itemsPerPage
      this.getCategoryProducts(params)
    })

    this.$eventHandle.$on('edit-category', (category) => {
      // this.getSelectedCategory()
      this.$store.dispatch('getCategory', category).then(() => {
        // this.$store.commit('setDialog', true)
        this.dialogCategory = true
      })
    })

    this.$eventHandle.$on('save-category', (category) => {
      this.$store.dispatch('saveCategory', category).then(resp => {
        if (!!category.id) {
          this.$eventHandle.$emit('change-node', resp)
          let activeCategories = this.activeCategories

// -----------------------------------------------
// Uncaught (in promise) TypeError: Cannot convert undefined or null to object
// -----------------------------------------------v

          Object.assign(activeCategories.find(c => category.id === c.id), resp)
          this.$store.commit('setActiveCategories', activeCategories)
        } else {
          this.$eventHandle.$emit('add-node', resp)
        }
        this.$store.dispatch('resetCategoryCache')
      })
    })

    if (this.assembly.products) {
      await this.$store.commit('setAssemblyProducts', this.assembly.products.map(product => {
        product.pivot.qty = product.pivot.qty
        product.image_id = product.pivot.image_id
        product.price = product.var_price
        product.warranty = product.pivot.warranty
        product.percent = product.pivot.percent
        product.groupProducts = (product.group && product.group.products) || []
        product.producer_price = product.producer_price
        product.marginal_price = product.marginal_price
        product.pivot.max_selectable_qty = product.pivot.max_selectable_qty
        product.in_box_qty = product.pivot.in_box_qty
        product.pivot.main = product.pivot.main
        product.position = product.pivot.position
        product.pivot.checkbox = product.pivot.checkbox
        product.pivot.required = product.pivot.required
        product.show = true

        return product
      }))
    }

    if (!this.assembly.assembly_number) {
      this.assembly.assembly_number = this.getNewAssemblyNumber()
    }

    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
      this.assemblyProducts.map(product => {
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
      this.assembly.visa_percent = data.value
    })
    this.$store.dispatch('getSettings', {settingsName: 'settingsPayment'}).then((data) => {
      this.assembly.payment_percent = data.value
    })

    this.$eventHandle.$on('updateVatPriceCost', (assemblyVatPriceCost) => this.updateVatPriceCost(assemblyVatPriceCost))
    this.$eventHandle.$on('updateMarginalCost', (marginalCost) => this.updateMarginalCost(marginalCost))
    this.$eventHandle.$on('updateAssemblyCost', () => {
      let assemblyVatPriceCost = this.assemblyProducts.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue && currentValue.pivot.main && parseFloat(currentValue.var_price) * currentValue.pivot.qty) || 0
      }, 0)
      let assemblyMarginalCost = this.assemblyProducts.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue && currentValue.pivot.main && parseFloat(currentValue.marginal_price) * currentValue.pivot.qty) || 0
      }, 0)
      this.updateVatPriceCost(assemblyVatPriceCost)
      this.updateMarginalCost(assemblyMarginalCost)
    })

    this.assembly && this.assembly.id && this.changeCalculateMode(this.assembly.auto_margin && 'auto' || 'manual')


    this.setEventProduct()

    this.$eventHandle.$on('set-dialog', (payload) => this[payload.name] = payload.value);

    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersCategoryProductsAssembly'})

    await this.$store.dispatch('getVendors', {all: true})
    if (!this.isNotNewStatus) {
      this.calculatePrice()
    }
    if (this.assembly.visa === null) {
      this.assembly.visa = true
    }
    if (this.assembly.delivery === null) {
      this.assembly.delivery = true
    }
    if (this.assembly.payment === null) {
      this.assembly.payment = true
    }
    if (this.assembly.auto_margin === null) {
      this.assembly.auto_margin = true
    }
    if (this.assembly.auto_margin !== null) {
      this.calculateMode = (this.assembly.auto_margin === true && 'auto') || 'manual'
    }

    this.setAmount(this.amountSaved)

    this.dragPosition = Number.parseInt(this.assembly.slider_position) || 0

    await this.$store.dispatch('getSections')
  },

  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, {passive: true})
    for (let [index, filter] of this.filters.entries()) {
      this.propertyIds[index] = []
    }
  },

  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true})
    }
  },

  destroyed() {
    this.$store.commit('setAssemblyProducts', [])
    this.$store.commit('setCategoryProducts', [])
    this.$store.commit('setCategories', null)
    this.$store.commit('setManufacturerNames', [])
    this.$store.commit('setManufacturers', [])
    this.$store.commit('setActiveCategoryId', null)
    this.$store.commit('setActiveCategories', [])
    this.$store.commit('setSettings', [])

    this.$eventHandle.$off('change-page-products')
    this.$eventHandle.$off('change-params')
    this.$eventHandle.$off('change-per-page-products')
    this.$eventHandle.$off('disable-status')
    this.$eventHandle.$off('edit-category')
    this.$eventHandle.$off('save-category')
    this.$eventHandle.$off('save-product')
    this.$eventHandle.$off('updateAssemblyCost')
    this.$eventHandle.$off('updateMarginalCost')
    this.$eventHandle.$off('updateVatPriceCost')
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

    calculatePrice () {
      let marginalAssemblyPrice = 0
      let productsPrice = 0
      if (this.assemblyProducts && this.assemblyProducts.length) {
        productsPrice = this.assemblyProducts.reduce((total, product) => total + (product && product.pivot.main && (parseFloat(product.var_price) * parseFloat(product.pivot.qty))) || 0, 0)
        marginalAssemblyPrice = this.assemblyProducts.reduce((total, product) => total + (product && product.pivot.main && (parseFloat(product.marginal_price) * parseFloat(product.pivot.qty))) || 0, 0)
      }
      this.assembly.delivery_cost = this.manufacturerDeliverCost

      if (this.assemblyProducts && this.assemblyProducts.length && this.manufacturers && this.manufacturers.length) {
        let assemblyVatPrice = this.assemblyProducts.reduce(
          (total, product) => total + (
            product && product.pivot.main && (
              parseFloat(product.var_price) *
              parseFloat(product.pivot.qty)
            )
          ) || 0, 0) * (this.assembly.payment ? (100 + parseFloat(this.assembly.payment_percent || 0)) / 100 : 1)
        this.updateVatPriceCost(Math.round(assemblyVatPrice * 100) / 100)
        let assemblyMarginalPrice = this.assemblyProducts.reduce(
          (total, product) => total + (
            product && product.pivot.main && (
              parseFloat(product.marginal_price) *
              parseFloat(product.pivot.qty)
            )
          ) || 0, 0)
        this.updateMarginalCost(Math.round(assemblyMarginalPrice * 100) / 100)
      }

      this.assembly.amount = Number.parseFloat(this.assembly.vat_price || 0)

      if (this.calculateMode === 'manual') {
        this.assembly.amount += Number.parseFloat(this.assembly.manual_margin || 0)
      } else {
        this.assembly.amount += Number.parseFloat(marginalAssemblyPrice - productsPrice)
      }
      if (this.assembly.delivery) {
        this.assembly.amount += Number.parseFloat(this.manufacturerDeliverCost || 0)
      }
      if (this.assembly.visa) {
        this.assembly.amount = this.assembly.amount * (100 + Number.parseFloat(this.assembly.visa_percent)) / 100
      }
      this.assembly.amount = Math.round(this.assembly.amount * 100) / 100
    },

    setDisableStatus() {
      if (this.assembly.status === 'disabled') {
        this.disabledStatus = true;
      }
    },

    updateVatPriceCost(vatPriceCost) {
      this.assembly.vat_price = vatPriceCost
    },

    updateMarginalCost(marginalCost) {
      this.assembly.marginal_price = marginalCost
    },

    // updateManualMargin(manualMargin) {
    //   this.assembly.manual_margin = (manualMargin / 100 * 17) + Number(manualMargin)
    //   // this.assembly.amount = Number.parseFloat(this.assembly.vat_price) + Number.parseFloat(this.assembly.manual_margin)
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
      if (!!params.hasOwnProperty('show_all_products_in_assembly')) {
        this.$store.commit('setShowAllProductsAssembly', params.show_all_products_in_assembly)
      }
      if (this.selectedCategory) {
        params.category_id = this.selectedCategory.id
      }
      params.show_all_products_in_assembly = this.showAllProductsAssembly
      params.perPage = this.perPage
      params.page = this.page
      params.pageName = 'assembly'
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
        // delete params.show_all_products_in_assembly
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
      this.$eventHandle.$emit('set-dialog', { name: 'addAssemblyDialog', value: false })
    },

    // async clickSave() {
    //   // async () => { await saveAssembly(); setAmount(amountSaved); }
    //   await this.saveAssembly()
    //   this.setAmount(this.amountSaved)
    // },

    async saveAssembly() {
      this.assembly.products = this.assemblyProducts.map(pr => {
        return {
          group_id: pr.group_id,
          id: pr.id,
          percent: pr.percent,
          price: pr.var_price,
          qty: pr.pivot.qty,
          image_id: pr.image_id,
          main: pr.pivot.main,
          position: pr.position,
          checkbox: pr.pivot.checkbox,
          required: pr.pivot.required,
          max_selectable_qty: pr.pivot.max_selectable_qty,
          warranty: pr.warranty,
          producer_price: pr.producer_price,
          marginal_price: pr.marginal_price,
          show: true,
        }
      })

      this.assembly.slider_position = this.dragPosition
      this.assembly.section_id = this.assembly.section && this.assembly.section.id || 0

      let savedAssembly = await this.$store.dispatch('saveAssembly', this.assembly)
      savedAssembly && Object.assign(this.assembly, savedAssembly)

      if (this.assembly.products) {
        await this.$store.commit('setAssemblyProducts', this.assembly.products.map(product => {
          product.qty = product.pivot.qty
          product.image_id = product.image_id
          product.price = product.var_price
          product.warranty = product.warranty
          product.percent = product.percent
          product.groupProducts = (product.group && product.group.products) || []
          product.producer_price = product.producer_price
          product.marginal_price = product.marginal_price
          product.max_selectable_qty = product.pivot.max_selectable_qty
          product.in_box_qty = product.in_box_qty
          product.main = product.pivot.main
          product.position = product.position
          product.checkbox = product.pivot.checkbox
          product.required = product.pivot.required
          product.show = true
          
          return product
        }))
      }

      let assemblyProductIds = this.assemblyProducts.map(assemblyProduct => assemblyProduct.id)
      await this.$store.dispatch('saveAssemblyProductsPositions', {assembly_id: this.assembly.id, assemblyProductIds})

      await this.$store.dispatch('getAssembly', this.assembly)
      if (this.assembly.products) {
        await this.$store.commit('setAssemblyProducts', this.assembly.products.map(product => {
          product.qty = product.pivot.qty
          product.image_id = product.pivot.image_id
          product.price = product.var_price
          product.warranty = product.pivot.warranty
          product.percent = product.pivot.percent
          product.groupProducts = (product.group && product.group.products) || []
          product.producer_price = product.producer_price
          product.marginal_price = product.marginal_price
          product.max_selectable_qty = product.pivot.max_selectable_qty
          product.in_box_qty = product.pivot.in_box_qty
          product.main = product.pivot.main
          product.position = product.position
          product.checkbox = product.pivot.checkbox
          product.required = product.pivot.required
          product.show = true
          
          return product
        }))
      }

      this.$nextTick(() => {
        this.setAmount(this.amountSaved)
        console.log(this.amountSaved)
      })
    },

    setAssemblyDeliverCost(e, manufacturer) {
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
      this.assembly.auto_margin = (mode != 'manual')
      if (mode === 'manual') {
        this.updateVatPriceCost(this.assembly.vat_price)
      } else {
        this.updateMarginalCost(this.assembly.marginal_price)
      }
    },

    setAssembly(templateAssembly) {
      if (
        !this.assembly.id ||
        this.assembly.status === 'disabled'
      ) {
        templateAssembly.assembly_number = this.getNewAssemblyNumber()
      } else {
        templateAssembly.assembly_number = this.assembly.assembly_number
        templateAssembly.date = this.assembly.date
      }

      let products = templateAssembly.products.map(product => {
        product.qty = product.pivot.qty
        product.image_id = product.pivot.image_id
        product.price = product.var_price
        product.warranty = product.pivot.warranty
        product.percent = product.pivot.percent
        product.groupProducts = (product.group && product.group.products) || []
        product.manufacturer = product.manufacturer_id
        // product.producer_price = product.pivot.producer_price
        // product.marginal_price = product.pivot.marginal_price
        product.max_selectable_qty = product.pivot.max_selectable_qty
        product.in_box_qty = product.pivot.in_box_qty
        product.main = product.pivot.main
        product.position = product.position
        product.checkbox = product.pivot.checkbox
        product.required = product.pivot.required
        product.show = true

        return product
      })

      templateAssembly.status = 'enabled'
      templateAssembly.visa = false
      templateAssembly.delivery = true
      templateAssembly.payment = true
      templateAssembly.visa_percent = this.assembly.visa_percent
      templateAssembly.payment_percent = this.assembly.payment_percent
      templateAssembly.id = this.assembly.id

      this.$store.commit('setAssemblyProducts', products)
    },

    removeTemplateAssembly(templateAssembly) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          this.$store.dispatch('deleteAssemblyTemplate', templateAssembly.id)
        }
      })
    },

    assemblyCleaning() {
      this.$eventHandle.$emit('sync-selected-products', []);
      this.$store.commit('setAssemblyProducts', [])
    },

    createTemplate(templateAssemblyName) {
      this.dialogForTemplate = false
      let assembly = this.assembly
      assembly.id = null
      assembly.assembly_name = templateAssemblyName
      assembly.products = this.assemblyProducts
      this.$store.dispatch('saveAssemblyTemplate', assembly)
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

    getNewAssemblyNumber () {
      let now = new Date()
      this.assembly.date = `${now.getFullYear()}-${(now.getMonth()+101).toString().substring(1)}-${(now.getDate()+100).toString().substring(1)}`
      let assemblyNumber = this.assemblies.data.map(of => of.assembly_number)
      return assemblyNumber.length ? Math.max.apply(null, assemblyNumber) + 1 : 120121
    },

    async buildSale() {
      await this.$store.dispatch('buildSale', this.assembly)
    },

    clearSearch () {
      this.search = null
      this.getCategoryProducts()
      this.$eventHandle.$emit('change-params', {page: 1})
    },

    changeAmount ($event, oldVal) {
      if (this.assembly.auto_margin) {
        this.assembly.amount = parseFloat($event.target.value)
      } else {
        this.assembly.manual_margin = parseFloat(this.assembly.manual_margin || 0) + (parseFloat($event.target.value) - parseFloat(oldVal)) * ((this.assembly.visa && 100 / (100 + parseFloat(this.assembly.visa_percent))) || 1)
      }
    },

    setAmount (newVal) {
      if (this.assembly.auto_margin) {
        this.assembly.amount = parseFloat(newVal)
        let elem = this.$refs.amountNew.$el
        let inputEl = elem.querySelector('input')
        inputEl.value = newVal
      } else {
        this.assembly.manual_margin = parseFloat(this.assembly.manual_margin || 0) + (parseFloat(newVal) - parseFloat(this.amountNew)) * ((this.assembly.visa && 100 / (100 + parseFloat(this.assembly.visa_percent))) || 1)
      }
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
  },

  watch: {
    'assembly.auto_margin': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.products': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.manual_margin': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.marginal_price': function (val, oldVal) {
      this.updateMarginalCost(this.assembly.marginal_price)
      this.updateVatPriceCost(this.assembly.vat_price)
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.vat_price': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.visa': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.payment': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.delivery': function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
    },
    'assembly.status': function (val, oldVal) {
      if (val === 'enabled' && oldVal === 'disabled') {
        this.assembly.assembly_number = this.getNewAssemblyNumber()
      }
    },
    'assembly.amount': function (val, oldVal) {
      if (this.calculateMode === 'manual') {
        this.assembly.manual_margin = this.manualMargin
      }
    },
    manufacturerDeliverCost: function (val, oldVal) {
      if (!this.isNotNewStatus) {
        this.calculatePrice()
      }
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

.assembly-manufacturers-field {
  position: relative;
}

.assembly-manufacturers-list {
  position: absolute;
  left: 10px;
  bottom: 60px;
  background: white;
  padding: 5px 10px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.template-assemblies {
  position: relative;
}

.template-assemblies-list {
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

.template-assemblies-name:hover {
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
</style>
