<script setup lang="ts">
import {onMounted, ref} from "vue";
import {toast, ToastColor} from "@/core/toaster";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";

const props = defineProps<{
  invite: string | null,
}>();
const emit = defineEmits(['submit', 'cancel']);

let validInvite = ref(false);

let inviteId = ref('');
let organizationName = ref('');
let useTaxes = ref(false);
let userEmail = ref('');
let userPassword = ref('');
let userPasswordConfirm = ref('');

const validateInvite = async () => {
  const resp = await req('/api/invite/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inviteId: inviteId.value,
    }),
  });

  if (resp.ok) {
    let { valid } = await resp.json();
    if (valid) {
      validInvite.value = true;
      toast(lang.value.inviteIsValid, ToastColor.Success);
    } else {
      toast(lang.value.inviteIsInvalid, ToastColor.Danger);
    }
  } else {
    toast(lang.value.anErrorHasOccured, ToastColor.Danger);
  }
};

const useInvite = async () => {
  if (userPassword.value !== userPasswordConfirm.value) {
    toast(lang.value.passwordsDoNotMatch, ToastColor.Danger);
    return;
  }

  const resp = await req('/api/invite/use', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inviteId: inviteId.value,
      organization: organizationName.value,
      useTaxes: useTaxes.value,
      email: userEmail.value,
      password: userPassword.value,
    }),
  });

  if (resp.ok) {
    toast(lang.value.inviteSuccess, ToastColor.Info);

    setTimeout(() => {
      emit('submit');
    }, 3000);
  } else {
    toast(lang.value.anErrorHasOccured, ToastColor.Danger);
  }
};

onMounted(() => {
  if (props.invite) {
    inviteId.value = props.invite;
    validateInvite();
  }
});
</script>

<template>
  <div class="ms-3 me-3 mb-3">
    <template v-if="!validInvite">
      <form @submit.prevent="validateInvite">
        <div class="mb-3">
          <label for="inviteId" class="form-label">{{ lang.invite }}</label>
          <input id="inviteId" class="form-control" v-model="inviteId"/>
        </div>

        <div class="mb-3">
          <input type="submit" :disabled="inviteId.length === 0" class="btn btn-primary w-100" :value="lang.check"/>
        </div>
        <div class="mb-3">
          <button @click="$emit('cancel')" class="btn btn-secondary w-100">{{ lang.cancel }}</button>
        </div>
      </form>
    </template>
    <template v-else>
      <form @submit.prevent="useInvite">
        <div class="mb-3">
          <label for="orgName" class="form-label">{{ lang.nameOfOrg }}</label>
          <input id="orgName" class="form-control" v-model="organizationName"/>
        </div>

        <div class="form-check mb-3">
          <input id="useTax" class="form-check-input" type="checkbox" v-model="useTaxes"/>
          <label for="useTax" class="form-check-label">{{ lang.trackTaxes }}</label>
        </div>

        <div class="mb-3">
          <label for="userEmail" class="form-label">{{ lang.email }}</label>
          <input id="userEmail" class="form-control" v-model="userEmail"/>
        </div>

        <div class="mb-3">
          <label for="userPassword" class="form-label">{{ lang.password }}</label>
          <input id="userPassword" class="form-control" type="password" v-model="userPassword"/>
        </div>

        <div class="mb-3">
          <label for="userPasswordConfirm" class="form-label">{{ lang.confirmPassword }}</label>
          <input id="userPasswordConfirm" class="form-control" type="password" v-model="userPasswordConfirm"/>
        </div>

        <div class="mb-3">
          <input type="submit" class="btn btn-primary w-100" :value="lang.create"/>
        </div>
        <div class="mb-3">
          <button @click="$emit('cancel')" class="btn btn-secondary w-100">{{ lang.cancel }}</button>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>

</style>