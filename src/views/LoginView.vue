<script setup lang="ts">
import {ref} from "vue";

// const props = defineProps<{}>();
const emit = defineEmits(['authenticated']);

enum LoginView {
  Login,
  ResetPassword,
}

const view = ref(LoginView.Login);

const email = ref('');
const password = ref('');

const resetPassword = ref('');
const resetPasswordConfirm = ref('');

const login = async () => {
  const payload = {
    email: email.value,
    password: password.value,
  };

  const result = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!result.ok) {
    // toast
    return;
  }

  const { success, changePassword } = await result.json();
  if (!success) {
    // toast
    return;
  }

  if (changePassword) {
    view.value = LoginView.ResetPassword;
  } else {
    emit('authenticated');
  }
};

const updatePassword = async () => {
  const payload = {
    password: resetPassword.value,
    confirmPassword: resetPasswordConfirm.value,
  };

  const result = await fetch('/api/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!result.ok) {
    // toast
    return;
  }

  const { success } = await result.json();
  if (!success) {
    // toast
    return;
  }

  emit('authenticated');
};
</script>

<template>
  <div class="container p-3">
    <div class="row">
      <div class="col">
        <div class="card">
          <img class="brand-logo mx-auto d-block card-img-top mt-3" src="/public/img/frog.svg" alt="frog"/>
          <template v-if="view === LoginView.Login">
            <h1 class="ms-3 mt-3">Login</h1>
            <div class="card-body">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">E-Mail</label>
                  <input id="email" name="email" class="form-control" type="text" v-model="email"/>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Passwort</label>
                  <input id="password" name="password" class="form-control" type="password" v-model="password"/>
                </div>
                <div class="mb-3">
                  <input type="submit" class="btn btn-primary" value="Anmelden"/>
                </div>
              </form>
            </div>
          </template>
          <template v-else-if="view === LoginView.ResetPassword">
            <h1 class="ms-3 mt-3">Passwort zurücksetzen</h1>
            <div class="card-body">
              <form @submit.prevent="updatePassword">
                <div class="mb-3">
                  <label for="email" class="form-label">Passwort</label>
                  <input id="email" name="email" class="form-control" type="password" v-model="resetPassword"/>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Passwort bestätigen</label>
                  <input id="password" name="password" class="form-control" type="password" v-model="resetPasswordConfirm"/>
                </div>
                <div class="mb-3">
                  <input type="submit" class="btn btn-primary" value="Speichern"/>
                </div>
              </form>
            </div>
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