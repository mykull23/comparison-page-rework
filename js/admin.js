// ============================================
// SLEEPARE MATTRESS ADMIN PANEL
// Complete CRUD with View Modal, File Upload, Beautified JSON
// ============================================

let currentEditBrand = null;
let currentModalBrand = null;

// Normalized default values
const DEFAULT_BRAND = {
    logo: "",
    rating: 4.5,
    warranty: "10 years",
    trial: "100 nights",
    expertSummary: "",
    accentColor: "#2C5F8A",
    scores: {
        type: 7,
        support: 7,
        value: 7,
        price: 7,
        materials: 7
    },
    customerRatingCount: 0,
    customerComfort: 4.5,
    customerSupport: 4.5,
    customerCooling: 4.5,
    models: []
};

const DEFAULT_MODEL = {
    name: "",
    type: "Hybrid",
    typeCategory: "hybrid",
    firmness: 6,
    firmnessText: "Medium",
    price: "",
    priceValue: 0,
    bestFor: "",
    sleepPosition: [],
    keyFeatures: [],
    tagline: "",
    cooling: "",
    motionIsolation: "Good",
    edgeSupport: "Good"
};

// Valid options
const VALID_TYPES = ["Memory Foam", "Hybrid", "Latex", "Natural Latex", "Hybrid / Latex", "Flippable Foam"];
const VALID_TYPE_CATEGORIES = ["foam", "hybrid", "latex"];
const VALID_SLEEP_POSITIONS = ["back", "side", "stomach", "combination"];
const VALID_MOTION_EDGE = ["Poor", "Good", "Very Good", "Excellent"];

// Helper: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Helper: Ensure number fields only accept numbers
function enforceNumberInputs() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let val = this.value;
            if (val !== '' && isNaN(parseFloat(val))) {
                this.value = this.value.replace(/[^0-9.-]/g, '');
            }
        });
    });
}

// Helper: Handle logo file upload
function setupLogoUpload(container) {
    const fileInput = container.querySelector('.logo-file-input');
    const urlInput = container.querySelector('.logo-url-input');
    const preview = container.querySelector('.logo-preview-img');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (urlInput) urlInput.value = event.target.result;
                    if (preview) preview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (urlInput) {
        urlInput.addEventListener('input', function(e) {
            if (preview) preview.src = e.target.value;
        });
    }
}

// Helper: Beautify JSON with syntax highlighting
function beautifyJSON(data) {
    const jsonString = JSON.stringify(data, null, 2);
    return jsonString.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
}

// Normalize functions
function normalizeBrand(data) {
    return {
        logo: data.logo || DEFAULT_BRAND.logo,
        rating: typeof data.rating === 'number' ? data.rating : DEFAULT_BRAND.rating,
        warranty: data.warranty || DEFAULT_BRAND.warranty,
        trial: data.trial || DEFAULT_BRAND.trial,
        expertSummary: data.expertSummary || DEFAULT_BRAND.expertSummary,
        accentColor: data.accentColor || DEFAULT_BRAND.accentColor,
        scores: {
            type: data.scores?.type || DEFAULT_BRAND.scores.type,
            support: data.scores?.support || DEFAULT_BRAND.scores.support,
            value: data.scores?.value || DEFAULT_BRAND.scores.value,
            price: data.scores?.price || DEFAULT_BRAND.scores.price,
            materials: data.scores?.materials || DEFAULT_BRAND.scores.materials
        },
        customerRatingCount: data.customerRatingCount || DEFAULT_BRAND.customerRatingCount,
        customerComfort: data.customerComfort || DEFAULT_BRAND.customerComfort,
        customerSupport: data.customerSupport || DEFAULT_BRAND.customerSupport,
        customerCooling: data.customerCooling || DEFAULT_BRAND.customerCooling,
        models: Array.isArray(data.models) ? data.models.map(normalizeModel) : []
    };
}

function normalizeModel(model) {
    return {
        name: model.name || DEFAULT_MODEL.name,
        type: VALID_TYPES.includes(model.type) ? model.type : DEFAULT_MODEL.type,
        typeCategory: VALID_TYPE_CATEGORIES.includes(model.typeCategory) ? model.typeCategory : DEFAULT_MODEL.typeCategory,
        firmness: typeof model.firmness === 'number' ? Math.min(10, Math.max(1, model.firmness)) : DEFAULT_MODEL.firmness,
        firmnessText: model.firmnessText || DEFAULT_MODEL.firmnessText,
        price: model.price || DEFAULT_MODEL.price,
        priceValue: typeof model.priceValue === 'number' ? model.priceValue : DEFAULT_MODEL.priceValue,
        bestFor: model.bestFor || DEFAULT_MODEL.bestFor,
        sleepPosition: Array.isArray(model.sleepPosition) ? model.sleepPosition.filter(p => VALID_SLEEP_POSITIONS.includes(p)) : [],
        keyFeatures: Array.isArray(model.keyFeatures) ? model.keyFeatures : [],
        tagline: model.tagline || DEFAULT_MODEL.tagline,
        cooling: model.cooling || DEFAULT_MODEL.cooling,
        motionIsolation: VALID_MOTION_EDGE.includes(model.motionIsolation) ? model.motionIsolation : DEFAULT_MODEL.motionIsolation,
        edgeSupport: VALID_MOTION_EDGE.includes(model.edgeSupport) ? model.edgeSupport : DEFAULT_MODEL.edgeSupport
    };
}

// Show status message
function showStatus(message, isError = false) {
    const statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) return;
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
    statusDiv.style.display = 'block';
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// Confirm action
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Save to localStorage
function saveToLocalStorage() {
    const dataToSave = {
        mattresses: window.mattressData,
        topComparisons: window.topComparisons
    };
    localStorage.setItem('sleepare_mattress_data', JSON.stringify(dataToSave));
}

// Load data
async function loadAdminData() {
    const saved = localStorage.getItem('sleepare_mattress_data');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            window.mattressData = {};
            Object.keys(parsed.mattresses).forEach(brand => {
                window.mattressData[brand] = normalizeBrand(parsed.mattresses[brand]);
            });
            window.topComparisons = parsed.topComparisons || [];
            console.log('✅ Loaded from localStorage');
            return true;
        } catch (e) {
            console.error('Error parsing localStorage', e);
        }
    }
    
    if (Object.keys(window.mattressData).length === 0) {
        await loadMattressData();
        Object.keys(window.mattressData).forEach(brand => {
            window.mattressData[brand] = normalizeBrand(window.mattressData[brand]);
        });
    }
    return Object.keys(window.mattressData).length > 0;
}

// Get model form HTML with number enforcement
function getModelFormTemplate(index, modelData = null) {
    const m = modelData ? normalizeModel(modelData) : { ...DEFAULT_MODEL };
    
    return `
        <div class="model-item" data-model-index="${index}">
            <div class="model-header">
                <h4>Model ${index + 1}</h4>
                <button type="button" class="btn-icon remove-model-btn" data-index="${index}" ${index === 0 ? 'disabled' : ''}>✕ Remove</button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Model Name *</label>
                    <input type="text" class="model-name" value="${escapeHtml(m.name)}" placeholder="e.g., Avocado Green" required>
                </div>
                <div class="form-group">
                    <label>Tagline</label>
                    <input type="text" class="model-tagline" value="${escapeHtml(m.tagline)}" placeholder="Short description for this model">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Type</label>
                    <select class="model-type">
                        ${VALID_TYPES.map(t => `<option value="${t}" ${m.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Type Category</label>
                    <select class="model-type-category">
                        ${VALID_TYPE_CATEGORIES.map(c => `<option value="${c}" ${m.typeCategory === c ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
                    </select>
                    <small>Used for filtering</small>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Firmness (1-10)</label>
                    <input type="number" class="model-firmness" min="1" max="10" step="0.5" value="${m.firmness}">
                    <small>1=Softest, 10=Firmest</small>
                </div>
                <div class="form-group">
                    <label>Firmness Text</label>
                    <input type="text" class="model-firmness-text" value="${escapeHtml(m.firmnessText)}" placeholder="e.g., Medium, Firm, Soft">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Price Range</label>
                    <input type="text" class="model-price" value="${escapeHtml(m.price)}" placeholder="$1,299 – $2,399">
                </div>
                <div class="form-group">
                    <label>Price Value (numeric)</label>
                    <input type="number" class="model-price-value" value="${m.priceValue}" placeholder="1599">
                    <small>Used for budget filtering</small>
                </div>
            </div>
            
            <div class="form-group">
                <label>Best For</label>
                <input type="text" class="model-best-for" value="${escapeHtml(m.bestFor)}" placeholder="Eco-conscious, back sleepers, hot sleepers">
            </div>
            
            <div class="form-group">
                <label>Sleep Positions</label>
                <div class="checkbox-group">
                    ${VALID_SLEEP_POSITIONS.map(pos => `
                        <label>
                            <input type="checkbox" class="sleep-position" value="${pos}" ${m.sleepPosition.includes(pos) ? 'checked' : ''}>
                            ${pos.charAt(0).toUpperCase() + pos.slice(1)}
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="form-group">
                <label>Key Features</label>
                <input type="text" class="model-features" value="${escapeHtml(m.keyFeatures.join(', '))}" placeholder="Organic, Natural Latex, Eco-friendly (comma separated)">
                <small>Separate with commas</small>
            </div>
            
            <div class="form-group">
                <label>Cooling Technology</label>
                <input type="text" class="model-cooling" value="${escapeHtml(m.cooling)}" placeholder="Natural latex, organic cotton, gel-infused foam">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Motion Isolation</label>
                    <select class="model-motion">
                        ${VALID_MOTION_EDGE.map(opt => `<option value="${opt}" ${m.motionIsolation === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Edge Support</label>
                    <select class="model-edge">
                        ${VALID_MOTION_EDGE.map(opt => `<option value="${opt}" ${m.edgeSupport === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <hr class="model-divider">
        </div>
    `;
}

// Build data from form
function buildMattressDataFromForm(formContainer) {
    const brandName = formContainer.querySelector('#brandName')?.value;
    const logo = formContainer.querySelector('#logoUrl')?.value || '';
    const tagline = formContainer.querySelector('#tagline')?.value || '';
    const expertSummary = formContainer.querySelector('#expertSummary')?.value || '';
    const overallRating = parseFloat(formContainer.querySelector('#overallRating')?.value) || 4.5;
    const warranty = formContainer.querySelector('#warranty')?.value || '10 years';
    const trial = formContainer.querySelector('#trial')?.value || '100 nights';
    const accentColor = formContainer.querySelector('#accentColor')?.value || '#2C5F8A';
    
    const scores = {
        type: parseInt(formContainer.querySelector('#scoreType')?.value) || 7,
        support: parseInt(formContainer.querySelector('#scoreSupport')?.value) || 7,
        value: parseInt(formContainer.querySelector('#scoreValue')?.value) || 7,
        price: parseInt(formContainer.querySelector('#scorePrice')?.value) || 7,
        materials: parseInt(formContainer.querySelector('#scoreMaterials')?.value) || 7
    };
    
    const customerRatingCount = parseInt(formContainer.querySelector('#customerRatingCount')?.value) || 0;
    const customerComfort = parseFloat(formContainer.querySelector('#customerComfort')?.value) || 4.5;
    const customerSupport = parseFloat(formContainer.querySelector('#customerSupport')?.value) || 4.5;
    const customerCooling = parseFloat(formContainer.querySelector('#customerCooling')?.value) || 4.5;
    
    const models = [];
    const modelItems = formContainer.querySelectorAll('.model-item');
    modelItems.forEach(item => {
        const sleepPositions = Array.from(item.querySelectorAll('.sleep-position:checked')).map(cb => cb.value);
        const featuresInput = item.querySelector('.model-features')?.value || '';
        const keyFeatures = featuresInput.split(',').map(f => f.trim()).filter(f => f);
        
        models.push({
            name: item.querySelector('.model-name')?.value || '',
            type: item.querySelector('.model-type')?.value || 'Hybrid',
            typeCategory: item.querySelector('.model-type-category')?.value || 'hybrid',
            firmness: parseFloat(item.querySelector('.model-firmness')?.value) || 6,
            firmnessText: item.querySelector('.model-firmness-text')?.value || 'Medium',
            price: item.querySelector('.model-price')?.value || '',
            priceValue: parseInt(item.querySelector('.model-price-value')?.value) || 0,
            bestFor: item.querySelector('.model-best-for')?.value || '',
            sleepPosition: sleepPositions,
            keyFeatures: keyFeatures,
            tagline: tagline,
            cooling: item.querySelector('.model-cooling')?.value || '',
            motionIsolation: item.querySelector('.model-motion')?.value || 'Good',
            edgeSupport: item.querySelector('.model-edge')?.value || 'Good'
        });
    });
    
    return {
        brandName,
        data: {
            logo,
            models,
            rating: overallRating,
            warranty,
            trial,
            expertSummary,
            accentColor,
            scores,
            customerRatingCount,
            customerComfort,
            customerSupport,
            customerCooling
        }
    };
}

// Logo upload component HTML
function getLogoUploadHtml(currentUrl = '') {
    return `
        <div class="file-input-wrapper">
            <input type="file" class="logo-file-input" accept="image/*">
            <input type="text" class="logo-url-input" id="logoUrl" value="${escapeHtml(currentUrl)}" placeholder="https://example.com/logo.png or /assets/images/brands/logo.png">
        </div>
        <div class="logo-preview">
            <img class="logo-preview-img" src="${escapeHtml(currentUrl)}" alt="Logo preview" style="max-width: 80px; max-height: 40px; display: ${currentUrl ? 'block' : 'none'}">
            <small>Upload a file or enter a URL</small>
        </div>
    `;
}

// Render edit form
function renderEditForm(brandName) {
    const brand = window.mattressData[brandName];
    if (!brand) return;
    
    const container = document.getElementById('editFormContainer');
    if (!container) return;
    
    const normalizedBrand = normalizeBrand(brand);
    const currentTagline = normalizedBrand.models?.[0]?.tagline || '';
    
    const html = `
        <form id="editMattressForm">
            <fieldset>
                <legend>Brand Identity</legend>
                <div class="form-group">
                    <label>Brand Name *</label>
                    <input type="text" id="brandName" value="${escapeHtml(brandName)}" required>
                </div>
                <div class="form-group">
                    <label>Logo URL *</label>
                    ${getLogoUploadHtml(normalizedBrand.logo)}
                </div>
                <div class="form-group">
                    <label>Tagline</label>
                    <input type="text" id="tagline" value="${escapeHtml(currentTagline)}" placeholder="Short phrase shown on cards">
                </div>
                <div class="form-group">
                    <label>Expert Summary</label>
                    <textarea id="expertSummary" rows="3">${escapeHtml(normalizedBrand.expertSummary)}</textarea>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Expert Scores (1-10)</legend>
                <div class="score-grid">
                    <div class="form-group">
                        <label>Material Type</label>
                        <input type="number" id="scoreType" min="1" max="10" value="${normalizedBrand.scores.type}">
                    </div>
                    <div class="form-group">
                        <label>Support</label>
                        <input type="number" id="scoreSupport" min="1" max="10" value="${normalizedBrand.scores.support}">
                    </div>
                    <div class="form-group">
                        <label>Value</label>
                        <input type="number" id="scoreValue" min="1" max="10" value="${normalizedBrand.scores.value}">
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" id="scorePrice" min="1" max="10" value="${normalizedBrand.scores.price}">
                    </div>
                    <div class="form-group">
                        <label>Materials</label>
                        <input type="number" id="scoreMaterials" min="1" max="10" value="${normalizedBrand.scores.materials}">
                    </div>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Overall Rating</legend>
                <div class="form-group">
                    <label>Star Rating (1-5)</label>
                    <input type="number" id="overallRating" min="1" max="5" step="0.1" value="${normalizedBrand.rating}" required>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Customer Review Data</legend>
                <div class="form-group">
                    <label>Number of Reviews</label>
                    <input type="number" id="customerRatingCount" min="0" value="${normalizedBrand.customerRatingCount}">
                </div>
                <div class="score-grid">
                    <div class="form-group">
                        <label>Comfort Rating (1-5)</label>
                        <input type="number" id="customerComfort" min="1" max="5" step="0.1" value="${normalizedBrand.customerComfort}">
                    </div>
                    <div class="form-group">
                        <label>Support Rating (1-5)</label>
                        <input type="number" id="customerSupport" min="1" max="5" step="0.1" value="${normalizedBrand.customerSupport}">
                    </div>
                    <div class="form-group">
                        <label>Cooling Rating (1-5)</label>
                        <input type="number" id="customerCooling" min="1" max="5" step="0.1" value="${normalizedBrand.customerCooling}">
                    </div>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Warranty & Trial</legend>
                <div class="form-row">
                    <div class="form-group">
                        <label>Warranty</label>
                        <input type="text" id="warranty" value="${escapeHtml(normalizedBrand.warranty)}">
                    </div>
                    <div class="form-group">
                        <label>Trial Period</label>
                        <input type="text" id="trial" value="${escapeHtml(normalizedBrand.trial)}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Accent Color</label>
                    <input type="color" id="accentColor" value="${normalizedBrand.accentColor}">
                    <small>Used for brand highlighting</small>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Mattress Models</legend>
                <div id="modelsContainer">
                    ${normalizedBrand.models.map((model, idx) => getModelFormTemplate(idx, model)).join('')}
                </div>
                <button type="button" id="addModelBtn" class="btn-outline" style="margin-top: 16px;">+ Add Another Model</button>
            </fieldset>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary">Save Changes</button>
                <button type="button" id="deleteBrandBtn" class="btn-danger">Delete This Brand</button>
            </div>
        </form>
    `;
    
    container.innerHTML = html;
    container.style.display = 'block';
    
    // Setup logo upload
    setupLogoUpload(container);
    
    // Enforce number inputs
    enforceNumberInputs();
    
    attachModelListeners();
    
    document.getElementById('editMattressForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveBrandEdit(brandName);
    });
    
    document.getElementById('deleteBrandBtn')?.addEventListener('click', () => {
        confirmAction(`Are you sure you want to delete "${brandName}"? This action cannot be undone.`, () => {
            deleteBrand(brandName);
        });
    });
}

function attachModelListeners() {
    const addBtn = document.getElementById('addModelBtn');
    if (addBtn) {
        addBtn.onclick = () => {
            const container = document.getElementById('modelsContainer');
            const count = container.querySelectorAll('.model-item').length;
            container.insertAdjacentHTML('beforeend', getModelFormTemplate(count));
            attachRemoveListeners();
            enforceNumberInputs();
        };
    }
    attachRemoveListeners();
}

function attachRemoveListeners() {
    document.querySelectorAll('.remove-model-btn').forEach(btn => {
        btn.onclick = (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            const container = document.getElementById('modelsContainer');
            const models = container.querySelectorAll('.model-item');
            if (models.length > 1) {
                confirmAction('Remove this model?', () => {
                    models[index].remove();
                    container.querySelectorAll('.model-item').forEach((item, idx) => {
                        item.setAttribute('data-model-index', idx);
                        const header = item.querySelector('h4');
                        if (header) header.textContent = `Model ${idx + 1}`;
                        const rmBtn = item.querySelector('.remove-model-btn');
                        if (rmBtn) {
                            rmBtn.setAttribute('data-index', idx);
                            rmBtn.disabled = idx === 0;
                        }
                    });
                });
            } else {
                showStatus('Cannot remove the last model. Add another model first.', true);
            }
        };
    });
}

function saveBrandEdit(originalBrandName) {
    const container = document.getElementById('editFormContainer');
    const newBrandName = container.querySelector('#brandName')?.value.trim();
    if (!newBrandName) {
        showStatus('Brand name is required', true);
        return;
    }
    
    const formData = buildMattressDataFromForm(container);
    
    if (newBrandName !== originalBrandName) {
        delete window.mattressData[originalBrandName];
        if (window.topComparisons) {
            window.topComparisons = window.topComparisons.map(comp => {
                if (comp.brand1 === originalBrandName) comp.brand1 = newBrandName;
                if (comp.brand2 === originalBrandName) comp.brand2 = newBrandName;
                return comp;
            });
        }
    }
    
    window.mattressData[newBrandName] = normalizeBrand(formData.data);
    saveToLocalStorage();
    showStatus(`✅ "${newBrandName}" saved successfully!`);
    populateBrandSelect();
    renderBrandsList();
    updateJsonPreview();
    renderEditForm(newBrandName);
}

function deleteBrand(brandName) {
    delete window.mattressData[brandName];
    if (window.topComparisons) {
        window.topComparisons = window.topComparisons.filter(comp => 
            comp.brand1 !== brandName && comp.brand2 !== brandName
        );
    }
    saveToLocalStorage();
    showStatus(`✅ "${brandName}" deleted`);
    populateBrandSelect();
    renderBrandsList();
    updateJsonPreview();
    
    const editContainer = document.getElementById('editFormContainer');
    if (editContainer) {
        editContainer.style.display = 'none';
        editContainer.innerHTML = '';
    }
    const brandSelect = document.getElementById('brandSelect');
    if (brandSelect) brandSelect.value = '';
    
    // Close modal if open
    const modal = document.getElementById('brandModal');
    if (modal) modal.style.display = 'none';
}

// Render brand view modal
function renderBrandModal(brandName) {
    const brand = window.mattressData[brandName];
    if (!brand) return;
    
    currentModalBrand = brandName;
    const modal = document.getElementById('brandModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = brandName;
    
    const normalizedBrand = normalizeBrand(brand);
    
    let modelsHtml = '';
    normalizedBrand.models.forEach((model, idx) => {
        modelsHtml += `
            <div class="model-card">
                <h4>${escapeHtml(model.name)}</h4>
                <div class="view-grid">
                    <div class="view-item"><label>Type</label><div class="view-value">${escapeHtml(model.type)}</div></div>
                    <div class="view-item"><label>Firmness</label><div class="view-value">${escapeHtml(model.firmnessText)} (${model.firmness}/10)</div></div>
                    <div class="view-item"><label>Price</label><div class="view-value">${escapeHtml(model.price)}</div></div>
                    <div class="view-item"><label>Best For</label><div class="view-value">${escapeHtml(model.bestFor)}</div></div>
                    <div class="view-item"><label>Sleep Positions</label><div class="view-value">${model.sleepPosition.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') || 'All positions'}</div></div>
                    <div class="view-item"><label>Cooling</label><div class="view-value">${escapeHtml(model.cooling) || 'Standard'}</div></div>
                    <div class="view-item"><label>Motion Isolation</label><div class="view-value">${model.motionIsolation}</div></div>
                    <div class="view-item"><label>Edge Support</label><div class="view-value">${model.edgeSupport}</div></div>
                </div>
                <div style="margin-top: 12px;">
                    <label>Key Features</label>
                    <div>${model.keyFeatures.map(f => `<span class="feature-tag">${escapeHtml(f)}</span>`).join('') || '—'}</div>
                </div>
                ${model.tagline ? `<div style="margin-top: 12px;"><label>Tagline</label><div class="view-value" style="font-style: italic;">${escapeHtml(model.tagline)}</div></div>` : ''}
            </div>
        `;
    });
    
    modalBody.innerHTML = `
        <div class="view-section">
            <h3>Brand Information</h3>
            <div class="view-grid">
                <div class="view-item"><label>Logo</label><div class="view-value"><img src="${escapeHtml(normalizedBrand.logo)}" alt="${escapeHtml(brandName)} logo" onerror="this.style.display='none'"></div></div>
                <div class="view-item"><label>Overall Rating</label><div class="view-value">${normalizedBrand.rating} / 5 ★</div></div>
                <div class="view-item"><label>Warranty</label><div class="view-value">${escapeHtml(normalizedBrand.warranty)}</div></div>
                <div class="view-item"><label>Trial Period</label><div class="view-value">${escapeHtml(normalizedBrand.trial)}</div></div>
                <div class="view-item"><label>Expert Summary</label><div class="view-value">${escapeHtml(normalizedBrand.expertSummary)}</div></div>
            </div>
        </div>
        
        <div class="view-section">
            <h3>Expert Scores (1-10)</h3>
            <div class="view-grid">
                <div class="view-item"><label>Material Type</label><div class="view-value">${normalizedBrand.scores.type}</div></div>
                <div class="view-item"><label>Support</label><div class="view-value">${normalizedBrand.scores.support}</div></div>
                <div class="view-item"><label>Value</label><div class="view-value">${normalizedBrand.scores.value}</div></div>
                <div class="view-item"><label>Price</label><div class="view-value">${normalizedBrand.scores.price}</div></div>
                <div class="view-item"><label>Materials</label><div class="view-value">${normalizedBrand.scores.materials}</div></div>
            </div>
        </div>
        
        <div class="view-section">
            <h3>Customer Reviews</h3>
            <div class="view-grid">
                <div class="view-item"><label>Total Reviews</label><div class="view-value">${normalizedBrand.customerRatingCount.toLocaleString()}</div></div>
                <div class="view-item"><label>Comfort Rating</label><div class="view-value">${normalizedBrand.customerComfort} / 5</div></div>
                <div class="view-item"><label>Support Rating</label><div class="view-value">${normalizedBrand.customerSupport} / 5</div></div>
                <div class="view-item"><label>Cooling Rating</label><div class="view-value">${normalizedBrand.customerCooling} / 5</div></div>
            </div>
        </div>
        
        <div class="view-section">
            <h3>Models (${normalizedBrand.models.length})</h3>
            ${modelsHtml || '<p>No models available</p>'}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Render add form
function renderAddForm() {
    const container = document.getElementById('addFormContainer');
    if (!container) return;
    
    container.innerHTML = `
        <form id="addMattressForm">
            <fieldset>
                <legend>Brand Identity</legend>
                <div class="form-group">
                    <label>Brand Name *</label>
                    <input type="text" id="brandName" required placeholder="e.g., Avocado, Casper, Nectar">
                </div>
                <div class="form-group">
                    <label>Logo URL *</label>
                    ${getLogoUploadHtml('')}
                </div>
                <div class="form-group">
                    <label>Tagline</label>
                    <input type="text" id="tagline" placeholder="e.g., The world's most comfortable mattress">
                </div>
                <div class="form-group">
                    <label>Expert Summary</label>
                    <textarea id="expertSummary" rows="3" placeholder="Expert review summary..."></textarea>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Expert Scores (1-10)</legend>
                <div class="score-grid">
                    <div class="form-group"><label>Material Type</label><input type="number" id="scoreType" min="1" max="10" value="7"></div>
                    <div class="form-group"><label>Support</label><input type="number" id="scoreSupport" min="1" max="10" value="7"></div>
                    <div class="form-group"><label>Value</label><input type="number" id="scoreValue" min="1" max="10" value="7"></div>
                    <div class="form-group"><label>Price</label><input type="number" id="scorePrice" min="1" max="10" value="7"></div>
                    <div class="form-group"><label>Materials</label><input type="number" id="scoreMaterials" min="1" max="10" value="7"></div>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Overall Rating</legend>
                <div class="form-group"><label>Star Rating (1-5)</label><input type="number" id="overallRating" min="1" max="5" step="0.1" value="4.5" required></div>
            </fieldset>
            
            <fieldset>
                <legend>Customer Review Data</legend>
                <div class="form-group"><label>Number of Reviews</label><input type="number" id="customerRatingCount" min="0" value="0"></div>
                <div class="score-grid">
                    <div class="form-group"><label>Comfort Rating</label><input type="number" id="customerComfort" min="1" max="5" step="0.1" value="4.5"></div>
                    <div class="form-group"><label>Support Rating</label><input type="number" id="customerSupport" min="1" max="5" step="0.1" value="4.5"></div>
                    <div class="form-group"><label>Cooling Rating</label><input type="number" id="customerCooling" min="1" max="5" step="0.1" value="4.5"></div>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Warranty & Trial</legend>
                <div class="form-row">
                    <div class="form-group"><label>Warranty</label><input type="text" id="warranty" value="10 years"></div>
                    <div class="form-group"><label>Trial Period</label><input type="text" id="trial" value="100 nights"></div>
                </div>
                <div class="form-group"><label>Accent Color</label><input type="color" id="accentColor" value="#2C5F8A"></div>
            </fieldset>
            
            <fieldset>
                <legend>Mattress Models</legend>
                <div id="modelsContainer">
                    ${getModelFormTemplate(0)}
                </div>
                <button type="button" id="addModelBtn" class="btn-outline" style="margin-top: 16px;">+ Add Another Model</button>
            </fieldset>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary">Create Mattress</button>
            </div>
        </form>
    `;
    
    setupLogoUpload(container);
    enforceNumberInputs();
    attachModelListeners();
    
    document.getElementById('addMattressForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewMattress();
    });
}

function addNewMattress() {
    const container = document.getElementById('addFormContainer');
    const formData = buildMattressDataFromForm(container);
    const brandName = formData.brandName;
    
    if (!brandName) {
        showStatus('Brand name is required', true);
        return;
    }
    
    if (window.mattressData[brandName]) {
        showStatus(`Brand "${brandName}" already exists!`, true);
        return;
    }
    
    window.mattressData[brandName] = normalizeBrand(formData.data);
    saveToLocalStorage();
    showStatus(`✅ "${brandName}" added successfully!`);
    populateBrandSelect();
    renderBrandsList();
    updateJsonPreview();
    renderAddForm();
    
    document.querySelector('.admin-tab[data-tab="edit"]').click();
}

function populateBrandSelect() {
    const select = document.getElementById('brandSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select a mattress brand --</option>';
    Object.keys(window.mattressData).sort().forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        select.appendChild(option);
    });
}

function renderBrandsList() {
    const container = document.getElementById('brandsListContainer');
    if (!container) return;
    
    const brands = Object.keys(window.mattressData).sort();
    if (brands.length === 0) {
        container.innerHTML = '<p style="color: #8e9aab;">No mattresses found. Use the "Add Mattress" tab to create one.</p>';
        return;
    }
    
    container.innerHTML = brands.map(brand => {
        const data = window.mattressData[brand];
        const modelCount = data.models?.length || 0;
        return `
            <div class="brand-list-item" data-brand="${escapeHtml(brand)}">
                <div class="brand-list-info">
                    <div class="brand-list-name">${escapeHtml(brand)}</div>
                    <div class="brand-list-models">${modelCount} model(s) • Rating: ${data.rating}/5</div>
                </div>
                <div class="brand-list-actions">
                    <button class="btn-outline edit-brand-btn" data-brand="${escapeHtml(brand)}" style="padding: 6px 14px;">✏️ Edit</button>
                    <button class="btn-danger delete-brand-btn" data-brand="${escapeHtml(brand)}" style="padding: 6px 14px;">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Make entire card clickable for view
    document.querySelectorAll('.brand-list-item').forEach(card => {
        const brand = card.getAttribute('data-brand');
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (e.target.closest('.edit-brand-btn') || e.target.closest('.delete-brand-btn')) return;
            renderBrandModal(brand);
        });
    });
    
    document.querySelectorAll('.edit-brand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const brand = btn.getAttribute('data-brand');
            const select = document.getElementById('brandSelect');
            if (select) {
                select.value = brand;
                renderEditForm(brand);
                document.querySelector('.admin-tab[data-tab="edit"]').click();
                // Close modal if open
                const modal = document.getElementById('brandModal');
                if (modal) modal.style.display = 'none';
            }
        });
    });
    
    document.querySelectorAll('.delete-brand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const brand = btn.getAttribute('data-brand');
            confirmAction(`Are you sure you want to delete "${brand}"? This action cannot be undone.`, () => {
                deleteBrand(brand);
            });
        });
    });
}

function updateJsonPreview() {
    const preview = document.getElementById('jsonPreview');
    if (preview) {
        const exportData = {
            mattresses: window.mattressData,
            topComparisons: window.topComparisons
        };
        preview.innerHTML = beautifyJSON(exportData);
    }
}

function exportData() {
    const exportData = {
        mattresses: window.mattressData,
        topComparisons: window.topComparisons
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mattresses_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('✅ Data exported successfully!');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.mattresses && imported.topComparisons !== undefined) {
                confirmAction('Importing will replace all current data. Continue?', () => {
                    window.mattressData = {};
                    Object.keys(imported.mattresses).forEach(brand => {
                        window.mattressData[brand] = normalizeBrand(imported.mattresses[brand]);
                    });
                    window.topComparisons = imported.topComparisons || [];
                    saveToLocalStorage();
                    showStatus('✅ Data imported successfully!');
                    populateBrandSelect();
                    renderBrandsList();
                    updateJsonPreview();
                    
                    const editContainer = document.getElementById('editFormContainer');
                    if (editContainer) {
                        editContainer.style.display = 'none';
                        editContainer.innerHTML = '';
                    }
                    const brandSelect = document.getElementById('brandSelect');
                    if (brandSelect) brandSelect.value = '';
                });
            } else {
                showStatus('Invalid JSON: missing "mattresses" or "topComparisons"', true);
            }
        } catch (err) {
            showStatus('Error parsing JSON: ' + err.message, true);
        }
    };
    reader.readAsText(file);
}

function copyJsonToClipboard() {
    const preview = document.getElementById('jsonPreview');
    if (preview) {
        const exportData = {
            mattresses: window.mattressData,
            topComparisons: window.topComparisons
        };
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
        showStatus('✅ JSON copied to clipboard!');
    }
}

function initAdmin() {
    loadAdminData().then(() => {
        console.log('✅ Admin ready, brands:', Object.keys(window.mattressData).length);
        
        populateBrandSelect();
        renderBrandsList();
        updateJsonPreview();
        renderAddForm();
        
        // Tab switching
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.admin-panel').forEach(panel => panel.classList.remove('active'));
                document.getElementById(`${tabId}Panel`).classList.add('active');
            });
        });
        
        // Brand select
        const brandSelect = document.getElementById('brandSelect');
        if (brandSelect) {
            brandSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    renderEditForm(e.target.value);
                } else {
                    const editContainer = document.getElementById('editFormContainer');
                    if (editContainer) {
                        editContainer.style.display = 'none';
                        editContainer.innerHTML = '';
                    }
                }
            });
        }
        
        // Export/Import
        document.getElementById('exportBtn')?.addEventListener('click', exportData);
        document.getElementById('importBtn')?.addEventListener('click', () => {
            const fileInput = document.getElementById('importFile');
            if (fileInput?.files.length) importData(fileInput.files[0]);
            else showStatus('Please select a JSON file first', true);
        });
        
        // Copy JSON button
        document.getElementById('copyJsonBtn')?.addEventListener('click', copyJsonToClipboard);
        
        // Refresh
        document.getElementById('refreshDataBtn')?.addEventListener('click', () => {
            confirmAction('Refresh will reload from the original JSON file and discard any unsaved changes. Continue?', () => {
                localStorage.removeItem('sleepare_mattress_data');
                loadMattressData().then(() => {
                    Object.keys(window.mattressData).forEach(brand => {
                        window.mattressData[brand] = normalizeBrand(window.mattressData[brand]);
                    });
                    saveToLocalStorage();
                    populateBrandSelect();
                    renderBrandsList();
                    updateJsonPreview();
                    const editContainer = document.getElementById('editFormContainer');
                    if (editContainer) {
                        editContainer.style.display = 'none';
                        editContainer.innerHTML = '';
                    }
                    showStatus('✅ Data refreshed from JSON file');
                });
            });
        });
        
        // Modal close handlers
        const modal = document.getElementById('brandModal');
        const closeBtn = modal?.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Modal edit button
        const modalEditBtn = document.getElementById('modalEditBtn');
        if (modalEditBtn) {
            modalEditBtn.addEventListener('click', () => {
                if (currentModalBrand) {
                    const select = document.getElementById('brandSelect');
                    if (select) {
                        select.value = currentModalBrand;
                        renderEditForm(currentModalBrand);
                        document.querySelector('.admin-tab[data-tab="edit"]').click();
                        modal.style.display = 'none';
                    }
                }
            });
        }
        
        // Modal delete button
        const modalDeleteBtn = document.getElementById('modalDeleteBtn');
        if (modalDeleteBtn) {
            modalDeleteBtn.addEventListener('click', () => {
                if (currentModalBrand) {
                    confirmAction(`Are you sure you want to delete "${currentModalBrand}"? This action cannot be undone.`, () => {
                        deleteBrand(currentModalBrand);
                        modal.style.display = 'none';
                    });
                }
            });
        }
        
        window.addEventListener('click', (e) => {
            if (modal && e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        console.log('✅ Admin panel ready');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadMattressData === 'function') initAdmin();
    else setTimeout(initAdmin, 500);
});