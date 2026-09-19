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
                    'rgba(16, 185, 129,',    // emerald
                    'rgba(52, 211, 153,',    // light green
                    'rgba(5, 150, 105,',     // dark green
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
                    
                    // Clean up classes and styles after animation finishes so hover/tilt works
                    setTimeout(() => {
                        entry.target.classList.remove('reveal', 'visible');
                        entry.target.style.transitionDelay = '';
                    }, 2000);
                    
                    observer.unobserve(entry.target);
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
    document.querySelectorAll('.game-card, .focus-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.setProperty('--hover-transition', '0.1s');
        });

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
            card.style.setProperty('--hover-transition', 'var(--transition-smooth)');
            card.style.transform = '';
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
        btn.addEventListener('mouseenter', () => {
            btn.style.setProperty('--hover-transition', '0.1s');
        });

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translateY(-3px) scale(1.02) translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.setProperty('--hover-transition', 'var(--transition-smooth)');
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
    // =============================================
    // 13. CUSTOM WIDGETS (LocalStorage)
    // =============================================
    const widgetsContainer = document.getElementById('custom-widgets-container');
    const addWidgetBtn = document.getElementById('add-widget-btn');

    if (widgetsContainer && addWidgetBtn) {
        let widgets = JSON.parse(localStorage.getItem('wonderlight_widgets')) || [];

        function saveWidgets() {
            try {
                localStorage.setItem('wonderlight_widgets', JSON.stringify(widgets));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('Niet genoeg opslagruimte voor deze foto. Probeer een kleinere foto!');
                }
            }
        }

        function renderWidgets() {
            widgetsContainer.innerHTML = '';
            widgets.forEach((widget, index) => {
                const card = document.createElement('div');
                card.className = 'custom-widget-card';
                card.style.backgroundColor = widget.bgColor || 'rgba(255, 255, 255, 0.04)';
                card.style.color = widget.textColor || '#f8f5f0';
                card.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4), 0 0 ' + (widget.glowStrength || 40) + 'px ' + (widget.glowColor || 'rgba(16, 185, 129, 0.1)');

                card.innerHTML = `
                    <div class="widget-layout">
                        <div class="widget-text">
                            <h3 class="widget-title" contenteditable="true" data-index="${index}">${widget.title || 'Nieuwe Widget'}</h3>
                            <p class="widget-desc" contenteditable="true" data-index="${index}">${widget.description || 'Beschrijving hier...'}</p>
                        </div>
                        <label class="widget-image-container">
                            ${widget.image ? `<img src="${widget.image}" alt="Widget Image">` : `<span>Upload Foto</span>`}
                            <input type="file" accept="image/*" class="widget-img-upload" data-index="${index}" style="display: none;">
                        </label>
                    </div>
                    <div class="widget-settings">
                        <label title="Achtergrondkleur">
                            BG <input type="color" class="setting-bg" data-index="${index}" value="${rgbaToHex(widget.bgColor) || '#1c1c1c'}">
                        </label>
                        <label title="Tekstkleur">
                            Txt <input type="color" class="setting-text" data-index="${index}" value="${widget.textColor || '#f8f5f0'}">
                        </label>
                        <label title="Gloedkleur">
                            Glow <input type="color" class="setting-glow" data-index="${index}" value="${rgbaToHex(widget.glowColor) || '#10b981'}">
                        </label>
                        <label title="Gloedsterkte">
                            <input type="range" class="setting-glow-strength" data-index="${index}" min="0" max="100" value="${widget.glowStrength || 40}">
                        </label>
                        <button class="remove-widget-btn" data-index="${index}">Verwijder</button>
                    </div>
                `;
                widgetsContainer.appendChild(card);
            });
            attachWidgetEvents();
        }

        function rgbaToHex(color) {
            if (!color) return null;
            if (color.startsWith('#')) return color;
            const rgb = color.match(/\\d+/g);
            if (!rgb || rgb.length < 3) return '#10b981';
            return '#' + rgb.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        }
        
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        }

        function attachWidgetEvents() {
            document.querySelectorAll('.widget-title, .widget-desc').forEach(el => {
                el.addEventListener('blur', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    if (e.target.classList.contains('widget-title')) widgets[idx].title = e.target.innerText;
                    if (e.target.classList.contains('widget-desc')) widgets[idx].description = e.target.innerText;
                    saveWidgets();
                });
            });

            document.querySelectorAll('.setting-bg').forEach(el => {
                el.addEventListener('input', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    widgets[idx].bgColor = hexToRgba(e.target.value, 0.4);
                    saveWidgets();
                    renderWidgets();
                });
            });

            document.querySelectorAll('.setting-text').forEach(el => {
                el.addEventListener('input', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    widgets[idx].textColor = e.target.value;
                    saveWidgets();
                    renderWidgets();
                });
            });

            document.querySelectorAll('.setting-glow').forEach(el => {
                el.addEventListener('input', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    widgets[idx].glowColor = hexToRgba(e.target.value, 0.2);
                    saveWidgets();
                    renderWidgets();
                });
            });
            
            document.querySelectorAll('.setting-glow-strength').forEach(el => {
                el.addEventListener('input', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    widgets[idx].glowStrength = e.target.value;
                    saveWidgets();
                    renderWidgets();
                });
            });

            document.querySelectorAll('.widget-img-upload').forEach(el => {
                el.addEventListener('change', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            widgets[idx].image = ev.target.result;
                            saveWidgets();
                            renderWidgets();
                        };
                        reader.readAsDataURL(file);
                    }
                });
            });

            document.querySelectorAll('.remove-widget-btn').forEach(el => {
                el.addEventListener('click', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    widgets.splice(idx, 1);
                    saveWidgets();
                    renderWidgets();
                });
            });
        }

        addWidgetBtn.addEventListener('click', () => {
            widgets.push({
                title: 'Nieuwe Widget',
                description: 'Beschrijving hier...',
                image: null,
                bgColor: 'rgba(255, 255, 255, 0.04)',
                textColor: '#f8f5f0',
                glowColor: 'rgba(16, 185, 129, 0.1)',
                glowStrength: 40
            });
            saveWidgets();
            renderWidgets();
        });

        renderWidgets();
    }

});
