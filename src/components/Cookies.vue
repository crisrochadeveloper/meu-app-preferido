<template>
  <q-dialog persistent position="bottom" v-model="model">
    <q-card>
      <q-card-section header>
        <h2 class="text-primary font-bold">Atenção</h2>
      </q-card-section>
      <q-card-section>
        <p>Usamos cookies para armazenar informações, e melhorar sua experiência</p>
        <p>Leia mais aqui <q-btn flat dense color='primary' label="Aqui" no-caps /></p>
      </q-card-section>
      <q-card-section actions class="flex justify-end items-center gap-4">
        <q-btn v-close-popup flat color="primary" label="Não aceitar" class="mr-4" />
        <q-btn v-close-popup push  color="primary" label="aceitar" @click="setCookie"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar } from 'quasar'
  export default {
    data(){
      return{
        model:true,
        $q:useQuasar()
      }
    },
    mounted(){
      if(this.$q.cookies.has('cookie')){
        this.model = false;
      }
    },
    methods:{
      setCookie(){
        this.$q.cookies.set('cookie', 'aceito', { expires: 7, path: '/' });
        this.$q.notify({
          message: 'Cookies aceitos',
          color: 'positive'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>