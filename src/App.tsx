import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import VideoPlayer from './components/VideoPlayer';
import SearchBar from './components/SearchBar';
import LocationMenu from './components/LocationMenu';
import { Video } from './types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);
const supabase = createClient(supabaseUrl, supabaseKey);

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify green
    },
    background: {
      default: '#121212',
      paper: '#282828',
    },
  },
});

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        console.log('Fetching videos...');
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        console.log('Fetched videos:', JSON.stringify(data, null, 2));
        console.log('First video details:', JSON.stringify(data?.[0], null, 2));
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  const handleSearch = async (location: string, industry: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }
      if (industry) {
        query = query.ilike('industry', `%${industry}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVideos(data || []);
      setActiveVideoIndex(0);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (state: string, city?: string, neighborhood?: string) => {
    const location = [state, city, neighborhood].filter(Boolean).join(', ');
    handleSearch(location, '');
    setIsMenuOpen(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    const videoHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / videoHeight);
    
    if (newIndex !== activeVideoIndex) {
      setActiveVideoIndex(newIndex);
    }
  };

  const handleNextVideo = () => {
    if (activeVideoIndex < videos.length - 1) {
      setActiveVideoIndex(activeVideoIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (activeVideoIndex > 0) {
      setActiveVideoIndex(activeVideoIndex - 1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
        {/* Header */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: 2,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <SearchBar onSearch={handleSearch} />
          <IconButton
            onClick={() => setIsMenuOpen(true)}
            sx={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Video Content */}
        {loading ? (
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Loading videos...</Typography>
          </Box>
        ) : videos.length > 0 ? (
          <VideoPlayer
            video={videos[activeVideoIndex]}
            isActive={true}
            onSoundToggle={() => {}}
            onNext={handleNextVideo}
            onPrevious={handlePreviousVideo}
          />
        ) : (
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>No videos found</Typography>
          </Box>
        )}

        {/* Location Menu */}
        <LocationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 