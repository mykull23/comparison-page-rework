// ============================================
// MATTRESS DATA LOADER - WordPress REST API
// ============================================

window.mattressData = {};
window.topComparisons = [];
window.dataLoaded = false;
window.currentModels = {};

async function loadMattressData() {
    try {
        const response = await fetch('https://staging.sleepare.com/wp-json/sleepare/v1/mattresses');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        window.mattressData = data.mattresses;
        window.topComparisons = data.topComparisons || [];
        
        // Initialize default model selection (first model for each brand)
        Object.keys(window.mattressData).forEach(brand => {
            if (window.mattressData[brand].models && window.mattressData[brand].models.length > 0) {
                window.currentModels[brand] = 0;
            }
        });
        
        window.dataLoaded = true;
        console.log('✅ Mattress data loaded from WordPress:', Object.keys(window.mattressData).length, 'brands');
        return true;
    } catch (error) {
        console.error('❌ Error loading from WordPress API:', error);
        return false;
    }
}

// Get current model data for a brand
function getCurrentModel(brand) {
    const brandData = window.mattressData[brand];
    if (!brandData) return null;
    if (!brandData.models || brandData.models.length === 0) {
        return null;
    }
    return brandData.models[window.currentModels[brand] || 0];
}

// Change selected model
function selectModel(brand, modelIndex) {
    if (window.mattressData[brand] && window.mattressData[brand].models[modelIndex]) {
        window.currentModels[brand] = modelIndex;
        return true;
    }
    return false;
}