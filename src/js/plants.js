/**
 * Plant classes and data for Garden Paradise
 */

import Utils from './utils.js';
import soundSystem from './sounds.js';

// Plant data configuration
export const PLANTS = {
    lettuce: {
        name: 'Lettuce',
        description: 'Fast-growing leafy green, perfect for beginners',
        category: 'vegetable',
        rarity: 'common',
        cost: 5,
        harvestValue: 12,
        experience: 10,
        growthTime: 30000, // 30 seconds for development (normally 2 minutes)
        waterInterval: 15000, // Needs water every 15 seconds
        icons: {
            seed: '🌰',
            sprout: '🌱',
            growing: '🌿',
            mature: '🥬',
            harvestable: '🥬'
        },
        unlockLevel: 1,
        tips: 'Waters quickly and grows fast - great for steady income!',
        image: 'src/assets/images/lettuce.png'
    },

    tomato: {
        name: 'Tomato',
        description: 'Juicy red fruit that takes time but pays well',
        category: 'fruit',
        rarity: 'common',
        cost: 15,
        harvestValue: 35,
        experience: 25,
        growthTime: 90000, // 90 seconds for development (normally 15 minutes)
        waterInterval: 30000, // Needs water every 30 seconds
        icons: {
            seed: '🌰',
            sprout: '🌱',
            growing: '🌿',
            mature: '🍅',
            harvestable: '🍅'
        },
        unlockLevel: 2,
        tips: 'Higher value crop that needs patience and care',
        image: 'src/assets/images/tomato.png'
    },

    carrot: {
        name: 'Carrot',
        description: 'Orange root vegetable that grows underground',
        category: 'vegetable',
        rarity: 'common',
        cost: 10,
        harvestValue: 25,
        experience: 15,
        growthTime: 60000, // 60 seconds for development (normally 5 minutes)
        waterInterval: 20000, // Needs water every 20 seconds
        icons: {
            seed: '🌰',
            sprout: '🌱',
            growing: '🌿',
            mature: '🥕',
            harvestable: '🥕'
        },
        unlockLevel: 1,
        tips: 'Reliable crop with moderate growth time',
        image: 'src/assets/images/carrot.png'
    },

    strawberry: {
        name: 'Strawberry',
        description: 'Sweet berry that can be harvested multiple times',
        category: 'fruit',
        rarity: 'uncommon',
        cost: 25,
        harvestValue: 40,
        experience: 30,
        growthTime: 120000, // 2 minutes for development (normally 20 minutes)
        waterInterval: 25000, // Needs water every 25 seconds
        icons: {
            seed: '🌰',
            sprout: '🌱',
            growing: '🌿',
            mature: '🍓',
            harvestable: '🍓'
        },
        unlockLevel: 3,
        tips: 'Premium fruit with excellent profit margins',
        image: 'src/assets/images/strawberry.png'
    },

    apple: {
        name: 'Apple Tree',
        description: 'Fruit tree that produces apples over time',
        category: 'tree',
        rarity: 'rare',
        cost: 100,
        harvestValue: 150,
        experience: 100,
        growthTime: 300000, // 5 minutes for development (normally 1 hour)
        waterInterval: 60000, // Needs water every minute
        icons: {
            seed: '🌰',
            sprout: '🌱',
            growing: '🌳',
            mature: '🍎',
            harvestable: '🍎'
        },
        unlockLevel: 5,
        tips: 'High-value tree that requires significant investment',
        image: 'src/assets/images/apple.png'
    },

    // Special plants
    moneyTree: {
        name: 'Money Tree',
        description: 'Magical tree that grows coins instead of fruit',
        category: 'special',
        rarity: 'legendary',
        cost: 500,
        harvestValue: 200,
        experience: 200,
        growthTime: 600000, // 10 minutes for development (normally 4 hours)
        waterInterval: 120000, // Needs water every 2 minutes
        icons: {
            seed: '🌰',
            sprout: '🌱',
            growing: '🌳',
            mature: '💰',
            harvestable: '💰'
        },
        unlockLevel: 10,
        tips: 'Legendary plant that generates passive income'
    },

    rainbow: {
        name: 'Rainbow Flower',
        description: 'Mystical flower that gives random valuable rewards',
        category: 'special',
        rarity: 'epic',
        cost: 200,
        harvestValue: 100,
        experience: 150,
        growthTime: 240000, // 4 minutes for development (normally 2 hours)
        waterInterval: 45000, // Needs water every 45 seconds
        icons: {
            seed: '🌰',
            sprout: '🌱',
            growing: '🌿',
            mature: '🌈',
            harvestable: '🌈'
        },
        unlockLevel: 7,
        tips: 'Magical flower with mysterious powers'
    }
};

// Base Plant class
export class Plant {
    constructor(type, plotIndex, plantedTime = Date.now()) {
        // Input validation
        if (!type || typeof type !== 'string') {
            throw new Error(`Invalid plant type: ${type}. Type must be a non-empty string.`);
        }
        
        if (typeof plotIndex !== 'number' || plotIndex < 0) {
            throw new Error(`Invalid plot index: ${plotIndex}. Must be a non-negative number.`);
        }
        
        if (typeof plantedTime !== 'number' || plantedTime <= 0) {
            throw new Error(`Invalid planted time: ${plantedTime}. Must be a positive number.`);
        }

        this.type = type;
        this.plotIndex = plotIndex;
        this.plantedTime = plantedTime;
        this.lastWatered = plantedTime;
        this.fertilized = false;
        this.data = PLANTS[type];
        
        if (!this.data) {
            throw new Error(`Unknown plant type: ${type}. Available types: ${Object.keys(PLANTS).join(', ')}`);
        }
        
        // Validate plant data integrity
        if (!this.data.name || !this.data.growthTime || !this.data.harvestValue) {
            throw new Error(`Invalid plant data for type: ${type}. Missing required properties.`);
        }
    }

    // Get current growth stage
    getGrowthStage() {
        const progress = this.getGrowthProgress();
        
        if (progress >= 1) return 'harvestable';
        if (progress >= 0.75) return 'mature';
        if (progress >= 0.5) return 'growing';
        if (progress >= 0.25) return 'sprout';
        return 'seed';
    }

    // Get growth progress (0-1)
    getGrowthProgress() {
        const elapsed = Date.now() - this.plantedTime;
        return Math.min(1, elapsed / this.getGrowthDuration());
    }

    // Get total growth duration
    getGrowthDuration() {
        let duration = this.data.growthTime;
        
        // Apply fertilizer bonus
        if (this.fertilized) {
            duration *= 0.8; // 20% faster growth
        }
        
        return duration;
    }

    // Check if plant needs water
    needsWater() {
        const timeSinceWater = Date.now() - this.lastWatered;
        return timeSinceWater >= this.data.waterInterval;
    }

    // Water the plant
    water() {
        this.lastWatered = Date.now();
        soundSystem.play('water');
    }

    // Apply fertilizer
    fertilize() {
        if (this.fertilized) {
            return false;
        }
        
        this.fertilized = true;
        soundSystem.play('success');
        return true;
    }

    // Check if plant is ready for harvest
    isHarvestable() {
        return this.getGrowthProgress() >= 1;
    }

    // Harvest the plant
    harvest() {
        if (!this.isHarvestable()) {
            return null;
        }

        // Calculate harvest value
        let value = this.data.harvestValue;
        if (this.fertilized) {
            value = Math.floor(value * 1.5); // 50% bonus from fertilizer
        }

        soundSystem.play('harvest');
        return {
            type: this.type,
            value,
            experience: this.data.experience
        };
    }

    // Get current icon
    getIcon() {
        const stage = this.getGrowthStage();
        return this.data.icons[stage] || this.data.icons.seed;
    }

    // Get state classes for styling
    getStateClasses() {
        const classes = ['plant'];
        const stage = this.getGrowthStage();
        
        classes.push(`stage-${stage}`);
        
        if (this.needsWater()) {
            classes.push('needs-water');
            soundSystem.play('water_needed');
        }
        
        if (this.fertilized) {
            classes.push('fertilized');
        }
        
        if (this.isHarvestable()) {
            classes.push('harvestable');
            soundSystem.play('plant_ready');
        }
        
        return classes.join(' ');
    }

    // Convert to JSON for saving
    toJSON() {
        return {
            type: this.type,
            plotIndex: this.plotIndex,
            plantedTime: this.plantedTime,
            lastWatered: this.lastWatered,
            fertilized: this.fertilized
        };
    }

    // Create from JSON data
    static fromJSON(data) {
        const plant = new Plant(data.type, data.plotIndex, data.plantedTime);
        plant.lastWatered = data.lastWatered;
        plant.fertilized = data.fertilized;
        return plant;
    }
}

export default Plant;

// Plant utility functions
export const PlantUtils = {
    getPlantsByCategory(category) {
        return Object.entries(PLANTS)
            .filter(([_, data]) => !category || data.category === category)
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {});
    },

    getAvailablePlants(level) {
        return Object.entries(PLANTS)
            .filter(([_, data]) => data.unlockLevel <= level)
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {});
    },

    getRarityColor(rarity) {
        const colors = {
            common: '#808080',
            uncommon: '#32CD32',
            rare: '#4169E1',
            epic: '#9932CC',
            legendary: '#FFD700'
        };
        return colors[rarity] || colors.common;
    },

    getExperienceForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    },

    getTotalExperienceForLevel(level) {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += this.getExperienceForLevel(i);
        }
        return total;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PLANTS, Plant, PlantUtils };
} else if (typeof window !== 'undefined') {
    window.PLANTS = PLANTS;
    window.Plant = Plant;
    window.PlantUtils = PlantUtils;
} 