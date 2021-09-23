<template>
  <v-navigation-drawer
    v-model="Sidebar_drawer"
    mobile-breakpoint="960"
    clipped
    :right="$vuetify.rtl"
    mini-variant-width="70"
    :expand-on-hover="expandOnHover"
    app
    id="main-sidebar"
  >
    <v-list expand nav class="mt-1">
      <template v-for="(item, i) in items">
        <!---If Sidebar Caption -->
        <v-row v-if="item.header" :key="item.header" align="center">
          <v-col cols="12">
            <v-subheader v-if="item.header" class="d-block text-truncate">{{
              item.header
            }}</v-subheader>
          </v-col>
        </v-row>
        <!---If Sidebar Caption -->
        <BaseItem :key="`item-${i}`" :item="item" />
      </template>
      <!---Sidebar Items -->
    </v-list>
    <v-list class="mt-16">
      <v-list-item class="px-2" @click="signout">
        <v-list-item-icon>
          <v-icon v-text="'mdi-logout'" />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="'Sign out'" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from 'vuex';
import BaseItem from "@/components/BaseItem";
export default {
  name: "Sidebar",
  components: {
    BaseItem,
  },
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    items: [
      {
        icon: "mdi-application-outline",
        title: "Applications",
        to: "/apps",
      },
      {
        icon: "mdi-notebook",
        title: "Plans",
        to: "/plans",
      },
      {
        icon: "mdi-playlist-check",
        title: "Subscriptions",
        to: "/subscriptions",
      },
      {
        icon: "mdi-account-outline",
        title: "Profile",
        to: "/profile",
      },
    ],
  }),
  computed: {
    Sidebar_drawer: {
      get() {
        return this.$store.state.Sidebar_drawer;
      },
      set(val) {
        this.$store.commit("SET_SIDEBAR_DRAWER", val);
      },
    },
  },
  watch: {
    "$vuetify.breakpoint.smAndDown"(val) {
      this.$emit("update:expandOnHover", !val);
    },
  },

  methods: {
    ...mapActions("auth", ["logout"]),
    async signout() {
      await this.logout();
      localStorage.removeItem('key');
      window.location.href = "/";
    }
  },
};
</script>
<style lang="scss">
#main-sidebar {
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  .v-navigation-drawer__border {
    display: none;
  }
  .v-list {
    padding: 8px 15px;
  }
  .v-list-item {
    &__icon--text,
    &__icon:first-child {
      justify-content: center;
      text-align: center;
      width: 20px;
    }
  }
}
</style>