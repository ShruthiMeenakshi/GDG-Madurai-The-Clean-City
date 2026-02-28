// Navigation wrapper script copied from original pages/shared/navigation.js
(function () {
  // Sidebar creation removed; we will use a topbar-only layout.
  // Remove any existing sidebar from legacy pages to avoid layout conflicts.
  function removeExistingSidebar() {
    var existing = document.querySelector('.sidebar');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  // SPA navigation helper available to topbar
  function navigateTo(path) {
    try {
      history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (e) {
      window.location.href = path;
    }
  }

  function createTopbar() {
    var top = document.createElement('header');
    top.className = 'topbar';

    var left = document.createElement('div');
    left.className = 'page-title';
    left.innerHTML = '<h1>MUIG</h1>';

    var nav = document.createElement('nav');
    nav.className = 'site-nav';

    var links = [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/route-optimization', label: 'Route Optimization' },
      { path: '/image-processing', label: 'AI Detection' },
      { path: '/policy-intelligence', label: 'Policy Intelligence' },
      { path: '/circular-intelligence', label: 'Circular Intelligence' },
      { path: '/enforcement', label: 'Enforcement' },
      { path: '/ward-rewards', label: 'Ward Rewards' }
    ];

    links.forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'site-nav-link';
      a.href = l.path;
      a.textContent = l.label;
      a.setAttribute('data-path', l.path);
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        navigateTo(l.path);
      });
      nav.appendChild(a);
    });

    var right = document.createElement('div');
    right.className = 'topbar-actions';
    right.innerHTML = '<div class="status-indicator"><div class="status-dot"></div><div>Live</div></div><div class="user-profile"><div class="avatar">G</div></div>';

    top.appendChild(left);
    top.appendChild(nav);
    top.appendChild(right);

    document.body.insertAdjacentElement('afterbegin', top);
  }

  // Update active nav link based on current location
  function updateActiveNav() {
    var links = document.querySelectorAll('.site-nav-link');
    links.forEach(function (ln) {
      try {
        if (ln.getAttribute('data-path') === location.pathname) ln.classList.add('active'); else ln.classList.remove('active');
      } catch (e) {}
    });
  }

  function wrapContent() {
    var wrapper = document.createElement('div');
    wrapper.className = 'app-container';

    var main = document.createElement('main');
    main.className = 'main-content';

    var page = document.createElement('div');
    page.className = 'page-content';

    // Move all existing body children except the sidebar/topbar into the page container
    var children = Array.from(document.body.children);
    children.forEach(function (child) {
      if (!child || !child.classList) return;
      if (child.classList.contains('sidebar') || child.classList.contains('topbar')) return;
      page.appendChild(child);
    });

    main.appendChild(page);
    wrapper.appendChild(main);

    // Insert wrapper after existing topbar/sidebar
    document.body.appendChild(wrapper);

    // Remove any legacy 'nav' class inside the injected page content to avoid styling conflicts
    try {
      var legacyNavs = page.querySelectorAll('.nav, .nav-links, .nav-item');
      legacyNavs.forEach(function (n) { n.classList.remove('nav', 'nav-links', 'nav-item'); });

      // Remove actual <nav> elements or elements intended for navigation inside the page content
      var navEls = page.querySelectorAll('nav, [role="navigation"], #navigation, .navigation');
      navEls.forEach(function (n) { try { n.parentNode && n.parentNode.removeChild(n); } catch (e) {} });
    } catch (e) {
      /* ignore */
    }
  }

  // Remove any existing sidebar and create a single topbar layout
  removeExistingSidebar();
  if (!document.querySelector('.topbar')) {
    createTopbar();
    // mark layout to remove sidebar margin rules
    document.body.classList.add('topbar-only');
  }

  // update active nav on load and on popstate
  try { updateActiveNav(); } catch (e) {}
  window.addEventListener('popstate', function () { try { updateActiveNav(); } catch (e) {} });
  if (!document.querySelector('.app-container')) {
    wrapContent();
  }

  // Load chatbot script (if present) to make widget available on all pages
  try {
    if (!document.getElementById('muig-chatbot-script')) {
      var cb = document.createElement('script');
      cb.id = 'muig-chatbot-script';
      cb.src = '/pages/shared/chatbot.js';
      cb.defer = true;
      document.body.appendChild(cb);
    }
  } catch (e) {
    console.warn('Could not load chatbot script', e);
  }

})();
