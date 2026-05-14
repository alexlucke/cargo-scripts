// v3
(function () {
  var floater, floaterImg;
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
  function hide() {
    if (!floater) return;
    floater.style.opacity = '0';
    document.querySelectorAll('media-item.is-hovered').forEach(function (el) {
      el.classList.remove('is-hovered');
    });
  }
  function bindItem(item) {
    if (item._hoverBound) return;
    item._hoverBound = true;
    var caption = item.querySelector('figcaption.caption');
    item.addEventListener('mouseenter', function () {
      var src = getSrc(item);
      if (!src) return;
      floaterImg.src = src;
      var grid = document.querySelector('gallery-grid');
      var rect = grid.getBoundingClientRect();
     floater.style.left = (rect.left + rect.width / 2) + 'px';
floater.style.top = (rect.top + rect.height / 2) + 'px';  // ← center of the grid
floater.style.transform = 'translate(-50%, -50%)';
      floater.style.opacity = '1';
      item.classList.add('is-hovered');
    });
    if (caption) {
      caption.addEventListener('mouseleave', function (e) {
        var related = e.relatedTarget;
        while (related) {
          if (related.classList && related.classList.contains('caption')) return;
          related = related.parentElement;
        }
        hide();
      });
    }
  }
function initIndex() {
  var grid = document.querySelector('gallery-grid');
  if (!grid) return false; // ← not on the index, bail out
  
  var items = document.querySelectorAll('media-item.thumbnail');
  if (!items.length) return false;
  createFloater();
  hide();
  items.forEach(bindItem);
  return true;
}
  var observer = new MutationObserver(function () {
    if (initIndex()) observer.disconnect();
  });
function start() {
  // Destroy floater on every page transition — recreated only if index exists
  var existing = document.getElementById('work-index-floater');
  if (existing) existing.remove();
  floater = null;
  floaterImg = null;

  if (!initIndex()) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}
function startFresh() {
  var existing = document.getElementById('work-index-floater');
  if (existing) existing.remove();
  floater = null;
  floaterImg = null;
  if (!initIndex()) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function startInit() {
  hide();
  if (!initIndex()) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', startInit);
window.addEventListener('load', startInit);
document.addEventListener('cargo:page:load', startFresh);
})();
