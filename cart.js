/* =============================================
   VELOURX — cart.js
   Real cart: edit qty, remove, promo codes, totals
   ============================================= */

const PROMO_CODES = {
  'VELOUR30': { type: 'percent', value: 30, label: '30% OFF' },
  'WELCOME10': { type: 'percent', value: 10, label: '10% OFF' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'FREE SHIPPING' },
  'SAVE20':   { type: 'percent', value: 20, label: '20% OFF' }
};

let appliedPromo = null;

/* ---- CALCULATE TOTALS ---- */
function calcTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  let discount = 0;
  let freeShipOverride = false;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') discount = subtotal * (appliedPromo.value / 100);
    if (appliedPromo.type === 'shipping') freeShipOverride = true;
  }

  const afterDiscount = subtotal - discount;
  const shipping = (afterDiscount >= 49 || freeShipOverride || subtotal === 0) ? 0 : 7.99;
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;

  return { subtotal, discount, shipping, tax, total };
}

/* ---- RENDER CART ITEMS ---- */
function renderCart() {
  const cart = getCart();
  const list = document.getElementById('cartItemsList');
  const layout = document.getElementById('cartLayout');
  const emptyState = document.getElementById('emptyCart');
  const summaryText = document.getElementById('cartItemSummary');
  const upsellSection = document.getElementById('cartUpsellSection');

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  summaryText.textContent = cart.length
    ? `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`
    : 'Your cart is currently empty';

  if (cart.length === 0) {
    layout.style.display = 'none';
    emptyState.style.display = 'block';
    upsellSection.style.display = 'block';
    renderUpsell();
    return;
  }

  layout.style.display = 'grid';
  emptyState.style.display = 'none';
  upsellSection.style.display = 'block';

  list.innerHTML = cart.map((item, idx) => {
    const meta = [];
    if (item.size) meta.push(`Size: ${item.size}`);
    meta.push(`SKU: VLX-${String(item.id).padStart(4,'0')}`);
    return `
      <div class="cart-item-row" data-key="${item.key || item.id}">
        <div class="ci-product">
          <div class="ci-img"><img src="${item.img || (PRODUCTS.find(p=>p.id===item.id)||{}).img || ''}" alt="${item.name}"/></div>
          <div class="ci-info">
            <p class="ci-name">${item.name}</p>
            <p class="ci-meta">${meta.join(' · ')}</p>
            <button class="ci-remove" data-key="${item.key || item.id}">Remove</button>
          </div>
        </div>
        <div class="ci-price">$${item.price.toFixed(2)}</div>
        <div class="ci-qty-control">
          <button class="ci-qty-btn" data-action="minus" data-key="${item.key || item.id}">−</button>
          <span class="ci-qty-num">${item.qty}</span>
          <button class="ci-qty-btn" data-action="plus" data-key="${item.key || item.id}">+</button>
        </div>
        <div class="ci-total">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
    `;
  }).join('');

  bindItemControls();
  renderTotals();
  renderUpsell();
}

/* ---- BIND QTY / REMOVE CONTROLS ---- */
function bindItemControls() {
  document.querySelectorAll('.ci-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const cart = getCart();
      const item = cart.find(i => (i.key || i.id) == key);
      if (!item) return;
      if (btn.dataset.action === 'plus') item.qty = Math.min(item.qty + 1, 20);
      else item.qty = Math.max(item.qty - 1, 1);
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll('.ci-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      let cart = getCart();
      const removed = cart.find(i => (i.key || i.id) == key);
      cart = cart.filter(i => (i.key || i.id) != key);
      saveCart(cart);
      if (removed) showToast(`Removed "${removed.name}"`);
      renderCart();
    });
  });
}

/* ---- RENDER TOTALS / SUMMARY ---- */
function renderTotals() {
  const { subtotal, discount, shipping, tax, total } = calcTotals();

  document.getElementById('sumSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('sumShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('sumTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('sumTotal').textContent = `$${total.toFixed(2)}`;

  const discountRow = document.getElementById('discountRow');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('sumDiscount').textContent = `-$${discount.toFixed(2)}`;
    document.getElementById('discountLabel').textContent = `(${appliedPromo.label})`;
  } else {
    discountRow.style.display = 'none';
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.disabled = subtotal === 0;
}

/* ---- PROMO CODE ---- */
function bindPromoCode() {
  const input = document.getElementById('promoInput');
  const btn = document.getElementById('applyPromoBtn');
  const msg = document.getElementById('promoMsg');

  function apply() {
    const code = input.value.trim().toUpperCase();
    if (!code) return;
    const promo = PROMO_CODES[code];
    if (promo) {
      appliedPromo = promo;
      msg.textContent = `✓ Code "${code}" applied — ${promo.label}`;
      msg.className = 'promo-msg success';
      showToast(`🎉 Promo applied: ${promo.label}`);
      sessionStorage.setItem('velourx_promo', code);
    } else {
      appliedPromo = null;
      msg.textContent = '✕ Invalid or expired promo code';
      msg.className = 'promo-msg error';
    }
    renderTotals();
  }

  btn.addEventListener('click', apply);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') apply(); });

  // restore from session
  const saved = sessionStorage.getItem('velourx_promo');
  if (saved && PROMO_CODES[saved]) {
    input.value = saved;
    apply();
  }
}

/* ---- CLEAR CART ---- */
function bindClearCart() {
  document.getElementById('clearCartBtn').addEventListener('click', () => {
    if (getCart().length === 0) return;
    if (confirm('Remove all items from your cart?')) {
      saveCart([]);
      appliedPromo = null;
      sessionStorage.removeItem('velourx_promo');
      renderCart();
      showToast('Cart cleared');
    }
  });
}

/* ---- GIFT MESSAGE TOGGLE ---- */
function bindGiftToggle() {
  const toggle = document.getElementById('giftToggle');
  const textarea = document.getElementById('giftMessage');
  toggle.addEventListener('change', () => {
    textarea.style.display = toggle.checked ? 'block' : 'none';
  });
}

/* ---- CHECKOUT ---- */
function bindCheckout() {
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (getCart().length === 0) return;
    if (appliedPromo) sessionStorage.setItem('velourx_promo', sessionStorage.getItem('velourx_promo') || '');
    window.location.href = 'checkout.html';
  });
}

/* ---- UPSELL PRODUCTS ---- */
function renderUpsell() {
  const cart = getCart();
  const cartIds = cart.map(i => i.id);
  let pool = PRODUCTS.filter(p => !cartIds.includes(p.id));
  // shuffle-ish: pick varied categories
  pool = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
  const track = document.getElementById('upsell-track');
  if (!track) return;
  track.innerHTML = pool.map(buildCard).join('');
  bindCartButtons(track);
  track.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-add') || e.target.classList.contains('wish-btn')) return;
      window.location.href = `product-detail.html?id=${card.dataset.id}`;
    });
  });
  // rebind scroll buttons fresh
  document.querySelectorAll('.h-scroll-btn').forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });
  document.querySelectorAll('.h-scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = document.getElementById(btn.dataset.target);
      if (!t) return;
      const dir = btn.classList.contains('h-scroll-left') ? -1 : 1;
      t.scrollBy({ left: dir * 320, behavior: 'smooth' });
    });
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
  bindPromoCode();
  bindClearCart();
  bindGiftToggle();
  bindCheckout();

  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 60));
  const hbtn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (hbtn && menu) hbtn.addEventListener('click', () => menu.classList.toggle('open'));
});
