(function () {

  if (!document.getElementById('co-img')) return;

  var IMAGE_URL = 'https://freight.cargo.site/t/original/i/U2867450284325621333137358236665/Sping26_stillLife_131024.jpg';

  var circles = [
    { cx: 0.28, cy: 0.22, r: 0.10,  sx:  160, sy: -80  },
    { cx: 0.62, cy: 0.38, r: 0.085, sx:  220, sy: -20  },
    { cx: 0.45, cy: 0.52, r: 0.095, sx:  180, sy:  60  },
    { cx: 0.20, cy: 0.65, r: 0.090, sx:  140, sy:  100 },
    { cx: 0.70, cy: 0.62, r: 0.075, sx:  260, sy:  40  },
    { cx: 0.35, cy: 0.80, r: 0.080, sx:  200, sy:  130 },
  ];

  var DURATION       = 0.85;
  var STAGGER        = 0.08;
  var EASE           = 'power3.out';
  var AUTOPLAY_DELAY = 0.6;

  var hasPlayed = false;
  var circleEls = [];

  function buildCircles() {
    var img  = document.getElementById('co-img');
    var wrap = document.getElementById('co-wrap');
    if (!img || !wrap) return;

    var svgNS = 'http://www.w3.org/2000/svg';

    /* ── Create and append SVG mask to body ── */
    var svg  = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;');
    svg.setAttribute('aria-hidden', 'true');

    var defs = document.createElementNS(svgNS, 'defs');
    var mask = document.createElementNS(svgNS, 'mask');
    mask.setAttribute('id', 'co-mask');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    defs.appendChild(mask);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    /* Force image to 280px so offsetWidth is reliable */
    img.setAttribute('style',
      'display:block;width:280px;max-width:none !important;height:auto;'
    );

    var W = img.offsetWidth;
    var H = img.offsetHeight;
    if (!W || !H) return;

    /* ── Build mask geometry ── */
    mask.setAttribute('x', 0);
    mask.setAttribute('y', 0);
    mask.setAttribute('width',  W);
    mask.setAttribute('height', H);

    var bg = document.createElementNS(svgNS, 'rect');
    bg.setAttribute('width',  W);
    bg.setAttribute('height', H);
    bg.setAttribute('fill', 'white');
    mask.appendChild(bg);

    circles.forEach(function (d) {
      var r    = d.r  * W;
      var cx   = d.cx * W;
      var cy   = d.cy * H;
      var left = cx - r;
      var top  = cy - r;
      var dia  = r * 2;

      /* Hole in mask */
      var hole = document.createElementNS(svgNS, 'circle');
      hole.setAttribute('cx', cx);
      hole.setAttribute('cy', cy);
      hole.setAttribute('r',  r);
      hole.setAttribute('fill', 'black');
      mask.appendChild(hole);

      /* Circle piece */
      var el = document.createElement('div');
      el.setAttribute('style', [
        'position:absolute',
        'left:'   + left + 'px',
        'top:'    + top  + 'px',
        'width:'  + dia  + 'px',
        'height:' + dia  + 'px',
        'border-radius:50%',
        'overflow:hidden',
        'clip-path:circle(50%)',
        '-webkit-clip-path:circle(50%)',
        'will-change:transform',
        'pointer-events:none',
        'background-image:url(' + IMAGE_URL + ')',
        'background-size:'     + W + 'px ' + H + 'px',
        'background-position:' + (-left) + 'px ' + (-top) + 'px',
        'background-repeat:no-repeat',
      ].join(';'));

      wrap.appendChild(el);
      el.style.transform = 'translate(' + d.sx + 'px,' + d.sy + 'px)';
      circleEls.push(el);
    });

    /*
      Wait one frame for the browser to register the SVG
      before applying mask — fixes Cargo published mode
    */
    requestAnimationFrame(function () {
      img.setAttribute('style',
        'display:block;' +
        'width:280px;' +
        'max-width:none !important;' +
        'height:auto;' +
        'mask:url(#co-mask) !important;' +
        '-webkit-mask:url(#co-mask) !important;'
      );
    });
  }

  function playAnimation() {
    if (hasPlayed) return;
    hasPlayed = true;
    window.removeEventListener('scroll', onScroll);
    circleEls.forEach(function (el, i) {
      gsap.to(el, {
        x: 0, y: 0,
        duration: DURATION,
        delay:    i * STAGGER,
        ease:     EASE,
      });
    });
  }

  function onScroll() {
    var wrap = document.getElementById('co-wrap');
    if (!wrap) return;
    if (wrap.getBoundingClientRect().top < window.innerHeight * 0.85) {
      playAnimation();
    }
  }

  function init() {
    buildCircles();
    var wrap = document.getElementById('co-wrap');
    var rect = wrap ? wrap.getBoundingClientRect() : null;
    if (rect && rect.top < window.innerHeight * 0.85) {
      setTimeout(playAnimation, AUTOPLAY_DELAY * 1000);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  var img = document.getElementById('co-img');
  if (img.complete && img.naturalWidth > 0) {
    init();
  } else {
    img.addEventListener('load', init);
  }

})();
