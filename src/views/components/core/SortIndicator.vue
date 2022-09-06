<template>
  <span
    class="d-inline-flex align-center"
    style="color: #F9A825;"
    v-if="options.sortBy.indexOf(columnName) > -1"
  >
    {{ options.sortBy.indexOf(columnName) + 1 }}
    <v-icon color="black" left small>
      {{ options.sortDesc[options.sortBy.indexOf(columnName)] == 'true' ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
    </v-icon>
  </span>
</template>

<script>
  export default {
    data () {
      return {
      }
    },

    name: 'SortIndicator',

    props: {
      columnName: {
        type: String,
        default: '',
      },
      options: {
        type: Object,
        default: {},
      },
    },
  }
</script>
