// ============================================
// DETAILED COMPARISON PAGE - MAIN CONTROLLER
// Handles URL parsing, rendering, and chart initialization
// ============================================

// Helper: Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Render star rating HTML
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) starsHtml += '★';
    if (halfStar) starsHtml += '½';
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
    return `<span class="stars">${starsHtml}</span> <strong>${rating}/5</strong>`;
}

// Generate firmness bar visual
function firmnessBar(value) {
    const percent = (value / 10) * 100;
    return `<div class="firmness-bar"><div class="firmness-fill" style="width: ${percent}%;"></div></div>`;
}

// Render the complete detailed comparison page
function renderDetailedComparison(brandA, brandB) {
    const dataA = mattressData[brandA];
    const dataB = mattressData[brandB];
    
    if (!dataA || !dataB) {
        document.getElementById('comparisonContent').innerHTML = `
            <div class="error-message">
                <div class="section-tag">Error</div>
                <h2>Invalid Mattress Selection</h2>
                <p>One or both mattress brands could not be found. Please return to the comparison tool and select valid brands.</p>
                <a href="index.html" class="btn-primary" style="margin-top: 24px; display: inline-block;">Back to Comparison Tool</a>
            </div>
        `;
        return;
    }

    const accentA = dataA.accentColor || "#5E00FF";
    const accentB = dataB.accentColor || "#C800FF";

    const html = `
        <!-- Comparison Hero with Logos -->
        <div class="comparison-hero">
            <div class="brand-vs-logo">
                <div class="brand-item">
                    <img src="${dataA.logo}" alt="${brandA} logo" class="brand-logo-large" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <h3 style="display: none;">${brandA}</h3>
                    <div class="brand-name-header">${brandA}</div>
                    <div class="star-rating">${renderStars(dataA.rating)}</div>
                </div>
                <div class="vs-circle">VS</div>
                <div class="brand-item">
                    <img src="${dataB.logo}" alt="${brandB} logo" class="brand-logo-large" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <h3 style="display: none;">${brandB}</h3>
                    <div class="brand-name-header">${brandB}</div>
                    <div class="star-rating">${renderStars(dataB.rating)}</div>
                </div>
            </div>
            <div class="benefits-strip">
                <div class="benefit-item"><span>✅</span> Free delivery across US & Canada</div>
                <div class="benefit-item"><span>💰</span> Best price guarantee</div>
                <div class="benefit-item"><span>🌙</span> Extended 120-day sleep trial</div>
                <div class="benefit-item"><span>🛏️</span> Free in-store mattress testing</div>
            </div>
        </div>

        <!-- Quick Comparison Cards -->
        <div class="quick-cards">
            <div class="quick-card">
                <img src="${dataA.logo}" alt="${brandA}" style="max-height: 48px; object-fit: contain;" onerror="this.style.display='none'">
                <div class="feature-tags">
                    ${dataA.keyFeatures.map(f => `<span class="tag">${f}</span>`).join('')}
                </div>
                <p><strong>${dataA.tagline}</strong></p>
                <div><strong>Price:</strong> ${dataA.price}</div>
                <div><strong>Type:</strong> ${dataA.type}</div>
                <div><strong>Firmness:</strong> ${dataA.firmnessText} ${firmnessBar(dataA.firmness)}</div>
                <div><strong>Best For:</strong> ${dataA.bestFor}</div>
                <div style="margin-top: 20px;"><a href="#" class="btn-outline" style="display: inline-block; padding: 10px 20px; font-size: 14px;">Visit Store</a></div>
            </div>
            <div class="quick-card">
                <img src="${dataB.logo}" alt="${brandB}" style="max-height: 48px; object-fit: contain;" onerror="this.style.display='none'">
                <div class="feature-tags">
                    ${dataB.keyFeatures.map(f => `<span class="tag">${f}</span>`).join('')}
                </div>
                <p><strong>${dataB.tagline}</strong></p>
                <div><strong>Price:</strong> ${dataB.price}</div>
                <div><strong>Type:</strong> ${dataB.type}</div>
                <div><strong>Firmness:</strong> ${dataB.firmnessText} ${firmnessBar(dataB.firmness)}</div>
                <div><strong>Best For:</strong> ${dataB.bestFor}</div>
                <div style="margin-top: 20px;"><a href="#" class="btn-outline" style="display: inline-block; padding: 10px 20px; font-size: 14px;">Visit Store</a></div>
            </div>
        </div>

        <!-- Detailed Specs Table -->
        <div class="spec-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr><th>Specifications</th><th>${brandA}</th><th>${brandB}</th></tr>
                </thead>
                <tbody>
                    <tr><td class="spec-label">Mattress Type</td><td>${dataA.type}</td><td>${dataB.type}</td></tr>
                    <tr><td class="spec-label">Firmness (1-10)</td><td>${dataA.firmnessText} (${dataA.firmness}/10) ${firmnessBar(dataA.firmness)}</td><td>${dataB.firmnessText} (${dataB.firmness}/10) ${firmnessBar(dataB.firmness)}</td></tr>
                    <tr><td class="spec-label">Price Range (Queen)</td><td>${dataA.price}</td><td>${dataB.price}</td></tr>
                    <tr><td class="spec-label">Overall Rating</td><td>${dataA.rating} ★ (expert score)</td><td>${dataB.rating} ★ (expert score)</td></tr>
                    <tr><td class="spec-label">Materials</td><td>${dataA.materials}</td><td>${dataB.materials}</td></tr>
                    <tr><td class="spec-label">Warranty</td><td>${dataA.warranty}</td><td>${dataB.warranty}</td></tr>
                    <tr><td class="spec-label">Sleep Trial</td><td>${dataA.trial}</td><td>${dataB.trial}</td></tr>
                    <tr><td class="spec-label">Cooling Technology</td><td>${dataA.cooling}</td><td>${dataB.cooling}</td></tr>
                    <tr><td class="spec-label">Motion Isolation</td><td>${dataA.motionIsolation}</td><td>${dataB.motionIsolation}</td></tr>
                    <tr><td class="spec-label">Edge Support</td><td>${dataA.edgeSupport}</td><td>${dataB.edgeSupport}</td></tr>
                    <tr><td class="spec-label">Best For Sleep Position</td><td>${dataA.bestFor}</td><td>${dataB.bestFor}</td></tr>
                    <tr><td class="spec-label">Available Sizes</td><td>${dataA.sizes.join(', ')}</td><td>${dataB.sizes.join(', ')}</td></tr>
                    <tr><td class="spec-label">Shipping & Delivery</td><td>${dataA.shipping}</td><td>${dataB.shipping}</td></tr>
                </tbody>
            </table>
        </div>

        <!-- Radar Chart: 5 Elements -->
        <div class="chart-container">
            <div style="text-align: center; margin-bottom: 24px;">
                <div class="section-tag">Performance Score</div>
                <h3>The 5 Elements of Mattress Comparison</h3>
            </div>
            <div class="chart-canvas-wrapper">
                <canvas id="radarChart" width="400" height="400" style="width:100%; height:auto;"></canvas>
            </div>
        </div>

        <!-- Expert & Customer Reviews Section -->
        <div class="review-grid">
            <div class="review-card">
                <h3>${brandA} Reviews</h3>
                <div class="star-rating">${renderStars(dataA.rating)} Expert Rating</div>
                <div><strong>Customer Reviews:</strong> ${dataA.customerRatingCount}+ ratings</div>
                <div>😴 Comfort: ${dataA.customerComfort || 4.6}/5 &nbsp; | &nbsp; 💪 Support: ${dataA.customerSupport || 4.5}/5</div>
                <div>❄️ Cooling: ${dataA.customerCooling || 4.3}/5</div>
                <div class="expert-quote">“${dataA.expertSummary}”</div>
                <a href="#" class="btn-outline" style="margin-top: 16px; display: inline-block;">Read More Reviews →</a>
            </div>
            <div class="review-card">
                <h3>${brandB} Reviews</h3>
                <div class="star-rating">${renderStars(dataB.rating)} Expert Rating</div>
                <div><strong>Customer Reviews:</strong> ${dataB.customerRatingCount}+ ratings</div>
                <div>😴 Comfort: ${dataB.customerComfort || 4.7}/5 &nbsp; | &nbsp; 💪 Support: ${dataB.customerSupport || 4.6}/5</div>
                <div>❄️ Cooling: ${dataB.customerCooling || 4.4}/5</div>
                <div class="expert-quote">“${dataB.expertSummary}”</div>
                <a href="#" class="btn-outline" style="margin-top: 16px; display: inline-block;">Read More Reviews →</a>
            </div>
        </div>

        <!-- In-Store Experience CTA -->
        <div class="cta-showroom">
            <h3>Experience the Difference In-Store</h3>
            <p>Test both ${brandA} and ${brandB} side-by-side at any SleePare showroom. Feel the materials, check the support, and get expert advice — no pressure, just honest help.</p>
            <a href="#" class="btn-primary">Find a Store Near You</a>
        </div>

        <!-- FAQ Section -->
        <section class="section faq-section" style="padding: 40px 0 80px;">
            <div class="section-header" style="margin-bottom: 32px;">
                <div class="section-tag">Common Questions</div>
                <h2>Frequently Asked Questions</h2>
            </div>
            <div class="faq-list">
                <div class="faq-item">
                    <div class="faq-question">What is the best type of mattress? <span class="faq-icon">+</span></div>
                    <div class="faq-answer">Memory foam and hybrid offer different benefits; your sleep position matters most. Try in-store to decide.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">Which mattress is better for back pain? <span class="faq-icon">+</span></div>
                    <div class="faq-answer">Hybrids with zoned support like Saatva or Casper are often recommended by chiropractors.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">How long is the sleep trial? <span class="faq-icon">+</span></div>
                    <div class="faq-answer">Most brands offer 100-night trials; some provide up to 365 nights (Nest, DreamCloud).</div>
                </div>
            </div>
        </section>
    `;

    document.getElementById('comparisonContent').innerHTML = html;

    // Initialize Radar Chart after DOM injection
    setTimeout(() => {
        const ctx = document.getElementById('radarChart')?.getContext('2d');
        if (ctx) {
            const scoresA = [dataA.scores.type, dataA.scores.support, dataA.scores.value, dataA.scores.price, dataA.scores.materials];
            const scoresB = [dataB.scores.type, dataB.scores.support, dataB.scores.value, dataB.scores.price, dataB.scores.materials];
            
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Mattress Type', 'Support & Comfort', 'Overall Value', 'Price', 'Materials & Cooling'],
                    datasets: [
                        {
                            label: brandA,
                            data: scoresA,
                            backgroundColor: `${accentA}30`,
                            borderColor: accentA,
                            borderWidth: 2,
                            pointBackgroundColor: accentA,
                            pointBorderColor: '#fff',
                            pointRadius: 5,
                            pointHoverRadius: 7
                        },
                        {
                            label: brandB,
                            data: scoresB,
                            backgroundColor: `${accentB}30`,
                            borderColor: accentB,
                            borderWidth: 2,
                            pointBackgroundColor: accentB,
                            pointBorderColor: '#fff',
                            pointRadius: 5,
                            pointHoverRadius: 7
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                backdropColor: 'transparent'
                            },
                            grid: {
                                color: '#e9ecef'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}/10`
                            }
                        },
                        legend: {
                            position: 'top',
                            labels: {
                                font: { family: 'Work Sans', size: 12, weight: '600' },
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }
    }, 50);

    // Initialize FAQ accordion for newly added items
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question && !item.dataset.listener) {
            item.dataset.listener = 'true';
            question.addEventListener('click', () => item.classList.toggle('active'));
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const compareParam = getUrlParameter('compare');
    
    if (compareParam && compareParam.includes('|')) {
        const [brand1, brand2] = compareParam.split('|');
        if (brand1 && brand2 && mattressData[brand1] && mattressData[brand2]) {
            renderDetailedComparison(brand1, brand2);
        } else {
            document.getElementById('comparisonContent').innerHTML = `
                <div class="error-message">
                    <div class="section-tag">Error</div>
                    <h2>Invalid Comparison</h2>
                    <p>The brands you're trying to compare could not be found. Please go back and select valid mattresses.</p>
                    <a href="index.html" class="btn-primary" style="margin-top: 24px;">Back to Comparison Tool</a>
                </div>
            `;
        }
    } else {
        document.getElementById('comparisonContent').innerHTML = `
            <div class="error-message">
                <div class="section-tag">Welcome</div>
                <h2>No Mattresses Selected</h2>
                <p>Use the main comparison tool to select two mattresses and view an in-depth side-by-side analysis.</p>
                <a href="index.html" class="btn-primary" style="margin-top: 24px;">Start Comparing</a>
            </div>
        `;
    }
});