import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Collapse,
  IconButton,
  Box,
} from '@mui/material';
import { ExpandLess, ExpandMore, Close } from '@mui/icons-material';
import type { LocationMenuProps } from '../types';

const locations = {
  'California': {
    'Los Angeles': ['Downtown', 'Hollywood', 'Santa Monica'],
    'San Francisco': ['Downtown', 'Mission District', 'Marina'],
    'San Diego': ['Gaslamp Quarter', 'La Jolla', 'Pacific Beach']
  },
  'New York': {
    'New York City': ['Manhattan', 'Brooklyn', 'Queens'],
    'Buffalo': ['Downtown', 'Elmwood Village', 'North Buffalo'],
    'Albany': ['Downtown', 'Pine Hills', 'Center Square']
  }
} as const;

export default function LocationMenu({ isOpen, onClose, onLocationSelect }: LocationMenuProps) {
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  const handleStateClick = (state: keyof typeof locations) => {
    setExpandedState(expandedState === state ? null : state);
    setExpandedCity(null);
  };

  const handleCityClick = (state: keyof typeof locations, city: string) => {
    setExpandedCity(expandedCity === city ? null : city);
    if (!locations[state][city]) {
      onLocationSelect(state, city);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: 'rgba(40, 40, 40, 0.95)',
          backdropFilter: 'blur(5px)',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      <List
        sx={{ width: '100%', pt: 0 }}
        component="nav"
        subheader={
          <ListSubheader
            component="div"
            sx={{
              bgcolor: 'transparent',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 500,
            }}
          >
            Select Location
          </ListSubheader>
        }
      >
        {(Object.keys(locations) as Array<keyof typeof locations>).map((state) => (
          <div key={state}>
            <ListItemButton onClick={() => handleStateClick(state)}>
              <ListItemText primary={state} />
              {expandedState === state ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={expandedState === state} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.keys(locations[state]).map((city) => (
                  <div key={city}>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => handleCityClick(state, city)}
                    >
                      <ListItemText primary={city} />
                      {locations[state][city].length > 0 && (
                        expandedCity === city ? <ExpandLess /> : <ExpandMore />
                      )}
                    </ListItemButton>

                    <Collapse in={expandedCity === city} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {locations[state][city].map((neighborhood) => (
                          <ListItemButton
                            key={neighborhood}
                            sx={{ pl: 6 }}
                            onClick={() => onLocationSelect(state, city, neighborhood)}
                          >
                            <ListItemText primary={neighborhood} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </div>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </Drawer>
  );
} 