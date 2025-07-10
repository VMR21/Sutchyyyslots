/* Open when someone clicks on the span element */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class Particle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 2 + 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y -= this.speedY;
    if (this.size > 0.2) this.size -= 0.01;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
const particlesArray = [];
let spawnCounter = 0;

function spawnParticles() {
  if (spawnCounter % 10 === 0) {
    const xPos = Math.random() * canvas.width;
    const yPos = canvas.height;
    const size = Math.random() * 3 + 1;
    const color = `rgba(124, 58, 237, ${Math.random()})`;
    particlesArray.push(new Particle(xPos, yPos, size, color));
  }
  spawnCounter++;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.size <= 0.2) {
      particlesArray.splice(index, 1);
    }
  });
  spawnParticles();
  requestAnimationFrame(animate);
}
animate();

// Live Status Functionality
let isLive = false;

async function checkLiveStatus() {
    try {
        const response = await fetch('/api/islive');
        const data = await response.json();
        isLive = data.isLive;
        updateLiveButton();
    } catch (error) {
        console.error('Error checking live status:', error);
        isLive = false;
        updateLiveButton();
    }
}

function updateLiveButton() {
    const liveButton = document.getElementById('liveButton');
    if (!liveButton) return;

    const textSpan = liveButton.querySelector('span');
    if (!textSpan) return;

    // Always make it clickable to go to Kick
    liveButton.onclick = () => window.open('https://kick.com/sutchyyyslots', '_blank');

    if (isLive) {
        liveButton.classList.remove('offline');
        liveButton.classList.add('live');
        textSpan.textContent = 'LIVE';
    } else {
        liveButton.classList.remove('live');
        liveButton.classList.add('offline');
        textSpan.textContent = 'OFFLINE';
    }
}

// Navbar scroll functionality
function handleNavbarScroll() {
    const header = document.querySelector('.header-v2');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Copy functionality
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        // Add copied class for animation
        element.classList.add('copied');
        
        // Store original text
        const originalText = element.querySelector('p').textContent;
        const originalIcon = element.querySelector('i').className;
        
        // Update text and icon
        element.querySelector('p').textContent = 'COPIED!';
        element.querySelector('i').className = 'fa-solid fa-check';
        
        // Remove copied class and restore original state after 2 seconds
        setTimeout(() => {
            element.classList.remove('copied');
            element.querySelector('p').textContent = originalText;
            element.querySelector('i').className = originalIcon;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Still show the animation
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 2000);
    });
}

// Initialize copy buttons
function initializeCopyButtons() {
    const copyBoxes = document.querySelectorAll('.copyBox');
    copyBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const textToCopy = box.querySelector('p').textContent;
            copyToClipboard(textToCopy, box);
        });
    });
}

// Scroll Animation Observer
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item'
    );
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Stagger animation for grouped elements
function handleStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.row');
    
    staggerContainers.forEach(container => {
        const staggerItems = container.querySelectorAll('.stagger-item');
        if (staggerItems.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        staggerItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('animate');
                            }, index * 150); // 150ms delay between each item
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2
            });
            
            observer.observe(container);
        }
    });
}

// Check live status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLiveStatus();
    // Check every 30 seconds
    setInterval(checkLiveStatus, 30000);
    
    // Add scroll listener for navbar
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Initialize copy functionality
    initializeCopyButtons();
    
    // Initialize scroll animations
    initScrollAnimations();
    handleStaggerAnimations();
    
    // Trigger hero animations immediately (page load)
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.heroSection .scale-in, .heroSection .fade-in');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate');
            }, index * 200);
        });
    }, 300);
});
