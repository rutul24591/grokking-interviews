'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { PlayerConfig } from './lib/player-types';

export function MediaPlayer({ src, type, poster, captionsSrc, autoPlay }: PlayerConfig) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(!autoPlay);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [activeCue, setActiveCue] = useState<VTTCue | null>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onTimeUpdate = () => setCurrentTime(media.currentTime);
    const onDurationChange = () => setDuration(media.duration);
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    const onVolumeChange = () => { setVolume(media.volume); setMuted(media.muted); };

    media.addEventListener('timeupdate', onTimeUpdate);
    media.addEventListener('durationchange', onDurationChange);
    media.addEventListener('play', onPlay);
    media.addEventListener('pause', onPause);
    media.addEventListener('volumechange', onVolumeChange);

    if (autoPlay) media.play().catch(() => {});

    return () => {
      media.removeEventListener('timeupdate', onTimeUpdate);
      media.removeEventListener('durationchange', onDurationChange);
      media.removeEventListener('play', onPlay);
      media.removeEventListener('pause', onPause);
      media.removeEventListener('volumechange', onVolumeChange);
    };
  }, [autoPlay]);

  const togglePlay = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.paused ? media.play() : media.pause();
  }, []);

  const seek = useCallback((time: number) => {
    if (mediaRef.current) mediaRef.current.currentTime = time;
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="relative group bg-black rounded-lg overflow-hidden">
      {type === 'video' ? (
        <video ref={mediaRef as React.RefObject<HTMLVideoElement>} src={src} poster={poster} className="w-full" />
      ) : (
        <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={src} />
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <input type="range" min={0} max={duration || 0} value={currentTime} onChange={(e) => seek(Number(e.target.value))} className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer" aria-label="Seek" />

        <div className="flex items-center gap-4 mt-2">
          <button onClick={togglePlay} className="text-white hover:text-gray-300" aria-label={paused ? 'Play' : 'Pause'}>
            {paused ? '▶' : '⏸'}
          </button>
          <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>

          {/* Volume */}
          <button onClick={() => setMuted(!muted)} className="text-white" aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? '🔇' : '🔊'}</button>
          <input type="range" min={0} max={1} step={0.1} value={muted ? 0 : volume} onChange={(e) => { setVolume(Number(e.target.value)); if (mediaRef.current) mediaRef.current.volume = Number(e.target.value); }} className="w-16 h-1 bg-gray-600 rounded" aria-label="Volume" />

          {/* Speed */}
          <select value={playbackRate} onChange={(e) => { const r = Number(e.target.value); setPlaybackRate(r); if (mediaRef.current) mediaRef.current.playbackRate = r; }} className="bg-gray-800 text-white text-sm rounded px-2 py-1" aria-label="Playback speed">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => <option key={r} value={r}>{r}x</option>)}
          </select>

          {/* Captions */}
          {captionsSrc && (
            <button onClick={() => setCaptionsOn(!captionsOn)} className={`text-sm px-2 py-1 rounded ${captionsOn ? 'bg-white text-black' : 'text-white'}`} aria-label="Toggle captions">CC</button>
          )}
        </div>
      </div>

      {/* Caption overlay */}
      {captionsOn && activeCue && (
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <span className="bg-black/70 text-white px-4 py-2 rounded text-lg">{activeCue.text}</span>
        </div>
      )}
    </div>
  );
}
