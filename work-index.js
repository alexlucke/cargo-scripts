(function () {
  var floater, floaterImg, active = false;

  function createFloater() {
    if (document.getElementById('work-index-floater')) {
      floater = document.getElementById('work-index-floater');
      floaterImg = floater.querySelector('img');
      return;
    }
    floater = document.createElement('div');
    floater.id = 'work-index-floater';
    floater.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.25s ease;width:200px;max-width:20vw;';
    floaterImg = document.createElement('img');
    floaterImg.style.cssText = 'display:block;width:100%;height:auto;';
    floater.appendChild(floaterImg);
    document.body.appendChild(floater);
  }

  function hide() {
    if (!floater) return;
    active = false;
    floater.style.opacity = '0';
    document.querySelectorAll('media-item.is-hovered').forEach(function (el) {
      el.classList.remove('is-hovered');
    });
  }

  function isInsideGrid(el) {
    while (el) {
      if (el.tagName && el.tagName.toLowerCase() === 'gallery-grid') return true;
      el = el.parentElement;
    }
    return false;
  }

  function getSrc(item) {
    if (item._cachedSrc) return item._cachedSrc;
    if (!item.shadowRoot) return null;
    var imgs = item.shadowRoot.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].src;
      if (src && src.indexOf('data:') === -1 && src.length > 10) {
        item._cachedSrc = src;
        return src;
      }
    }
    return null;
  }

  function bindItem(item, grid) {
    if (item._hoverBound) return;
    item._hoverBound = true;

    item.addEventListener('mouseenter', function () {
      var src = getSrc(item);
      if (!src) return;
      floaterImg.src = src;
      var rect = grid.getBoundingClientRect();
      floater.style.left = (rect.left + rect.width / 2) + 'px';
      floater.style.top = (rect.top + rect.height / 2) + 'px';
      floater.style.transform = 'translate(-50%, -50%)';
      floater.style.opacity = '1';
      active = true;
      item.classList.add('is-hovered');
    });
  }

  function initIndex() {
    var grid = document.querySelector('gallery-grid');
    if (!grid) return false;

    var items = grid.querySelectorAll('media-item.thumbnail');
    if (!items.length) return false;

    createFloater();
    hide();

    items.forEach(function (item) { bindItem(item, grid); });

    return true;
  }

  // Single document-level mouseover — fires reliably even through shadow DOM
  document.addEventListener('mouseover', function (e) {
    if (!active) return;
    if (!isInsideGrid(e.target)) hide();
  });

  // Also hide on navigation
  document.addEventListener('cargo:page:load', hide);

  var observer = new MutationObserver(function () {
    if (initIndex()) observer.disconnect();
  });

  function start() {
    hide();
    if (!initIndex()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);
  document.addEventListener('cargo:page:load', start);

})();
