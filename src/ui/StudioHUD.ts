import { DEPARTMENTS, DepartmentInfo, CRETA_STUDIO_INFO } from '../data/studioData';
import { CameraController, NavigationMode } from '../three/CameraController';
import { audioEngine } from '../audio/AudioEngine';

export class StudioHUD {
  private element: HTMLElement;
  private cameraCtrl: CameraController;
  private currentDept: DepartmentInfo = DEPARTMENTS[0];
  public onOpenDrawer?: (dept: DepartmentInfo) => void;
  public onOpenContact?: () => void;
  public onToggle2DView?: () => void;
  public onQualityChange?: (quality: 'high' | 'med' | 'low') => void;

  constructor(cameraCtrl: CameraController) {
    this.cameraCtrl = cameraCtrl;
    this.element = document.createElement('div');
    this.element.className = 'studio-hud';
    this.element.id = 'studioHud';
    document.body.appendChild(this.element);

    this.render();
    this.setupKeyboardShortcuts();
    this.setupMobileControls();
  }

  public updateDepartment(dept: DepartmentInfo) {
    this.currentDept = dept;
    const badgeEl = this.element.querySelector('#hudBadge');
    const titleEl = this.element.querySelector('#hudTitle');
    const taglineEl = this.element.querySelector('#hudTagline');
    const dots = this.element.querySelectorAll('.scene-dot');

    if (badgeEl) badgeEl.textContent = dept.badge;
    if (titleEl) titleEl.textContent = dept.name;
    if (taglineEl) taglineEl.textContent = dept.tagline;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === dept.sceneIndex);
    });

    // Update entrance hero visibility
    const entranceHero = this.element.querySelector('#entranceHero');
    if (entranceHero) {
      entranceHero.classList.toggle('hidden', dept.sceneIndex !== 0);
    }
  }

  public updateProgress(progress: number) {
    const bar = this.element.querySelector('#tourProgressBar') as HTMLElement;
    const text = this.element.querySelector('#tourProgressText');
    const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);
    if (bar) bar.style.width = `${pct}%`;
    if (text) text.textContent = `${pct}% WALKTHROUGH`;
  }

  private render() {
    this.element.innerHTML = `
      <!-- TOP NAVIGATION BAR -->
      <header class="top-nav">
        <div class="nav-brand" id="brandLogo">
          CRETA <span class="gold-accent">MEDIA</span>
          <span class="pulse-dot"></span>
        </div>

        <div class="nav-center-menu">
          <div class="mode-toggle-group">
            <button class="mode-btn ${this.cameraCtrl.mode === 'guided' ? 'active' : ''}" id="btnModeGuided">
              🎬 Guided Tour
            </button>
            <button class="mode-btn ${this.cameraCtrl.mode === 'free' ? 'active' : ''}" id="btnModeFree">
              🕹️ Free Roam (WASD)
            </button>
          </div>

          <div class="department-dropdown-wrap">
            <select class="dept-select" id="deptSelect">
              ${DEPARTMENTS.map((d, i) => `
                <option value="${i}" ${i === this.currentDept.sceneIndex ? 'selected' : ''}>
                  ${d.badge}: ${d.name}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="nav-right-actions">
          <button class="icon-toggle-btn" id="btnAudioToggle" title="Toggle Studio Audio">
            ${audioEngine.getMuted() ? '🔇 Audio Off' : '🔊 Studio Ambience'}
          </button>
          
          <button class="nav-link-btn" id="btn2DView">
            📄 2D Site
          </button>

          <button class="cta-talk-btn" id="btnTopTalk">
            Let's Talk ↗
          </button>
        </div>
      </header>

      <!-- SCENE 01 ENTRANCE HERO HERO OVERLAY -->
      <div class="entrance-hero" id="entranceHero">
        <div class="hero-content">
          <div class="hero-badge">STORIES. MADE TO TRAVEL.</div>
          <h1 class="hero-headline">Enter CRETA MEDIA.<br><span class="gold-text">Virtual Production Studio.</span></h1>
          <p class="hero-description">
            Step inside our virtual production and localisation facility. Discover voice dubbing, video editing, Dolby audio mixing, vertical drama film sets, and generative AI labs in real-time 3D.
          </p>
          <div class="hero-cta-row">
            <button class="hero-enter-btn" id="btnEnterStudio">
              ENTER THE STUDIO ↓
            </button>
            <button class="hero-secondary-btn" id="btnHeroExplore2D">
              Explore Our Services
            </button>
          </div>
        </div>
      </div>

      <!-- BOTTOM CINEMATIC HUD -->
      <footer class="bottom-hud">
        <div class="tour-progress-track" style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.08); overflow: hidden;">
          <div class="tour-progress-bar" id="tourProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #e5b875, #ffdfa9); transition: width 0.15s ease-out;"></div>
        </div>

        <div class="hud-left-info">
          <div class="hud-badge" id="hudBadge">${this.currentDept.badge}</div>
          <h3 class="hud-title" id="hudTitle">${this.currentDept.name}</h3>
          <div class="hud-tagline" id="hudTagline">${this.currentDept.tagline}</div>
        </div>

        <div class="hud-center-action">
          <button class="hud-inspect-btn" id="btnInspectDept">
            <span class="key-hint">E</span> Explore Department Details ↗
          </button>
        </div>

        <div class="hud-right-nav">
          <div class="scene-stepper">
            <span class="tour-progress-text" id="tourProgressText" style="font-family: monospace; font-size: 11px; color: #e5b875; margin-right: 12px; font-weight: bold; letter-spacing: 0.05em;">0% WALKTHROUGH</span>
            <button class="step-btn" id="btnPrevScene" title="Previous Department">←</button>
            <div class="scene-dots-container">
              ${DEPARTMENTS.map((d, i) => `
                <button class="scene-dot ${i === this.currentDept.sceneIndex ? 'active' : ''}" data-index="${i}" title="${d.name}"></button>
              `).join('')}
            </div>
            <button class="step-btn" id="btnNextScene" title="Next Department">→</button>
          </div>
          <div class="hud-controls-hint">
            WASD Walk · Drag Look 360° · E Details
          </div>
        </div>
      </footer>

      <!-- MOBILE VIRTUAL JOYSTICK -->
      <div class="mobile-joystick-zone" id="mobileJoystick">
        <div class="joystick-ring">
          <div class="joystick-knob" id="joystickKnob"></div>
        </div>
        <span class="joystick-hint">Drag to Walk</span>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners() {
    // Mode toggling
    this.element.querySelector('#btnModeGuided')?.addEventListener('click', () => {
      this.cameraCtrl.setMode('guided');
      this.updateModeButtons();
    });

    this.element.querySelector('#btnModeFree')?.addEventListener('click', () => {
      this.cameraCtrl.setMode('free');
      this.updateModeButtons();
    });

    // Department quick jump dropdown
    this.element.querySelector('#deptSelect')?.addEventListener('change', (e) => {
      const idx = parseInt((e.target as HTMLSelectElement).value, 10);
      this.cameraCtrl.setGuidedScene(idx);
    });

    // Audio toggle
    this.element.querySelector('#btnAudioToggle')?.addEventListener('click', () => {
      const isMuted = audioEngine.toggleMute();
      const btn = this.element.querySelector('#btnAudioToggle');
      if (btn) {
        btn.textContent = isMuted ? '🔇 Audio Off' : '🔊 Studio Ambience';
      }
    });

    // 2D View
    this.element.querySelector('#btn2DView')?.addEventListener('click', () => {
      if (this.onToggle2DView) this.onToggle2DView();
    });

    // Contact
    this.element.querySelector('#btnTopTalk')?.addEventListener('click', () => {
      if (this.onOpenContact) this.onOpenContact();
    });

    // Hero buttons
    this.element.querySelector('#btnEnterStudio')?.addEventListener('click', () => {
      audioEngine.playTransition();
      this.cameraCtrl.nextScene();
    });

    this.element.querySelector('#btnHeroExplore2D')?.addEventListener('click', () => {
      if (this.onToggle2DView) this.onToggle2DView();
    });

    // Department inspection
    this.element.querySelector('#btnInspectDept')?.addEventListener('click', () => {
      if (this.onOpenDrawer) this.onOpenDrawer(this.currentDept);
    });

    // Stepper buttons
    this.element.querySelector('#btnPrevScene')?.addEventListener('click', () => {
      audioEngine.playClick(480);
      this.cameraCtrl.prevScene();
    });

    this.element.querySelector('#btnNextScene')?.addEventListener('click', () => {
      audioEngine.playClick(580);
      this.cameraCtrl.nextScene();
    });

    // Scene dots
    this.element.querySelectorAll('.scene-dot').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).dataset.index!, 10);
        audioEngine.playClick(540);
        this.cameraCtrl.setGuidedScene(idx);
      });
    });
  }

  private updateModeButtons() {
    const btnGuided = this.element.querySelector('#btnModeGuided');
    const btnFree = this.element.querySelector('#btnModeFree');
    if (btnGuided) btnGuided.classList.toggle('active', this.cameraCtrl.mode === 'guided');
    if (btnFree) btnFree.classList.toggle('active', this.cameraCtrl.mode === 'free');
  }

  private setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'e' || e.key === 'E') {
        const activeModal = document.querySelector('.contact-modal-backdrop.open, .gallery-modal-backdrop.open');
        if (!activeModal && this.onOpenDrawer) {
          this.onOpenDrawer(this.currentDept);
        }
      }
    });
  }

  private setupMobileControls() {
    const joystickZone = this.element.querySelector('#mobileJoystick') as HTMLElement;
    const knob = this.element.querySelector('#joystickKnob') as HTMLElement;
    if (!joystickZone || !knob) return;

    let isTouching = false;
    let centerX = 0;
    let centerY = 0;
    const maxRadius = 36;

    joystickZone.addEventListener('touchstart', (e: TouchEvent) => {
      isTouching = true;
      const rect = joystickZone.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
      this.handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY, centerX, centerY, maxRadius, knob);
    }, { passive: false });

    window.addEventListener('touchmove', (e: TouchEvent) => {
      if (!isTouching) return;
      this.handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY, centerX, centerY, maxRadius, knob);
    }, { passive: false });

    const endTouch = () => {
      if (!isTouching) return;
      isTouching = false;
      knob.style.transform = 'translate(0px, 0px)';
      window.dispatchEvent(new CustomEvent('virtual-joystick-end'));
    };

    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);
  }

  private handleJoystickMove(clientX: number, clientY: number, cx: number, cy: number, maxRadius: number, knob: HTMLElement) {
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(maxRadius, dist);
    const angle = Math.atan2(dy, dx);

    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    knob.style.transform = `translate(${nx}px, ${ny}px)`;

    const normX = nx / maxRadius;
    const normY = ny / maxRadius;

    window.dispatchEvent(new CustomEvent('virtual-joystick-move', {
      detail: { x: normX, y: normY }
    }));
  }
}
