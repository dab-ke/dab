# Sound Effects for Dab's Website

This directory contains the audio files for the website's sound effects.

## Required Audio Files

Add these audio files to this directory:

1. **camera-tap.mp3** — Used for hover effects
2. **camera-click.mp3** — Used for general click effects
3. **camera-capture.mp3** — Used when navigating between pages (index.html ↔ projects.html)

## Mapping

- Hover over interactive elements → `camera-tap.mp3`
- Click buttons/links/slider images/blank areas → `camera-click.mp3`
- Open `projects.html` from `index.html` or go back to `index.html` from `projects.html` → `camera-capture.mp3`

## Recommended Specifications

- Format: MP3 (best compatibility)
- Duration: 0.3–1.5 seconds (short and crisp)
- Quality: 128–192 kbps
- Sample Rate: 44.1 kHz

## Sources for Free Camera Sounds

- Freesound.org — search for "camera tap", "camera click", "camera shutter"
- Zapsplat.com — professional sound effects
- SoundBible.com — free sound effects
- YouTube Audio Library — free music and sound effects

## Testing

Use `test-sounds.html` or your live pages:
1. Hover elements → hear tap
2. Click elements → hear click
3. Navigate index.html ↔ projects.html via links → hear capture

## Troubleshooting

If sounds don't play:
1. Check file names and locations
2. Ensure MP3 format
3. Check browser console for errors
4. Some browsers restrict autoplay until user interaction
