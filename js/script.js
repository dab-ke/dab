// toggle overlay
function toggleOverlay() {
    var aboutContent = document.querySelector('.overlay-content');

    if (aboutContent.style.maxHeight) {
        aboutContent.style.maxHeight = null;
    } else {
        aboutContent.style.maxHeight = aboutContent.scrollHeight + 'px';
    }
}

// cursor
const cursorDot = document.getElementById('cursorDot');
const cursorCircle = document.getElementById('cursorCircle');

document.addEventListener("mousemove", (e) => {
    gsap.to(cursorDot, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.3,
        ease: "power3.out"
    });

    gsap.to(cursorCircle, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4, 
        ease: "power3.out"
    });
});

document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("mouseenter", () => {
        gsap.to(cursorCircle, { scale: 1.5, duration: 0.2 });
    });
    el.addEventListener("mouseleave", () => {
        gsap.to(cursorCircle, { scale: 1, duration: 0.2 });
    });
});  

// Email
function sendMail() {
    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    }

    emailjs.send("service_bmsyamk", "template_pl46fsx", parms)
        .then(function() {
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";

            showAlert("Message sent successfully!");
        })
        .catch(function(error) {
            showAlert("Failed to send email. Please try again.", "error");
        });
}

// Custom alert function
function showAlert(message, type = "success") {
    // create alert element
    const alert = document.createElement("div");
    alert.className = `custom-alert ${type}`;
    alert.textContent = message;

    // add to body
    document.body.appendChild(alert);

    // show alert
    setTimeout(() => alert.classList.add("show"), 10);

    // remove alert after 3 seconds
    setTimeout(() => {
        alert.classList.remove("show");
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Theme toggle functionality
const checkbox = document.getElementById('checkbox');
const body = document.body;
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    checkbox.checked = savedTheme === 'light';
}

// Replace your current toggleTheme function with this improved version
function toggleTheme() {
    if (this.classList.contains('active')) return; // Don't toggle if clicking active icon
    
    const currentIcon = this;
    const otherIcon = currentIcon === sunIcon ? moonIcon : sunIcon;
    
    // Add rotate-out animation to current icon
    currentIcon.querySelector('svg').classList.add('rotate-out');
    
    // After animation completes, toggle theme
    setTimeout(() => {
        checkbox.checked = !checkbox.checked;
        
        // Apply theme with a slight delay to ensure animations complete
        setTimeout(() => {
            if (checkbox.checked) {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                sunIcon.classList.add('active');
                moonIcon.classList.remove('active');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                moonIcon.classList.add('active');
                sunIcon.classList.remove('active');
            }
            
            // Force a repaint to ensure styles are applied
            document.body.offsetHeight;
        }, 50);
        
        // Remove rotate-out class and add rotate-in to the other icon
        currentIcon.querySelector('svg').classList.remove('rotate-out');
        otherIcon.querySelector('svg').classList.add('rotate-in');
        
        // Remove rotate-in class after animation completes
        setTimeout(() => {
            otherIcon.querySelector('svg').classList.remove('rotate-in');
        }, 500);
    }, 500);
}

// Add click handlers to icons
sunIcon.addEventListener('click', toggleTheme);
moonIcon.addEventListener('click', toggleTheme);

// Add this to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Apply initial theme styles
    const theme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', theme);
    checkbox.checked = theme === 'light';
    
    if (checkbox.checked) {
        sunIcon.classList.add('active');
        moonIcon.classList.remove('active');
    } else {
        moonIcon.classList.add('active');
        sunIcon.classList.remove('active');
    }
});

function forceReflow() {
    void document.body.offsetHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    const logoContainer = document.querySelector('.logo-container');
    const paths = document.querySelectorAll('.logo-container path');
    
    document.body.classList.add('loading');
    
    paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.setAttribute('data-length', length);
    });

    function resetAnimation() {
        paths.forEach(path => {
            const length = path.getAttribute('data-length');
            path.style.strokeDashoffset = length;
            path.style.fill = 'transparent';
            path.style.stroke = getComputedStyle(document.body).getPropertyValue('--text-clr');
        });
    }
    
    function animateLogo() {
        resetAnimation();
        // Animate main outline first
        const mainPath = document.querySelector('.path-main');
        const mainLength = parseFloat(mainPath.getAttribute('data-length'));
        
        // Animation timings
        const drawDuration = 2000;
        const fillDelay = 500;
        const fillDuration = 1000;
        
        // Stroke animation for main path
        anime({
            targets: '.path-main',
            strokeDashoffset: [mainLength, 0],
            duration: drawDuration,
            easing: 'easeInOutSine',
            complete: function() {
                // Animate inner paths
                const innerPaths = ['.path-inner1', '.path-inner2', '.path-inner3'];
                
                innerPaths.forEach((selector, index) => {
                    const path = document.querySelector(selector);
                    const length = parseFloat(path.getAttribute('data-length'));
                    
                    anime({
                        targets: selector,
                        strokeDashoffset: [length, 0],
                        duration: drawDuration / 2,
                        delay: index * 200,
                        easing: 'easeInOutSine'
                    });
                });
                
                // Fill animation
                setTimeout(() => {
                    const fillColor = getComputedStyle(body).getPropertyValue('--text-clr');
                    
                    [...document.querySelectorAll('.logo-container path')].forEach((path, index) => {
                        anime({
                            targets: path,
                            fill: ['transparent', fillColor],
                            duration: fillDuration,
                            delay: index * 200,
                            easing: 'easeInOutSine'
                        });
                    });
                    
                    // When animation completes, fade out logo container and remove loading class
                    setTimeout(() => {
                        anime({
                            targets: logoContainer,
                            opacity: 0,
                            duration: 1000,
                            easing: 'easeInOutSine',
                            complete: function() {
                                logoContainer.style.display = 'none';
                                document.body.classList.remove('loading');

                                // Allow some time for browsers to process the class change
                                // before other scripts run their calculations
                                setTimeout(() => {
                                    // Dispatch a custom event that other scripts can listen for
                                    window.dispatchEvent(new Event('loadingComplete'));
                                }, 100);
                            }
                        });
                    }, 1000);
                }, fillDelay);
            }
        });
    }
    // Start animation after a short delay
    setTimeout(animateLogo, 500);
});

// Add this to scripts that might be affected by the loading state
window.addEventListener('loadingComplete', function() {
    // Re-initialize or recalculate positions here
});

// scroll to top on page refresh
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// scroll to top when page is about to unload
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});


// Bouncing logo
const logo = document.querySelector('.bouncing-logo');
const container = document.querySelector('.bouncing-logo-container');

// Hide logo initially
container.style.display = 'none';

let posX = 0;
let posY = 0;
let speedX = 3;
let speedY = 3;
const logoWidth = logo.offsetWidth;
const logoHeight = logo.offsetHeight;

// Array to store trail elements
const trailElements = [];
const trailCreationDelay = 5;
const maxTrailElements = 100;

let frameCount = 0;
let animationFrameId = null;
let idleTimer = null;
const IDLE_TIMEOUT = 30000; // Show logo after 30 seconds of inactivity

function startIdleTimer() {
    // Clear any existing timer
    if (idleTimer) {
        clearTimeout(idleTimer);
    }
    
    // Hide logo and stop animation
    container.style.display = 'none';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Clear all trail elements
    trailElements.forEach(element => element.remove());
    trailElements.length = 0;
    
    // Start new idle timer
    idleTimer = setTimeout(() => {
        container.style.display = 'block';
        animate();
    }, IDLE_TIMEOUT);
}

function animate() {
    frameCount++;
    
    posX += speedX;
    posY += speedY;

    // Check for wall collisions
    if (posX + logoWidth > window.innerWidth || posX < 0) {
        speedX = -speedX;
    }
    if (posY + logoHeight > window.innerHeight || posY < 0) {
        speedY = -speedY;
    }

    // Update logo position
    logo.style.transform = `translate(${posX}px, ${posY}px)`;
    
    // Create trail elements
    if (frameCount % trailCreationDelay === 0) {
        const trailLogo = document.createElement('img');
        trailLogo.src = 'https://res.cloudinary.com/dab2002/image/upload/v1747759819/dab_white_iighva.png';
        trailLogo.alt = 'Logo Trail';
        trailLogo.classList.add('trail-logo');
        
        trailLogo.style.transform = `translate(${posX}px, ${posY}px)`;
        
        container.appendChild(trailLogo);
        trailElements.push(trailLogo);
        
        if (trailElements.length > maxTrailElements) {
            const oldestElement = trailElements.shift();
            container.removeChild(oldestElement);
        }
    }

    animationFrameId = requestAnimationFrame(animate);
}

// Add event listeners for mouse activity
document.addEventListener('mousemove', startIdleTimer);
document.addEventListener('mousedown', startIdleTimer);
document.addEventListener('mouseup', startIdleTimer);
document.addEventListener('click', startIdleTimer);

// Start the idle timer when the page loads
startIdleTimer();