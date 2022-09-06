<template>
  <div class="sidebar">
        <div class="sidebar-logo">
          <!-- <img src=".././assets/logo-RB.png" alt="logo-RB"> -->
           <!-- <v-img
            max-height="150"
            max-width="250"
            src=".././assets/logo-RB.png"
          ></v-img>  -->
        </div>
  </div>
</template>

<script>
  export default {
    name: 'Sidebar',

    data: () => ({

    }),
  }
</script>

<style lang="scss" scoped>
.sidebar{
  max-width: 86px;
  background: linear-gradient(180deg, rgba(99,129,161,1) 0%, rgba(25,25,26,1) 100%);
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.sidebar-logo{
  max-width: 86px;
  img{
    max-width: 100%;
    height: auto;
    width: 100%;
  }
}
</style>