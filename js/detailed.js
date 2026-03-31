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
    
    // Calculate comparison winners (mock logic - can be enhanced)
    const winnerComfort = modelA.firmness > modelB.firmness ? brandA : brandB;
    const winnerSupport = modelA.firmnessText.includes("Firm") ? brandA : brandB;
    const winnerValue = dataA.rating > dataB.rating ? brandA : brandB;
    const winnerCooling = modelA.cooling.includes("cool") ? brandA : brandB;
    
    const html = `
        <!-- Header with Logos -->
        <div class="comparison-header">
            <div style="display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap;">
                <div style="text-align: center; flex: 1; min-width: 200px;">
                    <img src="${dataA.logo}" alt="${brandA}" style="max-width: 140px; height: auto; max-height: 56px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                    <h3 style="margin: 8px 0 4px;">${brandA}</h3>
                    <div class="score-badge">Pro Score ${Math.floor(dataA.rating * 10)}</div>
                    <div style="margin-top: 8px;">${renderStars(dataA.rating)}</div>
                    <div style="font-size: 13px; color: #5a6874; margin-top: 8px;">${modelA.name}</div>
                </div>
                <div style="width: 56px; height: 56px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px;">VS</div>
                <div style="text-align: center; flex: 1; min-width: 200px;">
                    <img src="${dataB.logo}" alt="${brandB}" style="max-width: 140px; height: auto; max-height: 56px; object-fit: contain; margin-bottom: 12px;" onerror="this.style.display='none'">
                    <h3 style="margin: 8px 0 4px;">${brandB}</h3>
                    <div class="score-badge">Pro Score ${Math.floor(dataB.rating * 10)}</div>
                    <div style="margin-top: 8px;">${renderStars(dataB.rating)}</div>
                    <div style="font-size: 13px; color: #5a6874; margin-top: 8px;">${modelB.name}</div>
                </div>
            </div>
        </div>
        
        <!-- Product Details Row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div class="brand-card">
                <h4>${brandA}</h4>
                <p style="color: #5a6874; margin: 12px 0;">${modelA.tagline}</p>
                <div class="feature-list">
                    ${modelA.keyFeatures.slice(0, 3).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <a href="#" class="btn-outline" style="display: inline-block; padding: 8px 20px; font-size: 13px;">See Product →</a>
            </div>
            <div class="brand-card">
                <h4>${brandB}</h4>
                <p style="color: #5a6874; margin: 12px 0;">${modelB.tagline}</p>
                <div class="feature-list">
                    ${modelB.keyFeatures.slice(0, 3).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <a href="#" class="btn-outline" style="display: inline-block; padding: 8px 20px; font-size: 13px;">See Product →</a>
            </div>
        </div>
        
        <!-- Detailed Specs Table -->
        <div style="background: white; border-radius: 20px; border: 1px solid var(--border-light); overflow: hidden; margin-bottom: 32px;">
            <table class="spec-table">
                <thead>
                    <tr><th>Details</th><th>${brandA}</th><th>${brandB}</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Price (Queen)</strong></td><td>${modelA.price}</td><td>${modelB.price}</td></tr>
                    <tr><td><strong>Sizes</strong></td><td>Twin, Twin XL, Full, Queen, King, Cal King</td><td>Twin, Twin XL, Full, Queen, King, Cal King</td></tr>
                    <tr><td><strong>Weight (Queen)</strong></td><td>70 lbs</td><td>71 lbs</td></tr>
                    <tr><td><strong>Mattress Build</strong></td><td>${modelA.type}</td><td>${modelB.type}</td></tr>
                    <tr><td><strong>Firmness</strong></td><td>${modelA.firmnessText} ${firmnessBar(modelA.firmness)}</td><td>${modelB.firmnessText} ${firmnessBar(modelB.firmness)}</td></tr>
                    <tr><td><strong>Cooling Technology</strong></td><td>${modelA.cooling}</td><td>${modelB.cooling}</td></tr>
                    <tr><td><strong>Motion Isolation</strong></td><td>${modelA.motionIsolation}</td><td>${modelB.motionIsolation}</td></tr>
                    <tr><td><strong>Edge Support</strong></td><td>${modelA.edgeSupport}</td><td>${modelB.edgeSupport}</td></tr>
                </tbody>
            </table>
        </div>
        
        <!-- Customer Reviews Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div class="review-card">
                <h4>${brandA} Customer Reviews</h4>
                <div>${renderStars(dataA.rating)}</div>
                <div style="margin: 12px 0;">
                    <div>Value for money: <strong>${dataA.customerComfort ? Math.floor(dataA.customerComfort * 20) : 88}%</strong></div>
                    <div>Temperature Regulation: <strong>${dataA.customerCooling ? Math.floor(dataA.customerCooling * 20) : 95}%</strong></div>
                    <div>Durability: <strong>${dataA.customerSupport ? Math.floor(dataA.customerSupport * 20) : 88}%</strong></div>
                </div>
                <div class="expert-quote">
                    "${dataA.expertSummary.substring(0, 80)}..."
                </div>
            </div>
            <div class="review-card">
                <h4>${brandB} Customer Reviews</h4>
                <div>${renderStars(dataB.rating)}</div>
                <div style="margin: 12px 0;">
                    <div>Value for money: <strong>${dataB.customerComfort ? Math.floor(dataB.customerComfort * 20) : 92}%</strong></div>
                    <div>Temperature Regulation: <strong>${dataB.customerCooling ? Math.floor(dataB.customerCooling * 20) : 95}%</strong></div>
                    <div>Durability: <strong>${dataB.customerSupport ? Math.floor(dataB.customerSupport * 20) : 95}%</strong></div>
                </div>
                <div class="expert-quote">
                    "${dataB.expertSummary.substring(0, 80)}..."
                </div>
            </div>
        </div>
        
        <!-- Expert Reviews Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div class="review-card">
                <h4>Expert Reviews - ${brandA}</h4>
                <div>Value for money: <strong>92%</strong></div>
                <div>Owner Satisfaction: <strong>96%</strong></div>
                <div>Sleeping Cool: <strong>92%</strong></div>
                <div>Comfort: <strong>91%</strong></div>
                <div>Motion Transfer: <strong>89%</strong></div>
            </div>
            <div class="review-card">
                <h4>Expert Reviews - ${brandB}</h4>
                <div>Value for money: <strong>89%</strong></div>
                <div>Owner Satisfaction: <strong>85%</strong></div>
                <div>Sleeping Cool: <strong>90%</strong></div>
                <div>Comfort: <strong>92%</strong></div>
                <div>Motion Transfer: <strong>87%</strong></div>
            </div>
        </div>
        
        <!-- Features Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div class="brand-card">
                <h4>${brandA} Features</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0;">✓ Adjusts on slats, platform, and adjustable foundations</li>
                    <li style="padding: 8px 0;">✓ Supportive in all sleep positions</li>
                    <li style="padding: 8px 0;">✓ Excellent edge support</li>
                    <li style="padding: 8px 0;">✓ Pressure relieving construction</li>
                </ul>
            </div>
            <div class="brand-card">
                <h4>${brandB} Features</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0;">✓ Suitable for slats, box spring, platform, adjustable base</li>
                    <li style="padding: 8px 0;">✓ Un-matched responsiveness</li>
                    <li style="padding: 8px 0;">✓ Body contouring for pressure relief</li>
                    <li style="padding: 8px 0;">✓ Excellent lumbar support</li>
                </ul>
            </div>
        </div>
        
        <!-- Summary Comparison -->
        <div class="summary-section">
            <h3>Summary Comparison</h3>
            <div class="summary-item">
                <strong>Cost based value:</strong> In terms of quality and cost-based value, ${dataB.rating > dataA.rating ? brandB : brandA} is a better mattress than ${dataB.rating > dataA.rating ? brandA : brandB}. <span class="winner-badge">Winner: ${dataB.rating > dataA.rating ? brandB : brandA}</span>
            </div>
            <div class="summary-item">
                <strong>Comfort:</strong> In comparison to ${brandB}, ${brandA} provides excellent comfort thanks to its superb construction. <span class="winner-badge">Winner: ${brandA}</span>
            </div>
            <div class="summary-item">
                <strong>Support:</strong> ${brandA} has a more adaptive structure providing excellent adjustment per your body weight. <span class="winner-badge">Winner: ${brandA}</span>
            </div>
            <div class="summary-item">
                <strong>Temperature regulation:</strong> If you are looking for a mattress with remarkable cooling, ${brandA} is a more viable option. <span class="winner-badge">Winner: ${brandA}</span>
            </div>
            <div class="summary-item">
                <strong>Durability:</strong> Among these two mattress models, ${brandB} is more durable and robust. <span class="winner-badge">Winner: ${brandB}</span>
            </div>
        </div>
        
        <!-- Bottom Line -->
        <div class="bottom-line">
            <h3>The Bottom Line</h3>
            <p style="color: rgba(255,255,255,0.9);">All in all, ${brandA} mattress is an excellent sleep surface in terms of comfort, support and temperature regulation. On the other hand, ${brandB} is a better choice when it comes to cost-based value and durability. Depending on your preferences, both products have the ability to rejuvenate your sleep experience and make your mornings more refreshing than ever!</p>
        </div>
        
        <!-- CTA -->
        <div style="background: var(--bg-light); border-radius: 20px; padding: 32px; text-align: center; margin: 32px 0;">
            <h3>Experience These Mattresses In-Store</h3>
            <p style="color: #5a6874; margin: 16px 0;">Test both ${brandA} and ${brandB} side-by-side at any SleePare showroom.</p>
            <a href="https://www.sleepare.com/mattress-stores/" class="btn-primary" target="_blank">Book an Appointment →</a>
        </div>
    `;
    
    document.getElementById('comparisonContent').innerHTML = html;
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

document.addEventListener('DOMContentLoaded', async () => {
    await loadMattressData();
    initializeDetailedPage();
});