// Mobil cihaz kontrolü
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

function setParticlesHeight() {
  const particlesContainer = document.getElementById('particles-js');
  if (particlesContainer) {
    particlesContainer.style.height = Math.max(window.innerHeight, document.body.scrollHeight) + 'px';
  }
}

function startParticles() {
  // Mobilde particle'ları tamamen devre dışı bırak
  if (isMobile) {
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
      particlesContainer.style.display = 'none';
    }
    return;
  }

  // Ekran genişliğine göre adaptif partikül sayısı (4K'da daha az)
  const w = window.innerWidth;
  const particleCount = w >= 2560 ? 50 : (w >= 1920 ? 75 : 100);

  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": particleCount,
        "density": {
          "enable": true,
          "value_area": 1400
        }
      },
      "color": { "value": "#5a5a66" },
      "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000" } },
      "opacity": { "value": 0.6, "random": true },
      "size": { "value": 2.2, "random": true },
      "line_linked": {
        "enable": true,
        "distance": 160,
        "color": "#5a5a66",
        "opacity": 0.55,
        "width": 1.3
      },
      "move": {
        "enable": true,
        "speed": 0.8,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "bounce",
        "bounce": true,
        "attract": { "enable": false }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "grab" },
        "onclick": { "enable": false, "mode": "push" },
        "resize": true
      },
      "modes": {
        "grab": { "distance": 150, "line_linked": { "opacity": 0.6 } },
        "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
        "repulse": { "distance": 200, "duration": 0.4 },
        "push": { "particles_nb": 4 },
        "remove": { "particles_nb": 2 }
      }
    },
    // 4K monitörlerde devasa framebuffer'ı önlemek için kapalı
    "retina_detect": false
  });
}

(function addSmoothMouseAttract() {
  if (isMobile) return;

  let mouse = { x: null, y: null };
  let smoothMouse = { x: null, y: null };
  let isOverCanvas = false;
  let rafId = null;
  const smoothing = 0.12;

  const particlesEl = document.getElementById('particles-js');
  let canvas = null;
  function updateCanvasRef() {
    if (particlesEl) {
      canvas = particlesEl.querySelector('canvas');
    }
  }
  setTimeout(updateCanvasRef, 500);

  function startLoop() {
    if (rafId === null) rafId = requestAnimationFrame(animateSmoothMouse);
  }

  document.addEventListener('mousemove', function(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // retina_detect kapalı olduğundan DPR çarpımı gereksiz; canvas piksel boyutu CSS pikselleriyle 1:1
    if (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      isOverCanvas = true;
      startLoop();
    } else if (isOverCanvas) {
      isOverCanvas = false;
      startLoop();
    }
  }, { passive: true });

  if (particlesEl) {
    particlesEl.addEventListener('mouseleave', function() {
      isOverCanvas = false;
      startLoop();
    });
    particlesEl.addEventListener('mouseenter', function() {
      isOverCanvas = true;
      startLoop();
    });
  }

  function animateSmoothMouse() {
    rafId = null;
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    const pJS = window.pJSDom[0].pJS;

    if (isOverCanvas && mouse.x !== null && mouse.y !== null) {
      if (smoothMouse.x === null || smoothMouse.y === null) {
        smoothMouse.x = mouse.x;
        smoothMouse.y = mouse.y;
      } else {
        smoothMouse.x += (mouse.x - smoothMouse.x) * smoothing;
        smoothMouse.y += (mouse.y - smoothMouse.y) * smoothing;
      }
      pJS.interactivity.mouse.pos_x = smoothMouse.x;
      pJS.interactivity.mouse.pos_y = smoothMouse.y;
      pJS.interactivity.status = 'mousemove';
      // Fare canvas üstündeyken loop devam etsin
      rafId = requestAnimationFrame(animateSmoothMouse);
    } else {
      // Fare çıktığında smoothing'i sıfırla ve loop'u durdur
      smoothMouse.x = null;
      smoothMouse.y = null;
      pJS.interactivity.mouse.pos_x = null;
      pJS.interactivity.mouse.pos_y = null;
      pJS.interactivity.status = 'mouseleave';
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  setParticlesHeight();
  startParticles();
  setTimeout(() => {
    setParticlesHeight();
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
      window.pJSDom[0].pJS.fn.canvasSize();
    }
  }, 100);
});

window.addEventListener('resize', () => {
  setParticlesHeight();
  if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
    window.pJSDom[0].pJS.fn.canvasSize();
  }
});

let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      setParticlesHeight();
      scrollTimeout = null;
    }, 100);
  }
}, { passive: true });
