/* =============================================
   VELOURX — checkout.js
   Real Stripe payment integration
   ============================================= */

/* ====================================================
   ⚠️ SETUP REQUIRED: Paste your Stripe PUBLISHABLE key below.
   Get it from: https://dashboard.stripe.com/test/apikeys
   It starts with "pk_test_..."
   Your SECRET key (sk_test_...) goes in Netlify env vars, NEVER here.
   ==================================================== */
const STRIPE_PUBLISHABLE_KEY = "pk_test_51TjvqiCYJ3lT3Rl1Hv2in34Y6sRLYZEvJfsuf49Abwj94xlFvnKvTVlmK4NeZwftmFQkUoa1kyX1jQXMSAS3d0mo00tyVnn6J0";

let stripe = null;
let cardElement = null;
let currentUser = null;
let appliedPromo = null;

const PROMO_CODES = {
  'VELOUR30': { type: 'percent', value: 30, label: '30% OFF' },
  'WELCOME10': { type: 'percent', value: 10, label: '10% OFF' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'FREE SHIPPING' },
  'SAVE20':   { type: 'percent', value: 20, label: '20% OFF' }
};

const SHIPPING_RATES = { free: 0, express: 12.99, overnight: 24.99 };

/* ---- INIT STRIPE ---- */
function initStripe() {
  if (typeof Stripe === 'undefined') {
    console.error('Stripe.js failed to load');
    return;
  }
  stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
  const elements = stripe.elements();

  const style = {
    base: {
      fontSize: '15px',
      fontFamily: '"Inter", sans-serif',
      color: '#0A0E1A',
      '::placeholder': { color: '#8A8FA8' }
    },
    invalid: { color: '#E84040' }
  };

  cardElement = elements.create('card', { style });
  cardElement.mount('#card-element');

  cardElement.on('change', (event) => {
    const errorDiv = document.getElementById('card-errors');
    errorDiv.textContent = event.error ? event.error.message : '';
  });
}

/* ---- CALCULATE TOTALS ---- */
function getSelectedShippingMethod() {
  const checked = document.querySelector('input[name="shipMethod"]:checked');
  return checked ? checked.value : 'free';
}

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
  const method = getSelectedShippingMethod();
  let shipping = SHIPPING_RATES[method] ?? 0;
  if (method === 'free' && afterDiscount < 49 && !freeShipOverride) shipping = 7.99;
  if (freeShipOverride && method === 'free') shipping = 0;

  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;

  return { subtotal, discount, shipping, tax, total };
}

/* ---- RENDER ORDER SUMMARY ---- */
function renderSummary() {
  const cart = getCart();
  const list = document.getElementById('coItemsList');

  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="co-item-row">
      <div class="co-item-img">
        <img src="${item.img || ''}" alt="${item.name}"/>
        <span class="co-item-qty-badge">${item.qty}</span>
      </div>
      <div class="co-item-info">
        <p class="co-item-name">${item.name}</p>
        <p class="co-item-meta">${item.size ? 'Size: ' + item.size : ''}</p>
      </div>
      <span class="co-item-price">$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');

  updateTotalsDisplay();
}

function updateTotalsDisplay() {
  const { subtotal, discount, shipping, tax, total } = calcTotals();

  document.getElementById('coSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('coShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('coTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('coTotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('placeOrderAmount').textContent = `$${total.toFixed(2)}`;

  const discountRow = document.getElementById('coDiscountRow');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('coDiscount').textContent = `-$${discount.toFixed(2)}`;
    document.getElementById('coDiscountLabel').textContent = `(${appliedPromo.label})`;
  } else {
    discountRow.style.display = 'none';
  }

  // update free shipping label
  const freeLabel = document.getElementById('shipFreeLabel');
  if (freeLabel) {
    const sub = calcTotals().subtotal - calcTotals().discount;
    freeLabel.textContent = (sub >= 49 || (appliedPromo && appliedPromo.type === 'shipping')) ? 'FREE' : '$7.99';
  }
}

/* ---- PROMO CODE ---- */
function bindPromoCode() {
  const input = document.getElementById('checkoutPromoInput');
  const btn = document.getElementById('checkoutApplyPromoBtn');
  const msg = document.getElementById('checkoutPromoMsg');

  function apply() {
    const code = input.value.trim().toUpperCase();
    if (!code) return;
    const promo = PROMO_CODES[code];
    if (promo) {
      appliedPromo = promo;
      msg.textContent = `✓ Code "${code}" applied — ${promo.label}`;
      msg.className = 'promo-msg success';
    } else {
      appliedPromo = null;
      msg.textContent = '✕ Invalid or expired promo code';
      msg.className = 'promo-msg error';
    }
    updateTotalsDisplay();
  }
  btn.addEventListener('click', apply);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } });

  const saved = sessionStorage.getItem('velourx_promo');
  if (saved && PROMO_CODES[saved]) {
    input.value = saved;
    apply();
  }
}

/* ---- SHIPPING METHOD CHANGE ---- */
function bindShippingMethod() {
  document.querySelectorAll('input[name="shipMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.ship-option').forEach(opt => opt.classList.remove('selected'));
      radio.closest('.ship-option').classList.add('selected');
      updateTotalsDisplay();
    });
  });
}

/* ---- FORM VALIDATION ---- */
function validateCheckoutForm() {
  const required = ['contactEmail','contactPhone','shipFirstName','shipLastName','shipAddress','shipCity','shipState','shipZip','shipCountry'];
  for (const id of required) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.style.borderColor = '#E84040';
      el.focus();
      showToast('Please fill in all required fields');
      return false;
    }
    el.style.borderColor = '';
  }
  return true;
}

/* ---- GENERATE ORDER ID ---- */
function generateOrderId() {
  return 'VX' + Date.now().toString().slice(-8);
}

/* ---- PLACE ORDER (REAL STRIPE PAYMENT) ---- */
function bindPlaceOrder() {
  const btn = document.getElementById('placeOrderBtn');

  btn.addEventListener('click', async () => {
    if (!validateCheckoutForm()) return;
    if (getCart().length === 0) { showToast('Your cart is empty'); return; }

    const { total } = calcTotals();
    const amountInCents = Math.round(total * 100);

    btn.disabled = true;
    document.getElementById('placeOrderText').style.display = 'none';
    document.getElementById('placeOrderSpinner').style.display = 'inline';

    try {
      // 1. Create payment intent via our Netlify serverless function
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          currency: 'usd',
          email: document.getElementById('contactEmail').value
        })
      });

      if (!response.ok) throw new Error('Could not connect to payment server');
      const { clientSecret } = await response.json();

      // 2. Confirm the card payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${document.getElementById('shipFirstName').value} ${document.getElementById('shipLastName').value}`,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            address: {
              line1: document.getElementById('shipAddress').value,
              city: document.getElementById('shipCity').value,
              state: document.getElementById('shipState').value,
              postal_code: document.getElementById('shipZip').value,
              country: document.getElementById('shipCountry').value
            }
          }
        }
      });

      if (result.error) {
        document.getElementById('card-errors').textContent = result.error.message;
        showToast('Payment failed: ' + result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        await completeOrder(total);
      }
    } catch (err) {
      console.error(err);
      document.getElementById('card-errors').textContent =
        'Payment server not connected yet. (See setup note below the page.)';
      showToast('⚠️ Stripe backend not connected yet — see setup instructions');
    }

    btn.disabled = false;
    document.getElementById('placeOrderText').style.display = 'inline';
    document.getElementById('placeOrderSpinner').style.display = 'none';
  });
}

/* ---- COMPLETE ORDER (after successful payment) ---- */
async function completeOrder(total) {
  const orderId = generateOrderId();
  const cart = getCart();
  const itemCount = cart.reduce((s,i) => s + i.qty, 0);
  const email = document.getElementById('contactEmail').value;
  const firstName = document.getElementById('shipFirstName').value;

  const order = {
    id: orderId,
    date: new Date().toISOString(),
    items: cart,
    itemCount,
    total,
    status: 'Confirmed',
    email,
    shipping: {
      name: `${firstName} ${document.getElementById('shipLastName').value}`,
      address: document.getElementById('shipAddress').value,
      city: document.getElementById('shipCity').value,
      state: document.getElementById('shipState').value,
      zip: document.getElementById('shipZip').value,
      country: document.getElementById('shipCountry').value
    }
  };

  // save order locally
  const orders = JSON.parse(localStorage.getItem('velourx_orders') || '[]');
  orders.unshift(order);
  localStorage.setItem('velourx_orders', JSON.stringify(orders));

  // save to Firestore if logged in
  if (currentUser && window.vxCreateOrder) {
    try { await window.vxCreateOrder(currentUser.uid, order); } catch(e) { console.warn('Cloud order save failed', e); }
  }

  // clear cart
  saveCart([]);
  sessionStorage.removeItem('velourx_promo');

  // show success modal
  document.getElementById('successName').textContent = firstName ? `, ${firstName}` : '';
  document.getElementById('successOrderId').textContent = `#${orderId}`;
  document.getElementById('successEmail').textContent = email;
  document.getElementById('successTotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('successOverlay').classList.add('visible');
}

/* ---- PREFILL FROM LOGGED IN USER ---- */
function prefillUserInfo() {
  if (!window.vxOnAuthChange) return;
  window.vxOnAuthChange(async (user) => {
    currentUser = user;
    if (user) {
      document.getElementById('loginHint').style.display = 'none';
      document.getElementById('contactEmail').value = user.email || '';
      const profile = await window.vxGetUserProfile(user.uid);
      if (profile && profile.name) {
        const parts = profile.name.split(' ');
        document.getElementById('shipFirstName').value = parts[0] || '';
        document.getElementById('shipLastName').value = parts.slice(1).join(' ') || '';
      }
    }
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderSummary();
  bindPromoCode();
  bindShippingMethod();
  bindPlaceOrder();

  if (typeof Stripe !== 'undefined') {
    initStripe();
  }

  if (window.vxFirebaseReady) {
    prefillUserInfo();
  } else {
    window.addEventListener('vxFirebaseReady', prefillUserInfo, { once: true });
  }
});

