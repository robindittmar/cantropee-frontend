<script setup lang="ts">
import {onMounted} from "vue";
import {Toast} from "bootstrap";
import type {CantropeeToast} from "@/core/toaster";
import {removeToast, ToastColor} from "@/core/toaster";

const props = defineProps<{
  toast: CantropeeToast
}>();

onMounted(() => {
  const el = document.querySelector(`#toast-${props.toast.id}`);

  if (el) {
    el.addEventListener('hidden.bs.toast', () => {
      removeToast(props.toast.id);
    });

    const t = Toast.getOrCreateInstance(el);
    t.show();
  }
});
</script>

<template>
  <div :id="'toast-' + toast.id" class="toast align-items-center border-0" role="alert" aria-live="assertive" aria-atomic="true"
       :class="{'text-bg-primary': toast.color === ToastColor.Info, 'text-bg-success': toast.color === ToastColor.Success, 'text-bg-warning': toast.color === ToastColor.Warning, 'text-bg-danger': toast.color === ToastColor.Danger}">
    <div class="d-flex">
      <div class="toast-body">
        <i class="fa-solid fa-circle-info" v-if="toast.color === ToastColor.Info"></i>
        <i class="fa-solid fa-circle-check" v-if="toast.color === ToastColor.Success"></i>
        <i class="fa-solid fa-triangle-exclamation" v-else-if="toast.color === ToastColor.Warning"></i>
        <i class="fa-solid fa-circle-xmark" v-else-if="toast.color === ToastColor.Danger"></i>
        &nbsp;&nbsp;{{ toast.body }}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</template>

<style scoped>

</style>