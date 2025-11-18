 // Enhanced JavaScript for Green Earth Initiative Website
// Performance optimizations
(function() {
    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            'css/styles.css',
            'images/hero-image.jpg'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }
    
    // Lazy loading for images
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            });
        }
    }
    
    // Defer non-critical JavaScript
    function loadNonCriticalJS() {
        // Load analytics, chat widgets, etc. here
        console.log('Loading non-critical JavaScript...');
    }
    
    // Initialize performance features
    document.addEventListener('DOMContentLoaded', function() {
        preloadCriticalResources();
        initLazyLoading();
        
        // Load non-critical JS after page is interactive
        if (document.readyState === 'complete') {
            loadNonCriticalJS();
        } else {
            window.addEventListener('load', loadNonCriticalJS);
        }
    });
})();

// Enhanced security functions
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function generateCSRFToken() {
    return 'csrf_' + Math.random().toString(36).substr(2, 9);
}

function validateFileUpload(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }
    
    if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
    }
    
    return true;
}

// Enhanced form submission with security
function secureFormSubmission(formData, endpoint) {
    // Add CSRF token
    const csrfToken = generateCSRFToken();
    formData.append('csrf_token', csrfToken);
    
    // Sanitize all text inputs
    for (let [key, value] of formData.entries()) {
        if (typeof value === 'string') {
            formData.set(key, sanitizeInput(value));
        }
    }
    
    return fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-Token': csrfToken
        }
    });
}

// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Green Earth Initiative Website loaded successfully!');

    // ===== SHOPPING CART FUNCTIONALITY =====
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    let cart = [];
    
    // Cart management functions
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeCartSidebar);
    }
    
    function closeCartSidebar() {
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const img = this.dataset.img;
            
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    img,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show cart sidebar when adding an item
            if (cartSidebar) {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
            }
            
            // Show success message
            showNotification('Item added to cart successfully!', 'success');
        });
    });
    
    // Update cart display
    function updateCart() {
        if (!cartItems) return;
        
        // Clear cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        } else {
            // Add each item to cart
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <i class="fas fa-${getItemIcon(item.img)}"></i>
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">R${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners for quantity buttons
            const decreaseButtons = document.querySelectorAll('.decrease');
            const increaseButtons = document.querySelectorAll('.increase');
            const removeButtons = document.querySelectorAll('.remove-item');
            const quantityInputs = document.querySelectorAll('.quantity-input');
            
            decreaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const item = cart.find(item => item.id === id);
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                        updateCart();
                    }
                });
            });
            
            increaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const item = cart.find(item => item.id === id);
                    item.quantity += 1;
                    updateCart();
                });
            });
            
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.dataset.id;
                    cart = cart.filter(item => item.id !== id);
                    updateCart();
                    showNotification('Item removed from cart', 'warning');
                });
            });
            
            quantityInputs.forEach(input => {
                input.addEventListener('change', function() {
                    const id = this.dataset.id;
                    const item = cart.find(item => item.id === id);
                    const newQuantity = parseInt(this.value) || 1;
                    if (newQuantity > 0) {
                        item.quantity = newQuantity;
                        updateCart();
                    }
                });
            });
        }
        
        // Update total and count
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) cartTotal.textContent = `Total: R${total.toFixed(2)}`;
        
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = count;
    }

    function getItemIcon(imgType) {
        const icons = {
            'oil': 'oil-can',
            'butter': 'pump-soap',
            'mist': 'spray-can',
            'tree': 'tree',
            'cleanup': 'trash-restore',
            'education': 'book'
        };
        return icons[imgType] || 'box';
    }

    // ===== FORM VALIDATION =====
    
    // Volunteer Form Validation (enquiry.html)
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateVolunteerForm()) {
                // AJAX form submission simulation
                showNotification('Thank you for your volunteer application! We will contact you within 24 hours.', 'success');
                setTimeout(() => {
                    volunteerForm.reset();
                    clearErrors();
                }, 2000);
            }
        });
    }

    // Contact Form Validation (contact.html)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                // Simulate email sending
                const formData = new FormData(contactForm);
                const emailBody = `
Name: ${formData.get('contactName')}
Email: ${formData.get('contactEmail')}
Phone: ${formData.get('contactPhone') || 'Not provided'}
Subject: ${formData.get('contactSubject')}

Message:
${formData.get('contactMessage')}

Newsletter: ${formData.get('newsletter') ? 'Subscribed' : 'Not subscribed'}
                `;
                
                // Open default email client (real implementation would use server-side)
                const subject = `GEI Contact: ${formData.get('contactSubject')}`;
                const mailtoLink = `mailto:info@greenearth.org.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
                
                window.location.href = mailtoLink;
                
                showNotification('Your message has been prepared for sending. Please check your email client.', 'success');
                setTimeout(() => {
                    contactForm.reset();
                    clearErrors();
                }, 3000);
            }
        });
    }

    // Donation Form Validation
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        // Amount button functionality
        const amountButtons = document.querySelectorAll('.amount-btn');
        const donationAmount = document.getElementById('donationAmount');
        
        amountButtons.forEach(button => {
            button.addEventListener('click', function() {
                amountButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                donationAmount.value = this.dataset.amount;
            });
        });
        
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateDonationForm()) {
                showNotification('Thank you for your generous donation! You will be redirected to our secure payment gateway.', 'success');
                setTimeout(() => {
                    donationForm.reset();
                    clearErrors();
                    amountButtons.forEach(btn => btn.classList.remove('active'));
                }, 3000);
            }
        });
    }

    // Validation Functions
    function validateVolunteerForm() {
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const interest = document.getElementById('interest');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Clear previous errors
        clearErrors();
        
        // Name validation with sanitization
        if (!fullName.value.trim()) {
            showError(fullName, 'Full name is required');
            isValid = false;
        } else if (fullName.value.trim().length < 2) {
            showError(fullName, 'Name must be at least 2 characters long');
            isValid = false;
        } else if (/[<>]/.test(fullName.value)) {
            showError(fullName, 'Name contains invalid characters');
            isValid = false;
        }
        
        // Email validation
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Phone validation
        if (phone.value.trim() && !isValidPhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Interest validation
        if (!interest.value) {
            showError(interest, 'Please select an area of interest');
            isValid = false;
        }
        
        // Message validation
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters long');
            isValid = false;
        } else if (message.value.length > 1000) {
            showError(message, 'Message must be less than 1000 characters');
            isValid = false;
        }
        
        return isValid;
    }

    function validateContactForm() {
        const contactName = document.getElementById('contactName');
        const contactEmail = document.getElementById('contactEmail');
        const contactMessage = document.getElementById('contactMessage');
        
        let isValid = true;
        
        clearErrors();
        
        if (!contactName.value.trim()) {
            showError(contactName, 'Name is required');
            isValid = false;
        } else if (contactName.value.trim().length < 2) {
            showError(contactName, 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        if (!contactEmail.value.trim()) {
            showError(contactEmail, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(contactEmail.value)) {
            showError(contactEmail, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!contactMessage.value.trim()) {
            showError(contactMessage, 'Message is required');
            isValid = false;
        } else if (contactMessage.value.trim().length < 10) {
            showError(contactMessage, 'Message must be at least 10 characters long');
            isValid = false;
        } else if (contactMessage.value.length > 2000) {
            showError(contactMessage, 'Message must be less than 2000 characters');
            isValid = false;
        }
        
        return isValid;
    }

    function validateDonationForm() {
        const donationAmount = document.getElementById('donationAmount');
        const donationType = document.getElementById('donationType');
        const donorName = document.getElementById('donorName');
        const donorEmail = document.getElementById('donorEmail');
        
        let isValid = true;
        
        clearErrors();
        
        if (!donationAmount.value || donationAmount.value < 10) {
            showError(donationAmount, 'Minimum donation amount is R10');
            isValid = false;
        } else if (donationAmount.value > 100000) {
            showError(donationAmount, 'Maximum donation amount is R100,000');
            isValid = false;
        }
        
        if (!donationType.value) {
            showError(donationType, 'Please select donation type');
            isValid = false;
        }
        
        if (!donorName.value.trim()) {
            showError(donorName, 'Full name is required');
            isValid = false;
        } else if (donorName.value.trim().length < 2) {
            showError(donorName, 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        if (!donorEmail.value.trim()) {
            showError(donorEmail, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(donorEmail.value)) {
            showError(donorEmail, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }

    // Utility Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
        
        // Scroll to error
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ===== INTERACTIVE ELEMENTS =====
    
    // Image Gallery with Lightbox
    initImageGallery();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Search functionality
    initSearchFunctionality();
    
    // Event registration
    initEventRegistration();
});

// Image Gallery Function
function initImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length === 0) return;
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&lt;</button>
            <button class="lightbox-next">&gt;</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    let currentImageIndex = 0;

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(img.src, img.alt);
        });
    });

    function openLightbox(src, alt) {
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Lightbox event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
        const galleryImages = document.querySelectorAll('.gallery-image');
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(galleryImages[currentImageIndex].src, galleryImages[currentImageIndex].alt);
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
        const galleryImages = document.querySelectorAll('.gallery-image');
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox(galleryImages[currentImageIndex].src, galleryImages[currentImageIndex].alt);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
        if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (window.innerWidth <= 768) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        header.querySelector('.header-container').appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
        
        // Close menu when clicking on a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Search Functionality
function initSearchFunctionality() {
    const searchButton = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchButton || !searchModal) return;
    
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) searchInput.focus();
    });

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Simple search implementation
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const results = searchContent(query);
            displaySearchResults(results);
        });
        
        // Close on escape key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

function searchContent(query) {
    if (!query) return [];
    
    const pages = {
        'Home': { url: 'index.html', content: 'Green Earth Initiative environmental conservation volunteer donate impact statistics' },
        'About Us': { url: 'about.html', content: 'About us mission vision team history timeline story' },
        'Get Involved': { url: 'involve.html', content: 'Volunteer opportunities events tree planting beach cleanup environmental education' },
        'Donate': { url: 'donate.html', content: 'Donation support fund contribute money impact transparency' },
        'Contact': { url: 'contact.html', content: 'Contact us email phone location offices emergency' }
    };
    
    return Object.entries(pages)
        .filter(([page, data]) => 
            page.toLowerCase().includes(query) || 
            data.content.toLowerCase().includes(query)
        )
        .map(([page, data]) => ({ page, url: data.url }));
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-search">No results found. Try different keywords.</p>';
        return;
    }
    
    results.forEach(result => {
        const resultElement = document.createElement('a');
        resultElement.href = result.url;
        resultElement.className = 'search-result';
        resultElement.textContent = result.page;
        resultElement.addEventListener('click', (e) => {
            document.querySelector('.search-modal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        resultsContainer.appendChild(resultElement);
    });
}

// Event Registration
function initEventRegistration() {
    const eventButtons = document.querySelectorAll('.event-item .btn');
    
    eventButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventItem = this.closest('.event-item');
            const eventName = eventItem.querySelector('h3').textContent;
            const eventDate = eventItem.querySelector('.event-day').textContent + ' ' + 
                            eventItem.querySelector('.event-month').textContent;
            const eventLocation = eventItem.querySelector('.fa-map-marker-alt').parentNode.textContent.trim();
            
            showNotification(`Registration for "${eventName}" on ${eventDate} at ${eventLocation} would open a registration form.`, 'info');
        });
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
        
        console.log(`Page loaded in ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Page load time is slow. Consider optimizing images and scripts.');
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}