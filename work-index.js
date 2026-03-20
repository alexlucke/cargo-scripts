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
    floaterImg = document.createElement('img');
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

  function bindItem(item) {
    if (item._hoverBound) return;
    item._hoverBound = true;

    item.addEventListener('mouseenter', function () {
      var src = getSrc(item);
      if (!src) return;
      floaterImg.src = src;
      floater.classList.add('visible');
      item.classList.add('is-hovered');
    });

    item.addEventListener('mouseleave', function () {
      floater.classList.remove('visible');
      item.classList.remove('is-hovered');
    });
  }

  function initIndex() {
    var items = document.querySelectorAll('media-item.thumbnail');
    if (!items.length) return false;
    createFloater();
    items.forEach(bindItem);
    return true;
  }

  // MutationObserver watches for Cargo rendering elements in
  var observer = new MutationObserver(function () {
    if (initIndex()) observer.disconnect();
  });

  function start() {
    // Try immediately first
    if (!initIndex()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);

  // Cargo-specific navigation event
  document.addEventListener('cargo:page:load', start);

})();
