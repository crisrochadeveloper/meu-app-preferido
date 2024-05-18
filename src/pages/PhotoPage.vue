<template>
  <q-page padding class="w-full h-full">
    <q-card class="w-[300px] h-[300px] mx-auto" :class="{ 'border-4 border-red-700': isRecording || isTakePhoto }">
      <q-card-section class="p-0 w-full h-full">
        <div v-if="$q.screen.xs || $q.screen.sm"
          class="absolute top-0 left-0 w-full h-14 flex justify-end items-center px-2 z-50">
          <q-btn flat size="lg" icon="flip_camera_android" color="primary" round @click="reestartCamera" />
        </div>
        <video autoplay ref="video" muted class="overflow-hidden w-full h-full object-cover flip-x"></video>
        <div class="absolute bottom-2 left-0 w-full h-14 flex justify-center items-center z-50">
          <q-btn ref="recordButton" outline icon="circle" :color="isRecording ? 'red' : 'primary'" round size="20px"
            @mousedown="onMouseDown" @mouseup="stopRecording" @mouseleave="cancelRecording"
            @touchstart.prevent="onTouchStart" @touchend="onTouchEnd" />
        </div>
      </q-card-section>
    </q-card>
    <div class="w-full p-2 flex justify-end items-center">
      <q-btn label="Limpar Galeria" color="primary" flat icon="delete" size="sm">
        <q-menu>
          <q-card>
            <q-card-section header>
              <h6 class="uppercase font-bold text-red-700 p-4 text-2xl">Atenção!</h6>
            </q-card-section>
            <q-card-section>
              Tem certeza que deseja remover todas as fotos e videos? essa ação não pode ser desfeita!
            </q-card-section>
            <q-card-section actions class="w-full flex justify-end items-center gap-2">
              <q-btn push label="Cancelar" color="red" v-close-popup />
              <q-btn flat label="Confirmar" color="red" v-close-popup @click="deleteAll" />
            </q-card-section>
          </q-card>
        </q-menu>
      </q-btn>
    </div>
    <q-scroll-area class="w-full h-[calc(100%_-_370px)]">
      <div class="w-full flex justify-center items-center gap-2 mt-4">
        <q-item clickable v-for="(photo, index) in photos" :key="index" @click="openFile(photo)"
          class="w-[100px] p-0 rounded shadow-md h-[100px] relative overflow-hidden">
          <q-item-section class="w-full h-full p-0 relative">
            <q-btn icon="delete" color="red" flat dense round class="absolute top-1 right-1">
              <q-menu>
                <q-card>
                  <q-card-section header>
                    <h6 class="uppercase font-bold text-red-700 text-xl leading-3">Atenção!</h6>
                  </q-card-section>
                  <q-card-section>
                    Tem certeza que deseja remover {{ photo.video ? 'este video' : 'esta imagem' }} ? essa ação não pode
                    ser desfeita!
                  </q-card-section>
                  <q-card-section actions class="w-full flex justify-end items-center gap-2">
                    <q-btn push label="Cancelar" color="red" v-close-popup />
                    <q-btn flat label="Confirmar" color="red" v-close-popup @click="deleteItem(photo.id)" />
                  </q-card-section>
                </q-card>
              </q-menu>
            </q-btn>
            <img :src="photo.image" class="w-full h-full object-cover" />
          </q-item-section>
        </q-item>
      </div>
    </q-scroll-area>
    <audio ref="shutterSound" :src="urlSound" class="invisible"></audio>
    <q-dialog v-model="open" persistent maximized class="overflow-hidden">
      <q-card>
        <q-card-section header class="w-full flex justify-between items-center h-10">
          <div class="flex items-center gap-3">
            <p class="text-primary uppercase font-bold">{{ item.video ? 'Video: ' : 'Imagem: ' }} <span
                class="text-gray-800">{{ item.name }}</span></p>
            <q-btn icon="share" @click="shareOnWhatsApp(item)" color="primary" flat dense round></q-btn>
          </div>
          <q-btn icon="close" flat dense color="primary" @click="open = false" />
        </q-card-section>
        <q-card-section class="w-full flex justify-center items-center h-[calc(100%_-_40px)]">
          <div class="rounded overflow-hidden relative" :style="{
            width: $q.screen.width + 'px',
            height: $q.screen.width + 'px',
            maxWidth: '600px',
            maxHeight: '600px'
          }">
            <q-img v-if="!item.video" :src="item.image" class="w-full h-full object-cover" />
            <video v-else controls :src="item.video" class="w-full h-full object-cover"></video>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useStorage } from '@vueuse/core';
import { useQuasar } from 'quasar';

export default {
  data() {
    return {
      open: false,
      item: {},
      stream: null,
      $q: useQuasar(),
      cameraMode: 'user',
      isRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
      track: null,
      imageCapture: null,
      isTakePhoto: false,
      storeName: 'photos',
      databaseName: 'meu_app_preferido',
      urlSound: '/audio/camera.mp3',
      time: null,
      photos: [],
      db: null,
      touchEvent: null,
    }
  },
  async mounted() {
    await this.startCamera();
    await this.handleDatabase();
  },
  methods: {
    async handleDatabase() {
      try {
        this.db = await this.$database.openDatabase(this.databaseName, 1, (db, event) => {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        });
        await this.getItems();
      } catch (error) {
        console.error('Erro:', error);
      }
    },
    shareOnWhatsApp(item) {
      const whatsappBaseUrl = 'https://api.whatsapp.com/send?text=';
      const message = `Veja este conteúdo: ${item.name} - ${item.video ? item.video : item.image}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `${whatsappBaseUrl}${encodedMessage}`;
      console.log(whatsappUrl)
      window.open(whatsappUrl, '_blank');
    },
    async addItem(item) {
      try {
        await this.$database.saveItem(this.db, this.storeName, item);
        await this.getItems();
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async getItems() {
      try {
        const photos = await this.$database.getAllItems(this.db, this.storeName);
        this.photos = photos.reverse();
      } catch (error) {
        console.error(error);
        this.photos = [];
      }
    },
    async startCamera() {
      if (this.stream) {
        this.stopCamera();
      }
      this.$q.loading.show();
      try {
        const constraints = {
          video: {
            width: 500,
            height: 500,
            facingMode: { ideal: this.cameraMode }
          },
          audio: true
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.stream = stream;
        const videoElement = this.$refs.video;
        if ('srcObject' in videoElement) {
          videoElement.srcObject = stream;
          this.track = stream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(this.track);
        } else {
          videoElement.src = window.URL.createObjectURL(stream);
        }
        this.$q.loading.hide();
      } catch (error) {
        console.error('Erro ao acessar a câmera: ', error);
        this.$q.loading.hide();
      }
    },
    async reestartCamera() {
      this.cameraMode = this.cameraMode === 'user' ? 'environment' : 'user';
      await this.startCamera();
    },
    stopCamera() {
      if (this.stream && this.stream.getTracks) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.stream = null;
    },
    onMouseDown() {
      if (!this.$q.screen.xs && !this.$q.screen.sm) {
        this.startRecording();
      }
    },
    onTouchStart(event) {
      this.touchEvent = event;
      if (this.$q.screen.xs || this.$q.screen.sm) {
        this.startRecording();
      }
    },
    startRecording() {
      this.time = setTimeout(() => {
        this.urlSound = '/audio/video.mp3';
        this.$q.notify({
          message: 'Gravando...',
          color: 'primary',
        });
        this.$refs.shutterSound.play();
        this.isRecording = true;
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };
        this.mediaRecorder.start();
      }, 800);
    },
    async captureFrame(video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        }, 'image/jpeg');
      });
    },
    async stopRecording(event) {
      if (this.isRecording) {
        this.isRecording = false;
        this.mediaRecorder.stop();
        this.mediaRecorder.onstop = async () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          const urlVideo = URL.createObjectURL(blob);
          const urlPhoto = await this.captureFrame(this.$refs.video);
          const res = await this.addItem({
            name: Date.now(),
            image: urlPhoto,
            video: urlVideo
          });
          this.$q.notify({
            message: 'Gravação finalizada',
            color: 'positive',
          });
        };
      } else {
        this.isTakePhoto = true;
        clearTimeout(this.time);
        await this.takePhoto();
      }
    },
    onTouchEnd() {
      this.isRecording = false;
      this.mediaRecorder.stop();
      this.recordedChunks = [];
      this.stopRecording();
    },
    cancelRecording() {
      if (this.isRecording && (this.$q.screen.xs || this.$q.screen.sm)) {
        if (this.touchEvent) {
          const touch = this.touchEvent.touches[0];
          const button = this.$refs.recordButton.$el;
          const rect = button.getBoundingClientRect();
          if (touch.clientX < rect.left || touch.clientX > rect.right || touch.clientY < rect.top || touch.clientY > rect.bottom) {
            this.isRecording = false;
            this.mediaRecorder.stop();
            this.recordedChunks = [];
          }
        }
      }
    },
    async takePhoto() {
      this.urlSound = '/audio/camera.mp3';
      this.$refs.shutterSound.play();
      try {
        const blob = await this.imageCapture.takePhoto();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataURL = reader.result;
          const res = await this.addItem({
            name: Date.now(),
            image: dataURL,
            video: null
          });
          if (res) {
            this.$q.notify({
              message: 'Foto tirada',
              color: 'positive',
            });
          } else {
            this.$q.notify({
              message: 'Erro ao tirar foto',
              color: 'negative',
            });
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Erro ao tirar foto: ', error);
        this.$q.notify({
          message: 'Houve um erro ao tirar foto',
          color: 'negative',
        });
      } finally {
        this.isTakePhoto = false;
      }
    },
    openFile(file) {
      this.item = file;
      this.open = true;
    },
    async deleteAll() {
      this.$q.loading.show();
      for (let item of this.photos) {
        await this.$database.deleteItem(this.db, this.storeName, item.id);
      }
      await this.getItems();
      this.$q.loading.hide();
    }
  }
}
</script>
