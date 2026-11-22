# CRETA MEDIA — Immersive 3D Virtual Production Studio

> **"Stories. Made to Travel."**  
> An end-to-end audio-video production and localisation company serving OTT platforms, entertainment studios, brands and creators worldwide.

---

## 🌟 Executive Overview

This repository contains the complete, photorealistic, interactive 3D virtual production facility for **CRETA MEDIA**. Unlike static websites or 2D image carousels, this application renders a real-time, interactive 3D studio world where visitors physically enter the facility, explore operational production departments, watch animated 3D personnel working, and discover production workflows and client case studies through visual storytelling.

---

## 🏢 Studio Architecture & 10 Immersive Scenes

The facility is modeled across a 38-meter physical coordinate layout with authentic architectural acoustics, warm amber lighting (`#e5b875`), and PBR materials:

1. **Scene 01 — Exterior & Grand Entrance (`Z: +14m` to `+8.5m`)**:
   - Modern architectural facade with illuminated 3D CRETA MEDIA signage.
   - Landscaped approach with ficus planters and architectural canopy.
   - Animated glass sliding doors that open dynamically as the visitor approaches.
   - Direct access to *Enter the Studio* or explore 2D services.

2. **Scene 02 — Reception & Welcome Lounge (`Z: +8.5m` to `+1m`)**:
   - Curved walnut reception desk with brushed gold trim.
   - Backlit feature wall with illuminated 3D gold CRETA lettering.
   - Animated receptionist managing production itineraries.
   - Client lounge seating, coffee table, and architectural ficus greenery.

3. **Scene 03 — Dubbing & Voice-Over Studio (`X: -7m`, `Z: -6m` to `0m`)**:
   - Soundproof double-glazed acoustic booth with foam bass traps.
   - Studio condenser mic stand, gold capsule, pop filter, and headphones.
   - Animated voice artist recording dialogue inside the booth.
   - Dubbing control desk with Avid Pro Tools setup and live recording screen.
   - Glowing "● RECORDING / ON AIR" indicator.

4. **Scene 04 — Video Editing & Post-Production Suite (`X: +7m`, `Z: -6m` to `0m`)**:
   - Dim cinematic post-production suite with dual editing workstations.
   - Dual ultrawide curved displays rendering DaVinci / NLE timelines and Lumetri color wheels.
   - Animated video editors and post-production supervisor reviewing cuts.
   - Client review OLED display with live vertical drama editing video.

5. **Scene 05 — Audio Mixing & Mastering Suite (`X: -7m`, `Z: -14m` to `-8m`)**:
   - High-end mastering control room acoustically tuned to EBU R128 (-14.0 LUFS).
   - Large Avid S6 style digital mixing console with real-time VU level meters and faders.
   - Genelec midfield reference monitors on decoupled stands.
   - Back-wall quadratic wooden acoustic diffusers.
   - Animated senior sound engineer automating mix stems.

6. **Scene 06 — Scriptwriting & Translation Hub (`X: +7m`, `Z: -14m` to `-8m`)**:
   - Collaborative wooden writers' table with laptops.
   - Large wall-mounted Transcreation & Localisation Hub screen displaying original English screenplay alongside Hindi/regional transcreations.
   - Magnetic storyboard wall with episode beat outlines.
   - Animated screenwriters and localisation specialists.

7. **Scene 07 — Film & Commercial Production Floor (`X: -7m`, `Z: -24m` to `-16m`)**:
   - Seamless green screen cyclorama curve.
   - Professional cinema camera rig on tracking tripod with matte box.
   - Aputure 600d softbox lighting on C-stands with warm key illumination.
   - Director's mobile monitor playing live vertical drama on-set footage.
   - Animated camera operator and film director.

8. **Scene 08 — AI Production Lab (`X: +7m`, `Z: -24m` to `-16m`)**:
   - Futuristic yet functional high-tech generative video command station.
   - Multi-display panoramic monitors with AI prompt parameters, LoRA weights, and frame grids.
   - Server rack towers with pulsating cyan status illumination.
   - In-world auxiliary monitor showing AI generation workflow loops.
   - Animated AI creative technologist iterating shot consistency.

9. **Scene 09 — Client Experience Gallery (`Z: -31m` to `-25m`)**:
   - Central grand corridor gallery with illuminated gold-framed digital wall screens.
   - Interactive showcases for Pocket FM, Kuku FM, ReelShort, DramaBox, TVCs, and AI films.
   - Clicking any screen triggers an interactive zoom and case study breakdown with video showreel playback.

10. **Scene 10 — Executive Boardroom & Consultation Lounge (`Z: -39m` to `-33m`)**:
    - Soundproof glass-enclosed collaboration space.
    - Executive walnut conference table with leather chairs.
    - 85" Ultra-HD presentation screen with *"LET'S CREATE SOMETHING TOGETHER"*.
    - Interactive direct project inquiry terminal.

---

## 🎮 Dual Navigation System

- **🎬 Guided Tour Mode**:
  - Smooth cinematic camera travel between departments.
  - Stepper controls (`← Previous`, `Next →`), quick-jump scene dropdown, and scene dots.
  - Automatic dynamic door opening and camera orientation.
- **🕹️ Free Roam Mode**:
  - **W / A / S / D** or Arrow Keys: Walk forward, backward, and strafe.
  - **Mouse Drag**: 360-degree first-person camera look.
  - **E Key / Click**: Inspect department or interact with wall screens.
  - **ESC Key**: Close any open drawer or modal.
  - Built-in collision boundary keeping visitor safely within studio architecture.
  - Virtual Touch Joystick for mobile devices.

---

## 🔊 Immersive Spatial Audio Engine

- Procedural Web Audio API soundscape (zero external audio dependencies):
  - Ambient studio air circulation and low-frequency room acoustics (54Hz).
  - Subtle interactive click and transition cues.
  - **Muted by default** with a persistent top navigation toggle.

---

## ♿ 2D Accessible Mode Fallback

- Accessible directly via the **"📄 2D Site"** top navigation button.
- Comprehensive 2D directory showcasing all 10 departments, services, deliverables, client case studies, and verified contact links.
- Enables instant "View in 3D ↗" jumps back into the virtual world.

---

## 🚀 Quick Start & Development

### Prerequisites
- Node.js `v18+` (tested on Node `v24.22.0`)
- npm `v9+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📦 Deployment

### Pre-built Production ZIP
The root directory includes:
- `creta-virtual-studio-production.zip` (33.4 MB)

This ZIP can be directly dragged and dropped into:
- **Vercel** (Drag & drop or import via GitHub)
- **Netlify** (Drag `dist/` folder to Netlify Drop)
- **Cloudflare Pages** (Upload pre-built assets from `dist/`)

---

## 📞 Studio Contact & Verification

- **Email:** `cretamediaofficial@gmail.com`
- **Phone:** `+91 9068734941`
- **WhatsApp:** [wa.link/mcjxfk](https://wa.link/mcjxfk)
- **Address:** Maheshtala, Batanagar, Kolkata, West Bengal 700141
- **Live Framer Reference:** [https://creta.framer.media](https://creta.framer.media)

---
*Built with Three.js, TypeScript, Vite, and GSAP.*
