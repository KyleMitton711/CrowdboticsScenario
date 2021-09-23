<template>
  <v-app id="inspire">
    <Header v-model="expandOnHover"></Header>

    <v-main>
      <v-container fluid class="page-wrapper">
        <router-view />
      </v-container>
    </v-main>
    <Sidebar :expand-on-hover.sync="expandOnHover"></Sidebar>
  </v-app>
</template>

<script>
import Header from "./modules/Header";
import Sidebar from "./modules/Sidebar";
export default {
  name: "Layout",

  components: {
    Header,
    Sidebar,
  },

  props: {
    source: String,
  },
  data: () => ({
    expandOnHover: false,
  }),
};
</script>

<style>
</style>