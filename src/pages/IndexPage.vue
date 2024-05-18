<template>
  <q-page class="flex flex-center">
    <AppVisible />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import AppVisible from 'src/components/AppVisible.vue'

export default defineComponent({
  name: 'IndexPage',
  components:{AppVisible}
});
</script>
