<template>
  <div class="parsers">
    <v-toolbar 
    color="elevation-0" 
    height="45"
    >
      <v-toolbar-title>Парсеры</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip
        open-delay="400"
        top
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :disabled="!isProdServer"
            class="parsers-header__icon"
            icon
            plain
            style="background: transparent;"
            v-bind="attrs"
            v-on="on"
            x-large
          >
            <v-icon small>
              mdi-progress-check
            </v-icon>
          </v-btn>
        </template>
        <span>
          запуск
        </span>
      </v-tooltip>
      <v-tooltip
        open-delay="400"
        top
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="parsers-header__icon"
            icon
            plain
            style="background: transparent;"
            v-bind="attrs"
            v-on="on"
            x-large
          >
            <v-icon small>
              mdi-download
            </v-icon>
          </v-btn>
        </template>
        <span>
          импорт
        </span>
      </v-tooltip>
      <v-tooltip
        open-delay="400"
        top
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :disabled="!isProdServer"
            class="parsers-header__icon"
            icon
            plain
            style="background: transparent;"
            v-bind="attrs"
            v-on="on"
            x-large
          >
            <v-icon small>
              mdi-rotate-left
            </v-icon>
          </v-btn>
        </template>
        <span>
          запустить всё
        </span>
      </v-tooltip>
    </v-toolbar>
    <div class="dashboard-wrapper">
      <div class="dashboard">
        <div
          style="height: calc(100vh - 101px);"
        >
          <v-data-table 
            @dblclick:row="viaEditItem"
            class="elevation-1"
            hide-default-footer 
            v-model="selected" 
            :headers="headers" 
            :items="manufacturers"
            item-key="id"
            show-select 
            v-if="manufacturers"
          >
            <template #header.supplier="{ header }">
              <span class="font-12">
                Поставщик
              </span>
            </template>
            <template #header.items="{ header }">
              <span class="font-12">
                Товары
              </span>
            </template>
            <template #header.start_work="{ header }">
              <span class="font-12">
                Начало работы
              </span>
            </template>
            <template #header.end_work="{ header }">
              <span class="font-12">
                Окончание работы
              </span>
            </template>
            <template #header.duration="{ header }">
              <span class="font-12">
                Продолжительность
              </span>
            </template>
            <template #header.state="{ header }">
              <span class="font-12">
                Состояние
              </span>
            </template>
            <template #header.working_date="{ header }">
              <span class="font-12">
                Дата отработки
              </span>
            </template>
            <template #header.description="{ header }">
              <span class="font-12">
                Описание
              </span>
            </template>
            <template #header.actions="{ header }">
              <span class="font-12">
                Инструменты
              </span>
            </template>
            <template #item.actions="{ item }">
              <div class="table-actions">
                <v-switch
                false-value="off"
                inset
                true-value="on"
                v-model="cronSwitchManufacturers[item.id].value"
                @click="cronSwitch(cronSwitchManufacturers, item.id)"
                v-if="!!cronSwitchManufacturers"
                ></v-switch>
                <v-icon 
                class="mr-2" 
                small 
                @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
              </div>
            </template>
            <template #item.start_work="{item}">
              {{ parserValue(item.name, 'created_at') }}
            </template>
            <template #item.end_work="{item}">
              {{ parserValue(item.name, 'updated_at') }}
            </template>
            <template #item.duration="{item}">
              {{ parserValue(item.name, 'duration') }}
            </template>
            <template #item.state="{item}">
              {{ parserValue(item.name, 'value') }}
            </template>
            <template #item.working_date="{item}">
              {{ parserValue(item.name, 'import_at') }}
            </template>
            <template #item.description="{item}">
              {{ parserValue(item.name, 'description') }}
            </template>
          </v-data-table>
        </div>

        <div class="rounded main-page-pagination" v-if="manufacturers && manufacturers.length" >
          <v-row class="rounded" justify="space-between">
            <v-col 
            class="d-flex align-center pa-0 pl-2"
            cols="12" 
            md="1"
            >
              <v-text-field
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
                ></v-pagination>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <v-dialog 
    width="1242px"
    :retain-focus="false" 
    max-height="90vh" 
    persistent v-model="runDialog" 
    >
      <v-card 
      class="rounded" 
      style="border: 4.5px solid #B9D2EA;"
      >
        <div 
        class="align-center d-flex flex-nowrap"
        color="transparent" 
        dark 
        style="position: absolute; top: -45px; right: -60px; width: calc(1242px + 60px); max-width: 90vw;" 
        dir="rtl"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn @click="() => runDialog = false" class="dialog-action-button" color="black" fab icon v-bind="attrs"
                v-on="on" x-small>
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
              @click="saveParser" 
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
          <v-btn class="black--text pa-4 my-0" color="#B9D2EA" small>
            <div class="py-3 font-16">{{ activeParser.name }} (0)</div>
          </v-btn>
        </div>
        <v-card-text no-gutters>
          <v-row class="main-cont" no-gutters>
            <v-col class="cont" no-gutters v-if="activeParser.id">
              <v-row class="timerow">
                <v-btn :class="{'primary-text': cronSwitchManufacturers[activeParser.id].value === 'on'}" 
                class="timebtn timebtn-main"
                  @click="cronSwitch(cronSwitchManufacturers, activeParser.id)">
                  <span class="off" v-if="cronSwitchManufacturers[activeParser.id].value === 'off'">
                    Выкл.
                  </span>
                  <span
                    class="on" v-else>
                    Вкл.
                    </span>
                  </v-btn>
                <v-col class="col-time" v-for="time in times" :key="time.title">
                  <span class="timespan font-12">{{time.title}}</span>
                </v-col>
              </v-row>
              <v-row class="timerow" v-for="day in days" :key="day.title">
                <span class="timespan font-12">{{day.title}}</span>
                <v-col class="col-timebtn" v-for="time in times" :key="time.title">
                  <div
                    @click="selectTime(scheduleParsers[activeParser.id] && scheduleParsers[activeParser.id][day.weekday].find(s => s.time == time.title), activeParser)"
                    :class="{ 'active': scheduleParsers[activeParser.id] && scheduleParsers[activeParser.id][day.weekday].find(s => s.time == time.title && s.selected) }"
                    class="timebtn waves-effect waves-light"
                  >am</div>
                  <div
                    @click="selectTime(scheduleParsers[activeParser.id] && scheduleParsers[activeParser.id][day.weekday].find(s => s.time == time.titlePm), activeParser)"
                    :class="{ 'active': scheduleParsers[activeParser.id] && scheduleParsers[activeParser.id][day.weekday].find(s => s.time == time.titlePm && s.selected) }"
                    class="timebtn waves-effect waves-light"
                  >pm</div>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="cont" no-gutters>
              <v-row v-if="activeParser.id" class="r-btns" no-gutters>
                <v-btn
                  :disabled="!isProdServer || ['load', 'start'].includes(statusParsers[activeParser.name].value) || cronSwitchManufacturers[activeParser.id].value === 'on'"
                  @click="startParser(activeParser.name)"
                  color="primary"
                >ЗАПУСК</v-btn>
                <v-btn
                  :disabled="disabledImport || (settings && settings.some(s => s.name.includes(activeParser.name) && !!parseInt(s.value))) || cronSwitchManufacturers[activeParser.id].value === 'on'"
                  @click.once="updateGoods(activeParser.name)"
                  color="primary"
                >ИМПОРТ</v-btn>
                <v-btn
                  :disabled="!isProdServer"
                  color="primary"
                >ЗАПУСТИТЬ ВСЁ</v-btn>
              </v-row>
              <v-row class="r-blocks" no-gutters>
                <div class="r-block">
                  <div class="r-block-header">начало работы</div>
                  <div class="r-block-data">{{ parserValue(activeParser.name, 'created_at') || '-' }}</div>
                </div>
                <div class="r-block">
                  <div class="r-block-header">состояние</div>
                  <div class="r-block-data">{{ parserValue(activeParser.name, 'value') || '-' }}</div>
                </div>
              </v-row>
              <v-row class="r-blocks" no-gutters>
                <div class="r-block">
                  <div class="r-block-header">продолжительность</div>
                  <div class="r-block-data">{{ parserValue(activeParser.name, 'duration') || '-' }}</div>
                </div>
                <div class="r-block">
                  <div class="r-block-header">дата отработки</div>
                  <div class="r-block-data">{{ parserValue(activeParser.name, 'updated_at') || '-' }}</div>
                </div>
              </v-row>
              <v-row class="r-blocks" no-gutters>
                <div class="r-block">
                  <div class="r-block-header">окончание работы</div>
                  <div class="r-block-data">{{ parserValue(activeParser.name, 'import_at') || '-' }}</div>
                </div>
                <div class="r-block">
                  <div class="r-block-header">описание</div>
                  <div class="r-block-data">{{ parserValue(activeParser.name, 'description') || '-' }}</div>
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default {
    data() {
      return {
        activeParser: {},
        selected: [],
        item: {
          disabled: false
        },
        runDialog: false,
        disabledImport: false,
        days: [
          {
            title: 'Вс',
            weekday: 1,
          }, 
          {
            title: 'Пн',
            weekday: 2,
          }, 
          {
            title: 'Вт',
            weekday: 3,
          }, 
          {
            title: 'Ср',
            weekday: 4,
          }, 
          {
            title: 'Чт',
            weekday: 5,
          }, 
          {
            title: 'Пт',
            weekday: 6,
          }, 
          {
            title: 'Сб',
            weekday: 7,
          }
        ],
        times: [
          {
            title: '01:00',
            titlePm: '13:00',
          }, 
          {
            title: '02:00',
            titlePm: '14:00',
          }, 
          {
            title: '03:00',
            titlePm: '15:00',
          }, 
          {
            title: '04:00',
            titlePm: '16:00',
          }, 
          {
            title: '05:00',
            titlePm: '17:00',
          }, 
          {
            title: '06:00',
            titlePm: '18:00',
          }, 
          {
            title: '07:00',
            titlePm: '19:00',
          }, 
          {
            title: '08:00',
            titlePm: '20:00',
          }, 
          {
            title: '09:00',
            titlePm: '21:00',
          }, 
          {
            title: '10:00',
            titlePm: '22:00',
          }, 
          {
            title: '11:00',
            titlePm: '23:00',
          }, 
          {
            title: '12:00',
            titlePm: '24:00',
          }
        ],
        headers: [
          {
            text: 'Поставщик',
            sortable: false,
            align: 'center',
            value: 'name',
            width: '8.9%',
            cellClass: 'font-14'
          },
          {
            text: 'Товары',
            sortable: false,
            align: 'center',
            value: 'items',
            width: '6.9%',
            cellClass: 'font-14'
          },
          {
            text: 'Начало работы',
            sortable: false,
            align: 'center',
            value: 'start_work',
            width: '12.3%',
            cellClass: 'font-14'
          },
          {
            text: 'Окончание работы',
            sortable: false,
            align: 'center',
            value: 'end_work',
            width: '12.3%',
            cellClass: 'font-14'
          },
          {
            text: 'Продолжительность',
            sortable: false,
            align: 'center',
            value: 'duration',
            width: '14%',
            cellClass: 'font-14'
          },
          {
            text: 'Состояние',
            sortable: false,
            align: 'center',
            value: 'state',
            width: '12.3%',
            cellClass: 'font-14'
          },
          {
            text: 'Дата отработки',
            sortable: false,
            align: 'center',
            value: 'working_date',
            width: '12.3%',
            cellClass: 'font-14'
          },
          {
            text: 'Описание',
            sortable: false,
            align: 'center',
            value: 'description',
            width: '12.3%',
            cellClass: 'font-14'
          },
          {
            text: 'Инструменты',
            sortable: false,
            align: 'center',
            value: 'actions',
            width: '6.7%',
            cellClass: 'font-14'
          }
        ],
        // desserts: [
        //   {
        //     supplier: 'Morlevi',
        //     items: 55053123,
        //     start_work: '2021-04-08 19:14:39',
        //     end_work: '2021-04-08 19:14:39',
        //     duration: '19:14:39',
        //     state: 'end',
        //     working_date: '2021-04-08 19:14:39',
        //     description: 'описание',
        //     instruments: true
        //   },
        // ],
        parserData: [
          {
            id: 'created_at',
            label: 'начало работы',
          },
          {
            id: 'duration',
            label: 'продолжительность',
          },
          {
            id: 'updated_at',
            label: 'окончание работы',
          },
          {
            id: 'value',
            label: 'состояние',
          },
          {
            id: 'import_at',
            label: 'дата отработки',
          },
          {
            id: 'description',
            label: 'описание'
          },
        ],
      }
    },

    computed: {
      ...mapGetters([
        'cronSwitchManufacturers',
        'errors',
        'manufacturers',
        'requestStatus',
        'scheduleParsers',
        'settings',
        'statusParsers',
      ]),
      isProdServer () {
        return window.location.host.indexOf('8092') > -1
      },
    },

    async created() {
      await this.$store.dispatch('getSettings', {settingsName: 'parserImportStatus'})
      await this.$store.dispatch('getScheduleParsers')
      this.manufacturers.forEach(manufacturer => {
        this.$store.dispatch('updateStatusParser', manufacturer.name)
      })
    },

    methods: {
      editItem(item) {
        this.activeParser = item
        this.runDialog = true
      },

      saveParser() {

      },

      parserValue (manufacturerName, valueId) {
        let result = ''
        if (
          !!this.statusParsers &&
          ['end', 'load', 'start'].includes(!!this.statusParsers[manufacturerName] && this.statusParsers[manufacturerName].value || 0)
        ) {
          result = this.statusParsers[manufacturerName][valueId]
        }
        // return !!result && new Date()
        return result
      },

      cronSwitch(cronSwitchManufacturers, manufacturerId) {
        // console.log(cronSwitchManufacturers)
        let cronSwitchManufacturer = cronSwitchManufacturers[manufacturerId];
        this.$store.dispatch('cronSwitchManufacturer', {id: cronSwitchManufacturer.id}).then(res => {
            this.cronSwitchManufacturers[manufacturerId].value = res.switch;
        })
      },

      async startParser(manufacturerName) {
        await this.$store.dispatch('startParser', manufacturerName)
        this.$store.dispatch('updateStatusParser', manufacturerName)
      },

      async updateGoods(manufacturerName) {
        this.disabledImport = true
        this.$store.dispatch('updateGoods', manufacturerName)
        await this.$store.dispatch('getSettings', {settingsName: 'parserImportStatus'})
      },

      selectTime(sheet, manufacturer) {
        this.$store.dispatch('setTimeParser', sheet).then(res => {
          for (let schedule of this.scheduleParsers[manufacturer.id][sheet.weekday]) {
            if (sheet.id === schedule.id) {
              // console.log(sheet.selected, res)
              schedule.selected = res.selected
            }
          }
        })
      },
      
      viaEditItem(e, data) {
        console.log(data)
        this.editItem(data.item)
      },
    },

    destroyed() {
      this.$store.commit('setScheduleParsers', null)
    },
  }

</script>

<style lang="scss">
  @font-face {
    font-family: 'MyriadPro';
    font-weight: normal;
    src: url(~@/assets/MyriadPro-Regular.otf);
  }

  @font-face {
    font-family: 'Rubik';
    font-weight: normal;
    src: url(~@/assets/Rubik-Regular.ttf);
  }

  .parsers-header__icon {
    .v-icon {
      font-size: 22px !important;
    }
  }

  #settings-wrapper {
    display: none;
  }
  ::-webkit-scrollbar {
    width: 19.02px;
    padding: 1.83px;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-track {
    padding: 1.83px;
    box-shadow: inset 4.5px 0 0 0 white;
    background-color: #EEEEEE;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 4.5px 0 0 0 white;
    background-color: #BDBDBD;
  }

  .v-dialog>.v-card {
    background-color: rgb(185, 210, 234);
    padding: 4.5px;
    border: 0 !important;

    >.v-card__text {
      padding: 0px !important;

      .cont {
        padding: 4.5px !important;
        background-color: white;
        border-radius: 3px;
        box-sizing: border-box;

        .r-block {
          border-radius: 3px;
          overflow: hidden;
          height: fit-content;
          width: calc(50% - 5px);
        }

        .r-block:last-child {
          margin-left: auto;
        }

        .r-block-header {
          font-size: 16px;
          text-align: right;
          max-height: 28.7768px;
          padding-right: 5px;
          background-color: #B9D2EA;
        }

        .r-block-data {
          border: 1px solid #E6E6E6;
          color: #808080;
          text-align: right;
          padding-right: 5px;
          font-size: 16px;
          max-height: 28.8065px;
        }

        .r-blocks {
          height: 56.8px;
          flex-grow: 0
        }

        .r-btns {
          display: flex;
          padding: 0;
          flex-grow: 0;
          margin: 0;
          flex-wrap: nowrap;

          .v-btn {
            width: auto;
            flex: 1;
            background-color: #BDBDBD !important;
            margin-right: 4.5px;
            color: white !important;
            max-height: 44.0167px !important;
          }

          .v-btn:active {
            background-color: #2979FF !important;
          }

          .v-btn:last-child {
            margin-right: 0;
          }
        }

        .r-blocks:last-child {}
      }

      .cont:first-child {
        padding: 16.5px !important;
        margin-right: 4.5px;
      }

      .cont:last-child {
        width: 386px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

    }
  }

  .timespan {
    background-color: #EEEEEE;
    font-size: 16px;
    text-align: left;
    width: 59.4349px;
    padding-left: 5px;
    display: flex;
    height: 27.1017px;
    align-items: center;
    border-radius: 3px;
  }

  .timerow {
    display: flex;
    margin-bottom: -8.7px !important;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .timerow:first-child {
    .timespan {
      display: flex;
      justify-content: center;
      color: black;
      align-items: center;
    }
  }

  .timerow:last-child {
    margin-bottom: -13px !important;
  }

  .col-timebtn {
    display: flex;
    padding: 0 !important;
    margin: 0 !important;
    margin-left: 4.3px !important;
  }

  .col-time {
    display: flex;
    padding: 0 !important;
    margin: 0 !important;
    margin-left: 4.3px !important;
    max-width: 59.4349px;
  }

  .col-timebtn:first-child {
    margin-left: 3.3px !important;
  }

  .timebtn {
    color: #999999 !important;
    font-size: 12px;
    padding: 0 !important;
    width: 50% !important;
    height: calc(100% - 2px);
    cursor: pointer;
    display: flex;
    margin: 0 !important;
    align-items: center;
    justify-content: center;
    border: 1px solid #E6E6E6 !important;
    background-color: white !important;
  }

  .timebtn:hover {
    background-color: #EEEEEE !important;
  }

  .timebtn.active {
    background-color: #CCE3FF !important;
    color: #2979FF !important;
  }

  .timebtn:first-child {
    border-top-left-radius: 3px;
    border-right: 0 !important;
    border-bottom-left-radius: 3px;
  }

  .timebtn:last-child {
    margin-left: -1px !important;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .v-sheet button.v-btn.v-size--default:not(.v-btn--icon):not(.v-btn--fab).timebtn-main {
    padding: 0 !important;
    box-shadow: none;
    width: 59.4349px !important;
    border: 0 !important;
    color: black !important;
    min-width: unset !important;
    height: 27.1017px !important;
    margin-bottom: 3.3px !important;
    background-color: #BDBDBD !important;
    padding: 0 !important;
  }

  .v-sheet button.v-btn.v-size--default:not(.v-btn--icon):not(.v-btn--fab).timebtn-main.primary-text {
    background-color: #CCE3FF !important;
    color: #2979FF !important;
  }

  .parsers {
    height: 100%;
    font-family: 'Rubik';
    $blue-color: #B9D2EA;
    $blue-color-2: #CCE3FF;


    .v-toolbar__title {
      font-size: 16px;
      line-height: 19.2px;
    }

    button {
      width: 20px !important;
      height: 20px !important;
      margin-right: 10px !important;
    }

    .dashboard-wrapper {
      background-color: $blue-color;
      height: calc(100% - 45px);
      box-sizing: border-box;
      padding: 4.5px;

      td:first-child {
        padding: 0 !important;
      }
    }

    .dashboard {
      border-radius: 2.5px;
      background-color: white;
      padding: 4.5px;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }

    .v-data-table {
      height: 100%;
      box-shadow: none !important;

      .v-data-table__wrapper {
        max-height: calc(100vh - 65.5px);
        overflow-y: auto;


      }

      .v-icon__svg {
        height: 15.4692px;
        width: 15.4692px;
      }

      .table-actions {
        display: flex;
        align-items: center;
        justify-content: center;

        button {
          margin-right: 0 !important;
        }
      }

      .v-input--switch--inset {
        margin: 0;
        padding: 0;
        width: fit-content;
        height: auto;

        .v-messages {
          display: none;
        }

        .v-input__slot {
          margin-bottom: 0;
          margin-right: 12.5px;


          input {
            width: 32.1045px;
            height: 17.0865px;
          }

          .v-input--selection-controls__input {
            width: auto;
            height: auto;
            margin-right: 0;

            .v-input--selection-controls__ripple {
              width: 12px;
              height: 12px;
              left: -4.1px;
              top: calc(50% - 13.5px);
            }

            .v-input--switch__track {
              border: 2.1px solid #9E9E9E;
              opacity: 1;
              width: 32.1px;
              position: static;
              margin: 0;
              height: 17px;
              background-color: transparent;
              box-sizing: border-box;
            }

            .v-input--switch__thumb {
              color: #9E9E9E;
              width: 8px;
              left: 4.5px;
              position: absolute;
              top: calc(50% - 4.5px);
              height: 8px;
            }


          }

        }
      }

      .v-input--is-dirty.v-input--switch--inset {

        .v-input--selection-controls__ripple,
        .v-input--switch__thumb {
          transform: translate(15.04px, 0) !important;
        }

        .v-input--switch__track.primary--text {
          border: 2.1px solid #2979FF;
        }

        .v-input--switch__thumb.primary--text {
          color: #2979FF;
        }
      }


      
    }

    .v-data-table__wrapper {
      height: 100%;
    }

    .v-data-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 4.5px !important;
      margin: 0;
    }

  }

  .weekDays-table {
    width: 100%;

    td {
      border: solid 1px #e0e0e0;
    }

    .sheet:hover {
      cursor: pointer;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

</style>
