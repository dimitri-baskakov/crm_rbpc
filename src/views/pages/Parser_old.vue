<template>
  <div>
    <!-- <div>
      {{statusParsers}}
    </div>
    <hr> -->
    <div :key="manufacturer.id" v-for="manufacturer in manufacturers">
      <hr>
      <div class="ma-5">
        <div class="header">
          <h2>{{ manufacturer.name }}</h2>
          <div>
            <v-btn
              :disabled="['load', 'start'].includes(statusParsers[manufacturer.name].value) || cronSwitchManufacturers[manufacturer.id].value === 'on'"
              @click="startParser(manufacturer.name)"
              color="primary"
              small
            >запустить парсер</v-btn>
            <v-btn
              :disabled="disabledImport || (settings && settings.some(s => s.name.includes(manufacturer.name) && !!parseInt(s.value))) || cronSwitchManufacturers[manufacturer.id].value === 'on'"
              @click.once="updateGoods(manufacturer.name)"
              color="primary"
              small
            >запустить импорт</v-btn>
            <!-- <v-btn small color="success">запустить всё</v-btn> -->
          </div>
        </div>
        <table v-if="scheduleParsers" class="weekDays-table">
          <tr>
            <td @click="cronSwitch(cronSwitchManufacturers, manufacturer.id)" style="width: 80px"
                :style="{background: cronSwitchManufacturers[manufacturer.id].value === 'off' ? '#a2a2a2' : '#15d71a'}">
              {{ $t(cronSwitchManufacturers[manufacturer.id].value) }}
            </td>
            <td v-for="schedule in scheduleParsers[manufacturer.id]['1']">{{ schedule.time }}</td>
          </tr>
          <tr v-for="schedule in scheduleParsers[manufacturer.id]">
            <td>{{ weekDays[(schedule[0].weekday - 1)] }}</td>
            <td v-for="sheet in schedule"
                @click="selectTime(sheet, manufacturer)"
                class="sheet"
                :style="{background: sheet.selected ? '#838c84': 'white'}">
            </td>
          </tr>
        </table>
        <v-row>
          <v-col>
            <v-row :align="alignment" :justify="justify">
              <v-card v-for="n in parserData" class="mx-2" flat>
                <v-card-title style="background: #a2a2a2;">
                  <v-card-title>{{ n.label }}</v-card-title>
                </v-card-title>
                <v-toolbar>
                  <v-card-text>{{ parserValue(manufacturer.name, n.id) }}</v-card-text>
                </v-toolbar>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      generateColor: false,
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
      alignment: 'start',
      justify: 'end',
      text: 'Lorem ipsum',
      weekDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      disabledImport: false,
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
  },

  async created() {
    await this.$store.dispatch('getSettings', {settingsName: 'parserImportStatus'})
    await this.$store.dispatch('getScheduleParsers')
    this.manufacturers.forEach(manufacturer => {
      this.$store.dispatch('updateStatusParser', manufacturer.name)
    })
  },

  destroyed() {
    this.$store.commit('setScheduleParsers', null)
  },

  methods: {
    selectTime(sheet, manufacturer) {
      this.$store.dispatch('setTimeParser', sheet).then(res => {
        for (let schedule of this.scheduleParsers[manufacturer.id][sheet.weekday]) {
          if (sheet.id === schedule.id) {
            console.log(sheet.selected, res)
            schedule.selected = res.selected
          }
        }
      })
    },

    cronSwitch(cronSwitchManufacturers, manufacturerId) {
      console.log(cronSwitchManufacturers)
      let cronSwitchManufacturer = cronSwitchManufacturers[manufacturerId];
      this.$store.dispatch('cronSwitchManufacturer', {id: cronSwitchManufacturer.id}).then(res => {
          this.cronSwitchManufacturers[manufacturerId].value = res.switch;
      })
    },

    parserValue(manufacturerName, valueId) {
      let result = ''
      if (
        this.statusParsers &&
        ['end', 'load', 'start'].includes(this.statusParsers[manufacturerName] && this.statusParsers[manufacturerName].value)
      ) {
        result = this.statusParsers[manufacturerName][valueId]
      }
      return result
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
  }
}
</script>

<style lang="scss">
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
