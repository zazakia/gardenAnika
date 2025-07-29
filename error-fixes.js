// Garden Paradise - Error Detection & Fixing Script
// This script identifies and fixes common errors in the game

console.log('🔧 Starting Garden Paradise Error Detection & Fixing...');

// Error Detection Functions
class ErrorDetector {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];
    }

    // Check for missing DOM elements
    checkDOMElements() {
        const requiredElements = [
            'garden-grid', 'coins-display', 'water-display', 'level-display',
            'plant-btn', 'water-btn', 'harvest-btn', 'shop-btn',
            'shop-modal', 'shop-items', 'notification-container'
        ];

        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                this.errors.push(`Missing DOM element: #${id}`);
            }
        });
    }

    // Check for undefined variables
    checkGlobalVariables() {
        const requiredGlobals = ['Utils', 'PlantData', 'Plant', 'Garden', 'Game', 'UI', 'Shop'];
        
        requiredGlobals.forEach(varName => {
            if (typeof window[varName] === 'undefined') {
                this.errors.push(`Missing global variable: ${varName}`);
            }
        });
    }

    // Check PlantData integrity
    checkPlantData() {
        if (typeof PlantData === 'undefined') {
            this.errors.push('PlantData is undefined');
            return;
        }

        Object.entries(PlantData).forEach(([key, plant]) => {
            if (!plant.name) this.errors.push(`Plant ${key} missing name`);
            if (!plant.cost || plant.cost <= 0) this.errors.push(`Plant ${key} invalid cost`);
            if (!plant.harvestValue || plant.harvestValue <= 0) this.errors.push(`Plant ${key} invalid harvest value`);
            if (!plant.growthTime || plant.growthTime <= 0) this.errors.push(`Plant ${key} invalid growth time`);
            if (!plant.icons) this.errors.push(`Plant ${key} missing icons`);
            if (plant.cost >= plant.harvestValue) this.warnings.push(`Plant ${key} may not be profitable`);
        });
    }

    // Check function availability
    checkFunctions() {
        const requiredFunctions = [
            'Utils.formatNumber',
            'Utils.formatTime',
            'Utils.createGameState',
            'Utils.saveToStorage',
            'Utils.loadFromStorage'
        ];

        requiredFunctions.forEach(funcPath => {
            const parts = funcPath.split('.');
            let obj = window;
            
            for (const part of parts) {
                if (obj && typeof obj[part] !== 'undefined') {
                    obj = obj[part];
                } else {
                    this.errors.push(`Missing function: ${funcPath}`);
                    break;
                }
            }
        });
    }

    // Check for potential memory leaks
    checkMemoryLeaks() {
        // Check for uncleared intervals
        if (window.gameInstance) {
            if (window.gameInstance.saveInterval) {
                this.warnings.push('Auto-save interval is running');
            }
            if (window.gameInstance.garden && window.gameInstance.garden.updateInterval) {
                this.warnings.push('Garden update interval is running');
            }
        }
    }

    // Run all checks
    runAllChecks() {
        console.log('🔍 Running error detection...');
        
        this.checkGlobalVariables();
        this.checkDOMElements();
        this.checkPlantData();
        this.checkFunctions();
        this.checkMemoryLeaks();

        return {
            errors: this.errors,
            warnings: this.warnings,
            fixes: this.fixes
        };
    }
}

// Error Fixing Functions
class ErrorFixer {
    constructor() {
        this.fixesApplied = [];
    }

    // Fix missing DOM elements
    fixMissingDOMElements(errors) {
        const missingElements = errors.filter(e => e.includes('Missing DOM element'));
        
        missingElements.forEach(error => {
            const id = error.split('#')[1];
            
            // Create missing elements based on ID
            switch(id) {
                case 'notification-container':
                    this.createNotificationContainer();
                    break;
                case 'garden-grid':
                    this.createGardenGrid();
                    break;
                default:
                    console.warn(`Cannot auto-fix missing element: ${id}`);
            }
        });
    }

    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
            this.fixesApplied.push('Created notification container');
        }
    }

    createGardenGrid() {
        if (!document.getElementById('garden-grid')) {
            const grid = document.createElement('div');
            grid.id = 'garden-grid';
            grid.className = 'garden-grid';
            
            // Try to find a container
            const gameContainer = document.querySelector('.game-container') || document.body;
            gameContainer.appendChild(grid);
            this.fixesApplied.push('Created garden grid');
        }
    }

    // Add error handling to existing functions
    addErrorHandling() {
        // Wrap Plant constructor with better error handling
        if (typeof Plant !== 'undefined') {
            const originalPlantConstructor = Plant;
            window.Plant = function(type, plotIndex, plantedTime = Date.now()) {
                try {
                    return new originalPlantConstructor(type, plotIndex, plantedTime);
                } catch (error) {
                    console.error('Plant creation failed:', error);
                    throw new Error(`Failed to create plant: ${error.message}`);
                }
            };
            
            // Copy prototype
            window.Plant.prototype = originalPlantConstructor.prototype;
            window.Plant.fromJSON = originalPlantConstructor.fromJSON;
            
            this.fixesApplied.push('Added error handling to Plant constructor');
        }

        // Add error handling to Utils functions
        if (typeof Utils !== 'undefined') {
            const original$ = Utils.$;
            Utils.$ = function(selector) {
                try {
                    return original$(selector);
                } catch (error) {
                    console.warn(`DOM query failed for selector: ${selector}`, error);
                    return null;
                }
            };
            this.fixesApplied.push('Added error handling to Utils.$');
        }
    }

    // Fix game balance issues
    fixGameBalance() {
        if (typeof PlantData !== 'undefined') {
            Object.entries(PlantData).forEach(([key, plant]) => {
                // Ensure profitable plants
                if (plant.cost >= plant.harvestValue) {
                    plant.harvestValue = Math.ceil(plant.cost * 1.5);
                    this.fixesApplied.push(`Fixed profitability for ${plant.name}`);
                }
                
                // Ensure reasonable growth times
                if (plant.growthTime < 5000) { // Less than 5 seconds
                    plant.growthTime = 5000;
                    this.fixesApplied.push(`Fixed growth time for ${plant.name}`);
                }
            });
        }
    }

    // Apply all fixes
    applyAllFixes(errors, warnings) {
        console.log('🔧 Applying fixes...');
        
        this.fixMissingDOMElements(errors);
        this.addErrorHandling();
        this.fixGameBalance();
        
        return this.fixesApplied;
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
    }

    startTiming(name) {
        this.metrics[name] = { start: performance.now() };
    }

    endTiming(name) {
        if (this.metrics[name]) {
            this.metrics[name].duration = performance.now() - this.metrics[name].start;
        }
    }

    getMetrics() {
        return this.metrics;
    }

    checkPerformance() {
        const issues = [];
        
        Object.entries(this.metrics).forEach(([name, metric]) => {
            if (metric.duration > 100) { // More than 100ms
                issues.push(`${name} took ${metric.duration.toFixed(2)}ms (too slow)`);
            }
        });
        
        return issues;
    }
}

// Main error detection and fixing function
async function detectAndFixErrors() {
    console.log('🚀 Starting comprehensive error detection and fixing...');
    
    const detector = new ErrorDetector();
    const fixer = new ErrorFixer();
    const monitor = new PerformanceMonitor();
    
    // Performance test
    monitor.startTiming('errorDetection');
    const results = detector.runAllChecks();
    monitor.endTiming('errorDetection');
    
    // Apply fixes
    monitor.startTiming('errorFixing');
    const fixes = fixer.applyAllFixes(results.errors, results.warnings);
    monitor.endTiming('errorFixing');
    
    // Performance check
    const performanceIssues = monitor.checkPerformance();
    
    // Generate report
    const report = {
        errors: results.errors,
        warnings: results.warnings,
        fixes: fixes,
        performance: monitor.getMetrics(),
        performanceIssues: performanceIssues,
        timestamp: new Date().toISOString()
    };
    
    console.log('📊 Error Detection & Fixing Report:', report);
    
    // Display results
    displayResults(report);
    
    return report;
}

// Display results in a nice format
function displayResults(report) {
    const resultContainer = document.createElement('div');
    resultContainer.id = 'error-report';
    resultContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        width: 400px;
        max-height: 500px;
        overflow-y: auto;
        background: white;
        border: 2px solid #333;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 12px;
    `;
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0; color: #333;">🔧 Error Report</h3>
            <button onclick="document.body.removeChild(document.getElementById('error-report'))" 
                    style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">✕</button>
        </div>
    `;
    
    // Errors
    if (report.errors.length > 0) {
        html += `<div style="margin: 10px 0;"><strong style="color: #f44336;">❌ Errors (${report.errors.length}):</strong><ul>`;
        report.errors.forEach(error => {
            html += `<li style="color: #d32f2f; margin: 2px 0;">${error}</li>`;
        });
        html += `</ul></div>`;
    }
    
    // Warnings
    if (report.warnings.length > 0) {
        html += `<div style="margin: 10px 0;"><strong style="color: #ff9800;">⚠️ Warnings (${report.warnings.length}):</strong><ul>`;
        report.warnings.forEach(warning => {
            html += `<li style="color: #f57c00; margin: 2px 0;">${warning}</li>`;
        });
        html += `</ul></div>`;
    }
    
    // Fixes
    if (report.fixes.length > 0) {
        html += `<div style="margin: 10px 0;"><strong style="color: #4caf50;">✅ Fixes Applied (${report.fixes.length}):</strong><ul>`;
        report.fixes.forEach(fix => {
            html += `<li style="color: #388e3c; margin: 2px 0;">${fix}</li>`;
        });
        html += `</ul></div>`;
    }
    
    // Performance
    html += `<div style="margin: 10px 0;"><strong style="color: #2196f3;">⚡ Performance:</strong><ul>`;
    Object.entries(report.performance).forEach(([name, metric]) => {
        const color = metric.duration > 100 ? '#f44336' : '#4caf50';
        html += `<li style="color: ${color}; margin: 2px 0;">${name}: ${metric.duration.toFixed(2)}ms</li>`;
    });
    html += `</ul></div>`;
    
    // Summary
    const totalIssues = report.errors.length + report.warnings.length;
    const statusColor = totalIssues === 0 ? '#4caf50' : totalIssues < 5 ? '#ff9800' : '#f44336';
    html += `<div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
        <strong style="color: ${statusColor};">Status: ${totalIssues === 0 ? 'All Good! 🎉' : `${totalIssues} Issues Found`}</strong>
    </div>`;
    
    resultContainer.innerHTML = html;
    document.body.appendChild(resultContainer);
}

// Auto-run error detection when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectAndFixErrors);
} else {
    detectAndFixErrors();
}

// Export for manual use
window.detectAndFixErrors = detectAndFixErrors;
window.ErrorDetector = ErrorDetector;
window.ErrorFixer = ErrorFixer;
window.PerformanceMonitor = PerformanceMonitor;

console.log('✅ Error detection and fixing script loaded successfully!');
console.log('💡 Run detectAndFixErrors() manually to re-run the checks.'); 