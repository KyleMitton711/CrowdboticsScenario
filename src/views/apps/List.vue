<template>
  <div>
    <div class="mt-4">
      <v-card>
        <v-data-table
          :headers="headers"
          :items="apps"
          hide-default-footer
          class="border"
          :loading="isLoading"
          :items-per-page="pagination.pageSize"
          loading-text="Loading... Please wait"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search App"
                  single-line
                  hide-details
                  clearable
                ></v-text-field>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" persistent max-width="800px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">
                    <v-icon>mdi-select-group</v-icon>
                    Add App
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
                          <v-text-field
                            label="Name"
                            v-model="form.name"
                            :error-messages="fieldErrors('form.name')"
                            @input="$v.form.name.$touch()"
                            @blur="$v.form.name.$touch()"
                          >
                            <template v-slot:label>
                              <span>Name</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-text-field>
                          <v-textarea
                            label="Description"
                            v-model="form.description"
                          >
                          </v-textarea>
                          <v-select
                            :items="['Web', 'Mobile']"
                            v-model="form.type"
                            label="Type"
                            :error-messages="fieldErrors('form.type')"
                            @input="$v.form.type.$touch()"
                            @blur="$v.form.type.$touch()"
                          >
                            <template v-slot:label>
                              <span>Type</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-select>
                          <v-select
                            :items="['Django', 'React Native']"
                            v-model="form.framework"
                            label="Framework"
                            :error-messages="fieldErrors('form.framework')"
                            @input="$v.form.framework.$touch()"
                            @blur="$v.form.framework.$touch()"
                          >
                            <template v-slot:label>
                              <span>Framework</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-select>
                          <v-text-field
                            label="Domain"
                            v-model="form.domain_name"
                            :error-messages="fieldErrors('form.domain_name')"
                            @input="$v.form.domain_name.$touch()"
                            @blur="$v.form.domain_name.$touch()"
                          >
                          </v-text-field>
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
            <v-btn fab icon small @click="viewItem(item)">
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
            <v-btn fab icon small @click="editItem(item)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab icon small @click="showDeleteConfirmDialog(item)">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reload</v-btn>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2" v-if="pagination.total">
          <v-pagination
            v-model="pagination.pageIndex"
            :length="Math.ceil(pagination.total / pagination.pageSize)"
            @input="loadPrograms"
          ></v-pagination>
        </div>
        <v-dialog v-model="deleteConfirmDialog" max-width="400px">
          <v-card>
            <v-card-title>
              <span class="headline">Confirm Deletion</span>
            </v-card-title>
            <v-card-text class="pt-2">
              <span class="title black--text">
                Are you sure you want to delete this item?
              </span>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="deleteConfirmDialog = false"> Cancel </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="deleteItem">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
    <v-dialog v-model="viewDetail" max-width="500px">
      <v-card class="text-center pa-5">
        <h1> {{ subscription && subscription.name }} <v-chip :color="subscription && subscription.active ? 'success': 'info'"> {{ subscription && subscription.active ? "Active" : "Inactive" }} </v-chip> </h1>
        <h3>$ {{ subscription && subscription.price }}</h3>
        <p> {{ subscription && subscription.description }} </p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
import validationMixin from "@/mixins/validationMixin";

export default {
  name: "AppList",
  mixins: [validationMixin],
  validations: {
    form: {
      name: { required },
      type: { required },
      framework: { required },
      domain_name: {
        maxLength: maxLength(50),
      },
    },
  },
  validationMessages: {
    form: {
      name: {
        required: "Name is required",
      },
      type: {
        required: "Type is required",
      },
      framework: {
        required: "Framework is required",
      },
      domain_name: {
        maxLength: "Domain name must be less than 50 characters",
      },
    },
  },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Type", value: "type" },
      { text: "Framework", value: "framework", sortable: false },
      { text: "Domain", value: "domain_name", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    apps: [],
    editedIndex: -1,
    defaultItem: {
      name: null,
      description: null,
      type: null,
      framework: null,
      domain_name: null,
    },
    search: null,
    form: {
      name: null,
      description: null,
      type: null,
      framework: null,
      domain_name: null,
    },
    isLoading: false,
    deleteConfirmDialog: false,
    selectedItemId: null,
    pagination: {
      pageSize: 15,
      pageIndex: 1,
      total: null,
    },
    viewDetail: false,
    subscription: null
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add App" : "Edit App";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.pagination.pageSize = Math.floor((window.innerHeight - 200) / 60);
    this.initialize();
  },

  mounted() {},

  methods: {
    ...mapActions("app", [
      "getAppList",
      "deleteApp",
      "updateApp",
      "getAppDetail",
      "addApp",
    ]),

    ...mapActions("subscription", [
      "getSubscriptionDetail",
    ]),

    ...mapActions("plan", ["getPlanDetail"]),

    async initialize() {
      this.isLoading = true;
      let res = await this.getAppList();
      this.apps = Object.assign([], res);
      this.isLoading = false;
    },

    async editItem(item) {
      console.log(item);
      this.editedIndex = this.apps.indexOf(item);
      // let res = await this.getAppDetail(item.id);
      this.form = Object.assign({}, item);
      this.dialog = true;
    },

    async viewItem(item) {
      let res = await this.getSubscriptionDetail(item.subscription);
      let plan = await this.getPlanDetail(res.plan);
      this.viewDetail = true;
      this.subscription = Object.assign({}, plan);
      this.subscription["created_at"] = res.created_at;
      this.subscription["active"] = res.active;
    },

    async deleteItem() {
      await this.deleteApp(this.selectedItemId);
      this.$notify({
        text: "App deleted successfully",
        type: "success",
      });
      this.deleteConfirmDialog = false;
      this.pagination.pageIndex = 1;
      this.initialize();
    },

    close() {
      this.dialog = false;
      this.form = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      setTimeout(() => {
        this.$v.$reset();
      }, 100);
    },

    async save() {
      if (this.editedIndex > -1) {
        let res = await this.updateApp(this.form);
        if (res.errors == null) {
          this.$notify({
            text: "App updated successfully",
            type: "success",
          });
        } else {
          // this.$notify({
          //   text: res.errors[0].errorMessage,
          //   type: "error",
          // });
        }
      } else {
        let res = await this.addApp(this.form);
        if (res.errors == null) {
          this.$notify({
            text: "App added successfully",
            type: "success",
          });
        } else {
          // this.$notify({
          //   text: res.errors[0].errorMessage,
          //   type: "error",
          // });
        }
      }
      this.initialize();
      this.close();
    },

    showDeleteConfirmDialog(item) {
      this.deleteConfirmDialog = true;
      this.selectedItemId = item.id;
    },
  },
};
</script>
