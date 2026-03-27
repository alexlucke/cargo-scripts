(function () {
  var floater, floaterImg, mouseMoveAdded = false;

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
    floater.style.opacity = '0';
    document.querySelectorAll('media-item.is-hovered').forEach(function (el) {
      el.classList.remove('is-hovered');
    });
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
      item.classList.add('is-hovered');
    });

    item.addEventListener('mouseleave', function () {
      hide();
    });
  }

  function initIndex() {
    var grid = document.querySelector('gallery-grid');
    if (!grid) return false;

    var items = grid.querySelectorAll('media-item.thumbnail');
    if (!items.length) return false;

    createFloater();

    // Strip serialized is-hovered state
    grid.querySelectorAll('media-item.is-hovered').forEach(function (el) {
      el.classList.remove('is-hovered');
    });

    items.forEach(function (item) { bindItem(item, grid); });

    // Only add mousemove once ever
    if (!mouseMoveAdded) {
      mouseMoveAdded = true;
      document.addEventListener('mousemove', function (e) {
        var currentGrid = document.querySelector('gallery-grid');
        if (!currentGrid) { hide(); return; }
        var rect = currentGrid.getBoundingClientRect();
        var inside = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        if (!inside) hide();
      });
    }

    // Hide on page navigation
    document.addEventListener('cargo:page:load', hide);

    return true;
  }

  var observer = new MutationObserver(function () {
    if (initIndex()) observer.disconnect();
  });

  function start() {
    hide(); // Always hide on navigation
    if (!initIndex()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);
  document.addEventListener('cargo:page:load', start);

})();
