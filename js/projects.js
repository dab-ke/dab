// cursor
const cursorDot = document.querySelector(".cursor-dot");
const cursorCircle = document.querySelector(".cursor-circle");

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

// Carousel animation
let animationDuration = 20;

function updateAnimation(carouselTrack) {
    if (carouselTrack) {
        carouselTrack.style.animationDuration = `${animationDuration}s`;
    }
}

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

// form validation
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Always prevent default to control submission

        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        // Improved email validation using regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            alert("Please enter your name");
            return;
        }
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address");
            return;
        }
        if (!message) {
            alert("Please enter your message");
            return;
        }

        // If all validation passes, send the mail
        sendMail();
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

    // Project functionality
    const projectContent = document.querySelector('.project-content');
    
    // Get all project IDs
    const projectIds = Object.keys(window.projects);
    
    // Function to get next project ID
    function getNextProjectId(currentId) {
        const currentIndex = projectIds.indexOf(currentId);
        return projectIds[(currentIndex + 1) % projectIds.length];
    }
    
    // Function to get previous project ID
    function getPreviousProjectId(currentId) {
        const currentIndex = projectIds.indexOf(currentId);
        return projectIds[(currentIndex - 1 + projectIds.length) % projectIds.length];
    }
    
    // Function to navigate to a project
    function navigateToProject(projectId) {
        const newUrl = `projects.html?id=${projectId}`;
        window.history.pushState({ projectId }, '', newUrl);
        
        // Add transitioning class
        projectContent.classList.add('transitioning');
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Wait for transition and scroll to complete before loading new content
        setTimeout(() => {
            loadProjectContent(projectId);
            projectContent.classList.remove('transitioning');
        }, 500);
    }
    
    // Add click handlers for navigation
    const prevButton = document.querySelector('.project-nav-item:first-child');
    const nextButton = document.querySelector('.project-nav-item:last-child');
    
    if (prevButton && nextButton) {
        // Create title elements
        const prevTitle = document.createElement('div');
        prevTitle.className = 'project-nav-item-title';
        prevButton.appendChild(prevTitle);
        
        const nextTitle = document.createElement('div');
        nextTitle.className = 'project-nav-item-title';
        nextButton.appendChild(nextTitle);
        
        // Update titles based on current project
        function updateNavigationTitles(currentId) {
            const prevId = getPreviousProjectId(currentId);
            const nextId = getNextProjectId(currentId);
            
            prevTitle.textContent = window.projects[prevId]?.name || '';
            nextTitle.textContent = window.projects[nextId]?.name || '';
        }
        
        prevButton.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const currentId = urlParams.get('id');
            if (currentId) {
                const prevId = getPreviousProjectId(currentId);
                navigateToProject(prevId);
            }
        });
        
        nextButton.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const currentId = urlParams.get('id');
            if (currentId) {
                const nextId = getNextProjectId(currentId);
                navigateToProject(nextId);
            }
        });
    }
    
    // Function to load project content
    function loadProjectContent(projectId) {
        const project = window.projects[projectId];
        if (!project) return;

        // Set the page title to 'Dab | <project name>'
        document.title = `Dab | ${project.name}`;

        // Update the project content
        projectContent.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track">
                    <!-- First set of items (will be duplicated for seamless loop) -->
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                    
                    <!-- Duplicated set for seamless loop -->
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                    <div class="carousel-item">
                        <h1>${project.name}</h1>
                    </div>
                </div>
            </div>
            <div class="image-container">
                <div class="card">
                    <img class="parallax-img" src="${project.image1}" alt="Image 1" loading="lazy">
                </div>
                <div class="card-description">
                    <p>${project.description}</p><br><br>
                    <p>${project.year}</p><br><br>
                    <a href="${project.link}" target="_blank" style="text-transform: uppercase;">Visit site</a>
                </div>
                <div class="card" >
                    <img class="parallax-img" src="${project.image2}" alt="Image 2" loading="lazy">
                </div>
                <div class="card">
                    <img class="parallax-img" src="${project.image3}" alt="Image 3" loading="lazy">
                </div>
                <div class="card" >
                    <img class="parallax-img" src="${project.image4}" alt="Image 4" loading="lazy">
                </div>
            </div>
        `;

        // Update navigation titles
        updateNavigationTitles(projectId);

        // Initialize carousel animation after content is loaded
        const newCarouselTrack = projectContent.querySelector('.carousel-track');
        updateAnimation(newCarouselTrack);

        // const parallaxContainers = document.querySelectorAll('.card');
            
        // function handleScroll() {
        //     parallaxContainers.forEach(container => {
        //         const speed = parseFloat(container.getAttribute('data-speed'));
        //         const rect = container.getBoundingClientRect();
        //         const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
        //         if (isVisible) {
        //             const yPos = (window.scrollY - rect.top + window.innerHeight) * -speed;
        //             const parallaxImg = container.querySelector('.parallax-img');
        //             parallaxImg.style.transform = `translateY(${yPos}px)`;
        //         }
        //     });
        // }
        
        // window.addEventListener('scroll', handleScroll);
        // handleScroll(); // Initialize positions
    }
    
    // Check if we're on the projects page and if there's a project ID in the URL
    if (window.location.pathname.includes('projects.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        if (projectId) {
            loadProjectContent(projectId);
        }
    }

    // Add popstate event listener to handle browser navigation
    window.addEventListener('popstate', function(event) {
        if (window.location.pathname.includes('projects.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('id');
            if (projectId) {
                loadProjectContent(projectId);
            }
        }
    });
});