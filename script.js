// --- Data Storage (In-memory) ---
let wardrobeItems = [
    { id: 1, name: "Blouse Putih Basic", category: "tops", color: "white", price: 150000, brand: "Uniqlo", wearCount: 12, lastWorn: "2025-01-15", emoji: "👕" },
    { id: 2, name: "Jeans Skinny Dark", category: "bottoms", color: "blue", price: 250000, brand: "Levi's", wearCount: 8, lastWorn: "2025-01-10", emoji: "👖" },
    { id: 3, name: "Dress Floral Summer", category: "dresses", color: "pink", price: 300000, brand: "Zara", wearCount: 3, lastWorn: "2024-12-20", emoji: "👗" },
    { id: 4, name: "Blazer Hitam Formal", category: "outerwear", color: "black", price: 450000, brand: "The Executive", wearCount: 15, lastWorn: "2025-01-20", emoji: "👔" },
    { id: 5, name: "Kemeja Denim Kasual", category: "tops", color: "blue", price: 200000, brand: "Gap", wearCount: 2, lastWorn: "2024-12-15", emoji: "👕" },
    { id: 6, name: "Celana Chino Beige", category: "bottoms", color: "brown", price: 180000, brand: "H&M", wearCount: 1, lastWorn: "2024-11-01", emoji: "👖" },
    { id: 7, name: "T-Shirt Lusuh", category: "tops", color: "red", price: 50000, brand: "Local Brand", wearCount: 0, lastWorn: null, emoji: "👕" },
    { id: 8, name: "Rok Mini Biru", category: "bottoms", color: "blue", price: 120000, brand: "Zara", wearCount: 1, lastWorn: "2024-10-01", emoji: "👖" }
];

let wishlistItems = [];
let monthlyBudget = 2000000;
let spentThisMonth = 450000;
let spendingLimit = 1500000;
let dailyPurchaseCount = 0;
let dailyPurchaseLimit = 2;
let weatherData = { temp: 28, condition: 'Cerah', humidity: 70 };
let userRewards = { tradePoints: 150, donations: 8, sustainabilityLevel: 'Gold' };
let noBuyProgressDays = 12; // Challenge progress

// Marketplace Products
const marketplaceProducts = [
    { id: 1, name: "Vintage Denim Jacket", price: 180000, category: "secondhand", sustainability: "Pre-loved", emoji: "🧥", seller: "Thrift Corner", details: "Kondisi sangat baik, model klasik tahun 90-an." },
    { id: 2, name: "Organic Cotton T-Shirt", price: 120000, category: "sustainable", sustainability: "GOTS Certified", emoji: "👕", seller: "EcoFashion", details: "Bahan katun organik bersertifikat, ramah lingkungan." },
    { id: 3, name: "Handwoven Batik Dress", price: 350000, category: "local", sustainability: "Local Artisan", emoji: "👗", seller: "Batik Nusantara", details: "Dibuat dengan tangan oleh pengrajin lokal, mendukung ekonomi UMKM." },
    { id: 4, name: "Designer Evening Gown", price: 50000, category: "rental", sustainability: "Rental - 3 days", emoji: "👰", seller: "Dress Rental Co", details: "Gaun desainer untuk acara spesial. Harga adalah biaya sewa 3 hari." },
    { id: 5, name: "Sustainable Sneakers", price: 280000, category: "sustainable", sustainability: "Recycled Materials", emoji: "👟", seller: "Green Steps", details: "Sepatu dibuat dari 60% plastik daur ulang." }
];

// Trade Offers Data
const tradeOffersData = [
    { id: 1, offerItem: { id: 101, name: "T-Shirt Grafis", emoji: "👕", category: "tops", color: "red" }, userItem: 5, partnerName: "Maya (Silver Supporter)", partnerStatus: 'pending', userStatus: 'pending' },
    { id: 2, offerItem: { id: 102, name: "Scarf Sutra", emoji: "🧣", category: "accessories", color: "pink" }, userItem: 6, partnerName: "Rina (Gold Sustainer)", partnerStatus: 'accepted', userStatus: 'pending' }
];

let currentTradeOffer = null;

let userData = {
    name: "Diajeng",
    email: "user@rewear.app",
    location: "Tangerang Selatan"
};

// --- Utility Functions ---

function formatPrice(amount) { return 'Rp ' + Math.round(amount).toLocaleString('id-ID'); }
function getCategoryEmoji(category) {
    const emojis = { 'tops': '👕', 'bottoms': '👖', 'dresses': '👗', 'outerwear': '🧥', 'accessories': '👜' };
    return emojis[category] || '👔';
}
function getCategoryColor(category) {
    // Menggunakan variabel CSS yang ada di :root (dari style.css)
    const colors = { 
        'tops': 'var(--color-dusty-orchid)', 
        'bottoms': 'var(--color-sorbet-stem)', 
        'dresses': 'var(--color-dusty-orchid)', 
        'outerwear': 'var(--color-sorbet-stem)', 
        'accessories': 'var(--color-petal-glaze)' 
    };
    return colors[category] || 'var(--light-green)';
}
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<div style="display: flex; align-items: center; gap: 0.8rem;"><span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'info' ? '💡' : '❌'}</span><span>${message}</span><button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;margin-left:auto;">×</button></div>`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 100);
    setTimeout(() => { if (notification.parentElement) { notification.classList.remove('show'); setTimeout(() => { if (notification.parentElement) { document.body.removeChild(notification); } }, 300); } }, duration);
}
function showSweetAlert(title, content, type = 'info') {
    const alertModal = document.createElement('div');
    alertModal.className = 'modal active';
    alertModal.style.zIndex = '2500';
    const icon = type === 'success' ? '🎉' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : '💡';
    alertModal.innerHTML = `<div class="modal-content" style="max-width: 500px; text-align: center;"><button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button><div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div><h2 style="color: var(--forest-green); margin-bottom: 1rem;">${title}</h2><div style="margin-bottom: 2rem;">${content}</div></div>`;
    document.body.appendChild(alertModal);
}
function openModal(modalId) { 
    document.getElementById(modalId).classList.add('active'); 
    if (modalId === 'cameraScanModal') {
        startCamera();
    }
}
function closeModal(modalId) { 
    document.getElementById(modalId).classList.remove('active'); 
    if (modalId === 'cameraScanModal') {
        stopCamera();
    }
}

// --- Page Switching & Menu ---
function showPage(pageId, event) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Matikan semua tombol di desktop
    document.querySelectorAll('.nav-tabs .nav-tab').forEach(tab => tab.classList.remove('active'));
    // Matikan semua tombol di mobile
    document.querySelectorAll('.nav-tabs-mobile .nav-tab').forEach(tab => tab.classList.remove('active'));
    
    // Aktifkan tombol yang sesuai di desktop
    const desktopTargetButton = document.querySelector(`.nav-tabs .nav-tab[onclick*="showPage('${pageId}'"]`);
    if(desktopTargetButton) desktopTargetButton.classList.add('active');
    
    // Aktifkan tombol yang sesuai di mobile (jika ada)
    const mobileTargetButton = document.querySelector(`.nav-tabs-mobile .nav-tab[onclick*="showPage('${pageId}'"]`);
    if(mobileTargetButton) mobileTargetButton.classList.add('active');

    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'wardrobe') loadWardrobe();
    if (pageId === 'shopping') loadShopping();
    if (pageId === 'marketplace') loadMarketplace();
    if (pageId === 'community') showCommunityTab('challenges');
    if (pageId === 'tradePage') loadTradePage();
}

function openMobileMenu(event) {
    // Logic untuk membuka menu mobile
    document.querySelectorAll('.nav-tabs-mobile .nav-tab').forEach(tab => tab.classList.remove('active'));
    const desktopActiveTab = document.querySelector('.nav-tabs .nav-tab.active');
    
    if (desktopActiveTab) {
        const pageName = desktopActiveTab.textContent.trim();
        const mobileTargetTab = document.querySelector(`.nav-tabs-mobile .nav-tab[onclick*="${pageName}"]`);
        if(mobileTargetTab) {
            mobileTargetTab.classList.add('active');
        }
    }
    openModal('mobileMenuModal');
}

// --- Camera Scan Item Functions (Inti dari permintaan Anda) ---
const video = document.getElementById('cameraVideoFeed');
const canvas = document.getElementById('canvas');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');

let stream;

async function startCamera() {
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) photoPreview.style.display = 'none';

    document.querySelector('#cameraScanModal button[onclick="takePhoto()"]').style.display = 'block';
    if (uploadPhotoBtn) uploadPhotoBtn.style.display = 'none';
    if (video) video.style.display = 'block';

    try {
        // Mencoba mendapatkan stream video (kamera belakang jika ada)
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); 
        if (video) video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera: ", err);
        const errorMessage = "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.";
        const modalContent = document.getElementById('cameraScanModal')?.querySelector('.modal-content');
        if (modalContent) modalContent.innerHTML = `<p style="color:red;">${errorMessage}</p>`;
        showNotification(errorMessage, 'error', 5000);
        if (video) video.style.display = 'none';
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (video) video.srcObject = null;
}

function takePhoto() {
    if (!video || !video.srcObject || video.style.display === 'none') {
        showNotification("Kamera belum aktif.", 'warning');
        return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png'); 
    let photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
        photoPreview.src = dataUrl;
        photoPreview.style.display = 'block'; 
    }
    
    document.querySelector('#cameraScanModal button[onclick="takePhoto()"]').style.display = 'none'; 
    if (uploadPhotoBtn) uploadPhotoBtn.style.display = 'block'; 
    
    if (video) video.style.display = 'none'; 
    stopCamera(); 
}

// Event listener untuk tombol "Upload Foto"
if (uploadPhotoBtn) {
    uploadPhotoBtn.addEventListener('click', () => {
        const photoPreview = document.getElementById('photoPreview');
        const imageData = photoPreview ? photoPreview.src : '';

        if (!imageData || imageData.length < 100) { showNotification('Ambil foto dulu!', 'error'); return; }
        
        showNotification('Foto terkirim! AI sedang memproses...', 'info', 3000);
        uploadPhotoBtn.disabled = true;

        setTimeout(() => {
            // SIMULASI DATA IDENTIFIKASI AI
            const scannedData = {
                name: 'Jaket Bomber Hijau',
                category: 'outerwear',
                color: 'green',
                price: 350000,
                brand: 'Local Project'
            };
            
            document.getElementById('itemName').value = scannedData.name;
            document.getElementById('itemCategory').value = scannedData.category;
            document.getElementById('itemColor').value = scannedData.color;
            document.getElementById('itemPrice').value = scannedData.price;
            document.getElementById('itemBrand').value = scannedData.brand;
            
            closeModal('cameraScanModal');
            showNotification('Item berhasil diidentifikasi! Harap konfirmasi detailnya.', 'success', 4000);
            openModal('addItemModal');

            uploadPhotoBtn.disabled = false;
        }, 3500);
    });
}

// --- Dashboard & Status Loading ---

function getFrequentlyWornItems() {
    return wardrobeItems.filter(item => item.wearCount > 5).sort((a, b) => b.wearCount - a.wearCount).slice(0, 5);
}

function getRarelyWornItems() {
    return wardrobeItems.filter(item => item.wearCount < 3).sort((a, b) => a.wearCount - b.wearCount);
}

function calculateSustainabilityScore() {
    if (wardrobeItems.length === 0) return 0;
    let score = 0;
    wardrobeItems.forEach(item => {
        const costPerWear = item.wearCount > 0 ? item.price / item.wearCount : item.price;
        if (costPerWear < 50000) score += 25;
        else if (costPerWear < 100000) score += 20;
        else if (costPerWear < 200000) score += 15;
        else score += 5;
        if (item.wearCount > 10) score += 5;
    });
    return Math.min(100, Math.round(score / wardrobeItems.length));
}

function loadDashboard() {
    const totalItems = wardrobeItems.length;
    const totalValue = wardrobeItems.reduce((sum, item) => sum + item.price, 0);
    const totalWears = wardrobeItems.reduce((sum, item) => sum + item.wearCount, 0);
    const avgCostPerWear = totalWears > 0 ? totalValue / totalWears : 0;
    const sustainabilityScore = calculateSustainabilityScore();

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = formatPrice(totalValue);
    document.getElementById('avgCostPerWear').textContent = formatPrice(avgCostPerWear);
    document.getElementById('sustainabilityScore').textContent = sustainabilityScore + '%';
    
    document.getElementById('noBuyProgress').textContent = noBuyProgressDays;
    const budgetFillEl = document.querySelector('#challengesTab .budget-fill');
    if (budgetFillEl) budgetFillEl.style.width = (noBuyProgressDays / 30) * 100 + '%';

    updateFrequentItemsList();
    updateRareItemsList();
    updateRewardsDisplay();
    updateImpactStats();
}

function updateFrequentItemsList() {
    const frequentItems = getFrequentlyWornItems();
    const container = document.getElementById('frequentItemsList');
    
    container.innerHTML = frequentItems.length > 0 ? 
        frequentItems.map(item => 
            `<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--cream);">
                <span>${item.emoji} ${item.name}</span>
                <span class="wear-count">${item.wearCount}x</span>
            </div>`
        ).join('') : 
        '<p style="color: var(--text-light); font-style: italic;">Belum ada item yang sering dipakai</p>';
}

function updateRareItemsList() {
    const rareItems = getRarelyWornItems();
    const container = document.getElementById('rareItemsList');
    
    container.innerHTML = rareItems.length > 0 ? 
        rareItems.slice(0, 3).map(item => 
            `<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--cream);">
                <span>${item.emoji} ${item.name}</span>
                <span style="color: var(--text-light); font-size: 0.8rem;">${item.wearCount}x</span>
            </div>`
        ).join('') : 
        '<p style="color: var(--text-light); font-style: italic;">Semua item sudah sering dipakai!</p>';
}

function showFrequentItemsDetail() {
    const frequentItems = getFrequentlyWornItems();
    
    showSweetAlert(
        '🔥 Detail Item Paling Sering Dipakai (MVP)',
        `
            <div style="text-align: left;">
                <p>Item ini terbukti memberikan **nilai Cost-Per-Wear (CPW) terbaik** bagi Anda.</p>
                
                ${frequentItems.map(item => `
                    <div style="background: var(--cream); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <h4 style="color: var(--forest-green);">${item.emoji} ${item.name}</h4>
                        <div class="image-placeholder">${item.emoji} Simulasi Gambar Item</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin: 0.5rem 0; font-size: 0.9rem;">
                            <span>Dipakai: <strong>${item.wearCount}x</strong></span>
                            <span>CPW: <strong>${formatPrice(item.price / item.wearCount)}</strong></span>
                            <span>Brand: ${item.brand}</span>
                            <span>Kategori: ${item.category}</span>
                        </div>
                    </div>
                `).join('')}
                
            </div>
        `,
        'success'
    );
}

// --- Profile Functions ---
function showProfilePage() {
    // Memuat data yang ada ke form saat masuk halaman
    document.getElementById('editName').value = userData.name;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editLocation').value = userData.location;
    document.getElementById('editBudget').value = monthlyBudget;
    
    // Memperbarui tampilan statistik di halaman profil
    document.getElementById('profileUserName').textContent = `${userData.name} (${userRewards.sustainabilityLevel})`;
    document.getElementById('profileUserEmail').textContent = userData.email;
    document.getElementById('profileTradePoints').textContent = userRewards.tradePoints;
    document.getElementById('profileUserLevel').textContent = userRewards.sustainabilityLevel;

    // Mengalihkan ke halaman profile
    showPage('profilePage', { target: document.querySelector('.profile-avatar') });
}

function saveProfileChanges() {
    const newName = document.getElementById('editName').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    const newLocation = document.getElementById('editLocation').value.trim();
    const newBudget = parseInt(document.getElementById('editBudget').value);
    
    // Update data
    userData.name = newName;
    userData.email = newEmail;
    userData.location = newLocation;
    monthlyBudget = newBudget || monthlyBudget; // Update budget

    // Update tampilan
    document.querySelector('.profile-avatar').textContent = newName.charAt(0);
    showNotification('Perubahan profil berhasil disimpan!', 'success');
    
    // Kembali ke dashboard setelah simpan
    loadDashboard();
    showPage('dashboard'); 
}


// --- Wardrobe Functions ---

function loadWardrobe() {
    renderWardrobe(wardrobeItems);
}

function renderWardrobe(items = wardrobeItems) {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = items.map(item => `
        <div class="item-card" onclick="showItemDetail(${item.id})">
            <div class="item-image" style="background: ${getCategoryColor(item.category)}">${item.emoji}</div>
            <div class="item-info">
                <h4 title="${item.name}">${item.name}</h4>
                <div class="item-stats">
                    <span>CPW: ${formatPrice(item.price / Math.max(item.wearCount, 1))}</span>
                    <span class="wear-count">${item.wearCount}x dipakai</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterItems() {
    const categories = Array.from(document.querySelectorAll('#wardrobe .filter-section:nth-child(1) input:checked')).map(cb => cb.value);
    const colors = Array.from(document.querySelectorAll('#wardrobe .filter-section:nth-child(2) input:checked')).map(cb => cb.value);
    const frequencies = Array.from(document.querySelectorAll('#wardrobe .filter-section:nth-child(3) input:checked')).map(cb => cb.value);

    // Handle 'all' category being checked
    let allCategories = ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories'];
    if (categories.length === 1 && categories[0] === 'all') {
         // Keep allCategories as is
    } else if (categories.length > 0 && !categories.includes('all')) {
        allCategories = categories;
    } else if (categories.length === 0) {
        allCategories = ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories']; // Default: show all if no category selected
    }

    const filtered = wardrobeItems.filter(item => {
        const categoryMatch = allCategories.includes(item.category);
        const colorMatch = colors.length === 0 || colors.includes(item.color);

        let frequencyMatch = frequencies.length === 0;
        if (!frequencyMatch) {
            if (frequencies.includes('frequent') && item.wearCount >= 10) frequencyMatch = true;
            if (frequencies.includes('moderate') && item.wearCount >= 1 && item.wearCount < 10) frequencyMatch = true;
            if (frequencies.includes('never') && item.wearCount === 0) frequencyMatch = true;
        }

        return categoryMatch && colorMatch && frequencyMatch;
    });

    renderWardrobe(filtered);
}

function showItemDetail(itemId) {
    const item = wardrobeItems.find(i => i.id === itemId);
    if (!item) return;

    showSweetAlert(
        `${item.emoji} Detail Item: ${item.name}`,
        `
            <div style="text-align: left;">
                <div class="image-placeholder">${item.emoji} Gambar ${item.name}</div>
                <p><strong>Brand:</strong> ${item.brand}</p>
                <p><strong>Kategori:</strong> ${item.category}</p>
                <p><strong>Warna:</strong> ${item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
                <p><strong>Harga Beli:</strong> ${formatPrice(item.price)}</p>
                <p><strong>Total Dipakai:</strong> <strong style="color: var(--forest-green);">${item.wearCount}x</strong></p>
                <p><strong>Cost Per Wear (CPW):</strong> <strong style="color: var(--dark-green);">${formatPrice(item.price / Math.max(item.wearCount, 1))}</strong></p>
                <p><strong>Terakhir Dipakai:</strong> ${item.lastWorn || 'Belum pernah'}</p>
            </div>
            <button class="btn-primary" onclick="markAsWorn(${item.id})" style="margin-top: 1.5rem; width: 100%;">
                ✅ Tandai Sudah Dipakai Hari Ini
            </button>
        `,
        'info'
    );
}

function markAsWorn(itemId) {
    const item = wardrobeItems.find(i => i.id === itemId);
    if (item) { 
        item.wearCount++; 
        item.lastWorn = new Date().toISOString().split('T')[0]; 
        showNotification(`${item.name} ditandai sudah dipakai! Total: ${item.wearCount}x`, 'success'); 
        document.querySelector('.modal.active')?.remove(); 
        loadDashboard(); 
        if (document.getElementById('wardrobe').classList.contains('active')) {
            renderWardrobe();
        }
    }
}

// --- Item Addition ---

function addNewItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const itemCategory = document.getElementById('itemCategory').value;
    const itemColor = document.getElementById('itemColor').value;
    const itemPrice = parseInt(document.getElementById('itemPrice').value);
    const itemBrand = document.getElementById('itemBrand').value.trim() || 'Unknown';
    
    if (!itemName || !itemPrice || itemPrice <= 0) {
        showNotification('Harap isi Nama Item dan Harga Beli yang valid!', 'error');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        name: itemName,
        category: itemCategory,
        color: itemColor,
        price: itemPrice,
        brand: itemBrand,
        wearCount: 0,
        lastWorn: null,
        emoji: getCategoryEmoji(itemCategory)
    };
    
    wardrobeItems.push(newItem);
    closeModal('addItemModal');
    
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemBrand').value = '';
    
    showNotification(`${newItem.name} berhasil ditambahkan!`, 'success');
    loadDashboard();
    if (document.getElementById('wardrobe').classList.contains('active')) {
        renderWardrobe();
    }
}


// --- Mix & Match / Outfit Generation ---

const selectBestItem = (items) => {
    if (items.length === 0) return null;

    // Temukan jumlah pakai (wearCount) minimum
    const minWearCount = Math.min(...items.map(item => item.wearCount));

    // Ambil semua item dengan wearCount minimum tersebut
    const leastWornItems = items.filter(item => item.wearCount === minWearCount);

    // Pilih satu item secara acak dari yang paling sedikit dipakai (untuk variasi)
    return leastWornItems[Math.floor(Math.random() * leastWornItems.length)];
};

function generateOutfit() {
    if (wardrobeItems.length < 2) {
        return renderOutfit({ error: "Tambahkan minimal 2 item (Atasan & Bawahan/Dress) ke lemari Anda untuk menggunakan fitur ini!" });
    }
    
    // 1. Kelompokkan item di lemari berdasarkan kategori
    const categories = {
        tops: wardrobeItems.filter(item => item.category === 'tops'),
        bottoms: wardrobeItems.filter(item => item.category === 'bottoms'),
        dresses: wardrobeItems.filter(item => item.category === 'dresses'),
        outerwear: wardrobeItems.filter(item => item.category === 'outerwear'),
        accessories: wardrobeItems.filter(item => item.category === 'accessories')
    };

    let outfit = {};
    let requiredCategories = ['tops', 'bottoms'];
    
    // Tentukan apakah akan menggunakan Dress atau Top+Bottom (Peluang 50%)
    if (categories.dresses.length > 0 && categories.tops.length + categories.bottoms.length > 0 && Math.random() > 0.5) {
        requiredCategories = ['dresses']; // Pilih Dress
    } else if (categories.tops.length === 0 || categories.bottoms.length === 0) {
        // Fallback jika Top/Bottom tidak lengkap, tapi ada Dress
        if (categories.dresses.length > 0) {
            requiredCategories = ['dresses'];
        } else {
            return renderOutfit({ error: "Tidak ada cukup item di lemari Anda untuk membuat pakaian dasar (Atasan dan Bawahan/Dress)." });
        }
    }
    
    let canGenerate = true;
    for (const category of requiredCategories) {
        const item = selectBestItem(categories[category]);
        if (item) {
            outfit[category] = item;
        } else {
            canGenerate = false;
            break;
        }
    }

    if (!canGenerate) {
        // Jika item inti tidak ada, kembalikan error
        return renderOutfit({ error: "Tidak ada cukup item di lemari Anda untuk membuat pakaian dasar (Atasan dan Bawahan/Dress)." });
    }

    // Tambahkan item opsional (Outerwear dan Accessories) dengan peluang 50%
    if (categories.outerwear.length > 0 && Math.random() > 0.5) {
        outfit.outerwear = selectBestItem(categories.outerwear);
    }
    if (categories.accessories.length > 0 && Math.random() > 0.5) {
        outfit.accessories = selectBestItem(categories.accessories);
    }

    // Panggil fungsi untuk menampilkan hasil
    renderOutfit(outfit);
}

function renderOutfit(outfit) {
    if (outfit.error) {
          showSweetAlert('Gagal Generate Outfit', outfit.error, 'warning');
          return;
    }

    const outfitHtml = Object.values(outfit).map(item => `
        <div style="background: var(--cream); padding: 1rem; border-radius: 8px; margin: 0.5rem 0;">
            <h4 style="color: var(--forest-green);">${item.emoji} ${item.name}</h4>
            <p style="font-size: 0.9rem;">${item.category.charAt(0).toUpperCase() + item.category.slice(1)} | Dipakai ${item.wearCount}x</p>
        </div>
    `).join('');
    
    // Pilih item utama untuk tombol detail (Top/Dress)
    const mainItem = outfit.dresses || outfit.tops; 
    const mainItemId = mainItem ? mainItem.id : null;

    showSweetAlert(
        '✨ Outfit Rekomendasi Terbaik Hari Ini!',
        `
            <div style="text-align: center; margin-bottom: 1rem;">
                <p>AI merekomendasikan kombinasi ini untuk memaksimalkan penggunaan item yang jarang Anda pakai. **Cost/Wear terbaik!**</p>
            </div>
            ${outfitHtml}
            ${mainItemId ? `<button class="btn-primary" style="margin-top: 1.5rem;" onclick="showItemDetail(${mainItemId})">Lihat Detail Item Utama</button>` : ''}
        `,
        'success'
    );
}

// --- Marketplace Functions ---

function loadMarketplace() {
    filterProducts('all'); // Load all by default
}

function filterProducts(category, event) {
    // 1. Mengatur status aktif pada tombol filter (chip)
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        const targetChip = document.querySelector(`.filter-chip[onclick*="filterProducts('${category}'"]`);
        if(targetChip) targetChip.classList.add('active');
    }
    
    // 2. Memfilter produk berdasarkan kategori yang dipilih
    const filteredProducts = category === 'all' ? 
        marketplaceProducts : 
        marketplaceProducts.filter(product => product.category === category);
    
    // 3. Merender produk di grid
    const grid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="text-align: center; grid-column: 1 / -1; padding: 2rem; color: var(--text-light);">Tidak ada produk yang cocok dengan kategori ini.</div>';
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => `
         <div class="product-card" onclick="viewProduct(${product.id})">
             <div class="product-image" style="background: ${product.category === 'secondhand' ? '#f0ad4e' : product.category === 'sustainable' ? '#5cb85c' : '#5bc0de'}">${product.emoji}</div>
             <div class="product-info">
                 <h4 class="product-title">${product.name}</h4>
                 <div class="product-price">${formatPrice(product.price)}${product.category === 'rental' ? '/3 days' : ''}</div>
                 <div class="sustainability-badge">${product.sustainability}</div>
                 <p>by ${product.seller}</p>
             </div>
         </div>
     `).join('');
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let filteredProducts = marketplaceProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query)
    );

    if (query.trim() === '') {
          filteredProducts = marketplaceProducts;
    }

    const grid = document.getElementById('productsGrid');
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="text-align: center; grid-column: 1 / -1; padding: 2rem; color: var(--text-light);">Tidak ada produk yang cocok dengan pencarian Anda.</div>';
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => `
         <div class="product-card" onclick="viewProduct(${product.id})">
             <div class="product-image" style="background: ${product.category === 'secondhand' ? '#f0ad4e' : product.category === 'sustainable' ? '#5cb85c' : '#5bc0de'}">${product.emoji}</div>
             <div class="product-info">
                 <h4 class="product-title">${product.name}</h4>
                 <div class="product-price">${formatPrice(product.price)}${product.category === 'rental' ? '/3 days' : ''}</div>
                 <div class="sustainability-badge">${product.sustainability}</div>
                 <p>by ${product.seller}</p>
             </div>
         </div>
     `).join('');
}

function handleSearchKeypress(event) {
    if (event.key === 'Enter') {
        searchProducts();
    }
}

function checkoutProduct(productId, price) {
    const product = marketplaceProducts.find(p => p.id === productId);
    if (!product) return;

    if (!checkSpendingLimit(price)) { return; }

    document.getElementById('paymentAmount').textContent = formatPrice(price);
    document.getElementById('paymentItemName').textContent = product.name;
    
    document.getElementById('paymentModal').dataset.productId = productId;
    document.getElementById('paymentModal').dataset.productPrice = price;

    openModal('paymentModal');
}

function viewProduct(productId) {
    const product = marketplaceProducts.find(p => p.id === productId);
    if (!product) return;
    
    showSweetAlert(
        `${product.emoji} ${product.name}`,
        `
            <div style="text-align: left;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 4rem; margin-bottom: 0.5rem;">${product.emoji}</div>
                    <div class="product-price" style="font-size: 1.8rem; color: var(--primary-green); font-weight: bold; margin-bottom: 0.5rem;">
                        ${formatPrice(product.price)}${product.category === 'rental' ? '<span style="font-size: 0.9rem;"> / 3 days</span>' : ''}
                    </div>
                    <div class="sustainability-badge" style="display: inline-block; background: var(--light-green); color: var(--forest-green); padding: 0.5rem 1rem; border-radius: 20px; margin: 0.5rem 0;">${product.sustainability}</div>
                </div>
                <p><strong>Deskripsi:</strong> ${product.details}</p>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <button onclick="this.closest('.modal').remove(); checkoutProduct(${product.id}, ${product.price})" class="btn-primary">
                        ${product.category === 'rental' ? '📅 Sewa Sekarang' : '🛒 Beli Sekarang'}
                    </button>
                    <button onclick="this.closest('.modal').remove(); addToWishlistFromProduct('${product.name}', ${product.price})" class="btn-primary" style="background: #ffa500; margin-top: 0.5rem;">❤️ Tambah ke Wishlist</button>
                </div>
            </div>
        `,
        'info'
    );
}
    
function completePayment(method) {
    const modal = document.getElementById('paymentModal');
    const productId = parseInt(modal.dataset.productId);
    const price = parseInt(modal.dataset.productPrice);
    const product = marketplaceProducts.find(p => p.id === productId);

    if (!product || !checkSpendingLimit(0)) {
        showNotification('Pembayaran dibatalkan karena batasan/limit.', 'error');
        return;
    }

    spentThisMonth += price;
    dailyPurchaseCount++;
    userRewards.tradePoints += 10;

    closeModal('paymentModal');
    showSweetAlert('🎉 Pembayaran Sukses!', `${product.name} berhasil dibeli via ${method}. +10 Trade Points!`, 'success');
    
    if (product.category !== 'rental') {
        const newItem = { 
            id: Date.now(), 
            name: product.name, 
            category: 'accessories', 
            color: 'multi', 
            price: price, 
            brand: product.seller, 
            wearCount: 0, 
            lastWorn: null, 
            emoji: product.emoji 
        }; 
        wardrobeItems.push(newItem);
    }

    loadDashboard();
    loadShopping();
}

// --- Shopping Assistant & Wishlist ---

function updateBudgetDisplay() {
    const percentage = Math.min(100, (spentThisMonth / monthlyBudget) * 100);
    const remaining = Math.max(0, monthlyBudget - spentThisMonth);
    document.getElementById('spentAmount').textContent = spentThisMonth.toLocaleString('id-ID');
    document.getElementById('budgetLimit').textContent = monthlyBudget.toLocaleString('id-ID');
    document.getElementById('budgetPercentage').textContent = Math.round(percentage) + '%';
    document.getElementById('budgetFill').style.width = percentage + '%';
    document.getElementById('dailyPurchases').textContent = dailyPurchaseCount;
    document.getElementById('remainingBudget').textContent = formatPrice(remaining);
    const fillElement = document.getElementById('budgetFill');
    if (percentage > 90) { fillElement.style.background = '#dc3545'; } else if (percentage > 70) { fillElement.style.background = '#ffc107'; } else { fillElement.style.background = 'var(--primary-green)'; }
}
function loadShopping() { updateBudgetDisplay(); renderWishlist(); updateRewardsDisplay(); }
function renderWishlist() {
    const container = document.getElementById('wishlistItems');
    if (wishlistItems.length === 0) { container.innerHTML = '<p style="color: var(--text-light); font-style: italic; text-align: center; padding: 2rem;">Wishlist Anda kosong.</p>'; return; }
    container.innerHTML = wishlistItems.map(item => {
        const daysAdded = Math.floor((new Date() - item.addedDate) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 30 - daysAdded);
        const canPurchase = daysLeft === 0;
        return `<div class="wishlist-item" style="${canPurchase ? 'border: 2px solid var(--primary-green);' : ''}"><div><h4>${item.name} ${canPurchase ? '🎉' : ''}</h4><p style="font-size: 0.85rem; color: var(--text-light);">Ditambahkan ${daysAdded} hari lalu</p>${canPurchase ? `<p style="color: var(--primary-green); font-weight: 600;">Siap untuk dibeli!</p>` : ''}</div><div>${canPurchase ? `<button onclick="purchaseFromWishlist(${item.id})" class="btn-primary" style="font-size: 0.8rem; padding: 0.5rem 1rem; margin: 0.25rem;">Beli Sekarang</button>` : `<div class="countdown">${daysLeft} hari lagi</div>`}<button onclick="removeFromWishlist(${item.id})" class="btn-primary" style="background: #dc3545; font-size: 0.7rem; padding: 0.3rem 0.6rem; margin-top: 0.25rem;">Hapus</button></div></div>`;
    }).join('');
}
function purchaseFromWishlist(itemId) {
    const item = wishlistItems.find(item => item.id === itemId);
    if (!item || Math.floor((new Date() - item.addedDate) / (1000 * 60 * 60 * 24)) < 30) { showNotification('Item belum melewati masa tunggu 30 hari!', 'warning'); return; }
    if (!checkSpendingLimit(item.price)) { return; }
    removeFromWishlist(itemId); spentThisMonth += item.price; dailyPurchaseCount++; userRewards.tradePoints += 15;
    const newWardrobeItem = { id: Date.now(), name: item.name, category: 'tops', color: 'blue', price: item.price, brand: 'Mindful Buy', wearCount: 0, lastWorn: null, emoji: '🛍️' }; wardrobeItems.push(newWardrobeItem);
    showSweetAlert('🎉 Pembelian Berhasil!', `${item.name} berhasil dibeli. +15 Poin untuk Pembelian Mindful!`, 'success');
    updateBudgetDisplay(); loadDashboard();
}
function addToWishlist() { 
    const itemName = document.getElementById('wishlistItem').value.trim();
    const itemPrice = parseInt(document.getElementById('wishlistPrice').value);
    if (!itemName || isNaN(itemPrice) || itemPrice <= 0) {
        showNotification('Harap isi Nama Item dan Harga yang valid!', 'error');
        return;
    }
    showNotification('Item ditambahkan ke Wishlist. Lakukan pembelian secara bijak!', 'success'); 
    wishlistItems.push({id: Date.now(), name: itemName, price: itemPrice, addedDate: new Date(), waitingPeriod: 30}); 
    document.getElementById('wishlistItem').value = '';
    document.getElementById('wishlistPrice').value = '';
    renderWishlist(); 
}
function removeFromWishlist(itemId) { wishlistItems = wishlistItems.filter(item => item.id !== itemId); showNotification('Item dihapus dari wishlist.', 'info'); renderWishlist(); }
function addToWishlistFromProduct(productName, price) { showNotification(`${productName} ditambahkan ke Wishlist 30-Hari!`, 'success'); wishlistItems.push({id: Date.now(), name: productName, price: price, addedDate: new Date(), waitingPeriod: 30}); renderWishlist(); }

// --- Upcycling/Donation/Trade ---

function showUpcyclingSelection() {
    const upcycleableItems = wardrobeItems.filter(item => ['tops', 'bottoms', 'dresses'].includes(item.category));
    
    if (upcycleableItems.length === 0) {
          showNotification('Tidak ada item yang cocok untuk upcycling (butuh Atasan, Bawahan, atau Dress).', 'warning');
          return;
    }
    
    const select = document.getElementById('upcycleItemSelect');
    select.innerHTML = upcycleableItems.map(item => 
        `<option value="${item.id}">${item.emoji} ${item.name} (Worn ${item.wearCount}x)</option>`
    ).join('');
    
    openModal('upcyclingSelectionModal');
}

function startUpcyclingProcess() {
    const itemId = parseInt(document.getElementById('upcycleItemSelect').value);
    const item = wardrobeItems.find(i => i.id === itemId);
    if (!item) return;

    closeModal('upcyclingSelectionModal');
    
    const loadingContent = document.getElementById('upcyclingProcessContent');
    loadingContent.innerHTML = `
        <div class="wrap-loading">
            <div class="wrap-item">${item.emoji}</div>
            <h3 style="margin-top: 2rem; color: var(--forest-green);">Menganalisis: ${item.name}</h3>
            <p>Mencari ide terbaik untuk daur ulang...</p>
        </div>
    `;
    openModal('upcyclingLoadingModal');

    setTimeout(() => {
        wardrobeItems = wardrobeItems.filter(i => i.id !== itemId);
        userRewards.tradePoints += 15;
        
        let resultName = '';
        let resultEmoji = '';
        if (item.category === 'bottoms' && item.name.includes('Jeans')) {
            resultName = 'Tas Tote & Pouch Kecil';
            resultEmoji = '👜';
        } else if (item.category === 'tops' || item.name.includes('Kemeja')) {
            resultName = 'Scrunchie Set atau Kain Lap';
            resultEmoji = '✂️';
        } else if (item.category === 'dresses') {
            resultName = 'Rok Mini Musim Panas & Syal';
            resultEmoji = '👗';
        } else {
            resultName = 'Kain Lap Serbaguna & Bandana';
            resultEmoji = '🧻';
        }

        loadingContent.innerHTML = `
            <div style="padding: 1rem;">
                <h3 style="color: var(--primary-green); margin-bottom: 1rem;">🎉 Ide Upcycling Selesai!</h3>
                <div style="font-size: 4rem; margin: 1rem 0;">${item.emoji} &rarr; ${resultEmoji}</div>
                <h4>**${item.name}** diubah menjadi: **${resultName}**!</h4>
                <p style="margin-top: 1rem;">Anda berhasil mengurangi sampah tekstil. **+15 Trade Points!**</p>
                <button class="btn-primary" onclick="closeModal('upcyclingLoadingModal'); loadDashboard()" style="margin-top: 1.5rem;">Selesai</button>
            </div>
        `;
        
    }, 3000);
}

function showDonationOptions() {
    const donatableItems = wardrobeItems.filter(item => item.wearCount <= 1);
    
    if (donatableItems.length === 0) {
          showSweetAlert('Tidak Ada Item Potensial Donasi', 'Item yang paling baik didonasikan adalah yang jarang dipakai atau memiliki nilai rendah. Anda bisa memilih item secara manual jika tetap ingin berdonasi.', 'warning');
          return;
    }
    
    const listContainer = document.getElementById('donatableItemsList');
    listContainer.innerHTML = donatableItems.map(item => `
        <div class="trade-card">
            <div>
                <input type="checkbox" id="donate-${item.id}" value="${item.id}" style="margin-right: 10px; accent-color: var(--primary-green);">
                <label for="donate-${item.id}"><strong>${item.emoji} ${item.name}</strong></label>
            </div>
            <span style="font-size: 0.9rem; color: var(--text-dark);">Dipakai ${item.wearCount}x</span>
        </div>
    `).join('');
    
    openModal('donationSelectionModal');
}

function confirmDonation() {
    const checkedItems = Array.from(document.querySelectorAll('#donatableItemsList input:checked')).map(input => parseInt(input.value));
    const targetName = document.getElementById('donationTargetSelect').options[document.getElementById('donationTargetSelect').selectedIndex].text;
    if (checkedItems.length === 0) { showNotification('Pilih minimal 1 item untuk didonasikan.', 'warning'); return; }
    const donatedItemsCount = checkedItems.length; wardrobeItems = wardrobeItems.filter(item => !checkedItems.includes(item.id));
    userRewards.donations += donatedItemsCount; userRewards.tradePoints += donatedItemsCount * 5;
    closeModal('donationSelectionModal');
    showSweetAlert('🎉 Donasi Berhasil!', `<h4>Terima kasih atas donasi **${donatedItemsCount} item**!</h4><p>Donasi Anda akan disalurkan kepada **${targetName}**.</p><p style="margin-top: 1rem; color: var(--primary-green); font-weight: 600;">+${donatedItemsCount * 5} Trade Points diterima!</p>`, 'success');
    loadDashboard();
}

function loadTradePage() {
    const container = document.getElementById('tradeOffersList');
    const tradeableItems = getRarelyWornItems();

    if (tradeableItems.length === 0) {
        container.innerHTML = `<div class="challenge-card" style="text-align: center;"><h3>Anda Tidak Memiliki Item yang Perlu Ditukar</h3><p>Semua item Anda sering dipakai. Trade berlaku untuk item dengan Wear Count < 3. Teruslah pakai pakaian Anda!</p></div>`;
        return;
    }

    container.innerHTML = tradeOffersData.map(offer => {
        const userItem = wardrobeItems.find(item => item.id === offer.userItem);
        if (!userItem) return '';

        return `
            <div class="trade-card" onclick="viewTradeDetail(${offer.id})">
                <div>
                    <h4>${offer.offerItem.emoji} ${offer.offerItem.name}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-dark);">Tukar dengan: ${userItem.emoji} ${userItem.name}</p>
                </div>
                <div style="text-align: right;">
                    <span class="challenge-status" style="background: ${offer.partnerStatus === 'accepted' ? '#51CF66' : '#FF6B6B'}; color: white; padding: 0.3rem 0.6rem; border-radius: 12px;">
                        ${offer.partnerStatus === 'accepted' ? 'Partner Setuju' : 'Menunggu Partner'}
                    </span>
                    <p style="font-size: 0.8rem; color: var(--text-light); margin-top: 5px;">Dari: ${offer.partnerName}</p>
                </div>
            </div>
        `;
    }).join('');
}

function showTradePage() {
    loadTradePage();
    showPage('tradePage', { target: document.querySelector('.action-btn[onclick="showTradePage()"]') });
}

function viewTradeDetail(tradeId) {
    const offer = tradeOffersData.find(t => t.id === tradeId);
    if (!offer) return;

    currentTradeOffer = offer;
    const userItem = wardrobeItems.find(item => item.id === offer.userItem);
    if (!userItem) {
          showNotification('Item Anda yang akan ditukar sudah tidak ada di lemari.', 'error');
          return;
    }

    const tradeItemInfo = document.getElementById('tradeItemInfo');
    tradeItemInfo.innerHTML = `
        <h3 style="color: var(--primary-green); text-align: center; margin-bottom: 1rem;">Proposal Trade</h3>
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; margin: 1rem 0; padding: 1.5rem; border: 1px solid var(--cream); border-radius: 12px;">
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${offer.offerItem.emoji}</div>
                <strong>Anda Akan Menerima:</strong><br>
                <p>${offer.offerItem.name}</p>
            </div>
            <div style="font-size: 2rem; color: var(--dark-green);">&harr;</div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${userItem.emoji}</div>
                <strong>Anda Memberi:</strong><br>
                <p>${userItem.name}</p>
            </div>
        </div>
    `;
    
    const userTradeItemSelect = document.getElementById('userTradeItemSelect');
    userTradeItemSelect.innerHTML = wardrobeItems
        .filter(item => item.wearCount < 3)
        .map(item => `<option value="${item.id}" ${item.id === userItem.id ? 'selected' : ''}>${item.name} (Worn ${item.wearCount}x)</option>`)
        .join('');
    
    document.getElementById('userTradeStatus').textContent = offer.userStatus === 'accepted' ? 'Setuju' : 'Belum Setuju';
    document.getElementById('partnerTradeStatus').textContent = offer.partnerStatus === 'accepted' ? offer.partnerName + ' Setuju' : 'Menunggu Partner';
    document.getElementById('userTradeStatus').style.color = offer.userStatus === 'accepted' ? '#51CF66' : '#dc3545';
    document.getElementById('partnerTradeStatus').style.color = offer.partnerStatus === 'accepted' ? '#51CF66' : '#dc3545';
    document.getElementById('agreeTradeBtn').textContent = offer.userStatus === 'accepted' ? 'Menunggu Konfirmasi' : '✅ Setujui Penukaran';
    document.getElementById('agreeTradeBtn').disabled = offer.userStatus === 'accepted';
    
    openModal('tradeDetailModal');
}

function agreeToTrade() {
    if (!currentTradeOffer) return;
    currentTradeOffer.userStatus = 'accepted';
    document.getElementById('userTradeStatus').textContent = 'Setuju';
    document.getElementById('userTradeStatus').style.color = '#51CF66';
    document.getElementById('agreeTradeBtn').textContent = 'Menunggu Konfirmasi';
    document.getElementById('agreeTradeBtn').disabled = true;
    showNotification('Persetujuan Anda telah dikirim! Menunggu konfirmasi dari partner trade...', 'info', 4000);
    if (currentTradeOffer.partnerStatus === 'accepted') { setTimeout(() => { completeTradeFinal(currentTradeOffer); }, 2000); }
}

function completeTradeFinal(offer) {
    const userItemIndex = wardrobeItems.findIndex(item => item.id === offer.userItem);
    if (userItemIndex === -1) { showNotification('Gagal: Item Anda sudah tidak ditemukan di lemari.', 'error'); closeModal('tradeDetailModal'); return; }
    wardrobeItems.splice(userItemIndex, 1);
    const newItem = { id: Date.now(), name: offer.offerItem.name, category: offer.offerItem.category, color: offer.offerItem.color, price: 0, brand: 'Traded', wearCount: 0, lastWorn: null, emoji: offer.offerItem.emoji }; wardrobeItems.push(newItem); userRewards.tradePoints += 10;
    closeModal('tradeDetailModal'); showSweetAlert('🎉 Trade Sukses!', `Penukaran **${newItem.name}** berhasil! Detail alamat akan dikirimkan. +10 Trade Points.`, 'success');
    loadDashboard(); loadTradePage();
}

// --- Other Placeholder Functions ---

function checkSpendingLimit(amount) {
    const newTotal = spentThisMonth + amount;
    if (newTotal > spendingLimit) { showSweetAlert('Batas Pengeluaran Terlampaui!', `Pembelian ini akan melebihi batas pengeluaran bulanan Anda. Coba opsi *secondhand* atau *trading*.`, 'warning'); return false; }
    if (dailyPurchaseCount >= dailyPurchaseLimit) { showSweetAlert('Batas Pembelian Harian Tercapai!', `Anda telah mencapai batas pembelian harian. Lanjutkan berbelanja besok!`, 'warning'); return false; }
    return true;
}

function showColorPalette() {
    const allColors = wardrobeItems.map(item => item.color);
    if (allColors.length === 0) {
          showNotification('Tambahkan item untuk rekomendasi warna!', 'warning');
          return;
    }
    const uniqueColors = [...new Set(allColors)];
    const selectedColor = uniqueColors[Math.floor(Math.random() * uniqueColors.length)];
    
    // Simplistic palette generation (similar to the original logic)
    const colorPalettes = {
        'black': ['white', 'gray', 'red', 'gold', 'silver'],
        'white': ['black', 'blue', 'pink', 'green', 'navy'],
        'blue': ['white', 'yellow', 'brown', 'gray', 'cream'],
        'red': ['black', 'white', 'gold', 'navy', 'gray'],
        'green': ['brown', 'cream', 'white', 'gold', 'beige'],
        'pink': ['white', 'gray', 'black', 'gold', 'navy'],
        'yellow': ['blue', 'white', 'brown', 'black', 'gray'],
        'gray': ['white', 'black', 'pink', 'blue', 'yellow'],
        'brown': ['cream', 'white', 'green', 'gold', 'orange']
    };
    const palette = colorPalettes[selectedColor] || ['white', 'black', 'gray'];
    
    const paletteHtml = `
        <div style="text-align: center; padding: 0.5rem;">
            <h3>Color Palette untuk ${selectedColor.toUpperCase()}</h3>
            <div style="display: flex; justify-content: center; gap: 1rem; margin: 1rem 0; flex-wrap: wrap;">
                ${palette.map(color => 
                    `<div style="width: 50px; height: 50px; background: ${color}; border: 2px solid #ccc; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${['white', 'yellow', 'cream'].includes(color) ? 'black' : 'white'}; font-weight: bold; font-size: 0.8rem;">${color.charAt(0).toUpperCase()}</div>`
                ).join('')}
            </div>
            <p>Warna yang cocok dipadu dengan ${selectedColor}: <strong>${palette.join(', ')}</strong></p>
        </div>
    `;
    
    showSweetAlert('🎨 AI Color Palette', paletteHtml);
}

function getWeatherRecommendations() {
    const { temp, condition } = weatherData;
    let recommendations = [];
    
    if (temp > 30) {
        recommendations.push("Pilih bahan katun atau linen yang menyerap keringat");
    } else if (temp < 20) {
        recommendations.push("Layer dengan cardigan atau jaket");
    } else {
        recommendations.push("Cuaca sempurna untuk mix and match apa pun!");
    }
    
    if (condition === 'Hujan') {
        recommendations.push("Jangan lupa jaket anti air dan pilih sepatu waterproof!");
    } else {
        recommendations.push(`Cuaca ${condition.toUpperCase()} sangat mendukung gaya Anda!`);
    }
    
    return recommendations.length > 0 ? recommendations : ["Rekomendasi umum: pakai apa yang membuat Anda bahagia hari ini!"];
}

function showWeatherRecommendations() {
    const recommendations = getWeatherRecommendations();
    
    showSweetAlert(
        '🌤️ Rekomendasi Outfit Berdasarkan Cuaca',
        `
            <div style="text-align: left;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌤️</div>
                    <p><strong>Cuaca Hari Ini:</strong> ${weatherData.temp}°C, ${weatherData.condition.toUpperCase()}</p>
                </div>
                
                <h4>Tips Outfit:</h4>
                <ul style="margin: 1rem 0;">
                    ${recommendations.map(rec => `<li style="margin: 0.5rem 0;">${rec}</li>`).join('')}
                </ul>
            </div>
        `,
        'info'
    );
}

function updateNoBuyChallenge() {
    if (noBuyProgressDays < 30) {
          noBuyProgressDays++; // Corrected logic to increment daily
          document.getElementById('noBuyProgress').textContent = noBuyProgressDays;
          document.querySelector('#challengesTab .budget-fill').style.width = (noBuyProgressDays / 30) * 100 + '%';
          showNotification(`Hari ${noBuyProgressDays} selesai! Tinggal ${30 - noBuyProgressDays} hari lagi.`, 'success');
          if (noBuyProgressDays === 30) {
              userRewards.tradePoints += 50;
              showSweetAlert('🏆 Challenge Completed!', 'Anda menyelesaikan 30-Day No-Buy Challenge! +50 Trade Points!', 'success');
          }
          loadDashboard();
    } else {
        showNotification('Challenge sudah selesai! Selamat!', 'info');
    }
}

function updateRewardsDisplay() {
    const level = userRewards.tradePoints >= 200 ? 'Platinum Sustainer' : userRewards.tradePoints >= 150 ? 'Gold Sustainer' : userRewards.tradePoints >= 100 ? 'Silver Supporter' : 'Bronze Beginner';
    userRewards.sustainabilityLevel = level;
    document.getElementById('tradePoints').textContent = userRewards.tradePoints;
    document.getElementById('itemsDonated').textContent = userRewards.donations;
    document.getElementById('userLevel').textContent = userRewards.sustainabilityLevel;
    document.querySelector('.profile-avatar').textContent = userData.name.charAt(0); // Use the user's initial
}

function updateImpactStats() {
    const totalWears = wardrobeItems.reduce((sum, item) => sum + item.wearCount, 0);
    const totalValue = wardrobeItems.reduce((sum, item) => sum + item.price, 0);
    const avgCostPerWear = totalValue / Math.max(totalWears, 1);
    const co2Saved = (totalWears * 0.1).toFixed(1);
    const waterSaved = (totalWears * 50).toLocaleString('id-ID');
    const moneySaved = (avgCostPerWear * totalWears * 0.2).toLocaleString('id-ID'); // Simplified calculation
    const impactNumbers = document.querySelectorAll('#impactTab .impact-number');
    if (impactNumbers.length >= 4) {
        impactNumbers[0].textContent = co2Saved;
        impactNumbers[1].textContent = waterSaved;
        impactNumbers[2].textContent = userRewards.donations;
        impactNumbers[3].textContent = `Rp ${moneySaved}`;
    }
}

function showTutorial(type) { 
    const tutorials = { 'button': { title: 'Cara Jahit Kancing', steps: ['Siapkan jarum & benang', 'Jahit kancing 6-8 kali', 'Buat simpul kuat'], time: '10 min' }, 'hole': { title: 'Menambal Lubang Kecil', steps: ['Siapkan kain perca', 'Gunting lebih besar dari lubang', 'Jahit keliling dengan rapi'], time: '20 min' }, 'zipper': { title: 'Memperbaiki Resleting', steps: ['Bersihkan gigi resleting', 'Oleskan sabun batangan', 'Gerakkan perlahan'], time: '15 min' }, 'hem': { title: 'Memendekkan Celana', steps: ['Ukur panjang baru', 'Potong, sisakan kelim 3-4cm', 'Jahit kelim dengan tangan/mesin'], time: '30 min' }, 'upcycling-idea': { title: 'Ide Upcycling Dasar', steps: ['Jeans lama -> Tas Tote', 'T-shirt lama -> Kain Lap', 'Kemeja -> Scrunchie'], time: 'Variatif' } };
    const t = tutorials[type]; showSweetAlert(`📚 ${t.title}`, `<div style="text-align: left;"><p><strong>Waktu Estimasi:</strong> ${t.time}</p><h4 style="margin-top: 1rem; color: var(--forest-green);">Langkah-langkah Singkat:</h4><ol style="margin-left: 1.5rem;">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol><p style="margin-top: 1rem; font-style: italic;">"Memperbaiki adalah tindakan yang paling ramah lingkungan."</p></div>`, 'info');
}

function showCommunityTab(tabId, event) {
    document.querySelectorAll('.community-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabId}Tab`).classList.add('active');
    
    document.querySelectorAll('.community-tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.target) { 
        event.target.classList.add('active'); 
    } else {
          const targetButton = document.querySelector(`.community-tab[onclick*="showCommunityTab('${tabId}'"]`);
          if (targetButton) targetButton.classList.add('active');
    }
}

// --- Minimal Placeholder Functions ---
function checkBrandSustainability() { showNotification('Simulasi: Brand mendapatkan rating "Good" (75/100).', 'info'); }
function viewImpact() { showPage('community', { target: document.querySelector('.community-tab[onclick*="showCommunityTab(\'impact\')"]') }); }
function showItemBreakdown() { showSweetAlert('Item Breakdown', 'Menampilkan rincian item berdasarkan kategori.', 'info'); }
function showValueBreakdown() { showSweetAlert('Value Breakdown', 'Menampilkan nilai total pakaian dan distribusi per kategori.', 'info'); }
function showCostPerWearAnalysis() { showSweetAlert('Cost/Wear Analysis', 'Menampilkan analisis biaya per pemakaian item.', 'info'); }
function showSustainabilityTips() { showSweetAlert('Sustainability Tips', 'Menampilkan skor keberlanjutan dan tips personalisasi.', 'info'); }
function showRareItemsSuggestions() { showSweetAlert('Items Jarang Dipakai', 'Menampilkan item yang jarang dipakai dan saran styling.', 'info'); }
function showTailorDetails(tailorName) { showNotification(`Menampilkan detail kontak dan arah ke ${tailorName}...`, 'info'); }

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    showPage('dashboard'); 
    loadMarketplace();
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });
    updateImpactStats();
});