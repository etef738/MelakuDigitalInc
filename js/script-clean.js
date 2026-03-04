// script.js - Professional animations for Melaku Digital Inc.

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Global animation settings
const animationConfig = {
    duration: prefersReducedMotion ? 0 : 400,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    staggerDelay: 120
};

// Handle reduced motion - THIS RUNS IMMEDIATELY
if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
} else {
    document.body.classList.add('animations-enabled');
}

// ============================================
// CONSOLIDATED DOM READY INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // === HERO STAGGER ANIMATION ===
    if (!prefersReducedMotion) {
        const heroElements = document.querySelectorAll('#hero .hero-text > *');
        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * animationConfig.staggerDelay}ms`;
        });
    }
    
    // === SCROLL-TRIGGERED ANIMATIONS & COUNTERS ===
    if (!prefersReducedMotion) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation if element contains counter
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        animateCounter(counter);
                    }
                    
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all scroll-animated elements
        const animatedElements = document.querySelectorAll(
            '.scroll-animate, .scroll-fade, .scroll-slide-left, .scroll-slide-right, .scroll-scale'
        );
        animatedElements.forEach(el => scrollObserver.observe(el));
    }
    
    // === METRIC COUNTER ANIMATION FUNCTION ===
    function animateCounter(element) {
        const target = element.getAttribute('data-target');
        if (!target) return;
        
        const duration = 2000;
        const start = 0;
        const end = parseInt(target);
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = current + (element.getAttribute('data-suffix') || '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.getAttribute('data-suffix') || '');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // === STICKY NAVIGATION & PROGRESS BAR ===
    const header = document.getElementById('nav');
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Header shrink effect
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Progress bar
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / windowHeight) * 100;
        progressBar.style.width = progress + '%';
    }, { passive: true });
    
    // === HERO PARALLAX ===
    if (!prefersReducedMotion) {
        const heroSection = document.getElementById('hero');
        const heroVideo = document.querySelector('.hero-video-background');
        
        if (heroSection && heroVideo) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                
                if (scrolled < window.innerHeight) {
                    heroVideo.style.transform = `translateY(${rate}px)`;
                }
            }, { passive: true });
        }
    }
    
    // === DEMO TOGGLE FUNCTIONALITY ===
    document.querySelectorAll('.demo-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const demoId = this.getAttribute('data-demo');
            const demoContent = document.getElementById('demo-' + demoId);
            
            if (demoContent) {
                demoContent.classList.toggle('active');
                this.textContent = demoContent.classList.contains('active') 
                    ? 'Hide Example ↑' 
                    : 'View Example →';
            }
        });
    });
    
    // === COPY CODE FUNCTIONALITY ===
    document.querySelectorAll('.copy-code').forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.nextElementSibling;
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                this.style.background = 'rgba(52, 232, 158, 0.2)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            });
        });
    });
    
    // === COOKIE CONSENT ===
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }
    
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }
    
    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }
    
});

// ============================================
// ORIGINAL SECTION ANIMATIONS (PRESERVED)
// ============================================

// Intersection Observer for section reveals
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const sections = document.querySelectorAll('section:not(#hero)');
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Service cards hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
            card.classList.add('hover');
        }
    });
    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
    });
});

// Projects staggered reveal
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.project-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 80);
            });
            projectObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const projectsSection = document.getElementById('projects');
if (projectsSection) {
    projectObserver.observe(projectsSection);
}

// Testimonials soft fade
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            testimonialObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const testimonialsSection = document.getElementById('testimonials');
if (testimonialsSection) {
    testimonialObserver.observe(testimonialsSection);
}

// Compliance section - only fade, no slide
const complianceSection = document.getElementById('compliance');
if (complianceSection) {
    const complianceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                complianceObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    complianceObserver.observe(complianceSection);
}

// ============================================
// PHASE 3: CONTACT FORM VALIDATION
// ============================================

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const messageInput = this.querySelector('textarea');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Basic validation
        if (!nameInput.value.trim()) {
            showValidationError(nameInput, 'Please enter your name');
            return;
        }
        
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            showValidationError(emailInput, 'Please enter a valid email');
            return;
        }
        
        if (!messageInput.value.trim()) {
            showValidationError(messageInput, 'Please enter a message');
            return;
        }
        
        // Clear any existing errors
        clearValidationErrors();
        
        // Simulate form submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'var(--accent-teal)';
            
            // Reset form after 2 seconds
            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                submitBtn.style.background = '';
            }, 2000);
        }, 1500);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showValidationError(input, message) {
    clearValidationErrors();
    const error = document.createElement('div');
    error.className = 'validation-error';
    error.textContent = message;
    error.style.color = '#ff6b6b';
    error.style.fontSize = '13px';
    error.style.marginTop = '5px';
    input.parentNode.appendChild(error);
    input.style.borderColor = '#ff6b6b';
}

function clearValidationErrors() {
    document.querySelectorAll('.validation-error').forEach(el => el.remove());
    document.querySelectorAll('input, textarea').forEach(el => {
        el.style.borderColor = '';
    });
}

// ============================================
// PHASE 4: AI CHAT WIDGET
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    
    if (!chatWidget || !chatToggle) return;
    
    // Toggle chat widget
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) {
            chatInput.focus();
        }
    });
    
    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('open');
    });
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessage(response, 'ai');
        }, 800);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function generateAIResponse(message) {
        const responses = {
            'hello': 'Hello! How can I help you with web development, AI solutions, or app development today?',
            'pricing': 'Our pricing is customized to your specific needs. Please fill out the contact form for a detailed quote.',
            'services': 'We offer Web Development, App Development, AI Solutions, System Architecture, and Technical Consulting.',
            'ai': 'We specialize in custom AI agents, workflow automation, and intelligent systems integration.',
            'contact': 'You can reach us through the contact form below, or email us at info@melakudigital.com',
            'default': 'Thank you for your message! Our team will get back to you shortly. Feel free to fill out the contact form for detailed inquiries.'
        };
        
        const lowerMessage = message.toLowerCase();
        for (const key in responses) {
            if (lowerMessage.includes(key)) {
                return responses[key];
            }
        }
        return responses.default;
    }
});

// ============================================
// PHASE 5: CURSOR GLOW EFFECT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cursor-glow');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let mouseX = -100;
    let mouseY = -100;
    let targetX = -100;
    let targetY = -100;
    
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    
    function animateGlow() {
        // Smooth easing
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create gradient
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
        gradient.addColorStop(0, 'rgba(197, 160, 89, 0.15)');
        gradient.addColorStop(0.5, 'rgba(197, 160, 89, 0.05)');
        gradient.addColorStop(1, 'rgba(197, 160, 89, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
});
