<template>
  <div class="client-table-block">
    <div class="client-table">
      <div class="client-table__inner">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="table-title">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex align-center">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span 
                      class="font-12 line-break-one" 
                      style="line-break: anywhere;"
                      >
                        № Предложения
                      </span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span 
                      class="font-12 line-break-one" 
                      style="line-break: anywhere;"
                      >
                        № Предзаказа
                      </span>
                    </div>
                  </div>
                </th>
                <th class="table-title">
                  <span class="d-block font-12 text-center">
                    Дата
                  </span>
                </th>
                <th class="table-title">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex align-center">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Кол-во
                      </span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Поставщики
                      </span>
                    </div>
                  </div>
                </th>
                <th class="table-title">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex align-center">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Документы
                      </span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Заметка
                      </span>
                    </div>
                  </div>
                </th>
                <th class="table-title">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex align-center">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Общая цена
                      </span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Статус
                      </span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                @dblclick="item.id && editOffer(item)"
                v-for="(item, idx) in offers"
                :key="item.id"
              >
                <td>
                  <div class="d-flex justify-start align-center offer-title font-16">
                    {{ item.offer_number }}
                  </div>
                </td>
                <td>
                  <div 
                  class="d-flex justify-center align-center bordered-both font-16"
                  style="height: 90%;"
                  >
                    {{ item.date }}
                  </div>
                </td>
                <td class="text-center">
                  <div class="d-flex flex-column justify-center align-center">
                    <span class="font-16">
                      {{ item.products_count }}
                    </span>
                    <span class="font-16 mt-1">
                      {{ (item.products && Array.from(new Set(item.products.map(p => p.manufacturer_id))).length) || 0 }}
                    </span>
                  </div>
                </td>
                <td class="special-td">
                  <div 
                  class="d-flex flex-column justify-center align-center bordered-both" 
                  style="width: 100%; height: 90%;"
                  >
                    <v-menu
                    :close-on-content-click="false"
                    :disabled="item.offer_files_count == 0"
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
                          <span class="font-16">{{ item.offer_files_count }}</span>
                          <v-btn
                            :color="item.offer_files_count == 0 ? 'grey' : 'primary'"
                            class="mx-2"
                            icon
                            plain
                            small
                            style="background: transparent;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon
                            class="d-flex justify-center align-center mb-0"
                            :class="item.offer_files_count == 0 ? '' : 'text-green'"
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
                          v-for="file of item.offer_files"
                        >
                          <v-list-item-content
                          class="documents-count__content mr-1 pa-0 px-1"
                          >
                            <v-tooltip top open-delay="400">
                              <template #activator="{ on, attrs }">
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
                    <div class="d-flex align-center">
                      <span class="font-16" :style="!!item.note ? 'color: #2979FF !important;' : 'black'" v-if="!!item.note">{{ 'есть' }}</span>
                      <span class="font-16" v-else>{{ 'нет' }}</span>
                      <v-icon :color="!item.note ? 'grey' : 'primary'" @click.stop="showNoteForm(item, 'Offer')">mdi-playlist-edit</v-icon>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <div class="d-flex flex-column justify-center align-center">
                    <span class="font-16">
                      {{ item.amount }}
                    </span>
                    <span class="status-new font-16 mt-1">
                      {{ $t(item.status) }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <div class="client-table__inner non-border">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="table-title">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex align-center">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                      </div>
                      <span class="font-12">
                        № Продаж
                      </span>
                    </div>
                  </div>
                </th>
                <th class="table-title text-center">
                  <span class="font-12 text-center">
                    Дата
                  </span>
                </th>
                <th class="table-title">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex align-center">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Документы
                      </span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Заметка
                      </span>
                    </div>
                  </div>
                </th>
                <th class="table-title">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex align-center">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Общая цена
                      </span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <div
                      class="d-flex justify-center align-center category-products__sorting-indicator"
                      >
                        <!-- <sort-indicator></sort-indicator> -->
                      </div>
                      <span class="font-12">
                        Статус
                      </span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                @dblclick="item.id && editSale(item)"
                v-for="(item, idx) in sales"
                :key="item.id"
                :class="'table' + item.type || 'predl'"
              >
                <td>
                  <div class="d-flex justify-start align-center offer-title font-16">
                    {{ item.sale_number }}
                  </div>
                </td>
                <td>
                  <div 
                  class="d-flex justify-center align-center bordered-both font-16"
                  style="height: 90%;"
                  >
                    {{ item.date }}
                  </div>
                </td>
                <td class="special-td">
                  <div 
                  class="d-flex flex-column justify-center align-center bordered-right" 
                  style="width: 100%; height: 90%;"
                  >
                    <v-menu
                      :close-on-content-click="false"
                      :disabled="item.sale_files_count == 0"
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
                          <span class="font-16">{{ item.sale_files_count ? item.sale_files_count : 0 }}</span>
                          <v-btn
                            :color="item.sale_files_count == 0 ? 'grey' : 'primary'"
                            class="mx-2"
                            icon
                            plain
                            small
                            style="background: transparent;"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon
                            class="d-flex justify-center align-center mb-0"
                            :class="item.sale_files_count == 0 ? '' : 'text-green'"
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
                          v-for="file of item.sale_files"
                        >
                          <v-list-item-content
                          class="documents-count__content mr-1 pa-0 px-1"
                          >
                            <v-tooltip top open-delay="400">
                              <template #activator="{ on, attrs }">
                                <v-list-item-title
                                  v-bind="attrs"
                                  v-on="on"
                                  class="font-16"
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
                                  :disabled="item.status != 'new' || file.src.split(/[/]+/).pop().includes(`sale-${item.sale_number}`)"
                                  @click="removeSaleFile(item, file)"
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
                    <div class="d-flex justify-center align-center">
                      <span class="font-16" :style="!!item.note ? 'color: #2979FF !important;' : 'black'" v-if="!!item.note">{{ 'есть' }}</span>
                      <span class="font-16" v-else>{{ 'нет' }}</span>
                      <v-icon :color="!item.note ? 'grey' : 'primary'" @click.stop="showNoteForm(item, 'Sale')">mdi-playlist-edit</v-icon>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <div class="d-flex flex-column justify-center align-center">
                    <span class="font-16">
                      {{ item.amount }}
                    </span>
                    <span class="status-new font-16 mt-1">
                      {{ $t(item.status) }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <v-dialog v-model="files" max-width="500" content-class="vdialognew">
        <v-card class="dialog-custom">
          <div class="dialog__inner">Документы</div>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog
      :retain-focus="false"
      max-height="90vh"
      max-width="800px"
      v-if="1"
      persistent
      v-model="dialogNote"
      width="45vw"
    >
      <v-card
        class="rounded offers-note"
        style="border: 4.5px solid #B9D2EA; border-radius: 3px; "
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
              rows="7"
              v-model="activeItem.note"
              v-if="activeItem"
            ></v-textarea>
          </v-container>
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
        class="rounded offer-form"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;"
      >
        <div
          class="align-center d-flex flex-nowrap model-header"
          color="transparent"
          dark
          dir="rtl"
          style="position: absolute; top: -57px; right: -65px; width: calc(85vw + 60px);"
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
          >
            <v-text-field
              :readonly="offer.status !== 'new'"
              :label="$t('offerName')"
              class=" dense-input"
              dense
              hide-details
              style="width: 300px"
              v-model="offer.name"
            />
          </div>
          <div
            class="ma-0 ml-3 pa-1 rounded white inp-form"
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
            class="ma-0 pa-1 rounded white inp-form"
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
            class="black--text inp-form"
            color="#B9D2EA"
            style="padding: 0"
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
            :no-client-unset="true"
            :offer="offer"
            ref="offerForm"
          ></offer-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      persistent
      scrollable
      v-if="addSaleDialog"
      v-model="addSaleDialog"
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
          style="position: absolute; top: -45px; right: -65px; width: calc(85vw + 60px);"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="$refs.saleForm.closeModal()"
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
                :disabled="!sale.client_id"
                :loading="requestStatus === 'loading'"
                @click="$refs.saleForm.saveSale()"
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
                @click="$refs.saleForm.saleCleaning()"
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
                :disabled="$refs.saleForm && !$refs.saleForm.sale.id"
                :href="$refs.saleForm && $refs.saleForm.sale.attach_file"
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
          <v-spacer></v-spacer>
          <div
            class="ma-0 ml-3 pa-1 rounded white"
          >
            <v-text-field
              :readonly="sale.status !== 'new'"
              :label="$t('saleName')"
              class="dir-rtl dense-input"
              dense
              dir="rtl"
              height="25px"
              hide-details
              style="width: 300px"
              v-model="sale.name"
            />
          </div>
          <div
            class="ma-0 ml-3 pa-1 rounded white"
            dir="ltr"
          >
            <v-select
              :items="[
                {name: 'Новый', value: 'new'},
                {name: 'Завершен', value: 'completed'},
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
              v-if="sale"
              v-model="sale.status"
            />
          </div>
          <div
            class="ma-0 ml-3 pa-1 rounded white"
            dir="ltr"
            v-if="sale && client"
          >
            <v-select
              :item-text="item => `${item.date || '-'} | ${$t(item.type || 'offer')} | ${item.offer_number || '-'} | ₪ ${item.amount} | ${$t(item.status)}`"
              :items="client.offers"
              :label="$t('offerNumber')"
              class="dense-input"
              dense
              dir="ltr"
              height="25px"
              hide-details
              item-value="id"
              required
              style="width: 130px"
              v-model="sale.offer_id"
              clearable
            />
          </div>
          <div
            class="ma-0 pa-1 rounded white"
          >
            <v-text-field
              :label="$t('saleNumber')"
              :value="sale.sale_number"
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
            <div class="py-3">{{ $t('sale') }}</div>
          </v-btn>
        </div>
        <v-card-text
          :style="'height: 85vh;'"
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA;"
        >
          <sale-form
            :no-client-unset="true"
            :sale="sale"
            ref="saleForm"
          ></sale-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import handleFilesMixin from "@/mixins/handleFiles"

export default {
  name: "ClientTable",
  mixins: [handleFilesMixin],
  props: {
    items: Array,
    sales: Array,
    offers: Array,
  },
  components: {
    OfferForm: () => import("../offers/OfferForm"),
    SaleForm: () => import("../sales/SaleForm"),
  },
  computed: {
    ...mapGetters([
      'client',
      'dialogNote',
      'dialogMain',
      'offer',
      'offerProducts',
      'sale',
      'requestStatus',
      'openedDialogs',
    ]),

    addSaleDialog: {
      get () {
        return this.openedDialogs.includes('addSale')
      },
      set (newValue) {
        this.$store.dispatch('setOpenedDialogs', { name: 'addSale', value: newValue })
      },
    },
  },
  data: () => ({
    files: false,
    note: '',
    activeItem: null,
    type: '',
  }),
  
  created () {},

  methods: {
    showNoteForm(item, type) {
      this.type = type
      this.activeItem = item
      this.$store.dispatch('get' + type, item).then(() => {
        this.$store.commit('setDialogNote', true)
      })
    },
    saveNote(item, type) {
      this.$store.dispatch('save' + this.type, this.activeItem).then(() => {
        this.$store.commit('setDialogNote', false)
      })
    },
    closeDialogNote() {
      this.$store.commit('setDialogNote', false)
    },
    removeOfferFile(offer, file) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          offer.offer_files = offer.offer_files.filter(f => f.id !== file.id)
          this.$store.dispatch('saveOffer', offer)
        }
      })
    },
    removeSaleFile(sale, file) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          sale.sale_files = sale.sale_files.filter(f => f.id !== file.id)
          this.$store.dispatch('saveSale', sale)
        }
      })
    },
    async editOffer(offer) {
      await this.$store.dispatch('getOffer', offer)
      this.$store.commit('setDialogMain', true)
    },
    async editSale(sale) {
      await this.$store.dispatch('getSale', sale)
      this.addSaleDialog = true
    },
  },
}
</script>


<style lang="scss">

.client-table-block {
.client-table {
  display: flex;
  margin: 0 -2.5px;
  margin-top: 2.5px;
  height: 100%;
  align-items: baseline;
  &__footer {
    height: 44px;
    margin-top: auto;
    max-width: 100%;

    &-item {
      padding: 0 6px 6px;
      height: 100%;
    }
    .custom-pag {
      height: 100%;
    }
    .v-pagination {
      justify-content: flex-end;
      margin-top: auto;
    }
  }
  &__inner {
    border-radius: 6px;
    background: #fff;
    margin: 0 2.5px;
    padding: 0 1px;
    flex: 1 0 auto;
    .v-data-table {
      width: 100%;
      height: 100%;
    }
  }
  .mdi-file-document-outline {
    color: #82b1ff;
  }
  .mdi-playlist-edit {
    color: #bdbdbd;
  }
  .v-icon{
    margin: 0 8px;
  }
  .table-title {
    border-top: 4.5px solid #fff !important;
    border-bottom: 2.25px solid #fff !important;
    color: #666666 !important;
    font-weight: 400 !important;
    background-color: #cce3ff !important;
    border-radius: 6px !important;
    margin: 3px !important;
    height: 56px !important;
    &:first-child {
      width: 22% !important;
    }
  }
}
}
.client-table-block {
  max-height: calc(100vh - 256px);
  overflow: hidden;
  overflow-y: auto;
  background: #b9d2ea;
  .client-table {
    align-items: flex-start !important;
  }
  .client-table__inner .v-data-table__wrapper::before {
    display: none !important;
  }
}

.client-table__inner {
  padding-bottom: 2.25px !important;
  &.non-border {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  .v-data-table__wrapper {
    overflow: hidden;
    table {
      border-radius: 4px;
      .offer-title {
        padding-left: 36px;
        &:nth-child(odd) {
          color: #2979FF;
        }
        &:nth-child(even) {
          color: #424242;
        }
      }
      tr {
        border-radius: 4px !important;
      }
      th {
        border: 2.25px solid #fff;
      }
      td {
        background: transparent !important;
        border-top: 2.25px solid #fff;
        border-bottom: 2.25px solid #fff;
        &:first-child {
          border-left: 2.25px solid #fff;
        }
        &:last-child {
          border-right: 2.25px solid #fff;
        }
      }
    }
    tbody {
      background: #CCE3FF !important;
    }
  }
}

@media (min-width: 1600px) {
.special-td{
  text-align: center;
  div{
    display: inline-block;
    text-align: left;
  }
   .v-icon{
    margin-left: 28px;
    margin-right: 0;
  }
  .mdi-playlist-edit{
    font-size: 30px;
    margin-left: 22px;
  }
}
}

@media (max-width: 1400px) {
  .client-table {
    .table-title {
      font-size: 12.5px !important;
    }
    th {
      padding: 0 8px !important;
    }
    td {
      font-size: 14px;
      padding: 4px !important;
    }
  }
}
</style>
