/*
==============================================
Dr. Dure-E-Kashaf Portfolio Website - JavaScript
==============================================
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initPreloader();
    initHeader();
    initHeroAnimations();
    init3DToothModel();
    initServiceCards();
    initExpertiseTabs();
    initSkillBars();
    initTestimonialSlider();
    initScrollAnimations();
    initBackToTop();
    initMobileMenu();
    initContactForm();
    initMapSection();
    initResumeDownload();
});

// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', () => {
        // Fade out preloader
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
    });
}

// Header scroll effect
function initHeader() {
    const header = document.querySelector('header');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Hero section animations
function initHeroAnimations() {
    // Animate hero content elements
    const heroTimeline = gsap.timeline({ delay: 0.5 });
    
    heroTimeline
        .to('.hero-content h1', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
        .to('.hero-content h2', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .to('.hero-content p', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .to('.hero-buttons', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');
}

// 3D Tooth Model with Three.js
function init3DToothModel() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js is not loaded. Skipping 3D tooth model initialization.');
        return;
    }
    
    // Create scene, camera, and renderer
    const container = document.getElementById('tooth-model');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a simple tooth geometry (placeholder)
    // In a real implementation, you would load a detailed tooth model
    const toothGeometry = new THREE.TorusGeometry(3, 1, 16, 100);
    const toothMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        specular: 0x1e88e5
    });
    const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
    scene.add(tooth);
    
    // Position camera
    camera.position.z = 10;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the tooth
        tooth.rotation.x += 0.005;
        tooth.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Start animation
    animate();
}

// Service cards with Vanilla Tilt
function initServiceCards() {
    // Check if VanillaTilt is loaded
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt is not loaded. Skipping service cards tilt effect.');
        return;
    }
    
    // Initialize tilt effect on service cards
    VanillaTilt.init(document.querySelectorAll('.service-card'), {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2
    });
}

// Expertise tabs
function initExpertiseTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-per');
    
    // Set up ScrollTrigger for skill bars
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        skillBars.forEach(skillBar => {
            const percentage = skillBar.getAttribute('per');
            
            gsap.to(skillBar, {
                width: `${percentage}%`,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: skillBar,
                    start: 'top 90%',
                    once: true
                }
            });
        });
    } else {
        // Fallback if ScrollTrigger is not available
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const percentage = skillBar.getAttribute('per');
                    skillBar.style.width = `${percentage}%`;
                    observer.unobserve(skillBar);
                }
            });
        }, { threshold: 0.1 });
        
        skillBars.forEach(skillBar => {
            observer.observe(skillBar);
        });
    }
}

// Testimonial slider
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!track || !testimonials.length) return;
    
    let currentIndex = 0;
    const testimonialWidth = 100; // 100%
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Function to go to a specific slide
    function goToSlide(index) {
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        
        track.style.transform = `translateX(-${index * testimonialWidth}%)`;
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
    }
    
    // Event listeners for buttons
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });
    
    // Auto slide (optional)
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Pause auto slide on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
}

// Scroll animations with GSAP
function initScrollAnimations() {
    // Check if ScrollTrigger is loaded
    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger is not loaded. Skipping scroll animations.');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                once: true
            }
        });
    });
    
    // Animate about image
    gsap.from('.about-image', {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-image',
            start: 'top 80%',
            once: true
        }
    });
    
    // Animate about text
    gsap.from('.about-text', {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%',
            once: true
        }
    });
    
    // Animate service cards
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            }
        });
    });
    
    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                once: true
            }
        });
    });
    
    // Animate contact cards
    gsap.utils.toArray('.contact-card').forEach((card, index) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            }
        });
    });
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    const scrollThreshold = 300;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile menu
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Contact form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // Show success message (in a real implementation, you would send this data to a server)
            alert('Thank you for your message! Dr. Kashaf will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Map section
function initMapSection() {
    // This is a placeholder for a real map implementation
    // In a real project, you would use Google Maps, Leaflet, or another mapping library
    const mapContainer = document.getElementById('map-container');
    
    if (mapContainer) {
        // Create a simple placeholder
        mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #e9ecef; color: #6c757d;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 1rem; color: #1e88e5;"></i>
                    <h3>Map Location</h3>
                    <p>House # 4, Faisal Town,<br>Brewery Road, Quetta.</p>
                </div>
            </div>
        `;
    }
}

// Resume download
function initResumeDownload() {
    const resumeBtn = document.getElementById('resume-btn');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a link to the resume PDF file and trigger download
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'Dr_Dure_E_Kashaf_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}
