document.addEventListener('DOMContentLoaded', () => {

    // --- NEW: Function to load HTML components ---
    const loadComponent = (url, elementId) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                }
            })
            .catch(error => console.error('Error loading component:', error));
    };

    // Load header and footer into their placeholders
    loadComponent('nav.html', 'main-header');
    loadComponent('footer.html', 'main-footer');

    // --- EXISTING FUNCTIONALITY ---
    
    // 1. Add shadow to sticky navbar on scroll
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Smooth scrolling for in-page anchor links (still useful for homepage)
    // Note: This logic might need adjustment if it conflicts with the component loader.
    // We add a delay to ensure the nav has loaded before attaching listeners.
    setTimeout(() => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // Only prevent default for true hash links on the same page
                if (href.startsWith('#') && document.querySelector(href)) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }, 500); // 500ms delay to ensure nav.html is loaded
});
