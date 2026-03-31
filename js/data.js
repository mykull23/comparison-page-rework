// ============================================
// MATTRESS DATA LOADER
// Single source of truth from JSON file
// ============================================

window.mattressData = {};
window.topComparisons = [];
window.dataLoaded = false;
window.currentModels = {}; // Track selected model per brand

async function loadMattressData() {
    try {
        const response = await fetch('data/mattresses.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        window.mattressData = data.mattresses;
        window.topComparisons = data.topComparisons;
        
        // Initialize default model selection (first model for each brand)
        Object.keys(window.mattressData).forEach(brand => {
            if (window.mattressData[brand].models && window.mattressData[brand].models.length > 0) {
                window.currentModels[brand] = 0;
            }
        });
        
        window.dataLoaded = true;
        console.log('✅ Mattress data loaded:', Object.keys(window.mattressData).length, 'brands');
        return true;
    } catch (error) {
        console.error('❌ Error loading JSON:', error);
        return false;
    }
}

// Get current model data for a brand
function getCurrentModel(brand) {
    const brandData = window.mattressData[brand];
    if (!brandData) return null;
    if (!brandData.models || brandData.models.length === 0) {
        // Convert legacy format
        return {
            name: brand,
            type: brandData.type || "Hybrid",
            typeCategory: brandData.typeCategory || "hybrid",
            firmness: brandData.firmness || 6,
            firmnessText: brandData.firmnessText || "Medium",
            price: brandData.price || "$1,000 – $2,000",
            priceValue: brandData.priceValue || 1500,
            bestFor: brandData.bestFor || "All sleepers",
            sleepPosition: brandData.sleepPosition || ["back", "side", "combination"],
            keyFeatures: brandData.keyFeatures || ["Quality", "Comfort", "Support"],
            tagline: brandData.tagline || "Premium comfort",
            cooling: brandData.cooling || "Breathable design",
            motionIsolation: brandData.motionIsolation || "Good",
            edgeSupport: brandData.edgeSupport || "Good"
        };
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