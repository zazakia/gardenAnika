/**
 * Main Game controller for Garden Paradise
 */

import Utils from './utils.js';
import { Garden } from './garden.js';
import UI from './ui.js';
import Shop from './shop.js';
import { PLANTS } from './plants.js';
import soundSystem from './sounds.js';

export class Game {
    constructor() {
        this.gameState = null;
        this.garden = null;
        this.ui = null;
        this.shop = null;
        this.gameStartTime = Date.now();
        this.saveInterval = null;
        this.selectedSeedType = 'lettuce';
        
        this.init();
    }

    // Initialize the game
    init() {
        console.log('🌱 Initializing Garden Paradise...');
        
        // Load saved game or create new
        this.loadGame() || this.newGame();
        
        // Initialize systems
        this.initializeSystems();
        
        // Set up UI event listeners
        this.setupEventListeners();
        
        // Start auto-save
        this.startAutoSave();
        
        // Update UI
        this.updateUI();
        
        console.log('🌱 Garden Paradise initialized successfully!');
        Utils.showNotification('Welcome to Garden Paradise! 🌻', 'success');
    }

    // Create new game
    newGame() {
        console.log('Starting new game...');
        this.gameState = Utils.createGameState();
        return true;
    }

    // Load saved game
    loadGame() {
        if (!Utils.hasLocalStorage()) return false;
        
        const savedData = Utils.loadFromStorage('gardenParadise');
        if (!savedData) return false;

        try {
            this.gameState = savedData;
            console.log('Game loaded from save data');
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }

    // Save game
    saveGame() {
        if (!Utils.hasLocalStorage()) {
            console.warn('LocalStorage not available, cannot save game');
            return false;
        }

        try {
            // Save garden state
            if (this.garden) {
                this.gameState.garden = this.garden.save();
            }

            // Save to localStorage
            const success = Utils.saveToStorage('gardenParadise', this.gameState);
            if (success) {
                console.log('Game saved successfully');
            }
            return success;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    // Initialize game systems
    initializeSystems() {
        try {
            // Initialize garden
            this.garden = new Garden(6);

            // Initialize UI
            this.ui = new UI(this);

            // Initialize shop
            this.shop = new Shop(this);
            
            console.log('✅ All game systems initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize game systems:', error);
            this.handleInitializationError(error);
        }
    }

    // Handle initialization errors gracefully
    handleInitializationError(error) {
        console.log('🔧 Attempting to recover from initialization error...');
        
        // Try to create minimal working state
        try {
            if (!this.garden) {
                this.garden = new Garden(6); // Default 6x6 garden
                console.log('Created fallback garden');
            }
            
            if (!this.ui) {
                console.warn('UI initialization failed, some features may not work');
            }
            
            if (!this.shop) {
                console.warn('Shop initialization failed, shop may not work');
            }
            
            Utils.showNotification('Game started with limited functionality. Some features may not work properly.', 'warning');
        } catch (recoveryError) {
            console.error('❌ Recovery failed:', recoveryError);
            Utils.showNotification('Critical error: Game failed to start properly. Please refresh the page.', 'error');
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // Plant button
        const plantBtn = Utils.$('#plant-btn');
        if (plantBtn) {
            plantBtn.addEventListener('click', () => this.plantSeed());
        }

        // Water button
        const waterBtn = Utils.$('#water-btn');
        if (waterBtn) {
            waterBtn.addEventListener('click', () => this.waterPlant());
        }

        // Harvest button
        const harvestBtn = Utils.$('#harvest-btn');
        if (harvestBtn) {
            harvestBtn.addEventListener('click', () => this.harvestPlant());
        }

        // Shop button
        const shopBtn = Utils.$('#shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => this.openShop());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case ' ':
                case 'spacebar':
                    e.preventDefault();
                    this.plantSeed();
                    break;
                case 'w':
                    this.waterPlant();
                    break;
                case 'h':
                    this.harvestPlant();
                    break;
                case 's':
                    this.openShop();
                    break;
            }
        });
    }

    // Plant seed action
    plantSeed() {
        if (!this.garden) return false;

        if (!this.hasSeeds(this.selectedSeedType)) {
            Utils.showNotification('No seeds available!', 'error');
            return false;
        }

        const success = this.garden.plantSeed(this.selectedSeedType);
        if (success) {
            // Remove seed from inventory
            this.gameState.inventory[this.selectedSeedType]--;
            
            // Update UI
            this.updateUI();
            
            soundSystem.play('plant');
            return true;
        }

        return false;
    }

    // Water plant action
    waterPlant() {
        if (!this.garden) return false;

        if (this.gameState.water <= 0) {
            Utils.showNotification('Out of water! Buy more from the shop.', 'error');
            return false;
        }

        const success = this.garden.waterPlant();
        if (success) {
            // Deduct water
            this.gameState.water--;
            
            // Update UI
            this.updateUI();
            
            return true;
        }

        return false;
    }

    // Harvest plant action
    harvestPlant() {
        if (!this.garden) return false;

        const harvest = this.garden.harvestPlant();
        if (harvest) {
            // Add coins
            this.gameState.coins += harvest.value;
            
            // Add experience
            this.addExperience(harvest.experience);
            
            // Update UI
            this.updateUI();
            
            return true;
        }

        return false;
    }

    // Open shop
    openShop() {
        if (this.shop) {
            this.shop.openShop();
        }
    }

    // Close shop
    closeShop() {
        if (this.shop) {
            this.shop.closeShop();
        }
    }

    // Add experience and handle level up
    addExperience(amount) {
        this.gameState.experience += amount;
        
        const requiredXP = Utils.getExperienceForLevel(this.gameState.level);
        if (this.gameState.experience >= requiredXP) {
            this.levelUp();
        }
    }

    // Level up
    levelUp() {
        this.gameState.level++;
        this.gameState.experience = 0;
        
        // Show level up animation
        if (this.ui) {
            this.ui.showLevelUpAnimation(this.gameState.level);
        }
        
        // Check for unlocks
        this.checkUnlocks();
        
        // Play sound
        soundSystem.play('level_up');
        
        Utils.showNotification(`Level Up! You are now level ${this.gameState.level}! 🎉`, 'achievement');
    }

    // Check for unlocks at current level
    checkUnlocks() {
        const level = this.gameState.level;
        const unlocks = Object.entries(PLANTS)
            .filter(([_, data]) => data.unlockLevel === level)
            .map(([_, data]) => data.name);
            
        if (unlocks.length > 0) {
            const message = `New plants unlocked: ${unlocks.join(', ')}! 🌟`;
            Utils.showNotification(message, 'achievement');
        }
    }

    // Update UI elements
    updateUI() {
        // Update coins
        const coinsElement = Utils.$('#coins');
        if (coinsElement) {
            coinsElement.textContent = Utils.formatNumber(this.gameState.coins);
        }

        // Update water
        const waterElement = Utils.$('#water');
        if (waterElement) {
            waterElement.textContent = this.gameState.water;
        }

        // Update level
        const levelElement = Utils.$('#level');
        if (levelElement) {
            levelElement.textContent = this.gameState.level;
        }

        // Update garden stats
        if (this.garden) {
            this.garden.updateActionButtons();
            this.garden.updateAllPlotVisuals();
        }

        // Update shop if open
        if (this.shop && this.shop.isOpen) {
            this.shop.updateShopItems();
        }
    }

    // Start auto-save
    startAutoSave() {
        this.saveInterval = setInterval(() => {
            this.saveGame();
        }, 60000); // Save every minute
    }

    // Stop auto-save
    stopAutoSave() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
    }

    // Start water refill
    startWaterRefill() {
        setInterval(() => {
            if (this.gameState.water < 10) {
                this.gameState.water++;
                this.updateUI();
                
                if (this.gameState.water === 10) {
                    Utils.showNotification('Water supply refilled! 💧', 'info');
                }
            }
        }, 30000); // Refill one water every 30 seconds
    }

    // Clean up resources
    destroy() {
        this.stopAutoSave();
        
        if (this.garden) {
            this.garden.destroy();
        }
        
        if (this.ui) {
            this.ui.destroy();
        }
        
        if (this.shop) {
            this.shop.destroy();
        }
    }

    hasSeeds(seedType) {
        if (!this.gameState || !this.gameState.inventory) return false;
        return (this.gameState.inventory[seedType] || 0) > 0;
    }
}

export default Game; 