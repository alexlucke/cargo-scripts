(function () {
  var floater, floaterImg, initialized = false;

  function createFloater() {
    if (document.getElementById('work-index-floater')) {
      floater = document.getElementById('work-index-floater');
      floaterImg = floater.querySelector('img');
      return;
    }
    floater = document.createElement('div');
    floater.id = 'work-index-floater';
    floater.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.2s ease;width:200px;max-width:20vw;';
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

  function tick() {
    if (!floater) { requestAnimationFrame(tick); return; }

    var hovered = document.querySelector('gallery-grid figcaption.caption:hover');

    if (hovered) {
      var item = hovered.parentElement;
      while (item && item.tagName.toLowerCase() !== 'media-item') {
        item = item.parentElement;
      }
      if (item) {
        var src = getSrc(item);
        if (src) {
          if (floaterImg.getAttribute('data-src') !== src) {
            floaterImg.src = src;
            floaterImg.setAttribute('data-src', src);
          }
          var grid = document.querySelector('gallery-grid');
          var rect = grid.getBoundingClientRect();
          floater.style.left = (rect.left + rect.width / 2) + 'px';
          floater.style.top = (window.innerHeight / 2) + 'px';
          floater.style.transform = 'translate(-50%, -50%)';
          floater.style.opacity = '1';
          item.classList.add('is-hovered');
        }
      }
    } else {
      floater.style.opacity = '0';
      document.querySelectorAll('media-item.is-hovered').forEach(function (el) {
        el.classList.remove('is-hovered');
      });
    }

    requestAnimationFrame(tick);
  }

  function initIndex() {
    var grid = document.querySelector('gallery-grid');
    if (!grid) return false;

    var captions = grid.querySelectorAll('figcaption.caption');
    if (!captions.length) return false;

    createFloater();

    // Handle clicks since pointer-events:none on media-item disables the link
    captions.forEach(function (caption) {
      if (caption._clickBound) return;
      caption._clickBound = true;
      caption.addEventListener('click', function () {
        var item = caption.parentElement;
        while (item && item.tagName.toLowerCase() !== 'media-item') {
          item = item.parentElement;
        }
        if (item) {
          var href = item.getAttribute('href');
          if (href) {
            var rel = item.getAttribute('rel');
            if (rel === 'history') {
              history.pushState(null, '', href);
              window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
              window.location.href = href;
            }
          }
        }
      });
    });

    if (!initialized) {
      initialized = true;
      requestAnimationFrame(tick);
    }

    return true;
  }

  var observer = new MutationObserver(function () {
    if (initIndex()) observer.disconnect();
  });

  function start() {
    if (!initIndex()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);
  document.addEventListener('cargo:page:load', start);

})();
