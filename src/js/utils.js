/**
 * Utility functions for the Garden Paradise game
 */

// DOM Utilities
const Utils = {
    // DOM element selection with error handling
    $(selector) {
        try {
            if (!selector || typeof selector !== 'string') {
                console.warn('Invalid selector provided to Utils.$:', selector);
                return null;
            }
            return document.querySelector(selector);
        } catch (error) {
            console.warn('DOM query failed for selector:', selector, error);
            return null;
        }
    },

    $$(selector) {
        return document.querySelectorAll(selector);
    },

    // Element creation
    createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    // Local Storage utilities
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },

    loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return defaultValue;
        }
    },

    // Time utilities
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        if (seconds < 60) return `${seconds}s`;
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
        
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    },

    // Number utilities
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Random utilities
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Animation utilities
    animate(element, className, duration = 300) {
        return new Promise(resolve => {
            element.classList.add(className);
            setTimeout(() => {
                element.classList.remove(className);
                resolve();
            }, duration);
        });
    },

    // Notification system
    showNotification(message, type = 'success', duration = 3000, soundSystem = null) {
        const notification = this.createElement('div', `notification ${type}`, message);
        const container = this.$('#notifications');
        
        if (container) {
            container.appendChild(notification);
            
            // Play notification sound if sound system is provided
            if (soundSystem) {
                soundSystem.play(type);
            }
            
            // Auto remove after duration
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, duration);
        }
    },

    // Math utilities for game mechanics
    calculateGrowthProgress(plantedTime, growthDuration) {
        const elapsed = Date.now() - plantedTime;
        const progress = Math.min(elapsed / growthDuration, 1);
        return Math.max(0, progress);
    },

    calculateHarvestValue(baseCost, multiplier = 2) {
        const variance = this.randomFloat(0.8, 1.2); // 20% variance
        return Math.floor(baseCost * multiplier * variance);
    },

    // Validation utilities
    isValidPlotIndex(index, gridSize = 36) {
        return index >= 0 && index < gridSize;
    },

    // Color utilities
    getPlantStateColor(state) {
        const colors = {
            empty: '#8B4513',
            planted: '#228B22',
            growing: '#32CD32',
            mature: '#FFD700',
            harvestable: '#FF6347',
            needsWater: '#D2691E'
        };
        return colors[state] || colors.empty;
    },

    getRarityColor(rarity) {
        const colors = {
            common: '#4CAF50',
            uncommon: '#2196F3',
            rare: '#9C27B0',
            epic: '#FF9800',
            legendary: '#FFD700'
        };
        return colors[rarity] || colors.common;
    },

    // Debounce function for performance
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Feature detection
    hasLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    },

    // Touch/mobile detection
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Game state utilities
    createGameState() {
        return {
            coins: 50,
            water: 10,
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            inventory: {
                lettuce: 5,
                tomato: 0,
                carrot: 0,
                strawberry: 0,
                apple: 0
            },
            garden: null,
            lastWaterRefill: Date.now()
        };
    },

    // Experience utilities
    getExperienceForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }
};

export default Utils; 