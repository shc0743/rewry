<script setup lang="ts">
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/themes/light.css'
import { createRewry, createStorageProviderOnCacheStorageAndIndexedDB, RewryRuntime } from 'rewry';
import { shallowRef } from 'vue';
import { DYNDATA } from './dynamic';
import { db } from './userdata';

const rw = shallowRef<RewryRuntime>();

const create = async () => {
    rw.value = createRewry({
        lockfile: DYNDATA.pnpmLock,
        prefix: '/vendor/npm/',
        storageProvider: createStorageProviderOnCacheStorageAndIndexedDB(
            'cache-v1',
            db,
            'data'
        )
    });
    (window as any).rw = rw.value;
    console.log(rw.value);

    // console.log(rw.value instanceof RewryRuntime); console.log(Object.prototype.toString.call(rw));

}


</script>

<template>
    <div class="app-main">
        <sl-button @click="create" :disabled="!!rw">Create</sl-button>
    </div>
</template>

<style scoped>

</style>
