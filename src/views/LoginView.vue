<script setup lang="ts">
import {onMounted, ref} from "vue";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";
import UseInvite from "@/components/UseInvite.vue";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";

const props = defineProps<{
  invite: string | null,
}>();
const emit = defineEmits(['authenticated']);

enum LoginView {
  Login,
  ResetPassword,
  UseInvite,
}

const view = ref(LoginView.Login);

const email = ref('');
const password = ref('');
const permanentSession = ref(false);



const login = async () => {
  const payload = {
    email: email.value,
    password: password.value,
    permanentSession: permanentSession.value,
  };

  const result = await req('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  const { success, changePassword } = await result.json();
  if (success) {
    if (changePassword) {
      view.value = LoginView.ResetPassword;
    } else {
      emit('authenticated');
    }
  }
};

const setViewLogin = () => {
  view.value = LoginView.Login;
};

onMounted(() => {
  if (props.invite) {
    view.value = LoginView.UseInvite;
  }
})
</script>

<template>
  <div class="container p-3">
    <div class="row">
      <div class="col">
        <div class="card">
          <img class="brand-logo mx-auto d-block card-img-top mt-3" src="/public/img/frog.svg" alt="frog"/>
          <template v-if="view === LoginView.Login">
            <h1 class="ms-3 mt-3">{{ lang.login }}</h1>
            <div class="card-body">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">{{ lang.email }}</label>
                  <input id="email" name="email" class="form-control" type="text" v-model="email"/>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">{{ lang.password }}</label>
                  <input id="password" name="password" class="form-control" type="password" v-model="password"/>
                </div>
                <div class="form-check mb-3">
                  <input id="permanentSession" name="permanentSession" class="form-check-input" type="checkbox" v-model="permanentSession"/>
                  <label for="permanentSession" class="form-check-label">{{ lang.keepLoggedIn }}</label>
                </div>
                <div class="mb-3">
                  <input type="submit" class="btn btn-primary" :value="lang.login"/>
                </div>
              </form>
              <hr/>
              <div class="mb-3">
                <button class="btn btn-secondary" @click="view = LoginView.UseInvite">
                  <i class="fa-solid fa-envelope-open"></i>&nbsp;{{ lang.haveAnInvite }}
                </button>
              </div>
            </div>
          </template>
          <template v-else-if="view === LoginView.ResetPassword">
            <h1 class="ms-3 mt-3">{{ lang.resetPassword }}</h1>
            <div class="card-body">
              <ChangePasswordForm :require-current-password="false" @password-changed="emit('authenticated')"/>
            </div>
          </template>
          <template v-else-if="view === LoginView.UseInvite">
            <UseInvite :invite="invite" @submit="setViewLogin" @cancel="setViewLogin"/>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-logo {
  max-width: 256px;
}
</style>