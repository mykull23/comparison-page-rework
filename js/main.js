// ============================================
// MATTRESS DATABASE
// ============================================
const mattressData = {
    "Casper": {
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
        brandColor: "#2C5F8A",
        tagline: "Engineered for the way you sleep"
    },
    "Leesa": {
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
        brandColor: "#4A6A5E",
        tagline: "Sleep better, do good"
    },
    "Purple": {
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
        brandColor: "#6A1B9A",
        tagline: "No pressure, all comfort"
    },
    "Nest Bedding": {
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
        brandColor: "#2E7D64",
        tagline: "Handcrafted in the USA"
    },
    "Saatva": {
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
        brandColor: "#B76E2E",
        tagline: "Luxury without the markup"
    },
    "Helix": {
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
        brandColor: "#00A86B",
        tagline: "Made for you"
    },
    "Tempur-Pedic": {
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
        brandColor: "#8B4513",
        tagline: "The original memory foam"
    },
    "DreamCloud": {
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
        brandColor: "#4B6A9B",
        tagline: "Luxury you can afford"
    }
};

// Global state
let selectedSlotA = null;
let selectedSlotB = null;
let currentFilters = {
    sleepPosition: "all",
    type: "all",
    budget: "all"
};

// ============================================
// RENDER MATTRESS GRID
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
    
    grid.innerHTML = filteredMattresses.map(([name, data]) => `
        <div class="mattress-card" data-brand="${name}" style="border-left-color: ${selectedSlotA === name ? data.brandColor : selectedSlotB === name ? data.brandColor : 'transparent'}; border-left-width: ${selectedSlotA === name || selectedSlotB === name ? '4px' : '1px'}; border-left-style: solid;">
            <div class="mattress-card-info">
                <h4 style="color: ${data.brandColor};">${name}</h4>
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
    `).join('');
    
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
// ADD TO COMPARISON (Smart assignment)
// ============================================
function addToComparison(brand) {
    if (!selectedSlotA) {
        selectedSlotA = brand;
    } else if (!selectedSlotB) {
        selectedSlotB = brand;
    } else {
        // Both filled, replace the one that's not currently being added (or just replace B)
        selectedSlotB = brand;
    }
    renderCompactSlots();
    renderMattressGrid();
    updateScoreCards();
}

// ============================================
// RENDER COMPACT SLOTS
// ============================================
function renderCompactSlots() {
    const slotA = document.getElementById('compactSlotA');
    const slotB = document.getElementById('compactSlotB');
    const swapContainer = document.getElementById('swapContainer');
    
    if (selectedSlotA && mattressData[selectedSlotA]) {
        const data = mattressData[selectedSlotA];
        slotA.innerHTML = `
            <div class="compact-slot-header">
                <h4 style="color: ${data.brandColor};">${selectedSlotA}</h4>
                <button class="remove-slot" data-slot="A">×</button>
            </div>
            <ul class="compact-feature-list">
                <li><span>Type</span><span><strong>${data.type.split('/')[0]}</strong></span></li>
                <li><span>Firmness</span><span><strong>${data.firmnessText}</strong></span></li>
                <li><span>Price</span><span><strong>${data.price}</strong></span></li>
                <li><span>Rating</span><span><strong>${data.rating} ★</strong></span></li>
            </ul>
            <button class="btn-card-details" data-brand="${selectedSlotA}" style="width:100%; margin-top:12px; padding:8px;">Full Details</button>
        `;
        slotA.classList.add('filled');
        slotA.setAttribute('data-brand', selectedSlotA);
        
        slotA.querySelector('.remove-slot')?.addEventListener('click', () => {
            selectedSlotA = null;
            renderCompactSlots();
            renderMattressGrid();
            updateScoreCards();
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
                <h4 style="color: ${data.brandColor};">${selectedSlotB}</h4>
                <button class="remove-slot" data-slot="B">×</button>
            </div>
            <ul class="compact-feature-list">
                <li><span>Type</span><span><strong>${data.type.split('/')[0]}</strong></span></li>
                <li><span>Firmness</span><span><strong>${data.firmnessText}</strong></span></li>
                <li><span>Price</span><span><strong>${data.price}</strong></span></li>
                <li><span>Rating</span><span><strong>${data.rating} ★</strong></span></li>
            </ul>
            <button class="btn-card-details" data-brand="${selectedSlotB}" style="width:100%; margin-top:12px; padding:8px;">Full Details</button>
        `;
        slotB.classList.add('filled');
        slotB.setAttribute('data-brand', selectedSlotB);
        
        slotB.querySelector('.remove-slot')?.addEventListener('click', () => {
            selectedSlotB = null;
            renderCompactSlots();
            renderMattressGrid();
            updateScoreCards();
        });
        
        slotB.querySelector('.btn-card-details')?.addEventListener('click', () => {
            openModal(selectedSlotB);
        });
    } else {
        slotB.innerHTML = `<div class="compact-slot-empty"><span>Select mattress</span></div>`;
        slotB.classList.remove('filled');
        slotB.removeAttribute('data-brand');
    }
    
    // Show/hide swap container and score cards
    if (selectedSlotA && selectedSlotB) {
        swapContainer.style.display = 'block';
        document.getElementById('scoreCardsContainer').style.display = 'grid';
    } else {
        swapContainer.style.display = 'none';
        document.getElementById('scoreCardsContainer').style.display = 'none';
    }
}

// ============================================
// UPDATE SCORE CARDS
// ============================================
function updateScoreCards() {
    const scoreCardA = document.getElementById('scoreCardA');
    const scoreCardB = document.getElementById('scoreCardB');
    
    if (selectedSlotA && mattressData[selectedSlotA]) {
        const data = mattressData[selectedSlotA];
        const avgScore = (data.rating / 5) * 100;
        scoreCardA.innerHTML = `
            <h4 style="color: ${data.brandColor};">${selectedSlotA}</h4>
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
            <h4 style="color: ${data.brandColor};">${selectedSlotB}</h4>
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
    }
}

// ============================================
// OPEN MODAL
// ============================================
function openModal(brand) {
    const modal = document.getElementById('mattressModal');
    const modalContent = document.getElementById('modalContent');
    const data = mattressData[brand];
    
    if (!data) return;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: ${data.brandColor};">${brand}</h2>
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
            <button class="btn-primary" style="flex:1;" onclick="addToComparison('${brand}'); document.getElementById('mattressModal').style.display='none';">Add to Compare</button>
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
    
    sleepSelect.addEventListener('change', () => {
        currentFilters.sleepPosition = sleepSelect.value;
        renderMattressGrid();
    });
    
    typeSelect.addEventListener('change', () => {
        currentFilters.type = typeSelect.value;
        renderMattressGrid();
    });
    
    budgetSelect.addEventListener('change', () => {
        currentFilters.budget = budgetSelect.value;
        renderMattressGrid();
    });
    
    resetBtn.addEventListener('click', () => {
        sleepSelect.value = 'all';
        typeSelect.value = 'all';
        budgetSelect.value = 'all';
        currentFilters = { sleepPosition: 'all', type: 'all', budget: 'all' };
        renderMattressGrid();
    });
}

// ============================================
// INITIALIZE TOP COMPARISON TAGS
// ============================================
function initComparisonTags() {
    const tags = document.querySelectorAll('.comparison-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const brands = tag.textContent.split(' vs ');
            if (brands.length === 2 && mattressData[brands[0]] && mattressData[brands[1]]) {
                selectedSlotA = brands[0];
                selectedSlotB = brands[1];
                renderCompactSlots();
                renderMattressGrid();
                updateScoreCards();
                
                document.querySelector('.comparison-tool-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// INITIALIZE FAQ ACCORDION
// ============================================
function initFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// ============================================
// INITIALIZE MODAL CLOSE
// ============================================
function initModal() {
    const modal = document.getElementById('mattressModal');
    const closeBtn = document.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

// ============================================
// INITIALIZE SWAP BUTTON
// ============================================
function initSwapButton() {
    document.getElementById('swapCompact')?.addEventListener('click', swapComparison);
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
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderMattressGrid();
    renderCompactSlots();
    initFilters();
    initComparisonTags();
    initFaqAccordion();
    initModal();
    initSwapButton();
    initScrollReveal();
    
    // Hero animations
    document.querySelectorAll('.hero-content > *').forEach((el, i) => {
        el.classList.add('animate-fade-in-up');
        el.style.animationDelay = `${0.1 + i * 0.1}s`;
    });
});