/**
 * Garden management system for Garden Paradise
 */

import Utils from './utils.js';
import { Plant, PLANTS } from './plants.js';
import soundSystem from './sounds.js';

export class Garden {
    constructor(size = 6) {
        this.size = size;
        this.plots = new Array(size * size).fill(null);
        this.selectedPlot = -1;
        this.element = null;
        this.updateInterval = null;
        
        this.initializeDOM();
        this.startUpdateLoop();
    }

    // Initialize the garden DOM
    initializeDOM() {
        const container = Utils.$('#garden-grid');
        if (!container) {
            console.error('Garden grid element not found! Creating fallback...');
            this.createFallbackElement();
            return;
        }

        this.element = container;
        this.renderGrid();
        this.attachEventListeners();
    }

    // Create fallback garden element if missing
    createFallbackElement() {
        console.log('Creating fallback garden grid element...');
        const gameContainer = document.querySelector('.game-container') || document.body;
        const fallbackGrid = document.createElement('div');
        fallbackGrid.id = 'garden-grid';
        fallbackGrid.className = 'garden-grid';
        fallbackGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 4px;
            max-width: 400px;
            margin: 20px auto;
            padding: 10px;
            background: #8BC34A;
            border-radius: 8px;
        `;
        gameContainer.appendChild(fallbackGrid);
        this.element = fallbackGrid;
        this.renderGrid();
        this.attachEventListeners();
        console.log('Fallback garden grid created successfully');
    }

    // Render the garden grid
    renderGrid() {
        if (!this.element) return;

        this.element.innerHTML = '';
        this.element.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.element.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;

        for (let i = 0; i < this.plots.length; i++) {
            const plotElement = this.createPlotElement(i);
            this.element.appendChild(plotElement);
        }
    }

    // Create individual plot element
    createPlotElement(index) {
        const plot = Utils.createElement('div', 'garden-plot empty', '');
        plot.dataset.plotIndex = index;
        
        this.updatePlotVisual(plot, index);
        return plot;
    }

    // Update plot visual representation
    updatePlotVisual(plotElement, index) {
        const plant = this.plots[index];
        
        // Clear existing classes
        plotElement.className = 'garden-plot';
        
        if (plant) {
            // Add plant-specific classes
            plotElement.classList.add('planted');
            plotElement.classList.add(...plant.getStateClasses().split(' '));
            
            // Set plant icon
            plotElement.innerHTML = plant.getIcon();
            
            // Add growth progress bar
            this.addProgressBar(plotElement, plant);
            
            // Add status indicators
            this.addStatusIndicators(plotElement, plant);
        } else {
            plotElement.classList.add('empty');
            plotElement.innerHTML = '';
        }

        // Handle selection
        if (index === this.selectedPlot) {
            plotElement.classList.add('selected');
        }
    }

    // Add growth progress bar to plot
    addProgressBar(plotElement, plant) {
        const existingProgress = plotElement.querySelector('.growth-progress');
        if (existingProgress) {
            existingProgress.remove();
        }

        if (plant.getGrowthStage() !== 'harvestable') {
            const progressContainer = Utils.createElement('div', 'growth-progress');
            const progressBar = Utils.createElement('div', 'progress-bar');
            
            const progress = plant.getGrowthProgress() * 100;
            progressBar.style.width = `${progress}%`;
            
            progressContainer.appendChild(progressBar);
            plotElement.appendChild(progressContainer);
        }
    }

    // Add status indicators
    addStatusIndicators(plotElement, plant) {
        const existingStatus = plotElement.querySelector('.plot-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        let statusIcon = '';
        let statusClass = '';

        if (plant.isHarvestable()) {
            statusIcon = '✨';
            statusClass = 'ready-harvest';
        } else if (plant.needsWater()) {
            statusIcon = '💧';
            statusClass = 'water-needed';
        } else if (plant.fertilized) {
            statusIcon = '⭐';
            statusClass = 'fertilized';
        }

        if (statusIcon) {
            const statusElement = Utils.createElement('div', `plot-status ${statusClass}`, statusIcon);
            plotElement.appendChild(statusElement);
        }
    }

    // Attach event listeners
    attachEventListeners() {
        if (!this.element) return;

        this.element.addEventListener('click', (e) => {
            const plotElement = e.target.closest('.garden-plot');
            if (plotElement) {
                const index = parseInt(plotElement.dataset.plotIndex);
                this.selectPlot(index);
            }
        });
    }

    // Select a plot
    selectPlot(index) {
        if (!Utils.isValidPlotIndex(index, this.plots.length)) return;

        this.selectedPlot = index;
        this.updateAllPlotVisuals();
        this.updateActionButtons();
        
        soundSystem.play('select');
    }

    // Get selected plot
    getSelectedPlot() {
        return this.selectedPlot >= 0 ? this.selectedPlot : null;
    }

    // Get plant at selected plot
    getSelectedPlant() {
        const plotIndex = this.getSelectedPlot();
        return plotIndex !== null ? this.plots[plotIndex] : null;
    }

    // Plant a seed
    plantSeed(seedType) {
        const plotIndex = this.getSelectedPlot();
        if (plotIndex === null) {
            Utils.showNotification('Please select a plot first!', 'error');
            return false;
        }

        if (this.plots[plotIndex] !== null) {
            Utils.showNotification('Plot is already occupied!', 'error');
            return false;
        }

        if (!PLANTS[seedType]) {
            Utils.showNotification('Invalid seed type!', 'error');
            return false;
        }

        try {
            this.plots[plotIndex] = new Plant(seedType, plotIndex);
            this.updatePlotVisual(this.getPlotElement(plotIndex), plotIndex);
            soundSystem.play('plant');
            return true;
        } catch (error) {
            console.error('Failed to plant seed:', error);
            Utils.showNotification('Failed to plant seed!', 'error');
            return false;
        }
    }

    // Water a plant
    waterPlant() {
        const plotIndex = this.getSelectedPlot();
        if (plotIndex === null) {
            Utils.showNotification('Please select a plot first!', 'error');
            return false;
        }

        const plant = this.plots[plotIndex];
        if (!plant) {
            Utils.showNotification('No plant to water!', 'error');
            return false;
        }

        if (!plant.needsWater()) {
            Utils.showNotification('Plant doesn\'t need water!', 'info');
            return false;
        }

        plant.water();
        this.updatePlotVisual(this.getPlotElement(plotIndex), plotIndex);
        soundSystem.play('water');
        return true;
    }

    // Harvest a plant
    harvestPlant() {
        const plotIndex = this.getSelectedPlot();
        if (plotIndex === null) {
            Utils.showNotification('Please select a plot first!', 'error');
            return null;
        }

        const plant = this.plots[plotIndex];
        if (!plant) {
            Utils.showNotification('No plant to harvest!', 'error');
            return null;
        }

        if (!plant.isHarvestable()) {
            Utils.showNotification('Plant is not ready for harvest!', 'error');
            return null;
        }

        const harvest = plant.harvest();
        if (harvest) {
            this.plots[plotIndex] = null;
            this.updatePlotVisual(this.getPlotElement(plotIndex), plotIndex);
            soundSystem.play('harvest');
            return harvest;
        }

        return null;
    }

    // Get plot element by index
    getPlotElement(index) {
        return this.element?.querySelector(`[data-plot-index="${index}"]`);
    }

    // Update all plot visuals
    updateAllPlotVisuals() {
        if (!this.element) return;

        for (let i = 0; i < this.plots.length; i++) {
            const plotElement = this.getPlotElement(i);
            if (plotElement) {
                this.updatePlotVisual(plotElement, i);
            }
        }
    }

    // Update action buttons based on selected plot
    updateActionButtons() {
        const plantBtn = Utils.$('#plant-btn');
        const waterBtn = Utils.$('#water-btn');
        const harvestBtn = Utils.$('#harvest-btn');

        const selectedPlant = this.getSelectedPlant();

        if (plantBtn) {
            plantBtn.disabled = selectedPlant !== null;
        }

        if (waterBtn) {
            waterBtn.disabled = !selectedPlant || !selectedPlant.needsWater();
        }

        if (harvestBtn) {
            harvestBtn.disabled = !selectedPlant || !selectedPlant.isHarvestable();
        }
    }

    // Start update loop for plant status
    startUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            let needsUpdate = false;

            for (let i = 0; i < this.plots.length; i++) {
                const plant = this.plots[i];
                if (plant) {
                    const plotElement = this.getPlotElement(i);
                    if (plotElement) {
                        const oldState = plotElement.className;
                        this.updatePlotVisual(plotElement, i);
                        if (oldState !== plotElement.className) {
                            needsUpdate = true;
                        }
                    }
                }
            }

            if (needsUpdate) {
                this.updateActionButtons();
            }
        }, 1000);
    }

    // Stop update loop
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Get garden statistics
    getStatistics() {
        const stats = {
            totalPlants: 0,
            readyToHarvest: 0,
            needWater: 0,
            empty: 0
        };

        for (const plant of this.plots) {
            if (plant) {
                stats.totalPlants++;
                if (plant.isHarvestable()) stats.readyToHarvest++;
                if (plant.needsWater()) stats.needWater++;
            } else {
                stats.empty++;
            }
        }

        return stats;
    }

    // Save garden state
    save() {
        return {
            size: this.size,
            plots: this.plots.map(plant => plant ? plant.toJSON() : null),
            selectedPlot: this.selectedPlot
        };
    }

    // Load garden state
    load(data) {
        if (!data || !Array.isArray(data.plots)) {
            console.error('Invalid garden data:', data);
            return false;
        }

        try {
            this.size = data.size || 6;
            this.selectedPlot = data.selectedPlot || -1;
            this.plots = data.plots.map(plotData => {
                if (!plotData) return null;
                try {
                    return Plant.fromJSON(plotData);
                } catch (error) {
                    console.warn('Failed to load plant:', error);
                    return null;
                }
            });

            this.renderGrid();
            return true;
        } catch (error) {
            console.error('Failed to load garden:', error);
            return false;
        }
    }

    // Clean up resources
    destroy() {
        this.stopUpdateLoop();
        if (this.element) {
            this.element.innerHTML = '';
            this.element = null;
        }
    }
}

export default Garden; 