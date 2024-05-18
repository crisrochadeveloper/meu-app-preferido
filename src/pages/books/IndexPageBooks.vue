<template>
  <div>
    Pagina de livros
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
  export default {
    data(){
      return{
        $q:useQuasar()
      }
    },
    mounted(){
      setTimeout(() => {
        this.$q.loadingBar.stop()
      }, 2000);
    }
  }
</script>

<style lang="scss" scoped>

</style>