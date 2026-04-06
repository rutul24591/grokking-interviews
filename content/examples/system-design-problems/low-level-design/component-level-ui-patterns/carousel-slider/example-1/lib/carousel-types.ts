export interface Slide {
  id: string;
  content: React.ReactNode;
  ariaLabel: string;
}

export interface CarouselState {
  currentIndex: number;
  isPlaying: boolean;
  slides: Slide[];
}

export interface CarouselConfig {
  slides: Slide[];
  interval?: number;
  loop?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
}
