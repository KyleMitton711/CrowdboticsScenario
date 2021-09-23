<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="11" md="11" sm="8" xl="7">
        <v-card class="elevation-4">
          <v-row>
            <v-col cols="12">
              <div class="pa-7 pa-sm-11">
                <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">Sign in</h2>
                <h6 class="subtitle-1">
                  Don't have an account?
                  <a @click="register" class="black--text">Sign Up</a>
                </h6>

                <v-alert type="error" v-if="errorMessage">
                  {{ errorMessage }}
                </v-alert>

                <v-form ref="form" v-model="valid" @submit="submit">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    class="mt-4"
                    required
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    required
                    outlined
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show1 = !show1"
                    :type="show1 ? 'text' : 'password'"
                  ></v-text-field>

                  <div class="d-block d-sm-flex align-center mb-4 mb-sm-0">
                    <div class="ml-auto text-right">
                      <a @click="forgotPassword" class="link">Forgot your password</a>
                    </div>
                  </div>
                  <v-btn
                    :disabled="!valid"
                    block
                    color="primary"
                    submit
                    type="submit"
                  >Sign In</v-btn>
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
  name: "Login",

  data: () => ({
    valid: true,
    password: "",
    show1: false,
    passwordRules: [
      v => !!v || "Password is required",
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    checkbox: false,
    errorMessage: null
  }),
  methods: {
    ...mapActions("auth", ["login"]),
    submit(event) {
      event.preventDefault();
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        this.login({
          email: this.email,
          password: this.password
        }).then(res => {
          if (res.key) {
            this.errorMessage = null;
            localStorage.setItem('key', res.key);
            this.$router.push('/apps');
          } else {
            if (res.non_field_errors && res.non_field_errors.length > 0) {
              this.errorMessage = res.non_field_errors[0];
            }
          }
        });
      }
    },
    register() {
      this.$router.push('/auth/register');
    },
    forgotPassword() {
      this.$router.push("/auth/resetpassword");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
