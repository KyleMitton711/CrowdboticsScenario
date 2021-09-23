<template>
  <div>
    <div class="mt-4">
      <v-card>
        <v-data-table
          :headers="headers"
          :items="plans"
          hide-default-footer
          class="border"
          :loading="isLoading"
          loading-text="Loading... Please wait"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search Plan"
                  single-line
                  hide-details
                  clearable
                ></v-text-field>
              </v-toolbar-title>
            </v-toolbar>
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-btn fab icon small @click="viewItem(item)">
              <v-icon small> mdi-eye </v-icon>
            </v-btn>
          </template>
          <template slot="item.created_at" slot-scope="{ item }">
            {{ item.created_at | formatdate }}
          </template>
          <template slot="item.price" slot-scope="{ item }">
            $ {{ item.price }}
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reload</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <v-dialog v-model="viewDetail" max-width="500px">
      <v-card class="text-center pa-5">
        <h1> {{ selectedPlan && selectedPlan.name }} <v-chip> $ {{ selectedPlan && selectedPlan.price }} </v-chip> </h1>
        <p> {{ selectedPlan && selectedPlan.description }} </p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PlanList",
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Price", value: "price" },
      { text: "Created At", value: "created_at", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    plans: [],
    search: null,
    isLoading: false,
    selectedItemId: null,
    selectedPlan: null,
    viewDetail: false
  }),

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions("plan", ["getPlanList", "getPlanDetail"]),

    async initialize() {
      this.isLoading = true;
      let res = await this.getPlanList();
      this.plans = Object.assign([], res);
      this.isLoading = false;
    },

    async viewItem(item) {
      // let res = await this.getPlanDetail(item.id);
      this.selectedPlan = Object.assign({}, item);
      this.viewDetail = true;
    },
  },
};
</script>
