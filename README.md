# Video Journey Discovery

A modern short-form video discovery platform built with React, TypeScript, and Supabase.

## Features

- Smooth vertical scrolling video feed
- Location-based video discovery
- Industry/category filtering
- Beautiful dark mode UI
- Responsive design
- Integrated with Vimeo for high-quality video playback

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- A Supabase account and project
- A Vimeo account (for video hosting)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-journey-discovery.git
cd video-journey-discovery
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Database Schema

Create the following table in your Supabase project:

```sql
create table videos (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  vimeo_link text not null,
  location text,
  industry text,
  state text,
  city text,
  neighborhood text,
  latitude numeric,
  longitude numeric
);

-- Create indexes for better query performance
create index videos_location_idx on videos using gin (location gin_trgm_ops);
create index videos_industry_idx on videos using gin (industry gin_trgm_ops);
create index videos_created_at_idx on videos (created_at desc);
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 