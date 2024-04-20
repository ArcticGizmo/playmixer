import { Howler, Howl } from 'howler';
import { DeferredPromise } from '@/util/deferredPromise';
import { useToast } from 'vue-toast-notification';
import { computed, reactive, readonly, ref } from 'vue';

export type AudioState = 'unloaded' | 'loading' | 'loaded' | 'errored';

export interface AudioRecord {
  name?: string;
  src: string;
  state: AudioState;
  error?: any;
}

export interface AudioOptions {
  maxDuration?: number;
  name?: string;
}

const HOWLER_ERRORS: Record<any, string | undefined> = {
  1: 'Aborted by user',
  2: 'Network Error',
  3: 'Decoding Error',
  4: 'Not found',
};

Howler.autoUnlock = true;
Howler.html5PoolSize = 200;

const toast = useToast();

export class PreloadedAudio {
  private sound: Howl;
  private prom = DeferredPromise();
  private internalState = ref<AudioState>('unloaded');
  private _src = '';
  private _name?: string;
  private _error?: any;

  public state = readonly(this.internalState);

  constructor(src: string, opts?: AudioOptions) {
    this.internalState.value = 'loading';
    this._src = src;
    this._name = opts?.name;

    const maxDuration = opts?.maxDuration;
    const sound = new Howl({
      src,
      format: 'mp3',
      loop: false,
      autoplay: false,
      preload: true,
      html5: true,
      onload: () => (this.internalState.value = 'loaded'),
      onplay: () => {
        if (!maxDuration) {
          return;
        }
        setTimeout(() => {
          res();
        }, maxDuration);
      },
      onend: () => res(),
      onloaderror: (_id, error) => {
        error = HOWLER_ERRORS[error as any] || error;
        this._error = error;
        console.error('[Audio] load error | ', error);
        this.internalState.value = 'errored';
        toast.error(`Error loading preview - ${error || 'unknown'}`, { duration: 5000 });
        res();
      },
      onplayerror: (_id, error) => {
        console.error('[Audio] play error | ', error);
        toast.error(`Error playing preview - ${error || 'unknown'}`, { duration: 5000 });
        res();
      },
    });

    const res = () => {
      sound.stop();
      this.prom.resolve();
    };
    this.sound = sound;
  }

  get src() {
    return this._src;
  }

  get name() {
    return this._name;
  }

  get error() {
    return this._error;
  }

  play() {
    this.stop();
    this.sound.play();
    return this.prom;
  }

  stop() {
    this.sound.stop();
    this.prom = DeferredPromise();
  }

  unload() {
    (this.internalState as any) = 'unloaded';
    this.sound.unload();
  }

  reload() {
    (this.internalState as any) = 'loading';
    this.sound.load();
  }
}

class PreloadedAudioManager {
  private current?: PreloadedAudio;
  public lookup = ref<Record<string, PreloadedAudio>>({});

  public records = computed<AudioRecord[]>(() => {
    return Object.values(this.lookup.value).map(a => {
      return reactive({
        name: a.name,
        src: a.src,
        state: a.state,
        error: a.error,
      });
    });
  });

  add(src: string, opts?: AudioOptions) {
    if (!this.lookup.value[src]) {
      this.lookup.value[src] = new PreloadedAudio(src, opts);
    }

    return this;
  }

  state(src: string) {
    return this.lookup.value[src]?.state;
  }

  async play(src: string) {
    this.stop();
    const sound = this.lookup.value[src];
    if (!sound) {
      return Promise.reject('src does not exist');
    }
    this.current = sound;
    return sound.play();
  }

  stop() {
    this.current?.stop();
    this.current = undefined;
  }

  reload(src: string) {
    const audio = this.lookup.value[src];
    if (!audio) {
      return;
    }

    audio.reload();
  }

  unload() {
    this.stop();
    Object.values(this.lookup.value).forEach(a => a.unload());
  }
}

export const AudioManager = new PreloadedAudioManager();
