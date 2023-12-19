<script setup lang="ts">
import {type Ref, computed, onMounted, ref} from "vue";
import {toast, ToastColor} from "@/core/toaster";
import {req} from "@/core/requests";
import {lang} from "@/core/languages";

const props = defineProps<{
  invite: string | null,
}>();
const emit = defineEmits(['submit', 'cancel']);

enum RegisterStages {
  ExplainCantropee,
  EnterUserDetails,
  EnterOrganizationDetails,
  ConfirmRegistration,
}

let validInvite = ref(false);
let currentStage: Ref<RegisterStages> = ref(RegisterStages.ExplainCantropee);

let inviteId = ref('');
let organizationName = ref('');
let currency = ref('EUR');
let useTaxes = ref(false);
let userEmail = ref('');
let userPassword = ref('');
let userPasswordConfirm = ref('');

const userDetailsValid = computed(() => {
  return userEmail.value.length > 0 &&
      validateEmail(userEmail.value) &&
      userPassword.value.length > 5 &&
      userPasswordConfirm.value === userPassword.value;
});

const orgDetailsValid = computed(() => {
  return organizationName.value.length > 0 &&
      currency.value.length > 0;
});

const inputValidForCreation = computed(() => {
  return userEmail.value.length > 0 &&
      userPassword.value.length > 0 &&
      userPasswordConfirm.value.length > 0 &&
      organizationName.value.length > 0 &&
      currency.value.length > 0;
});

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

const validateEmail = (email: string) => {
  return String(email)
      .toLowerCase()
      .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const useInvite = async () => {
  if (!validateEmail(userEmail.value)) {
    toast(lang.value.emailIsInvalid, ToastColor.Danger);
    return;
  }

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
      currency: currency.value,
      useTaxes: useTaxes.value,
      email: userEmail.value,
      password: userPassword.value,
    }),
  });

  if (resp.ok) {
    toast(lang.value.inviteSuccess, ToastColor.Info);
    emit('submit');
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
      <template v-if="currentStage === RegisterStages.ExplainCantropee">
        <form @submit.prevent="currentStage = RegisterStages.EnterUserDetails">
          <div class="mt-3">
            <h1 class="text-center">{{ lang.welcomeText }}</h1>
            <div class="card mt-3">
              <div class="card-header">
                <button class="btn w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#helpCollapse"><i class="fa-solid fa-circle-info"></i>&nbsp;{{ lang.explainGeneralPurpose }}</button>
              </div>
              <div id="helpCollapse" class="card-body collapse">
                <h6>{{ lang.organizations }}</h6>
                <p>{{ lang.explainOrganizations }}</p>
              </div>
            </div>

            <div class="mt-4 mb-3">
              <input type="submit" class="btn btn-primary w-100" :value="lang.registerAccount"/>
            </div>
            <div class="mb-3">
              <button @click="$emit('cancel')" class="btn btn-secondary w-100">{{ lang.cancel }}</button>
            </div>
          </div>
        </form>
      </template>
      <template v-else-if="currentStage === RegisterStages.EnterUserDetails">
        <form @submit.prevent="currentStage = RegisterStages.EnterOrganizationDetails">
          <h2 class="mt-3 mb-3">{{ lang.user }}</h2>
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

          <div class="mt-4 mb-3">
            <input type="submit" class="btn btn-primary w-100" :value="lang.nextStep" :disabled="!userDetailsValid"/>
          </div>
          <div class="mb-3">
            <button @click="currentStage = RegisterStages.ExplainCantropee" class="btn btn-secondary w-100">{{ lang.previousStep }}</button>
          </div>
        </form>
      </template>
      <template v-else-if="currentStage === RegisterStages.EnterOrganizationDetails">
        <form @submit.prevent="currentStage = RegisterStages.ConfirmRegistration">
          <h2 class="mt-3 mb-3">{{ lang.organization }}</h2>
          <div class="mb-3">
            <label for="orgName" class="form-label">{{ lang.nameOfOrg }}</label>
            <input id="orgName" class="form-control" v-model="organizationName"/>
          </div>

          <div class="mb-3">
            <label for="orgName" class="form-label">{{ lang.currency }}</label>
            <input id="orgName" class="form-control" v-model="currency" disabled/>
          </div>

          <div class="form-check mb-3">
            <input id="useTax" class="form-check-input" type="checkbox" v-model="useTaxes"/>
            <label for="useTax" class="form-check-label">{{ lang.trackTaxes }}</label>
          </div>

          <div class="mt-4 mb-3">
            <input type="submit" class="btn btn-primary w-100" :value="lang.nextStep" :disabled="!orgDetailsValid"/>
          </div>
          <div class="mb-3">
            <button @click="currentStage = RegisterStages.EnterUserDetails" class="btn btn-secondary w-100">{{ lang.previousStep }}</button>
          </div>
        </form>
      </template>
      <template v-else-if="currentStage === RegisterStages.ConfirmRegistration">
        <form @submit.prevent="useInvite">
          <h2 class="mt-3 mb-3">{{ lang.confirmValuesRegistration }}</h2>
          <div class="form-floating mb-3">
            <input id="userEmail" class="form-control" v-model="userEmail" disabled/>
            <label for="userEmail" class="form-label">{{ lang.email }}</label>
          </div>

          <div class="form-floating mb-3">
            <input id="orgName" class="form-control" v-model="organizationName" disabled/>
            <label for="orgName" class="form-label">{{ lang.nameOfOrg }}</label>
          </div>

          <div class="form-floating mb-3">
            <input id="orgName" class="form-control" v-model="currency" disabled/>
            <label for="orgName" class="form-label">{{ lang.currency }}</label>
          </div>

          <div class="form-check mb-3">
            <input id="useTax" class="form-check-input" type="checkbox" v-model="useTaxes" disabled/>
            <label for="useTax" class="form-check-label">{{ lang.trackTaxes }}</label>
          </div>
          <hr class="mt-4 mb-4"/>

          <div class="mt-4 mb-3">
            <input type="submit" class="btn btn-primary w-100" :value="lang.joinCantropee" :disabled="!inputValidForCreation"/>
          </div>
          <div class="mb-3">
            <button @click="currentStage = RegisterStages.EnterOrganizationDetails" class="btn btn-secondary w-100">{{ lang.previousStep }}</button>
          </div>
        </form>
      </template>
    </template>
  </div>
</template>

<style scoped>

</style>