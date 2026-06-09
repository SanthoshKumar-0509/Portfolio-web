/**
 * Personal Portfolio Website JS Interactions
 * Author: John Doe
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. MOBILE NAVIGATION MENU
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // Shrink Navbar on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ==========================================================================
    // 2. HERO SECTION TYPEWRITER EFFECT
    // ==========================================================================
    const typedTextSpan = document.querySelector('.typed-text');
    const roles = ['Full Stack Developer', 'UI/UX Designer', 'Software Engineer', 'Problem Solver'];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newRoleDelay = 2000; // Delay between roles
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < roles[roleIndex].length) {
            if (!typedTextSpan.classList.contains('typing')) typedTextSpan.classList.add('typing');
            typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            typedTextSpan.classList.remove('typing');
            setTimeout(erase, newRoleDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!typedTextSpan.classList.contains('typing')) typedTextSpan.classList.add('typing');
            typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            typedTextSpan.classList.remove('typing');
            roleIndex++;
            if (roleIndex >= roles.length) roleIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    if (typedTextSpan) {
        // Init typewriter
        setTimeout(type, 1000);
    }


    // ==========================================================================
    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ==========================================================================
    // 4. DYNAMIC SKILL BARS LOAD
    // ==========================================================================
    const skillSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    if (skillSection && skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const level = bar.getAttribute('data-level');
                        bar.style.width = `${level}%`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillsObserver.observe(skillSection);
    }


    // ==========================================================================
    // 5. STATISTICS COUNTER INCREMENTS
    // ==========================================================================
    const statsSection = document.querySelector('.stats-grid');
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'), 10);
                        const suffix = stat.getAttribute('data-suffix') || '';
                        let count = 0;
                        const duration = 2000; // 2 seconds animation
                        const increment = target / (duration / 16); // ~60fps

                        const updateCount = () => {
                            count += increment;
                            if (count < target) {
                                stat.textContent = Math.floor(count) + suffix;
                                requestAnimationFrame(updateCount);
                            } else {
                                stat.textContent = target + suffix;
                            }
                        };
                        updateCount();
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }


    // ==========================================================================
    // 6. ACTIVE NAVIGATION LINK ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    function activeLinkHighlighter() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-link[href*='${sectionId}']`);
            
            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', activeLinkHighlighter);


    // ==========================================================================
    // 7. CONTACT FORM VALIDATION & SUBMIT ANIMATION
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Simple validation
            if (!name || !email || !subject || !message) {
                showStatus('Please fill in all fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
            showStatus('', ''); // Hide previous status

            setTimeout(() => {
                // Success mockup
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                showStatus('Message sent successfully! I will get back to you soon.', 'success');
                contactForm.reset();
                
                // Clear validation labels states
                const inputs = contactForm.querySelectorAll('.form-input');
                inputs.forEach(input => {
                    input.blur();
                });

                // Clear success status after 5s
                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.style.display = 'none';
                }, 5000);

            }, 1800);
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showStatus(msg, type) {
        if (!formStatus) return;
        
        formStatus.textContent = msg;
        formStatus.className = 'form-status'; // Reset classes
        
        if (type === 'success') {
            formStatus.classList.add('success');
            formStatus.style.display = 'flex';
        } else if (type === 'error') {
            formStatus.classList.add('error');
            formStatus.style.display = 'flex';
        } else {
            formStatus.style.display = 'none';
        }
    }


    // ==========================================================================
    // 8. SCROLL TO TOP VISIBILITY & ACTION
    // ==========================================================================
    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
