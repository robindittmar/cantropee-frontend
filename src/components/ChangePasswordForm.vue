<script setup lang="ts">
import {computed, ref} from "vue";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";
import {toast, ToastColor} from "@/core/toaster";
import {validatePassword} from "@/core/validate";

const props = defineProps<{
  requireCurrentPassword: boolean,
}>();
const emit = defineEmits(['password-changed']);

const currentPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');

const passwordCritique = computed(() => {
  const pw = newPassword.value;
  const confirm = newPasswordConfirm.value;

  if (pw.length > 0) {
    if (!validatePassword(pw)) {
      return lang.value.passwordTooShort;
    }

    if (confirm.length > 0 && pw !== confirm) {
      return lang.value.passwordsDoNotMatch;
    }
  }

  return null;
});

const dataValid = computed(() => {
  return validatePassword(newPassword.value) &&
      newPassword.value === newPasswordConfirm.value;
});

const updatePassword = async () => {
  if (newPassword.value !== newPasswordConfirm.value) {
    toast(lang.value.passwordsDoNotMatch, ToastColor.Danger);
    return;
  }

  const payload = {
    currentPassword: props.requireCurrentPassword ? currentPassword.value : undefined,
    newPassword: newPassword.value,
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
    <div v-if="requireCurrentPassword" class="mb-3">
      <label for="currentPassword" class="form-label">{{ lang.currentPassword }}</label>
      <input id="currentPassword" name="email" class="form-control" type="password" v-model="currentPassword"/>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">{{ lang.newPassword }}</label>
      <input id="password" name="email" class="form-control" type="password" v-model="newPassword"/>
    </div>
    <div class="mb-3">
      <label for="confirmPassword" class="form-label">{{ lang.confirmPassword }}</label>
      <input id="confirmPassword" name="password" class="form-control" type="password" v-model="newPasswordConfirm"/>
    </div>
    <div v-if="passwordCritique" class="card border-danger bg-body-secondary mb-3">
      <div class="card-body">
        {{ passwordCritique }}
      </div>
    </div>
    <div class="mb-3">
      <input type="submit" class="btn btn-primary" :value="lang.save" :disabled="!dataValid"/>
    </div>
  </form>
</template>

<style scoped>

</style>