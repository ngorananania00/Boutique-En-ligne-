// ============================================
//   DONNÉES EN localStorage
// ============================================

function getProducts() {
  const data = localStorage.getItem('shop_products');
  if (data) return JSON.parse(data);
  // Produits d'exemple par défaut
  return [
    {
      name: "Smartphone Samsung A54",
      desc: "Écran 6.4\", 128Go, batterie 5000mAh. Idéal pour photos et réseaux sociaux.",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
      price: 180000,
      promo: 150000,
      cat: "Électronique"
    },
    {
      name: "Ventilateur de table",
      desc: "Ventilateur silencieux 3 vitesses, rotation 360°, idéal pour bureau ou chambre.",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      price: 25000,
      promo: null,
      cat: "Électroménager"
    },
    {
      name: "Chaussures Nike Air",
      desc: "Baskets légères et respirantes, semelle amortissante. Disponibles en 40-45.",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      price: 55000,
      promo: 45000,
      cat: "Mode"
    },
    {
      name: "Sac à dos cuir",
      desc: "Sac spacieux en cuir synthétique, compartiment laptop, poches multiples.",
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
      price: 35000,
      promo: 28000,
      cat: "Accessoires"
    },
    {
      name: "Casque Bluetooth",
      desc: "Son HiFi, autonomie 20h, pliable et léger. Compatible tous smartphones.",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      price: 40000,
      promo: null,
      cat: "Électronique"
    },
    {
      name: "Mixeur de cuisine",
      desc: "500W, bol inox 1.5L, 3 vitesses. Parfait pour smoothies, sauces et soupe.",
      img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
      price: 22000,
      promo: 18000,
      cat: "Électroménager"
    }
  ];
}

function saveProducts(products) {
  localStorage.setItem('shop_products', JSON.stringify(products));
}

function getSettings() {
  const data = localStorage.getItem('shop_settings');
  if (data) return JSON.parse(data);
  return {
    name: "MonShop",
    phone: "+225 07 00 00 00 00",
    slogan: "Les meilleurs produits à prix choc !"
  };
}

function saveSettings_data(settings) {
  localStorage.setItem('shop_settings', JSON.stringify(settings));
}

// ============================================
//   FORMATAGE
// ============================================

function formatPrice(p) {
  return parseInt(p).toLocaleString('fr-FR') + ' FCFA';
}

function calcDiscount(original, promo) {
  return Math.round((1 - promo / original) * 100);
}

// ============================================
//   PAGE VITRINE (index.html)
// ============================================

let allProducts = [];

function renderShop() {
  const settings = getSettings();
  allProducts = getProducts();

  // Mettre à jour header
  const hp = document.getElementById('header-phone');
  if (hp) hp.textContent = settings.phone;
  const fp = document.getElementById('footer-phone');
  if (fp) fp.textContent = settings.phone;
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  renderGrid(allProducts);
}

function renderGrid(products) {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const settings = getSettings();

  grid.innerHTML = products.map((p, i) => {
    const hasPromo = p.promo && p.promo < p.price;
    const priceHTML = hasPromo
      ? `<span class="old-price">${formatPrice(p.price)}</span>
         <span class="new-price">${formatPrice(p.promo)}</span>
         <span class="badge-promo">-${calcDiscount(p.price, p.promo)}%</span>`
      : `<span class="normal-price">${formatPrice(p.price)}</span>`;

    return `
    <div class="card" onclick="openModal(${i})" style="animation-delay:${i * 0.06}s">
      <img class="card-img" src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x200?text=Image'" loading="lazy"/>
      <div class="card-body">
        ${p.cat ? `<div class="card-cat">${p.cat}</div>` : ''}
        <div class="card-name">${p.name}</div>
        <div class="card-prices">${priceHTML}</div>
        <div class="card-footer">📞 ${settings.phone}</div>
      </div>
    </div>`;
  }).join('');
}

function filterProducts() {
  const q = document.getElementById('search').value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.cat && p.cat.toLowerCase().includes(q)) ||
    (p.desc && p.desc.toLowerCase().includes(q))
  );
  renderGrid(filtered);
}

function openModal(index) {
  const p = allProducts[index];
  const settings = getSettings();
  const hasPromo = p.promo && p.promo < p.price;

  document.getElementById('modal-img').src = p.img;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.desc || '';

  const oldEl = document.getElementById('modal-old');
  const newEl = document.getElementById('modal-new');

  if (hasPromo) {
    oldEl.textContent = formatPrice(p.price);
    newEl.textContent = formatPrice(p.promo);
    oldEl.style.display = '';
  } else {
    oldEl.textContent = '';
    newEl.textContent = formatPrice(p.price);
    oldEl.style.display = 'none';
  }

  const callBtn = document.getElementById('modal-call');
  callBtn.href = 'tel:' + settings.phone.replace(/\s/g, '');
  callBtn.textContent = '📞 Appeler pour commander — ' + settings.phone;

  document.getElementById('modal').style.display = 'flex';
}

function closeModal(e) {
  if (e.target.id === 'modal') {
    document.getElementById('modal').style.display = 'none';
  }
}

// ============================================
//   PAGE ADMIN (admin.html)
// ============================================

function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  event.target.classList.add('active');
}

function renderAdminTable() {
  const tbody = document.getElementById('admin-tbody');
  if (!tbody) return;
  const products = getProducts();

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#9b8e7a;">Aucun produit. Cliquez sur "+ Ajouter"</td></tr>';
    return;
  }

  tbody.innerHTML = products.map((p, i) => {
    const hasPromo = p.promo && p.promo < p.price;
    return `<tr>
      <td><img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/56x48?text=?'"/></td>
      <td><strong>${p.name}</strong>${p.cat ? `<br/><small style="color:#9b8e7a">${p.cat}</small>` : ''}</td>
      <td>${formatPrice(p.price)}</td>
      <td>${hasPromo ? `<span style="color:#22863a;font-weight:600">${formatPrice(p.promo)}</span>` : '<span style="color:#9b8e7a">—</span>'}</td>
      <td>
        <button class="btn-edit" onclick="editProduct(${i})">✏️ Modifier</button>
        <button class="btn-del" onclick="deleteProduct(${i})">🗑️ Supprimer</button>
      </td>
    </tr>`;
  }).join('');
}

function openAddModal() {
  document.getElementById('form-title').textContent = 'Ajouter un produit';
  document.getElementById('edit-index').value = -1;
  document.getElementById('f-name').value = '';
  document.getElementById('f-desc').value = '';
  document.getElementById('f-img').value = '';
  document.getElementById('f-price').value = '';
  document.getElementById('f-promo').value = '';
  document.getElementById('f-cat').value = '';
  document.getElementById('admin-modal').style.display = 'flex';
}

function editProduct(i) {
  const products = getProducts();
  const p = products[i];
  document.getElementById('form-title').textContent = 'Modifier le produit';
  document.getElementById('edit-index').value = i;
  document.getElementById('f-name').value = p.name;
  document.getElementById('f-desc').value = p.desc || '';
  document.getElementById('f-img').value = p.img;
  document.getElementById('f-price').value = p.price;
  document.getElementById('f-promo').value = p.promo || '';
  document.getElementById('f-cat').value = p.cat || '';
  document.getElementById('admin-modal').style.display = 'flex';
}

function saveProduct(e) {
  e.preventDefault();
  const products = getProducts();
  const idx = parseInt(document.getElementById('edit-index').value);

  const product = {
    name:  document.getElementById('f-name').value.trim(),
    desc:  document.getElementById('f-desc').value.trim(),
    img:   document.getElementById('f-img').value.trim(),
    price: parseInt(document.getElementById('f-price').value),
    promo: document.getElementById('f-promo').value ? parseInt(document.getElementById('f-promo').value) : null,
    cat:   document.getElementById('f-cat').value.trim()
  };

  if (idx === -1) {
    products.push(product);
  } else {
    products[idx] = product;
  }

  saveProducts(products);
  document.getElementById('admin-modal').style.display = 'none';
  renderAdminTable();
}

function deleteProduct(i) {
  if (!confirm('Supprimer ce produit ?')) return;
  const products = getProducts();
  products.splice(i, 1);
  saveProducts(products);
  renderAdminTable();
}

function closeAdminModal(e) {
  if (e.target.id === 'admin-modal') {
    document.getElementById('admin-modal').style.display = 'none';
  }
}

// SETTINGS
function loadSettings() {
  const settings = getSettings();
  const nameEl = document.getElementById('shop-name');
  const phoneEl = document.getElementById('shop-phone');
  const sloganEl = document.getElementById('shop-slogan');
  if (nameEl) nameEl.value = settings.name;
  if (phoneEl) phoneEl.value = settings.phone;
  if (sloganEl) sloganEl.value = settings.slogan || '';
}

function saveSettings() {
  const settings = {
    name:   document.getElementById('shop-name').value.trim(),
    phone:  document.getElementById('shop-phone').value.trim(),
    slogan: document.getElementById('shop-slogan').value.trim()
  };
  saveSettings_data(settings);
  const msg = document.getElementById('settings-msg');
  msg.textContent = '✅ Paramètres enregistrés !';
  setTimeout(() => { msg.textContent = ''; }, 3000);
}

// ============================================
//   INIT
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-grid')) {
    renderShop();
  }
});
