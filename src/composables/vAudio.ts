import { computed, reactive, readonly, ref } from 'vue';

type AudioEvent = keyof HTMLMediaElementEventMap;
type AudioCallback<T extends AudioEvent> = (
  this: HTMLAudioElement,
  ev: HTMLMediaElementEventMap[T],
) => any;

export type AudioState = 'unloaded' | 'loading' | 'stalled' | 'loaded' | 'errored';

export interface AudioOptions {
  maxDuration?: number;
  name?: string;
}

export interface AudioRecord {
  name?: string;
  src: string;
  state: AudioState;
  error?: any;
}

export class VAudio {
  private _el: HTMLAudioElement;
  private _abort = new AbortController();
  private _state = ref<AudioState>('unloaded');
  private _error = ref<any>('');
  private _name?: string;
  private _maxDuration: number;

  public state = readonly(this._state);
  public error = readonly(this._error);

  constructor(src: string, opts?: AudioOptions) {
    this._name = opts?.name;
    this._maxDuration = opts?.maxDuration || 1;

    this._el = new Audio();

    this._el.preload = 'none';
    this._el.src = src;
    this._el.loop = false;
    this._el.autoplay = false;

    this.on('canplay', () => (this._state.value = 'loaded'))
      .on('canplaythrough', () => (this._state.value = 'loaded'))
      .on('error', error => {
        console.error('[VAudio]', error);
        this._state.value = 'errored';
        this._error.value = error.message || error.error;
      })
      .on('loadstart', () => (this._state.value = 'loading'))
      .on('stalled', () => (this._state.value = 'stalled'));
  }

  on<T extends AudioEvent>(event: T, callback: AudioCallback<T>, signal?: AbortSignal) {
    this._el.addEventListener(event, callback, {
      passive: true,
      signal: signal || this._abort.signal,
    });
    return this;
  }

  off<T extends AudioEvent>(event: T, callback: AudioCallback<T>) {
    this._el.addEventListener(event, callback);
    return this;
  }

  once<T extends AudioEvent>(event: T, callback: AudioCallback<T>, signal?: AbortSignal) {
    this._el.addEventListener(event, callback, {
      passive: true,
      signal: signal || this._abort.signal,
      once: true,
    });
    return this;
  }

  // private onDebug<T extends AudioEvent>(event: T) {
  //   return this.on(event, e => addError(e.type));
  // }

  // private onDebugAll<T extends AudioEvent>(events: T[]) {
  //   for (const event of events) {
  //     this.onDebug(event);
  //   }
  //   return this;
  // }

  get src() {
    return this._el.src;
  }

  get name() {
    return this._name;
  }

  load() {
    this._el.load();
    return this;
  }

  unload() {
    this._state.value = 'unloaded';
    this._el.src = '';
    return this;
  }

  async play() {
    const duration = this._maxDuration / 1000;
    this._el.currentTime = 0;

    const abortCon = new AbortController();

    const prom = new Promise((resolve, reject) => {
      this.on(
        'timeupdate',
        () => {
          const time = this._el.currentTime;
          if (time > duration) {
            resolve('done');
            this._el.pause();
          }
        },
        abortCon.signal,
      );
      this.once('ended', () => resolve('finished'), abortCon.signal);
      this.once('error', e => reject(e), abortCon.signal);
      this.once('pause', () => resolve('paused'), abortCon.signal);
    });

    await this._el.play();

    return await prom.finally(() => abortCon.abort());
  }

  stop() {
    this._el.pause();
    return this;
  }

  destroy() {
    this._el = undefined!;
    this._abort.abort();
  }
}

class VAudioManager {
  private current?: VAudio;
  public lookup = ref<Record<string, VAudio>>({});

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
      this.lookup.value[src] = new VAudio(src, opts);
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
    return this;
  }

  reload(src: string) {
    return this.load(src);
  }

  load(src: string) {
    const audio = this.lookup.value[src];
    if (!audio) {
      return;
    }

    audio.load();
    return this;
  }

  unload() {
    this.stop();
    Object.values(this.lookup.value).forEach(a => a.unload());
    return this;
  }
}

export const AudioManager = new VAudioManager();
