/* jQuery powers filtering and form events when available; native fallback keeps
   the page usable if the CDN is unavailable. Both paths call the real demo API. */
(() => {
  'use strict';
  const C = window.METHODA_CONFIG;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = (value, fallback) => {
    try { const u = new URL(value, location.href); return ['http:', 'https:'].includes(u.protocol) ? u.href : fallback; } catch { return fallback; }
  };
  async function request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, {...options, signal: controller.signal});
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'The request could not be completed.');
      return data;
    } finally { clearTimeout(timeout); }
  }
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  ready(() => {
    if (!C) return;
    const get = path => path.split('.').reduce((v, key) => v?.[key], C);
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    document.querySelectorAll('[data-config]').forEach(el => { const v = get(el.dataset.config); if (v != null) el.textContent = v; });
    for (const [attribute, url] of [['data-login',C.app.loginUrl],['data-register',C.app.registerUrl],['data-app',C.app.appUrl]]) document.querySelectorAll('['+attribute+']').forEach(el => el.href = url);
    for (const kind of ['short','full']) document.querySelectorAll('[data-disclosure-'+kind+']').forEach(el => el.textContent = C.disclosure[kind]);
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar .nav-link').forEach(el => {
      const active = el.getAttribute('href') === current || (current.startsWith('blog-') && el.getAttribute('href') === 'blog.html');
      el.classList.toggle('active',active); if (active) el.setAttribute('aria-current','page');
    });
    // Keep navigation functional if Bootstrap cannot be fetched.
    if (!window.bootstrap) document.querySelector('.navbar-toggler')?.addEventListener('click', event => {
      const open = document.getElementById('mainNav').classList.toggle('show');
      event.currentTarget.setAttribute('aria-expanded', String(open));
    });
    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.AOS && !motionReduced) {
      AOS.init({duration:600, easing:'ease-out-cubic', once:true, offset:35});
    } else document.querySelectorAll('[data-aos]').forEach(el => {el.removeAttribute('data-aos');});
    document.querySelectorAll('[data-contact-form]').forEach(form => {
      const submit = async event => {
        event.preventDefault();
        form.classList.add('was-validated');
        const status = form.querySelector('.form-status');
        status.classList.add('d-none');
        const values = Object.fromEntries(new FormData(form));
        Object.keys(values).forEach(k => values[k] = values[k].trim());
        if (!form.checkValidity() || !values.name || values.message.length < 10) {
          form.reportValidity();
          if (form.checkValidity()) { status.className='form-status alert alert-danger'; status.textContent='Enter a name and a message with at least 10 non-blank characters.'; }
          return;
        }
        const button = form.querySelector('[type=submit]');
        if (button.disabled) return;
        button.disabled = true; button.textContent = 'Sending…'; form.setAttribute('aria-busy','true');
        try {
          const data = await request(C.site.contactUrl, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
          if (data.ok !== true) throw new Error(data.message || 'The server did not accept the enquiry.');
          status.className='form-status alert alert-success'; status.textContent=data.message;
          form.reset(); form.classList.remove('was-validated');
        } catch (error) {
          status.className='form-status alert alert-danger';
          status.textContent = error.name === 'AbortError' ? 'The request timed out. Your message is still here; please try again.' : 'Unable to send. Please try again or email info@vittyaan.in. Your message has been kept.';
        } finally {button.disabled=false;button.textContent='Send enquiry →';form.removeAttribute('aria-busy');status.focus();}
      };
      if (window.jQuery) jQuery(form).on('submit',submit); else form.addEventListener('submit',submit);
    });
    const grid = document.querySelector('[data-blog-grid]');
    let posts = [], filter = 'all';
    function render() {
      const visible = posts.filter(p => filter === 'all' || p.category === filter);
      grid.innerHTML = visible.length ? visible.map(post => `<div class="col-md-6 col-lg-4"><article class="card blog-card h-100"><img src="${esc(safeUrl(post.imageUrl,C.site.defaultBlogImage))}" width="760" height="600" alt="${esc(post.title)}" loading="lazy"><div class="d-flex flex-wrap gap-2 mt-3"><span class="tag">${esc(post.category)}</span><span class="tag">${esc(post.readTime)}</span></div><h3 class="mt-3">${esc(post.title)}</h3><p class="muted">${esc(post.excerpt)}</p><time class="small muted" datetime="${esc(post.date)}">${esc(post.date)}</time><a class="fw-bold mt-3" href="${esc(safeUrl(post.url,'blog.html'))}">Read article →</a></article></div>`).join('') : '<p>No articles in this category yet.</p>';
    }
    async function loadBlogs() {
      grid.setAttribute('aria-busy','true'); grid.innerHTML='<p>Loading articles…</p>';
      try {
        const result = await request(C.site.blogDataUrl);
        if (!Array.isArray(result)) throw new Error('Unexpected blog response');
        posts = result.filter(p => p && typeof p.title === 'string' && typeof p.url === 'string'); render();
      } catch {
        grid.innerHTML='<div class="col-12"><div class="notice" role="alert">Articles could not be loaded. <button class="filter-button" id="retry-blogs">Try again</button> <a href="blog-structured-trading.html">Read our discipline guide</a></div></div>';
        document.getElementById('retry-blogs').addEventListener('click',loadBlogs);
      } finally {grid.removeAttribute('aria-busy');}
    }
    const onFilter = event => {
      filter = event.currentTarget.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b => {const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
      if (posts.length) render();
    };
    if (window.jQuery) jQuery('[data-filter]').on('click',onFilter); else document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',onFilter));
    if (grid) loadBlogs();
  });
})();
