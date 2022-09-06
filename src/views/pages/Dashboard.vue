<template>
  <v-container
    id="alerts"
    fluid
    tag="section"
  >

<!--    <base-material-snackbar-->
<!--      v-model="snackbar"-->
<!--      :type="color"-->
<!--      v-bind="{-->
<!--        [parsedDirection[0]]: true,-->
<!--        [parsedDirection[1]]: true-->
<!--      }"-->
<!--    >-->
<!--      Welcome to <span class="font-weight-bold">&nbsp;MATERIAL DASHBOARD&nbsp;</span> — a beautiful admin panel for every web developer.-->
<!--    </base-material-snackbar>-->

  </v-container>
</template>

<script>
  export default {
    name: 'DashboardNotifications',

    data: () => ({
      color: 'info',
      colors: [
        'info',
        'success',
        'warning',
        'error',
      ],
      direction: 'top center',
      directions: [
        'top left',
        'top center',
        'top right',
        'bottom left',
        'bottom center',
        'bottom right',
      ],
      snackbar: false,
    }),

    computed: {
      parsedDirection () {
        return this.direction.split(' ')
      },
    },

    methods: {
      randomColor () {
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
      },
    },
  }
</script>

<style>
</style>
