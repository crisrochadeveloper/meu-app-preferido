<template>
  <div class="full-width full-height">
    <q-item>
      <q-item-section avatar>
        <q-skeleton type="QBtn" width="40px" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-skeleton height="300px" width="300px" class="q-mx-auto" square />
    <q-card-actions align="right" class="justify-center">
      <q-skeleton type="QBtn" class="q-mx-xs"/>
      <q-skeleton type="QBtn" class="q-mx-xs"/>
    </q-card-actions>
    <q-card-actions align="right" class="justify-center">
      <q-skeleton square width="100px" height="100px" class="q-mx-xs" />
      <q-skeleton square width="100px" height="100px" class="q-mx-xs" />
      <q-skeleton square width="100px" height="100px" class="q-mx-xs" />
    </q-card-actions>
  </div>
</template>