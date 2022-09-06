<template>
  <div
    class="pb-1 assemblies"
    style="background: #B9D2EA; max-height: 100vh; overflow: hidden;">
    <v-toolbar color="elevation-0" height="45">
      <v-row>
          <v-col
          class="align-center d-flex justify-space-between category-goods__search" 
          cols="2"
          >
          <v-toolbar-title>
            <div class="flex-column">
              {{ $t('assemblies') }}
              ({{ items && items.length || 0 }})
              <div class="assembly-sublogo">{{ '' }}</div>
            </div>
          </v-toolbar-title>
        </v-col>
        <v-col 
        class="align-center d-flex justify-end category-goods__search" 
        cols="9"
        >
          <v-row>
            <v-col col="6">
            </v-col>
            <v-col 
            class="align-center d-flex justify-end category-goods__search" 
            col="6"
            >
              <v-text-field
                @click:prepend-inner="clearSearch"
                @keyup.enter="() => { page = 1; getAssemblies({ search }); }"
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
                @click="() => { page = 1; getAssemblies({ search }); }"
                class="ml-1 mr-0 search-button primary category-goods__search-button"
                small
              >
                {{ $t('search') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col 
        class="align-center d-flex justify-center category-goods__search" 
        cols="1"
        >
          <v-tooltip bottom open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
              @click="createCategory" 
              v-bind="attrs" 
              v-on="on" 
              icon
              style="background-color: transparent;"
              >
                <v-icon large>mdi-folder-plus-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('createCategory') }}</span>
          </v-tooltip>
          <v-tooltip bottom open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn 
              class="ma-0"
              @click="createAssembly" 
              v-bind="attrs" 
              v-on="on" 
              icon
              style="background-color: transparent;"
              >
                <v-icon large>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('createAssembly') }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-row class="flex-nowrap app-wrapper">
      <v-col
        class="rounded white app-inner-wrapper"
        cols="12"
        md="12"
        style="max-height: calc(100vh - 0px); overflow: hidden;">
        <v-data-table
          :headers="showHeaders"
          :items-per-page="parseInt(paginationMeta.perPage)"
          :items="items"
          @dblclick:row="viaEditAssembly"
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
              class="d-flex justify-start align-center">
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('id')}"
                class="d-flex justify-start">
                <div @click="sortRows('id')" class="d-flex mr-2" style="cursor: pointer;"></div>
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
                  <sort-indicator
                  :columnName="'id'"
                  :options="options"
                  >
                  </sort-indicator>
                </div>
              </div>
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('assembly_number')}"
                class="d-flex justify-start ml-2">
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
                  <sort-indicator
                  :columnName="'assembly_number'"
                  :options="options"
                  ></sort-indicator>
                </div>
                <div
                  @click="sortRows('assembly_number')"
                  class="d-flex mr-2"
                  style="cursor: pointer;">
                  <div class="align-self-center font-12">
                    {{ $t('assemblyNum') }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.section="{ header }">
            <div
              @contextmenu="showSelectedHeaders"
              class="text-center"
              style="height: 100%;"
            >
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('section')}"
                class="d-flex justify-end align-center"
                style="height: 100%;"
              >
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
                  <sort-indicator :columnName="'section'" :options="options"></sort-indicator>
                </div>
                <div @click="sortRows('section_id')" class="d-flex" style="cursor: pointer;">
                  <!-- <div @click="filterAssemblies({})" class="align-self-center font-12"> -->
                  <div class="align-self-center font-12">
                    <div>{{ $t('category') }}:</div>
                    <div>{{ activeSection.id ? activeSection.name_ru : $t('allCategories') }}</div>
                  </div>
                </div>
                <v-menu
                  v-model="isShowCategoryMenu"
                  offset-y
                  absolute
                  open-delay="500"
                  style="background-color: white;">
                  <template #activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-btn class="assemblies-menu-btn" icon>
                        <v-icon>mdi-menu-down</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <v-list class="assemblies-category-list">
                    <v-list-item>
                      <v-list-item-title @click="filterAssemblies({}, activeStatus)">{{ 'Показать все' }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-for="(section, index) in sections.data" :key="section.id || index">
                      <v-list-item-title @click="filterAssemblies(section, activeStatus)">{{ section.name_ru }}</v-list-item-title>
                    </v-list-item>

                  </v-list>
                </v-menu>
              </div>
            </div>
          </template>
          <template #header.items="{ header }">
            <div @contextmenu="showSelectedHeaders">
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('items')}"
                class="d-flex justify-start"
                style="margin-left: -15px;"
                >
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
                  <sort-indicator :columnName="'items'" :options="options"></sort-indicator>
                </div>
                <div @click="sortRows('items')" class="d-flex" style="cursor: pointer;">
                  <div>
                    <span class="d-block font-12 text-center">
                      {{ $t('items') }}
                    </span>
                     <span class="d-block font-12 text-center mt-1">
                      {{ $t('selectedbyall') }}
                     </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.manufacturers="{ header }">
            <div @contextmenu="showSelectedHeaders">
              <div
                :class="{'font-weight-black primary--text': options.sortBy.includes('manufacturers')}"
                class="d-flex justify-start"
                style="margin-left: -15px;"
                >
                <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator">
                  <sort-indicator :columnName="'manufacturers'" :options="options"></sort-indicator>
                </div>
                <div
                  @click="sortRows('manufacturers')"
                  class="d-flex"
                  style="cursor: pointer;">
                  <div>
                    <span class="d-block font-12 text-center">
                      {{ $t('manufacturers') }}
                    </span>
                     <span class="d-block font-12 text-center mt-1">
                      {{ $t('selectedbyall') }}
                     </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #header.note="{ header }">
            <span class="d-flex justify-center align-center font-12 text-cener">
              {{ $t('note') }}
            </span>
          </template>
          <template #header.amount="{ header }">
            <div
            class="d-flex column"
            @contextmenu="showSelectedHeaders"
              >
              <span class="d-block font-12"
              style="margin-left: 55px"
              >
                {{ $t('marginal_price') }}
              </span>
              <span class="d-block font-12 mt-1"
              style="margin-left: -25px"
              >
                {{ $t('amount') }}
              </span>
            </div>
          </template>
          <template #header.status="{ header }">
            <div class="d-flex justify-center align-center font-12 text-cener">
              <div class="align-self-center font-12">
                <div>{{ $t('status') }}:</div>
                <div>{{ !activeStatus ? 'все' : $t(activeStatus) }}</div>
              </div>
              <v-menu
                v-model="isShowStatusMenu"
                offset-y
                absolute
                open-delay="500"
                style="background-color: white;">
                <template #activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-btn class="assemblies-menu-btn" icon>
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </div>
                </template>
                <v-list class="assemblies-category-list">
                  <v-list-item>
                    <v-list-item-title @click="filterAssemblies(activeSection, null)">{{ 'Показать все' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="filterAssemblies(activeSection, 'enabled')">{{ $t('enabled') }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="filterAssemblies(activeSection, 'disabled')">{{ $t('disabled') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
          <template #header.actions="{ header }">
            <span class="d-flex justify-center align-center font-12 text-cener">
              {{ $t('actions') }}
            </span>
          </template>
          <template #item.id="{item}">
            <div class="text-center font-16">
              <a class="text-green" @click.prevent="editAssembly(item)">
                {{ item.id }}
              </a>
            </div>
            <div class="text-center">
              {{ item.created_at }}
            </div>
          </template>
          <template #item.section="{ item }">
            <div v-if="!activeSection.id" class="font-16 text-right">
              {{ item.section && item.section.name_ru || '' }}
            </div>
            <div class="font-12 text-right">
              {{ item && item.name || '' }}
            </div>
            <div dir="rtl" class="align-start d-flex justify-space-between text-right" v-if="!!item.sku">
              <div class="">
                <a @click="editAssembly(item)" class="font-12 tex t-center">
                  {{ item.sku }}
                </a>
              </div>
              <div class="pl-2">
                <v-tooltip
                  open-delay="400"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click.stop="copyToClipboard(item.sku)"
                    class="copy-icon pa-0 ma-0"
                    small
                    tag="a"
                    v-bind="attrs"
                    v-on="on"
                  >mdi-content-copy</v-icon>
                  </template>
                  <span>{{ $t('copy') }}</span>
                </v-tooltip>
              </div>
            </div>
          </template>
          <template #item.items="{ item }">
            <span class="font-16 text-cente">
              {{ item.products.filter(p => p && p.pivot && p.pivot.main).length }}
              / {{ item.products.length }}
            </span>
          </template>
          <template #item.manufacturers="{ item }">
            <span class="font-16 text-center"
             v-if="item.products">
              {{ Array.from(new Set(item.products.map(p => p.manufacturer_id))).length }}
            </span>
            <span class="font-16 text-center"
            v-else>0 / 0</span>
          </template>
          <template #item.note="{ item }">
            <v-menu
              :close-on-content-click="false"
              :disabled="item.note == null"
              offset-x
              open-delay="500"
              open-on-hover
              class="noteMenu"
              style="border: 0; left: 50px !important;"
              top>
              <template #activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <span
                    class="font-16"
                    :class="!!item.note ? 'text-green' : ''"
                    v-if="!!item.note">
                    {{ 'есть' }}
                  </span>
                  <span 
                  class="font-16"
                  v-else>
                  {{ 'нет' }}
                  </span>
                  <v-btn
                    :class="item.note == null ? 'mx-2' : 'mx-1 font-green'"
                    icon
                    plain
                    small
                    style="background: transparent;"
                    v-bind="attrs"
                    v-on="on"
                    @click="showNoteForm(item)">
                    <v-icon
                    class="d-flex justify-center align-center"
                    :class="!!item.note ? 'font-green' : ''"
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
              "
              >
                <div
                v-if="!!item.note"
                class="text-end"
                style="width: 100%; height: 100%;"
                >
                  {{item.note}}
                </div>
              </v-list>
            </v-menu>
          </template>
          <template #item.amount="{item}">
             <div
             class="d-flex flex-column justify-center bordered-both"
             style="height: 90%;"
             >
              <span class="d-block font-16"
              style="margin-left: 55px"
              >
                {{ item.marginal_price }}
              </span>
              <span class="d-block font-16 mt-1"
              style="margin-left: -25px"
              >
                {{ item.amount }}
              </span>
            </div>
          </template>
          <template #item.status="{ item }">
            <span 
            class="text-center font-16" 
            style="color:#69D169"
            v-if="item.status === 'enabled'"
            >
              Включен
            </span>
            <span 
            class="text-center font-16"
            v-else  
            style="color:#424242"
            >
              Выключен
            </span>
            <div>
              <span 
              class="text-center font-12" 
              style="color:#72BA52"
              v-if="item.detectStatus"
              >
                Доступен
              </span>
              <span 
              class="text-center font-12"
              v-else  
              style="color:#F15A24"
              >
                Недоступен
              </span>
            </div>
          </template>
          <template #item.actions="{ item }">
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="editAssembly(item)"
                  class="ma-0 pa-0"
                  color="black"
                  icon
                  plain
                  small
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span class="font-16">
                {{ $t('edit') }}
              </span>
            </v-tooltip>
            <!-- <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="item.status != 'enabled'"
                  @click="deleteAssembly(item)"
                  class="ma-0 pa-0"
                  color="black"
                  icon
                  plain
                  small
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="font-12">
                {{ $t('delete') }}
              </span>
            </v-tooltip> -->
          </template>
        </v-data-table>

        <div
          class="rounded main-page-pagination"
          v-if="items.length">
          <v-row class="rounded" justify="space-between">
            <v-col
            class="d-flex align-center pa-0 pl-2"
            cols="12"
            md="1"
            >
              <v-text-field
              :value="paginationMeta.perPage"
              @keyup.enter="changePerPage($event, 'change-per-page-assembly')"
              class="mt-3 ml-2  main-page-pagination__input"
              dense
              label="Количество"
              max="2000"
              min="1"
              type="number"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="11">
              <div class="text-center">
                <v-pagination
                  class="main-page-pagination__wrapper"
                  :length="paginationMeta.pageCount"
                  @input="selectedPage($event, 'change-page-assembly')"
                  v-model="paginationMeta.page">
                </v-pagination>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- main modal -->
    <v-dialog
      :retain-focus="false"
      max-width="1366px"
      persistent
      scrollable
      v-if="dialogMain"
      v-model="dialogMain"
      class="category-products__modal"
      width="100%"
      height="70vh"
      >
      <v-card
        class="rounded assembly-form offer-form"
        style="border: 4.5px solid #B9D2EA; background: #B9D2EA;">
        <div
          class="align-center d-flex flex-nowrap model-header"
          color="transparent"
          dark
          dir="rtl"
          style="position: absolute; top: -57px; right: -65px; width: calc(1366px + 60px);"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="$refs.assemblyForm.closeModal()"
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
                @click="$refs.assemblyForm.saveAssembly()"
                class="dialog-action-button mr-3"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small>
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
                :disabled="assembly.status !== 'enabled'"
                @click="$refs.assemblyForm.assemblyCleaning()"
                class="dialog-action-button"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small>
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
                :disabled="!assembly.id"
                @click="$refs.assemblyForm.openFileDialog(assembly.attach_file)"
                class="dialog-action-button"
                color="black"
                fab
                icon
                tag="a"
                target="_blank"
                v-bind="attrs"
                v-on="on"
                x-small>
                <v-icon>
                  mdi-file-pdf-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('showPdf') }}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <div class="ma-0 ml-3 pa-1 rounded white inp-form "
          style="width: 310px !important; height: 40px !important;"
          >
            <v-text-field
            :readonly="assembly.status !== 'enabled'"
            :label="$t('assemblyName')"
            class="dense-input category-products__dense-input"
            dense
            hide-details
            width="100%"
            v-model="assembly.name"
            />
          </div>
          <div class="ma-0 ml-3 pa-1 rounded white inp-form"
          dir="ltr"
          style="width: 200px !important; height: 40px !important;"
          >
            <v-select
            :items="[
              {name: 'Включен', value:'enabled'},
              {name: 'Выключен', value:'disabled'},
            ]"
            :label="$t('status')"
            class="dense-input category-products__dense-select"
            dense
            width="100%"
            dir="ltr"
            hide-details
            item-text="name"
            item-value="value"
            required
            v-if="assembly"
            v-model="assembly.status"
            />
          </div>
          <div
          class="ma-0 pa-0 rounded white inp-form d-flex justify-center align-center"
          style="width: 200px; height: 40px !important;"
          >
          <v-text-field
            :label="$t('assemblyNumber')"
            :value="assembly.assembly_number"
            class="dense-input category-products__dense-input font-12"
            dense
            dir="ltr"
            hide-details
            readonly
            style="width: 100%;"
            />
          </div>
          <v-btn
          class="black--text inp-form font-14"
          color="#B9D2EA"
          style="width: 160px !important; height: 40px !important; padding: 0"
          small>
            <div class="py-3">{{ $t('assembly') }}</div>
          </v-btn>
        </div>
        <v-card-text
          :style="'height: 85vh;'"
          class="pa-0 rounded"
          style="overflow: hidden; background: #B9D2EA;">
          <assembly-form
          :assembly="assembly"
          ref="assemblyForm"
          ></assembly-form>
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
      v-model="dialog">
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
      v-model="showSelectedHeadersMenu">
      <v-list flat>
        <v-list-item-group multiple v-model="selectedHeadersData">
          <v-list-item
            :key="`item-${i}`"
            :value="header.value"
            v-for="(header, i) in headersMap">
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
      v-if="assembly"
      persistent
      v-model="dialogNote"
      width="45vw">
      <v-card
        class="rounded assemblies-note offers-note">
        <div
          color="transparent"
          dark
          class="align-center d-flex flex-nowrap"
          style="position: absolute; top: -45px; right: -65px; width: calc(45vw + 60px); max-width: 860px;"
          dir="rtl">
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
                x-small>
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
                x-small>
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-btn class="black--text pa-4 my-0" color="#B9D2EA" small>
            <div class="py-3">{{ $t('note') }}</div>
          </v-btn>
        </div>
        <v-card-text>
          <v-container>
            <v-textarea auto-grow dir="rtl" rows="1" v-model="assembly.note"></v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="90vh"
      max-width="1366px"
      v-if="showForm === 'createSection'"
      persistent
      v-model="dialog"
      width="100%">
      <v-card
        class="rounded assemblies-note"
        style="border: 4.5px solid #B9D2EA; border-radius: 3px; ">
        <div
          color="transparent"
          dark
          class="align-center d-flex flex-nowrap"
          style="position: absolute; top: -45px; right: -65px; width: 1426px;"
          dir="rtl">
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="closeDialogSections"
                class="dialog-action-button"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small>
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
                @click="saveSections"
                class="dialog-action-button mr-3"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small>
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
                class="dialog-action-button"
                :loading="requestStatus === 'loading'"
                @click="addSection"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small>
                <v-icon>
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('addSection') }}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-btn class="black--text pa-4 my-0" color="#B9D2EA" small>
            <div class="py-3">{{ $t('assemblySections') }}</div>
          </v-btn>
        </div>
        <v-card-text>
          <div class="create-selection__modal">
            <v-row
            class="white"
            no-gutters
            style="height: 30px;"
            >
              <v-col
                class="align-center d-flex justify-space-between category-products__tooltip-col pl-1 pr-2"
                cols="2"
              >
                <v-tabs
                :vertical="vertical"
                active-class="primary lighten-5 active-tab"
                class="tabs-dense black--text"
                v-model="sectionNameWithLocale"
                >
                  <v-tab
                    :href="`#name_${locale}`"
                    :key="locale"
                    class="px-0 mx-0 black--text font-12"
                    color="black"
                    style="height: 20px; min-width: 40px !important;"
                    v-for="locale in $locales"
                  >
                    {{ locale }}
                  </v-tab>
                </v-tabs>
              </v-col>
              <v-col
                class="align-center d-flex justify-space-between pl-0 category-products__tooltip-col"
                cols="4"
              >
              </v-col>
              <v-col
              class="align-center d-flex justify-space-between px-1 category-products__tooltip-col"
              cols="4"
              >
              </v-col>
              <v-col
                class="align-center d-flex justify-space-between px-1"
                cols="2"
              >
              </v-col>
            </v-row>
            <table 
            class="white" 
            style="width: 100%; border-spacing: 4.5px;"
            >
              <thead>
                <tr>
                  <th style="width: 37px;">
                    <div class="d-flex justify-center align-center">
                      <v-checkbox></v-checkbox>
                    </div>
                  </th>
                  <th style="width: 100px;">
                    <span class="d-flex justify-center px-2">
                      Изображение
                    </span>
                  </th>
                  <th style="width: 100px;">
                    <span class="d-flex justify-center px-2">
                      Ширина изображения
                    </span>
                  </th>
                  <th style="width: 100px;">
                    <span class="d-flex justify-center px-2">
                      Путь
                    </span>
                  </th>
                  <th>
                    <span class="d-flex justify-start px-2">
                      Наименование  страницы
                    </span>
                  </th>
                  <th style="width: 100px;">
                    <span class="d-flex justify-center px-2">
                      №
                    </span>
                  </th>
                  <th style="width: 100px;">
                    <span>
                      Инструменты
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
              <tr style="width: 100%;"
                :key="section.id || (index + Math.max.apply(null, sections.data.map(s => s.id || 0)))"
                v-for="(section, index) in sections.data"
                >
                <td align="left">
                  <div class="d-flex justify-center align-center">
                    <v-checkbox v-model="section.active"></v-checkbox>
                  </div>
                </td>
                <td>
                  <div v-if="section.id" class="font-12 d-flex justify-end pr-2">
                    <v-file-input
                      @change="(file) => uploadImage(file, section.id)"
                      accept="image/*"
                      hide-input
                      label="File input"
                    ></v-file-input>
                    <img :src="section.image" :width="50 * parseInt(section.img_width) / 123 + 'px'">
                  </div>
                </td>
                <td>
                  <div class="font-12 d-flex justify-end pr-2">
                    <v-edit-dialog
                      :return-value.sync="section.img_width"
                      @save="reorderSections"
                      >
                      {{ section.img_width || '- - -' }}
                      <template v-slot:input>
                        <v-text-field
                        v-model="section.img_width"
                        :dir="sectionNameWithLocale == 'name_he' ? 'rtl' : 'ltr'"
                        label="Edit"
                        single-line
                        counter
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </div>
                </td>
                <td>
                  <div class="font-12 d-flex justify-end pr-2">
                    <v-edit-dialog
                      :return-value.sync="section.path"
                      >
                      {{ section.path || '- - -' }}
                      <template v-slot:input>
                        <v-text-field
                        v-model="section.path"
                        :dir="sectionNameWithLocale == 'name_he' ? 'rtl' : 'ltr'"
                        label="Edit"
                        single-line
                        counter
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </div>
                </td>
                <td>
                  <div class="font-12 d-flex justify-end pr-2">
                    <v-edit-dialog
                      :return-value.sync="section[sectionNameWithLocale]"
                      >
                      {{ section[sectionNameWithLocale] || '- - -' }}
                      <template v-slot:input>
                        <v-text-field
                        v-model="section[sectionNameWithLocale]"
                        :dir="sectionNameWithLocale == 'name_he' ? 'rtl' : 'ltr'"
                        label="Edit"
                        single-line
                        counter
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </div>
                </td>
                <td>
                  <div class="font-12 d-flex justify-end pr-2">
                    <v-edit-dialog
                      :return-value.sync="section.position"
                      @close="reorderSections"
                      >
                      {{ section.position }}
                      <template v-slot:input>
                        <v-text-field
                        v-model="section.position"
                        :dir="sectionNameWithLocale == 'name_he' ? 'rtl' : 'ltr'"
                        label="Edit"
                        single-line
                        counter
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </div>
                </td>
                <td align="center">
                  <div class="d-flex justify-center align-center">
                    <div>
                       <v-tooltip top open-delay="400">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            @click="deleteSection(section, index)"
                            class="ma-0 pa-0"
                            color="black"
                            icon
                            plain
                            small
                            style="background: transparent;"
                            v-bind="attrs"
                            v-on="on">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span class="font-12">
                          {{ $t('delete') }}
                        </span>
                      </v-tooltip>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

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
  import paginationMixin from "@/mixins/paginations";
  import dateFormat from "@/filters/date";

  export default {
    name : "Assemblies",

    components : {
      ClientForm: () => import ("../components/clients/ClientForm"),
      AssemblyForm: () => import ("../components/assemblies/AssemblyForm"),
      SortIndicator: () => import ("@/views/components/core/SortIndicator")
    },

    mixins : [paginationMixin],

    data() {
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
          sortLocale: this.$i18n.locale
        },
        isShowCategoryMenu: false,
        isShowStatusMenu: false,
        selectedHeadersMenuX: 0,
        selectedHeadersMenuY: 0,
        showForm: '',
        selectedCategory: {},
        sectionNameWithLocale: 'name_ru',
        showSelectedHeadersMenu: false,
        tmpItems: [
          {
            id: 122,
            category: {
              id: 211,
              titile: 'Компьютеры для видеомонтажа'
            },
            items: [],
            manufacturers: [],
            note: '',
            marginal_price: 122.21,
            amount: 1486.00,
            status: true
          }, {
            id: 123,
            category: {
              id: 211,
              titile: 'Компьютеры для видеомонтажа'
            },
            items: [],
            manufacturers: [],
            note: 'qw',
            marginal_price: 122.21,
            amount: 1486.00,
            status: false
          }, {
            id: 121,
            category: {
              id: 211,
              titile: 'Компьютеры для видеомонтажа'
            },
            items: [],
            manufacturers: [],
            note: 'qw',
            marginal_price: 122.21,
            amount: 1486.00,
            status: false
          }
        ],
        vertical: false,
        snackbar: false,
        search: '',
        activeSection: {},
        activeStatus: null,
      }
    },

    filters : {
      dateFormat
    },

    computed : {
      ...mapGetters([
        'client',
        'clients',
        'dialog',
        'dialogMain',
        'dialogNote',
        'assembly',
        'assemblyProducts',
        'assemblies',
        'requestStatus',
        'sections',
      ]),
      items() {
        if (this.assemblies && this.assemblies.meta) {
          this.paginationMeta.page = +this.assemblies.meta.current_page
          this.paginationMeta.perPage = +this.assemblies.meta.per_page
          this.paginationMeta.pageCount = Math.ceil(this.assemblies.meta.total / this.assemblies.meta.per_page)
          return this.assemblies.data
        }
        return []
      },

      showHeaders() {
        return this.selectedHeadersData && this
          .headers
          .filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
      },

      selectedHeadersData: {
        get: function () {
          return this.selectedHeaders || this
            .headers
            .map(h => h.value)
        },
        set: async function (newValue) {
          await this
            .$store
            .dispatch('saveSetting', {
              selectedHeadersAssemblies: JSON.stringify(newValue),
            })
          await this
            .$store
            .dispatch('getSettings', {settingsName: 'selectedHeadersAssemblies'})
        }
      },

      selectedHeaders() {
        let selectedHeadersAssemblies = this.settings && this.settings.length && this
          .settings
          .find(s => s.name == 'selectedHeadersAssemblies')
        selectedHeadersAssemblies = selectedHeadersAssemblies && JSON.parse(selectedHeadersAssemblies.value)
        return selectedHeadersAssemblies
      }
    },

    async created() {
      await this
        .$store
        .dispatch('getAssembly', null)
      await this
        .$store
        .commit('setAssemblyProducts', [])
      await this
        .$store
        .dispatch('getAssemblies')
      this.initialize()

      this
        .$eventHandle
        .$on('change-page-assembly', (page) => {
          this.page = +page
          this
            .$store
            .dispatch('getAssemblies', {page, perPage: this.perPage})
        })
      this
        .$eventHandle
        .$on('change-per-page-assembly', (perPage) => {
          this.perPage = +perPage
          this
            .$store
            .dispatch('getAssemblies', {
              page: this.page,
              perPage
            })
        })

      await this.$store.dispatch('getSections')

      this.headers = Object.values(this.headersMap)
      await this
        .$store
        .dispatch('getSettings', {settingsName: 'selectedHeadersAssemblies'})
    },

    destroyed() {
      this
        .$eventHandle
        .$off('change-page-assembly')
      this
        .$eventHandle
        .$off('change-per-page-assembly')
      this
        .$eventHandle
        .$off('set-dialog')
      this
        .$store
        .commit('setDialogMain', false)
      this
        .$store
        .commit('setAssemblies', {data: []})
    },

    methods : {
      createAssembly() {
        this
          .$store
          .dispatch('getAssembly')
          .then(() => {
            this
              .$store
              .commit('setDialogMain', true)
          })
      },
      showCategoryMenu() {
        this.isShowCategoryMenu = true
      },
      showStatusMenu() {
        this.isShowStatusMenu = true
      },

      initialize() {
        this.headersMap = [
          {
            text: '№ Сборки',
            value: 'id',
            align: 'center',
            sortable: true,
            class: 'caption px-1',
            width: "9%"
          }, {
            text: 'Категория',
            value: 'section',
            align: 'center',
            sortable: true,
            class: 'caption px-1',
            width: '17.5%'
          }, {
            text: 'Товары',
            value: 'items',
            align: 'center',
            sortable: true,
            class: 'caption px-1',
            width: '13%'
          }, {
            text: 'Поставщики',
            value: 'manufacturers',
            align: 'center',
            sortable: true,
            class: 'caption px-1',
            width: '13%'
          }, {
            text: this.$t('note'),
            text: 'Заметка',
            value: 'note',
            align: 'center',
            sortable: true,
            class: 'caption px-1',
            width: '13.8%'
          }, {
            text: this.$t('amount'),
            value: 'amount',
            align: 'center',
            sortable: true,
            class: 'caption',
            width: '13.8%'
          }, {
            text: this.$t('status'),
            value: 'status',
            align: 'center',
            sortable: true,
            class: 'caption',
            width: '7.6%'
          }, {
            text: this.$t('actions'),
            value: 'actions',
            align: 'center',
            class: 'caption px-0',
            width: '6.3%'
          }
        ]
      },

      showNoteForm(assembly) {
        this
          .$store
          .dispatch('getAssembly', assembly)
          .then(() => {
            this
              .$store
              .commit('setDialogNote', true)
          })
      },
      saveNote() {
        this
          .$store
          .dispatch('saveAssembly', this.assembly)
          .then(() => {
            this
              .$store
              .commit('setDialogNote', false)
          })

      },
      closeDialogNote() {
        this
          .$store
          .commit('setDialogNote', false)
      },

      viaEditAssembly(e, data) {
        this.editAssembly(data.item)
      },

      async editAssembly(assembly) {
        await this
          .$store
          .dispatch('getAssembly', assembly)
          // .then(() => {})
        this
          .$store
          .commit('setDialogMain', true);
      },

      deleteAssembly(assembly) {
        this.$swal({
          title: this.$t('are-you-sure') + "!",
          icon: "warning",
          value: true,
          buttons: [
            this.$t('cancel'),
            this.$t('continue')
          ]
        }).then((res) => {
          if (res) {
            this
              .$store
              .dispatch('deleteAssembly', assembly.id)
          }
        })
      },

      showSelectedHeaders(e) {
        e.preventDefault()
        this.showSelectedHeadersMenu = false
        this.selectedHeadersMenuX = e.clientX
        this.selectedHeadersMenuY = e.clientY
        this.$nextTick(() => {
          this.showSelectedHeadersMenu = true
        })
      },

      sortRows: function (sortKey) {
        clearTimeout(this._timerId)
        let sortIndex = this
          .options
          .sortBy
          .indexOf(sortKey)
        if (sortIndex == -1) {
          this
            .options
            .sortDesc
            .push('false')
          this
            .options
            .sortBy
            .push(sortKey)
        } else if (sortIndex > -1 && this.options.sortDesc[sortIndex] == 'false') {
          this
            .options
            .sortDesc
            .splice(sortIndex, 1, 'true')
        } else if (sortIndex > -1 && this.options.sortDesc[sortIndex] == 'true' && this.options.sortBy.length == 1) {
          this
            .options
            .sortDesc
            .splice(sortIndex, 1, 'false')
        } else {
          this
            .options
            .sortBy
            .splice(sortIndex, 1)
          this
            .options
            .sortDesc
            .splice(sortIndex, 1)
        }
        this._timerId = setTimeout(async() => {
          if (JSON.stringify([...this.options.sortBy]) != this.oldSortBy || JSON.stringify([...this.options.sortDesc]) != this.oldSortDesc) {
            this.changeParams(this.options, 'change-params')
            this.oldSortBy = JSON.stringify([...this.options.sortBy])
            this.oldSortDesc = JSON.stringify([...this.options.sortDesc])
          }
        }, 3500)
      },

      async editClient(client) {
        await this
          .$store
          .dispatch('getClient', client)
        this
          .$store
          .commit('setDialog', true)
        this.showForm = 'editClient'
      },

      closeModal() {
        this
          .$store
          .commit('setDialogMain', false)
        this.showForm = ''
      },

      closeDialogSections () {
        this.$store.commit('setDialog', false)
        this.showForm = ''
      },

      async createCategory () {
        await this.$store.dispatch('getSections')
        this.$store.commit('setDialog', true)
        this.showForm = 'createSection'
      },

      saveSections () {
        this.$store.dispatch('saveSections', this.sections.data)
      },

      addSection () {
        this.sections.data.push({
        position: this.sections.data.length + 1,
        name_ru: 'new',
        name_he: 'new',
        name_en: 'new',
        active: true,
        })
      },

      deleteSection (section, index) {
        this.$swal({
          title: this.$t('are-you-sure') + "!",
          icon: "warning",
          value: true,
          buttons: [
            this.$t('cancel'),
            this.$t('continue')
          ]
        }).then((res) => {
          if (res) {
            if (section.id) {
              this.$store.dispatch('deleteSection', section.id)
            } else {
              this.sections.data.splice(index)
            }
          }
        })
      },

      reorderSections () {
        this.sections.data = this.sections.data.sort(function(a, b) {
          return a.position - b.position
        })
        let position = 1
        this.sections.data.map(s => {
          s.position = position++
          return s
        })
      },

      async filterAssemblies (section, status) {
        this.activeSection = section.id ? section : {}
        this.activeStatus = status
        await this.$store.dispatch('getAssemblies', {
          section_id: section.id,
          status: status,
        })
      },

      async getAssemblies (params) {
        await this.$store.dispatch('getAssemblies', params)
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
      
      clearSearch () {
        this.search = null
      },

      uploadImage (file, sectionId) {
        this.$store.dispatch('uploadSectionImage', {file, sectionId})
        // console.log(file)
        // console.log(sectionId)
      },
    },
  }
</script>

<style lang="scss">
  .category-products__tooltip-col {
    .tabs-dense .v-tabs-bar {
      height: 20px !important;
    }
  }
  .create-selection__modal {
    th {
      background-color: #CCE3FF;
      border-radius: 3px;
      font-size: 12px !important;
    }
    tr {
      height: 40px !important;
      border-radius: 4px;
      &:nth-child(odd) {
        background-color: #E3F2FD !important;
      }
      &:nth-child(even) {
        background-color: #EEEEEE !important
      } 
      &:nth-child(odd):hover {
        background-color: #BBDEFB !important
      }
      &:nth-child(even):hover {
        background-color: #E0E0E0 !important
      }
    }
    .v-input--selection-controls__input {
      margin: 0 !important;
    }
    .v-input {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
    .v-input__slot {
      margin-bottom: 0 !important;
    }
    .v-messages {
      display: none !important;
    }
  }
  .assemblies-category-list {
    max-height: 225px;
  }
</style>