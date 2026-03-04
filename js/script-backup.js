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

// Intersection Observer for section reveals
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Stop observing after animation
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for scroll animations
const sections = document.querySelectorAll('section:not(#hero)');
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Service cards hover effects (handled in CSS, but ensure JS doesn't interfere)
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

// Testimonials soft fade (if multiple, but currently static)
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
const complianceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-only');
            complianceObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const complianceSection = document.getElementById('compliance');
if (complianceSection) {
    complianceObserver.observe(complianceSection);
}

/**
 * Institutional Network Animation (Canvas)
 * Visualizes: Connectivity, AI Nodes, Global Infrastructure.
 */
(function initCanvasAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration - Institutional Gold & Deep Blue/node constants
    const config = {
        particleCount: 60,
        connectionDistance: 120,
        mouseDistance: 200,
        baseSpeed: 0.3,
        colorNode: 'rgba(197, 160, 89, 0.6)', // Gold
        colorLine: 'rgba(197, 160, 89, 0.15)', // Faint Gold
        colorPulse: 'rgba(230, 241, 255, 0.4)' // Bright/White Pulse
    };

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.baseSpeed;
            this.vy = (Math.random() - 0.5) * config.baseSpeed;
            this.size = Math.random() * 2 + 1;
            this.isPulse = Math.random() > 0.9; // 10% chance to be a "pulsing AI node"
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.isPulse ? config.colorPulse : config.colorNode;
            ctx.fill();

            // Optional: Glow for pulse nodes
            if (this.isPulse) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = config.colorPulse;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }
        }
    }

    // Resize Handler
    function resize() {
        const parent = canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        
        // Enhance resolution for Retina displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        // Re-init particles on drastic resize
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

        // Update and Draw Particles
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Draw Connections
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

    // Start
    window.addEventListener('resize', resize);
    resize();
    initParticles();
    animate();
})();

/**
 * Contact Form Handler with Validation
 * Validates input and provides visual feedback before opening mail client.
 */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = form.querySelector('button[type="submit"]');

    // Email validation regex
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Show error for a specific field
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('has-error');
        input.classList.add('error');
        input.classList.remove('success');
        
        let errorMsg = formGroup.querySelector('.form-error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'form-error-message';
            formGroup.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    // Clear error for a specific field
    function clearError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('has-error');
        input.classList.remove('error');
        input.classList.add('success');
    }

    // Validate single field on blur
    function validateField(input) {
        const value = input.value.trim();
        
        if (input === nameInput) {
            if (value.length < 2) {
                showError(input, 'Name must be at least 2 characters');
                return false;
            }
        }
        
        if (input === emailInput) {
            if (!isValidEmail(value)) {
                showError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (input === messageInput) {
            if (value.length < 10) {
                showError(input, 'Message must be at least 10 characters');
                return false;
            }
        }
        
        clearError(input);
        return true;
    }

    // Add real-time validation
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isMessageValid = validateField(messageInput);

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            // Shake the form
            form.style.animation = 'shake 0.5s';
            setTimeout(() => { form.style.animation = ''; }, 500);
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Preparing...';

        // Simulate processing (improve UX)
        setTimeout(() => {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Construct email
            const subject = `Business Inquiry from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n--\nSent via Melaku Digital Inc. Website`;

            // Success state
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');
            submitButton.textContent = 'Opening Email Client...';

            // Open mail client
            setTimeout(() => {
                window.location.href = `mailto:info@melakudigital.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // Reset form after a delay
                setTimeout(() => {
                    form.reset();
                    submitButton.classList.remove('success');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Inquiry';
                    [nameInput, emailInput, messageInput].forEach(input => {
                        input.classList.remove('success');
                    });
                }, 2000);
            }, 800);
        }, 600);
    });

    // Add shake animation to CSS if not present
    if (!document.querySelector('style[data-form-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-form-animations', 'true');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
})();

/**
 * FAQ Accordion Handler
 * Manages the expand/collapse logic for the FAQ section.
 */
(function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Optional: Close other items (Accordian vs Toggle behavior)
            // Uncomment the lines below to enforce "one open at a time"
            /*
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            */

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
})();

// ============================================
// VIDEO BACKGROUND WITH FALLBACK
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    const videoBackground = document.getElementById('videoBackground');
    
    if (!video || !videoBackground) return;
    
    // Hide video background if no source or load fails
    video.addEventListener('error', () => {
        videoBackground.style.display = 'none';
    });
    
    // Check if video has no source
    if (video.children.length === 0) {
        videoBackground.style.display = 'none';
    }
});

// ============================================
// PHASE 4: AI CHAT WIDGET
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatWidgetButton');
    const chatWindow = document.getElementById('chatWidgetWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendButton = document.getElementById('chatSendButton');
    const chatOptions = document.querySelectorAll('.chat-option-button');
    
    if (!chatButton || !chatWindow) return;
    
    // Knowledge base for AI responses
    const knowledgeBase = {
        services: {
            keywords: ['service', 'offer', 'do', 'provide', 'capabilities', 'what'],
            response: `We offer comprehensive enterprise solutions:\n\n<strong>AI & Machine Learning:</strong> Custom AI models, intelligent automation, predictive analytics, and NLP solutions.\n\n<strong>Custom Software Development:</strong> Full-stack web applications, mobile apps, cloud-native architecture, and API development.\n\n<strong>Data Engineering:</strong> ETL pipelines, data warehouses, real-time analytics, and business intelligence dashboards.\n\n<strong>Process Automation:</strong> RPA, workflow optimization, and intelligent document processing.\n\nAll solutions are built with Canadian compliance (PIPEDA) and enterprise security standards.`
        },
        ai: {
            keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'automation', 'intelligent'],
            response: `Our AI solutions include:\n\n✓ <strong>Custom AI Models:</strong> Tailored machine learning models for your specific business needs\n✓ <strong>Intelligent Automation:</strong> 24/7 automated workflows that learn and adapt\n✓ <strong>Natural Language Processing:</strong> Chatbots, sentiment analysis, document understanding\n✓ <strong>Predictive Analytics:</strong> Forecast trends and make data-driven decisions\n✓ <strong>Computer Vision:</strong> Image recognition and automated quality control\n\nWe deploy enterprise-grade AI that integrates seamlessly with your existing systems, ensuring 10x faster deployment times.`
        },
        compliance: {
            keywords: ['compliance', 'canadian', 'pipeda', 'data', 'privacy', 'security', 'regulation'],
            response: `<strong>100% Canadian Compliance Guaranteed</strong>\n\nMelaku Digital Inc. is a Canadian corporation fully committed to:\n\n✓ <strong>PIPEDA Compliance:</strong> All data handling follows Personal Information Protection and Electronic Documents Act\n✓ <strong>Data Sovereignty:</strong> Your data stays in Canadian servers\n✓ <strong>Enterprise Security:</strong> Bank-level encryption, SOC 2 compliance, regular security audits\n✓ <strong>Privacy by Design:</strong> Privacy considerations built into every system from the ground up\n\nOur compliance framework ensures your organization meets all regulatory requirements while maintaining operational efficiency.`
        },
        pricing: {
            keywords: ['cost', 'price', 'pricing', 'budget', 'how much', 'quote'],
            response: `Our pricing is project-based and tailored to your specific needs.\n\n<strong>Typical Engagement Models:</strong>\n• Fixed-price projects for well-defined scopes\n• Retainer agreements for ongoing development\n• Dedicated team augmentation\n\n<strong>What influences pricing:</strong>\n• Project complexity and scope\n• Required technologies and integrations\n• Timeline and resource requirements\n• Support and maintenance needs\n\nWould you like a personalized quote? I can connect you with our team for a free consultation.`
        },
        timeline: {
            keywords: ['timeline', 'time', 'how long', 'duration', 'when', 'delivery'],
            response: `We pride ourselves on <strong>10x faster deployment</strong> through:\n\n<strong>Typical Timelines:</strong>\n• POC/MVP: 2-4 weeks\n• Small-medium projects: 1-3 months\n• Enterprise solutions: 3-6 months\n• Ongoing support: 24/7 availability\n\n<strong>Our Rapid Delivery Approach:</strong>\n✓ Pre-configured enterprise modules\n✓ Agile methodology with 2-week sprints\n✓ Automated testing and CI/CD pipelines\n✓ Parallel development streams\n\nWe establish realistic timelines during initial consultation based on your specific requirements.`
        },
        contact: {
            keywords: ['contact', 'reach', 'email', 'phone', 'talk', 'meeting'],
            response: `I'd be happy to connect you with our team!\n\n<strong>Contact Information:</strong>\n📧 Email: info@melakudigital.com\n🏢 Location: Canada\n⏰ Business Hours: Monday-Friday, 9:00 AM - 5:00 PM (EST)\n\nWould you like me to take you to our contact form for a personalized inquiry?`
        }
    };
    
    // Find best matching response
    function findBestResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;
        
        for (const [key, data] of Object.entries(knowledgeBase)) {
            let score = 0;
            data.keywords.forEach(keyword => {
                if (lowerMessage.includes(keyword)) {
                    score++;
                }
            });
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = data.response;
            }
        }
        
        if (bestMatch) {
            return bestMatch;
        }
        
        // Default response
        return `Thank you for your question! Our team specializes in:\n\n• AI-powered enterprise solutions\n• Custom software development\n• Data engineering & analytics\n• Intelligent automation\n\nCould you please provide more details about what you're looking for? Or select one of the quick options below to learn more about specific services.`;
    }
    
    // Add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send user message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, true);
        chatInput.value = '';
        
        // Simulate typing delay
        chatSendButton.disabled = true;
        setTimeout(() => {
            const response = findBestResponse(message);
            addMessage(response);
            chatSendButton.disabled = false;
            chatInput.focus();
        }, 800);
    }
    
    // Toggle chat window
    chatButton.addEventListener('click', () => {
        const isActive = chatWindow.classList.toggle('active');
        chatButton.classList.toggle('active', isActive);
        chatButton.textContent = isActive ? '✕' : '💬';
        
        if (isActive) {
            chatInput.focus();
        }
    });
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !chatButton.contains(e.target)) {
            chatWindow.classList.remove('active');
            chatButton.classList.remove('active');
            chatButton.textContent = '💬';
        }
    });
    
    // Send button click
    chatSendButton.addEventListener('click', sendMessage);
    
    // Enter key to send
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Handle preset chat options
    chatOptions.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.getAttribute('data-action');
            
            switch(action) {
                case 'services':
                    addMessage('What services do you offer?', true);
                    setTimeout(() => {
                        addMessage(knowledgeBase.services.response);
                    }, 600);
                    break;
                    
                case 'ai-solutions':
                    addMessage('Tell me about your AI solutions', true);
                    setTimeout(() => {
                        addMessage(knowledgeBase.ai.response);
                    }, 600);
                    break;
                    
                case 'compliance':
                    addMessage('Are you Canadian compliant?', true);
                    setTimeout(() => {
                        addMessage(knowledgeBase.compliance.response);
                    }, 600);
                    break;
                    
                case 'quote':
                    addMessage('I would like to request a quote', true);
                    setTimeout(() => {
                        addMessage('Excellent! Let me take you to our contact form where you can provide details about your project.');
                        setTimeout(() => {
                            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                            chatWindow.classList.remove('active');
                            chatButton.classList.remove('active');
                            chatButton.textContent = '💬';
                            setTimeout(() => {
                                document.getElementById('name')?.focus();
                            }, 800);
                        }, 1000);
                    }, 600);
                    break;
            }
        });
    });
});

// ============================================
// PHASE 5: CURSOR GLOW EFFECT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const cursorGlow = document.getElementById('cursorGlow');
    
    if (!cursorGlow) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check if device supports hover (not touch device)
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    if (prefersReducedMotion || !supportsHover) {
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show glow on first movement
        if (!cursorGlow.classList.contains('active')) {
            cursorGlow.classList.add('active');
        }
    });
    
    // Hide glow when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });
    
    // Smooth follow animation
    function animateGlow() {
        // Ease towards mouse position
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        glowX += dx * 0.15;
        glowY += dy * 0.15;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
});

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
    
    let lastScroll = 0;
    
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
        
        lastScroll = scrolled;
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
    
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }
    
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
    });
    
    declineCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
    });
    
});
    const progressBar = document.getElementById('scrollProgress');
    
    if (!header || !progressBar) return;
    
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update progress bar
        progressBar.style.width = scrollPercent + '%';
        
        // Toggle sticky header class
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial check
    updateScrollEffects();
});

// ============================================
// PHASE 11: INTERACTIVE SERVICE DEMOS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const demoToggles = document.querySelectorAll('.demo-toggle');
    const copyButtons = document.querySelectorAll('.copy-code');
    
    // Toggle demo code visibility
    demoToggles.forEach(button => {
        button.addEventListener('click', function() {
            const demoId = 'demo-' + this.getAttribute('data-demo');
            const demoContent = document.getElementById(demoId);
            
            if (demoContent) {
                const isActive = demoContent.classList.toggle('active');
                this.textContent = isActive ? 'Hide Example ✕' : 'View Example →';
            }
        });
    });
    
    // Copy code to clipboard
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.nextElementSibling;
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });
});\n\n// ============================================\n// PHASE 13: COOKIE CONSENT BANNER\n// ============================================\n\ndocument.addEventListener('DOMContentLoaded', function() {\n    const cookieBanner = document.getElementById('cookieConsent');\n    const acceptBtn = document.getElementById('cookieAccept');\n    const declineBtn = document.getElementById('cookieDecline');\n    \n    if (!cookieBanner) return;\n    \n    // Check if user has already made a choice\n    const cookieChoice = localStorage.getItem('cookieConsent');\n    \n    if (!cookieChoice) {\n        // Show banner after 1 second\n        setTimeout(() => {\n            cookieBanner.classList.add('show');\n        }, 1000);\n    }\n    \n    // Accept cookies\n    acceptBtn.addEventListener('click', () => {\n        localStorage.setItem('cookieConsent', 'accepted');\n        cookieBanner.classList.remove('show');\n        console.log('Cookies accepted');\n    });\n    \n    // Decline cookies\n    declineBtn.addEventListener('click', () => {\n        localStorage.setItem('cookieConsent', 'declined');\n        cookieBanner.classList.remove('show');\n        console.log('Cookies declined');\n    });\n});