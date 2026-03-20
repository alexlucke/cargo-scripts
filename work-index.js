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
  console.log('--- getSrc ---');
  console.log('shadowRoot:', item.shadowRoot);
  console.log('children:', item.children.length);
  
  var allImgs = item.querySelectorAll('img');
  console.log('querySelectorAll imgs:', allImgs.length);
  allImgs.forEach(function(img) {
    console.log('img src:', img.src, '| part:', img.getAttribute('part'));
  });

  if (item.shadowRoot) {
    var shadowImgs = item.shadowRoot.querySelectorAll('img');
    console.log('shadow imgs:', shadowImgs.length);
    shadowImgs.forEach(function(img) {
      console.log('shadow img src:', img.src);
    });
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
