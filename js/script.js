 // Simple form validation and interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('GEI Website loaded successfully!');

    // Form submission handlers
    const volunteerForm = document.getElementById('volunteerForm');
    const donationForm = document.getElementById('donationForm');
    const contactForm = document.getElementById('contactForm');

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your interest in volunteering! We will contact you soon.');
            this.reset();
        });
    }

    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = document.getElementById('donationAmount').value;
            alert(`Thank you for your generous donation of R${amount}! Your support makes a difference.`);
            this.reset();
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you within 24 hours.');
            this.reset();
        });
    }

    // Smooth scrolling for navigation
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

    // Simple animation for stats
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, index * 200);
        });
    };

    // Initialize stats animation if on homepage
    if (document.querySelector('.stats-grid')) {
        animateStats();
    }
});