<script setup lang="ts">

import BackIcon from "@/components/BackIcon.vue";
import { useAttrs } from "vue";

defineProps<{
  title: string;
}>()
const attrs = useAttrs()
</script>

<template>
  <div class="mb-3 text-xl font-bold relative">
    <BackIcon class="z-2 relative" v-bind="attrs"/>
    <span class="absolute text-center w-full left-0" @click.stop>{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">

</style>