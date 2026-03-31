// Admin Panel - Mattress Management
let currentData = null;

function showStatus(message, isError = false) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
    statusDiv.style.display = 'block';
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

function saveToLocalStorage() {
    localStorage.setItem('mattressData_backup', JSON.stringify(window.mattressData));
    localStorage.setItem('topComparisons_backup', JSON.stringify(window.topComparisons));
}

function exportData() {
    const data = {
        mattresses: window.mattressData,
        topComparisons: window.topComparisons
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mattresses.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('Data exported successfully!');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.mattresses && imported.topComparisons) {
                window.mattressData = imported.mattresses;
                window.topComparisons = imported.topComparisons;
                
                // Save to localStorage
                saveToLocalStorage();
                
                // Update current models
                Object.keys(window.mattressData).forEach(brand => {
                    if (window.mattressData[brand].models && window.mattressData[brand].models.length > 0) {
                        window.currentModels[brand] = 0;
                    }
                });
                
                showStatus('Data imported successfully!');
                updateJSONPreview();
                populateBrandSelect();
            } else {
                showStatus('Invalid JSON structure', true);
            }
        } catch (err) {
            showStatus('Error parsing JSON: ' + err.message, true);
        }
    };
    reader.readAsText(file);
}

function updateJSONPreview() {
    const preview = document.getElementById('jsonPreview');
    if (preview) {
        const displayData = {
            mattresses: window.mattressData,
            topComparisons: window.topComparisons
        };
        preview.textContent = JSON.stringify(displayData, null, 2);
    }
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

function loadBrandForEdit(brand) {
    const data = window.mattressData[brand];
    if (!data) return;
    
    const editForm = document.getElementById('editForm');
    const currentModelIndex = window.currentModels[brand] || 0;
    const currentModel = data.models ? data.models[currentModelIndex] : null;
    
    editForm.innerHTML = `
        <h3>Editing: ${brand}</h3>
        
        <div class="form-group">
            <label>Brand Name</label>
            <input type="text" id="editBrandName" value="${brand}">
        </div>
        
        <div class="form-group">
            <label>Logo URL</label>
            <input type="text" id="editLogo" value="${data.logo}">
        </div>
        
        <div class="form-group">
            <label>Overall Rating (0-5)</label>
            <input type="number" id="editRating" step="0.1" min="0" max="5" value="${data.rating}">
        </div>
        
        <div class="form-group">
            <label>Warranty</label>
            <input type="text" id="editWarranty" value="${data.warranty || '10 years'}">
        </div>
        
        <div class="form-group">
            <label>Trial Period</label>
            <input type="text" id="editTrial" value="${data.trial || '100 nights'}">
        </div>
        
        <div class="form-group">
            <label>Expert Summary</label>
            <textarea id="editExpertSummary" rows="3">${data.expertSummary || ''}</textarea>
        </div>
        
        <h4>Models</h4>
        <div id="editModelsContainer">
            ${data.models ? data.models.map((model, idx) => `
                <div class="model-item" data-model-index="${idx}">
                    <div class="model-header">
                        <strong>${model.name}</strong>
                        <button type="button" class="btn-danger remove-edit-model" data-index="${idx}" ${data.models.length === 1 ? 'disabled' : ''}>Remove</button>
                    </div>
                    <div class="form-group">
                        <label>Model Name</label>
                        <input type="text" class="edit-model-name" value="${model.name.replace(/"/g, '&quot;')}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Type</label>
                            <select class="edit-model-type">
                                <option value="Memory Foam" ${model.type === 'Memory Foam' ? 'selected' : ''}>Memory Foam</option>
                                <option value="Hybrid" ${model.type === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
                                <option value="Latex" ${model.type === 'Latex' ? 'selected' : ''}>Latex</option>
                                <option value="Hybrid / Latex" ${model.type === 'Hybrid / Latex' ? 'selected' : ''}>Hybrid / Latex</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Firmness (1-10)</label>
                            <input type="number" class="edit-model-firmness" step="0.5" min="1" max="10" value="${model.firmness}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Firmness Text</label>
                        <input type="text" class="edit-model-firmness-text" value="${model.firmnessText}">
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="text" class="edit-model-price" value="${model.price}">
                    </div>
                    <div class="form-group">
                        <label>Price Value (numeric)</label>
                        <input type="number" class="edit-model-price-value" value="${model.priceValue}">
                    </div>
                    <div class="form-group">
                        <label>Best For</label>
                        <input type="text" class="edit-model-best-for" value="${model.bestFor}">
                    </div>
                    <div class="form-group">
                        <label>Sleep Positions (comma separated)</label>
                        <input type="text" class="edit-model-sleep-positions" value="${model.sleepPosition.join(', ')}">
                    </div>
                    <div class="form-group">
                        <label>Key Features (comma separated)</label>
                        <input type="text" class="edit-model-features" value="${model.keyFeatures.join(', ')}">
                    </div>
                    <div class="form-group">
                        <label>Tagline</label>
                        <input type="text" class="edit-model-tagline" value="${model.tagline}">
                    </div>
                    <div class="form-group">
                        <label>Cooling Technology</label>
                        <input type="text" class="edit-model-cooling" value="${model.cooling}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Motion Isolation</label>
                            <select class="edit-model-motion">
                                <option value="Poor" ${model.motionIsolation === 'Poor' ? 'selected' : ''}>Poor</option>
                                <option value="Good" ${model.motionIsolation === 'Good' ? 'selected' : ''}>Good</option>
                                <option value="Very Good" ${model.motionIsolation === 'Very Good' ? 'selected' : ''}>Very Good</option>
                                <option value="Excellent" ${model.motionIsolation === 'Excellent' ? 'selected' : ''}>Excellent</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Edge Support</label>
                            <select class="edit-model-edge">
                                <option value="Poor" ${model.edgeSupport === 'Poor' ? 'selected' : ''}>Poor</option>
                                <option value="Good" ${model.edgeSupport === 'Good' ? 'selected' : ''}>Good</option>
                                <option value="Very Good" ${model.edgeSupport === 'Very Good' ? 'selected' : ''}>Very Good</option>
                                <option value="Excellent" ${model.edgeSupport === 'Excellent' ? 'selected' : ''}>Excellent</option>
                            </select>
                        </div>
                    </div>
                </div>
            `).join('') : '<p>No models found</p>'}
        </div>
        
        <button type="button" id="addEditModelBtn" class="btn-outline" style="margin: 16px 0;">+ Add Another Model</button>
        
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button type="button" id="saveEditBtn" class="btn-primary">Save Changes</button>
            <button type="button" id="deleteBrandBtn" class="btn-danger">Delete This Brand</button>
        </div>
    `;
    
    editForm.style.display = 'block';
    
    // Add event listeners
    document.getElementById('saveEditBtn').addEventListener('click', () => saveBrandEdit(brand));
    document.getElementById('deleteBrandBtn').addEventListener('click', () => deleteBrand(brand));
    
    const addModelBtn = document.getElementById('addEditModelBtn');
    if (addModelBtn) {
        addModelBtn.addEventListener('click', () => addEditModel());
    }
    
    document.querySelectorAll('.remove-edit-model').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            removeEditModel(index);
        });
    });
}

function addEditModel() {
    const container = document.getElementById('editModelsContainer');
    const modelCount = container.children.length;
    
    const newModelHtml = `
        <div class="model-item" data-model-index="${modelCount}">
            <div class="model-header">
                <strong>New Model</strong>
                <button type="button" class="btn-danger remove-edit-model" data-index="${modelCount}">Remove</button>
            </div>
            <div class="form-group">
                <label>Model Name</label>
                <input type="text" class="edit-model-name" value="New Model">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Type</label>
                    <select class="edit-model-type">
                        <option value="Memory Foam">Memory Foam</option>
                        <option value="Hybrid" selected>Hybrid</option>
                        <option value="Latex">Latex</option>
                        <option value="Hybrid / Latex">Hybrid / Latex</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Firmness (1-10)</label>
                    <input type="number" class="edit-model-firmness" step="0.5" min="1" max="10" value="6">
                </div>
            </div>
            <div class="form-group">
                <label>Firmness Text</label>
                <input type="text" class="edit-model-firmness-text" value="Medium">
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="text" class="edit-model-price" value="$1,000 – $2,000">
            </div>
            <div class="form-group">
                <label>Price Value (numeric)</label>
                <input type="number" class="edit-model-price-value" value="1500">
            </div>
            <div class="form-group">
                <label>Best For</label>
                <input type="text" class="edit-model-best-for" value="All sleepers">
            </div>
            <div class="form-group">
                <label>Sleep Positions (comma separated)</label>
                <input type="text" class="edit-model-sleep-positions" value="back, side">
            </div>
            <div class="form-group">
                <label>Key Features (comma separated)</label>
                <input type="text" class="edit-model-features" value="Quality, Comfort, Support">
            </div>
            <div class="form-group">
                <label>Tagline</label>
                <input type="text" class="edit-model-tagline" value="Premium comfort mattress">
            </div>
            <div class="form-group">
                <label>Cooling Technology</label>
                <input type="text" class="edit-model-cooling" value="Breathable design">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Motion Isolation</label>
                    <select class="edit-model-motion">
                        <option value="Poor">Poor</option>
                        <option value="Good" selected>Good</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Excellent">Excellent</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Edge Support</label>
                    <select class="edit-model-edge">
                        <option value="Poor">Poor</option>
                        <option value="Good" selected>Good</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Excellent">Excellent</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newModelHtml);
    
    // Re-attach remove listeners
    document.querySelectorAll('.remove-edit-model').forEach(btn => {
        btn.removeEventListener('click', () => {});
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            removeEditModel(index);
        });
    });
}

function removeEditModel(index) {
    const container = document.getElementById('editModelsContainer');
    const models = container.children;
    if (models.length > 1) {
        models[index].remove();
        // Re-index remaining models
        Array.from(container.children).forEach((child, idx) => {
            child.setAttribute('data-model-index', idx);
            const removeBtn = child.querySelector('.remove-edit-model');
            if (removeBtn) removeBtn.setAttribute('data-index', idx);
        });
    } else {
        showStatus('Cannot remove the last model. Add another model first.', true);
    }
}

function saveBrandEdit(originalBrand) {
    const newBrandName = document.getElementById('editBrandName').value.trim();
    if (!newBrandName) {
        showStatus('Brand name is required', true);
        return;
    }
    
    // Collect models
    const models = [];
    const modelElements = document.querySelectorAll('#editModelsContainer .model-item');
    
    modelElements.forEach(el => {
        const model = {
            name: el.querySelector('.edit-model-name').value,
            type: el.querySelector('.edit-model-type').value,
            typeCategory: el.querySelector('.edit-model-type').value.toLowerCase().includes('hybrid') ? 'hybrid' : 'foam',
            firmness: parseFloat(el.querySelector('.edit-model-firmness').value),
            firmnessText: el.querySelector('.edit-model-firmness-text').value,
            price: el.querySelector('.edit-model-price').value,
            priceValue: parseInt(el.querySelector('.edit-model-price-value').value),
            bestFor: el.querySelector('.edit-model-best-for').value,
            sleepPosition: el.querySelector('.edit-model-sleep-positions').value.split(',').map(s => s.trim()),
            keyFeatures: el.querySelector('.edit-model-features').value.split(',').map(s => s.trim()),
            tagline: el.querySelector('.edit-model-tagline').value,
            cooling: el.querySelector('.edit-model-cooling').value,
            motionIsolation: el.querySelector('.edit-model-motion').value,
            edgeSupport: el.querySelector('.edit-model-edge').value
        };
        models.push(model);
    });
    
    const updatedData = {
        logo: document.getElementById('editLogo').value,
        models: models,
        rating: parseFloat(document.getElementById('editRating').value),
        warranty: document.getElementById('editWarranty').value,
        trial: document.getElementById('editTrial').value,
        expertSummary: document.getElementById('editExpertSummary').value,
        // Default values for missing fields
        customerRatingCount: window.mattressData[originalBrand]?.customerRatingCount || 1000,
        customerComfort: window.mattressData[originalBrand]?.customerComfort || 4.5,
        customerSupport: window.mattressData[originalBrand]?.customerSupport || 4.5,
        customerCooling: window.mattressData[originalBrand]?.customerCooling || 4.5
    };
    
    // Delete old brand if name changed
    if (newBrandName !== originalBrand) {
        delete window.mattressData[originalBrand];
    }
    
    window.mattressData[newBrandName] = updatedData;
    
    // Update top comparisons if brand name changed
    if (newBrandName !== originalBrand) {
        window.topComparisons = window.topComparisons.map(comp => {
            if (comp.brand1 === originalBrand) comp.brand1 = newBrandName;
            if (comp.brand2 === originalBrand) comp.brand2 = newBrandName;
            return comp;
        });
    }
    
    saveToLocalStorage();
    showStatus(`Brand "${newBrandName}" saved successfully!`);
    populateBrandSelect();
    
    // Reload the edit form with the new brand name
    loadBrandForEdit(newBrandName);
}

function deleteBrand(brand) {
    if (confirm(`Are you sure you want to delete "${brand}"? This cannot be undone.`)) {
        delete window.mattressData[brand];
        
        // Remove from top comparisons
        window.topComparisons = window.topComparisons.filter(comp => 
            comp.brand1 !== brand && comp.brand2 !== brand
        );
        
        saveToLocalStorage();
        showStatus(`Brand "${brand}" deleted successfully!`);
        populateBrandSelect();
        
        const editForm = document.getElementById('editForm');
        editForm.style.display = 'none';
    }
}

function addNewMattress(event) {
    event.preventDefault();
    
    const brandName = document.getElementById('newBrandName').value.trim();
    if (!brandName) {
        showStatus('Brand name is required', true);
        return;
    }
    
    if (window.mattressData[brandName]) {
        showStatus('Brand already exists!', true);
        return;
    }
    
    // Collect models
    const models = [];
    const modelElements = document.querySelectorAll('#modelsContainer .model-item');
    
    modelElements.forEach(el => {
        const model = {
            name: el.querySelector('.model-name').value,
            type: el.querySelector('.model-type').value,
            typeCategory: el.querySelector('.model-type').value.toLowerCase().includes('hybrid') ? 'hybrid' : 'foam',
            firmness: parseFloat(el.querySelector('.model-firmness').value),
            firmnessText: el.querySelector('.model-firmness-text').value,
            price: el.querySelector('.model-price').value,
            priceValue: parseInt(el.querySelector('.model-price-value').value),
            bestFor: el.querySelector('.model-best-for').value,
            sleepPosition: el.querySelector('.model-sleep-positions').value.split(',').map(s => s.trim()),
            keyFeatures: el.querySelector('.model-features').value.split(',').map(s => s.trim()),
            tagline: el.querySelector('.model-tagline').value,
            cooling: el.querySelector('.model-cooling').value,
            motionIsolation: el.querySelector('.model-motion').value,
            edgeSupport: el.querySelector('.model-edge').value
        };
        models.push(model);
    });
    
    const newMattress = {
        logo: document.getElementById('newLogo').value,
        models: models,
        rating: parseFloat(document.getElementById('newRating').value),
        warranty: document.getElementById('newWarranty').value,
        trial: document.getElementById('newTrial').value,
        expertSummary: document.getElementById('newExpertSummary').value,
        customerRatingCount: 1000,
        customerComfort: 4.5,
        customerSupport: 4.5,
        customerCooling: 4.5
    };
    
    window.mattressData[brandName] = newMattress;
    saveToLocalStorage();
    showStatus(`Brand "${brandName}" added successfully!`);
    
    // Reset form
    document.getElementById('addMattressForm').reset();
    document.getElementById('newLogo').value = 'assets/images/brands/';
    document.getElementById('modelsContainer').innerHTML = getDefaultModelHtml();
    
    populateBrandSelect();
}

function getDefaultModelHtml() {
    return `
        <div class="model-item">
            <div class="model-header">
                <strong>Model 1</strong>
                <button type="button" class="btn-danger remove-model" style="padding: 4px 12px;">Remove</button>
            </div>
            <div class="form-group">
                <label>Model Name *</label>
                <input type="text" class="model-name" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Type</label>
                    <select class="model-type">
                        <option value="Memory Foam">Memory Foam</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Latex">Latex</option>
                        <option value="Hybrid / Latex">Hybrid / Latex</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Firmness (1-10)</label>
                    <input type="number" class="model-firmness" step="0.5" min="1" max="10" value="6">
                </div>
            </div>
            <div class="form-group">
                <label>Firmness Text</label>
                <input type="text" class="model-firmness-text" value="Medium">
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="text" class="model-price" value="$1,000 – $2,000">
            </div>
            <div class="form-group">
                <label>Price Value (numeric)</label>
                <input type="number" class="model-price-value" value="1500">
            </div>
            <div class="form-group">
                <label>Best For</label>
                <input type="text" class="model-best-for" value="All sleepers">
            </div>
            <div class="form-group">
                <label>Sleep Positions (comma separated)</label>
                <input type="text" class="model-sleep-positions" value="back, side">
            </div>
            <div class="form-group">
                <label>Key Features (comma separated)</label>
                <input type="text" class="model-features" value="Quality, Comfort, Support">
            </div>
            <div class="form-group">
                <label>Tagline</label>
                <input type="text" class="model-tagline" value="Premium comfort mattress">
            </div>
            <div class="form-group">
                <label>Cooling Technology</label>
                <input type="text" class="model-cooling" value="Breathable design">
            </div>
            <div class="form-group">
                <label>Motion Isolation</label>
                <select class="model-motion">
                    <option value="Poor">Poor</option>
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Excellent">Excellent</option>
                </select>
            </div>
            <div class="form-group">
                <label>Edge Support</label>
                <select class="model-edge">
                    <option value="Poor">Poor</option>
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Excellent">Excellent</option>
                </select>
            </div>
        </div>
    `;
}

function initAdmin() {
    if (window.dataLoaded && Object.keys(window.mattressData).length > 0) {
        populateBrandSelect();
        updateJSONPreview();
        
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
        
        // Brand select change
        const brandSelect = document.getElementById('brandSelect');
        if (brandSelect) {
            brandSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    loadBrandForEdit(e.target.value);
                } else {
                    document.getElementById('editForm').style.display = 'none';
                }
            });
        }
        
        // Add model button in add panel
        const addModelBtn = document.getElementById('addModelBtn');
        if (addModelBtn) {
            addModelBtn.addEventListener('click', () => {
                const container = document.getElementById('modelsContainer');
                container.insertAdjacentHTML('beforeend', getDefaultModelHtml());
                // Re-attach remove listeners
                document.querySelectorAll('.remove-model').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const models = document.querySelectorAll('#modelsContainer .model-item');
                        if (models.length > 1) {
                            this.closest('.model-item').remove();
                        } else {
                            showStatus('Cannot remove the last model. Add another model first.', true);
                        }
                    });
                });
            });
        }
        
        // Add mattress form submit
        const addForm = document.getElementById('addMattressForm');
        if (addForm) {
            addForm.addEventListener('submit', addNewMattress);
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportData);
        }
        
        // Import button
        const importBtn = document.getElementById('importBtn');
        const importFile = document.getElementById('importFile');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => {
                if (importFile.files.length > 0) {
                    importData(importFile.files[0]);
                } else {
                    showStatus('Please select a JSON file first', true);
                }
            });
        }
        
        // Remove model button handler for initial models
        document.querySelectorAll('.remove-model').forEach(btn => {
            btn.addEventListener('click', function() {
                const models = document.querySelectorAll('#modelsContainer .model-item');
                if (models.length > 1) {
                    this.closest('.model-item').remove();
                } else {
                    showStatus('Cannot remove the last model. Add another model first.', true);
                }
            });
        });
        
        console.log('✅ Admin panel initialized');
    } else {
        setTimeout(initAdmin, 100);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadMattressData();
    initAdmin();
});