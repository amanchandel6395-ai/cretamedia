import './styles/main.css';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { StudioMaterials } from './three/Materials';
import { StudioEnvironment } from './three/StudioEnvironment';
import { CharacterManager } from './three/CharacterManager';
import { CameraController } from './three/CameraController';
import { InteractionManager } from './three/InteractionManager';
import { StudioHUD } from './ui/StudioHUD';
import { DepartmentDrawer } from './ui/DepartmentDrawer';
import { ClientGalleryModal } from './ui/ClientGalleryModal';
import { ContactModal } from './ui/ContactModal';
import { Accessible2DView } from './ui/Accessible2DView';
import { DEPARTMENTS, DepartmentInfo, PORTFOLIO_PROJECTS } from './data/studioData';
import { audioEngine } from './audio/AudioEngine';

class VirtualStudioApp {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;

  // 3D Scene Systems
  private materials: StudioMaterials;
  private environment: StudioEnvironment;
  private characterManager: CharacterManager;
  private cameraController: CameraController;
  private interactionManager: InteractionManager;

  // UI Layer
  private hud: StudioHUD;
  private drawer: DepartmentDrawer;
  private galleryModal: ClientGalleryModal;
  private contactModal: ContactModal;
  private accessible2DView: Accessible2DView;

  // Atmospheric Dust
  private dustParticles: THREE.Points;
  private dustCount = 140;

  constructor() {
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    this.clock = new THREE.Clock();

    // 1. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      window.innerWidth < 768 ? 72 : 62,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );

    // 2. High-Performance Photorealistic WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.88;
    this.renderer.setClearColor(0x141716, 1);

    // 3. Scene & Physical Environment
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x171b19, 24, 62);

    // Physical RoomEnvironment for authentic PBR reflections on floor, glass, and gold
    const envGen = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = envGen.fromScene(new RoomEnvironment(), 0.04).texture;
    envGen.dispose();

    // Exterior Sky Gradient Dome
    this.setupSkyDome();

    // Studio Lighting (Directional Key Sun + Hemisphere Ambience)
    this.setupLighting();

    // Atmospheric Floating Dust Particles
    this.setupAtmosphere();

    // 4. Construct Complete 3D Studio Architecture
    this.materials = new StudioMaterials();
    this.environment = new StudioEnvironment(this.materials);
    this.scene.add(this.environment.group);

    // 5. Populate Bustling 3D Cast & Production Crew
    this.characterManager = new CharacterManager();
    this.scene.add(this.characterManager.group);
    this.characterManager.loadCharacters('./assets/models/creta-team-character.glb');

    // 6. Camera & Navigation Controller
    this.cameraController = new CameraController(this.camera, canvas);

    // 7. 3D Raycasting & Screen Interaction
    this.interactionManager = new InteractionManager(this.camera, this.environment, canvas);

    // 8. Glassmorphic UI Layer
    this.drawer = new DepartmentDrawer();
    this.galleryModal = new ClientGalleryModal();
    this.contactModal = new ContactModal();
    this.accessible2DView = new Accessible2DView();
    this.hud = new StudioHUD(this.cameraController);

    // 9. Wire Callbacks & Event Hooks
    this.wireCallbacks();

    // 10. Start Video Elements on physical 3D screens
    this.initVideoScreens();

    // 11. Responsive Resize
    window.addEventListener('resize', () => this.onWindowResize());

    // 12. Main 60fps Animation Loop
    this.animate();
  }

  private setupSkyDome() {
    const skyGeo = new THREE.SphereGeometry(85, 32, 20);
    const skyPos = skyGeo.attributes.position;
    const skyColors: number[] = [];
    const skyTop = new THREE.Color(0x28363b);
    const skyHorizon = new THREE.Color(0xb7825d);
    const skyGround = new THREE.Color(0x1e2422);

    for (let i = 0; i < skyPos.count; i++) {
      const h = skyPos.getY(i) / 85;
      const c = h >= 0
        ? skyHorizon.clone().lerp(skyTop, Math.min(1, h * 2.5))
        : skyHorizon.clone().lerp(skyGround, Math.min(1, -h * 3.5));
      skyColors.push(c.r, c.g, c.b);
    }

    skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(skyColors, 3));
    const skyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  private setupLighting() {
    // Soft studio ambient fill
    const hemiLight = new THREE.HemisphereLight(0xfff2dc, 0x202322, 1.25);
    this.scene.add(hemiLight);

    // Directional Sunlight with soft PCF shadow casting
    const sunLight = new THREE.DirectionalLight(0xffe0ad, 2.35);
    sunLight.position.set(-6, 10, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.bias = -0.0003;
    this.scene.add(sunLight);
  }

  private setupAtmosphere() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.dustCount * 3);

    for (let i = 0; i < this.dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = 0.3 + Math.random() * 4.2;
      positions[i * 3 + 2] = -38 + Math.random() * 52;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffdcae,
      size: 0.026,
      transparent: true,
      opacity: 0.32,
      depthWrite: false
    });

    this.dustParticles = new THREE.Points(geo, mat);
    this.scene.add(this.dustParticles);
  }

  private initVideoScreens() {
    // Attempt playback of all physical 3D video screen textures
    this.environment.videoScreens.forEach(s => {
      s.video.play().catch(() => {
        // Autoplay policy handled gracefully
      });
    });

    // Unmute or start playback on first user gesture
    const unlockMedia = () => {
      this.environment.videoScreens.forEach(s => {
        s.video.play().catch(() => {});
      });
      window.removeEventListener('pointerdown', unlockMedia);
      window.removeEventListener('keydown', unlockMedia);
    };
    window.addEventListener('pointerdown', unlockMedia, { once: true });
    window.addEventListener('keydown', unlockMedia, { once: true });
  }

  private wireCallbacks() {
    // Continuous Tour Scroll Progress
    this.cameraController.onProgressChange = (progress: number) => {
      this.hud.updateProgress(progress);
    };

    // Guided Tour / Free Roam scene change
    this.cameraController.onSceneChange = (dept: DepartmentInfo) => {
      this.hud.updateDepartment(dept);
      audioEngine.playTransition();

      // Ensure appropriate in-scene video is playing
      this.environment.videoScreens.forEach(s => {
        if (s.video.paused) {
          s.video.play().catch(() => {});
        }
      });
    };

    // 3D Screen Click: Open Department Drawer or Project Modal
    this.interactionManager.onSelectDepartment = (dept: DepartmentInfo) => {
      audioEngine.playHover();
      this.cameraController.setGuidedScene(dept.sceneIndex);
      this.drawer.open(dept);
    };

    this.interactionManager.onSelectProject = (projectId: string) => {
      audioEngine.playHover();
      const proj = PORTFOLIO_PROJECTS.find(p => p.id === projectId);
      if (proj) {
        this.galleryModal.open(proj);
      }
    };

    // HUD inspect button opens drawer
    this.hud.onOpenDrawer = (dept: DepartmentInfo) => {
      this.drawer.open(dept);
    };

    // HUD top talk button opens contact modal
    this.hud.onOpenContact = () => {
      this.contactModal.open('General Studio Enquiry');
    };

    // HUD 2D View button toggles accessible view
    this.hud.onToggle2DView = () => {
      if (this.accessible2DView.isVisible()) {
        this.accessible2DView.close();
      } else {
        this.accessible2DView.open();
      }
    };

    // Drawer "Start a Project" button
    this.drawer.onStartProject = (dept: DepartmentInfo) => {
      this.contactModal.open(`Project with ${dept.name}`, `We would like to collaborate with CRETA MEDIA's ${dept.name} department.`);
    };

    // Gallery Modal "Request Similar Quote"
    this.galleryModal.onRequestQuote = (project) => {
      this.contactModal.open(`Quote for ${project.title}`, `We are interested in a production similar to ${project.title} for ${project.client}.`);
    };

    // 2D View jump to 3D department
    this.accessible2DView.onJumpTo3DDepartment = (sceneIndex: number) => {
      this.cameraController.setGuidedScene(sceneIndex);
    };
  }

  private onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.fov = width < 768 ? 72 : 62;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // 1. Update Camera Navigation (Guided Tour GSAP or Free Roam WASD + Mouse Look)
    this.cameraController.update(delta);

    // 2. Update Studio Environment dynamic elements (Globe, Arcs, Soundfield, AI Bust, Dolly, Doors)
    this.environment.update(delta, elapsed, this.cameraController.currentProgress);

    // 3. Update 3D Team Cast (Articulated breathing & natural gestures)
    this.characterManager.update(delta);

    // 4. Floating Atmospheric Dust Particles
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < this.dustCount; i++) {
        let y = pos.getY(i);
        y += Math.sin(elapsed * 0.45 + i) * 0.0016;
        if (y > 4.6) y = 0.4;
        if (y < 0.4) y = 4.6;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // 5. Render Full 3D Scene
    this.renderer.render(this.scene, this.camera);
  };
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new VirtualStudioApp();
});
