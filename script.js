/* ========================================
   WONDERLIGHT STUDIOS — Animations & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. FLOATING PARTICLES BACKGROUND
    // =============================================
    function createParticles() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        hero.insertBefore(canvas, hero.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        function resize() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.growing = Math.random() > 0.5;
                // Random color: purple, cyan, or white
                const colors = [
                    'rgba(245, 158, 11,',    // amber
                    'rgba(251, 191, 36,',    // yellow
                    'rgba(249, 115, 22,',    // orange
                    'rgba(255, 255, 255,',   // white
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.growing) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.6) this.growing = false;
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0) this.reset();
                }

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();

                // Glow effect
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
                ctx.fill();
            }
        }

        // Create particles
        const count = Math.min(60, Math.floor(canvas.width / 20));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animId = requestAnimationFrame(animate);
        }
        animate();
    }
    createParticles();


    // =============================================
    // 2. SCROLL REVEAL ANIMATIONS
    // =============================================
    function initScrollReveal() {
        // Add reveal class to elements
        const revealSelectors = [
            '#about h2',
            '#about p',
            '#games h2',
            '#games > .container > p',
            '.game-card',
            '#contact h2',
            '#contact > .container > p',
            '#contact-form .form-group',
            '#contact-form button',
            'footer',
        ];

        revealSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal');
                // Stagger cards and form groups
                if (selector === '.game-card' || selector === '#contact-form .form-group') {
                    el.style.transitionDelay = (i * 0.15) + 's';
                }
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
    initScrollReveal();


    // =============================================
    // 3. HEADER SCROLL EFFECT
    // =============================================
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add/remove scrolled class
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    });


    // =============================================
    // 4. ACTIVE NAV LINK ON SCROLL
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');

    function updateActiveNav() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);


    // =============================================
    // 5. MOBILE MENU
    // =============================================
    window.toggleMenu = function() {
        const nav = document.getElementById('main-nav');
        const hamburger = document.getElementById('hamburger');
        nav.classList.toggle('open');
        hamburger.classList.toggle('active');
    };

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('main-nav');
            const hamburger = document.getElementById('hamburger');
            nav.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });


    // =============================================
    // 6. SMOOTH PARALLAX ON HERO
    // =============================================
    const heroSection = document.getElementById('hero');
    const heroH2 = heroSection?.querySelector('h2');
    const heroP = heroSection?.querySelector('p');

    window.addEventListener('scroll', () => {
        if (!heroSection) return;
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        if (scrollY < heroHeight) {
            const factor = scrollY / heroHeight;
            if (heroH2) {
                heroH2.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroH2.style.opacity = 1 - factor * 1.2;
            }
            if (heroP) {
                heroP.style.transform = `translateY(${scrollY * 0.1}px)`;
                heroP.style.opacity = 1 - factor * 1.2;
            }
        }
    });


    // =============================================
    // 7. TILT EFFECT ON CARDS
    // =============================================
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    // =============================================
    // 8. GRADIENT FOLLOW ON CARD IMAGE
    // =============================================
    document.querySelectorAll('.card-image').forEach(img => {
        img.addEventListener('mousemove', (e) => {
            const rect = img.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            img.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(124,58,237,0.3), rgba(6,182,212,0.15), transparent 70%)`;
        });

        img.addEventListener('mouseleave', () => {
            img.style.backgroundImage = '';
        });
    });


    // =============================================
    // 9. MAGNETIC BUTTON EFFECT ON CTA
    // =============================================
    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translateY(-3px) scale(1.02) translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });


    // =============================================
    // 10. CONTACT FORM — SEND TO EMAIL
    // =============================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // LOADING STATE
            btn.disabled = true;
            btn.classList.add('btn-loading');
            btn.innerHTML = '<span class="spinner"></span> Sending...';

            try {
                // Send via EmailJS-style or mailto fallback
                // Using formsubmit.co free service (no backend needed)
                const response = await fetch('https://formsubmit.co/ajax/Thomas@vzunderd.nl', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New message from ${name} via Wonderlight Studios`,
                    })
                });

                if (response.ok) {
                    // SUCCESS STATE
                    btn.classList.remove('btn-loading');
                    btn.classList.add('btn-success');
                    btn.innerHTML = '<span class="checkmark">✓</span> Message Sent!';

                    // Reset form
                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        btn.classList.remove('btn-success');
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                    }, 3000);
                } else {
                    throw new Error('Failed to send');
                }

            } catch (error) {
                // ERROR STATE
                btn.classList.remove('btn-loading');
                btn.classList.add('btn-error');
                btn.innerHTML = '✕ Failed to send. Try again.';
                btn.disabled = false;

                setTimeout(() => {
                    btn.classList.remove('btn-error');
                    btn.innerHTML = originalText;
                }, 3000);
            }
        });
    }


    // =============================================
    // 11. TEXT COUNTER ON TEXTAREA
    // =============================================
    const textarea = document.getElementById('message');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }


    // =============================================
    // 12. SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
