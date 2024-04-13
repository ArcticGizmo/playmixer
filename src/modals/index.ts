import { markRaw, ref, getCurrentInstance, watch } from 'vue';
import type {
  Component,
  Ref,
  AllowedComponentProps,
  VNodeProps,
  ExtractPublicPropTypes,
} from 'vue';
import { VDialog } from 'vuetify/lib/components/index.mjs';
import { DeferredPromise, type DefferablePromise } from '@/util/deferredPromise';
import LoadingModal from '@/modals/LoadingModal.vue';

type ModalOptions = ExtractPublicPropTypes<VDialog['$props']>;

type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
  : never;

type ModalConfig<C extends Component> = {
  component: C;
  props?: ComponentProps<C>;
  options?: ModalOptions;
};

export interface Modal<T extends Component, K> extends ModalConfig<T> {
  modalId: Readonly<number>;
  show: Ref<boolean>;
  promise: DefferablePromise<ModalResp<K>>;
  destroy: () => void;
}

interface ModalResp<T> {
  value: T;
}

interface ShowLoadingOptions {
  title?: string;
  message?: string;
}

let ID = 1;
const nextId = () => {
  const id = ID;
  ID += 1;
  return id;
};

export const MODAL_LOOKUP: Ref<Record<number, Modal<any, any>>> = ref({});

const createModal = <T extends Component, K>(config: ModalConfig<T>): Modal<T, K> => {
  const modalId = nextId();

  const props = (config.props || {}) as ComponentProps<T>;
  (props as any).__modalId = modalId;

  const show = ref(true);
  const promise = DeferredPromise<ModalResp<K>>();

  watch(show, isShowing => {
    if (!isShowing) {
      promise.resolve();
    }
  });

  return {
    modalId,
    component: markRaw(config.component),
    props,
    options: config.options,
    show,
    promise,
    destroy: () => delete MODAL_LOOKUP.value[modalId],
  };
};

const show = <K, C extends Component = Component>(config: ModalConfig<C>) => {
  return create<K, C>(config).promise;
};

const create = <K, C extends Component = Component>(config: ModalConfig<C>) => {
  const modal = createModal<C, K | undefined>(config);
  MODAL_LOOKUP.value[modal.modalId] = modal;
  return modal;
};

let loadingModal: Modal<typeof LoadingModal, unknown>;

const showLoading = (options?: ShowLoadingOptions) => {
  hideLoading();

  const props = { title: options?.title, message: options?.message };

  loadingModal = create({ component: LoadingModal, options: { persistent: true }, props });
  return loadingModal;
};

const hideLoading = () => {
  loadingModal?.destroy();
};

export const useModalController = () => {
  return { show, create, showLoading, hideLoading };
};

export const useModal = () => {
  const instance = getCurrentInstance()!;
  const modalId = instance.attrs.__modalId as number;
  const modal = MODAL_LOOKUP.value[modalId];
  const close = async (resp?: any) => {
    // Not sure why it is not a ref, but it is
    (modal.show as any) = false;
    modal.promise.resolve({ value: resp });
  };
  return { close };
};
