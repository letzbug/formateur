/* ==========================================================================
   UniPop — Espace Formateurs
   Lit data/content.json et construit toute l'interface.
   Aucun contenu n'est codé en dur ici : textes, liens, documents, dates
   et ordre des sections viennent du fichier de configuration.
   Ajouter « ?demo » à l'adresse charge data/content.demo.json (contenus fictifs).
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Constantes
     --------------------------------------------------------------------- */
  const ZONES = ['principale', 'secondaire', 'ressources'];
  const DEFAULT_LAYOUT = {
    principale: ['tarifs', 'tutoriels', 'appels_a_concept'],
    secondaire: ['desiderata', 'onboarding', 'videos', 'actualites'],
    ressources: ['flyers', 'flyers_specifiques', 'tutoriels_gicea', 'reglements', 'modele_aviwa', 'train_the_trainer']
  };
  const TONES = ['teal', 'mint', 'lavender', 'blue', 'coral', 'amber', 'navy'];
  const PLACEHOLDER = /^\s*A_COMPLETER/i;
  const Frame = window.UnipopFrame || {
    configure: function () {},
    scrollToElement: function (el) { el.scrollIntoView({ block: 'start' }); }
  };

  /* Icônes (24×24, trait) — dessinées pour ce projet. */
  const ICONS = {
    chevronRight: 'M9 6l6 6-6 6',
    chevronDown: 'M6 9l6 6 6-6',
    form: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 12.5h6 M9 16.5h4',
    file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6',
    tag: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z M7.5 7.5h.01',
    cap: 'M22 9.5L12 5 2 9.5l10 4.5 10-4.5z M6 11.5V16c3 2.2 9 2.2 12 0v-4.5 M22 9.5v5',
    mail: 'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z M3.5 7l8.5 6.5L20.5 7',
    coins: 'M12 4c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 7v5c0 1.7 3.6 3 8 3s8-1.3 8-3V7 M4 12v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5',
    playCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M10 8.6l5.2 3.4-5.2 3.4z',
    play: 'M8 5.5v13l11-6.5z',
    megaphone: 'M3 10.5v3a1 1 0 0 0 1 1h2.5L12 18V6L6.5 9.5H4a1 1 0 0 0-1 1z M15.5 9a3.5 3.5 0 0 1 0 6 M18 6.5a7 7 0 0 1 0 11',
    video: 'M4 7h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z M15 10.5l6-3.5v10l-6-3.5',
    image: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M4 16l5-5 4 4 2.5-2.5L20 17 M15.5 8.5h.01',
    book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z M4 20.5A2.5 2.5 0 0 0 6.5 21H20 M8 7h8',
    download: 'M12 4v11 M7 10.5l5 4.5 5-4.5 M5 20h14',
    external: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
    calendar: 'M6 5h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M5 10h14 M9 3v4 M15 3v4',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7.5V12l3 2',
    folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    pin: 'M9 3h6l-1 6 3 3H7l3-3z M12 12v9',
    users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2.5 21a6.5 6.5 0 0 1 13 0 M16 3.5a4 4 0 0 1 0 7.5 M18 14.5a6 6 0 0 1 3.5 6.5',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z M9 12l2 2 4-4',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 8h.01',
    x: 'M6 6l12 12 M18 6L6 18',
    camera: 'M4 8a2 2 0 0 1 2-2h2l2-2h4l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    bell: 'M6 9a6 6 0 1 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 15.5 6 9z M10.2 20.5a2 2 0 0 0 3.6 0',
    mapPin: 'M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    arrow: 'M7 17L17 7 M8 7h9v9',
    check: 'M5 12.5l4.5 4.5L19 7.5'
  };
  const ICON_ALIASES = { youtube: 'playCircle', instagram: 'camera', pdf: 'file', document: 'file', formulaire: 'form', video: 'video', site: 'external', contact: 'mail', luxtrust: 'shield' };

  const ART_DESIDERATA = '<svg viewBox="0 0 64 72" class="cta-panel__art" aria-hidden="true" focusable="false"><rect x="8" y="5" width="42" height="56" rx="6" fill="#fff" stroke="#cfd8e7"/><rect x="16" y="16" width="20" height="4" rx="2" fill="#b6b0f3"/><rect x="16" y="26" width="26" height="3" rx="1.5" fill="#e1e7f1"/><rect x="16" y="33" width="22" height="3" rx="1.5" fill="#e1e7f1"/><rect x="16" y="40" width="26" height="3" rx="1.5" fill="#e1e7f1"/><rect x="16" y="47" width="14" height="3" rx="1.5" fill="#e1e7f1"/><circle cx="48" cy="55" r="11" fill="#7fd1c9"/><path d="M43 55l3.5 3.5L53 52" fill="none" stroke="#00164a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ART_APPEL = '<svg viewBox="0 0 120 130" class="appel__art" aria-hidden="true" focusable="false"><g transform="rotate(9 60 78)"><rect x="16" y="36" width="72" height="88" rx="8" fill="#fff" stroke="#cbe7e2"/><rect x="28" y="52" width="36" height="5" rx="2.5" fill="#8db6f4"/><rect x="28" y="64" width="48" height="4" rx="2" fill="#dde6f3"/><rect x="28" y="74" width="44" height="4" rx="2" fill="#dde6f3"/><rect x="28" y="84" width="48" height="4" rx="2" fill="#dde6f3"/><rect x="28" y="94" width="30" height="4" rx="2" fill="#dde6f3"/></g><circle cx="90" cy="32" r="14" fill="#f3c66b"/><rect x="85" y="45" width="10" height="7" rx="2" fill="#b6b0f3"/><path d="M90 8v5 M108 16l-3.5 3.5 M72 16l3.5 3.5 M114 32h-5" stroke="#f3c66b" stroke-width="3" stroke-linecap="round"/></svg>';

  /* ---------------------------------------------------------------------
     Dates
     --------------------------------------------------------------------- */
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  const TODAY = startOfDay(new Date());
  const fmtShort = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtLong = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const fmtMonth = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

  /* Accepte « AAAA-MM-JJ » ou, pour les démonstrations, « J+30 » / « J-5 »
     (relatif à aujourd'hui). Renvoie null si vide ou invalide. */
  function parseDate(value, context) {
    const s = str(value);
    if (!s || PLACEHOLDER.test(s)) return null;
    let m = /^J([+-])(\d{1,4})$/i.exec(s);
    if (m) {
      const d = new Date(TODAY);
      d.setDate(d.getDate() + (m[1] === '+' ? 1 : -1) * Number(m[2]));
      return d;
    }
    m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) {
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      if (d.getMonth() === Number(m[2]) - 1) return d;
    }
    warn('Date invalide « ' + s + ' »' + (context ? ' (' + context + ')' : '') + ' — format attendu : AAAA-MM-JJ.');
    return null;
  }
  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function daysUntil(d) { return Math.round((startOfDay(d) - TODAY) / 86400000); }
  function timeEl(d, fmt) { return h('time', { datetime: isoDate(d), text: (fmt || fmtShort).format(d) }); }

  /* ---------------------------------------------------------------------
     Utilitaires DOM (aucun innerHTML pour les données de configuration)
     --------------------------------------------------------------------- */
  function str(v) { return typeof v === 'string' ? v.trim() : (typeof v === 'number' ? String(v) : ''); }
  function isFilled(v) { const s = str(v); return !!s && !PLACEHOLDER.test(s); }
  function arr(v) { return Array.isArray(v) ? v.filter(function (x) { return x !== null && x !== undefined; }) : []; }
  function posInt(v, d) { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : d; }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function tone(name, fallback) { return TONES.indexOf(name) !== -1 ? name : fallback; }
  let uidCounter = 0;
  function uid(prefix) { uidCounter += 1; return (prefix || 'el') + '-' + uidCounter; }
  const warnings = [];
  function warn(msg) { warnings.push(msg); if (window.console) console.warn('[Espace Formateurs] ' + msg); }

  function appendKids(el, kids) {
    (Array.isArray(kids) ? kids : [kids]).flat(Infinity).forEach(function (k) {
      if (k === null || k === undefined || k === false || k === '') return;
      el.append(k instanceof Node ? k : String(k));
    });
  }
  function h(tag, props) {
    const el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        const v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, String(v));
      });
    }
    appendKids(el, Array.prototype.slice.call(arguments, 2));
    return el;
  }
  function fromSvg(markup) {
    const tpl = document.createElement('template');
    tpl.innerHTML = markup.trim(); // chaînes internes uniquement
    return tpl.content.firstChild;
  }
  function iconName(name, fallback) {
    const n = str(name);
    if (ICONS[n]) return n;
    if (ICON_ALIASES[n.toLowerCase()]) return ICON_ALIASES[n.toLowerCase()];
    return fallback;
  }
  function icon(name, extraClass) {
    const key = ICONS[name] ? name : 'file';
    const filled = key === 'play';
    return fromSvg('<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"' +
      (extraClass ? ' class="' + extraClass + '"' : '') +
      (filled ? ' fill="currentColor" stroke="none"' : ' fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"') +
      '><path d="' + ICONS[key] + '"/></svg>');
  }
  function soon(text) { return h('span', { class: 'soon', text: text || 'Bientôt disponible' }); }
  function empty(text, ic) { return h('div', { class: 'empty' }, icon(ic || 'info'), h('p', { text: text })); }
  function playDot() { return h('span', { class: 'play-dot', 'aria-hidden': 'true' }, icon('play')); }

  /* ---------------------------------------------------------------------
     Liens & ressources
     --------------------------------------------------------------------- */
  /* Renvoie null pour une valeur vide, A_COMPLETER… ou un protocole non autorisé. */
  function resolveUrl(raw) {
    const s = str(raw);
    if (!s || PLACEHOLDER.test(s)) return null;
    if (s.charAt(0) === '#') {
      const id = s.slice(1);
      return /^[A-Za-z][\w-]*$/.test(id) ? { kind: 'anchor', id: id, href: s } : null;
    }
    let u;
    try { u = new URL(s, document.baseURI); } catch (e) { warn('Lien invalide : « ' + s + ' »'); return null; }
    if (u.protocol === 'mailto:' || u.protocol === 'tel:') return { kind: 'contact', href: u.href };
    if (u.protocol !== 'http:' && u.protocol !== 'https:') { warn('Protocole non autorisé : « ' + s + ' »'); return null; }
    return { kind: 'web', href: u.href, sameOrigin: u.origin === window.location.origin };
  }
  function formatOf(url, explicit) {
    const e = str(explicit).replace(/^\./, '');
    if (e) return e.toUpperCase();
    const m = /\.([a-z0-9]{2,5})(?:$|[?#])/i.exec(str(url));
    return m ? m[1].toUpperCase() : '';
  }

  /* Crée un lien sûr, ou un élément « indisponible » si l'URL manque. */
  function link(raw, kids, opts) {
    opts = opts || {};
    const r = resolveUrl(raw);
    if (!r) {
      const span = h('span', { class: cx(opts.class, 'is-unavailable'), 'aria-disabled': 'true' }, kids);
      if (opts.soon !== false) span.append(soon(opts.soonText));
      return span;
    }
    const newTab = r.kind === 'web';
    const label = opts.label ? opts.label + (newTab ? ' (nouvel onglet)' : '') : null;
    const a = h('a', { class: opts.class, href: r.href, 'aria-label': label }, kids);
    if (r.kind === 'anchor') a.dataset.scroll = r.id;
    if (newTab) { a.target = '_blank'; a.rel = 'noopener'; }
    if (opts.download && r.kind === 'web' && r.sameOrigin) a.setAttribute('download', '');
    if (r.kind === 'web' && r.sameOrigin) a.dataset.localAsset = r.href;
    if (opts.hiddenFromAT) { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); }
    if (newTab && !label && !opts.hiddenFromAT) a.append(h('span', { class: 'sr-only', text: ' (nouvel onglet)' }));
    return a;
  }

  function picture(src, alt, fallback, opts) {
    opts = opts || {};
    const r = resolveUrl(src);
    if (!r || r.kind !== 'web') return fallback();
    const img = h('img', { src: r.href, alt: alt || '', loading: opts.eager ? 'eager' : 'lazy', decoding: 'async', width: opts.w || null, height: opts.h || null });
    img.addEventListener('error', function () {
      warn('Image introuvable : ' + str(src));
      img.replaceWith(fallback());
    }, { once: true });
    return img;
  }
  function fallbackThumb(t, ic, label) {
    return h('span', { class: 'thumb-fallback tone-' + tone(t, 'navy'), 'aria-hidden': 'true' }, icon(ic), label ? h('span', { text: label }) : null);
  }
  function toneFor(text) {
    const palette = ['lavender', 'mint', 'blue', 'coral', 'teal', 'amber'];
    let n = 0;
    str(text).split('').forEach(function (c) { n = (n * 31 + c.charCodeAt(0)) >>> 0; });
    return palette[n % palette.length];
  }

  /* Texte enrichi minimal : lignes « - » → liste, [texte](lien), **gras**. */
  function inline(text) {
    const s = str(text);
    const out = [];
    const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
    let last = 0;
    let m;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push(s.slice(last, m.index));
      if (m[1]) out.push(link(m[2], m[1], { soon: false }));
      else out.push(h('strong', { text: m[3] }));
      last = re.lastIndex;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  }
  function rich(content) {
    const lines = (Array.isArray(content) ? content : [content]).map(str).filter(Boolean);
    const out = [];
    let list = null;
    lines.forEach(function (line) {
      if (/^[-•]\s+/.test(line)) {
        if (!list) { list = h('ul'); out.push(list); }
        list.append(h('li', null, inline(line.replace(/^[-•]\s+/, ''))));
      } else {
        list = null;
        out.push(h('p', null, inline(line)));
      }
    });
    return out;
  }

  /* Liste de documents (règlements, ressources, pièces jointes). */
  function docRows(docs) {
    return h('ul', { class: 'rows' }, arr(docs).map(function (d) {
      const fmt = formatOf(d.url, d.format);
      const r = resolveUrl(d.url);
      const isDownload = !!(r && r.kind === 'web' && r.sameOrigin && fmt && fmt !== 'PDF' && fmt !== 'HTML');
      const kids = [
        icon(fmt === 'PDF' ? 'file' : iconName(d.icone, 'file')),
        h('span', { class: 'row__title' }, str(d.titre) || 'Document', str(d.description) ? h('small', { text: d.description }) : null),
        h('span', { class: 'row__aux' }, r && fmt ? h('span', { text: fmt }) : null, r ? icon(isDownload ? 'download' : (r.kind === 'web' ? 'external' : 'chevronRight')) : soon('Bientôt'))
      ];
      return h('li', null, link(d.url, kids, { class: cx('row', fmt === 'PDF' && 'row--pdf'), download: isDownload, soon: false }));
    }));
  }

  /* Bouton « voir plus » pour les éléments marqués data-extra. */
  function moreToggle(container, extraCount, moreText, lessText) {
    if (!container.id) container.id = uid('liste');
    const label = h('span', { text: moreText + ' (' + extraCount + ' de plus)' });
    const btn = h('button', { type: 'button', class: 'link-more', 'aria-expanded': 'false', 'aria-controls': container.id }, label, icon('chevronDown'));
    btn.addEventListener('click', function () {
      const open = btn.getAttribute('aria-expanded') === 'true';
      container.querySelectorAll('[data-extra]').forEach(function (el) { el.hidden = open; });
      btn.setAttribute('aria-expanded', String(!open));
      label.textContent = open ? moreText + ' (' + extraCount + ' de plus)' : lessText;
    });
    return btn;
  }

  /* ---------------------------------------------------------------------
     Vidéos (chargées uniquement au clic)
     --------------------------------------------------------------------- */
  function parseVideo(raw) {
    const r = resolveUrl(raw);
    if (!r || r.kind !== 'web') return null;
    const url = r.href;
    let m = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i.exec(url);
    if (m) return { type: 'youtube', id: m[1], watch: 'https://www.youtube.com/watch?v=' + m[1], thumb: 'https://i.ytimg.com/vi/' + m[1] + '/hqdefault.jpg' };
    m = /vimeo\.com\/(?:video\/)?(\d{5,})/i.exec(url);
    if (m) return { type: 'vimeo', id: m[1], watch: 'https://vimeo.com/' + m[1] };
    if (/\.(mp4|webm|m4v)(?:$|[?#])/i.test(url)) return { type: 'file', src: url, watch: url };
    return { type: 'link', watch: url };
  }
  function playerEl(video, title) {
    const box = h('div', { class: 'player' });
    if (video.type === 'youtube') {
      box.append(h('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + video.id + '?autoplay=1&rel=0&playsinline=1',
        title: 'Vidéo : ' + title,
        allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
        referrerpolicy: 'strict-origin-when-cross-origin'
      }));
    } else if (video.type === 'vimeo') {
      box.append(h('iframe', {
        src: 'https://player.vimeo.com/video/' + video.id + '?autoplay=1&dnt=1',
        title: 'Vidéo : ' + title,
        allow: 'autoplay; fullscreen; picture-in-picture'
      }));
    } else {
      const v = h('video', { src: video.src, controls: true, playsinline: true, preload: 'metadata', title: title });
      v.addEventListener('error', function () {
        box.replaceChildren(h('div', { class: 'player__error' }, icon('info'), h('p', { text: 'La vidéo n’a pas pu être lue. Utilisez le lien « Ouvrir ».' })));
      });
      box.append(v);
      setTimeout(function () { const p = v.play && v.play(); if (p && p.catch) p.catch(function () {}); }, 0);
    }
    return box;
  }
  function mountPlayer(slot, video, title, onClose) {
    const close = h('button', { type: 'button', class: 'btn btn--ghost btn--small' }, icon('x'), h('span', { text: 'Fermer la vidéo' }));
    close.addEventListener('click', function () {
      slot.replaceChildren();
      slot.hidden = true;
      if (onClose) onClose();
    });
    const openLabel = video.type === 'youtube' ? 'Ouvrir sur YouTube' : (video.type === 'vimeo' ? 'Ouvrir sur Vimeo' : 'Ouvrir');
    slot.replaceChildren(h('div', { class: 'player-wrap' },
      playerEl(video, title),
      h('div', { class: 'player-bar' },
        h('p', { class: 'player-bar__title', text: title }),
        h('div', { class: 'actions' }, link(video.watch, [icon('external'), h('span', { text: openLabel })], { class: 'btn btn--ghost btn--small', soon: false }), close))));
    slot.hidden = false;
    close.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------------
     Carte générique
     --------------------------------------------------------------------- */
  function card(id, def, reg, opts) {
    opts = opts || {};
    const t = tone(def.couleur, reg.tone);
    const titleId = id + '-titre';
    const size = def.taille === 'large' || def.taille === 'normal' ? def.taille : (reg.size || 'normal');
    const section = h('section', { class: 'card card--' + id, id: id, 'aria-labelledby': titleId, 'data-taille': size });
    const headLinkUrl = def.lien !== undefined ? def.lien : opts.headLink;
    const headLink = resolveUrl(headLinkUrl)
      ? link(headLinkUrl, icon('chevronRight'), { class: 'card__go', label: opts.headLabel || ('Ouvrir : ' + (str(def.titre) || reg.title)) })
      : h('span');
    const body = h('div', { class: 'card__body tone-' + t });
    section.append(
      h('div', { class: 'card__head' },
        h('span', { class: 'tile-icon tone-' + t }, icon(iconName(def.icone, reg.icon))),
        h('div', null,
          h('h2', { class: 'card__title', id: titleId, tabindex: '-1', text: str(def.titre) || reg.title }),
          str(def.description) ? h('p', { class: 'card__desc', text: def.description }) : null),
        headLink),
      body);
    return { section: section, body: body };
  }

  /* ---------------------------------------------------------------------
     En-tête & accès rapides
     --------------------------------------------------------------------- */
  function renderHero(cfg) {
    const actions = arr(cfg.acces_rapides).slice(0, 6);
    return h('header', { class: 'hero' },
      h('div', { class: 'hero__text' },
        str(cfg.surtitre) ? h('p', { class: 'hero__eyebrow', text: cfg.surtitre }) : null,
        h('h1', { class: 'hero__title', text: str(cfg.titre) || 'Espace Formateurs UniPop' }),
        str(cfg.sous_titre) ? h('p', { class: 'hero__lead', text: cfg.sous_titre }) : null),
      actions.length ? h('nav', { class: 'quick', 'aria-label': 'Accès rapides' }, actions.map(function (a) {
        const t = tone(a.couleur, 'teal');
        return link(a.cible, [
          h('span', { class: 'quick__icon tone-' + t }, icon(iconName(a.icone, 'arrow'))),
          h('span', { class: 'quick__text' },
            h('span', { class: 'quick__title', text: str(a.titre) }),
            str(a.sous_titre) ? h('span', { class: 'quick__sub', text: a.sous_titre }) : null),
          h('span', { class: 'quick__go' }, icon('chevronRight'))
        ], { class: 'quick__item', soonText: 'Bientôt' });
      })) : null);
  }

  /* ---------------------------------------------------------------------
     A. Desiderata
     --------------------------------------------------------------------- */
  function renderDesiderata(id, def, reg) {
    const f = def.formulaire || {};
    const c = card(id, def, reg, { headLink: f.url, headLabel: 'Ouvrir le formulaire Desiderata' });
    const ok = !!resolveUrl(f.url);
    c.body.append(link(f.url, [
      fromSvg(ART_DESIDERATA),
      h('span', null,
        h('span', { class: 'cta-panel__title', text: str(f.titre) || 'Formulaire Desiderata' }),
        h('span', { class: 'cta-panel__sub', text: str(f.sous_titre) || 'Complétez le formulaire en ligne' }),
        ok ? null : soon('Lien bientôt disponible')),
      ok ? icon('chevronRight') : null
    ], { class: 'cta-panel', soon: false }));
    const deadline = parseDate(def.date_limite, 'desiderata');
    if (deadline && deadline >= TODAY) {
      const left = daysUntil(deadline);
      c.body.append(h('p', { class: 'deadline-line' }, icon('calendar'), h('span', null, 'À compléter avant le ', timeEl(deadline, fmtLong),
        left <= 14 ? h('span', { class: 'badge badge--urgent', text: left === 0 ? 'Dernier jour' : 'Plus que ' + left + ' jour' + (left > 1 ? 's' : '') }) : null)));
    }
    if (def.texte) c.body.append(h('div', { class: 'intro rich' }, rich(def.texte)));
    if (arr(def.documents).length) c.body.append(docRows(def.documents));
    return c.section;
  }

  /* ---------------------------------------------------------------------
     B. Tutoriels
     --------------------------------------------------------------------- */
  function renderTutoriels(id, def, reg) {
    const items = arr(def.elements).filter(function (x) { return typeof x === 'object'; });
    const c = card(id, def, reg);
    if (!items.length) { c.body.append(empty('Les tutoriels seront publiés ici prochainement.', 'playCircle')); return c.section; }
    const slot = h('div', { class: 'player-slot', hidden: true });
    const limit = posInt(def.nombre_affiche, 3);
    const list = h('ul', { class: 'tiles' });
    items.forEach(function (it, i) {
      const li = tutorialTile(it, slot);
      if (i >= limit) { li.hidden = true; li.dataset.extra = ''; }
      list.append(li);
    });
    c.body.append(slot, list);
    if (items.length > limit) c.body.append(h('div', { class: 'card__foot' }, moreToggle(list, items.length - limit, 'Voir tous les tutoriels', 'Afficher moins')));
    return c.section;
  }
  function tutorialTile(it, slot) {
    const title = str(it.titre) || 'Tutoriel';
    const video = parseVideo(it.video);
    const docOk = !!resolveUrl(it.document);
    const docFmt = formatOf(it.document, it.format) || 'PDF';
    const thumb = h('span', { class: 'thumb' },
      picture(it.vignette || (video && video.thumb), '', function () { return fallbackThumb('lavender', video ? 'playCircle' : 'file', ''); }),
      video ? playDot() : (docOk ? h('span', { class: 'badge badge--format', text: docFmt }) : null));
    const titleEl = h('span', { class: 'tile__title', text: title });
    let hit;
    if (video && video.type !== 'link') {
      hit = h('button', { type: 'button', class: 'tile__hit', 'aria-label': 'Lire la vidéo : ' + title + (it.duree ? ' (' + str(it.duree) + ')' : '') }, thumb, titleEl);
      hit.addEventListener('click', function () { mountPlayer(slot, video, title); });
    } else if (video) {
      hit = link(it.video, [thumb, titleEl], { class: 'tile__hit', soon: false });
    } else if (docOk) {
      hit = link(it.document, [thumb, titleEl], { class: 'tile__hit', soon: false, label: 'Ouvrir le tutoriel : ' + title });
    } else {
      hit = h('div', { class: 'tile__hit is-unavailable' }, thumb, titleEl);
    }
    const meta = h('div', { class: 'tile__meta' },
      str(it.duree) ? h('span', { class: 'meta' }, icon('clock'), h('span', { text: str(it.duree) })) : null,
      video && docOk ? link(it.document, 'Guide ' + docFmt, { soon: false, label: 'Guide ' + docFmt + ' : ' + title }) : null,
      !video && !docOk ? soon() : null);
    return h('li', { class: 'tile' }, hit, meta.childNodes.length ? meta : null,
      str(it.description) ? h('p', { class: 'meta', text: it.description }) : null);
  }

  /* ---------------------------------------------------------------------
     C. Onboarding (accordéons)
     --------------------------------------------------------------------- */
  function accordionItem(it) {
    const d = h('details', null,
      h('summary', null, icon(iconName(it.icone, 'file')), h('span', { text: str(it.titre) || 'Rubrique' }), icon('chevronRight', 'chev')));
    const content = h('div', { class: 'acc__body' });
    const text = rich(it.contenu);
    if (text.length) content.append(h('div', { class: 'rich' }, text));
    if (arr(it.etapes).length) content.append(h('ol', { class: 'steps' }, arr(it.etapes).map(function (s) { return h('li', null, h('span', null, inline(s))); })));
    if (arr(it.documents).length) content.append(docRows(it.documents));
    if (!content.childNodes.length) content.append(h('p', { text: 'Contenu en préparation.' }));
    d.append(content);
    return d;
  }
  function renderOnboarding(id, def, reg) {
    const c = card(id, def, reg);
    if (def.introduction) c.body.append(h('div', { class: 'intro rich' }, rich(def.introduction)));
    const items = arr(def.rubriques);
    c.body.append(items.length ? h('div', { class: 'acc' }, items.map(accordionItem)) : empty('Les informations d’accueil seront publiées ici prochainement.'));
    return c.section;
  }

  /* ---------------------------------------------------------------------
     D. Tarifs
     --------------------------------------------------------------------- */
  function tarifTable(t) {
    const align = arr(t.alignement);
    const secondary = arr(t.colonnes_secondaires).map(Number);
    const cls = function (i) { return cx(align[i] === 'droite' && 'num', secondary.indexOf(i) !== -1 && 'is-secondary') || null; };
    const cols = arr(t.colonnes).map(String);
    return h('div', { class: 'table-wrap', role: 'region', 'aria-label': 'Aperçu de la grille tarifaire', tabindex: '0' },
      h('table', { class: 'tarif-table' },
        str(t.legende) ? h('caption', { class: 'sr-only', text: t.legende }) : null,
        h('thead', null, h('tr', null, cols.map(function (c, i) { return h('th', { scope: 'col', class: cls(i), text: c }); }))),
        h('tbody', null, arr(t.lignes).filter(Array.isArray).map(function (row) {
          return h('tr', null, cols.map(function (_, i) { return h('td', { class: cls(i), text: row[i] === undefined || row[i] === null ? '' : String(row[i]) }); }));
        }))));
  }
  function renderTarifs(id, def, reg) {
    const doc = def.document || {};
    const r = resolveUrl(doc.url);
    const c = card(id, def, reg, { headLink: doc.url, headLabel: 'Ouvrir la grille tarifaire' });
    const panel = h('div', { class: 'panel doc-panel' },
      h('div', { class: 'doc-panel__head' }, icon('file'), h('h3', { class: 'doc-panel__title', text: str(doc.titre) || 'Grille tarifaire' }),
        h('span', { class: 'badge badge--format', text: formatOf(doc.url, doc.format) || 'PDF' })));
    const t = def.apercu_tableau;
    if (t && t.afficher !== false && arr(t.colonnes).length && arr(t.lignes).length) {
      panel.append(tarifTable(t));
      const notes = [str(t.legende)].concat(arr(t.notes).map(str)).filter(Boolean);
      if (notes.length) panel.append(h('ul', { class: 'table-notes' }, notes.map(function (n) { return h('li', null, inline(n)); })));
    } else {
      panel.append(h('div', { class: 'doc-preview-empty' }, h('span', { class: 'doc-sheet', 'aria-hidden': 'true' }),
        h('p', { text: r ? 'Consultez la grille tarifaire complète dans le document PDF.' : 'Le document des tarifs sera ajouté prochainement.' })));
    }
    if (r && r.kind === 'web') {
      const actions = h('div', { class: 'actions' });
      let viewer = null;
      if (doc.apercu_pdf_integre !== false) {
        viewer = h('div', { class: 'pdf-viewer', id: uid('apercu-pdf'), hidden: true });
        const label = h('span', { text: 'Afficher le PDF' });
        const toggle = h('button', { type: 'button', class: 'btn btn--soft', 'aria-expanded': 'false', 'aria-controls': viewer.id }, icon('eye'), label);
        if (r.sameOrigin) toggle.dataset.localAsset = r.href;
        toggle.addEventListener('click', function () {
          const open = toggle.getAttribute('aria-expanded') === 'true';
          if (!open && !viewer.childNodes.length) {
            viewer.append(
              h('iframe', { class: 'pdf-frame', src: r.href + (r.href.indexOf('#') === -1 ? '#view=FitH' : ''), title: 'Aperçu : ' + (str(doc.titre) || 'grille tarifaire') }),
              h('p', { class: 'pdf-hint' }, 'L’aperçu ne s’affiche pas (fréquent sur mobile) ? ', link(doc.url, 'Ouvrez le document', { soon: false }), '.'));
          }
          viewer.hidden = open;
          toggle.setAttribute('aria-expanded', String(!open));
          label.textContent = open ? 'Afficher le PDF' : 'Masquer l’aperçu';
        });
        actions.append(toggle);
      }
      actions.append(
        link(doc.url, [icon('external'), h('span', { text: 'Ouvrir' })], { class: 'btn btn--soft', label: 'Ouvrir la grille tarifaire' }),
        link(doc.url, [icon('download'), h('span', { text: 'Télécharger' })], { class: 'btn btn--primary', download: true, label: 'Télécharger la grille tarifaire' }));
      panel.append(actions);
      if (viewer) panel.append(viewer);
    } else {
      panel.append(h('div', { class: 'actions' }, h('p', { class: 'pdf-hint', text: r ? '' : 'Le document PDF officiel sera ajouté prochainement.' })));
    }
    c.body.append(panel);
    return c.section;
  }

  /* ---------------------------------------------------------------------
     E. Flyers
     --------------------------------------------------------------------- */
  function renderFlyers(id, def, reg) {
    const items = arr(def.flyers).filter(function (f) { return typeof f === 'object'; });
    const c = card(id, def, reg);
    if (!items.length) { c.body.append(empty('Les flyers seront ajoutés prochainement.', 'image')); return c.section; }
    const f = items[0];
    const title = str(f.titre) || 'Flyer';
    const ok = !!resolveUrl(f.fichier);
    c.body.append(link(f.fichier, [
      picture(f.vignette, '', function () { return fallbackThumb('lavender', 'image', ''); }),
      h('span', { class: 'flyer-hero__bar' },
        h('span', { text: ok ? (str(f.libelle_bouton) || 'Télécharger le flyer') : 'Flyer bientôt disponible' }),
        ok ? icon('download') : null)
    ], { class: 'flyer-hero', download: true, soon: false, label: 'Télécharger le flyer : ' + title }));
    c.body.append(h('p', { class: 'flyer-caption' }, h('strong', { text: title }), str(f.description) ? ' – ' + str(f.description) : null));
    if (items.length > 1) {
      c.body.append(docRows(items.slice(1).map(function (x) { return { titre: x.titre, description: x.description, url: x.fichier, format: x.format }; })));
    }
    return c.section;
  }

  /* ---------------------------------------------------------------------
     F. Flyers spécifiques (filtres)
     --------------------------------------------------------------------- */
  function renderFlyersSpecifiques(id, def, reg) {
    const items = arr(def.flyers).filter(function (f) { return typeof f === 'object' && str(f.titre); });
    const cats = arr(def.categories).map(str).filter(Boolean);
    items.forEach(function (f) { const k = str(f.categorie); if (k && cats.indexOf(k) === -1) cats.push(k); });
    const c = card(id, def, reg);
    const ALL = 'Tous';
    const limit = posInt(def.nombre_affiche, 6);
    let current = ALL;
    let expanded = false;

    const cards = items.map(function (f) {
      const title = str(f.titre);
      const t = toneFor(f.categorie);
      const el = h('li', { class: 'flyer-card' },
        link(f.fichier, [picture(f.vignette, '', function () { return fallbackThumb(t, 'image', str(f.categorie)); })], { class: 'thumb', soon: false, hiddenFromAT: true }),
        h('span', { class: 'flyer-card__title', text: title }),
        str(f.categorie) ? h('span', { class: 'flyer-card__cat', text: f.categorie }) : null,
        link(f.fichier, [icon('download'), h('span', { text: 'Télécharger' })], { class: 'flyer-card__dl', download: true, label: 'Télécharger le flyer : ' + title }));
      return { f: f, el: el };
    });
    const count = function (cat) { return cat === ALL ? items.length : items.filter(function (f) { return str(f.categorie) === cat; }).length; };
    const pills = h('div', { class: 'pills', role: 'group', 'aria-label': 'Filtrer les flyers par thème' });
    [ALL].concat(cats).forEach(function (cat) {
      const n = count(cat);
      const b = h('button', { type: 'button', class: cx('pill', n === 0 && 'is-empty'), 'aria-pressed': String(cat === current), dataset: { cat: cat } },
        h('span', { text: cat }), h('span', { class: 'pill__count', 'aria-label': n + ' flyer' + (n > 1 ? 's' : ''), text: String(n) }));
      b.addEventListener('click', function () { current = cat; expanded = false; update(true); });
      pills.append(b);
    });
    const grid = h('ul', { class: 'flyer-grid', id: uid('flyers') });
    cards.forEach(function (x) { grid.append(x.el); });
    const emptyBox = h('div', { hidden: true });
    const status = h('p', { class: 'sr-only', 'aria-live': 'polite' });
    const moreLabel = h('span');
    const more = h('button', { type: 'button', class: 'link-more', 'aria-expanded': 'false', 'aria-controls': grid.id }, moreLabel, icon('chevronDown'));
    more.addEventListener('click', function () { expanded = !expanded; update(false); });

    function update(announce) {
      pills.querySelectorAll('.pill').forEach(function (p) { p.setAttribute('aria-pressed', String(p.dataset.cat === current)); });
      const matching = cards.filter(function (x) { return current === ALL || str(x.f.categorie) === current; });
      cards.forEach(function (x) { x.el.hidden = true; });
      matching.forEach(function (x, i) { x.el.hidden = !expanded && i >= limit; });
      emptyBox.replaceChildren(empty(items.length
        ? 'Aucun flyer pour « ' + current + ' » pour le moment.'
        : 'Les flyers thématiques seront ajoutés prochainement.', 'image'));
      emptyBox.hidden = matching.length > 0;
      grid.hidden = matching.length === 0;
      more.hidden = matching.length <= limit;
      more.setAttribute('aria-expanded', String(expanded));
      moreLabel.textContent = expanded ? 'Afficher moins' : 'Voir tous les flyers (' + matching.length + ')';
      if (announce) status.textContent = matching.length + ' flyer' + (matching.length > 1 ? 's' : '') + (current === ALL ? ' au total' : ' pour « ' + current + ' »');
    }
    update(false);
    if (!items.length) {
      c.body.append(empty('Les flyers thématiques' + (cats.length ? ' (' + cats.slice(0, 3).join(', ') + '…)' : '') + ' seront ajoutés prochainement.', 'image'));
      return c.section;
    }
    c.body.append(pills, grid, emptyBox, h('div', { class: 'card__foot' }, more), status);
    return c.section;
  }

  /* ---------------------------------------------------------------------
     G. Appels à concept (actifs / archivés selon les dates)
     --------------------------------------------------------------------- */
  function renderAppels(id, def, reg) {
    const all = arr(def.appels).filter(function (a) { return typeof a === 'object' && str(a.titre); }).map(function (a) {
      return Object.assign({}, a, {
        _limite: parseDate(a.date_limite, 'appel « ' + str(a.titre) + ' »'),
        _publication: parseDate(a.date_publication, 'appel « ' + str(a.titre) + ' »')
      });
    });
    const published = all.filter(function (a) { return !(a._publication && a._publication > TODAY); });
    const archived = function (a) { return a.archive === true || str(a.statut).toLowerCase() === 'archive' || !!(a._limite && a._limite < TODAY); };
    const active = published.filter(function (a) { return !archived(a); })
      .sort(function (a, b) { return (a._limite ? a._limite.getTime() : Infinity) - (b._limite ? b._limite.getTime() : Infinity); });
    const past = published.filter(archived)
      .sort(function (a, b) { return (b._limite ? b._limite.getTime() : 0) - (a._limite ? a._limite.getTime() : 0); });

    const c = card(id, def, reg);
    if (active.length) {
      c.body.append(featuredAppel(active[0]));
      if (active.length > 1) {
        c.body.append(h('ul', { class: 'appel-list' }, active.slice(1).map(function (a) {
          return h('li', null, h('div', { class: 'appel-mini' },
            h('span', null, h('span', { class: 'appel-mini__title', text: a.titre }),
              a._limite ? h('span', { class: 'meta meta--block' }, icon('calendar'), h('span', null, 'Date limite : ', timeEl(a._limite))) : null),
            link(isFilled(a.lien) ? a.lien : a.document, [h('span', { text: 'Détails' }), icon('chevronRight')], { class: 'btn btn--soft btn--small', label: 'Détails : ' + a.titre })));
        })));
      }
    } else {
      c.body.append(empty(str(def.texte_aucun_appel) || 'Aucun appel à concept n’est ouvert actuellement. Les prochains appels seront publiés ici.', 'megaphone'));
    }

    const fold = h('details', { class: 'fold' },
      h('summary', null, icon('folder'), h('span', { text: str(def.titre_archive) || 'Anciens appels à concept' }),
        h('span', { class: 'fold__count', text: past.length + (past.length > 1 ? ' appels' : ' appel') }), icon('chevronDown', 'chev')));
    const foldBody = h('div', { class: 'fold__body' });
    if (past.length) {
      foldBody.append(h('ul', { class: 'rows' }, past.map(function (a) {
        return h('li', null, link(isFilled(a.lien) ? a.lien : a.document, [
          icon('file'),
          h('span', { class: 'row__title' }, a.titre, a._limite ? h('small', null, 'Clôturé le ', timeEl(a._limite, fmtLong)) : null),
          h('span', { class: 'row__aux' }, icon('chevronRight'))
        ], { class: 'row', soon: false }));
      })));
    } else {
      foldBody.append(h('p', { class: 'pdf-hint fold__empty', text: 'Aucun appel archivé pour le moment.' }));
    }
    fold.append(foldBody);
    c.body.append(fold);
    return c.section;
  }
  function featuredAppel(a) {
    const left = a._limite ? daysUntil(a._limite) : null;
    let countdown = null;
    if (left !== null && left <= 30) {
      countdown = h('span', { class: cx('badge', left <= 7 ? 'badge--urgent' : 'badge--format'), text: left === 0 ? 'Dernier jour' : 'Plus que ' + left + ' jour' + (left > 1 ? 's' : '') });
    }
    return h('article', { class: 'appel' },
      h('div', { class: 'appel__content' },
        h('span', { class: 'badge badge--status', text: str(a.etiquette) || 'Appel en cours' }),
        h('h3', { class: 'appel__title', text: a.titre }),
        str(a.description) ? h('p', { class: 'appel__desc', text: a.description }) : null,
        h('p', { class: 'appel__deadline' }, icon('calendar'),
          a._limite ? h('span', null, 'Date limite : ', timeEl(a._limite, fmtLong), countdown) : h('span', { text: 'Sans date limite' })),
        h('div', { class: 'actions' },
          link(a.lien, [h('span', { text: 'Voir les détails' }), icon('chevronRight')], { class: 'btn btn--primary', label: 'Voir les détails : ' + a.titre }),
          isFilled(a.document) ? link(a.document, [icon('download'), h('span', { text: 'Document' })], { class: 'btn btn--soft', download: true, label: 'Télécharger le document : ' + a.titre }) : null)),
      fromSvg(ART_APPEL));
  }

  /* ---------------------------------------------------------------------
     H. Vidéos
     --------------------------------------------------------------------- */
  function renderVideos(id, def, reg) {
    const vids = arr(def.videos).filter(function (v) { return typeof v === 'object'; });
    const c = card(id, def, reg);
    const chips = arr(def.liens).length ? h('div', { class: 'chips' }, arr(def.liens).map(function (l) {
      return link(l.url, [icon(iconName(l.icone, 'external')), h('span', { text: str(l.titre) || 'Lien' })], { class: 'btn btn--soft btn--small', soon: false });
    })) : null;
    if (!vids.length) {
      c.body.append(empty('Les vidéos seront ajoutées prochainement.', 'video'));
      if (chips) c.body.append(chips);
      return c.section;
    }
    const slot = h('div', { class: 'stage-slot' });
    const rows = [];
    function stage(v) {
      const video = parseVideo(v.url);
      const title = str(v.titre) || 'Vidéo';
      const meta = [str(v.duree), str(v.description)].filter(Boolean).join(' – ');
      const kids = [
        picture(v.vignette || (video && video.thumb), '', function () { return fallbackThumb('navy', 'video', ''); }),
        h('span', { class: 'stage__scrim' }, h('span', { class: 'stage__title', text: title }), meta ? h('span', { class: 'stage__meta', text: meta }) : null)
      ];
      if (!video) return h('div', { class: 'stage is-unavailable' }, kids, soon('Vidéo bientôt disponible'));
      if (video.type === 'link') return link(v.url, [kids, playDot()], { class: 'stage', label: 'Regarder : ' + title });
      const b = h('button', { type: 'button', class: 'stage', 'aria-label': 'Lire la vidéo : ' + title + (str(v.duree) ? ' (' + str(v.duree) + ')' : '') }, kids, playDot());
      b.addEventListener('click', function () { play(v); });
      return b;
    }
    function show(v) { slot.hidden = false; slot.replaceChildren(stage(v)); }
    function play(v) {
      const video = parseVideo(v.url);
      if (!video || video.type === 'link') { show(v); return; }
      mountPlayer(slot, video, str(v.titre) || 'Vidéo', function () { show(v); });
    }
    show(vids[0]);
    c.body.append(slot);
    if (vids.length > 1) {
      c.body.append(h('ul', { class: 'video-list' }, vids.map(function (v, i) {
        const video = parseVideo(v.url);
        const b = h('button', { type: 'button', class: 'video-row', 'aria-current': i === 0 ? 'true' : null },
          h('span', { class: 'thumb' }, picture(v.vignette || (video && video.thumb), '', function () { return fallbackThumb('navy', 'video', ''); })),
          h('span', null, h('span', { class: 'video-row__title', text: str(v.titre) || 'Vidéo' }),
            str(v.duree) ? h('span', { class: 'meta meta--block' }, icon('clock'), h('span', { text: v.duree })) : null));
        b.addEventListener('click', function () {
          rows.forEach(function (r) { r.removeAttribute('aria-current'); });
          b.setAttribute('aria-current', 'true');
          play(v);
        });
        rows.push(b);
        return h('li', null, b);
      })));
    }
    if (chips) c.body.append(chips);
    return c.section;
  }

  /* ---------------------------------------------------------------------
     J. Actualités
     --------------------------------------------------------------------- */
  function renderActualites(id, def, reg) {
    const colors = def.categories && typeof def.categories === 'object' ? def.categories : {};
    const items = arr(def.annonces).filter(function (n) { return typeof n === 'object' && str(n.titre); }).map(function (n) {
      return Object.assign({}, n, {
        _date: parseDate(n.date, 'actualité « ' + str(n.titre) + ' »'),
        _expire: parseDate(n.date_expiration, 'actualité « ' + str(n.titre) + ' »')
      });
    }).filter(function (n) {
      if (n._date && n._date > TODAY) return false;     // publication programmée
      if (n._expire && n._expire < TODAY) return false; // expirée
      return true;
    }).sort(function (a, b) {
      return (Number(!!b.epingle) - Number(!!a.epingle)) || ((b._date ? b._date.getTime() : 0) - (a._date ? a._date.getTime() : 0));
    });
    const c = card(id, def, reg);
    if (!items.length) { c.body.append(empty(str(def.texte_aucune_annonce) || 'Aucune actualité pour le moment.', 'bell')); return c.section; }
    const limit = posInt(def.nombre_affiche, 4);
    const list = h('ul', { class: 'news' });
    items.forEach(function (n, i) {
      const t = tone(n.couleur, tone(colors[str(n.categorie)], 'navy'));
      const kids = [
        h('span', { class: 'news__dot', 'aria-hidden': 'true' }),
        h('span', { class: 'news__text' },
          h('span', { class: 'news__title' }, n.titre,
            n.epingle ? h('span', { class: 'badge badge--pin' }, icon('pin'), 'Épinglé') : null,
            n.important ? h('span', { class: 'badge badge--urgent', text: 'Important' }) : null),
          (str(n.categorie) || str(n.resume)) ? h('span', { class: 'news__summary' },
            str(n.categorie) ? h('span', { class: 'news__cat', text: n.categorie }) : null,
            str(n.resume)) : null),
        n._date ? h('span', { class: 'news__date' }, timeEl(n._date)) : h('span')
      ];
      const cls = cx('news__item', 'tone-' + t, n.important && 'is-important');
      const item = isFilled(n.lien) ? link(n.lien, kids, { class: cls, soon: false }) : h('div', { class: cls }, kids);
      const li = h('li', null, item);
      if (i >= limit) { li.hidden = true; li.dataset.extra = ''; }
      list.append(li);
    });
    c.body.append(list);
    if (items.length > limit) c.body.append(h('div', { class: 'card__foot' }, moreToggle(list, items.length - limit, 'Voir toutes les actualités', 'Afficher moins')));
    return c.section;
  }

  /* ---------------------------------------------------------------------
     K. Règlements
     --------------------------------------------------------------------- */
  function renderReglements(id, def, reg) {
    const c = card(id, def, reg);
    c.body.append(arr(def.documents).length ? docRows(def.documents) : empty('Les règlements seront publiés ici prochainement.', 'book'));
    return c.section;
  }

  /* ---------------------------------------------------------------------
     L. Modèle AVIWA
     --------------------------------------------------------------------- */
  function renderAviwa(id, def, reg) {
    const files = arr(def.fichiers).filter(function (f) { return typeof f === 'object'; });
    const c = card(id, def, reg);
    if (!files.length) { c.body.append(empty('Le modèle sera ajouté prochainement.', 'file')); return c.section; }
    const fmts = files.map(function (f) { return formatOf(f.url, f.format) || 'DOC'; });
    const docTitle = str(def.titre_document) || 'Modèle AVIWA';
    const sizes = files.map(function (f) { return str(f.taille); }).filter(Boolean);
    c.body.append(h('div', { class: 'file-card' },
      h('span', { class: cx('file-badge', fmts[0] === 'PDF' && 'is-pdf'), 'aria-hidden': 'true' }, icon('file'), h('span', { text: fmts[0] })),
      h('div', null,
        h('p', { class: 'file-card__title', text: docTitle }),
        h('p', { class: 'file-card__sub', text: fmts.map(function (f) { return '.' + f.toLowerCase(); }).join(', ') + (sizes.length ? ' – ' + sizes.join(', ') : '') })),
      h('div', { class: 'file-card__actions' }, files.map(function (f, i) {
        return link(f.url, [icon('download'), h('span', { text: files.length > 1 ? fmts[i] : 'Télécharger' })],
          { class: cx('btn btn--small', i === 0 ? 'btn--primary' : 'btn--soft'), download: true, label: 'Télécharger ' + docTitle + ' (' + fmts[i] + ')', soonText: 'Bientôt' });
      }))));
    if (def.consignes) c.body.append(h('div', { class: 'intro rich' }, rich(def.consignes)));
    return c.section;
  }

  /* ---------------------------------------------------------------------
     M. Tutoriels GICEA
     --------------------------------------------------------------------- */
  function renderGicea(id, def, reg) {
    const items = arr(def.tutoriels).filter(function (x) { return typeof x === 'object'; });
    const c = card(id, def, reg);
    if (def.introduction) c.body.append(h('div', { class: 'intro rich' }, rich(def.introduction)));
    const slot = h('div', { class: 'player-slot', hidden: true });
    c.body.append(slot);
    if (items.length) {
      c.body.append(h('ul', { class: 'gicea-list' }, items.map(function (it) { return h('li', null, giceaItem(it, slot)); })));
    } else {
      c.body.append(empty('Les tutoriels GICEA seront publiés ici prochainement.', 'playCircle'));
    }
    const aide = arr(def.depannage).filter(function (x) { return typeof x === 'object'; });
    if (aide.length) {
      c.body.append(h('div', { class: 'acc' }, aide.map(function (a) { return accordionItem(Object.assign({ icone: 'info' }, a)); })));
    }
    if (arr(def.liens).length) {
      c.body.append(h('div', { class: 'chips' }, arr(def.liens).map(function (l) {
        return link(l.url, [icon(iconName(l.icone, 'external')), h('span', { text: str(l.titre) || 'Lien' })], { class: 'btn btn--soft btn--small', soon: false });
      })));
    }
    if (str(def.avertissement)) c.body.append(h('p', { class: 'notice' }, icon('shield'), h('span', { text: def.avertissement })));
    return c.section;
  }
  function giceaItem(it, slot) {
    const title = str(it.titre) || 'Tutoriel';
    const video = parseVideo(it.video);
    const guideOk = !!resolveUrl(it.guide);
    const aux = h('span', { class: 'row__aux' }, str(it.duree) ? h('span', { text: str(it.duree) }) : null);
    const kids = [icon(video ? 'playCircle' : 'file'), h('span', { class: 'row__title', text: title }), aux];
    let row;
    if (video && video.type !== 'link') {
      row = h('button', { type: 'button', class: 'row', 'aria-label': 'Lire la vidéo : ' + title + (str(it.duree) ? ' (' + str(it.duree) + ')' : '') }, kids);
      row.addEventListener('click', function () { mountPlayer(slot, video, title); });
    } else if (video) {
      row = link(it.video, kids, { class: 'row', soon: false });
    } else if (guideOk) {
      aux.append(h('span', { text: formatOf(it.guide) || 'PDF' }));
      row = link(it.guide, kids, { class: 'row', soon: false });
    } else {
      aux.append(soon('Bientôt'));
      row = h('div', { class: 'row is-unavailable' }, kids);
    }
    const wrap = h('div', { class: 'gicea-item' },
      h('div', { class: 'gicea-item__main' }, row,
        video && guideOk ? link(it.guide, icon('download'), { class: 'icon-btn', soon: false, download: true, label: 'Guide pas à pas : ' + title }) : null));
    const steps = arr(it.etapes).map(str).filter(Boolean);
    if (steps.length) {
      wrap.append(h('details', { class: 'tone-mint' },
        h('summary', null, h('span', { text: 'Pas à pas (' + steps.length + ' étapes)' }), icon('chevronDown')),
        h('ol', { class: 'steps' }, steps.map(function (s) { return h('li', null, h('span', null, inline(s))); }))));
    }
    return wrap;
  }

  /* ---------------------------------------------------------------------
     I. Train the Trainer
     --------------------------------------------------------------------- */
  function renderTtt(id, def, reg) {
    const sessions = arr(def.sessions).filter(function (s) { return typeof s === 'object' && str(s.titre); }).map(function (s) {
      return Object.assign({}, s, { _date: parseDate(s.date, 'session « ' + str(s.titre) + ' »') });
    }).filter(function (s) { return s._date && s._date >= TODAY; })
      .sort(function (a, b) { return a._date - b._date; });
    const c = card(id, def, reg);
    if (def.introduction) c.body.append(h('div', { class: 'intro rich' }, rich(def.introduction)));
    if (sessions.length) {
      const limit = posInt(def.nombre_affiche, 3);
      const list = h('ul', { class: 'sessions' }, sessions.map(function (s, i) {
        const li = h('li', { class: 'session' },
          h('span', { class: 'date-tile', 'aria-hidden': 'true' },
            h('span', { class: 'date-tile__day', text: String(s._date.getDate()) }),
            h('span', { class: 'date-tile__month', text: fmtMonth.format(s._date).replace('.', '') })),
          h('div', null,
            h('p', { class: 'session__title', text: s.titre }),
            h('p', { class: 'session__meta' },
              h('span', { class: 'meta' }, icon('calendar'), timeEl(s._date, fmtLong)),
              str(s.horaire) ? h('span', { class: 'meta' }, icon('clock'), h('span', { text: s.horaire })) : null,
              str(s.lieu) ? h('span', { class: 'meta' }, icon('mapPin'), h('span', { text: s.lieu })) : null),
            str(s.description) ? h('p', { class: 'session__desc', text: s.description }) : null,
            isFilled(s.inscription) ? link(s.inscription, [h('span', { text: 'S’inscrire' }), icon('chevronRight')], { class: 'btn btn--soft btn--small', label: 'S’inscrire : ' + s.titre }) : null));
        if (i >= limit) { li.hidden = true; li.dataset.extra = ''; }
        return li;
      }));
      c.body.append(list);
      if (sessions.length > limit) c.body.append(moreToggle(list, sessions.length - limit, 'Voir toutes les sessions', 'Afficher moins'));
    } else {
      c.body.append(empty(str(def.texte_aucune_session) || 'Aucune session n’est programmée pour le moment.', 'calendar'));
    }
    if (arr(def.ressources).length) {
      c.body.append(h('h3', { class: 'subhead', text: str(def.titre_ressources) || 'Ressources' }), docRows(def.ressources));
    }
    return c.section;
  }

  /* ---------------------------------------------------------------------
     Registre des sections
     --------------------------------------------------------------------- */
  const REGISTRY = {
    tarifs:             { title: 'Tarifs',              icon: 'coins',      tone: 'teal',     render: renderTarifs },
    tutoriels:          { title: 'Tutoriels',           icon: 'playCircle', tone: 'lavender', render: renderTutoriels },
    appels_a_concept:   { title: 'Appels à concept',    icon: 'megaphone',  tone: 'teal',     render: renderAppels },
    desiderata:         { title: 'Desiderata',          icon: 'form',       tone: 'mint',     render: renderDesiderata },
    onboarding:         { title: 'Onboarding',          icon: 'cap',        tone: 'blue',     render: renderOnboarding },
    videos:             { title: 'Vidéos',              icon: 'video',      tone: 'teal',     render: renderVideos },
    actualites:         { title: 'Actualités',          icon: 'bell',       tone: 'coral',    render: renderActualites },
    flyers:             { title: 'Flyers',              icon: 'image',      tone: 'blue',     render: renderFlyers },
    flyers_specifiques: { title: 'Flyers spécifiques',  icon: 'tag',        tone: 'mint',     render: renderFlyersSpecifiques, size: 'large' },
    reglements:         { title: 'Règlements',          icon: 'book',       tone: 'mint',     render: renderReglements },
    modele_aviwa:       { title: 'Modèle AVIWA',        icon: 'file',       tone: 'blue',     render: renderAviwa },
    tutoriels_gicea:    { title: 'Tutoriels GICEA',     icon: 'gear',       tone: 'mint',     render: renderGicea, size: 'large' },
    train_the_trainer:  { title: 'Train the Trainer',   icon: 'users',      tone: 'lavender', render: renderTtt }
  };

  function safeRender(id, def) {
    const reg = REGISTRY[id];
    try {
      return reg.render(id, def, reg);
    } catch (err) {
      warn('La section « ' + id + ' » n’a pas pu être affichée : ' + (err && err.message));
      return h('section', { class: 'card card--error', id: id },
        h('div', { class: 'card__head' }, h('span', { class: 'tile-icon tone-coral' }, icon('info')),
          h('div', null, h('h2', { class: 'card__title', text: str(def.titre) || reg.title }))),
        empty('Cette rubrique est momentanément indisponible.'));
    }
  }

  /* ---------------------------------------------------------------------
     Assemblage de la page
     --------------------------------------------------------------------- */
  function render(root, cfg, demo) {
    const sections = cfg.sections && typeof cfg.sections === 'object' ? cfg.sections : {};
    const layout = cfg.disposition && typeof cfg.disposition === 'object' ? cfg.disposition : DEFAULT_LAYOUT;
    const placed = new Set();
    const frag = document.createDocumentFragment();

    if (demo) {
      frag.append(h('div', { class: 'demo-banner', role: 'note' },
        h('strong', { text: 'Mode démonstration.' }),
        h('span', { text: 'Tous les contenus affichés sont fictifs et servent uniquement à prévisualiser la mise en page.' }),
        h('a', { href: window.location.pathname, text: 'Afficher la version réelle' })));
    }
    frag.append(renderHero(cfg.entete || {}));

    Object.keys(sections).forEach(function (k) { if (!REGISTRY[k] && k.charAt(0) !== '_') warn('Section inconnue ignorée : « ' + k + ' ».'); });

    ZONES.forEach(function (zone) {
      const ids = arr(layout[zone]).map(str).filter(function (k) {
        if (!REGISTRY[k]) { warn('disposition.' + zone + ' : section inconnue « ' + k + ' ».'); return false; }
        if (placed.has(k)) return false;
        placed.add(k);
        return !!sections[k] && sections[k].visible !== false;
      });
      if (zone === 'ressources') {
        Object.keys(REGISTRY).forEach(function (k) {
          if (!placed.has(k) && sections[k] && sections[k].visible !== false) {
            warn('Section « ' + k + ' » absente de « disposition » : ajoutée dans la zone « ressources ».');
            placed.add(k);
            ids.push(k);
          }
        });
      }
      if (!ids.length) return;
      const z = h('div', { class: 'zone zone--' + zone });
      ids.forEach(function (k) { z.append(safeRender(k, sections[k])); });
      frag.append(z);
    });

    const meta = cfg.meta || {};
    const updated = parseDate(meta.derniere_mise_a_jour, 'meta');
    frag.append(h('footer', { class: 'foot' },
      h('span', { text: str(meta.pied_de_page) || 'Université populaire du Luxembourg' }),
      updated && meta.afficher_date_mise_a_jour !== false ? h('span', null, 'Contenus mis à jour le ', timeEl(updated, fmtLong)) : null));

    root.replaceChildren(frag);
    root.setAttribute('aria-busy', 'false');
    root.classList.add('is-ready');
  }

  function renderLoadError(root, err, src, text) {
    const detail = (err && err.message) ? err.message : String(err);
    let hint;
    if (window.location.protocol === 'file:') {
      hint = 'La page est ouverte directement depuis l’ordinateur (file://) : le navigateur bloque alors la lecture de ' + src + '. Publiez la page sur GitHub Pages ou lancez un serveur local (voir README).';
    } else if (err instanceof SyntaxError) {
      let where = '';
      const pos = /position (\d+)/.exec(detail);
      const lc = /line (\d+) column (\d+)/.exec(detail);
      if (lc) where = ' (ligne ' + lc[1] + ', colonne ' + lc[2] + ')';
      else if (pos && text) {
        const before = text.slice(0, Number(pos[1])).split('\n');
        where = ' (ligne ' + before.length + ', colonne ' + (before[before.length - 1].length + 1) + ')';
      }
      hint = 'Le fichier ' + src + ' contient une erreur de syntaxe JSON' + where + '. Vérifiez les virgules, guillemets et accolades autour de cet endroit.';
    } else {
      hint = 'Le fichier ' + src + ' est introuvable ou inaccessible.';
    }
    root.replaceChildren(h('div', { class: 'load-error', role: 'alert' },
      h('h1', { text: 'Espace Formateurs UniPop' }),
      h('p', { text: 'Le contenu de la page n’a pas pu être chargé.' }),
      h('p', { text: hint }),
      h('p', null, 'Détail technique : ', h('code', { text: detail }))));
    root.setAttribute('aria-busy', 'false');
    if (window.console) console.warn('[Espace Formateurs] ' + hint);
  }

  /* Vérifie en arrière-plan que les fichiers locaux référencés existent. */
  function verifyLocalAssets() {
    const els = Array.prototype.slice.call(document.querySelectorAll('[data-local-asset]'));
    const urls = Array.from(new Set(els.map(function (e) { return e.dataset.localAsset; })));
    if (!urls.length || !window.fetch) return;
    const missing = new Set();
    let index = 0;
    function worker() {
      if (index >= urls.length) return Promise.resolve();
      const u = urls[index++];
      return fetch(u, { method: 'HEAD', cache: 'no-cache' })
        .then(function (res) { if (res.status === 404 || res.status === 410) missing.add(u); })
        .catch(function () { /* hors ligne : pas de conclusion */ })
        .then(worker);
    }
    Promise.all([worker(), worker(), worker()]).then(function () {
      if (!missing.size) return;
      els.forEach(function (el) {
        if (!missing.has(el.dataset.localAsset)) return;
        if (el.tagName === 'BUTTON') { el.disabled = true; el.classList.add('is-unavailable'); return; }
        el.removeAttribute('href');
        el.removeAttribute('download');
        el.removeAttribute('target');
        el.classList.add('is-unavailable');
        el.setAttribute('aria-disabled', 'true');
        if (!el.querySelector('.soon') && !el.hasAttribute('aria-hidden')) el.append(soon('Fichier introuvable'));
      });
      warn('Fichiers introuvables : ' + Array.from(missing).map(function (u) { return new URL(u).pathname; }).join(', '));
    });
  }

  /* Liens internes (#section) : défilement + mise en évidence de la carte. */
  function onDocumentClick(e) {
    const a = e.target.closest ? e.target.closest('a[data-scroll]') : null;
    if (!a) return;
    e.preventDefault();
    const target = document.getElementById(a.dataset.scroll);
    if (!target) return;
    Frame.scrollToElement(target);
    const heading = target.querySelector('.card__title');
    if (heading) heading.focus({ preventScroll: true });
    target.classList.add('is-target');
    setTimeout(function () { target.classList.remove('is-target'); }, 1600);
  }

  /* ---------------------------------------------------------------------
     Démarrage
     --------------------------------------------------------------------- */
  function start() {
    const root = document.getElementById('app');
    const demo = new URLSearchParams(window.location.search).has('demo');
    const src = demo ? 'data/content.demo.json' : 'data/content.json';
    let text = '';
    fetch(src, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status + ' pour ' + src);
        return res.text();
      })
      .then(function (t) {
        text = t;
        const cfg = JSON.parse(t);
        render(root, cfg, demo || !!(cfg.meta && cfg.meta.demo));
        Frame.configure({ allowedOrigins: cfg.integration && cfg.integration.origines_parent_autorisees });
        if (!cfg.integration || cfg.integration.verifier_fichiers_locaux !== false) {
          (window.requestIdleCallback || function (fn) { return setTimeout(fn, 600); })(verifyLocalAssets);
        }
      })
      .catch(function (err) {
        renderLoadError(root, err, src, text);
        Frame.configure({});
      });
    document.addEventListener('click', onDocumentClick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
