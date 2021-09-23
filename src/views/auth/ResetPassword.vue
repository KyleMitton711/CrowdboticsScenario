<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="11" md="11" sm="8" xl="7">
        <v-card class="elevation-4">
          <v-row>
            <v-col cols="12">
              <div class="pa-0 px-4 d-flex justify-end">
                <v-btn icon text @click="close">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <div class="pa-7 pa-sm-12">
                <p
                  class="
                    font-weight-bold
                    mt-4
                    text-center
                    blue-grey--text
                    text--darken-2
                  "
                >
                  Request reset
                </p>
                <h6 class="subtitle-1 mb-5 text-center">
                  Enter your email address to receive a link to reset your
                  password
                </h6>

                <v-form ref="form" @submit="submit">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                    outlined
                  ></v-text-field>
                  <v-btn
                    :disabled="!valid || sent"
                    block
                    color="primary"
                    submit
                    type="submit"
                    >Reset Password</v-btn
                  >
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
import { mapActions } from "vuex";
export default {
  name: "ResetPassword",
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    sent: false,
  }),
  methods: {
    ...mapActions("auth", ["resetPassword"]),
    async submit(event) {
      event.preventDefault();
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        let payload = {
          email: this.email,
        };
        let res = await this.resetPassword(payload);
        if (res.data) {
          
          this.sent = true;
        } else {
          // error handling
        }
      }
    },
    close() {
      this.$router.push("/auth/login");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
