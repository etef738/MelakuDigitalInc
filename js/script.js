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
        const heroElements = document.querySelectorAll('.hero-text h1, .hero-text .tagline, .hero-text .statement, .hero-text .cta-button');
        console.log('Hero elements found:', heroElements.length); // Debug
        heroElements.forEach((el, index) => {
            const delay = index * animationConfig.staggerDelay;
            el.style.animationDelay = `${delay}ms`;
            console.log(`Set delay ${delay}ms on`, el.tagName); // Debug
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
    
    let ticking = false;
    let lastKnownScrollPosition = 0;
    let isScrolledPast100 = false;
    
    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = lastKnownScrollPosition;
                
                // Only toggle class when crossing the 100px threshold
                const shouldBeScrolled = scrolled > 100;
                if (shouldBeScrolled !== isScrolledPast100) {
                    isScrolledPast100 = shouldBeScrolled;
                    if (shouldBeScrolled) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                
                // Progress bar (update smoothly)
                const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrolled / windowHeight) * 100;
                progressBar.style.width = progress + '%';
                
                ticking = false;
            });
            ticking = true;
        }
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
    
    // === FAQ ACCORDION FUNCTIONALITY ===
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle current item
            if (!isOpen) {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
    
    // === DEMO TOGGLE FUNCTIONALITY ===
    document.querySelectorAll('.demo-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const demoId = this.getAttribute('data-demo');
            const demoContent = document.getElementById('demo-' + demoId);
            
            if (demoContent) {
                demoContent.classList.toggle('active');
                this.textContent = demoContent.classList.contains('active') 
                    ? 'Hide Example ✕' 
                    : 'View Example →';
            }
        });
    });
    
    // === COOKIE CONSENT ===
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('cookieAccept');
    const declineCookies = document.getElementById('cookieDecline');
    
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
        // Get form elements
        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const messageInput = this.querySelector('textarea');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Basic validation
        if (!nameInput.value.trim()) {
            e.preventDefault();
            showValidationError(nameInput, 'Please enter your name');
            return;
        }
        
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            e.preventDefault();
            showValidationError(emailInput, 'Please enter a valid email');
            return;
        }
        
        if (!messageInput.value.trim()) {
            e.preventDefault();
            showValidationError(messageInput, 'Please enter a message');
            return;
        }
        
        // Clear any existing errors
        clearValidationErrors();
        
        // Allow form to submit to the mailto action
        // The form will now send email to info@melakudigitalinc.com via default mailto action
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
// PHASE 4: AI CHAT WIDGET (Gemini-powered)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const chatWidgetWindow = document.getElementById('chatWidgetWindow');
    const chatWidgetButton = document.getElementById('chatWidgetButton');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendButton = document.getElementById('chatSendButton');
    const chatOptionButtons = document.querySelectorAll('.chat-option-button');
    const chatOptions = document.querySelector('.chat-options');

    if (!chatWidgetWindow || !chatWidgetButton) return;

    // Conversation history for multi-turn context
    const conversationHistory = [];

    // Toggle chat window open/close
    chatWidgetButton.addEventListener('click', () => {
        const isOpen = chatWidgetWindow.classList.toggle('active');
        chatWidgetButton.classList.toggle('active', isOpen);
        chatWidgetButton.textContent = isOpen ? '✕' : '💬';
        chatWidgetButton.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open chat');
        if (isOpen && chatInput) chatInput.focus();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (chatWidgetWindow.classList.contains('active') &&
            !chatWidgetWindow.contains(e.target) &&
            !chatWidgetButton.contains(e.target)) {
            chatWidgetWindow.classList.remove('active');
            chatWidgetButton.classList.remove('active');
            chatWidgetButton.textContent = '💬';
            chatWidgetButton.setAttribute('aria-label', 'Open chat');
        }
    });

    // Quick-option buttons — send as a real Gemini message
    const optionQuestions = {
        'services':     'What services does Melaku Digital Inc. offer?',
        'ai-solutions': 'Tell me about your AI solutions.',
        'compliance':   'Are you PIPEDA / Canadian compliant?',
        'quote':        'I would like to request a quote.'
    };

    chatOptionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const question = optionQuestions[action];
            if (!question) return;
            if (chatOptions) chatOptions.style.display = 'none';
            sendToGemini(question);
        });
    });

    // Send typed message
    function sendMessage() {
        if (!chatInput) return;
        const message = chatInput.value.trim();
        if (!message) return;
        if (chatOptions) chatOptions.style.display = 'none';
        chatInput.value = '';
        sendToGemini(message);
    }

    if (chatSendButton) chatSendButton.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // ---- Gemini API call ----
    async function sendToGemini(userMessage) {
        // Check config is loaded
        if (typeof GEMINI_CONFIG === 'undefined' || !GEMINI_CONFIG.apiKey || GEMINI_CONFIG.apiKey === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
            addMessage(userMessage, 'user');
            addMessage('⚠️ Chat is not configured yet. Please add your Gemini API key to js/config.js.', 'bot');
            return;
        }

        addMessage(userMessage, 'user');

        // Disable input while waiting
        if (chatSendButton) chatSendButton.disabled = true;
        if (chatInput) chatInput.disabled = true;

        // Show typing indicator
        const typingId = showTyping();

        // Build message history
        conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        // Build contents array — prepend system prompt as first user/model exchange
        const contents = [
            { role: 'user',  parts: [{ text: GEMINI_CONFIG.systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I am the AI assistant for Melaku Digital Inc. and I am ready to help visitors.' }] },
            ...conversationHistory
        ];

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents })
                }
            );

            removeTyping(typingId);

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const errMsg = err?.error?.message || `Error ${res.status}`;
                addMessage(`Sorry, I encountered an issue: ${errMsg}`, 'bot');
                conversationHistory.pop(); // remove failed user message
                return;
            }

            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I did not get a response. Please try again.';

            // Add assistant reply to history
            conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
            addMessage(reply, 'bot');

        } catch (error) {
            removeTyping(typingId);
            addMessage('Sorry, there was a network error. Please check your connection and try again.', 'bot');
            conversationHistory.pop();
        } finally {
            if (chatSendButton) chatSendButton.disabled = false;
            if (chatInput) { chatInput.disabled = false; chatInput.focus(); }
        }
    }

    // ---- DOM helpers ----
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = sender === 'bot' ? '🤖' : '👤';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // Render markdown-style line breaks and bullet points
        text.split('\n').forEach(line => {
            if (!line.trim()) return;
            const p = document.createElement('p');
            p.textContent = line;
            contentDiv.appendChild(p);
        });

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message';
        typingDiv.id = id;
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content typing-indicator">
                <span></span><span></span><span></span>
            </div>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
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

// ============================================
// HERO CANVAS NETWORK ANIMATION
// ============================================
(function initCanvasAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const config = {
        particleCount: 60,
        connectionDistance: 120,
        baseSpeed: 0.3,
        colorNode: 'rgba(197, 160, 89, 0.6)',
        colorLine: 'rgba(197, 160, 89, 0.15)',
        colorPulse: 'rgba(230, 241, 255, 0.4)'
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.baseSpeed;
            this.vy = (Math.random() - 0.5) * config.baseSpeed;
            this.size = Math.random() * 2 + 1;
            this.isPulse = Math.random() > 0.9;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.isPulse ? config.colorPulse : config.colorNode;
            ctx.fill();

            if (this.isPulse) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = config.colorPulse;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    function resize() {
        const parent = canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        if (particles.length === 0) {
            initParticles();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < config.connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = config.colorLine;
                    ctx.lineWidth = 1 - (dist / config.connectionDistance);
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    initParticles();
    animate();
})();
