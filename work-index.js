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

  function hide() {
    if (!floater) return;
    floater.style.opacity = '0';
    document.querySelectorAll('media-item.is-hovered').forEach(function (el) {
      el.classList.remove('is-hovered');
    });
  }

  function initIndex() {
    var grid = document.querySelector('gallery-grid');
    if (!grid) return false;
    var captions = grid.querySelectorAll('figcaption.caption');
    if (!captions.length) return false;

    createFloater();
    hide();

    if (initialized) return true;
    initialized = true;

    document.addEventListener('mousemove', function (e) {
      var grid = document.querySelector('gallery-grid');
      if (!grid) { hide(); return; }

      var captions = grid.querySelectorAll('figcaption.caption');
      var matched = null;

      captions.forEach(function (caption) {
        var rect = caption.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          matched = caption;
        }
      });

      if (matched) {
        var item = matched.parentElement;
        while (item && item.tagName.toLowerCase() !== 'media-item') {
          item = item.parentElement;
        }
        if (!item) return;

        var src = getSrc(item);
        if (!src) return;

        if (floaterImg.getAttribute('data-src') !== src) {
          floaterImg.src = src;
          floaterImg.setAttribute('data-src', src);
        }

        var rect = grid.getBoundingClientRect();
        floater.style.left = (rect.left + rect.width / 2) + 'px';
        floater.style.top = (window.innerHeight / 2) + 'px';
        floater.style.transform = 'translate(-50%, -50%)';
        floater.style.opacity = '1';

        document.querySelectorAll('media-item.is-hovered').forEach(function (el) {
          el.classList.remove('is-hovered');
        });
        item.classList.add('is-hovered');
      } else {
        hide();
      }
    });

    return true;
  }

  var observer = new MutationObserver(function () {
    if (initIndex()) observer.disconnect();
  });

  function start() {
    initialized = false;
    hide();
    if (!initIndex()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);
  document.addEventListener('cargo:page:load', start);

})();
