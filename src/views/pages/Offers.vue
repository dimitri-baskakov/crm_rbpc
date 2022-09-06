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
        {{ $t('offers') }}
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        md="7"
      >
      </v-col>
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
                @click="createOffer"
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
            <span>{{ $t('createOffer') }}</span>
          </v-tooltip>
          <v-tooltip bottom open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="termsDialog = true"
                class="ma-0 pa-0"
                color="black"
                icon
                plain
                small
                style="background: transparent;"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-script-text-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('editTerms') }}</span>
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
          @dblclick:row="viaEditOffer"
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
              class="text-right d-flex flex-column"
              style="height: 100%;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
                class="d-flex justify-start"
                style="height: 50%;"
              >
                <div
                class="d-flex justify-center align-center category-products__sorting-indicator"
                >
                  <sort-indicator
                    :columnName="'id'"
                    :options="options"
                  ></sort-indicator>
                </div>
                <div
                  @click="sortRows('id')"
                  class="d-flex mr-2"
                  style="cursor: pointer;"
                >
                  <div class="align-self-center font-12">
                    {{ 'ID' }}
                  </div>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('offer_number')}"
                class="d-flex justify-start"
                style="height: 50%;"
              >
              <div
              class="d-flex justify-center align-center category-products__sorting-indicator"
              >
                <sort-indicator
                  :columnName="'offer_number'"
                  :options="options"
                ></sort-indicator>
              </div>
                <div
                  @click="sortRows('offer_number')"
                  class="d-flex"
                  style="cursor: pointer;"
                >
                  <div class="align-self-center font-12">
                    {{ $t('offerNum') }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.date="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="text-center"
              style="height: 100%;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('date')}"
                class="d-flex justify-end"
                style="height: 100%;"
              ><div
              class="d-flex justify-center align-center category-products__sorting-indicator"
                style="margin-left: -20px;"
              >
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
                  <div class="align-self-center font-12">
                    {{ $t('date') }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.client_name="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="text-left"
              style="height: 100%;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('client_name')}"
                class="d-flex justify-start"
                style="height: 100%;"
              >
              <div
              class="d-flex justify-center align-center category-products__sorting-indicator"
              >
                <sort-indicator
                  :columnName="'client_name'"
                  :options="options"
                ></sort-indicator>
                </div>
                <div
                  @click="sortRows('client_name')"
                  class="d-flex mr-2"
                  style="cursor: pointer;"
                >
                  <div class="align-self-center font-12">
                    {{ 'Клиент (ru)' }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.client_he_fullname_firm="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="text-end"
              style="height: 100%;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('client_he_fullname_firm')}"
                class="d-flex justify-end"
                style="height: 100%;"
              >
              <div
              class="d-flex justify-center align-center category-products__sorting-indicator"
              >
                <sort-indicator
                  :columnName="'client_he_fullname_firm'"
                  :options="options"
                ></sort-indicator>
                </div>
                <div
                  @click="sortRows('client_he_fullname_firm')"
                  class="d-flex mr-2"
                  style="cursor: pointer;"
                >
                  <div class="align-self-center font-12">
                    {{ 'Клиент / Фирма (he)' }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.client_mobile_phone="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="text-left column"
              style="height: 100%;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('client_mobile_phone')}"
                class="d-flex justify-start"
                style="height: 50%; padding-left: 0 !important;"
              >
              <div
              class="d-flex justify-center align-center category-products__sorting-indicator"
              >
                <sort-indicator
                  :columnName="'client_mobile_phone'"
                  :options="options"
                ></sort-indicator>
                </div>
                <div
                  @click="sortRows('client_mobile_phone')"
                  class="d-flex align-self-center"
                  style="cursor: pointer;"
                >
                  <div class="font-12">
                    {{ $t('mobile_phone') }}
                  </div>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('client_email')}"
                class="d-flex justify-start"
                style="height: 50%; padding-left: 0 !important;"
              >
              <div
              class="d-flex justify-center align-center category-products__sorting-indicator"
              >
                <sort-indicator
                  :columnName="'client_email'"
                  :options="options"
                ></sort-indicator>
                </div>
                <div
                  @click="sortRows('client_email')"
                  class="d-flex mr-2"
                  style="cursor: pointer;"
                >
                  <div class="align-self-center font-12">
                    {{ $t('email') }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.product_count="{ header }">
            <span class="font-12">
              Кол-во
            </span>
          </template>
          <template #header.manufacturers="{ header }">
            <span class="font-12">
              Поставщики
            </span>
          </template>
          <template #header.offerFilesCount="{ header }">
            <span class="font-12">
              Документы
            </span>
          </template>
          <template #header.note="{ header }">
            <span class="font-12">
              Заметка
            </span>
          </template>
          <template #header.amount="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="text-right column"
              style="height: 100%;"
            >
              <div
                class="d-flex justify-end"
                style="height: 50%;"
              >
                <div
                  class="d-flex"
                >
                  <div class="align-self-center font-12">
                    {{ $t('marginal_price') }}
                  </div>
                </div>
              </div>
              <div
                class="d-flex justify-center"
                style="height: 50%;"
              >
                <div
                  class="d-flex"
                >
                  <div class="align-self-center font-12">
                    {{ $t('amount') }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.status="{ header }">
            <span class="font-12">
              Статус
            </span>
          </template>
          <template #header.actions="{ header }">
            <span class="font-12">
              Инструменты
            </span>
          </template>
          <template #item.id="{item}">
            <div
              class="d-flex flex-column"
            >
              <div class="font-16">{{ item.id }}</div>
              <div class="mt-0">
                <a class="text-green font-16" @click.prevent="editOffer(item)">
                  {{ item.offer_number }}
                </a>
              </div>
            </div>
          </template>
          <template #item.date="{ item }">
            <span class="font-16">
              {{ item.date | dateFormat }}
            </span>
          </template>
          <template #item.client_name="{ item }">
            <a
              @click="editClient({ id: item.client_id })"
              dir="rtl"
              class="font-16"
              style="margin-left: 30px;"
            >
              {{ item.client_name }}
            </a>
          </template>
          <template #item.client_he_fullname_firm="{ item }">
            <a
              @click="editClient({ id: item.client_id })"
              dir="rtl"
              class="font-16 pr-2"
            >
              {{ item.client_he_fullname_firm }}
            </a>
          </template>
          <template #item.client_mobile_phone="{item}">
            <div
              class="text-start font-16"
            >
              <div class="font-16" style="margin-left: 30px;">{{ item.client_mobile_phone }}</div>
              <div class="mt-0 font-16 mt-2" style="margin-left: 30px;">
                {{ item.client_email }}
              </div>
            </div>
          </template>
          <template #item.product_count="{ item }">
            <span v-if="item.product_count" class="font-16">
              {{item.product_count}}
            </span>
          </template>
          <template #item.manufacturers="{ item }">
            <span v-if="item.products" class="font-16">
              {{ Array.from(new Set(item.products.map(p => p.manufacturer_id))).length }}
            </span>
          </template>
          <template #item.offerFilesCount="{ item }">
            <v-menu
              :close-on-content-click="false"
              :disabled="item.offerFilesCount == 0"
              open-delay="500"
              open-on-hover
              top
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                  class="d-flex justify-center align-center"
                >
                  <span class="font-16">{{ item.offerFilesCount }}</span>
                  <v-btn
                    class="mx-2 mb-0"
                    icon
                    plain
                    small
                    style="background: transparent;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon
                    class="d-flex justify-center align-center mb-0"
                    :class="item.offerFilesCount == 0 ? '' : 'text-green'"
                    >
                      mdi-file-document-outline
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <v-list
                class="rounded pa-0 documents-count__popup"
                dense
              >
                <v-list-item
                  class="d-flex justify-between align-center documents-count__item px-0 my-1"
                  v-for="file of item.offerFiles"
                >
                  <v-list-item-content
                  class="documents-count__content mr-1 pa-0 px-1"
                  >
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }" 
                      class=""
                      >
                        <v-list-item-title
                          v-bind="attrs"
                          v-on="on"
                          class="font-12"
                        >{{ file.src.split(/[/]+/).pop() }}</v-list-item-title>
                      </template>
                      <span class="font-12">{{ file.src }}</span>
                    </v-tooltip>
                  </v-list-item-content>
                  <v-list-item-icon
                  class="documents-count__icon d-flex align-center ma-0"
                  >
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          @click="forceDownload(file.src, file.src)"
                          class="ma-0 pa-0"
                          color="black"
                          icon
                          plain
                          rounded
                          small
                          style="background: transparent;"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="font-10">mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('downloadFile') }}</span>
                    </v-tooltip>
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :href="file.src"
                          class="ma-0 pa-0"
                          color="black"
                          icon
                          plain
                          rounded
                          small
                          style="background: transparent;"
                          tag="a"
                          target="_blank"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="font-10">mdi-eye</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('showFile') }}</span>
                    </v-tooltip>
                    <v-tooltip top open-delay="400">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :disabled="item.status != 'new' || file.src.split(/[/]+/).pop().includes(`offer-${item.offer_number}`)"
                          @click="removeOfferFile(item, file)"
                          class="ma-0 pa-0"
                          color="black"
                          icon
                          plain
                          rounded
                          small
                          style="background: transparent;"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="font-10">mdi-close-thick</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('removeFile') }}</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template #item.note="{ item }">
            <v-menu
              :close-on-content-click="false"
              :disabled="item.note == null"
              offset-x
              open-delay="500"
              open-on-hover
              style="background-color: white;"
              top
            >
              <template #activator="{ on, attrs }">
                <div
                  
                  v-bind="attrs"
                  v-on="on"
                >
                  <span class="font-16 text-green" v-if="!!item.note">{{ 'есть' }}</span>
                  <span class="font-16" v-else>{{ 'нет' }}</span>
                  <v-btn
                    class="mb-0"
                    :class="item.note == null ? 'mx-2' : 'mx-1 text-green'"
                    icon
                    plain
                    small
                    style="background: transparent;"
                    v-bind="attrs"
                    v-on="on"
                    @click="showNoteForm(item)"
                  >
                    <v-icon 
                    class="d-flex justify-center align-center"
                    :class="!!item.note ? 'text-green' : ''"
                    >
                      mdi-playlist-edit
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <v-list
                class="px-2 rounded category-products__notes"
                style="
                max-width: 350px; 
                width: 30vw; 
                max-height: 300px;
                overflow-y: auto;
                left: calc(50% - 15vw);
                "
              >
                <div 
                v-if="!!item.note"
                class="text-end"
                style="width: 100%; height: 100%;"
                >
                  {{item.note}}
                </div>
                <v-textarea
                  v-else
                  :readonly="false"
                  dir="rtl"
                  hide-details
                  rows="1"
                  style="width: 100%; height: 100%;"
                  v-model="item.note"
                ></v-textarea>
              </v-list>
            </v-menu>
          </template>
          <template #item.amount="{item}">
            <div class="d-flex flex-column justify-center bordered-both" style="height: 90%;">
              <div class="text-end font-16">
                {{ item.auto_margin ? item.marginal_price : item.manual_margin }}
              </div>
              <div class="text-center font-16 mt-2">
                {{ item.amount }}
              </div>
            </div>
          </template>
          <template #item.status="{ item }">
            <div class="font-16" :style="(item.status == 'new' && 'color: #69D169;') || (item.status == 'paid' && 'color: #F7931E;')">
              {{ $t(item.status) }}
            </div>
          </template>
          <template #item.actions="{ item }">
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="editOffer(item)"
                  class="ma-0 pa-0"
                  color="black"
                  icon
                  plain
                  small
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span class="font-14">
                {{ $t('edit') }}
              </span>
            </v-tooltip>
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="item.status != 'new'"
                  @click="deleteOffer(item)"
                  class="ma-0 pa-0"
                  color="black"
                  icon
                  plain
                  small
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="font-12">
                {{ $t('delete') }}
              </span>
            </v-tooltip>
          </template>
        </v-data-table>

        <div class="rounded main-page-pagination" v-if="items.length" >
          <v-row class="rounded" justify="space-between">
            <v-col 
            class="d-flex align-center pa-0 pl-2"
            cols="12" 
            md="1"
            >
              <v-text-field
                :value="paginationMeta.perPage"
                @keyup.enter="changePerPage($event, 'change-per-page-offer')"
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
                  @input="selectedPage($event, 'change-page-offer')"
                  v-model="paginationMeta.page"
                ></v-pagination>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- main popup -->
    <v-dialog
      class="category-products__modal"
      max-width="1366px"
      width="100%"
      height="70vh"
      :retain-focus="false"
      persistent
      scrollable
      v-if="dialogMain"
      v-model="dialogMain"
    >
      <v-card
        class="rounded offer-form"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;"
      >
        <div
          class="align-center d-flex flex-nowrap model-header"
          color="transparent"
          dark
          dir="rtl"
          style="position: absolute; top: -57px; right: -65px; width: calc(1366px + 60px);"
          v-if="$refs.offerForm"
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
                @click="$refs.offerForm.openFileDialog(offer.attach_file)"
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
            class="ma-0 ml-3 pa-1 rounded white inp-form "
            style="width: 310px !important; height: 40px !important;"
            dir="ltr"
          >
            <v-text-field
              :readonly="offer.status !== 'new'"
              :label="$t('offerName')"
              class="category-products__dense-input"
              width="100%"
              dir="rtl"
              dense
              hide-details
              v-model="offer.name"
            />
          </div>
          <div
            class="ma-0 ml-3 pa-0 rounded white inp-form"
            dir="ltr"
            style="width: 150px !important; height: 40px !important;"
          >
            <v-select
              :items="[
                {name: 'Новый', value:'new'},
                {name: 'Завершен', value:'completed'},
                {name: 'Оплачен', value:'paid'},
              ]"
              :label="$t('status')"
              class="category-products__dense-select"
              dense
              width="100%"
              dir="ltr"
              hide-details
              item-text="name"
              item-value="value"
              required
              v-if="offer"
              v-model="offer.status"
            />
          </div>
          <div
            class="ma-0 pa-0 rounded white inp-form d-flex justify-center align-center"
            style="width: 150px !important; height: 40px !important;"
          >
            <v-text-field
              :label="$t('offerNumber')"
              :value="offer.offer_number"
              class="category-products__dense-input font-12"
              dense
              dir="ltr"
              hide-details
              readonly
            />
          </div>
          <v-btn
            class="black--text inp-form font-14"
            color="#B9D2EA"
            style="width: 160px !important; height: 40px !important; padding: 0"
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

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-if="showForm === 'editClient'"
      v-model="dialog"
    >
      <client-form :client="client"></client-form>
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
    
    <v-dialog
      :retain-focus="false"
      max-height="90vh"
      max-width="800px"
      persistent
      v-model="termsDialog"
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
                @click="termsDialog = false"
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
                @click="saveTerms"
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
            <div class="py-3">{{ $t('terms') }}</div>
          </v-btn>
        </div>
        <v-card-text>
          <v-container>
            <v-textarea
              auto-grow
              dir="rtl"
              rows="7"
              v-model="terms"
            ></v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="90vh"
      max-width="800px"
      v-if="offer"
      persistent
      v-model="dialogNote"
      width="45vw"
    >
      <v-card
        class="rounded offers-note"
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
                @click="closeDialogNote"
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
                @click="saveNote"
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
              auto-grow
              dir="rtl"
              rows="1"
              v-model="offer.note"
            ></v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import {mapGetters} from 'vuex'
import paginationMixin from "@/mixins/paginations";
import dateFormat from "@/filters/date";

export default {
  name: "Offers",

  components: {
    ClientForm: () => import("../components/clients/ClientForm"),
    OfferForm: () => import("../components/offers/OfferForm"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
  },

  mixins: [paginationMixin],

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
      terms: '',
      termsDialog: false,
    }
  },

  filters: {
    dateFormat
  },

  computed: {
    ...mapGetters([
      'client',
      'clients',
      'dialog',
      'dialogMain',
      'dialogNote',
      'offer',
      'offerProducts',
      'offers',
      'requestStatus',
    ]),
    items() {
      if (this.offers) {
        this.paginationMeta.page = +this.offers.meta.current_page
        this.paginationMeta.perPage = +this.offers.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.offers.meta.total / this.offers.meta.per_page)
        return this.offers.data
      }
      return []
    },

    showHeaders () {
      return this.selectedHeadersData && this.headers.filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
      // return this.headers.filter(s => this.selectedHeaders.includes(s));
    },

    selectedHeadersData: {
      get: function () {
        return this.selectedHeaders || this.headers.map(h => h.value)
      },
      set: async function (newValue) {
        await this.$store.dispatch('saveSetting', {
          selectedHeadersOffers: JSON.stringify(newValue),
          // selectedHeadersOffers: JSON.stringify(this.selectedHeadersData),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersOffers'})
      }
    },

    selectedHeaders () {
      let selectedHeadersOffers = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersOffers')
      selectedHeadersOffers = selectedHeadersOffers && JSON.parse(selectedHeadersOffers.value)
      return selectedHeadersOffers
    },
  },

  async created() {
    await this.$store.dispatch('getOffer', null)
    await this.$store.commit('setOfferProducts', [])
    await this.$store.dispatch('getOffers')
    this.initialize()

    let terms = await this.$store.dispatch('getSettings', {settingsName: 'terms'})
    this.terms = terms && terms[0] && terms[0].value

    this.$eventHandle.$on('change-page-offer', (page) => {
      this.page = +page
      this.$store.dispatch('getOffers', {
        page, perPage: this.perPage
      })
    })
    this.$eventHandle.$on('change-per-page-offer', (perPage) => {
      this.perPage = +perPage
      this.$store.dispatch('getOffers', {
        page: this.page, perPage
      })
    })

    this.headers = Object.values(this.headersMap)
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersOffers'})
    // this.selectedHeaders = this.headers
  },

  destroyed() {
    this.$eventHandle.$off('change-page-offer')
    this.$eventHandle.$off('change-per-page-offer')
    this.$eventHandle.$off('set-dialog')
    this.$store.commit('setDialogMain', false)
    this.$store.commit('setOffers', null)
  },

  methods: {
    createOffer() {
      this.$store.dispatch('getOffer').then(() => {
        this.$store.commit('setDialogMain', true)
      })
    },

    initialize() {
      this.headersMap = [
        {text: 'ID / номер', value: 'id', align: 'start', sortable: true, class: 'caption px-1', width: "10%"},
        {text: this.$t('date'), value: 'date', align: 'center', sortable: true, class: 'caption', width: "6.4%"},
        {text: 'Клиент (ru)', value: 'client_name', align: 'start', sortable: true, class: 'caption offers-header__client_ru', width: "10.5%"},
        {text: "Клиент / Фирма (he)", value: 'client_he_fullname_firm', align: 'end', sortable: true, class: 'caption', width: "10.3%"},
        {text: this.$t('mobile_phone'), value: 'client_mobile_phone', align: 'start', sortable: true, class: 'caption', width: "14%"},
        // {text: this.$t('email'), value: 'client_email', align: 'start', sortable: true, class: 'caption'},
        {text: "Кол-во", value: 'product_count', align: 'center', sortable: true, class: 'caption px-0', width: "6%"},
        {text: this.$t('manufacturers'), value: 'manufacturers', align: 'center', sortable: true, class: 'caption px-0', width: "7.9%"},
        {text: this.$t('documents'), value: 'offerFilesCount', align: 'start', sortable: true, class: 'caption', width: "7.3%"},
        {text: this.$t('note'), value: 'note', align: 'center', sortable: true, class: 'caption px-0', width: "6.2%"},
        // {text: this.$t('marginal_price'), value: 'marginal_price', align: 'end', sortable: true, class: 'caption'},
        {text: this.$t('amount'), value: 'amount', align: 'center', sortable: true, class: 'caption', width: "8.7%"},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: true, class: 'caption', width: "5.9%"},
        {text: this.$t('actions'), value: 'actions', align: 'center', class: 'caption px-0', width: "6.6%"},
      ]
    },

    showNoteForm(offer) {
      this.$store.dispatch('getOffer', offer).then(() => {
        this.$store.commit('setDialogNote', true)
      })
    },
    saveNote() {
      console.log(this.offer)
      this.$store.dispatch('saveOffer', this.offer).then(() => {
        this.$store.commit('setDialogNote', false)
      })

    },
    closeDialogNote() {
      this.$store.commit('setDialogNote', false)
    },

    viaEditOffer(e, data) {
      this.editOffer(data.item)
    },

    editOffer(offer) {
      this.$store.dispatch('getOffer', offer).then(() => {
        this.$store.commit('setDialogMain', true);
      })
    },

    copyOffer(offer) {
      // consol.log(offer)
    },

    deleteOffer(offer) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          this.$store.dispatch('deleteOffer', offer.id)
        }
      })
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

    async editClient(client) {
      await this.$store.dispatch('getClient', client)
      this.$store.commit('setDialog', true)
      this.showForm = 'editClient'
    },

    closeModal() {
      this.$store.commit('setDialogMain', false)
      this.showForm = ''
    },

    async saveTerms () {
      await this.$store.dispatch('saveSetting', {
        terms: this.terms,
      })
    },

    removeOfferFile(offer, file) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          offer.offerFiles = offer.offerFiles.filter(f => f.id !== file.id)
          this.$store.dispatch('saveOffer', offer)
        }
      })
    },
  },
}
</script>
