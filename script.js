// Mobile Navigation Toggle
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.feature-card, .testimonial-card, .benefit-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Form Validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = {};
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }
    
    validateForm() {
        this.errors = {};
        let isValid = true;
        
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.setError(field, 'Field ini wajib diisi');
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.setError(field, 'Format email tidak valid');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.setError(field, 'Format nomor telepon tidak valid');
                isValid = false;
            }
        }
        
        // Password validation
        if (field.type === 'password' && value) {
            if (value.length < 8) {
                this.setError(field, 'Password minimal 8 karakter');
                isValid = false;
            }
        }
        
        if (isValid) {
            this.clearError(field);
        }
        
        return isValid;
    }
    
    setError(field, message) {
        const errorElement = field.parentNode.querySelector('.form-error') || 
                           field.parentNode.parentNode.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
        this.errors[field.name || field.id] = message;
    }
    
    clearError(field) {
        const errorElement = field.parentNode.querySelector('.form-error') || 
                           field.parentNode.parentNode.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
        delete this.errors[field.name || field.id];
    }
    
    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showSuccessMessage();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // In real implementation, you would send data to your server
            console.log('Form submitted:', data);
        }, 2000);
    }
    
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Terima kasih!</h3>
                <p>Pesan Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.</p>
                <button onclick="this.parentNode.parentNode.remove()" class="btn btn-primary">Tutup</button>
            </div>
        `;
        
        document.body.appendChild(successMessage);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 5000);
    }
}

// Newsletter Subscription
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Format email tidak valid', 'error');
                return;
            }
            
            // Show loading
            button.textContent = 'Mengirim...';
            button.disabled = true;
            
            // Simulate subscription
            setTimeout(() => {
                showNotification('Terima kasih! Anda telah berlangganan newsletter kami.', 'success');
                form.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentNode.parentNode.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Kembali ke atas');
    
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Modal System
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
        
        // Close button
        const closeButton = this.modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
    }
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize modals
function initModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        new Modal(modal.id);
    });
    
    // Modal triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Testimonial Slider (if needed)
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevButton = slider.querySelector('.slider-prev');
    const nextButton = slider.querySelector('.slider-next');
    const indicators = slider.querySelector('.slider-indicators');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        if (indicators) {
            indicators.querySelectorAll('.indicator').forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    
    // Auto-play
    setInterval(nextSlide, 5000);
    
    // Initialize
    showSlide(0);
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Send to analytics (in real implementation)
        // analytics.track('page_load_time', { duration: loadTime });
    });
    
    // Monitor CLS (Cumulative Layout Shift)
    let clsValue = 0;
    let clsEntries = [];
    
    const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                clsEntries.push(entry);
            }
        }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScrolling();
    initNavbarScroll();
    initScrollAnimations();
    initNewsletterForm();
    initCounterAnimation();
    initLazyLoading();
    initBackToTop();
    initModals();
    initTestimonialSlider();
    initPerformanceMonitoring();
    
    // Initialize form validation for all forms
    document.querySelectorAll('form').forEach(form => {
        if (!form.classList.contains('no-validation')) {
            new FormValidator(form);
        }
    });
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.type !== 'submit' && !this.classList.contains('no-loading')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
});

// Add CSS for animations and components
const additionalCSS = `
/* Navbar scroll effect */
.navbar.scrolled {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

/* Animation classes */
.animate-in {
    animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Form error styles */
.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-error {
    display: none;
}

/* Success message */
.success-message {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
}

.success-content {
    background: white;
    padding: 3rem;
    border-radius: 15px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.success-content i {
    font-size: 3rem;
    color: #10b981;
    margin-bottom: 1rem;
}

.success-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
}

.success-content p {
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.6;
}

/* Notification styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
}

.notification-content {
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    border-left: 4px solid #6366f1;
}

.notification-success .notification-content {
    border-left-color: #10b981;
}

.notification-error .notification-content {
    border-left-color: #ef4444;
}

.notification-content i {
    font-size: 1.2rem;
}

.notification-success i {
    color: #10b981;
}

.notification-error i {
    color: #ef4444;
}

.notification-close {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Back to top button */
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 5px 20px rgba(99, 102, 241, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
}

.back-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

/* Modal styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-content {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.modal.active .modal-content {
    transform: scale(1);
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

.modal-close:hover {
    background: #f1f5f9;
}

/* Lazy loading */
img.lazy {
    opacity: 0;
    transition: opacity 0.3s ease;
}

img:not(.lazy) {
    opacity: 1;
}

/* Mobile navigation improvements */
@media (max-width: 768px) {
    .nav-menu.active {
        transform: translateX(0);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);