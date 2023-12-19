<script setup lang="ts">
import {ref} from "vue";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";

const emit = defineEmits(['password-changed']);

const resetPassword = ref('');
const resetPasswordConfirm = ref('');

const updatePassword = async () => {
  const payload = {
    password: resetPassword.value,
    confirmPassword: resetPasswordConfirm.value,
  };

  const result = await req('/api/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  const { success } = await result.json();
  if (success) {
    emit('password-changed');
  }
};
</script>

<template>
  <form @submit.prevent="updatePassword">
    <div class="mb-3">
      <label for="password" class="form-label">{{ lang.password }}</label>
      <input id="password" name="email" class="form-control" type="password" v-model="resetPassword"/>
    </div>
    <div class="mb-3">
      <label for="confirmPassword" class="form-label">{{ lang.confirmPassword }}</label>
      <input id="confirmPassword" name="password" class="form-control" type="password" v-model="resetPasswordConfirm"/>
    </div>
    <div class="mb-3">
      <input type="submit" class="btn btn-primary" :value="lang.save"/>
    </div>
  </form>
</template>

<style scoped>

</style>