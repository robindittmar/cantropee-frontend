<script setup lang="ts">
import {onMounted} from "vue";
import {Toast} from "bootstrap";

const props = defineProps<{
  title: string,
  subtitle: string,
  body: string;
}>();

onMounted(() => {
  const t = Toast.getOrCreateInstance('#liveToast');
  t.show();
});
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">{{ title }}</strong>
        <small>{{ subtitle }}</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ body }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>