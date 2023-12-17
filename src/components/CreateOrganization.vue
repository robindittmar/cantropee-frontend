<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {Modal} from "bootstrap";
import {lang} from "@/core/languages";
import {req} from "@/core/requests";

// const props = defineProps<{}>();
const emit = defineEmits(['organization-created', 'modal-closed']);

let submitting = ref(false);
let organizationName = ref('');
let currency = ref('EUR');
let useTaxes = ref(false);


const createOrganization = async () => {
  submitting.value = true;

  console.log('CREATING ORG');

  const payload = {
    name: organizationName.value,
    currency: currency.value,
    useTaxes: useTaxes.value,
    previewRecurringCount: 1,
  };

  const res = await req('/api/organization', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  submitting.value = false;

  if (res.ok) {
    let {organizationId} = await res.json();
    emit('organization-created', organizationId);
  }
};

const closeModal = () => {
  const modal = Modal.getOrCreateInstance('#createOrgModal');
  modal.hide();
};

onMounted(() => {
  const modal = Modal.getOrCreateInstance('#createOrgModal');
  modal.show();

  const modalElem = document.querySelector('#createOrgModal');
  modalElem?.addEventListener('hidden.bs.modal', () => {
    emit('modal-closed');
  });
});

onBeforeUnmount(() => {
  closeModal();
});
</script>

<template>
  <div class="modal fade" id="createOrgModal" tabindex="-1" aria-labelledby="createOrgModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="createOrgModalLabel">{{ lang.newOrganizationTitle }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createOrganization">
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

            <div class="mb-3">
              <input type="submit" class="btn btn-primary w-100" :disabled="submitting || organizationName.length === 0" :value="lang.create"/>
            </div>
            <div class="mb-3">
              <button @click="closeModal" class="btn btn-secondary w-100">{{ lang.cancel }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>