import { useState } from 'react';
import { TextField, InputAdornment, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';
import type { SearchBarProps } from '../types';

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const [location = '', industry = ''] = searchText.split(',').map(s => s.trim());
      onSearch(location, industry);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <TextField
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={handleSearch}
        placeholder="Search location, industry..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: 'white' }} />
            </InputAdornment>
          ),
          sx: {
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
          },
        }}
      />
    </Paper>
  );
} 