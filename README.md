# 🌱 Garden Paradise

A relaxing plant and fruit growing simulation game built with HTML5, CSS3, and JavaScript.

![Garden Paradise Preview](https://via.placeholder.com/800x400/87CEEB/FFFFFF?text=🌻+Garden+Paradise+🌻)

## 🎮 How to Play

### Getting Started
1. **Select a plot** by clicking on any empty garden square
2. **Plant seeds** using the Plant Seed button or pressing Spacebar
3. **Water your plants** to keep them healthy with the Water button or 'W' key
4. **Harvest** mature plants for coins and experience with the Harvest button or 'H' key
5. **Visit the shop** to buy new seeds and unlock more plant varieties

### Game Mechanics
- **💰 Coins**: Earn money by harvesting plants to buy more seeds
- **💧 Water**: Keep plants watered - your water refills automatically over time
- **⭐ Experience**: Gain XP to level up and unlock new plant types
- **🌱 Plant Growth**: Plants grow in real-time with visible progress bars

### Controls
- **Click**: Select garden plots
- **Spacebar**: Plant seed in selected plot
- **W**: Water selected plant
- **H**: Harvest selected plant
- **S**: Open shop

## 🚀 Running the Game

### Development Server
```bash
# Install dependencies
pnpm install

# Start development server
pnpm serve
```

Open http://localhost:8080 in your browser to play!

### Production Build
```bash
# Build for production
pnpm build
```

## 🌿 Plant Types

### Currently Available:
- **🥬 Lettuce** (Level 1) - Fast-growing starter crop
- **🍅 Tomato** (Level 2) - Higher value fruit
- **🥕 Carrot** (Level 2) - Reliable vegetable

### Coming Soon:
- 🍓 Strawberry (Level 3)
- 🍎 Apple Tree (Level 5)
- 💰 Money Tree (Level 10)
- 🌈 Rainbow Flower (Level 7)

## 🛠️ Technical Details

### Project Structure
```
Garden/
├── index.html           # Main game page
├── src/
│   ├── js/
│   │   ├── game.js      # Main game controller
│   │   ├── garden.js    # Garden management
│   │   ├── plants.js    # Plant classes and data
│   │   ├── shop.js      # Shop system (planned)
│   │   ├── ui.js        # User interface (planned)
│   │   └── utils.js     # Helper functions
│   ├── css/
│   │   ├── main.css     # Main styles
│   │   ├── garden.css   # Garden-specific styles
│   │   └── ui.css       # UI component styles
│   └── assets/          # Images, sounds, data files
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Features Implemented ✅
- [x] **Garden Grid System** - 6x6 interactive grid
- [x] **Plant Growth** - Real-time growth with visual feedback
- [x] **Resource Management** - Coins and water system
- [x] **Shop System** - Buy seeds and unlock plants
- [x] **Save/Load** - Progress saved automatically
- [x] **Progression** - Level up system with XP
- [x] **Multiple Plants** - Different growth times and values
- [x] **Mobile Responsive** - Works on phones and tablets

### Planned Features 🚧
- [ ] Weather system affecting plant growth
- [ ] Achievement system with rewards
- [ ] Sound effects and music
- [ ] Garden expansion upgrades
- [ ] Special plants with unique abilities
- [ ] Seasonal events and limited plants

## 🎯 Game Balance

### Economy
- **Starting resources**: 50 coins, 10 water, 5 lettuce seeds
- **Water refill**: +1 every 30 seconds (max 10)
- **Plant prices**: 5-500 coins depending on rarity
- **Harvest multiplier**: ~2x seed cost (with 20% variance)

### Growth Times (Development)
- **Lettuce**: 30 seconds
- **Carrot**: 45 seconds  
- **Tomato**: 90 seconds

*Note: Times are shortened for development. Final game will have longer, more realistic growth times.*

## 🐛 Known Issues

- Shop modal may need refresh on first open
- Progress bars update every second (performance optimization)
- No sound system implemented yet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

MIT License - feel free to use this code for your own projects!

## 🌟 Credits

- **Emojis**: Unicode emoji set for plant icons
- **Inspiration**: Classic farming simulation games
- **Built with**: Pure HTML5, CSS3, and JavaScript (no frameworks!)

---

**Happy Gardening! 🌻**

*Start small, grow big, and build your garden paradise!* 