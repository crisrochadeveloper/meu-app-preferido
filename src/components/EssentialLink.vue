<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    @click="toLink(link)"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  data(){
    return{
      $q:useQuasar()
    }
  },
  methods:{
    toLink(link){
      this.$q.loadingBar.start()
      this.$router.push(link)
    }
  }
})
</script>
