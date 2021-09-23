<template>
  <v-app id="auth">
    <router-view />
  </v-app>
</template>

<script>
  import { mapState } from "vuex";
  export default {
    name: 'AuthLayout',
    computed: {
      ...mapState(["showbanner"]),
    },
  }
</script>

<style lang="scss">
</style>