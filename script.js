// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Product Category Switching
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCategories = document.querySelectorAll('.product-category');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Remove active class from all buttons and categories
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            productCategories.forEach(category => category.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show target category
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });

    // Handle URL parameters for category selection
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam && document.getElementById(categoryParam)) {
        // Remove active class from all buttons and categories
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        productCategories.forEach(cat => cat.classList.remove('active'));
        
        // Find and activate the target button
        const targetButton = document.querySelector(`[data-category="${categoryParam}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // Show target category
        const targetElement = document.getElementById(categoryParam);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    }

    // Smooth scrolling for navigation links
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

    // Auto-rotate product showcase (if exists)
    const sampleItems = document.querySelectorAll('.sample-item');
    if (sampleItems.length > 0) {
        let currentIndex = 0;
        
        function showNextSample() {
            sampleItems[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % sampleItems.length;
            sampleItems[currentIndex].classList.add('active');
        }
        
        // Auto-rotate every 4 seconds
        setInterval(showNextSample, 4000);
        
        // Manual navigation with arrow keys
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                sampleItems[currentIndex].classList.remove('active');
                currentIndex = currentIndex === 0 ? sampleItems.length - 1 : currentIndex - 1;
                sampleItems[currentIndex].classList.add('active');
            } else if (e.key === 'ArrowRight') {
                showNextSample();
            }
        });
    }

    // Add click handlers for product showcase navigation
    const productsShowcase = document.querySelector('.products-showcase');
    if (productsShowcase) {
        productsShowcase.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            
            if (clickX < width * 0.2) {
                // Left side clicked - previous image
                const sampleItems = document.querySelectorAll('.sample-item');
                const currentActive = document.querySelector('.sample-item.active');
                const currentIndex = Array.from(sampleItems).indexOf(currentActive);
                
                sampleItems[currentIndex].classList.remove('active');
                const prevIndex = currentIndex === 0 ? sampleItems.length - 1 : currentIndex - 1;
                sampleItems[prevIndex].classList.add('active');
            } else if (clickX > width * 0.8) {
                // Right side clicked - next image
                const sampleItems = document.querySelectorAll('.sample-item');
                const currentActive = document.querySelector('.sample-item.active');
                const currentIndex = Array.from(sampleItems).indexOf(currentActive);
                
                sampleItems[currentIndex].classList.remove('active');
                const nextIndex = (currentIndex + 1) % sampleItems.length;
                sampleItems[nextIndex].classList.add('active');
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-item, .stat-card, .feature-item, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Animate counters when they come into view
    const statNumbers = document.querySelectorAll('.stat-content h3, .stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    entry.target.textContent = '0';
                    setTimeout(() => {
                        animateCounter(entry.target, number);
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Preload images for better performance
function preloadImages() {
    const imageUrls = [];
    for (let i = 1; i <= 45; i++) {
        imageUrls.push(`${i}.jpg`);
    }
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload function when page loads
window.addEventListener('load', preloadImages);