import { Howler, Howl } from 'howler';
import { DeferredPromise } from '@/util/deferredPromise';
import { useToast } from 'vue-toast-notification';
import { computed, reactive, readonly, ref } from 'vue';

type AudioState = 'unloaded' | 'loading' | 'loaded' | 'errored';

Howler.autoUnlock = true;
Howler.html5PoolSize = 200;

const toast = useToast();

export class PreloadedAudio {
  private sound: Howl;
  private prom = DeferredPromise();
  private internalState = ref<AudioState>('unloaded');
  private _src = '';

  public state = readonly(this.internalState);

  constructor(src: string, maxDuration?: number) {
    this.internalState.value = 'loading';
    this._src = src;
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
        console.error('[Audio] load error', error);
        this.internalState.value = 'errored';
        toast.error(`Error loading preview - ${error || 'unknown'}`, { duration: 5000 });
        res();
      },
      onplayerror: (_id, error) => {
        console.error('[Audio] play error', error);
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
}

class PreloadedAudioManager {
  private current?: PreloadedAudio;
  public lookup = ref<Record<string, PreloadedAudio>>({});

  public debug = computed(() => {
    return Object.values(this.lookup.value).map(a => {
      return reactive({
        src: a.src,
        state: a.state,
      });
    });
  });

  add(srcs: string[], maxDuration?: number) {
    for (const src of srcs) {
      if (!this.lookup.value[src]) {
        this.lookup.value[src] = new PreloadedAudio(src, maxDuration);
      }
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

  unload() {
    this.stop();
    Object.values(this.lookup.value).forEach(a => a.unload());
  }
}

export const AudioManager = new PreloadedAudioManager();
