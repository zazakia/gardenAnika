# 🌱 Garden Game - Plant & Fruit Growing Game Plan

## 🎮 Game Concept
**"Garden Paradise"** - A relaxing farming simulation where players cultivate their own virtual garden, growing various plants and fruits while managing resources and unlocking new content.

## 🎯 Core Objectives
- Create a peaceful, engaging gardening experience
- Teach players about different plants and their growth cycles
- Provide satisfying progression and collection mechanics
- Offer both casual and strategic gameplay elements

## 🌟 Key Features

### 1. **Garden Management**
- **Grid-based garden**: 6x6 expandable plot system
- **Plant lifecycle**: Seed → Sprout → Growing → Mature → Harvestable
- **Plant varieties**: 
  - Vegetables (tomatoes, carrots, lettuce, peppers)
  - Fruits (strawberries, apples, oranges, grapes)
  - Flowers (roses, sunflowers, tulips)
  - Special plants (money tree, rainbow flower)

### 2. **Resource Management**
- **Water**: Required for plant growth, refills over time or via rain
- **Fertilizer**: Speeds up growth, purchased with coins
- **Seeds**: Different rarities and costs
- **Coins**: Earned by selling harvested produce

### 3. **Growth Mechanics**
- **Real-time growth**: Plants grow over actual time (minutes/hours)
- **Care requirements**: Regular watering, optional fertilizing
- **Weather system**: Rain (free watering), sunny (faster growth), storms (potential damage)
- **Seasons**: Different plants thrive in different seasons

### 4. **Progression System**
- **Experience points**: Gained through planting, harvesting, caring
- **Level unlocks**: New seeds, garden expansions, tools
- **Achievements**: Special challenges and milestones
- **Collection book**: Track all plants discovered and grown

### 5. **Shop & Economy**
- **Seed shop**: Buy new varieties with coins
- **Tool upgrades**: Better watering cans, fertilizers
- **Decorations**: Garden ornaments, fences, paths
- **Special items**: Growth boosters, weather predictors

## 🎨 Visual Design

### Art Style
- **Colorful pixel art** or **clean vector graphics**
- **Bright, cheerful color palette**
- **Smooth animations** for plant growth and interactions
- **Intuitive icons** for all game elements

### UI Layout
- **Garden view**: Main gameplay area with plant grid
- **Inventory bar**: Quick access to seeds, tools, water
- **Status panel**: Coins, experience, current weather
- **Shop button**: Access to purchasing interface
- **Settings menu**: Save/load, sound controls

## 🛠️ Technical Implementation

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Graphics**: Canvas API or SVG for rendering
- **Storage**: LocalStorage for save data
- **Package Manager**: pnpm (user preference)
- **Build Tool**: Vite or Webpack for development

### File Structure
```
Garden/
├── index.html              # Main game page
├── src/
│   ├── js/
│   │   ├── game.js         # Main game logic
│   │   ├── garden.js       # Garden management
│   │   ├── plants.js       # Plant classes and data
│   │   ├── shop.js         # Shop functionality
│   │   ├── ui.js           # User interface
│   │   └── utils.js        # Helper functions
│   ├── css/
│   │   ├── main.css        # Main styles
│   │   ├── garden.css      # Garden-specific styles
│   │   └── ui.css          # UI component styles
│   └── assets/
│       ├── images/         # Plant sprites, UI icons
│       ├── sounds/         # Audio effects (optional)
│       └── data/           # Plant data, configurations
├── package.json            # Dependencies and scripts
└── README.md              # Game instructions
```

### Core Classes
- **Game**: Main game controller
- **Garden**: Manages the garden grid and plots
- **Plant**: Base plant class with growth logic
- **Player**: Player stats, inventory, progress
- **Shop**: Purchasing and unlocks system
- **Weather**: Weather effects and timing

## 🎲 Game Mechanics Details

### Growth Timing
- **Fast plants**: 2-5 minutes (herbs, lettuce)
- **Medium plants**: 10-15 minutes (tomatoes, peppers)
- **Slow plants**: 30-60 minutes (fruit trees)
- **Special plants**: Hours or real-world days

### Economic Balance
- **Starting coins**: 50
- **Basic seeds**: 5-10 coins
- **Rare seeds**: 50-100 coins
- **Harvest value**: 2-5x seed cost
- **Fertilizer**: 15 coins (50% growth speed boost)

### Progression Milestones
- **Level 1**: Basic vegetables unlocked
- **Level 3**: Fruit plants available
- **Level 5**: Garden expansion (8x8)
- **Level 7**: Weather prediction tool
- **Level 10**: Rare and magical plants

## 🚀 Development Phases

### Phase 1: Core Foundation (Week 1)
- [ ] Basic HTML structure and CSS styling
- [ ] Grid-based garden system
- [ ] Simple plant growth mechanics
- [ ] Basic UI (plant, water, harvest)

### Phase 2: Game Systems (Week 2)
- [ ] Resource management (water, coins)
- [ ] Shop functionality
- [ ] Multiple plant types
- [ ] Save/load system

### Phase 3: Polish & Features (Week 3)
- [ ] Weather system
- [ ] Achievement system
- [ ] Sound effects and animations
- [ ] Mobile responsiveness

### Phase 4: Advanced Features (Week 4)
- [ ] Special plants and mechanics
- [ ] Advanced progression system
- [ ] Visual polish and effects
- [ ] Balancing and testing

## 🎯 Success Metrics
- **Engagement**: Players return multiple times per day
- **Progression**: Clear sense of advancement and unlocks
- **Collection**: Motivation to discover all plant types
- **Relaxation**: Stress-free, enjoyable experience

## 🌈 Future Enhancements
- **Multiplayer**: Visit friends' gardens
- **Seasonal events**: Limited-time plants and decorations
- **Mini-games**: Pest control, weather challenges
- **Garden themes**: Different biomes and styles
- **Mobile app**: Native iOS/Android version

---

*Ready to start growing your digital garden! 🌻* 