// ============================================
// DETAILED COMPARISON PAGE - CONTROLLER
// ============================================

let chartInstance = null;

function getUrlParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) starsHtml += '★';
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
    return `<span style="color: #FFB800;">${starsHtml}</span> <strong>${rating}/5</strong>`;
}

function firmnessBar(value) {
    const percent = (value / 10) * 100;
    return `<div class="firmness-bar-container"><div class="firmness-fill" style="width: ${percent}%;"></div></div>`;
}

function renderDetailedComparison(brandA, brandB, modelAIndex = 0, modelBIndex = 0) {
    const dataA = window.mattressData[brandA];
    const dataB = window.mattressData[brandB];
    
    if (!dataA || !dataB) {
        document.getElementById('comparisonContent').innerHTML = `
            <div class="error-message">
                <div class="section-tag purple">Error</div>
                <h2>Invalid Mattress Selection</h2>
                <p>One or both mattress brands could not be found.</p>
                <a href="index.html" class="btn-primary" style="margin-top: 24px;">Back to Comparison Tool</a>
            </div>
        `;
        return;
    }
    
    const modelA = dataA.models ? dataA.models[modelAIndex] : {
        name: brandA,
        type: dataA.type || "Hybrid",
        firmness: dataA.firmness || 6,
        firmnessText: dataA.firmnessText || "Medium",
        price: dataA.price || "$1,000 – $2,000",
        bestFor: dataA.bestFor || "All sleepers",
        keyFeatures: dataA.keyFeatures || ["Quality", "Comfort"],
        tagline: dataA.tagline || "Premium comfort",
        cooling: dataA.cooling || "Breathable",
        motionIsolation: dataA.motionIsolation || "Good",
        edgeSupport: dataA.edgeSupport || "Good"
    };
    
    const modelB = dataB.models ? dataB.models[modelBIndex] : {
        name: brandB,
        type: dataB.type || "Hybrid",
        firmness: dataB.firmness || 6,
        firmnessText: dataB.firmnessText || "Medium",
        price: dataB.price || "$1,000 – $2,000",
        bestFor: dataB.bestFor || "All sleepers",
        keyFeatures: dataB.keyFeatures || ["Quality", "Comfort"],
        tagline: dataB.tagline || "Premium comfort",
        cooling: dataB.cooling || "Breathable",
        motionIsolation: dataB.motionIsolation || "Good",
        edgeSupport: dataB.edgeSupport || "Good"
    };
    
    // Parse price values for comparison
    const priceA = parseInt(modelA.price.replace(/[^0-9]/g, '')) || 1500;
    const priceB = parseInt(modelB.price.replace(/[^0-9]/g, '')) || 1500;
    
    // Determine which mattress has better value (lower price with similar features)
    const betterValue = priceA < priceB ? brandA : (priceB < priceA ? brandB : "Similar");
    
    const html = `
        <!-- Header with Logos -->
        <div class="comparison-header">
            <div style="display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap;">
                <div style="text-align: center; flex: 1; min-width: 200px;">
                    <img src="${dataA.logo}" alt="${brandA}" style="max-width: 140px; height: auto; max-height: 56px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                    <h3 style="margin: 8px 0 4px;">${brandA}</h3>
                    <div class="score-badge">${dataA.rating} ★ Overall Rating</div>
                    <div style="margin-top: 8px;">${renderStars(dataA.rating)}</div>
                    <div style="font-size: 13px; color: #5a6874; margin-top: 8px;">${modelA.name}</div>
                </div>
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #5E00FF 0%, #C800FF 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px;">VS</div>
                <div style="text-align: center; flex: 1; min-width: 200px;">
                    <img src="${dataB.logo}" alt="${brandB}" style="max-width: 140px; height: auto; max-height: 56px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                    <h3 style="margin: 8px 0 4px;">${brandB}</h3>
                    <div class="score-badge">${dataB.rating} ★ Overall Rating</div>
                    <div style="margin-top: 8px;">${renderStars(dataB.rating)}</div>
                    <div style="font-size: 13px; color: #5a6874; margin-top: 8px;">${modelB.name}</div>
                </div>
            </div>
        </div>
        
        <!-- Quick Comparison Overview -->
        <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-radius: 24px; padding: 28px; margin-bottom: 40px; text-align: center; border: 1px solid var(--border-light);">
            <div style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-blue); margin-bottom: 12px;">At a Glance</div>
            <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-top: 16px;">
                <div><strong>${brandA}</strong><br>${modelA.type.split('/')[0]} • ${modelA.firmnessText}</div>
                <div style="font-size: 20px; color: var(--primary);">⚖️</div>
                <div><strong>${brandB}</strong><br>${modelB.type.split('/')[0]} • ${modelB.firmnessText}</div>
            </div>
            <p style="margin-top: 20px; color: #5a6874;">Both mattresses offer quality construction. Your ideal choice depends on your sleep preferences and budget.</p>
        </div>
        
        <!-- Side-by-Side Comparison Table -->
        <div style="background: white; border-radius: 20px; border: 1px solid var(--border-light); overflow: hidden; margin-bottom: 32px;">
            <div style="background: var(--bg-light); padding: 16px 24px; border-bottom: 1px solid var(--border-light);">
                <h3 style="margin: 0;">Feature Comparison</h3>
            </div>
            <table class="spec-table">
                <thead>
                    <tr><th>Category</th><th>${brandA}</th><th>${brandB}</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Overall Rating</strong></td>
                        <td>${dataA.rating}/5 ${dataA.rating > dataB.rating ? '★' : (dataA.rating === dataB.rating ? '✓' : '')}</td>
                        <td>${dataB.rating}/5 ${dataB.rating > dataA.rating ? '★' : (dataA.rating === dataB.rating ? '✓' : '')}</td>
                    </tr>
                    <tr>
                        <td><strong>Mattress Type</strong></td>
                        <td>${modelA.type}</td>
                        <td>${modelB.type}</td>
                    </tr>
                    <tr>
                        <td><strong>Firmness</strong></td>
                        <td>${modelA.firmnessText} (${modelA.firmness}/10) ${firmnessBar(modelA.firmness)}</td>
                        <td>${modelB.firmnessText} (${modelB.firmness}/10) ${firmnessBar(modelB.firmness)}</td>
                    </tr>
                    <tr>
                        <td><strong>Best For</strong></td>
                        <td>${modelA.bestFor}</td>
                        <td>${modelB.bestFor}</td>
                    </tr>
                    <tr>
                        <td><strong>Cooling Technology</strong></td>
                        <td>${modelA.cooling}</td>
                        <td>${modelB.cooling}</td>
                    </tr>
                    <tr>
                        <td><strong>Motion Isolation</strong></td>
                        <td>${modelA.motionIsolation}</td>
                        <td>${modelB.motionIsolation}</td>
                    </tr>
                    <tr>
                        <td><strong>Edge Support</strong></td>
                        <td>${modelA.edgeSupport}</td>
                        <td>${modelB.edgeSupport}</td>
                    </tr>
                    <tr>
                        <td><strong>Price (Queen)</strong></td>
                        <td>${modelA.price}</td>
                        <td>${modelB.price}</td>
                    </tr>
                    <tr>
                        <td><strong>Trial Period</strong></td>
                        <td>${dataA.trial || "100 nights"}</td>
                        <td>${dataB.trial || "100 nights"}</td>
                    </tr>
                    <tr>
                        <td><strong>Warranty</strong></td>
                        <td>${dataA.warranty || "10 years"}</td>
                        <td>${dataB.warranty || "10 years"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Product Details with Shop Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div class="brand-card">
                <h4>About ${brandA}</h4>
                <p style="color: #5a6874; margin: 12px 0;">${modelA.tagline}</p>
                <div class="feature-list">
                    ${modelA.keyFeatures.slice(0, 4).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <div style="margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="https://www.sleepare.com/shop/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Shop ${brandA} →</a>
                    <button class="btn-outline" onclick="openModal('${brandA}')" style="flex: 1;">View Details</button>
                </div>
            </div>
            <div class="brand-card">
                <h4>About ${brandB}</h4>
                <p style="color: #5a6874; margin: 12px 0;">${modelB.tagline}</p>
                <div class="feature-list">
                    ${modelB.keyFeatures.slice(0, 4).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <div style="margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="https://www.sleepare.com/shop/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Shop ${brandB} →</a>
                    <button class="btn-outline" onclick="openModal('${brandB}')" style="flex: 1;">View Details</button>
                </div>
            </div>
        </div>
        
        <!-- Customer Reviews Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div class="review-card">
                <h4>What Customers Say About ${brandA}</h4>
                <div>${renderStars(dataA.rating)}</div>
                <div style="margin: 8px 0; font-size: 13px;">Based on ${dataA.customerRatingCount || "1,000+"} verified reviews</div>
                <div class="expert-quote" style="margin-top: 16px;">
                    "${dataA.expertSummary || "Customers consistently praise this mattress for its exceptional comfort and durability. Many report improved sleep quality and reduced back pain."}"
                </div>
            </div>
            <div class="review-card">
                <h4>What Customers Say About ${brandB}</h4>
                <div>${renderStars(dataB.rating)}</div>
                <div style="margin: 8px 0; font-size: 13px;">Based on ${dataB.customerRatingCount || "1,000+"} verified reviews</div>
                <div class="expert-quote" style="margin-top: 16px;">
                    "${dataB.expertSummary || "Users frequently highlight the excellent support and cooling properties. A favorite among combination sleepers and couples."}"
                </div>
            </div>
        </div>
        
        <!-- Helpful Guidance Section -->
        <div style="background: linear-gradient(135deg, var(--bg-light) 0%, white 100%); border-radius: 20px; padding: 32px; margin-bottom: 32px;">
            <h3 style="text-align: center; margin-bottom: 24px;">Which Mattress Is Right For You?</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <div>
                    <h4 style="color: var(--primary);">Consider ${brandA} if you:</h4>
                    <ul style="margin-top: 12px; list-style: none; padding: 0;">
                        <li style="padding: 6px 0;">✓ Prefer ${modelA.firmnessText.toLowerCase()} firmness</li>
                        <li style="padding: 6px 0;">✓ Sleep primarily as a ${modelA.bestFor.toLowerCase()}</li>
                        <li style="padding: 6px 0;">✓ ${priceA <= priceB ? 'Want a more budget-friendly option' : 'Are willing to invest in premium features'}</li>
                        ${modelA.cooling.toLowerCase().includes('cool') ? '<li style="padding: 6px 0;">✓ Need cooling technology for temperature regulation</li>' : ''}
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-blue);">Consider ${brandB} if you:</h4>
                    <ul style="margin-top: 12px; list-style: none; padding: 0;">
                        <li style="padding: 6px 0;">✓ Prefer ${modelB.firmnessText.toLowerCase()} firmness</li>
                        <li style="padding: 6px 0;">✓ Sleep primarily as a ${modelB.bestFor.toLowerCase()}</li>
                        <li style="padding: 6px 0;">✓ ${priceB <= priceA ? 'Want a more budget-friendly option' : 'Are willing to invest in premium features'}</li>
                        ${modelB.cooling.toLowerCase().includes('cool') ? '<li style="padding: 6px 0;">✓ Need cooling technology for temperature regulation</li>' : ''}
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Final CTA -->
        <div style="background: var(--heading-color); border-radius: 20px; padding: 40px; text-align: center; margin: 32px 0;">
            <h3 style="color: white; margin-bottom: 16px;">Still Not Sure Which Is Best?</h3>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto;">Visit any SleePare showroom to test both mattresses side-by-side. Our sleep experts will help you find your perfect match based on your unique needs.</p>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <a href="https://www.sleepare.com/mattress-stores/" class="btn-primary" style="background: white; color: var(--heading-color);" target="_blank">Find a Showroom Near You</a>
                <a href="index.html" class="btn-outline" style="border-color: white; color: white;">Compare More Mattresses</a>
            </div>
        </div>
    `;
    
    document.getElementById('comparisonContent').innerHTML = html;
}

function openModal(brand) {
    const modal = document.getElementById('mattressModal');
    const modalContent = document.getElementById('modalContent');
    const data = window.mattressData[brand];
    const currentModel = getCurrentModel(brand);
    if (!data) return;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${data.logo}" alt="${brand}" class="brand-logo-modal" onerror="this.style.display='none'">
            <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">${currentModel.name}</div>
            <p style="color: #5a6874; font-size: 13px;">${currentModel.tagline}</p>
            <div style="margin-top: 6px;"><span style="font-size: 24px; font-weight: 700;">${data.rating} ★</span> / 5</div>
        </div>
        <div style="margin-bottom: 16px;">
            <h4>Specs</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #f8f9fa; padding: 8px; border-radius: 10px;"><strong>Type</strong><br>${currentModel.type.split('/')[0]}</div>
                <div style="background: #f8f9fa; padding: 8px; border-radius: 10px;"><strong>Firmness</strong><br>${currentModel.firmnessText}</div>
                <div style="background: #f8f9fa; padding: 8px; border-radius: 10px;"><strong>Price</strong><br>${currentModel.price}</div>
                <div style="background: #f8f9fa; padding: 8px; border-radius: 10px;"><strong>Best For</strong><br>${currentModel.bestFor}</div>
            </div>
        </div>
        <div style="margin-bottom: 16px;">
            <h4>Key Features</h4>
            <p style="font-size: 13px;">${currentModel.keyFeatures.join(' • ')}</p>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a href="https://www.sleepare.com/shop/" class="btn-primary" style="flex: 1; text-align: center;" target="_blank">Shop ${brand} →</a>
            <button class="btn-outline" onclick="document.getElementById('mattressModal').style.display='none';">Close</button>
        </div>
    `;
    modal.style.display = 'block';
}

function initializeDetailedPage() {
    if (window.dataLoaded && Object.keys(window.mattressData).length > 0) {
        const compareParam = getUrlParameter('compare');
        if (compareParam && compareParam.includes('|')) {
            const parts = compareParam.split('|');
            const brand1 = parts[0];
            const brand2 = parts[1];
            const model1 = parseInt(parts[2]) || 0;
            const model2 = parseInt(parts[3]) || 0;
            
            if (window.mattressData[brand1] && window.mattressData[brand2]) {
                renderDetailedComparison(brand1, brand2, model1, model2);
            } else {
                document.getElementById('comparisonContent').innerHTML = `
                    <div class="error-message">
                        <div class="section-tag purple">Error</div>
                        <h2>Invalid Comparison</h2>
                        <a href="index.html" class="btn-primary">Back to Comparison Tool</a>
                    </div>
                `;
            }
        } else {
            document.getElementById('comparisonContent').innerHTML = `
                <div class="error-message">
                    <div class="section-tag purple">Welcome</div>
                    <h2>No Mattresses Selected</h2>
                    <a href="index.html" class="btn-primary">Start Comparing</a>
                </div>
            `;
        }
    } else {
        setTimeout(initializeDetailedPage, 100);
    }
}

// Make openModal available globally
window.openModal = openModal;

document.addEventListener('DOMContentLoaded', async () => {
    await loadMattressData();
    initializeDetailedPage();
});