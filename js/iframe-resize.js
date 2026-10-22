/* ==========================================================================
   UniPop — Espace Formateurs : communication avec la page WordPress parente
   --------------------------------------------------------------------------
   - Envoie la hauteur réelle du contenu à la page parente (postMessage),
     pour que l'iFrame s'agrandisse sans barre de défilement interne.
   - Demande à la page parente de défiler jusqu'à une section (accès rapides).
   - N'accepte que les messages provenant de window.parent ET d'une origine
     autorisée (liste ci-dessous + data/content.json → integration).
   - Sans script côté WordPress, la page fonctionne normalement avec un
     défilement interne (solution de repli).
   ========================================================================== */
(function () {
  'use strict';

  var CHANNEL = 'unipop-espace-formateurs';

  /* Origines par défaut autorisées à intégrer la page.
     D'autres origines peuvent être ajoutées dans data/content.json
     (integration.origines_parent_autorisees). */
  var DEFAULT_ORIGINS = ['https://www.unipop.lu', 'https://unipop.lu'];

  var embedded = false;
  try { embedded = window.self !== window.top; } catch (e) { embedded = true; }

  var allowed = DEFAULT_ORIGINS.slice();
  if (window.location.origin && window.location.origin !== 'null') allowed.push(window.location.origin);

  var configured = false;      // la configuration a-t-elle été chargée ?
  var pendingHello = null;     // poignée de main reçue avant la configuration
  var parentOrigin = null;     // origine validée de la page parente
  var linked = false;          // la page parente a confirmé écouter les messages
  var lastHeight = 0;
  var scheduled = false;
  var observing = false;

  function normalizeOrigin(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      var u = new URL(value.trim());
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
      return u.origin;
    } catch (e) { return null; }
  }

  function isAllowed(origin) { return allowed.indexOf(origin) !== -1; }

  function post(message) {
    if (!embedded || !parentOrigin) return;
    message.channel = CHANNEL;
    try { window.parent.postMessage(message, parentOrigin); } catch (e) { /* ignoré */ }
  }

  function measure() {
    var root = document.getElementById('page') || document.body;
    if (!root) return 0;
    var rect = root.getBoundingClientRect();
    var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    return Math.ceil(rect.bottom + scrollY);
  }

  function sendHeight(force) {
    var h = measure();
    if (!h) return;
    if (!force && Math.abs(h - lastHeight) < 2) return;
    lastHeight = h;
    post({ type: 'resize', height: h });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      sendHeight(false);
    });
  }

  function link(origin) {
    parentOrigin = origin;
    linked = true;
    document.documentElement.classList.add('is-framed');
    sendHeight(true);
  }

  function onMessage(event) {
    if (!embedded || event.source !== window.parent) return;
    var data = event.data;
    if (!data || typeof data !== 'object' || data.channel !== CHANNEL) return;
    if (data.type !== 'hello') return;
    if (!configured) { pendingHello = event.origin; return; }
    if (isAllowed(event.origin)) link(event.origin);
  }

  function startObserving() {
    if (observing || !embedded) return;
    observing = true;
    var root = document.getElementById('page') || document.body;
    if ('ResizeObserver' in window) {
      new ResizeObserver(schedule).observe(root);
    } else {
      window.addEventListener('resize', schedule);
      setInterval(schedule, 1000);
    }
    window.addEventListener('load', function () { sendHeight(true); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { sendHeight(true); });
  }

  /* Appelé par app.js une fois data/content.json chargé. */
  function configure(options) {
    var list = (options && options.allowedOrigins) || [];
    if (Array.isArray(list)) {
      list.forEach(function (o) {
        var n = normalizeOrigin(o);
        if (n && !isAllowed(n)) allowed.push(n);
      });
    }
    configured = true;
    if (!embedded) return;

    if (pendingHello && isAllowed(pendingHello)) link(pendingHello);
    pendingHello = null;

    // Si le référent est une origine autorisée, on peut annoncer la page
    // sans attendre la poignée de main (la page parente répond par « hello »).
    if (!parentOrigin && document.referrer) {
      var ref = normalizeOrigin(document.referrer);
      if (ref && isAllowed(ref)) {
        parentOrigin = ref;
        post({ type: 'ready' });
        sendHeight(true);
      }
    }
    startObserving();
  }

  /* Fait défiler jusqu'à un élément, via la page parente si elle l'accepte. */
  function scrollToElement(el) {
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (embedded && linked && parentOrigin) {
      var top = el.getBoundingClientRect().top + (window.pageYOffset || 0);
      post({ type: 'scroll', top: Math.max(0, Math.round(top)) });
    } else {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }

  window.addEventListener('message', onMessage);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { if (configured) startObserving(); });
  }

  window.UnipopFrame = {
    configure: configure,
    scrollToElement: scrollToElement,
    refresh: function () { sendHeight(true); },
    isEmbedded: function () { return embedded; },
    isLinked: function () { return linked; }
  };
})();
