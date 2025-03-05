import { useEffect, useRef, useState, TouchEvent, MouseEvent } from 'react';
import Player from '@vimeo/player';
import { Box, IconButton, Typography } from '@mui/material';
import { VolumeUp, VolumeOff, PlayArrow, Pause } from '@mui/icons-material';
import type { VideoPlayerProps } from '../types';

export default function VideoPlayer({ video, isActive, onNext, onPrevious }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const vimeoPlayerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;
  // Maximum time for a tap (in milliseconds)
  const maxTapTime = 300;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartTime(Date.now());
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const touchDuration = Date.now() - (touchStartTime || 0);

    // If it's a quick tap (not a swipe), toggle play/pause
    if (Math.abs(distance) < minSwipeDistance && touchDuration < maxTapTime) {
      handlePlayPause();
    } else {
      if (isLeftSwipe && onNext) {
        onNext();
      }
      if (isRightSwipe && onPrevious) {
        onPrevious();
      }
    }
  };

  const handleClick = (e: MouseEvent) => {
    // Only handle clicks on the video container, not on buttons
    if (e.target === e.currentTarget) {
      handlePlayPause();
    }
  };

  const handlePlayPause = async () => {
    if (vimeoPlayerRef.current) {
      try {
        if (isPaused) {
          await vimeoPlayerRef.current.play();
        } else {
          await vimeoPlayerRef.current.pause();
        }
        setIsPaused(!isPaused);
      } catch (err) {
        console.error('Error toggling play/pause:', err);
      }
    }
  };

  useEffect(() => {
    console.log('VideoPlayer received video:', JSON.stringify(video, null, 2));
    
    if (!video?.vimeo_link) {
      console.error('No video link provided for video:', JSON.stringify(video, null, 2));
      setError('No video link available');
      return;
    }

    const initializePlayer = async () => {
      if (!playerRef.current) {
        console.error('Player container not found');
        return;
      }

      try {
        // Extract video ID from Vimeo link
        const videoId = video.vimeo_link.split('/').pop();
        if (!videoId) {
          throw new Error('Invalid Vimeo link format');
        }
        console.log('Extracted video ID:', videoId);

        // Create a new iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0`;
        iframe.allow = "autoplay; fullscreen";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        
        // Clear the container and append the new iframe
        playerRef.current.innerHTML = '';
        playerRef.current.appendChild(iframe);

        // Initialize Vimeo player
        const player = new Player(iframe);
        vimeoPlayerRef.current = player;
        
        await player.ready();
        console.log('Vimeo player ready');
        await player.setVolume(0); // Start muted
        await player.play();
        console.log('Video playback started');
      } catch (err) {
        console.error('Error initializing Vimeo player:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      }
    };

    initializePlayer();

    return () => {
      if (vimeoPlayerRef.current) {
        vimeoPlayerRef.current.destroy();
      }
    };
  }, [video?.vimeo_link]);

  useEffect(() => {
    if (vimeoPlayerRef.current) {
      if (isActive) {
        if (!isPaused) {
          vimeoPlayerRef.current.play().catch(console.error);
        }
      } else {
        vimeoPlayerRef.current.pause().catch(console.error);
      }
    }
  }, [isActive, isPaused]);

  const handleVolumeToggle = async () => {
    if (vimeoPlayerRef.current) {
      try {
        const newVolume = isMuted ? 1 : 0;
        await vimeoPlayerRef.current.setVolume(newVolume);
        setIsMuted(!isMuted);
      } catch (err) {
        console.error('Error toggling volume:', err);
      }
    }
  };

  return (
    <Box 
      sx={{ position: 'relative', width: '100%', height: '100vh' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
    >
      <div
        ref={playerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
        }}
      />
      {error && (
        <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          {error}
        </Typography>
      )}
      {!error && (
        <>
          <IconButton
            onClick={handlePlayPause}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            {isPaused ? <PlayArrow /> : <Pause />}
          </IconButton>
          <IconButton
            onClick={handleVolumeToggle}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
        </>
      )}
    </Box>
  );
} 