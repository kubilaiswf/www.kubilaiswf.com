document.addEventListener("DOMContentLoaded", function() {
    // Throttle fonksiyonu - performans için kritik
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    AOS.init({
        duration: 600,          // 800'den 600'e düşürüldü
        easing: 'ease-out',     // Daha hafif easing
        once: true,             // Animasyonlar sadece 1 kez çalışsın
        mirror: false           // Mirror kapatıldı - büyük performans kazancı
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');

                const sectionTitle = entry.target.querySelector('.section-title');
                if (sectionTitle) {
                    sectionTitle.classList.add('show');
                }
            }
        });
    }, { threshold: 0.15 });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    const navbar = document.querySelector('.navbar');
    // Tüm scroll işlemlerini tek bir throttled listener'da birleştir
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = throttle(() => {
        const scrollY = window.scrollY;

        // Navbar scroll efekti
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link highlighting
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }, 16); // ~60fps throttle

    window.addEventListener('scroll', handleScroll, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});