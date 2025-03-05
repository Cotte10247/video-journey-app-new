export interface Video {
  id: string;
  vimeo_link: string;
  location: string;
  industry?: string;
  date: string;
  latitude?: number;
  longitude?: number;
  state?: string;
  city?: string;
  neighborhood?: string;
  created_at: string;
}

export interface VideoPlayerProps {
  video: Video;
  onSoundToggle: () => void;
  isActive: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface SearchBarProps {
  onSearch: (location: string, industry: string) => void;
}

export interface LocationMenuProps {
  onLocationSelect: (state: string, city?: string, neighborhood?: string) => void;
  isOpen: boolean;
  onClose: () => void;
} 