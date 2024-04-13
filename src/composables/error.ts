import { type Ref, ref } from 'vue';

interface SimpleErrorEvent {
  at: Date;
  message: string;
  subtitle?: string;
}

const useQueue = <T>(size: number) => {
  const queue: Ref<T[]> = ref([]);

  const add = (value: T) => {
    if (queue.value.length >= size) queue.value.unshift();
    queue.value.push(value);
  };

  const remove = () => {
    queue.value.shift();
  };

  return { queue, add, remove };
};

const { queue, add } = useQueue<SimpleErrorEvent>(25);

window.addEventListener('error', event => {
  add({ at: new Date(), message: event.message, subtitle: event.filename });
});

window.addEventListener('unhandledrejection', event => {
  add({ at: new Date(), message: event.reason.message, subtitle: event.reason.stack });
});

export const useErrorCollector = () => {
  const clear = () => {
    queue.value = [];
  };

  return { errors: queue, clear };
};
