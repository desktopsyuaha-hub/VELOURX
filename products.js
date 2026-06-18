/* =============================================
   VELOURX — products.js
   Filtering, sorting, search, quick view, pagination
   ============================================= */

let currentFilters = { cat: [], price: [], sub: [], status: [] };
let currentSort = 'default';
let currentSearch = '';
let visibleCount = 20;
const PAGE_SIZE = 20;
let currentCols = 4;

/* ---- READ URL PARAMS ---- */
function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const sale = params.get('sale');
  const filterNew = params.get('filter');

  if (cat) {
    currentFilters.cat = [cat];
    const checkbox = document.querySelector(`input[name="cat"][value="${cat}"]`);
    if (checkbox) checkbox.checked = true;
    updatePageHeader(cat.charAt(0).toUpperCase() + cat.slice(1), `Shop our full ${cat} collection`);
  }
  if (sale === 'true') {
    currentFilters.status = ['sale'];
    const checkbox = document.querySelector(`input[name="status"][value="sale"]`);
    if (checkbox) checkbox.checked = true;
    updatePageHeader('Sale', 'Up to 50% off selected styles — while stocks last');
  }
  if (filterNew === 'new') {
    currentFilters.status = ['new'];
    const checkbox = document.querySelector(`input[name="status"][value="new"]`);
    if (checkbox) checkbox.checked = true;
    updatePageHeader('New Arrivals', 'Fresh drops, just landed');
  }
}

function updatePageHeader(title, sub) {
  const titleEl = document.getElementById('pageTitle');
  const subEl = document.getElementById('pageSubtitle');
  const crumbEl = document.getElementById('breadcrumbCurrent');
  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = sub;
  if (crumbEl) crumbEl.textContent = title;
}

/* ---- FILTER LOGIC ---- */
function matchesFilters(p) {
  // search
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    if (!p.name.toLowerCase().includes(q) && !p.cat.toLowerCase().includes(q) && !p.sub.toLowerCase().includes(q)) {
      return false;
    }
  }
  // category
  if (currentFilters.cat.length && !currentFilters.cat.includes(p.cat)) return false;
  // sub-type
  if (currentFilters.sub.length && !currentFilters.sub.includes(p.sub)) return false;
  // status
  if (currentFilters.status.length) {
    const wantsNew = currentFilters.status.includes('new');
    const wantsSale = currentFilters.status.includes('sale');
    const isNew = p.new;
    const isSale = !!p.old;
    if (wantsNew && wantsSale) { if (!isNew && !isSale) return false; }
    else if (wantsNew && !isNew) return false;
    else if (wantsSale && !isSale) return false;
  }
  // price
  if (currentFilters.price.length) {
    const inRange = currentFilters.price.some(range => {
      const [min, max] = range.split('-').map(Number);
      return p.price >= min && p.price <= max;
    });
    if (!inRange) return false;
  }
  return true;
}

function getFilteredSortedProducts() {
  let list = PRODUCTS.filter(matchesFilters);

  switch (currentSort) {
    case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
    case 'price-desc': list.sort((a,b) => b.price - a.price); break;
    case 'new':         list = list.filter(p => p.new).concat(list.filter(p => !p.new)); break;
    case 'sale':        list = list.filter(p => p.old).concat(list.filter(p => !p.old)); break;
    case 'name':        list.sort((a,b) => a.name.localeCompare(b.name)); break;
    default: break;
  }
  return list;
}

/* ---- RENDER GRID ---- */
function renderGrid() {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreInfo = document.getElementById('loadMoreInfo');

  const filtered = getFilteredSortedProducts();
  resultsCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    loadMoreWrap.style.display = 'none';
    return;
  }
  emptyState.style.display = 'none';

  const toShow = filtered.slice(0, visibleCount);
  grid.innerHTML = toShow.map(buildCardWithQuickView).join('');
  bindCartButtons(grid);
  bindQuickViewButtons(grid);
  bindWishButtons(grid);

  if (visibleCount >= filtered.length) {
    loadMoreWrap.style.display = 'none';
  } else {
    loadMoreWrap.style.display = 'block';
    loadMoreInfo.textContent = `Showing ${toShow.length} of ${filtered.length} products`;
  }

  renderActiveFilterTags();
}

/* ---- CARD WITH QUICK VIEW BUTTON ---- */
function buildCardWithQuickView(p) {
  const badgeClass = p.badge === 'New' || p.new ? 'new-badge' : p.badge === 'Sale' ? 'sale-badge' : '';
  const badgeText = p.badge || (p.new ? 'New' : '');
  const badge = badgeText ? `<span class="prod-badge ${badgeClass}">${badgeText}</span>` : '';
  const oldPrice = p.old ? `<span class="prod-old">$${p.old}</span>` : '';
  return `
    <div class="prod-card" data-id="${p.id}">
      <div class="prod-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${badge}
        <div class="prod-actions">
          <button class="quick-add" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
          <button class="wish-btn" data-id="${p.id}" aria-label="Wishlist">♡</button>
        </div>
      </div>
      <div class="prod-info" style="cursor:pointer" data-qv="${p.id}">
        <p class="prod-cat">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)} · ${p.sub}</p>
        <h3 class="prod-name">${p.name}</h3>
        <div class="prod-pricing"><span class="prod-price">$${p.price}</span>${oldPrice}</div>
      </div>
    </div>`;
}

/* ---- WISHLIST ---- */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('velourx_wishlist') || '[]'); }
  catch { return []; }
}
function bindWishButtons(scope) {
  const wishlist = getWishlist();
  scope.querySelectorAll('.wish-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (wishlist.includes(id)) { btn.textContent = '♥'; btn.classList.add('active-wish'); }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      let wl = getWishlist();
      if (wl.includes(id)) {
        wl = wl.filter(i => i !== id);
        btn.textContent = '♡';
        showToast('Removed from wishlist');
      } else {
        wl.push(id);
        btn.textContent = '♥';
        showToast('♥ Added to wishlist');
      }
      localStorage.setItem('velourx_wishlist', JSON.stringify(wl));
    });
  });
}

/* ---- QUICK VIEW MODAL ---- */
function bindQuickViewButtons(scope) {
  scope.querySelectorAll('[data-qv]').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.qv);
      openQuickView(id);
    });
  });
}

function openQuickView(id) {
  const p = PRODUCTS.find(prod => prod.id === id);
  if (!p) return;
  const overlay = document.getElementById('qvOverlay');
  const inner = document.getElementById('qvInner');
  const sizes = ['XS','S','M','L','XL','XXL'];
  const savings = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0;

  inner.innerHTML = `
    <div class="qv-img"><img src="${p.img}" alt="${p.name}"/></div>
    <div class="qv-details">
      <p class="qv-cat">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)} · ${p.sub}</p>
      <h2 class="qv-name">${p.name}</h2>
      <div class="qv-price-row">
        <span class="qv-price">$${p.price}</span>
        ${p.old ? `<span class="qv-old">$${p.old}</span><span class="qv-savings">Save ${savings}%</span>` : ''}
      </div>
      <p class="qv-size-label">Select Size</p>
      <div class="qv-sizes" id="qvSizes">
        ${sizes.map(s => `<button class="size-chip" data-size="${s}">${s}</button>`).join('')}
      </div>
      <p class="qv-qty-label">Quantity</p>
      <div class="qv-qty-row">
        <button class="qty-btn" id="qtyMinus">−</button>
        <span class="qty-val" id="qtyVal">1</span>
        <button class="qty-btn" id="qtyPlus">+</button>
      </div>
      <button class="qv-add-btn" id="qvAddBtn">Add to Cart — $${p.price}</button>
      <button class="qv-view-btn" id="qvViewBtn">View Full Details</button>
    </div>
  `;

  // size selection
  let selectedSize = 'M';
  inner.querySelectorAll('.size-chip').forEach(chip => {
    if (chip.dataset.size === 'M') chip.classList.add('selected');
    chip.addEventListener('click', () => {
      inner.querySelectorAll('.size-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedSize = chip.dataset.size;
    });
  });

  // qty
  let qty = 1;
  const qtyVal = inner.querySelector('#qtyVal');
  inner.querySelector('#qtyMinus').addEventListener('click', () => {
    if (qty > 1) { qty--; qtyVal.textContent = qty; }
  });
  inner.querySelector('#qtyPlus').addEventListener('click', () => {
    if (qty < 10) { qty++; qtyVal.textContent = qty; }
  });

  // add to cart
  inner.querySelector('#qvAddBtn').addEventListener('click', () => {
    const cart = getCart();
    const key = `${p.id}-${selectedSize}`;
    const existing = cart.find(i => i.key === key);
    if (existing) { existing.qty += qty; }
    else { cart.push({ id: p.id, key, name: p.name, price: p.price, size: selectedSize, qty, img: p.img }); }
    saveCart(cart);
    showToast(`✓ ${p.name} (${selectedSize}) ×${qty} added`);
    closeQuickView();
  });

  inner.querySelector('#qvViewBtn').addEventListener('click', () => {
    window.location.href = `product-detail.html?id=${p.id}`;
  });

  overlay.classList.add('open');
}

function closeQuickView() {
  document.getElementById('qvOverlay').classList.remove('open');
}

/* ---- ACTIVE FILTER TAGS ---- */
function renderActiveFilterTags() {
  const container = document.getElementById('activeFilterTags');
  if (!container) return;
  const tags = [];
  const labels = { price: { '0-40':'Under $40','40-80':'$40–$80','80-120':'$80–$120','120-999':'Over $120' } };

  Object.keys(currentFilters).forEach(group => {
    currentFilters[group].forEach(val => {
      const label = group === 'price' ? labels.price[val] : (val.charAt(0).toUpperCase() + val.slice(1));
      tags.push({ group, val, label });
    });
  });

  container.innerHTML = tags.map(t => `
    <span class="filter-tag">${t.label} <button data-group="${t.group}" data-val="${t.val}">✕</button></span>
  `).join('');

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const val = btn.dataset.val;
      currentFilters[group] = currentFilters[group].filter(v => v !== val);
      const checkbox = document.querySelector(`input[name="${group}"][value="${val}"]`);
      if (checkbox) checkbox.checked = false;
      visibleCount = PAGE_SIZE;
      renderGrid();
    });
  });
}

/* ---- CLEAR ALL FILTERS ---- */
function clearAllFilters() {
  currentFilters = { cat: [], price: [], sub: [], status: [] };
  currentSearch = '';
  visibleCount = PAGE_SIZE;
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  updatePageHeader('All Products', '104 styles across Men, Women, Teens & Kids');
  renderGrid();
}

/* ---- BIND FILTER CHECKBOXES ---- */
function bindFilterCheckboxes() {
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const group = cb.name;
      if (cb.checked) {
        if (!currentFilters[group].includes(cb.value)) currentFilters[group].push(cb.value);
      } else {
        currentFilters[group] = currentFilters[group].filter(v => v !== cb.value);
      }
      visibleCount = PAGE_SIZE;
      renderGrid();
    });
  });
}

/* ---- FILTER GROUP COLLAPSE ---- */
function bindFilterGroupToggle() {
  document.querySelectorAll('.filter-group-title').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const body = document.getElementById(`filter-${group}`);
      const chevron = btn.querySelector('.chevron');
      body.classList.toggle('open');
      chevron.classList.toggle('open');
    });
  });
}

/* ---- SORT ---- */
function bindSort() {
  const select = document.getElementById('sortSelect');
  if (!select) return;
  select.addEventListener('change', () => {
    currentSort = select.value;
    visibleCount = PAGE_SIZE;
    renderGrid();
  });
}

/* ---- VIEW TOGGLE ---- */
function bindViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCols = parseInt(btn.dataset.cols);
      const grid = document.getElementById('productsGrid');
      grid.classList.remove('cols-2', 'cols-4');
      grid.classList.add(`cols-${currentCols}`);
    });
  });
}

/* ---- LOAD MORE ---- */
function bindLoadMore() {
  const btn = document.getElementById('loadMoreBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    visibleCount += PAGE_SIZE;
    renderGrid();
  });
}

/* ---- MOBILE FILTER SIDEBAR ---- */
function bindMobileFilter() {
  const btn = document.getElementById('mobileFilterBtn');
  const sidebar = document.getElementById('filterSidebar');
  const overlay = document.getElementById('filterOverlay');
  if (!btn) return;
  btn.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}

/* ---- SEARCH ---- */
function toggleSearchBar() {
  const bar = document.getElementById('searchBarDrop');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
  }
}
function bindSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    currentSearch = input.value.trim();
    visibleCount = PAGE_SIZE;
    if (currentSearch) {
      updatePageHeader(`Search: "${currentSearch}"`, `Results for "${currentSearch}"`);
    }
    renderGrid();
  });
}

/* ---- QUICK VIEW CLOSE BINDINGS ---- */
function bindQuickViewClose() {
  document.getElementById('qvClose').addEventListener('click', closeQuickView);
  document.getElementById('qvOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'qvOverlay') closeQuickView();
  });
}

/* ---- CLEAR FILTERS BTN ---- */
function bindClearFiltersBtn() {
  const btn = document.getElementById('clearFiltersBtn');
  if (btn) btn.addEventListener('click', clearAllFilters);
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  readUrlParams();
  bindFilterCheckboxes();
  bindFilterGroupToggle();
  bindSort();
  bindViewToggle();
  bindLoadMore();
  bindMobileFilter();
  bindSearch();
  bindQuickViewClose();
  bindClearFiltersBtn();
  renderGrid();

  window.toggleSearchBar = toggleSearchBar;
  window.clearAllFilters = clearAllFilters;
});
                          
