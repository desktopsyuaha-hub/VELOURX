/* =============================================
   VELOURX — account.js
   Handles auth state, login/signup forms, dashboard panels
   ============================================= */

let currentUser = null;
let currentUserProfile = null;

/* ---- WAIT FOR FIREBASE TO BE READY ---- */
function waitForFirebase(callback) {
  if (window.vxFirebaseReady) { callback(); }
  else { window.addEventListener('vxFirebaseReady', callback, { once: true }); }
}

/* ---- SWITCH AUTH TABS ---- */
function bindAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });
  document.querySelectorAll('[data-switch]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuthTab(link.dataset.switch);
    });
  });
}
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('loginForm').classList.toggle('active', tab === 'login');
  document.getElementById('signupForm').classList.toggle('active', tab === 'signup');
}

/* ---- LOGIN FORM ---- */
function bindLoginForm() {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginSubmitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    btn.disabled = true;
    btn.textContent = 'Logging in…';
    try {
      await window.vxLogin(email, password);
      showToast('✓ Welcome back!');
      // onAuthChange will handle UI switch
    } catch (err) {
      errorEl.textContent = friendlyAuthError(err.code);
    }
    btn.disabled = false;
    btn.textContent = 'Log In';
  });

  document.getElementById('googleLoginBtn').addEventListener('click', async () => {
    try {
      await window.vxGoogleSignIn();
      showToast('✓ Signed in with Google!');
    } catch (err) {
      errorEl.textContent = friendlyAuthError(err.code);
    }
  });
}

/* ---- SIGNUP FORM ---- */
function bindSignupForm() {
  const form = document.getElementById('signupForm');
  const errorEl = document.getElementById('signupError');
  const btn = document.getElementById('signupSubmitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    btn.disabled = true;
    btn.textContent = 'Creating account…';
    try {
      await window.vxSignUp(name, email, password);
      showToast(`🎉 Welcome to VELOURX, ${name.split(' ')[0]}!`);
    } catch (err) {
      errorEl.textContent = friendlyAuthError(err.code);
    }
    btn.disabled = false;
    btn.textContent = 'Create Account';
  });

  document.getElementById('googleSignupBtn').addEventListener('click', async () => {
    try {
      await window.vxGoogleSignIn();
      showToast('🎉 Account created with Google!');
    } catch (err) {
      errorEl.textContent = friendlyAuthError(err.code);
    }
  });
}

/* ---- FRIENDLY ERROR MESSAGES ---- */
function friendlyAuthError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.'
  };
  return map[code] || 'Something went wrong. Please try again.';
}

/* ---- LOGOUT ---- */
function bindLogout() {
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await window.vxLogout();
    showToast('Logged out successfully');
  });
}

/* ---- SHOW/HIDE UI BASED ON AUTH STATE ---- */
function showAuthForms() {
  document.getElementById('authLoading').style.display = 'none';
  document.getElementById('authWrapper').style.display = 'grid';
  document.getElementById('dashboardWrapper').style.display = 'none';
}

async function showDashboard(user) {
  document.getElementById('authLoading').style.display = 'none';
  document.getElementById('authWrapper').style.display = 'none';
  document.getElementById('dashboardWrapper').style.display = 'block';

  currentUserProfile = await window.vxGetUserProfile(user.uid);
  const name = currentUserProfile?.name || user.displayName || 'VELOURX Customer';
  const email = currentUserProfile?.email || user.email || '';

  document.getElementById('dashName').textContent = name;
  document.getElementById('dashEmail').textContent = email;
  document.getElementById('dashAvatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('settingsName').value = name;
  document.getElementById('settingsEmail').value = email;

  renderOverview();
  renderWishlist();
  renderOrders();
  syncCartWithCloud(user.uid);
}

/* ---- DASHBOARD PANEL SWITCHING ---- */
function bindDashboardNav() {
  document.querySelectorAll('.dash-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dash-nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`panel-${btn.dataset.panel}`).classList.add('active');
    });
  });
}

/* ---- OVERVIEW PANEL ---- */
function renderOverview() {
  const wishlist = JSON.parse(localStorage.getItem('velourx_wishlist') || '[]');
  const cart = getCart();
  const orders = JSON.parse(localStorage.getItem('velourx_orders') || '[]');

  document.getElementById('ovOrderCount').textContent = orders.length;
  document.getElementById('ovWishlistCount').textContent = wishlist.length;
  document.getElementById('ovCartCount').textContent = cart.reduce((s,i) => s + i.qty, 0);

  const recentList = document.getElementById('recentOrdersList');
  if (orders.length === 0) {
    recentList.innerHTML = '<p class="empty-msg">No orders yet — your purchases will show up here.</p>';
  } else {
    recentList.innerHTML = orders.slice(0, 3).map(buildOrderCard).join('');
  }
}

/* ---- ORDERS PANEL ---- */
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('velourx_orders') || '[]');
  const list = document.getElementById('ordersList');
  if (orders.length === 0) {
    list.innerHTML = '<p class="empty-msg">You haven\'t placed any orders yet.</p>';
  } else {
    list.innerHTML = orders.map(buildOrderCard).join('');
  }
}

function buildOrderCard(order) {
  const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `
    <div class="order-card">
      <div>
        <p class="order-id">Order #${order.id}</p>
        <p class="order-date">${date} · ${order.itemCount} item${order.itemCount !== 1 ? 's' : ''}</p>
      </div>
      <span class="order-status">${order.status || 'Confirmed'}</span>
      <span class="order-total">$${order.total.toFixed(2)}</span>
    </div>
  `;
}

/* ---- WISHLIST PANEL ---- */
function renderWishlist() {
  const wishlist = JSON.parse(localStorage.getItem('velourx_wishlist') || '[]');
  const grid = document.getElementById('wishlistGrid');
  if (wishlist.length === 0) {
    grid.innerHTML = '<p class="empty-msg">Your wishlist is empty. Tap the ♡ icon on any product to save it here.</p>';
    return;
  }
  const items = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = items.map(buildCard).join('');
  bindCartButtons(grid);
  grid.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-add') || e.target.classList.contains('wish-btn')) return;
      window.location.href = `product-detail.html?id=${card.dataset.id}`;
    });
  });
}

/* ---- ADDRESSES ---- */
function bindAddresses() {
  const addBtn = document.getElementById('addAddressBtn');
  const formBox = document.getElementById('addressFormBox');
  const saveBtn = document.getElementById('saveAddressBtn');

  addBtn.addEventListener('click', () => {
    formBox.style.display = formBox.style.display === 'none' ? 'flex' : 'none';
  });

  renderAddresses();

  saveBtn.addEventListener('click', () => {
    const addr = {
      name: document.getElementById('addrFullName').value,
      line1: document.getElementById('addrLine1').value,
      city: document.getElementById('addrCity').value,
      state: document.getElementById('addrState').value,
      zip: document.getElementById('addrZip').value,
      phone: document.getElementById('addrPhone').value
    };
    if (!addr.name || !addr.line1) { showToast('Please fill in name and address'); return; }
    const addresses = JSON.parse(localStorage.getItem('velourx_addresses') || '[]');
    addresses.push(addr);
    localStorage.setItem('velourx_addresses', JSON.stringify(addresses));
    formBox.style.display = 'none';
    ['addrFullName','addrLine1','addrCity','addrState','addrZip','addrPhone'].forEach(id => document.getElementById(id).value = '');
    renderAddresses();
    showToast('✓ Address saved');
  });
}
function renderAddresses() {
  const addresses = JSON.parse(localStorage.getItem('velourx_addresses') || '[]');
  const list = document.getElementById('addressList');
  if (addresses.length === 0) {
    list.innerHTML = '<p class="empty-msg">No saved addresses yet.</p>';
    return;
  }
  list.innerHTML = addresses.map(a => `
    <div class="address-card">
      <strong>${a.name}</strong>
      <p>${a.line1}<br/>${a.city}, ${a.state} ${a.zip}<br/>${a.phone}</p>
    </div>
  `).join('');
}

/* ---- SETTINGS PANEL ---- */
function bindSettings() {
  document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
    const newName = document.getElementById('settingsName').value;
    if (!newName.trim()) return;
    try {
      // update Firebase Auth profile + Firestore doc
      const { updateProfile } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      await updateProfile(window.vxAuth.currentUser, { displayName: newName });
      const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await updateDoc(doc(window.vxDb, "users", currentUser.uid), { name: newName });
      document.getElementById('dashName').textContent = newName;
      document.getElementById('dashAvatar').textContent = newName.charAt(0).toUpperCase();
      showToast('✓ Settings updated');
    } catch (err) {
      showToast('Could not update settings');
    }
  });
}

/* ---- CART SYNC WITH CLOUD ---- */
async function syncCartWithCloud(uid) {
  const localCart = getCart();
  if (localCart.length > 0) {
    // local cart exists — push to cloud (merge strategy: local wins on first login)
    await window.vxSaveCartToCloud(uid, localCart);
  } else {
    // try to restore from cloud
    const cloudCart = await window.vxLoadCartFromCloud(uid);
    if (cloudCart.length > 0) {
      saveCart(cloudCart);
      renderOverview();
    }
  }
}

/* ---- AUTH STATE LISTENER ---- */
function initAuthListener() {
  window.vxOnAuthChange((user) => {
    currentUser = user;
    if (user) {
      showDashboard(user);
    } else {
      showAuthForms();
    }
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  bindAuthTabs();
  bindLoginForm();
  bindSignupForm();
  bindLogout();
  bindDashboardNav();
  bindAddresses();
  bindSettings();

  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 60));
  const hbtn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (hbtn && menu) hbtn.addEventListener('click', () => menu.classList.toggle('open'));

  waitForFirebase(() => {
    initAuthListener();
  });
});
    
