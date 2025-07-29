/**
 * Main entry point for Garden Paradise
 */

import { Game } from './game.js';
import Utils from './utils.js';
import soundSystem from './sounds.js';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize sound system
        soundSystem.init();
        
        // Create game instance
        window.game = new Game();
        
        // Start water refill
        window.game.startWaterRefill();
        
        // Set up shop close button
        const closeShopBtn = Utils.$('#close-shop');
        if (closeShopBtn) {
            closeShopBtn.addEventListener('click', () => {
                if (window.game.shop) {
                    window.game.shop.closeShop();
                }
            });
        }
        
        console.log('🌱 Garden Paradise initialized successfully!');
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        Utils.showNotification('Failed to start game. Please refresh the page.', 'error');
    }
}); 