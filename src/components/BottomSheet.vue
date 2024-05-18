<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn no-caps push color="white" text-color="primary" label="Acesso Rápido" @click="show(true)" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  data () {
    const $q = useQuasar()

      return { $q }
  },
  methods:{
    show (grid) {
      this.$q.bottomSheet({
        message: 'Bottom Sheet message',
        grid,
        actions: [
          {
            label: 'Foto',
            img: '/images/camera.svg',
            id: 'photo'
          },
          {
            label: 'Keep',
            img: 'https://cdn.quasar.dev/img/logo_keep_128px.png',
            id: 'keep'
          },
          {
            label: 'Google Hangouts',
            img: 'https://cdn.quasar.dev/img/logo_hangouts_128px.png',
            id: 'calendar'
          },
          {
            label: 'Calendar',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png',
            id: 'calendar'
          },
          {},
          {
            label: 'Share',
            icon: 'share',
            id: 'share'
          },
          {
            label: 'Upload',
            icon: 'cloud_upload',
            color: 'primary',
            id: 'upload'
          },
          {},
          {
            label: 'John',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            id: 'john'
          }
        ]
      }).onOk(action => {
         switch (action.id) {
          case 'photo':
            this.$router.push('/photo')
            break;
         
          default:
            break;
         }
      }).onCancel(() => {
        // console.log('Dismissed')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
</script>
