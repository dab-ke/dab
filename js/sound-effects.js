// Sound Effects Manager (no UI toggle)
class SoundEffectsManager {
    constructor() {
        this.hoverSound = null; // camera-tap.mp3
        this.clickSound = null; // camera-click.mp3
        this.captureSound = null; // camera-capture.mp3
        this.volume = 0.5; // Default volume (50%)

        this.init();
    }

    init() {
        this.createAudioElements();
        this.addEventListeners();
    }

    createAudioElements() {
        // Hover: tap
        this.hoverSound = new Audio('sounds/camera-tap.mp3');
        this.hoverSound.volume = this.volume;
        this.hoverSound.preload = 'auto';

        // Click: click
        this.clickSound = new Audio('sounds/camera-click.mp3');
        this.clickSound.volume = this.volume;
        this.clickSound.preload = 'auto';

        // Navigation between pages: capture
        this.captureSound = new Audio('sounds/camera-capture.mp3');
        this.captureSound.volume = this.volume;
        this.captureSound.preload = 'auto';
    }

    addEventListeners() {
        // Interactive elements
        const interactiveSelector = `
            a,
            button,
            .project-thumbnail,
            .slider-img,
            .theme-toggle,
            .image img,
            .social-links a,
            .btn,
            input[type="submit"],
            .checkbox
        `;

        const interactiveElements = document.querySelectorAll(interactiveSelector);

        // Hover → tap
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });

        // Click handling
        document.addEventListener('click', (event) => {
            const target = event.target;
            const anchor = target.closest('a');

            // If navigating between index.html and projects.html → play capture and navigate after a short delay
            if (anchor && this.isInternalPageTransition(anchor)) {
                event.preventDefault();
                this.playCaptureSound();
                const href = anchor.getAttribute('href');
                // Small delay so the sound is perceptible before navigation
                setTimeout(() => {
                    window.location.href = href;
                }, 180);
                return;
            }

            // Otherwise: if clicking a known interactive element → click sound
            if (target.closest(interactiveSelector)) {
                this.playClickSound();
                return;
            }

            // Blank area click (not inside interactive element) → click sound
            this.playClickSound();
        });
    }

    // Determine if an anchor click represents a transition between index and projects pages
    isInternalPageTransition(anchor) {
        const href = (anchor.getAttribute('href') || '').toLowerCase();
        if (!href) return false;

        // Consider these internal page transitions for capture sound
        const goesToProjects = href.startsWith('projects.html');
        const goesToIndex = href === 'index.html' || href === './index.html' || href === '/index.html';

        // Current page detection
        const current = (location.pathname.split('/').pop() || '').toLowerCase();
        const onIndex = current === '' || current === 'index.html';
        const onProjects = current === 'projects.html';

        // Capture when moving index -> projects or projects -> index
        if (onIndex && goesToProjects) return true;
        if (onProjects && goesToIndex) return true;

        return false;
    }

    playHoverSound() {
        if (!this.hoverSound) return;
        this.hoverSound.currentTime = 0;
        this.hoverSound.play().catch(() => {});
    }

    playClickSound() {
        if (!this.clickSound) return;
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});
    }

    playCaptureSound() {
        if (!this.captureSound) return;
        this.captureSound.currentTime = 0;
        this.captureSound.play().catch(() => {});
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.hoverSound) this.hoverSound.volume = this.volume;
        if (this.clickSound) this.clickSound.volume = this.volume;
        if (this.captureSound) this.captureSound.volume = this.volume;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const soundManager = new SoundEffectsManager();
    window.soundManager = soundManager;
});
