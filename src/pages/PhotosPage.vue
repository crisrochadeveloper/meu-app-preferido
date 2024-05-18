<template>
  <div class="q-pa-md">
    <q-card style="max-width:600px;margin:0 auto;border-radius: 10px;">
      <q-card-section class="padding:0">
        <q-carousel swipeable animated v-model="slide" :autoplay="autoplay" ref="carousel" infinite arrows
          style="max-width:600px;margin:0 auto;border-radius: 10px;">

          <q-carousel-slide :name="index" v-for="(photo, index) in photos" :key="photo.name">
            <q-carousel-slide name="soft-jazz">

              <q-img v-if="photo.type == 'image'" :src="photo.image" class="absolute-full" />
              <video  v-else class="absolute-full"
                :src="photo.url" controls></video>
            </q-carousel-slide>
          </q-carousel-slide>
        </q-carousel>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { useStorage } from '@vueuse/core';
import { ref } from 'vue'

export default {
  data() {
   return {
      slide: 0,
      autoplay:false,
      photos: useStorage('photos', []),
      videos: useStorage('videos', []),
      showVideo: null,
      videoToPlay: null,
      showPlayButton:true
    }
  },
  methods:{
    openVideo(){
      console.log('open');
      this.showVideo = this.photos[this.slide].name
      this.showPlayButton = false
      let currentVideo = this.videos.find(v => v.name == this.photos[this.slide].name);
      this.videoToPlay = currentVideo.url
    }
  }
}
</script>
