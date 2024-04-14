<template>
  <div class="infinite-scroller">
    <div
      ref="scrollerRef"
      class="scroller"
      :class="{ 'allow-animation': allowAnimation }"
      :data-direction="direction"
      data-speed="slow"
    >
      <div
        class="scroller__inner"
        :style="{ animationDuration: duration, animationDirection: direction }"
      >
        <div class="container-wrapper" v-for="(child, index) of children" :key="index">
          <div class="container">
            <component :is="child" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilteredSlots } from '@/composables/slots';
import { ref } from 'vue';
import { onMounted } from 'vue';

withDefaults(
  defineProps<{
    duration?: string;
    direction?: 'forwards' | 'reverse';
  }>(),
  {
    direction: 'forwards',
    duration: '40s',
  },
);

const children = useFilteredSlots('default');

const allowAnimation = ref(false);

const scrollerRef = ref<HTMLDivElement>();

function addAnimation() {
  allowAnimation.value = true;
  const scroller = scrollerRef.value!;

  // Make an array from the elements within `.scroller-inner`
  const scrollerInner = scroller.querySelector('.scroller__inner')!;
  const scrollerContent = Array.from(scrollerInner.children);

  // For each item in the array, clone it
  // add aria-hidden to it
  // add it into the `.scroller-inner`
  scrollerContent.forEach(item => {
    const duplicatedItem = item.cloneNode(true) as Element;
    duplicatedItem.setAttribute('aria-hidden', 'true');
    scrollerInner.appendChild(duplicatedItem);
  });
}

onMounted(() => {
  // If a user hasn't opted in for recuded motion, then we add the animation
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    addAnimation();
  }
});
</script>

<style scoped>
.scroller__inner {
  padding-block: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.allow-animation {
  overflow: hidden;
  -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.scroller__inner {
  width: max-content;
  flex-wrap: nowrap;
  animation: scroll 40s linear infinite;
}

@keyframes scroll {
  to {
    transform: translate(calc(-50% - 0.5rem));
  }
}
</style>
