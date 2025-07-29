/**
 * UI management system for Garden Paradise
 */

import Utils from './utils.js';
import soundSystem from './sounds.js';
import { PLANTS } from './plants.js';

export class UI {
    constructor(game) {
        this.game = game;
        this.notifications = [];
        this.currentTooltip = null;
        this.statusLegendVisible = true;
        
        this.setupSettingsModal();
        this.init();
    }

    // Initialize UI system
    init() {
        try {
            this.setupTooltips();
            this.setupKeyboardShortcuts();
            this.setupNotificationSystem();
            this.createStatusLegend();
            this.updateStatusBar();
            console.log('✅ UI initialized successfully');
        } catch (error) {
            console.error('❌ UI initialization failed:', error);
            // Continue without UI enhancements
            Utils.showNotification('Some UI features may not work properly', 'warning');
        }
    }

    // Set up tooltip system
    setupTooltips() {
        // Add tooltips to buttons
        this.addTooltip('#plant-btn', 'Plant a seed in the selected plot (Spacebar)');
        this.addTooltip('#water-btn', 'Water the selected plant (W)');
        this.addTooltip('#harvest-btn', 'Harvest the selected plant (H)');
        this.addTooltip('#shop-btn', 'Open the shop to buy seeds (S)');

        // Add tooltips to status items
        this.addTooltip('#coins', 'Your current coins - earn more by harvesting plants');
        this.addTooltip('#water', 'Water supply - refills automatically over time');
        this.addTooltip('#level', 'Your current level - gain XP to unlock new plants');
        this.addTooltip('#weather', 'Current weather conditions');
    }

    // Add tooltip to element
    addTooltip(selector, text) {
        const element = Utils.$(selector);
        if (!element) return;

        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e.target, text);
        });

        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    // Show tooltip
    showTooltip(element, text) {
        this.hideTooltip(); // Hide any existing tooltip

        const tooltip = Utils.createElement('div', 'tooltip', text);
        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        // Show tooltip
        setTimeout(() => tooltip.classList.add('show'), 10);

        this.currentTooltip = tooltip;
    }

    // Hide tooltip
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    // Set up keyboard shortcuts display
    setupKeyboardShortcuts() {
        // Add keyboard shortcut hints to buttons
        const shortcuts = {
            '#plant-btn': 'SPACE',
            '#water-btn': 'W',
            '#harvest-btn': 'H',
            '#shop-btn': 'S'
        };

        Object.entries(shortcuts).forEach(([selector, key]) => {
            const button = Utils.$(selector);
            if (button) {
                const keySpan = Utils.createElement('span', 'keyboard-shortcut', `(${key})`);
                button.appendChild(keySpan);
            }
        });
    }

    // Set up notification system
    setupNotificationSystem() {
        // Create notifications container if it doesn't exist
        let container = Utils.$('#notifications');
        if (!container) {
            container = Utils.createElement('div', '', '');
            container.id = 'notifications';
            document.body.appendChild(container);
        }
    }

    // Enhanced notification system
    showNotification(message, type = 'success', duration = 3000, options = {}) {
        const notification = Utils.createElement('div', `notification ${type}`);
        
        // Add icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️',
            achievement: '🏆'
        };

        const icon = icons[type] || '💬';
        notification.innerHTML = `${icon} ${message}`;

        // Add special styling for achievements
        if (type === 'achievement') {
            notification.classList.add('achievement-notification');
        }

        const container = Utils.$('#notifications');
        if (container) {
            container.appendChild(notification);

            // Play appropriate sound
            soundSystem.play(type);

            // Add entrance animation
            Utils.animate(notification, 'slideIn', 300);

            // Auto remove after duration
            setTimeout(() => {
                if (notification.parentNode) {
                    Utils.animate(notification, 'fadeOut', 200).then(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    });
                }
            }, duration);
        }

        // Track notification
        this.notifications.push({
            message,
            type,
            timestamp: Date.now()
        });
    }

    // Update status bar
    updateStatusBar() {
        if (!this.game || !this.game.gameState) return;

        const state = this.game.gameState;
        
        // Update coins with animation on change
        const coinsElement = Utils.$('#coins');
        if (coinsElement) {
            const oldValue = parseInt(coinsElement.textContent.replace(/[^\d]/g, '')) || 0;
            const newValue = state.coins;
            
            coinsElement.textContent = Utils.formatNumber(newValue);
            
            if (newValue > oldValue) {
                const statusItem = coinsElement.closest('.status-item');
                if (statusItem) {
                    statusItem.classList.add('animate-increase');
                    soundSystem.play('coin');
                    setTimeout(() => statusItem.classList.remove('animate-increase'), 500);
                }
            } else if (newValue < oldValue) {
                const statusItem = coinsElement.closest('.status-item');
                if (statusItem) {
                    statusItem.classList.add('animate-decrease');
                    soundSystem.play('spend');
                    setTimeout(() => statusItem.classList.remove('animate-decrease'), 500);
                }
            }
        }

        // Update water with visual indicator
        const waterElement = Utils.$('#water');
        if (waterElement) {
            const oldValue = parseInt(waterElement.textContent) || 0;
            const newValue = state.water;
            
            waterElement.textContent = newValue;
            
            if (newValue > oldValue) {
                const statusItem = waterElement.closest('.status-item');
                if (statusItem) {
                    statusItem.classList.add('animate-increase');
                    setTimeout(() => statusItem.classList.remove('animate-increase'), 500);
                }
            } else if (newValue < oldValue) {
                const statusItem = waterElement.closest('.status-item');
                if (statusItem) {
                    statusItem.classList.add('animate-decrease');
                    setTimeout(() => statusItem.classList.remove('animate-decrease'), 500);
                }
            }
        }

        // Update level and experience
        const levelElement = Utils.$('#level');
        if (levelElement) {
            levelElement.textContent = state.level;
        }

        // Update experience bar
        this.updateExperienceBar();
    }

    // Update experience bar
    updateExperienceBar() {
        const state = this.game.gameState;
        const currentLevel = state.level;
        const currentXP = state.experience;
        const requiredXP = Utils.getExperienceForLevel(currentLevel);
        
        const progressBar = Utils.$('#experience-bar');
        if (progressBar) {
            const progress = (currentXP / requiredXP) * 100;
            progressBar.style.width = `${Math.min(100, progress)}%`;
            progressBar.title = `${currentXP}/${requiredXP} XP`;
        }
    }

    // Show level up animation
    showLevelUpAnimation(newLevel) {
        const container = Utils.$('#game-container');
        if (!container) return;

        // Create level up overlay
        const overlay = Utils.createElement('div', 'level-up-overlay');
        container.appendChild(overlay);

        // Create level up message
        const message = Utils.createElement('div', 'level-up-message');
        message.innerHTML = `
            <div class="level-up-title">🎉 LEVEL UP! 🎉</div>
            <div class="level-up-level">Level ${newLevel}</div>
        `;
        overlay.appendChild(message);

        // Add particle effects
        this.createParticleEffect(overlay);

        // Play level up sound
        soundSystem.play('level_up');

        // Remove after animation
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 1000);
        }, 2000);
    }

    // Create particle effect
    createParticleEffect(container) {
        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#4169E1'];
        
        for (let i = 0; i < 50; i++) {
            const particle = Utils.createElement('div', 'particle');
            particle.style.backgroundColor = Utils.randomChoice(colors);
            particle.style.left = Utils.random(0, 100) + '%';
            particle.style.animationDelay = Utils.random(0, 1000) + 'ms';
            particle.style.animationDuration = Utils.random(1000, 2000) + 'ms';
            container.appendChild(particle);
        }
    }

    // Show plant info tooltip
    showPlantInfo(plant) {
        if (!plant) return;

        const plantData = PLANTS[plant.type];
        if (!plantData) return;

        const info = Utils.createElement('div', 'plant-info');
        info.innerHTML = `
            <div class="plant-info-header">
                <span class="plant-icon">${plantData.icons.mature}</span>
                <span class="plant-name">${plantData.name}</span>
                <span class="plant-rarity" style="color: ${Utils.getRarityColor(plantData.rarity)}">${plantData.rarity}</span>
            </div>
            <div class="plant-description">${plantData.description}</div>
            <div class="plant-stats">
                <div class="stat">
                    <span class="stat-label">Growth:</span>
                    <span class="stat-value">${Utils.formatTime(plantData.growthTime)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Water Needs:</span>
                    <span class="stat-value">${Utils.formatTime(plantData.waterInterval)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Value:</span>
                    <span class="stat-value">${plantData.harvestValue} coins</span>
                </div>
                <div class="stat">
                    <span class="stat-label">XP:</span>
                    <span class="stat-value">${plantData.experience}</span>
                </div>
            </div>
            <div class="plant-tip">💡 ${plantData.tips}</div>
        `;

        const container = Utils.$('#game-container');
        if (container) {
            container.appendChild(info);
            setTimeout(() => info.classList.add('show'), 10);
            setTimeout(() => {
                info.classList.remove('show');
                setTimeout(() => info.remove(), 300);
            }, 3000);
        }
    }

    // Update garden statistics
    updateGardenStats() {
        if (!this.game || !this.game.garden) return;

        const stats = this.game.garden.getStatistics();
        const container = Utils.$('#garden-stats');
        
        if (!container) return;

        container.innerHTML = `
            <div class="stat-item">
                <span class="stat-icon">🌱</span>
                <span class="stat-label">Plants:</span>
                <span class="stat-value">${stats.totalPlants}</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">✨</span>
                <span class="stat-label">Ready:</span>
                <span class="stat-value">${stats.readyToHarvest}</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">💧</span>
                <span class="stat-label">Thirsty:</span>
                <span class="stat-value">${stats.needWater}</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">⬜</span>
                <span class="stat-label">Empty:</span>
                <span class="stat-value">${stats.empty}</span>
            </div>
        `;
    }

    // Create status legend
    createStatusLegend() {
        const legend = Utils.createElement('div', 'status-legend');
        legend.innerHTML = `
            <div class="legend-header">
                <span class="legend-title">Plant Status</span>
                <button class="legend-toggle" title="Toggle Legend">❔</button>
            </div>
            <div class="legend-content">
                <div class="legend-item">
                    <span class="legend-icon">🌱</span>
                    <span class="legend-text">Growing</span>
                </div>
                <div class="legend-item">
                    <span class="legend-icon">💧</span>
                    <span class="legend-text">Needs Water</span>
                </div>
                <div class="legend-item">
                    <span class="legend-icon">✨</span>
                    <span class="legend-text">Ready for Harvest</span>
                </div>
                <div class="legend-item">
                    <span class="legend-icon">⭐</span>
                    <span class="legend-text">Fertilized</span>
                </div>
            </div>
        `;

        document.body.appendChild(legend);

        // Add toggle functionality
        const toggleBtn = legend.querySelector('.legend-toggle');
        const content = legend.querySelector('.legend-content');
        
        if (toggleBtn && content) {
            toggleBtn.addEventListener('click', () => {
                this.statusLegendVisible = !this.statusLegendVisible;
                content.style.display = this.statusLegendVisible ? 'block' : 'none';
                toggleBtn.textContent = this.statusLegendVisible ? '❌' : '❔';
                toggleBtn.title = this.statusLegendVisible ? 'Hide Legend' : 'Show Legend';
                soundSystem.play('click');
            });
        }
    }

    // Clean up resources
    destroy() {
        this.hideTooltip();
        const legend = document.querySelector('.status-legend');
        if (legend) {
            legend.remove();
        }
    }

    setupSettingsModal() {
        const settingsBtn = Utils.$('#settings-btn');
        const settingsModal = Utils.$('#settings-modal');
        const closeSettings = Utils.$('#close-settings');
        const soundForm = Utils.$('#sound-settings-form');
        if (!settingsBtn || !settingsModal || !closeSettings || !soundForm) return;

        // Open modal
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            // Sync checkboxes with current sound prefs
            Array.from(soundForm.elements).forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = soundSystem.isSoundEnabled(input.name);
                }
            });
        });
        // Close modal
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
        // Update sound prefs on change
        soundForm.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                soundSystem.setSoundEnabled(e.target.name, e.target.checked);
            }
        });
    }
}

export default UI; 