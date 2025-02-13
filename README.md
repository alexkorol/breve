﻿<img src="breve_logo_transparent.png" alt="Breve Logo" width="200"/>

# Brĕve

Brĕve is a React Native application built with Expo in a monorepo structure.

## Project Structure

The project is organized as follows:

- `apps/mobile`: Contains the main React Native application
- `packages/api`: API-related code
- `packages/core`: Core business logic
- `packages/ui`: Reusable UI components

## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- Yarn
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/alexkorol/breve.git
   cd breve
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Start the development server:
   ```
   cd apps/mobile
   yarn start
   ```

4. Scan the QR code with the Expo Go app on your mobile device to run the app.

## Development

- The main application code is located in `apps/mobile/app`.
- Shared components and logic can be found in the `packages` directory.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
