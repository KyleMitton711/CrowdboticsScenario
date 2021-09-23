<template>
  <div>
    <div class="mt-4">
      <v-card>
        <v-data-table
          :headers="headers"
          :items="subscriptions"
          hide-default-footer
          class="border"
          :loading="isLoading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" persistent max-width="800px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">
                    <v-icon>mdi-select-group</v-icon>
                    Add Subscription
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-alert type="error" v-if="errorMessage">
                            {{ errorMessage }}
                          </v-alert>
                          <v-select
                            :items="apps"
                            item-text="name"
                            item-value="id"
                            v-model="form.app"
                            label="App"
                            :error-messages="fieldErrors('form.app')"
                            @input="$v.form.app.$touch()"
                            @blur="$v.form.app.$touch()"
                          >
                            <template v-slot:label>
                              <span>App</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-select>
                          <v-select
                            :items="plans"
                            item-text="name"
                            item-value="id"
                            v-model="form.plan"
                            label="Plan"
                            :error-messages="fieldErrors('form.plan')"
                            @input="$v.form.plan.$touch()"
                            @blur="$v.form.plan.$touch()"
                          >
                            <template v-slot:label>
                              <span>Plan</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-select>
                          <v-select
                            :items="statusItems"
                            v-model="form.active"
                            label="Status"
                          >
                            <template v-slot:label>
                              <span>Status</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="close"> Cancel </v-btn>
                    <v-btn
                      color="primary"
                      :disabled="$v.form.$invalid"
                      @click="save"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-btn fab icon small @click="editItem(item)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <template slot="item.app" slot-scope="{ item }">
            <span class="font-weight-title">{{ getAppName(item.app) }}</span>
          </template>
          <template slot="item.plan" slot-scope="{ item }">
            <span>{{ getPlanName(item.plan) }}</span>
          </template>
          <template slot="item.active" slot-scope="{ item }">
            <span>{{ item.active ? "Active" : "Inactive" }}</span>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reload</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import validationMixin from "@/mixins/validationMixin";
import { findIndex } from "lodash";

export default {
  name: "SubscriptionList",
  mixins: [validationMixin],
  validations: {
    form: {
      plan: { required },
      app: { required },
    },
  },
  validationMessages: {
    form: {
      plan: {
        required: "Plan is required",
      },
      app: {
        required: "App is required",
      },
    },
  },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Plan",
        align: "start",
        sortable: false,
        value: "plan",
      },
      { text: "App", value: "app" },
      { text: "Status", value: "active", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    subscriptions: [],
    editedIndex: -1,
    defaultItem: {
      plan: null,
      app: null,
      active: true,
    },
    search: null,
    form: {
      plan: null,
      app: null,
      active: true,
    },
    isLoading: false,
    selectedItemId: null,
    pagination: {
      pageSize: 15,
      pageIndex: 1,
      total: null,
    },
    apps: [],
    plans: [],
    statusItems: [
      {
        value: true,
        text: "Active",
      },
      {
        value: false,
        text: "Inactive",
      },
    ],
    errorMessage: null
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Subscription" : "Edit Subscription";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  async created() {
    this.pagination.pageSize = Math.floor((window.innerHeight - 200) / 60);
    let res = await this.getAppList();
    this.apps = Object.assign([], res);
    res = await this.getPlanList();
    this.plans = Object.assign([], res);
    this.initialize();
  },

  methods: {
    ...mapActions("subscription", [
      "getSubscriptionList",
      "updateSubscription",
      "getSubscriptionDetail",
      "addSubscription",
    ]),
    ...mapActions("app", ["getAppList"]),
    ...mapActions("plan", ["getPlanList"]),

    async initialize() {
      this.isLoading = true;
      let res = await this.getSubscriptionList();
      this.subscriptions = Object.assign([], res);
      this.isLoading = false;
    },

    async editItem(item) {
      this.editedIndex = this.subscriptions.indexOf(item);
      this.form = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.errorMessage = null;
      this.dialog = false;
      this.form = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      setTimeout(() => {
        this.$v.$reset();
      }, 100);
    },

    async save() {
      if (this.editedIndex > -1) {
        let res = await this.updateSubscription(this.form);
        if (res.data) {
          this.$notify({
            text: "Subscription updated successfully",
            type: "success",
          });
          this.initialize();
          this.close();
        } else {
          this.errorMessage = res[0];
        }
      } else {
        let res = await this.addSubscription(this.form);
        console.log(res)
        if (res.data) {
          this.$notify({
            text: "Subscription added successfully",
            type: "success",
          });
          this.initialize();
          this.close();
        } else {
          this.errorMessage = res[0];
        }
      }
      
    },

    getAppName(id) {
      let index = findIndex(this.apps, function (app) {
        return app.id == id;
      });
      return this.apps[index].name;
    },

    getPlanName(id) {
      let index = findIndex(this.plans, function (plan) {
        return plan.id == id;
      });
      return this.plans[index].name;
    }
  },
};
</script>
