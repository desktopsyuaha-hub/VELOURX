/* =============================================
   VELOURX — detail.js
   Single product detail page logic
   ============================================= */

let currentProduct = null;
let selectedSize = 'M';
let selectedColor = 0;
let currentQty = 1;

const COLOR_OPTIONS = ['#0A0E1A', '#C9A84C', '#8A8FA8', '#E84040', '#2C8C4A'];

const REVIEW_NAMES = ['Sarah M.','James K.','Priya S.','Emma L.','Aisha R.','Daniel W.','Olivia T.','Marcus B.','Nina P.','Carlos D.'];
const REVIEW_TEXTS = [
  "Honestly exceeded my expectations. The fit is perfect and the material feels premium. Will definitely buy more colors.",
  "Great quality for the price. Shipping was fast too — arrived in just 3 days. Highly recommend to anyone on the fence.",
  "Love this so much! Fits true to size and looks even better in person. Already got compliments wearing it out.",
  "Good product overall, though I'd say it runs slightly large. Order one size down if you like a snug fit.",
  "This is my third order from VELOURX and they never disappoint. Consistent quality every single time.",
  "Beautiful design, comfortable fabric, and the packaging was lovely too. Felt like a really premium unboxing experience."
];

/* ---- GET PRODUCT ID FROM URL ---- */
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id')) || 1;
}

/* ---- BUILD GALLERY IMAGES (reuse main + variants via unsplash params) ---- */
function getGalleryImages(p) {
  const base = p.img.split('?')[0];
  return [
    `${base}?w=700&q=85`,
    `${base}?w=700&q=85&sat=-20`,
    `${base}?w=700&q=85&blend=000000&blend-alpha=10`,
    `${base}?w=700&q=85&flip=h`
  ];
}

/* ---- RENDER MAIN DETAIL ---- */
function renderDetail() {
  const id = getProductIdFromUrl();
  const p = PRODUCTS.find(prod => prod.id === id) || PRODUCTS[0];
  currentProduct = p;
  selectedSize = 'M';
  selectedColor = 0;
  currentQty = 1;

  document.getElementById('pageTitleTag').textContent = `${p.name} — VELOURX`;
  document.getElementById('bcCat').textContent = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);
  document.getElementById('bcCat').href = `products.html?cat=${p.cat}`;
  document.getElementById('bcName').textContent = p.name;

  const images = getGalleryImages(p);
  const savings = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0;
  const sizes = ['XS','S','M','L','XL','XXL'];

  const main = document.getElementById('detailMain');
  main.innerHTML = `
    <div class="detail-gallery">
      <div class="gallery-thumbs" id="galleryThumbs">
        ${images.map((img, i) => `<div class="gallery-thumb ${i===0?'active':''}" data-img="${img}"><img src="${img}" alt="${p.name} ${i+1}"/></div>`).join('')}
      </div>
      <div class="gallery-main">
        ${p.badge || p.new ? `<span class="gallery-badge">${p.badge || 'New'}</span>` : ''}
        <img src="${images[0]}" alt="${p.name}" id="galleryMainImg"/>
        <span class="gallery-zoom-hint">Hover to zoom</span>
      </div>
    </div>

    <div class="detail-info">
      <p class="di-cat">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)} · ${p.sub}</p>
      <h1 class="di-name">${p.name}</h1>
      <div class="di-rating">
        <span class="di-stars">★★★★★</span>
        <span class="di-rating-text">4.8 · <a id="jumpToReviews">127 reviews</a></span>
      </div>

      <div class="di-price-row">
        <span class="di-price">$${p.price}</span>
        ${p.old ? `<span class="di-old">$${p.old}</span><span class="di-save">Save ${savings}%</span>` : ''}
      </div>

      <p class="di-stock">In Stock — Ships within 24 hours</p>

      <p class="di-section-label">Color <span class="size-guide-link" style="visibility:hidden">Size Guide</span></p>
      <div class="di-color-row" id="colorRow">
        ${COLOR_OPTIONS.map((c,i) => `<span class="color-swatch ${i===0?'selected':''}" style="background:${c}" data-color="${i}"></span>`).join('')}
      </div>

      <p class="di-section-label">Size <span class="size-guide-link" id="sizeGuideLink">Size Guide</span></p>
      <div class="di-sizes" id="sizeRow">
        ${sizes.map(s => `<button class="size-chip ${s==='M'?'selected':''}" data-size="${s}">${s}</button>`).join('')}
      </div>

      <p class="di-section-label">Quantity</p>
      <div class="qv-qty-row" id="qtyRow">
        <button class="qty-btn" id="dQtyMinus">−</button>
        <span class="qty-val" id="dQtyVal">1</span>
        <button class="qty-btn" id="dQtyPlus">+</button>
      </div>

      <div class="di-actions">
        <button class="di-add-cart" id="dAddCart">Add to Cart — $${p.price}</button>
        <button class="di-wish-btn" id="dWishBtn">♡</button>
      </div>
      <button class="di-buynow" id="dBuyNow">Buy It Now</button>

      <div class="di-trust-row">
        <div class="trust-item"><span class="icon">🚚</span> Free shipping on orders over $49</div>
        <div class="trust-item"><span class="icon">↩️</span> 30-day free returns & exchanges</div>
        <div class="trust-item"><span class="icon">🔒</span> Secure checkout, encrypted payment</div>
      </div>
    </div>
  `;

  bindGallery();
  bindColorSwatches();
  bindSizeChips();
  bindQtyButtons();
  bindAddToCart();
  bindBuyNow();
  bindWishlistDetail();

  document.getElementById('jumpToReviews').addEventListener('click', () => {
    switchTab('reviews');
    document.querySelector('.detail-tabs-section').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('sizeGuideLink').addEventListener('click', () => {
    showToast('📏 Size Guide: S(34-36) M(38-40) L(42-44) XL(46-48)');
  });

  document.getElementById('descText').textContent =
    `The ${p.name} is crafted for everyday versatility without compromising on style. Designed as part of our ${p.cat} ${p.sub.toLowerCase()} line, it pairs premium materials with a considered, modern fit. Whether you're dressing up or keeping it casual, this piece adapts effortlessly to your day.`;

  renderReviews();
  renderRelated(p);
  renderRecentlyViewed(p);
  addToRecentlyViewed(p);
}

/* ---- GALLERY ---- */
function bindGallery() {
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const mainImg = document.getElementById('galleryMainImg');
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      mainImg.src = t.dataset.img;
    });
  });
}

/* ---- COLOR SWATCHES ---- */
function bindColorSwatches() {
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
      selectedColor = parseInt(sw.dataset.color);
    });
  });
}

/* ---- SIZE CHIPS ---- */
function bindSizeChips() {
  document.querySelectorAll('#sizeRow .size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#sizeRow .size-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedSize = chip.dataset.size;
    });
  });
}

/* ---- QTY ---- */
function bindQtyButtons() {
  const val = document.getElementById('dQtyVal');
  document.getElementById('dQtyMinus').addEventListener('click', () => {
    if (currentQty > 1) { currentQty--; val.textContent = currentQty; }
  });
  document.getElementById('dQtyPlus').addEventListener('click', () => {
    if (currentQty < 10) { currentQty++; val.textContent = currentQty; }
  });
}

/* ---- ADD TO CART ---- */
function bindAddToCart() {
  document.getElementById('dAddCart').addEventListener('click', () => {
    const p = currentProduct;
    const cart = getCart();
    const key = `${p.id}-${selectedSize}-${selectedColor}`;
    const existing = cart.find(i => i.key === key);
    if (existing) { existing.qty += currentQty; }
    else { cart.push({ id: p.id, key, name: p.name, price: p.price, size: selectedSize, color: selectedColor, qty: currentQty, img: p.img }); }
    saveCart(cart);
    showToast(`✓ ${p.name} (${selectedSize}) ×${currentQty} added to cart`);
  });
}
function bindBuyNow() {
  document.getElementById('dBuyNow').addEventListener('click', () => {
    const p = currentProduct;
    const cart = getCart();
    const key = `${p.id}-${selectedSize}-${selectedColor}`;
    const existing = cart.find(i => i.key === key);
    if (existing) { existing.qty += currentQty; }
    else { cart.push({ id: p.id, key, name: p.name, price: p.price, size: selectedSize, color: selectedColor, qty: currentQty, img: p.img }); }
    saveCart(cart);
    window.location.href = 'checkout.html';
  });
}

/* ---- WISHLIST ---- */
function bindWishlistDetail() {
  const btn = document.getElementById('dWishBtn');
  const wishlist = JSON.parse(localStorage.getItem('velourx_wishlist') || '[]');
  if (wishlist.includes(currentProduct.id)) { btn.textContent = '♥'; btn.classList.add('active-wish'); }
  btn.addEventListener('click', () => {
    let wl = JSON.parse(localStorage.getItem('velourx_wishlist') || '[]');
    if (wl.includes(currentProduct.id)) {
      wl = wl.filter(i => i !== currentProduct.id);
      btn.textContent = '♡'; btn.classList.remove('active-wish');
      showToast('Removed from wishlist');
    } else {
      wl.push(currentProduct.id);
      btn.textContent = '♥'; btn.classList.add('active-wish');
      showToast('♥ Added to wishlist');
    }
    localStorage.setItem('velourx_wishlist', JSON.stringify(wl));
  });
}

/* ---- TABS ---- */
function switchTab(tabName) {
  document.querySelectorAll('.dtab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
  document.querySelectorAll('.dtab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tabName}`));
}
function bindTabs() {
  document.querySelectorAll('.dtab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

/* ---- REVIEWS ---- */
function renderReviews() {
  const list = document.getElementById('reviewList');
  const reviews = [];
  for (let i = 0; i < 6; i++) {
    const stars = i < 4 ? 5 : 4;
    const daysAgo = (i + 1) * 6;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    reviews.push({
      name: REVIEW_NAMES[i % REVIEW_NAMES.length],
      stars,
      text: REVIEW_TEXTS[i % REVIEW_TEXTS.length],
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  }
  list.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-top">
        <div class="review-author">
          <div class="review-avatar">${r.name.charAt(0)}</div>
          <div>
            <p class="review-name">${r.name} <span class="review-verified">✓ Verified Purchase</span></p>
          </div>
        </div>
        <span class="review-date">${r.date}</span>
      </div>
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
      <p class="review-text">${r.text}</p>
    </div>
  `).join('');
}

/* ---- RELATED PRODUCTS ---- */
function renderRelated(p) {
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 10);
  const track = document.getElementById('related-track');
  track.innerHTML = related.map(buildCard).join('');
  bindCartButtons(track);
  track.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-add') || e.target.classList.contains('wish-btn')) return;
      window.location.href = `product-detail.html?id=${card.dataset.id}`;
      window.scrollTo(0,0);
    });
  });
  initScrollButtonsLocal();
}

/* ---- RECENTLY VIEWED ---- */
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem('velourx_recent') || '[]'); }
  catch { return []; }
}
function addToRecentlyViewed(p) {
  let recent = getRecentlyViewed().filter(id => id !== p.id);
  recent.unshift(p.id);
  recent = recent.slice(0, 8);
  localStorage.setItem('velourx_recent', JSON.stringify(recent));
}
function renderRecentlyViewed(currentP) {
  const ids = getRecentlyViewed().filter(id => id !== currentP.id);
  const section = document.getElementById('recentlyViewedSection');
  if (!ids.length) { section.style.display = 'none'; return; }
  const items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  if (!items.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  const track = document.getElementById('recent-track');
  track.innerHTML = items.map(buildCard).join('');
  bindCartButtons(track);
  track.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-add') || e.target.classList.contains('wish-btn')) return;
      window.location.href = `product-detail.html?id=${card.dataset.id}`;
      window.scrollTo(0,0);
    });
  });
}

/* ---- LOCAL SCROLL BUTTONS (re-bind after dynamic render) ---- */
function initScrollButtonsLocal() {
  document.querySelectorAll('.h-scroll-btn').forEach(btn => {
    btn.replaceWith(btn.cloneNode(true)); // clear old listeners
  });
  document.querySelectorAll('.h-scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.target);
      if (!track) return;
      const dir = btn.classList.contains('h-scroll-left') ? -1 : 1;
      track.scrollBy({ left: dir * 320, behavior: 'smooth' });
    });
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderDetail();
  bindTabs();

  // re-init shared nav behaviors since app.js DOMContentLoaded already ran for index-only elements
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 60));
  const hbtn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (hbtn && menu) hbtn.addEventListener('click', () => menu.classList.toggle('open'));
});
