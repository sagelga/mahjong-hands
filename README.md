# Mahjong Hands Validator

A web application for validating and analyzing mahjong hands. This tool helps players check if their mahjong combinations follow the proper rules and are winning hands.

## Features

- Interactive tile selection
- Real-time validation of mahjong hands
- Support for different mahjong rule sets
- Visual representation of tile groups (pons, kans, chiis)
- Responsive design for desktop and mobile use

## Tech Stack

- React with TypeScript
- Vite as the build tool
- Cloudflare Workers for deployment
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:5173`

### Development Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Creates a production build
- `npm run preview` - Locally previews the production build
- `npm run deploy` - Deploys the application to Cloudflare Workers (requires Wrangler CLI)

## Project Structure

```
src/
├── components/     # React components
│   ├── MahjongHand.tsx
│   └── TileKeyboard.tsx
├── lib/           # Utility functions and constants
│   ├── tiles.ts
│   └── validator.ts
└── assets/        # Static assets (images, icons)
    └── tiles/     # Mahjong tile SVGs
```

## Deployment

This project is configured for deployment on Cloudflare Workers using Wrangler. To deploy:

1. Ensure you have Wrangler installed:

    ```bash
    npm install -g wrangler
    ```

2. Log in to your Cloudflare account:

    ```bash
    wrangler login
    ```

3. Deploy the application:
    ```bash
    wrangler deploy
    ```

## Configuration

The application uses `wrangler.json` for Cloudflare Workers configuration and follows standard Vite configuration patterns.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
