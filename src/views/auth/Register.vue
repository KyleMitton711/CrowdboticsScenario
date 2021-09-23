<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="11" md="11" sm="8" xl="7">
        <v-card class="elevation-4">
          <v-row>
            <v-col cols="12">
              <div class="pa-7 pa-sm-12">
                <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">Sign Up</h2>
                <h6 class="subtitle-1">
                  Already have an account?
                  <a @click="close" class="black--text">Sign In</a>
                </h6>

                <v-alert type="error" v-if="errorMessage">
                  {{ errorMessage }}
                </v-alert>

                <v-form ref="form" @submit="submit">
                  <v-text-field
                    v-model="form.name"
                    type="text"
                    :error-messages="fieldErrors('form.name')"
                    @input="$v.form.name.$touch()"
                    @blur="$v.form.name.$touch()"
                    class="mt-4"
                    label="Name"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="form.email"
                    type="email"
                    :error-messages="fieldErrors('form.email')"
                    @input="$v.form.email.$touch()"
                    @blur="$v.form.email.$touch()"
                    label="E-mail"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="form.password"
                    :error-messages="fieldErrors('form.password')"
                    @input="$v.form.password.$touch()"
                    @blur="$v.form.password.$touch()"
                    label="Password"
                    outlined
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show1 = !show1"
                    :type="show1 ? 'text' : 'password'"
                  ></v-text-field>
                  <v-btn
                    :disabled="$v.form.$invalid"
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
import {
  required,
  minLength,
  maxLength,
  email
} from "vuelidate/lib/validators";
import validationMixin from "@/mixins/validationMixin";

export default {
  name: "Register",
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(255)
      },
      email: {
        required, 
        email,
        maxLength: maxLength(254)
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(128)
      }
    }
  },
  validationMessages: {
    form: {
      name: {
        required: "Name is required",
        maxLength: "Name must be less than 255 characters"
      },
      email: {
        required: "Email is required",
        email: "Email must be valid",
        maxLength: "Email must be less than 254 characters"
      },
      password: { 
        required: "Password is required",
        minLength: "Password must be more than 6 characters",
        maxLength: "Password must be less than 128 characters"
      }
    }
  },
  data: () => ({
    form: {
      name: null,
      email: null,
      password: null
    },
    show1: false,
    errorMessage: null,
    emailError: null
  }),
  methods: {
    ...mapActions("auth", ["register"]),
    async submit(event) {
      event.preventDefault();
      let res = await this.register(this.form);
      console.log(res)
      if (res.data) {
        if (res.data.key) {
          this.errorMessage = null;
          localStorage.setItem('key', res.data.key);
          this.$router.push('/apps');
        }
        this.close();
      } else {
        if (res.email && res.email.length > 0) {
          this.errorMessage = res.email[0];
        }
        // error handling
      }
    },
    close() {
      this.$router.push('/auth/login');
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
