// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ASCII Banner Animation
const asciiBanner = document.querySelector('.ascii-banner');
if (asciiBanner) {
    const originalText = asciiBanner.textContent;
    let currentIndex = 0;
    
    function typeWriter() {
        if (currentIndex < originalText.length) {
            asciiBanner.textContent = originalText.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeWriter, 5);
        }
    }
    
    // Start typing animation when the banner is in view
    const bannerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                bannerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    bannerObserver.observe(asciiBanner);
}

// Code block copy button
document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    
    const pre = block.parentNode;
    pre.style.position = 'relative';
    pre.appendChild(button);
    
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            button.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = 'Copy';
                button.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            button.textContent = 'Failed';
            button.style.backgroundColor = '#f44336';
        }
    });
});

// Theme switcher
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '🌙';
document.body.appendChild(themeToggle);

let isDarkMode = false;

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '☀️';
}

// Mobile menu toggle
const createMobileMenu = () => {
    const nav = document.querySelector('nav ul');
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '☰';
    document.querySelector('nav').prepend(menuButton);
    
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('show');
    });
};

// Initialize mobile menu if needed
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Window resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-button')) {
            createMobileMenu();
        }
    } else {
        const menuButton = document.querySelector('.mobile-menu-button');
        if (menuButton) {
            menuButton.remove();
            document.querySelector('nav ul').classList.remove('show');
        }
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        themeToggle.click();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        document.querySelector('nav ul')?.classList.remove('show');
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
}); 