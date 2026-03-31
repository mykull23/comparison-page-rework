// ============================================
// SLEEPARE COMPARISON TOOL - MAIN APP
// ============================================

// Load saved comparison from localStorage
let selectedSlotA = localStorage.getItem('selectedSlotA') || null;
let selectedSlotB = localStorage.getItem('selectedSlotB') || null;
let currentFilters = {
    sleepPosition: localStorage.getItem('sleepPosition') || "all",
    type: localStorage.getItem('type') || "all",
    budget: localStorage.getItem('budget') || "all"
};

function saveComparisonState() {
    localStorage.setItem('selectedSlotA', selectedSlotA);
    localStorage.setItem('selectedSlotB', selectedSlotB);
    localStorage.setItem('sleepPosition', currentFilters.sleepPosition);
    localStorage.setItem('type', currentFilters.type);
    localStorage.setItem('budget', currentFilters.budget);
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) starsHtml += '★';
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
    return `<span style="color: #FFB800;">${starsHtml}</span> <strong>${rating}/5</strong>`;
}

function renderModelSelector(brand, currentModelIndex) {
    const brandData = window.mattressData[brand];
    if (!brandData || !brandData.models || brandData.models.length <= 1) return '';
    
    return `
        <div class="model-selector">
            ${brandData.models.map((model, idx) => `
                <span class="model-badge ${idx === currentModelIndex ? 'active' : ''}" data-brand="${brand}" data-model-index="${idx}">
                    ${model.name.split(' ').pop() || model.name}
                </span>
            `).join('')}
        </div>
    `;
}

function renderMattressGrid() {
    const grid = document.getElementById('mattressGrid');
    if (!grid) return;
    
    const filteredMattresses = Object.entries(window.mattressData).filter(([name, data]) => {
        const currentModel = getCurrentModel(name);
        if (currentFilters.sleepPosition !== "all" && !currentModel.sleepPosition.includes(currentFilters.sleepPosition)) {
            return false;
        }
        if (currentFilters.type !== "all") {
            const typeLower = currentModel.type.toLowerCase();
            if (currentFilters.type === "memory foam" && !typeLower.includes("memory")) return false;
            if (currentFilters.type === "hybrid" && !typeLower.includes("hybrid")) return false;
            if (currentFilters.type === "latex" && !typeLower.includes("latex")) return false;
        }
        if (currentFilters.budget !== "all") {
            const priceVal = currentModel.priceValue;
            if (currentFilters.budget === "under1000" && priceVal >= 1000) return false;
            if (currentFilters.budget === "1000-2000" && (priceVal < 1000 || priceVal > 2000)) return false;
            if (currentFilters.budget === "over2000" && priceVal <= 2000) return false;
        }
        return true;
    });
    
    if (filteredMattresses.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px;">No mattresses match your filters</div>';
        return;
    }
    
    grid.innerHTML = filteredMattresses.map(([name, data]) => {
        const currentModel = getCurrentModel(name);
        const currentModelIndex = window.currentModels[name] || 0;
        const isSelectedA = selectedSlotA === name;
        const isSelectedB = selectedSlotB === name;
        let selectedClass = '';
        if (isSelectedA) selectedClass = 'selected-a';
        if (isSelectedB) selectedClass = 'selected-b';
        
        return `
            <div class="mattress-card ${selectedClass}" data-brand="${name}">
                <div class="mattress-card-info">
                    <img src="${data.logo}" alt="${name}" class="brand-logo" onerror="this.style.display='none'">
                    <div class="model-name">${currentModel.name}</div>
                    <p>${currentModel.tagline.substring(0, 50)}${currentModel.tagline.length > 50 ? '...' : ''}</p>
                    ${renderModelSelector(name, currentModelIndex)}
                </div>
                <div class="mattress-card-price">${currentModel.price}</div>
                <div class="mattress-card-actions">
                    <button class="btn-card-compare" data-brand="${name}">Compare</button>
                    <button class="btn-card-details" data-brand="${name}">Info</button>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.model-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const brand = badge.getAttribute('data-brand');
            const modelIndex = parseInt(badge.getAttribute('data-model-index'));
            if (selectModel(brand, modelIndex)) {
                renderMattressGrid();
                if (selectedSlotA === brand || selectedSlotB === brand) {
                    renderCompactSlots();
                }
                saveComparisonState();
            }
        });
    });
    
    document.querySelectorAll('.btn-card-compare').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToComparison(btn.getAttribute('data-brand'));
        });
    });
    
    document.querySelectorAll('.btn-card-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(btn.getAttribute('data-brand'));
        });
    });
}

function addToComparison(brand) {
    if (!selectedSlotA) {
        selectedSlotA = brand;
    } else if (!selectedSlotB) {
        selectedSlotB = brand;
    } else {
        selectedSlotB = brand;
    }
    saveComparisonState();
    renderCompactSlots();
    renderMattressGrid();
    updateDeepComparisonButton();
}

function renderCompactSlots() {
    const slotA = document.getElementById('compactSlotA');
    const slotB = document.getElementById('compactSlotB');
    
    function renderSlot(slot, brand, slotName) {
        if (brand && window.mattressData[brand]) {
            const currentModel = getCurrentModel(brand);
            const data = window.mattressData[brand];
            slot.innerHTML = `
                <div class="compact-slot-header">
                    <img src="${data.logo}" alt="${brand}" class="brand-logo-compact" onerror="this.style.display='none'">
                    <button class="remove-slot" data-slot="${slotName}">×</button>
                </div>
                <div style="text-align: center; margin: 12px 0 8px 0;">
                    <div style="font-size: 20px; font-weight: 800; color: var(--primary);">${data.rating}<span style="font-size: 14px; color: #8e9aab;">/5</span></div>
                    <div style="font-size: 12px; color: #FFB800; margin-top: 2px;">${'★'.repeat(Math.floor(data.rating))}${'☆'.repeat(5 - Math.floor(data.rating))}</div>
                </div>
                <div style="font-size: 14px; font-weight: 700; text-align: center; margin-bottom: 8px;">${currentModel.name}</div>
                <ul class="compact-feature-list" style="margin-top: 8px;">
                    <li><span>Type</span><span>${currentModel.type.split('/')[0]}</span></li>
                    <li><span>Firmness</span><span>${currentModel.firmnessText}</span></li>
                </ul>
                <div style="margin-top: 12px;">
                    <button class="btn-card-details" data-brand="${brand}" style="width: 100%; padding: 8px; font-size: 12px;">View Details</button>
                </div>
            `;
            slot.classList.add('filled');
            slot.querySelector('.remove-slot')?.addEventListener('click', () => {
                if (slotName === 'A') selectedSlotA = null;
                else selectedSlotB = null;
                saveComparisonState();
                renderCompactSlots();
                renderMattressGrid();
                updateDeepComparisonButton();
            });
            slot.querySelector('.btn-card-details')?.addEventListener('click', () => openModal(brand));
        } else {
            slot.innerHTML = `<div class="compact-slot-empty"><span>Select a mattress to compare</span></div>`;
            slot.classList.remove('filled');
        }
    }
    
    renderSlot(slotA, selectedSlotA, 'A');
    renderSlot(slotB, selectedSlotB, 'B');
}

function updateDeepComparisonButton() {
    const deepContainer = document.getElementById('deepComparisonContainer');
    const deepBtn = document.getElementById('deepComparisonBtn');
    
    if (selectedSlotA && selectedSlotB && deepContainer) {
        deepContainer.style.display = 'block';
        if (deepBtn) {
            const modelA = window.currentModels[selectedSlotA] || 0;
            const modelB = window.currentModels[selectedSlotB] || 0;
            deepBtn.href = `detailed-comparison.html?compare=${encodeURIComponent(selectedSlotA)}|${encodeURIComponent(selectedSlotB)}|${modelA}|${modelB}`;
        }
    } else if (deepContainer) {
        deepContainer.style.display = 'none';
    }
}

function swapComparison() {
    if (selectedSlotA && selectedSlotB) {
        [selectedSlotA, selectedSlotB] = [selectedSlotB, selectedSlotA];
        saveComparisonState();
        renderCompactSlots();
        renderMattressGrid();
        updateDeepComparisonButton();
    }
}

function openModal(brand) {
    const modal = document.getElementById('mattressModal');
    const modalContent = document.getElementById('modalContent');
    const data = window.mattressData[brand];
    const currentModel = getCurrentModel(brand);
    if (!data) return;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <img src="${data.logo}" alt="${brand}" class="brand-logo-modal" onerror="this.style.display='none'" style="max-width: 140px; max-height: 48px;">
            <div style="font-size: 22px; font-weight: 700; margin-top: 16px;">${currentModel.name}</div>
            <div style="margin-top: 8px;">
                <span style="font-size: 32px; font-weight: 800; color: var(--primary);">${data.rating}</span><span style="font-size: 16px;">/5</span>
                <div style="color: #FFB800; margin-top: 4px;">${'★'.repeat(Math.floor(data.rating))}${'☆'.repeat(5 - Math.floor(data.rating))}</div>
            </div>
        </div>
        <div style="margin-bottom: 20px;">
            <p style="color: #5a6874; text-align: center; font-style: italic;">${currentModel.tagline}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Key Specifications</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                <div style="background: var(--bg-light); padding: 12px; border-radius: 12px;">
                    <strong>Type</strong><br>${currentModel.type}
                </div>
                <div style="background: var(--bg-light); padding: 12px; border-radius: 12px;">
                    <strong>Firmness</strong><br>${currentModel.firmnessText} (${currentModel.firmness}/10)
                </div>
                <div style="background: var(--bg-light); padding: 12px; border-radius: 12px;">
                    <strong>Best For</strong><br>${currentModel.bestFor}
                </div>
                <div style="background: var(--bg-light); padding: 12px; border-radius: 12px;">
                    <strong>Price (Queen)</strong><br>${currentModel.price}
                </div>
            </div>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Key Features</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                ${currentModel.keyFeatures.map(f => `<span style="background: rgba(44, 95, 138, 0.1); padding: 6px 12px; border-radius: 20px; font-size: 12px;">${f}</span>`).join('')}
            </div>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Additional Details</h4>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid var(--border-light);"><strong>Cooling:</strong> ${currentModel.cooling}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid var(--border-light);"><strong>Motion Isolation:</strong> ${currentModel.motionIsolation}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid var(--border-light);"><strong>Edge Support:</strong> ${currentModel.edgeSupport}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid var(--border-light);"><strong>Trial:</strong> ${data.trial || "100 nights"}</li>
                <li style="padding: 8px 0;"><strong>Warranty:</strong> ${data.warranty || "10 years"}</li>
            </ul>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a href="https://www.sleepare.com/shop/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Shop ${brand} →</a>
            <a href="https://www.sleepare.com/mattress-stores/" class="btn-outline" style="flex: 1; text-align: center;" target="_blank">Find a Store</a>
        </div>
    `;
    modal.style.display = 'block';
}

function openElementModal(elementId) {
    const modal = document.getElementById('mattressModal');
    const modalContent = document.getElementById('modalContent');
    
    const elements = {
        materials: {
            name: "Materials",
            icon: "assets/images/stock/Material.svg",
            description: `<p><strong>The materials your mattress is made from is often the ultimate deciding factor in purchasing a new mattress.</strong></p>
            <p>Each type of mattress provides different benefits and comfort. The type of mattress you choose depends on personal preference. There is no way to know for sure what mattress suits you best until you try, but we can recommend certain types of mattresses for specific needs. For example, latex and organic mattresses are recommended for those who suffer from allergies.</p>
            <p>When selecting mattress materials, make sure to consider your primary sleep position as well. Every sleep position benefits from a different type of mattress.</p>
            <p>If you are unsure what type of mattress would work the best for you, one of the experts at SleePare can recommend your perfect mattress!</p>`
        },
        brand: {
            name: "Brand & Reputation",
            icon: "assets/images/stock/Brand.svg",
            description: `<p><strong>With so many brands available, it can be difficult to decide which ones are worth checking out.</strong></p>
            <p>If you find a mattress that catches your eye, do some research on the brand before moving forward with a purchase. Make sure to purchase from a reputable brand and read credible reviews from customers and mattress review websites like SleePare.</p>
            <p>Once you decide on a brand, additional information about the brand can help you decide on your purchase. Make sure to research important information like return policy, warranties, delivery, and trial periods before making a purchase.</p>`
        },
        bodyType: {
            name: "Body Type Suitability",
            icon: "assets/images/stock/Body-Type.svg",
            description: `<p><strong>Many people do not consider their body type when purchasing and comparing mattresses.</strong></p>
            <p>Support and pressure distribution varies for different body types and builds. Visit our website to learn more about the best mattresses for heavier individuals.</p>`
        },
        couples: {
            name: "Couples Adjustability",
            icon: "assets/images/stock/Couple.svg",
            description: `<p><strong>Sleeping with a partner brings its own set of challenges.</strong></p>
            <p>If you are sleeping with someone else, it is best to consider features that make sleeping with a partner more comfortable. Features that work the best for couples include edge support, motion isolation, and mattresses with adjustable or more than one comfortable level.</p>`
        },
        price: {
            name: "Price & Value",
            icon: "assets/images/stock/Price.svg",
            description: `<p><strong>Setting a budget once you start shopping lets you narrow down your selections so you can pick the best option for your body and wallet.</strong></p>
            <p>Often, higher-priced, luxury mattresses come with more features and fluff than value and functionality. Narrowing down your choices will help you find a quality mattress that will last and include the features you want without paying for unneeded features.</p>
            <div class="price-info-card">
                <h4>Price Guide by Mattress Type</h4>
                <table class="price-info-table">
                    <tr><td><strong>Memory Foam</strong></td><td>Under $600 - $1,200+</td></tr>
                    <tr><td><strong>Hybrid</strong></td><td>Under $1,500 - $2,200+</td></tr>
                    <tr><td><strong>Latex</strong></td><td>Under $1,500 - $2,500+</td></tr>
                    <tr><td><strong>Innerspring</strong></td><td>Under $700 - $1,200+</td></tr>
                 </table>
                <p style="font-size: 12px; margin-top: 12px; color: #666;">*Queen size prices shown. Premium models may cost more.</p>
            </div>`
        }
    };
    
    const el = elements[elementId];
    if (!el) return;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <div class="element-modal-icon" style="background-image: url('${el.icon}'); background-size: contain; background-repeat: no-repeat; background-position: center; width: 80px; height: 80px; margin: 0 auto 16px auto;"></div>
            <h3 style="margin-bottom: 8px;">${el.name}</h3>
        </div>
        <div style="margin-bottom: 24px; line-height: 1.6;">
            ${el.description}
        </div>
        <div style="display: flex; gap: 12px;">
            <a href="https://www.sleepare.com/mattress-stores/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Visit a Showroom</a>
            <button class="btn-outline" onclick="document.getElementById('mattressModal').style.display='none';">Close</button>
        </div>
    `;
    modal.style.display = 'block';
}

function renderTopComparisons() {
    const grid = document.getElementById('comparisonsGrid');
    if (!grid || !window.topComparisons) return;
    
    grid.innerHTML = window.topComparisons.map(comp => {
        const brand1 = window.mattressData[comp.brand1];
        const brand2 = window.mattressData[comp.brand2];
        if (!brand1 || !brand2) return '';
        return `
            <div class="comparison-tag" data-m1="${comp.brand1}" data-m2="${comp.brand2}">
                <div class="logo-wrapper left">
                    <img src="${brand1.logo}" alt="${comp.brand1}" class="brand-logo-tag" onerror="this.style.display='none'">
                    <span>${comp.brand1}</span>
                </div>
                <span class="vs-text">VS</span>
                <div class="logo-wrapper right">
                    <span>${comp.brand2}</span>
                    <img src="${brand2.logo}" alt="${comp.brand2}" class="brand-logo-tag" onerror="this.style.display='none'">
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.comparison-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const brand1 = tag.getAttribute('data-m1');
            const brand2 = tag.getAttribute('data-m2');
            if (brand1 && brand2) {
                selectedSlotA = brand1;
                selectedSlotB = brand2;
                saveComparisonState();
                renderCompactSlots();
                renderMattressGrid();
                updateDeepComparisonButton();
                
                // Scroll to comparison section
                const comparisonSection = document.querySelector('.comparison-layout');
                if (comparisonSection) {
                    comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function initFilters() {
    const sleepSelect = document.getElementById('sleepPositionSelect');
    const typeSelect = document.getElementById('typeSelect');
    const budgetSelect = document.getElementById('budgetSelect');
    const resetBtn = document.getElementById('resetFiltersSimple');
    
    if (sleepSelect) sleepSelect.value = currentFilters.sleepPosition;
    if (typeSelect) typeSelect.value = currentFilters.type;
    if (budgetSelect) budgetSelect.value = currentFilters.budget;
    
    if (sleepSelect) sleepSelect.addEventListener('change', () => {
        currentFilters.sleepPosition = sleepSelect.value;
        saveComparisonState();
        renderMattressGrid();
    });
    if (typeSelect) typeSelect.addEventListener('change', () => {
        currentFilters.type = typeSelect.value;
        saveComparisonState();
        renderMattressGrid();
    });
    if (budgetSelect) budgetSelect.addEventListener('change', () => {
        currentFilters.budget = budgetSelect.value;
        saveComparisonState();
        renderMattressGrid();
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (sleepSelect) sleepSelect.value = 'all';
        if (typeSelect) typeSelect.value = 'all';
        if (budgetSelect) budgetSelect.value = 'all';
        currentFilters = { sleepPosition: 'all', type: 'all', budget: 'all' };
        saveComparisonState();
        renderMattressGrid();
    });
}

function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            answer.style.maxHeight = '0px';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.25s ease-out';
            question.addEventListener('click', (e) => {
                e.preventDefault();
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0px';
                }
            });
        }
    });
}

function initElements() {
    document.querySelectorAll('.element-card').forEach((card) => {
        const elementType = card.getAttribute('data-element');
        card.addEventListener('click', () => {
            openElementModal(elementType);
        });
    });
}

function initModal() {
    const modal = document.getElementById('mattressModal');
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) modal.style.display = 'none';
    });
}

function checkAndInit() {
    if (window.dataLoaded && Object.keys(window.mattressData).length > 0) {
        console.log('✅ Data ready, initializing app...');
        renderTopComparisons();
        renderMattressGrid();
        renderCompactSlots();
        initFilters();
        initFaq();
        initElements();
        initModal();
        const swapBtn = document.getElementById('swapCompact');
        if (swapBtn) swapBtn.addEventListener('click', swapComparison);
        updateDeepComparisonButton();
        console.log('✅ App initialized');
    } else {
        setTimeout(checkAndInit, 100);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadMattressData();
    checkAndInit();
});