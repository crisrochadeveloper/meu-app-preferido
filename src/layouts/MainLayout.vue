<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>


        <q-btn :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" round dense flat @click="() => {
          if (this.$q.dark.isActive) removeDarkMode()
          else setDarkMode()
        }" />
        <q-btn :icon="fullscreen ? 'arrow_downward' : 'fullscreen'" round dense flat
          @click="fullscreen = !fullscreen" />
      </q-toolbar>
      <AppVisible />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" behavior="desktop" overlay>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container style="width:100%;height:calc(100vh - 80px);position: relative;">
      <router-view />
    </q-page-container>
    <q-footer class="flex justify-start items-center gap-2 px-2" >
      <Cookies />
      <q-btn no-caps push color="white" text-color="primary" icon="home" to="/"/>
      <BottomSheet />
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar';
import BottomSheet from 'src/components/BottomSheet.vue'
import Cookies from 'src/components/Cookies.vue'


const linksList = [
  {
    title: 'Livors',
    caption: 'Leia livros gratuitamente',
    icon: 'books',
    link: '/books'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    BottomSheet,
    Cookies
  },

  data() {
    return {
      linksList,
      leftDrawerOpen: false,
      $q: useQuasar(),
      fullscreen: false
    }
  },
  mounted() {
    this.$q.loading.show();
    setTimeout(() => {
      this.$q.loading.hide();
    }, 1000);
  },
  watch: {
    fullscreen(newvalue) {
      if (newvalue) {
        this.$q.fullscreen.request()
          .then(() => {
            // success!
          })
          .catch(err => {
            // oh, no!!!
          })
      } else {
        this.$q.fullscreen.exit()
          .then(() => {
            // success!
          })
          .catch(err => {
            // oh, no!!!
          })
      }
    },
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    setDarkMode() {
      this.$q.dark.set(true)
    },
    removeDarkMode() {
      this.$q.dark.set(false)
    }
  },
  

})
</script>
