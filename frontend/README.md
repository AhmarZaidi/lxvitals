****# Linux Vitals Frontend

A system monitoring dashboard built with Next.js that displays hardware statistics for your Linux system.

## Features

- CPU usage and temperature monitoring
- GPU statistics
- Memory usage tracking
- Storage drive analytics
- Battery status information
- WiFi connection details
- Network speed testing
- Dark/light theme support
- Draggable and collapsible dashboard cards

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
    ```

3. Create a .env file based on .env.example with your backend URL:

   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- src/app/components/: UI components for system metrics
- src/app/(pages)/: Main application pages (dashboard, settings, about)
- src/app/hooks/: Custom React hooks
- src/app/providers/: Context providers for theme
- src/app/types/: TypeScript interfaces for data models
