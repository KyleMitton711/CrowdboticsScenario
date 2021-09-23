<template>
  <v-app>
    <router-view />
    <notifications :duration="5000"/>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
