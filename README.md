# �� Garden Paradise

A delightful browser-based plant growing game where you can cultivate various plants, manage resources, and watch your garden flourish!

## 🎮 Play Online

**[Play Garden Paradise Online](https://zazakia.github.io/gardenAnika/)**

## 🚀 Features

- **🌿 Plant Growing System**: Plant seeds, water them, and watch them grow through different stages
- **🛒 Shop System**: Purchase seeds and water with your earned coins
- **💰 Resource Management**: Manage coins and water efficiently
- **📈 Progression System**: Gain experience and level up to unlock new plants
- **🔊 Sound System**: Customizable sound effects for different game events
- **💾 Auto-Save**: Your progress is automatically saved locally
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🎯 How to Play

1. **Plant Seeds**: Click on empty plots to plant seeds from your inventory
2. **Water Plants**: Use water to keep your plants healthy and growing
3. **Harvest**: Collect mature plants to earn coins and experience
4. **Shop**: Buy more seeds and water from the shop
5. **Level Up**: Gain experience to unlock new plant types

## 🛠️ Development

### Prerequisites

- Node.js (v14 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zazakia/gardenAnika.git
cd gardenAnika
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## 🏗️ Project Structure

```
Garden/
├── src/
│   ├── js/
│   │   ├── game.js      # Main game logic
│   │   ├── garden.js    # Garden grid management
│   │   ├── plants.js    # Plant types and growth logic
│   │   ├── shop.js      # Shop system
│   │   ├── sounds.js    # Sound effects
│   │   ├── ui.js        # User interface
│   │   ├── utils.js     # Utility functions
│   │   └── main.js      # Application entry point
│   ├── css/
│   │   ├── main.css     # Global styles
│   │   ├── garden.css   # Garden-specific styles
│   │   └── ui.css       # UI component styles
│   └── assets/
│       ├── images/      # Game images
│       └── sounds/      # Audio files
├── index.html           # Main HTML file
├── package.json         # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## 🎨 Technologies Used

- **HTML5** - Game structure
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Game logic
- **Vite** - Build tool and dev server
- **pnpm** - Package manager
- **LocalStorage** - Game state persistence

## 🌟 Game Features

### Plant Types
- **Lettuce** - Fast growing, basic plant
- **Tomato** - Medium growth time, good value
- **Carrot** - Longer growth, higher value
- **Strawberry** - Premium plant, high value
- **Apple** - Rare plant, highest value

### Sound Settings
Customize which sounds you want to hear:
- Success/Error notifications
- Plant actions (plant, water, harvest)
- Shop interactions
- UI interactions
- Level up and achievement sounds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by classic farming games
- Designed for a relaxing gaming experience

---

**Happy Gardening! 🌱✨** 