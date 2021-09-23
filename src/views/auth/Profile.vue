<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="11" md="11" sm="8" xl="7">
        <v-card class="elevation-4">
          <v-row>
            <v-col cols="12">
              <div class="pa-7 pa-sm-11">
                <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">Profile</h2>

                <v-form ref="form" v-model="valid" @submit="submit">
                  <v-text-field
                    v-model="profile.email"
                    label="E-mail"
                    class="mt-4"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    v-model="form.username"
                    :rules="usernameRules"
                    label="Username"
                    outlined
                    type="text"
                    :counter="150"
                  ></v-text-field>
                  <v-text-field
                    v-model="form.first_name"
                    label="First name"
                    outlined
                    type="text"
                    :counter="30"
                  ></v-text-field>
                  <v-text-field
                    v-model="form.last_name"
                    label="Last name"
                    outlined
                    type="text"
                    :counter="150"
                  ></v-text-field>
                  <v-btn
                    :disabled="!valid"
                    block
                    color="primary"
                    submit
                    type="submit"
                  >Submit</v-btn>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "Profile",

  data: () => ({
    valid: true,
    password: "",
    show1: false,
    usernameRules: [
      v => !!v || "Username is required",
    ],
    checkbox: false,
    form: {
      first_name: null,
      username: null,
      last_name: null
    },
    profile: {}
  }),

  methods: {
    ...mapActions("auth", ["getProfile", "updateProfile"]),
    submit(event) {
      event.preventDefault();
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        this.updateProfile(this.form).then(res => {
          this.profile = Object.assign({}, res.data);
          this.resetForm();
        });
      }
    },
    resetForm() {
      this.form = {
        username: this.profile.username,
        first_name: this.profile.first_name,
        last_name: this.profile.last_name
      }
    }
  },

  async mounted() {
    let res = await this.getProfile();
    this.profile = Object.assign({}, res.data);
    this.resetForm();
  }
};
</script>

<style lang="scss" scoped>
</style>
