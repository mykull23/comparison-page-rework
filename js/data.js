// ============================================
// MATTRESS DATA LOADER - WordPress REST API with Local Fallback
// ============================================

window.mattressData = {};
window.topComparisons = [];
window.dataLoaded = false;
window.currentModels = {};

async function loadMattressData() {
    // First try WordPress API
    try {
        const response = await fetch('https://staging.sleepare.com/wp-json/sleepare/v1/mattresses');
        
        if (response.ok) {
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
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Error loading from WordPress API:', error);
        console.log('🔄 Falling back to local mattresses.json...');
        
        // Fallback to local JSON file
        try {
            const localResponse = await fetch('data/mattresses.json');
            
            if (!localResponse.ok) {
                throw new Error(`Local file error! status: ${localResponse.status}`);
            }
            
            const localData = await localResponse.json();
            
            // Handle both possible data structures
            if (localData.mattresses) {
                window.mattressData = localData.mattresses;
                window.topComparisons = localData.topComparisons || [];
            } else {
                // If the file is directly the mattress data object
                window.mattressData = localData;
                window.topComparisons = [];
            }
            
            // Initialize default model selection
            Object.keys(window.mattressData).forEach(brand => {
                if (window.mattressData[brand].models && window.mattressData[brand].models.length > 0) {
                    window.currentModels[brand] = 0;
                }
            });
            
            window.dataLoaded = true;
            console.log('✅ Mattress data loaded from local JSON:', Object.keys(window.mattressData).length, 'brands');
            return true;
            
        } catch (localError) {
            console.error('❌ Error loading local mattresses.json:', localError);
            console.log('📝 Using sample/default data...');
            
            // Fallback to sample data if no file exists
            window.mattressData = getSampleMattressData();
            window.topComparisons = [
                { brand1: "Saatva", brand2: "Avocado" },
                { brand1: "Nectar", brand2: "DreamCloud" },
                { brand1: "Casper", brand2: "Purple" }
            ];
            
            Object.keys(window.mattressData).forEach(brand => {
                if (window.mattressData[brand].models && window.mattressData[brand].models.length > 0) {
                    window.currentModels[brand] = 0;
                }
            });
            
            window.dataLoaded = true;
            console.log('✅ Using sample mattress data');
            return true;
        }
    }
}

// Sample data as ultimate fallback
function getSampleMattressData() {
    return {
        "Saatva": {
            logo: "assets/images/brands/saatva-logo.svg",
            rating: 4.8,
            warranty: "15 years",
            trial: "365 nights",
            expertSummary: "Saatva is a luxury hybrid mattress that combines eco-friendly materials with exceptional craftsmanship.",
            accentColor: "#2C5F8A",
            scores: {
                type: 9,
                support: 9,
                value: 8,
                price: 7,
                materials: 9
            },
            customerRatingCount: 8500,
            customerComfort: 4.7,
            customerSupport: 4.8,
            customerCooling: 4.5,
            models: [
                {
                    name: "Saatva Classic",
                    type: "Hybrid",
                    typeCategory: "hybrid",
                    firmness: 7,
                    firmnessText: "Luxury Firm",
                    price: "$1,295 - $2,390",
                    priceValue: 1595,
                    bestFor: "All sleep positions",
                    sleepPosition: ["back", "side", "stomach", "combination"],
                    keyFeatures: ["Eco-friendly", "Dual coil system", "Organic cotton"],
                    tagline: "Luxury hybrid with exceptional support and durability",
                    cooling: "Breathable organic cotton cover",
                    motionIsolation: "Good",
                    edgeSupport: "Excellent"
                }
            ]
        },
        "Avocado": {
            logo: "assets/images/brands/avocado-logo.svg",
            rating: 4.7,
            warranty: "25 years",
            trial: "365 nights",
            expertSummary: "Avocado is an eco-luxury brand focused on organic and sustainable materials.",
            accentColor: "#2C5F8A",
            scores: {
                type: 8,
                support: 8,
                value: 9,
                price: 7,
                materials: 10
            },
            customerRatingCount: 6200,
            customerComfort: 4.6,
            customerSupport: 4.7,
            customerCooling: 4.4,
            models: [
                {
                    name: "Avocado Green",
                    type: "Natural Latex",
                    typeCategory: "latex",
                    firmness: 7,
                    firmnessText: "Medium-Firm",
                    price: "$1,299 - $2,599",
                    priceValue: 1599,
                    bestFor: "Back and stomach sleepers",
                    sleepPosition: ["back", "stomach"],
                    keyFeatures: ["100% Organic", "GOTS certified", "Natural latex"],
                    tagline: "The world's most non-toxic mattress",
                    cooling: "Natural latex and organic wool",
                    motionIsolation: "Good",
                    edgeSupport: "Very Good"
                }
            ]
        }
    };
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