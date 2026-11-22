import * as THREE from 'three';

// 100% Photorealistic Studio Departments (Zero Cartoons, Zero Puppets, True Cinematic Realism)
const DEPARTMENTS = [
  {
    id: 'exterior',
    badge: '01 / STUDIO EXTERIOR',
    title: 'CRETA MEDIA Headquarters',
    desc: 'State-of-the-art virtual production facility at dusk. Click Enter or scroll to walk inside.',
    image: './assets/images/creta-studio-hero-concept.png',
    hasVideo: false
  },
  {
    id: 'reception',
    badge: '02 / GRAND ATRIUM & RECEPTION',
    title: 'Welcome to CRETA MEDIA',
    desc: 'Main studio reception with live acoustic dubbing booth on left, 4K color grading suites on right, and collaborative conference at rear.',
    image: './assets/images/creta-interior.png',
    hasVideo: false
  },
  {
    id: 'dubbing',
    badge: '03 / DUBBING & AUDIO STUDIO',
    title: 'Voice Recording & Dubbing Booth',
    desc: 'Acoustic glass isolation suite with Neumann U87 condenser mic, SSL analog console, and live session monitoring in 70+ languages.',
    image: './assets/images/creta-voice-studio.png',
    hasVideo: true,
    videoSrc: './assets/videos/dubbing-session.mp4',
    screen: { x: -3.35, y: -1.05, z: -7.4, w: 2.95, h: 1.65, ry: 0 }
  },
  {
    id: 'editing',
    badge: '04 / VIDEO EDIT & COLOR SUITE',
    title: '4K Post-Production & Color Grading',
    desc: 'Dedicated DaVinci Resolve grading suite with ultrawide OLED reference displays and colorist console.',
    image: './assets/images/creta-edit-suite.png',
    hasVideo: false
  },
  {
    id: 'filmset',
    badge: '05 / FILM & MICRODRAMA STAGE',
    title: 'Live-Action Film & Commercial Stage',
    desc: 'Cinema camera rigs, director field monitor, boom operator, and live actors on production soundstage.',
    image: './assets/images/microdrama-check.png',
    hasVideo: false
  },
  {
    id: 'social',
    badge: '06 / CREATIVE WRITERS & SOCIAL HUB',
    title: 'Storytelling & Vertical Drama Hub',
    desc: 'Collaborative creative team developing original series, hook pacing, transcreation, and mobile release packages.',
    image: './assets/images/creta-social-floor.png',
    hasVideo: false
  }
];

class PhotorealisticStudioTour {
  constructor() {
    this.canvas = document.querySelector('#scene');
    this.viewport = document.querySelector('#viewport');
    this.heroCopy = document.querySelector('#heroCopy');
    this.hud = document.querySelector('.hud');
    this.titleEl = document.querySelector('#title');
    this.labelEl = document.querySelector('#label');
    this.descEl = document.querySelector('#description');
    this.indexEl = document.querySelector('#index');
    this.dotsContainer = document.querySelector('#progress');
    this.navContainer = document.querySelector('#departmentNav');

    this.currentRoomIndex = -1;
    this.targetRoomIndex = -1;
    this.transitionProgress = 0;
    this.textures = {};

    // 3D Camera Interactive Values
    this.camX = 0;
    this.camY = 0;
    this.targetCamX = 0;
    this.targetCamY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.initWebGL();
    this.initSceneRooms();
    this.initAtmosphericParticles();
    this.initHUD();
    this.initInteraction();
    this.switchToRoom(0, false);

    window.addEventListener('resize', () => this.onResize());
    window.cretaTour = this;
    window.switchRoom = (i) => this.switchToRoom(i);
    this.animate(0);
  }

  initWebGL() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(this.viewport.clientWidth, this.viewport.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setClearColor(0x0a0c0b, 1);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      window.innerWidth < 768 ? 64 : 54,
      this.viewport.clientWidth / this.viewport.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 0);
  }

  getRoomTexture(index) {
    if (!this.textures[index]) {
      const dept = DEPARTMENTS[index];
      const tex = this.textureLoader.load(dept.image, () => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      });
      this.textures[index] = tex;
    }
    return this.textures[index];
  }

  initSceneRooms() {
    this.textureLoader = new THREE.TextureLoader();
    this.roomGroups = [];

    DEPARTMENTS.forEach((dept, index) => {
      const group = new THREE.Group();
      group.visible = false;

      // Master 16:9 Photorealistic Studio Backdrop Plane (Width 22.4m, Height 12.6m at Z = -7.5m)
      const planeGeo = new THREE.PlaneGeometry(22.4, 12.6);
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.FrontSide
      });

      const backdrop = new THREE.Mesh(planeGeo, planeMat);
      backdrop.position.set(0, 0, -7.5);
      group.add(backdrop);

      // In-Scene Active 3D Video Screen
      let videoEl = null;
      let videoMesh = null;

      if (dept.hasVideo && dept.videoSrc && dept.screen) {
        videoEl = document.createElement('video');
        videoEl.src = dept.videoSrc;
        videoEl.crossOrigin = 'anonymous';
        videoEl.loop = true;
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.setAttribute('muted', '');
        videoEl.setAttribute('playsinline', '');
        videoEl.setAttribute('webkit-playsinline', '');
        videoEl.preload = 'none';

        const videoTex = new THREE.VideoTexture(videoEl);
        videoTex.colorSpace = THREE.SRGBColorSpace;
        videoTex.minFilter = THREE.LinearFilter;
        videoTex.magFilter = THREE.LinearFilter;

        const screenGeo = new THREE.PlaneGeometry(dept.screen.w, dept.screen.h);
        const screenMat = new THREE.MeshBasicMaterial({
          map: videoTex,
          side: THREE.FrontSide
        });

        videoMesh = new THREE.Mesh(screenGeo, screenMat);
        videoMesh.position.set(dept.screen.x, dept.screen.y, dept.screen.z);
        videoMesh.rotation.y = dept.screen.ry || 0;

        group.add(videoMesh);
      }

      this.scene.add(group);

      this.roomGroups.push({
        group,
        backdrop,
        planeMat,
        videoEl,
        videoMesh,
        dept
      });
    });
  }

  initAtmosphericParticles() {
    const count = 90;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = -7.2 + Math.random() * 6.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffe2b8,
      size: 0.035,
      transparent: true,
      opacity: 0.32,
      depthWrite: false
    });

    this.dust = new THREE.Points(geo, mat);
    this.dustPhases = phases;
    this.scene.add(this.dust);
  }

  initHUD() {
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = '';
      DEPARTMENTS.forEach((d, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', d.badge);
        b.onclick = () => this.switchToRoom(i);
        this.dotsContainer.appendChild(b);
      });
    }

    if (this.navContainer) {
      this.navContainer.innerHTML = '';
      DEPARTMENTS.forEach((d, i) => {
        const b = document.createElement('button');
        b.textContent = d.badge.split('/')[1]?.trim() || d.badge;
        b.onclick = () => this.switchToRoom(i);
        this.navContainer.appendChild(b);
      });
    }

    const enterBtn = document.querySelector('#startTour');
    if (enterBtn) {
      enterBtn.onclick = (e) => {
        e.preventDefault();
        this.switchToRoom(1);
      };
    }

    document.querySelectorAll('[data-turn]').forEach((b) => {
      const dir = b.dataset.turn;
      b.onclick = () => {
        if (dir === 'up' || dir === 'left') {
          this.switchToRoom(Math.max(0, this.currentRoomIndex - 1));
        } else if (dir === 'down' || dir === 'right') {
          this.switchToRoom(Math.min(DEPARTMENTS.length - 1, this.currentRoomIndex + 1));
        }
      };
    });

    const serviceMap = [2, 4, 5, 2, 3, 4, 6, 6, 5];
    document.querySelectorAll('.service').forEach((card, i) => {
      card.style.cursor = 'pointer';
      card.onclick = () => {
        const target = serviceMap[i] || 1;
        this.switchToRoom(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  }

  initInteraction() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.canvas.setPointerCapture(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const normX = (e.clientX - cx) / cx;
      const normY = (e.clientY - cy) / cy;

      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.targetCamX = Math.max(-1.8, Math.min(1.8, this.targetCamX + dx * 0.005));
        this.targetCamY = Math.max(-1.1, Math.min(1.1, this.targetCamY - dy * 0.005));
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      } else {
        // Subtle natural mouse parallax
        this.targetCamX = normX * 0.65;
        this.targetCamY = -normY * 0.45;
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    window.addEventListener('pointercancel', () => {
      this.isDragging = false;
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        this.switchToRoom(Math.min(DEPARTMENTS.length - 1, this.currentRoomIndex + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        this.switchToRoom(Math.max(0, this.currentRoomIndex - 1));
      }
    });

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50 && this.currentRoomIndex === 0) {
        this.switchToRoom(1);
      } else if (scrollY === 0 && this.currentRoomIndex !== 0) {
        this.switchToRoom(0);
      }
    }, { passive: true });
  }

  switchToRoom(index, animate = true) {
    if (index === this.currentRoomIndex && this.transitionProgress >= 1.0) return;

    this.targetRoomIndex = index;
    this.currentRoomIndex = index;

    // Load texture on demand
    const targetRoom = this.roomGroups[index];
    if (targetRoom) {
      if (!targetRoom.planeMat.map) {
        targetRoom.planeMat.map = this.getRoomTexture(index);
        targetRoom.planeMat.needsUpdate = true;
      }
    }

    this.roomGroups.forEach((r, idx) => {
      if (idx === index) {
        r.group.visible = true;
        if (r.videoEl) {
          r.videoEl.play().catch(() => {});
        }
      } else {
        r.group.visible = false;
        if (r.videoEl) {
          r.videoEl.pause();
        }
      }
    });

    const dept = DEPARTMENTS[index];
    if (this.titleEl) this.titleEl.textContent = dept.title;
    if (this.labelEl) {
      this.labelEl.textContent = dept.badge;
      this.labelEl.hidden = false;
    }
    if (this.descEl) this.descEl.textContent = dept.desc;
    if (this.indexEl) this.indexEl.textContent = `${String(index + 1).padStart(2, '0')} — 06`;

    if (this.heroCopy) {
      this.heroCopy.classList.toggle('gone', index !== 0);
    }
    if (this.viewport) {
      this.viewport.classList.toggle('entered', index !== 0);
    }

    if (this.dotsContainer) {
      [...this.dotsContainer.children].forEach((b, i) => b.classList.toggle('active', i === index));
    }
    if (this.navContainer) {
      [...this.navContainer.children].forEach((b, i) => b.classList.toggle('active', i === index));
    }

    this.transitionProgress = animate ? 0 : 1.0;
  }

  onResize() {
    const width = this.viewport.clientWidth;
    const height = this.viewport.clientHeight;
    this.camera.aspect = width / height;
    this.camera.fov = width < 768 ? 64 : 54;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate(time) {
    requestAnimationFrame((t) => this.animate(t));

    // Smooth camera glide
    this.camX += (this.targetCamX - this.camX) * 0.08;
    this.camY += (this.targetCamY - this.camY) * 0.08;

    this.camera.position.x = this.camX;
    this.camera.position.y = this.camY;
    this.camera.position.z = 0;

    // Camera looks slightly toward center with depth parallax
    this.camera.lookAt(this.camX * 0.25, this.camY * 0.25, -7.5);

    // Smooth room entrance flight
    if (this.transitionProgress < 1.0) {
      this.transitionProgress += 0.035;
      const ease = Math.min(1, this.transitionProgress);

      const currentGroup = this.roomGroups[this.currentRoomIndex]?.group;
      if (currentGroup) {
        currentGroup.scale.setScalar(0.94 + 0.06 * ease);
      }
    }

    // Atmospheric floating particles
    if (this.dust) {
      const pos = this.dust.geometry.attributes.position;
      const count = this.dustPhases.length;
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i);
        y += Math.sin(time * 0.001 + this.dustPhases[i]) * 0.0018;
        if (y > 4) y = -4;
        if (y < -4) y = 4;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PhotorealisticStudioTour());
} else {
  new PhotorealisticStudioTour();
}
