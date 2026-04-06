export type MediaType = 'video' | 'audio';

export interface PlayerState {
  currentTime: number;
  duration: number;
  paused: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
  buffered: TimeRanges | null;
  isFullscreen: boolean;
  captionsOn: boolean;
  captions: VTTCue[];
  activeCue: VTTCue | null;
}

export interface PlayerConfig {
  src: string;
  type: MediaType;
  poster?: string;
  captionsSrc?: string;
  autoPlay?: boolean;
}
