/**
 * Shop system for Garden Paradise
 */

import Utils from './utils.js';
import soundSystem from './sounds.js';
import { PLANTS } from './plants.js';

export class Shop {
    constructor(game) {
        this.game = game;
        this.isOpen = false;
        this.selectedCategory = 'all';
        this.shopItems = [];
        this.resourceItems = [
            {
                id: 'water_small',
                name: 'Small Water Can',
                description: 'Refill your water supply (+10 water)',
                price: 50,
                waterAmount: 10,
                icon: '💧'
            },
            {
                id: 'water_medium',
                name: 'Medium Water Tank',
                description: 'Refill your water supply (+25 water)',
                price: 100,
                waterAmount: 25,
                icon: '🚰'
            },
            {
                id: 'water_large',
                name: 'Large Water Tank',
                description: 'Refill your water supply (+50 water)',
                price: 175,
                waterAmount: 50,
                icon: '⛲'
            }
        ];
        
        this.init();
    }

    // Initialize shop system
    init() {
        try {
            this.setupShopModal();
            this.setupEventListeners();
            this.updateShopItems();
            console.log('✅ Shop initialized successfully');
        } catch (error) {
            console.error('❌ Shop initialization failed:', error);
            // Continue with basic functionality
            this.setupBasicShop();
        }
    }

    // Setup basic shop functionality as fallback
    setupBasicShop() {
        console.log('Setting up basic shop functionality...');
        const shopBtn = Utils.$('#shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                Utils.showNotification('Shop functionality is limited due to initialization errors', 'warning');
            });
        }
    }

    // Set up shop modal
    setupShopModal() {
        const modal = Utils.$('#shop-modal');
        if (!modal) return;

        // Add category tabs
        this.addCategoryTabs();
        
        // Add search functionality
        this.addSearchBar();
        
        // Add inventory display
        this.addInventoryDisplay();
    }

    // Add category tabs to shop
    addCategoryTabs() {
        const modalHeader = Utils.$('#shop-modal .modal-header');
        if (!modalHeader) return;

        const tabContainer = Utils.createElement('div', 'shop-tabs');
        const categories = [
            { id: 'all', name: 'All', icon: '🌟' },
            { id: 'resources', name: 'Resources', icon: '💧' },
            { id: 'vegetable', name: 'Vegetables', icon: '🥬' },
            { id: 'fruit', name: 'Fruits', icon: '🍅' },
            { id: 'tree', name: 'Trees', icon: '🌳' },
            { id: 'special', name: 'Special', icon: '✨' }
        ];

        categories.forEach(category => {
            const tab = Utils.createElement('button', 'shop-tab', `${category.icon} ${category.name}`);
            tab.dataset.category = category.id;
            
            if (category.id === this.selectedCategory) {
                tab.classList.add('active');
            }
            
            tab.addEventListener('click', () => this.selectCategory(category.id));
            tabContainer.appendChild(tab);
        });

        modalHeader.appendChild(tabContainer);
    }

    // Add search bar
    addSearchBar() {
        const modalBody = Utils.$('#shop-modal .modal-body');
        if (!modalBody) return;

        const searchContainer = Utils.createElement('div', 'shop-search');
        searchContainer.innerHTML = `
            <input type="text" id="shop-search-input" placeholder="🔍 Search plants..." />
            <div class="shop-filters">
                <label>
                    <input type="checkbox" id="affordable-only" /> 
                    💰 Affordable only
                </label>
                <label>
                    <input type="checkbox" id="unlocked-only" checked /> 
                    🔓 Unlocked only
                </label>
            </div>
        `;

        modalBody.insertBefore(searchContainer, modalBody.firstChild);

        // Add search functionality
        const searchInput = Utils.$('#shop-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                this.updateShopItems();
            }, 300));
        }

        // Add filter functionality
        const filters = Utils.$$('#affordable-only, #unlocked-only');
        filters.forEach(filter => {
            filter.addEventListener('change', () => this.updateShopItems());
        });
    }

    // Add inventory display
    addInventoryDisplay() {
        const modalBody = Utils.$('#shop-modal .modal-body');
        if (!modalBody) return;

        const inventoryContainer = Utils.createElement('div', 'shop-inventory');
        inventoryContainer.innerHTML = `
            <h3>Your Seeds 🌰</h3>
            <div id="shop-inventory-items" class="inventory-grid"></div>
        `;

        modalBody.appendChild(inventoryContainer);
        this.updateInventoryDisplay();
    }

    // Set up event listeners
    setupEventListeners() {
        // Shop open/close
        const shopBtn = Utils.$('#shop-btn');
        const closeBtn = Utils.$('#close-shop');
        const modal = Utils.$('#shop-modal');

        if (shopBtn) {
            shopBtn.addEventListener('click', () => this.openShop());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeShop());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeShop();
                }
            });
        }
    }

    // Open shop
    openShop() {
        const modal = Utils.$('#shop-modal');
        if (!modal) return;

        this.isOpen = true;
        modal.classList.remove('hidden');
        this.updateShopItems();
        this.updateInventoryDisplay();
        
        soundSystem.play('shop_open');
        
        // Focus search input
        const searchInput = Utils.$('#shop-search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Close shop
    closeShop() {
        const modal = Utils.$('#shop-modal');
        if (!modal) return;

        this.isOpen = false;
        modal.classList.add('hidden');
        soundSystem.play('shop_close');
    }

    // Select category
    selectCategory(categoryId) {
        const tabs = Utils.$$('.shop-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === categoryId);
        });

        this.selectedCategory = categoryId;
        this.updateShopItems();
        soundSystem.play('click');
    }

    // Update shop items
    updateShopItems() {
        const shopItems = Utils.$('#shop-items');
        if (!shopItems) return;

        shopItems.innerHTML = '';

        // Add resource items if in resources category
        if (this.selectedCategory === 'all' || this.selectedCategory === 'resources') {
            this.resourceItems.forEach(resourceData => {
                const resourceItem = this.createResourceItem(resourceData);
                shopItems.appendChild(resourceItem);
            });
        }

        // Add plant items
        const filteredPlants = this.getFilteredPlants();
        Object.entries(filteredPlants).forEach(([type, plantData]) => {
            const shopItem = this.createShopItem(type, plantData);
            shopItems.appendChild(shopItem);
        });

        // Show message if no items
        if (shopItems.children.length === 0) {
            shopItems.innerHTML = '<div class="no-items">No items found</div>';
        }
    }

    // Get filtered plants based on search and category
    getFilteredPlants() {
        const searchInput = Utils.$('#shop-search-input');
        const affordableOnly = Utils.$('#affordable-only');
        const unlockedOnly = Utils.$('#unlocked-only');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const onlyAffordable = affordableOnly ? affordableOnly.checked : false;
        const onlyUnlocked = unlockedOnly ? unlockedOnly.checked : true;
        
        return Object.entries(PLANTS)
            .filter(([type, data]) => {
                // Category filter
                if (this.selectedCategory !== 'all' && 
                    this.selectedCategory !== 'resources' && 
                    data.category !== this.selectedCategory) {
                    return false;
                }
                
                // Search filter
                if (searchTerm && !data.name.toLowerCase().includes(searchTerm) && 
                    !data.description.toLowerCase().includes(searchTerm)) {
                    return false;
                }
                
                // Affordable filter
                if (onlyAffordable && data.cost > this.game.gameState.coins) {
                    return false;
                }
                
                // Level unlock filter
                if (onlyUnlocked && data.unlockLevel > this.game.gameState.level) {
                    return false;
                }
                
                return true;
            })
            .reduce((acc, [type, data]) => {
                acc[type] = data;
                return acc;
            }, {});
    }

    // Create shop item
    createShopItem(type, plantData) {
        const item = Utils.createElement('div', 'shop-item');
        const canAfford = this.game.gameState.coins >= plantData.cost;
        const isUnlocked = plantData.unlockLevel <= this.game.gameState.level;
        // Use image if available, otherwise fallback to icon
        let imageHTML = '';
        if (plantData.image) {
            imageHTML = `<img class="item-image" src="${plantData.image}" alt="${plantData.name}">`;
        } else {
            imageHTML = `<span class="item-icon">${plantData.icons.seed}</span>`;
        }
        item.innerHTML = `
            <div class="item-header">
                ${imageHTML}
                <span class="item-name">${plantData.name}</span>
                <span class="item-rarity" style="color: ${Utils.getRarityColor(plantData.rarity)}">${plantData.rarity}</span>
            </div>
            <div class="item-description">${plantData.description}</div>
            <div class="item-stats">
                <div class="stat">
                    <span class="stat-label">Growth:</span>
                    <span class="stat-value">${Utils.formatTime(plantData.growthTime)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Water:</span>
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
            <div class="item-price">
                <span class="price-label">Price:</span>
                <span class="price-value ${canAfford ? 'affordable' : 'expensive'}">${plantData.cost} coins</span>
            </div>
            ${!isUnlocked ? `
                <div class="item-locked">
                    <span class="lock-icon">🔒</span>
                    <span>Unlocks at level ${plantData.unlockLevel}</span>
                </div>
            ` : ''}
            <div class="item-tip">💡 ${plantData.tips}</div>
            <button class="buy-btn" ${!canAfford ? 'disabled' : ''}>
                Buy Seed
            </button>
        `;
        // Make the entire item clickable to buy if affordable and unlocked
        const buyAction = () => {
            if (canAfford && isUnlocked) {
                this.purchaseItem(type, plantData);
            }
        };
        item.addEventListener('click', (e) => {
            // Prevent double trigger if buy button is clicked
            if (e.target.classList.contains('buy-btn')) return;
            buyAction();
        });
        // Still allow buy button for accessibility
        const buyBtn = item.querySelector('.buy-btn');
        if (buyBtn && !buyBtn.disabled) {
            buyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                buyAction();
            });
        }
        return item;
    }

    // Purchase item
    purchaseItem(type, plantData) {
        if (!this.canPurchase(plantData)) return;

        // Deduct cost
        this.game.gameState.coins -= plantData.cost;
        
        // Add to inventory
        this.addToInventory(type);
        
        // Show animation and play sound
        this.showPurchaseAnimation(plantData);
        soundSystem.play('purchase');
        
        // Update displays
        this.updateShopItems();
        this.updateInventoryDisplay();
        this.game.updateUI();
        
        Utils.showNotification(`Bought ${plantData.name} seed! 🌱`, 'success');
    }

    // Check if can purchase
    canPurchase(plantData) {
        return this.game.gameState.coins >= plantData.cost &&
               plantData.unlockLevel <= this.game.gameState.level;
    }

    // Add to inventory
    addToInventory(seedType, quantity = 1) {
        const inventory = this.game.gameState.inventory;
        inventory[seedType] = (inventory[seedType] || 0) + quantity;
    }

    // Update inventory display
    updateInventoryDisplay() {
        const inventoryContainer = Utils.$('#shop-inventory-items');
        if (!inventoryContainer) return;

        inventoryContainer.innerHTML = '';
        
        const inventory = this.game.gameState.inventory;
        Object.entries(inventory).forEach(([seedType, quantity]) => {
            if (quantity > 0) {
                const plantData = PLANTS[seedType];
                if (plantData) {
                    const item = this.createInventoryItem(seedType, quantity, plantData);
                    inventoryContainer.appendChild(item);
                }
            }
        });

        if (inventoryContainer.children.length === 0) {
            inventoryContainer.innerHTML = '<div class="no-items">No seeds in inventory</div>';
        }
    }

    // Create inventory item
    createInventoryItem(seedType, quantity, plantData) {
        const item = Utils.createElement('div', 'inventory-item');
        item.innerHTML = `
            <div class="item-icon">${plantData.icons.seed}</div>
            <div class="item-info">
                <div class="item-name">${plantData.name}</div>
                <div class="item-quantity">Quantity: ${quantity}</div>
            </div>
        `;
        
        // Add tooltip
        item.title = `${plantData.name}\nValue: ${plantData.harvestValue} coins\nGrowth: ${Utils.formatTime(plantData.growthTime)}`;
        
        return item;
    }

    // Show purchase animation
    showPurchaseAnimation(plantData) {
        const shopContainer = Utils.$('#shop-modal .modal-content');
        if (!shopContainer) return;

        const animation = Utils.createElement('div', 'purchase-animation');
        animation.innerHTML = `
            <div class="purchase-icon">${plantData.icons.seed}</div>
            <div class="purchase-sparkles">✨</div>
        `;

        shopContainer.appendChild(animation);
        setTimeout(() => animation.remove(), 1000);
    }

    // Create resource item
    createResourceItem(resourceData) {
        const item = Utils.createElement('div', 'shop-item resource-item');
        const canAfford = this.game.gameState.coins >= resourceData.price;
        
        item.innerHTML = `
            <div class="item-header">
                <span class="item-icon">${resourceData.icon}</span>
                <span class="item-name">${resourceData.name}</span>
                <span class="item-type">Resource</span>
            </div>
            <div class="item-description">${resourceData.description}</div>
            <div class="item-stats">
                <div class="stat">
                    <span class="stat-label">Water:</span>
                    <span class="stat-value">+${resourceData.waterAmount}</span>
                </div>
            </div>
            <div class="item-price">
                <span class="price-label">Price:</span>
                <span class="price-value ${canAfford ? 'affordable' : 'expensive'}">${resourceData.price} coins</span>
            </div>
            <button class="buy-btn" ${!canAfford ? 'disabled' : ''}>
                Buy Water
            </button>
        `;

        // Add click handler
        const buyBtn = item.querySelector('.buy-btn');
        if (buyBtn && !buyBtn.disabled) {
            buyBtn.addEventListener('click', () => this.purchaseResource(resourceData));
        }

        return item;
    }

    // Purchase resource
    purchaseResource(resourceData) {
        if (this.game.gameState.coins < resourceData.price) {
            Utils.showNotification('Not enough coins!', 'error');
            return;
        }

        // Deduct cost
        this.game.gameState.coins -= resourceData.price;
        
        // Add water
        this.game.gameState.water += resourceData.waterAmount;
        
        // Play sound and show animation
        soundSystem.play('purchase');
        this.showPurchaseAnimation(resourceData);
        
        // Update UI
        this.updateShopItems();
        this.game.updateUI();
        
        Utils.showNotification(`Bought ${resourceData.name}! +${resourceData.waterAmount} water 💧`, 'success');
    }

    // Clean up resources
    destroy() {
        const modal = Utils.$('#shop-modal');
        if (modal) {
            modal.remove();
        }
    }
}

export default Shop; 