<template>
  <div style="margin: 0 auto; width: 90%">
    <table>
      <tr>
        <th>
          #
        </th>
        <th dir="rtl">
          {{$t('name')}}
        </th>
        <th dir="rtl">
          {{$t('value')}}
        </th>
        <th dir="rtl">
          Задать единое название
        </th>
      </tr>
      <tr v-for="(filter, i) in filters">
        <td>
          {{ i + 1}}
        </td>

        <td dir="rtl">
          {{filter.name[$i18n.locale]}}
        </td>
        <td dir="rtl">
          {{filter.value[$i18n.locale]}}
        </td>
        <td dir="rtl">
          <input type="text">
        </td>
      </tr>
    </table>
  </div>

</template>

<script>

import {mapGetters} from 'vuex'

export default {
  name: "FilterForm",
  computed: {
    ...mapGetters(['filters'])
  }
}
</script>

<style scoped>

table td{
  border: solid 1px #c1c1c1;
}
</style>
