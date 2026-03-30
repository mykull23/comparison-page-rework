// ============================================
// MATTRESS DATABASE with Logo Paths
// ============================================
// Place your brand logo images in: assets/images/brands/
// Expected file names: casper-logo.png, leesa-logo.png, purple-logo.png, etc.
const mattressData = {
    "Casper": {
        logo: "assets/images/brands/casper-logo.png",
        type: "Memory Foam / Hybrid",
        comfort: "Medium-firm, zoned support",
        value: "Great value — top rated",
        price: "$1,095 – $2,295",
        priceValue: 1200,
        materials: "AirScape foam, zoned support",
        firmness: 6.5,
        firmnessText: "Medium-firm",
        rating: 4.8,
        bestFor: "Back sleepers, couples",
        sleepPosition: ["back", "combination"],
        tagline: "Engineered for the way you sleep",
        warranty: "10 years limited",
        trial: "100 nights",
        cooling: "AirScape breathable foam",
        motionIsolation: "Excellent",
        edgeSupport: "Good",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King"],
        shipping: "Free shipping, compressed in a box",
        scores: { type: 8, support: 9, value: 9, price: 7, materials: 8 },
        accentColor: "#2C5F8A",
        expertSummary: "The Casper Original features Zoned Support that provides targeted pressure relief.",
        customerRatingCount: 429,
        keyFeatures: ["Cooling", "Zoned Support", "Medium-firm", "Motion Isolation"]
    },
    "Leesa": {
        logo: "assets/images/brands/leesa-logo.png",
        type: "Foam / Hybrid",
        comfort: "Medium-firm, pressure relief",
        value: "High value, social impact",
        price: "$999 – $2,099",
        priceValue: 1000,
        materials: "3-layer foam, cooling top",
        firmness: 6,
        firmnessText: "Medium",
        rating: 4.7,
        bestFor: "All sleep positions",
        sleepPosition: ["back", "side", "stomach", "combination"],
        tagline: "Sleep better, do good",
        warranty: "10 years",
        trial: "100 nights",
        cooling: "Cooling top layer, breathable foam",
        motionIsolation: "Excellent",
        edgeSupport: "Very Good",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King"],
        shipping: "Free shipping & returns",
        scores: { type: 8, support: 9, value: 9, price: 8, materials: 8 },
        accentColor: "#4A6A5E",
        expertSummary: "Leesa combines three premium foam layers for universal comfort.",
        customerRatingCount: 272,
        keyFeatures: ["Pressure Relief", "Universal Comfort", "Cooling Top", "Eco-friendly"]
    },
    "Purple": {
        logo: "assets/images/brands/purple-logo.png",
        type: "Hyper-Elastic Polymer",
        comfort: "Soft yet supportive, cooling grid",
        value: "Premium cooling technology",
        price: "$1,399 – $3,498",
        priceValue: 1800,
        materials: "Purple Grid, breathable cover",
        firmness: 5,
        firmnessText: "Medium-soft",
        rating: 4.6,
        bestFor: "Hot sleepers, combo sleepers",
        sleepPosition: ["side", "combination"],
        tagline: "No pressure, all comfort",
        warranty: "10 years",
        trial: "100 nights",
        cooling: "Purple Grid hyper-elastic polymer",
        motionIsolation: "Very Good",
        edgeSupport: "Good",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King", "Split King"],
        shipping: "Free shipping",
        scores: { type: 9, support: 8, value: 8, price: 6, materials: 9 },
        accentColor: "#6A1B9A",
        expertSummary: "The Purple Grid flexes under pressure points while supporting the rest of the body.",
        customerRatingCount: 512,
        keyFeatures: ["Hyper-Elastic Grid", "Cooling", "Pressure Relief", "Durable"]
    },
    "Nest Bedding": {
        logo: "assets/images/brands/nest-bedding-logo.png",
        type: "Hybrid / Latex",
        comfort: "Customizable firmness",
        value: "Organic, eco-friendly",
        price: "$1,099 – $2,399",
        priceValue: 1500,
        materials: "Organic cotton, natural latex",
        firmness: 6,
        firmnessText: "Selectable",
        rating: 4.9,
        bestFor: "Eco-conscious shoppers",
        sleepPosition: ["back", "side", "stomach", "combination"],
        tagline: "Handcrafted in the USA",
        warranty: "Lifetime",
        trial: "365 nights",
        cooling: "Natural latex, breathable cover",
        motionIsolation: "Good",
        edgeSupport: "Excellent",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King"],
        shipping: "Free white glove delivery",
        scores: { type: 9, support: 9, value: 9, price: 7, materials: 10 },
        accentColor: "#2E7D64",
        expertSummary: "Nest Bedding offers customizable firmness and organic materials.",
        customerRatingCount: 348,
        keyFeatures: ["Organic", "Customizable", "Eco-friendly", "Handcrafted"]
    },
    "Saatva": {
        logo: "assets/images/brands/saatva-logo.png",
        type: "Innerspring Hybrid",
        comfort: "Lumbar support, luxury feel",
        value: "Premium, eco-friendly",
        price: "$1,295 – $2,590",
        priceValue: 1600,
        materials: "Organic cotton, coil-on-coil",
        firmness: 7,
        firmnessText: "Medium-firm to firm",
        rating: 4.9,
        bestFor: "Back pain sufferers",
        sleepPosition: ["back", "stomach"],
        tagline: "Luxury without the markup",
        warranty: "Lifetime",
        trial: "365 nights",
        cooling: "Organic cotton cover, breathable coils",
        motionIsolation: "Fair",
        edgeSupport: "Excellent",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King", "Split King"],
        shipping: "Free white glove delivery",
        scores: { type: 8, support: 10, value: 9, price: 7, materials: 9 },
        accentColor: "#B76E2E",
        expertSummary: "Saatva's coil-on-coil construction provides exceptional lumbar support.",
        customerRatingCount: 892,
        keyFeatures: ["Lumbar Support", "Luxury", "Organic", "Spinal Alignment"]
    },
    "Helix": {
        logo: "assets/images/brands/helix-logo.png",
        type: "Hybrid (Personalized)",
        comfort: "Tailored to your body",
        value: "High customization",
        price: "$936 – $2,349",
        priceValue: 1100,
        materials: "DuraDense foam, wrapped coils",
        firmness: 5.5,
        firmnessText: "Customizable",
        rating: 4.7,
        bestFor: "Personalized comfort",
        sleepPosition: ["back", "side", "stomach", "combination"],
        tagline: "Made for you",
        warranty: "10 years",
        trial: "100 nights",
        cooling: "Gel-infused foam, breathable cover",
        motionIsolation: "Good",
        edgeSupport: "Very Good",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King"],
        shipping: "Free shipping",
        scores: { type: 9, support: 9, value: 8, price: 8, materials: 8 },
        accentColor: "#00A86B",
        expertSummary: "Helix offers a personalized sleep experience with a quiz that matches you.",
        customerRatingCount: 567,
        keyFeatures: ["Personalized", "Hybrid", "Cooling", "Custom Firmness"]
    },
    "Tempur-Pedic": {
        logo: "assets/images/brands/tempur-pedic-logo.png",
        type: "Memory Foam",
        comfort: "Deep contouring, pressure relief",
        value: "Luxury, long-lasting",
        price: "$1,899 – $5,000+",
        priceValue: 3000,
        materials: "Tempur material, cooling tech",
        firmness: 6,
        firmnessText: "Soft to firm options",
        rating: 4.8,
        bestFor: "Pressure point relief",
        sleepPosition: ["back", "side"],
        tagline: "The original memory foam",
        warranty: "10 years",
        trial: "90 nights",
        cooling: "Tempur-APR+ cooling",
        motionIsolation: "Superior",
        edgeSupport: "Excellent",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King", "Split King"],
        shipping: "White glove delivery",
        scores: { type: 9, support: 10, value: 7, price: 4, materials: 10 },
        accentColor: "#8B4513",
        expertSummary: "Tempur-Pedic's proprietary memory foam conforms to your body.",
        customerRatingCount: 1245,
        keyFeatures: ["Memory Foam", "Pressure Relief", "Motion Isolation", "Premium"]
    },
    "DreamCloud": {
        logo: "assets/images/brands/dreamcloud-logo.png",
        type: "Hybrid Luxury",
        comfort: "Medium-firm, cashmere cover",
        value: "Luxury at accessible price",
        price: "$899 – $1,399",
        priceValue: 1000,
        materials: "Gel foam, innerspring coils",
        firmness: 6.5,
        firmnessText: "Medium-firm",
        rating: 4.7,
        bestFor: "Luxury on a budget",
        sleepPosition: ["back", "stomach"],
        tagline: "Luxury you can afford",
        warranty: "Lifetime",
        trial: "365 nights",
        cooling: "Gel memory foam, cashmere cover",
        motionIsolation: "Good",
        edgeSupport: "Excellent",
        sizes: ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King"],
        shipping: "Free white glove delivery",
        scores: { type: 8, support: 8, value: 9, price: 9, materials: 8 },
        accentColor: "#4B6A9B",
        expertSummary: "DreamCloud brings luxury hybrid construction at an accessible price point.",
        customerRatingCount: 734,
        keyFeatures: ["Luxury Hybrid", "Cashmere Cover", "Lifetime Warranty", "Value"]
    }
};

// Predefined comparisons for top-rated section
const topComparisons = [
    { brand1: "Casper", brand2: "Leesa" },
    { brand1: "Leesa", brand2: "Purple" },
    { brand1: "Purple", brand2: "Tempur-Pedic" },
    { brand1: "Saatva", brand2: "Helix" },
    { brand1: "Nest Bedding", brand2: "DreamCloud" },
    { brand1: "Casper", brand2: "Purple" },
    { brand1: "Tempur-Pedic", brand2: "Leesa" },
    { brand1: "Helix", brand2: "Saatva" }
];

// Global state
let selectedSlotA = null;
let selectedSlotB = null;
let currentFilters = {
    sleepPosition: "all",
    type: "all",
    budget: "all"
};

// ============================================
// RENDER MATTRESS GRID with Logos
// ============================================
function renderMattressGrid() {
    const grid = document.getElementById('mattressGrid');
    if (!grid) return;
    
    const filteredMattresses = Object.entries(mattressData).filter(([name, data]) => {
        if (currentFilters.sleepPosition !== "all" && !data.sleepPosition.includes(currentFilters.sleepPosition)) {
            return false;
        }
        if (currentFilters.type !== "all" && !data.type.toLowerCase().includes(currentFilters.type)) {
            return false;
        }
        if (currentFilters.budget !== "all") {
            if (currentFilters.budget === "under1000" && data.priceValue >= 1000) return false;
            if (currentFilters.budget === "1000-2000" && (data.priceValue < 1000 || data.priceValue > 2000)) return false;
            if (currentFilters.budget === "2000-3000" && (data.priceValue < 2000 || data.priceValue > 3000)) return false;
            if (currentFilters.budget === "over3000" && data.priceValue <= 3000) return false;
        }
        return true;
    });
    
    grid.innerHTML = filteredMattresses.map(([name, data]) => {
        const isSelectedA = selectedSlotA === name;
        const isSelectedB = selectedSlotB === name;
        let selectedClass = '';
        if (isSelectedA) selectedClass = 'selected-a';
        if (isSelectedB) selectedClass = 'selected-b';
        
        return `
            <div class="mattress-card ${selectedClass}" data-brand="${name}">
                <div class="mattress-card-info">
                    <img src="${data.logo}" alt="${name} logo" class="brand-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <p style="display: none;">${name}</p>
                    <p>${data.tagline}</p>
                    <div style="display: flex; gap: 8px; margin-top: 6px;">
                        <span style="font-size: 12px; background: #f0f0f0; padding: 2px 8px; border-radius: 12px;">${data.firmnessText}</span>
                        <span style="font-size: 12px; background: #f0f0f0; padding: 2px 8px; border-radius: 12px;">${data.type.split('/')[0]}</span>
                    </div>
                </div>
                <div class="mattress-card-price">${data.price}</div>
                <div class="mattress-card-actions">
                    <button class="btn-card-compare" data-brand="${name}">Compare</button>
                    <button class="btn-card-details" data-brand="${name}">Details</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.btn-card-compare').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const brand = btn.getAttribute('data-brand');
            addToComparison(brand);
        });
    });
    
    document.querySelectorAll('.btn-card-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const brand = btn.getAttribute('data-brand');
            openModal(brand);
        });
    });
}

// ============================================
// RENDER TOP COMPARISONS with Hover Text Effect - FIXED
// ============================================
function renderTopComparisons() {
    const grid = document.getElementById('comparisonsGrid');
    if (!grid) return;
    
    grid.innerHTML = topComparisons.map(comp => {
        const brand1 = mattressData[comp.brand1];
        const brand2 = mattressData[comp.brand2];
        if (!brand1 || !brand2) return '';
        
        return `
            <div class="comparison-tag" data-m1="${comp.brand1}" data-m2="${comp.brand2}">
                <div class="logo-wrapper">
                    <img src="${brand1.logo}" alt="${comp.brand1}" class="brand-logo-tag" onerror="this.style.display='none'">
                    <span style="margin: 0 4px;">${comp.brand1}</span>
                </div>
                <span class="vs-text">VS</span>
                <div class="logo-wrapper">
                    <img src="${brand2.logo}" alt="${comp.brand2}" class="brand-logo-tag" onerror="this.style.display='none'">
                    <span style="margin: 0 4px;">${comp.brand2}</span>
                </div>
                <div class="text-wrapper">Compare Now →</div>
            </div>
        `;
    }).join('');
    
    // Add click handlers - redirect to detailed-comparison.html
    document.querySelectorAll('.comparison-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const brand1 = tag.getAttribute('data-m1');
            const brand2 = tag.getAttribute('data-m2');
            if (brand1 && brand2) {
                window.location.href = `detailed-comparison.html?compare=${encodeURIComponent(brand1)}|${encodeURIComponent(brand2)}`;
            }
        });
    });
}

// ============================================
// ADD TO COMPARISON
// ============================================
function addToComparison(brand) {
    if (!selectedSlotA) {
        selectedSlotA = brand;
    } else if (!selectedSlotB) {
        selectedSlotB = brand;
    } else {
        // Both slots filled, replace slot B
        selectedSlotB = brand;
    }
    renderCompactSlots();
    renderMattressGrid();
    updateScoreCards();
    updateDeepComparisonButton();
}

// ============================================
// RENDER COMPACT SLOTS with Logos and Right-Aligned Values
// ============================================
function renderCompactSlots() {
    const slotA = document.getElementById('compactSlotA');
    const slotB = document.getElementById('compactSlotB');
    
    if (selectedSlotA && mattressData[selectedSlotA]) {
        const data = mattressData[selectedSlotA];
        slotA.innerHTML = `
            <div class="compact-slot-header">
                <img src="${data.logo}" alt="${selectedSlotA}" class="brand-logo-compact" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <h4 style="display: none;">${selectedSlotA}</h4>
                <button class="remove-slot" data-slot="A">×</button>
            </div>
            <ul class="compact-feature-list">
                <li><span>Type</span><span><strong>${data.type.split('/')[0]}</strong></span></li>
                <li><span>Firmness</span><span><strong>${data.firmnessText}</strong></span></li>
                <li><span>Price</span><span><strong>${data.price}</strong></span></li>
                <li><span>Rating</span><span><strong>${data.rating} ★</strong></span></li>
            </ul>
            <button class="btn-card-details" data-brand="${selectedSlotA}" style="width:100%; margin-top:12px; padding:8px;">Details</button>
        `;
        slotA.classList.add('filled');
        slotA.setAttribute('data-brand', selectedSlotA);
        
        slotA.querySelector('.remove-slot')?.addEventListener('click', () => {
            selectedSlotA = null;
            renderCompactSlots();
            renderMattressGrid();
            updateScoreCards();
            updateDeepComparisonButton();
        });
        
        slotA.querySelector('.btn-card-details')?.addEventListener('click', () => {
            openModal(selectedSlotA);
        });
    } else {
        slotA.innerHTML = `<div class="compact-slot-empty"><span>Select mattress</span></div>`;
        slotA.classList.remove('filled');
        slotA.removeAttribute('data-brand');
    }
    
    if (selectedSlotB && mattressData[selectedSlotB]) {
        const data = mattressData[selectedSlotB];
        slotB.innerHTML = `
            <div class="compact-slot-header">
                <img src="${data.logo}" alt="${selectedSlotB}" class="brand-logo-compact" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <h4 style="display: none;">${selectedSlotB}</h4>
                <button class="remove-slot" data-slot="B">×</button>
            </div>
            <ul class="compact-feature-list">
                <li><span>Type</span><span><strong>${data.type.split('/')[0]}</strong></span></li>
                <li><span>Firmness</span><span><strong>${data.firmnessText}</strong></span></li>
                <li><span>Price</span><span><strong>${data.price}</strong></span></li>
                <li><span>Rating</span><span><strong>${data.rating} ★</strong></span></li>
            </ul>
            <button class="btn-card-details" data-brand="${selectedSlotB}" style="width:100%; margin-top:12px; padding:8px;">Details</button>
        `;
        slotB.classList.add('filled');
        slotB.setAttribute('data-brand', selectedSlotB);
        
        slotB.querySelector('.remove-slot')?.addEventListener('click', () => {
            selectedSlotB = null;
            renderCompactSlots();
            renderMattressGrid();
            updateScoreCards();
            updateDeepComparisonButton();
        });
        
        slotB.querySelector('.btn-card-details')?.addEventListener('click', () => {
            openModal(selectedSlotB);
        });
    } else {
        slotB.innerHTML = `<div class="compact-slot-empty"><span>Select mattress</span></div>`;
        slotB.classList.remove('filled');
        slotB.removeAttribute('data-brand');
    }
    
    // Show/hide score cards
    if (selectedSlotA && selectedSlotB) {
        const scoreContainer = document.getElementById('scoreCardsContainer');
        if (scoreContainer) scoreContainer.style.display = 'grid';
    } else {
        const scoreContainer = document.getElementById('scoreCardsContainer');
        if (scoreContainer) scoreContainer.style.display = 'none';
    }
}

// ============================================
// UPDATE SCORE CARDS with Logos and Right-Aligned Values
// ============================================
function updateScoreCards() {
    const scoreCardA = document.getElementById('scoreCardA');
    const scoreCardB = document.getElementById('scoreCardB');
    
    if (selectedSlotA && mattressData[selectedSlotA]) {
        const data = mattressData[selectedSlotA];
        scoreCardA.innerHTML = `
            <img src="${data.logo}" alt="${selectedSlotA}" class="brand-logo-modal" style="margin-bottom: 12px;" onerror="this.style.display='none'">
            <div class="score-value">${data.rating}/5</div>
            <div class="score-label">Overall Rating</div>
            <div style="margin: 16px 0;">
                <div class="score-detail-item"><span class="score-detail-label">Type</span><span class="score-detail-value">${data.type.split('/')[0]}</span></div>
                <div class="score-detail-item"><span class="score-detail-label">Firmness</span><span class="score-detail-value">${data.firmnessText}</span></div>
                <div class="score-detail-item"><span class="score-detail-label">Best For</span><span class="score-detail-value">${data.bestFor}</span></div>
                <div class="score-detail-item"><span class="score-detail-label">Materials</span><span class="score-detail-value">${data.materials.split(',')[0]}</span></div>
            </div>
        `;
    } else {
        scoreCardA.innerHTML = `<h4>Select mattress</h4><div class="score-value">—</div>`;
    }
    
    if (selectedSlotB && mattressData[selectedSlotB]) {
        const data = mattressData[selectedSlotB];
        scoreCardB.innerHTML = `
            <img src="${data.logo}" alt="${selectedSlotB}" class="brand-logo-modal" style="margin-bottom: 12px;" onerror="this.style.display='none'">
            <div class="score-value">${data.rating}/5</div>
            <div class="score-label">Overall Rating</div>
            <div style="margin: 16px 0;">
                <div class="score-detail-item"><span class="score-detail-label">Type</span><span class="score-detail-value">${data.type.split('/')[0]}</span></div>
                <div class="score-detail-item"><span class="score-detail-label">Firmness</span><span class="score-detail-value">${data.firmnessText}</span></div>
                <div class="score-detail-item"><span class="score-detail-label">Best For</span><span class="score-detail-value">${data.bestFor}</span></div>
                <div class="score-detail-item"><span class="score-detail-label">Materials</span><span class="score-detail-value">${data.materials.split(',')[0]}</span></div>
            </div>
        `;
    } else {
        scoreCardB.innerHTML = `<h4>Select mattress</h4><div class="score-value">—</div>`;
    }
}

// ============================================
// UPDATE DEEP COMPARISON BUTTON - FIXED URL
// ============================================
function updateDeepComparisonButton() {
    const deepContainer = document.getElementById('deepComparisonContainer');
    const deepBtn = document.getElementById('deepComparisonBtn');
    
    if (selectedSlotA && selectedSlotB) {
        if (deepContainer) {
            deepContainer.style.display = 'block';
            if (deepBtn) {
                const compareUrl = `detailed-comparison.html?compare=${encodeURIComponent(selectedSlotA)}|${encodeURIComponent(selectedSlotB)}`;
                deepBtn.href = compareUrl;
                console.log('Deep comparison URL set to:', compareUrl);
            }
        }
    } else {
        if (deepContainer) {
            deepContainer.style.display = 'none';
        }
    }
}

// ============================================
// SWAP COMPARISON
// ============================================
function swapComparison() {
    if (selectedSlotA && selectedSlotB) {
        const temp = selectedSlotA;
        selectedSlotA = selectedSlotB;
        selectedSlotB = temp;
        renderCompactSlots();
        renderMattressGrid();
        updateScoreCards();
        updateDeepComparisonButton();
    }
}

// ============================================
// OPEN MODAL with Logo (No Add to Compare button)
// ============================================
function openModal(brand) {
    const modal = document.getElementById('mattressModal');
    const modalContent = document.getElementById('modalContent');
    const data = mattressData[brand];
    
    if (!data) return;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 32px;">
            <img src="${data.logo}" alt="${brand}" class="brand-logo-modal" style="margin-bottom: 16px;" onerror="this.style.display='none'">
            <p style="color: #6c757d;">${data.tagline}</p>
            <div style="margin-top: 12px;"><span style="font-size: 24px; font-weight: 700;">${data.rating} ★</span> / 5</div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <h4>Overview</h4>
            <p>${data.comfort}</p>
        </div>
        
        <div style="margin-bottom: 24px;">
            <h4>Specifications</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: #f8f9fa; padding: 12px; border-radius: 12px;"><strong>Type</strong><br>${data.type}</div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 12px;"><strong>Firmness</strong><br>${data.firmnessText}</div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 12px;"><strong>Price</strong><br>${data.price}</div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 12px;"><strong>Best For</strong><br>${data.bestFor}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <h4>Materials</h4>
            <p>${data.materials}</p>
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn-outline" style="flex:1;" onclick="document.getElementById('mattressModal').style.display='none';">Close</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// ============================================
// INITIALIZE FILTERS
// ============================================
function initFilters() {
    const sleepSelect = document.getElementById('sleepPositionSelect');
    const typeSelect = document.getElementById('typeSelect');
    const budgetSelect = document.getElementById('budgetSelect');
    const resetBtn = document.getElementById('resetFiltersSimple');
    
    if (sleepSelect) {
        sleepSelect.addEventListener('change', () => {
            currentFilters.sleepPosition = sleepSelect.value;
            renderMattressGrid();
        });
    }
    
    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            currentFilters.type = typeSelect.value;
            renderMattressGrid();
        });
    }
    
    if (budgetSelect) {
        budgetSelect.addEventListener('change', () => {
            currentFilters.budget = budgetSelect.value;
            renderMattressGrid();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (sleepSelect) sleepSelect.value = 'all';
            if (typeSelect) typeSelect.value = 'all';
            if (budgetSelect) budgetSelect.value = 'all';
            currentFilters = { sleepPosition: 'all', type: 'all', budget: 'all' };
            renderMattressGrid();
        });
    }
}

// ============================================
// INITIALIZE FAQ ACCORDION
// ============================================
function initFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

// ============================================
// INITIALIZE MODAL CLOSE
// ============================================
function initModal() {
    const modal = document.getElementById('mattressModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ============================================
// INITIALIZE SWAP BUTTON (Icon version)
// ============================================
function initSwapButton() {
    const swapBtn = document.getElementById('swapCompact');
    if (swapBtn) {
        swapBtn.addEventListener('click', swapComparison);
    }
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
    const elements = document.querySelectorAll('.element-card, .faq-item, .comparison-tag');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// ADD HERO ANIMATIONS
// ============================================
function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, i) => {
        el.classList.add('animate-fade-in-up');
        el.style.animationDelay = `${0.1 + i * 0.1}s`;
    });
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Render all components
    renderTopComparisons();
    renderMattressGrid();
    renderCompactSlots();
    
    // Initialize interactive features
    initFilters();
    initFaqAccordion();
    initModal();
    initSwapButton();
    initScrollReveal();
    initHeroAnimations();
    
    // Update deep comparison button visibility
    updateDeepComparisonButton();
    
    console.log('SleePare Comparison Tool initialized - v2.0');
});