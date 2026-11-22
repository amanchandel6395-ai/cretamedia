import * as THREE from 'three';
import { StudioMaterials } from './Materials';
import { ScreenTextureFactory } from './ScreenTextures';

export interface InteractiveScreenTarget {
  mesh: THREE.Mesh;
  departmentId: string;
  title: string;
  type: 'department' | 'project' | 'portal';
  projectId?: string;
  url?: string;
}

export class StudioEnvironment {
  public group: THREE.Group;
  public materials: StudioMaterials;
  public interactiveTargets: InteractiveScreenTarget[] = [];
  public doors: { hinge: THREE.Group; side: number }[] = [];
  public videoScreens: { mesh: THREE.Mesh; video: HTMLVideoElement }[] = [];

  // Dynamic animated 3D components
  private exteriorLights: THREE.SpotLight[] = [];
  private holographicGlobe?: THREE.Group;
  private flightArcs: THREE.Line[] = [];
  private atmosWaveRings: THREE.Mesh[] = [];
  private aiHoloBust?: THREE.Group;
  private cameraDolly?: THREE.Group;
  private splitScreenDivider?: THREE.Mesh;

  constructor(materials: StudioMaterials) {
    this.group = new THREE.Group();
    this.materials = materials;

    this.buildArchitecturalShell();
    this.buildScene01Exterior();
    this.buildScene02Lobby();
    this.buildScene03Dubbing();
    this.buildScene04Localization();
    this.buildScene05VideoEditing();
    this.buildScene06AudioTheater();
    this.buildScene07AiLab();
    this.buildScene08Soundstage();
    this.buildScene09ShowcaseHall();
  }

  /**
   * Main Architectural Shell (38m length x 24m width x 4.8m height)
   */
  private buildArchitecturalShell() {
    // Continuous polished concrete / epoxy floor: runs from Z = +20m (exterior) to Z = -42m (showcase hall)
    const floorGeo = new THREE.PlaneGeometry(26, 62);
    const floor = new THREE.Mesh(floorGeo, this.materials.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -11);
    floor.receiveShadow = true;
    this.group.add(floor);

    // Architectural Acoustic Ceiling with warm recessed fixtures
    const ceilingGeo = new THREE.PlaneGeometry(24, 52);
    const ceiling = new THREE.Mesh(ceilingGeo, this.materials.ceiling);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 4.8, -16);
    this.group.add(ceiling);

    // Left and Right Outer Concrete Walls
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.8, 52), this.materials.wall);
    wallLeft.position.set(-12, 2.4, -16);
    wallLeft.receiveShadow = true;
    this.group.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.8, 52), this.materials.wall);
    wallRight.position.set(12, 2.4, -16);
    wallRight.receiveShadow = true;
    this.group.add(wallRight);

    // Far Back Wall (Z = -42m)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(24.3, 4.8, 0.3), this.materials.darkAcoustic);
    backWall.position.set(0, 2.4, -42);
    this.group.add(backWall);

    // Cross Wooden Beams & Warm Architectural Downlights along the corridor
    for (let z = 6; z >= -40; z -= 3.5) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(23.8, 0.16, 0.2), this.materials.wood);
      beam.position.set(0, 4.72, z);
      this.group.add(beam);

      // Downlights across width
      for (const x of [-8, -4, 0, 4, 8]) {
        const light = new THREE.PointLight(0xffdfba, 6, 6.5, 1.8);
        light.position.set(x, 4.5, z);
        this.group.add(light);

        const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.06, 16), this.materials.gold);
        fixture.position.set(x, 4.75, z);
        this.group.add(fixture);
      }
    }
  }

  /**
   * SCENE 01 — Outside the Building (Night-Time Cinematic Environment)
   * Z = +8.5m to +18m
   */
  private buildScene01Exterior() {
    const extGroup = new THREE.Group();

    // Exterior facade wall with grand portal opening
    const portalLeft = new THREE.Mesh(new THREE.BoxGeometry(9.6, 4.8, 0.35), this.materials.wall);
    portalLeft.position.set(-7.2, 2.4, 8.5);
    extGroup.add(portalLeft);

    const portalRight = new THREE.Mesh(new THREE.BoxGeometry(9.6, 4.8, 0.35), this.materials.wall);
    portalRight.position.set(7.2, 2.4, 8.5);
    extGroup.add(portalRight);

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 0.35), this.materials.wall);
    lintel.position.set(0, 4.2, 8.5);
    extGroup.add(lintel);

    // Illuminated 3D Exterior Signage: CRETA MEDIA
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 256;
    const ctx = signCanvas.getContext('2d')!;
    ctx.fillStyle = '#101413';
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = '#e5b875';
    ctx.font = 'bold 96px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CRETA MEDIA', 512, 120);
    ctx.fillStyle = '#c5a88c';
    ctx.font = '32px "Segoe UI", sans-serif';
    ctx.fillText('STORIES. MADE TO TRAVEL.', 512, 185);

    const signTex = new THREE.CanvasTexture(signCanvas);
    signTex.colorSpace = THREE.SRGBColorSpace;
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5.0, 1.25),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    signMesh.position.set(0, 4.15, 8.7);
    extGroup.add(signMesh);

    // Warm entrance architectural canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.14, 2.4), this.materials.darkAcoustic);
    canopy.position.set(0, 3.65, 9.6);
    extGroup.add(canopy);

    const canopyTrim = new THREE.Mesh(new THREE.BoxGeometry(5.82, 0.05, 0.05), this.materials.gold);
    canopyTrim.position.set(0, 3.65, 10.8);
    extGroup.add(canopyTrim);

    const canopyLight = new THREE.PointLight(0xffd59e, 18, 10);
    canopyLight.position.set(0, 3.5, 9.8);
    extGroup.add(canopyLight);

    // Moving Sky Spotlight Beams
    for (const x of [-6, 6]) {
      const spot = new THREE.SpotLight(0xe5b875, 45, 30, Math.PI / 7, 0.4, 1.5);
      spot.position.set(x, 0.2, 14);
      spot.target.position.set(x * 0.3, 10, 5);
      extGroup.add(spot);
      extGroup.add(spot.target);
      this.exteriorLights.push(spot);

      const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.4, 16), this.materials.metalBlack);
      fixture.position.set(x, 0.2, 14);
      extGroup.add(fixture);
    }

    // Ground-Level Atmospheric Fog Planes
    for (let i = 0; i < 4; i++) {
      const fogPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 2.2),
        new THREE.MeshBasicMaterial({
          color: 0x222a27,
          transparent: true,
          opacity: 0.18 - i * 0.03,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      fogPlane.position.set((i % 2 === 0 ? -1 : 1) * 1.5, 0.4 + i * 0.3, 11 + i * 1.8);
      extGroup.add(fogPlane);
    }

    // Automatic Sliding Glass Entrance Doors
    for (const side of [-1, 1]) {
      const hinge = new THREE.Group();
      hinge.position.set(side * 1.25, 0, 8.5);

      const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.25, 3.5, 0.06), this.materials.glass);
      doorLeaf.position.set(side * -0.625, 1.75, 0);
      hinge.add(doorLeaf);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.5, 0.08), this.materials.gold);
      frame.position.set(side * -0.05, 1.75, 0);
      hinge.add(frame);

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), this.materials.gold);
      handle.position.set(side * -0.2, 1.6, 0.06);
      hinge.add(handle);

      extGroup.add(hinge);
      this.doors.push({ hinge, side });
    }

    // Exterior Architectural Planters with Greenery
    for (const x of [-4.8, 4.8]) {
      const planter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 3.0), this.materials.wood);
      planter.position.set(x, 0.3, 11.5);
      extGroup.add(planter);

      for (let j = 0; j < 3; j++) {
        const bush = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.45, 1),
          new THREE.MeshStandardMaterial({ color: j % 2 === 0 ? 0x243e2e : 0x2e4f3a, roughness: 0.85 })
        );
        bush.position.set(x + (j % 2 ? 0.15 : -0.15), 0.85, 10.5 + j * 0.95);
        extGroup.add(bush);
      }
    }

    this.group.add(extGroup);
  }

  /**
   * SCENE 02 — Glass Entrance Doors & Reception Lobby
   * Z = +1.5m to +8m
   * Authentic Client Plaques (Bluesky Ventures Dubai, Pran Food, Brightsun Canada)
   */
  private buildScene02Lobby() {
    const lobbyGroup = new THREE.Group();

    // Curved Reception Desk (X = 0, Z = +3.0m)
    const desk = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 1.15, 32, 1, false, 0, Math.PI), this.materials.wood);
    desk.position.set(0, 0.58, 3.0);
    desk.rotation.y = Math.PI / 2;
    lobbyGroup.add(desk);

    const deskTop = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.08, 32, 1, false, 0, Math.PI), this.materials.gold);
    deskTop.position.set(0, 1.18, 3.0);
    deskTop.rotation.y = Math.PI / 2;
    lobbyGroup.add(deskTop);

    // Receptionist dual workstation monitors
    this.createMonitorSetup(lobbyGroup, 0, 1.25, 2.4, 0, 'reception');

    // Behind-the-desk Feature Wall with Vertical Wooden Acoustic Fins (Z = 0.5m)
    const logoWall = new THREE.Mesh(new THREE.BoxGeometry(6.6, 3.8, 0.25), this.materials.darkAcoustic);
    logoWall.position.set(0, 1.9, 0.5);
    lobbyGroup.add(logoWall);

    for (let x = -3.1; x <= 3.1; x += 0.38) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.6, 0.1), this.materials.wood);
      fin.position.set(x, 1.9, 0.65);
      lobbyGroup.add(fin);
    }

    // Glowing Gold CRETA Letters Plaque
    const wallLogoCanvas = document.createElement('canvas');
    wallLogoCanvas.width = 1024;
    wallLogoCanvas.height = 256;
    const lctx = wallLogoCanvas.getContext('2d')!;
    lctx.fillStyle = '#101413';
    lctx.fillRect(0, 0, 1024, 256);
    lctx.fillStyle = '#e5b875';
    lctx.font = 'bold 110px "Segoe UI", sans-serif';
    lctx.textAlign = 'center';
    lctx.fillText('C R E T A', 512, 135);
    lctx.fillStyle = '#ffffff';
    lctx.font = '26px "Segoe UI", sans-serif';
    lctx.fillText('AUDIO-VIDEO PRODUCTION & LOCALISATION HEADQUARTERS', 512, 195);

    const logoPlaque = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 0.9),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(wallLogoCanvas) })
    );
    logoPlaque.position.set(0, 2.65, 0.72);
    lobbyGroup.add(logoPlaque);

    const logoLight = new THREE.PointLight(0xffca7a, 14, 5.5);
    logoLight.position.set(0, 2.65, 1.1);
    lobbyGroup.add(logoLight);

    // AUTHENTIC CLIENT RECOGNITION PLAQUE WALL (Right Wall: X = +5.5m, Z = +4.5m)
    const clientPlaqueCanvas = document.createElement('canvas');
    clientPlaqueCanvas.width = 1024;
    clientPlaqueCanvas.height = 640;
    const cctx = clientPlaqueCanvas.getContext('2d')!;
    cctx.fillStyle = '#121716';
    cctx.fillRect(0, 0, 1024, 640);

    cctx.fillStyle = '#e5b875';
    cctx.font = 'bold 36px "Segoe UI", sans-serif';
    cctx.fillText('GLOBAL PRODUCTION PARTNERS & MILESTONES', 40, 70);

    cctx.strokeStyle = '#e5b875';
    cctx.lineWidth = 3;
    cctx.beginPath();
    cctx.moveTo(40, 95);
    cctx.lineTo(984, 95);
    cctx.stroke();

    const verifiedClients = [
      { name: 'David Dubai', company: 'Bluesky Ventures', role: 'Global Partner' },
      { name: 'Pran Food Limited', company: 'Pran Group', role: 'Corporate Media' },
      { name: 'Gaggi Canada', company: 'Brightsun', role: 'Media Lead' }
    ];

    verifiedClients.forEach((vc, idx) => {
      const y = 160 + idx * 95;
      cctx.fillStyle = '#1a2220';
      cctx.beginPath();
      cctx.roundRect(40, y - 35, 944, 75, 8);
      cctx.fill();

      cctx.fillStyle = '#ffffff';
      cctx.font = 'bold 28px "Segoe UI", sans-serif';
      cctx.fillText(vc.name, 60, y + 5);

      cctx.fillStyle = '#e5b875';
      cctx.font = '24px "Segoe UI", sans-serif';
      cctx.fillText(`• ${vc.company}`, 320, y + 5);

      cctx.fillStyle = '#8ea49d';
      cctx.font = 'italic 20px "Segoe UI", sans-serif';
      cctx.fillText(vc.role, 720, y + 5);
    });

    // Studio Real Metrics
    cctx.fillStyle = '#e5b875';
    cctx.font = 'bold 28px "Segoe UI", sans-serif';
    cctx.fillText('6+ Years  ·  400+ Delivered  ·  300+ Clients  ·  70+ Languages', 60, 580);

    const clientPlaqueMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 2.0),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(clientPlaqueCanvas) })
    );
    clientPlaqueMesh.position.set(5.5, 2.1, 4.5);
    clientPlaqueMesh.rotation.y = -Math.PI / 2;
    lobbyGroup.add(clientPlaqueMesh);

    const plaqueFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.1, 3.3), this.materials.gold);
    plaqueFrame.position.set(5.52, 2.1, 4.5);
    lobbyGroup.add(plaqueFrame);

    // Client Lounge Sofa & Table on Left
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 0.95), this.materials.darkAcoustic);
    sofa.position.set(-4.5, 0.35, 4.2);
    lobbyGroup.add(sofa);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 0.25), this.materials.wood);
    sofaBack.position.set(-4.5, 0.7, 4.6);
    lobbyGroup.add(sofaBack);

    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.8), this.materials.wood);
    coffeeTable.position.set(-4.5, 0.2, 2.8);
    lobbyGroup.add(coffeeTable);

    this.createIndoorPlant(lobbyGroup, -5.4, 6.2);
    this.createIndoorPlant(lobbyGroup, 5.4, 2.4);

    this.registerInteractiveTarget(lobbyGroup, 'lobby', 'Lobby & Glass Entrance Portal', [0, 1.5, 3.0]);
    this.group.add(lobbyGroup);
  }

  /**
   * SCENE 03 — Dubbing Department
   * Left Side: X = -7.5m, Z = -3.2m
   * Microphones, acoustic panels, recording booths, waveform screens, multilingual voice production
   */
  private buildScene03Dubbing() {
    const dubGroup = new THREE.Group();

    // Soundproof Glass Isolation Enclosure (4.5m x 5.0m)
    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 4.8), this.materials.glass);
    glassFront.position.set(-4.8, 1.8, -3.2);
    dubGroup.add(glassFront);

    const glassBack = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.6, 0.12), this.materials.darkAcoustic);
    glassBack.position.set(-7.4, 1.8, -5.6);
    dubGroup.add(glassBack);

    // Acoustic Foam Wedge Basstraps on inner isolation booth walls
    for (let y = 1.0; y <= 3.2; y += 0.85) {
      for (let z = -5.0; z <= -1.5; z += 0.9) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.75), this.materials.foam);
        panel.position.set(-9.8, y, z);
        dubGroup.add(panel);
      }
    }

    // Professional Gold Condenser Microphone on Boom Arm with Pop Filter
    const micStand = new THREE.Group();
    micStand.position.set(-7.5, 0, -3.2);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16), this.materials.metalBlack);
    base.position.y = 0.02;
    micStand.add(base);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), this.materials.chrome);
    pole.position.y = 0.75;
    micStand.add(pole);

    const boomArm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), this.materials.chrome);
    boomArm.rotation.z = Math.PI / 4;
    boomArm.position.set(0.15, 1.45, 0);
    micStand.add(boomArm);

    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 16), this.materials.gold);
    mic.position.set(0.35, 1.65, 0);
    micStand.add(mic);

    const popFilter = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.008, 8, 24), this.materials.metalBlack);
    popFilter.position.set(0.24, 1.65, 0);
    popFilter.rotation.y = Math.PI / 2;
    micStand.add(popFilter);

    // Music stand with multilingual script
    const scriptStand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.02), this.materials.darkAcoustic);
    scriptStand.position.set(0.35, 1.35, 0.2);
    scriptStand.rotation.x = -0.3;
    micStand.add(scriptStand);

    dubGroup.add(micStand);

    // Dubbing Director / Engineer Control Desk (Outside Booth)
    const controlDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 1.1), this.materials.wood);
    controlDesk.position.set(-3.4, 0.38, -3.2);
    dubGroup.add(controlDesk);

    // Live Video Monitor playing dubbing session video
    this.createVideoMonitor(dubGroup, -3.4, 0.95, -3.4, './assets/videos/dubbing-session.mp4', 'dubbing');

    // "● RECORDING / ON AIR" illuminated indicator box
    const onAirCanvas = document.createElement('canvas');
    onAirCanvas.width = 512;
    onAirCanvas.height = 128;
    const actx = onAirCanvas.getContext('2d')!;
    actx.fillStyle = '#0f1110';
    actx.fillRect(0, 0, 512, 128);
    actx.fillStyle = '#ff3333';
    actx.font = 'bold 56px sans-serif';
    actx.textAlign = 'center';
    actx.fillText('● RECORDING', 256, 84);

    const onAir = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.22),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(onAirCanvas) })
    );
    onAir.position.set(-4.7, 3.2, -3.2);
    onAir.rotation.y = Math.PI / 2;
    dubGroup.add(onAir);

    this.registerInteractiveTarget(dubGroup, 'dubbing', 'Dubbing Department', [-5.5, 1.6, -3.2]);
    this.group.add(dubGroup);
  }

  /**
   * SCENE 04 — Localization Department
   * Central Holographic Hub: X = 0, Z = -9.5m
   * 3D rotating world map, language pipelines, subtitles, translation systems, international content distribution
   */
  private buildScene04Localization() {
    const locGroup = new THREE.Group();

    // Central circular elevated dais (radius 2.8m, height 0.15m)
    const dais = new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 2.9, 0.15, 32),
      this.materials.darkAcoustic
    );
    dais.position.set(0, 0.08, -9.5);
    locGroup.add(dais);

    const daisRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.85, 0.04, 16, 64),
      this.materials.gold
    );
    daisRing.rotation.x = Math.PI / 2;
    daisRing.position.set(0, 0.16, -9.5);
    locGroup.add(daisRing);

    // 3D ROTATING HOLOGRAPHIC WORLD SPHERE
    this.holographicGlobe = new THREE.Group();
    this.holographicGlobe.position.set(0, 1.85, -9.5);

    // Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(1.25, 24, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4a90e2,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const globeSphere = new THREE.Mesh(sphereGeo, wireMat);
    this.holographicGlobe.add(globeSphere);

    // Latitude & Longitude glow rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.26, 0.015, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0xe5b875, transparent: true, opacity: 0.8 })
    );
    ring1.rotation.x = Math.PI / 2;
    this.holographicGlobe.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.26, 0.015, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.8 })
    );
    ring2.rotation.y = Math.PI / 3;
    this.holographicGlobe.add(ring2);

    // Glowing Node Points on Major Localization Hubs
    const hubs = [
      { name: 'Kolkata/Delhi (HQ)', pos: [0.3, 0.4, 1.1] },
      { name: 'Dubai', pos: [0.7, 0.5, 0.9] },
      { name: 'Toronto', pos: [-0.6, 0.7, 0.8] },
      { name: 'London', pos: [-0.1, 0.8, 0.9] },
      { name: 'Tokyo', pos: [1.0, 0.6, 0.4] }
    ];

    hubs.forEach(h => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffe29a })
      );
      node.position.set(...(h.pos as [number, number, number]));
      this.holographicGlobe!.add(node);
    });

    // GLOWING FLIGHT ARCS (Connecting Hubs across the globe)
    for (let i = 0; i < hubs.length - 1; i++) {
      const p1 = new THREE.Vector3(...(hubs[0].pos as [number, number, number]));
      const p2 = new THREE.Vector3(...(hubs[i + 1].pos as [number, number, number]));
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(1.55);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(24);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xe5b875 : 0x00d2ff,
        transparent: true,
        opacity: 0.75
      });
      const arc = new THREE.Line(arcGeo, arcMat);
      this.holographicGlobe.add(arc);
      this.flightArcs.push(arc);
    }

    locGroup.add(this.holographicGlobe);

    // Central Up-Spotlight through the Hologram
    const holoLight = new THREE.PointLight(0x00d2ff, 16, 7);
    holoLight.position.set(0, 1.85, -9.5);
    locGroup.add(holoLight);

    // Multi-Language Floating Status Display Panels (Left & Right)
    const locTex = ScreenTextureFactory.createLocalizationScreen();
    const locScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 1.7),
      new THREE.MeshBasicMaterial({ map: locTex })
    );
    locScreen.position.set(-2.8, 1.9, -10.2);
    locScreen.rotation.y = 0.35;
    locGroup.add(locScreen);

    // Script & Subtitle Conform Display on other side
    const subTex = ScreenTextureFactory.createLocalizationScreen();
    const subScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 1.7),
      new THREE.MeshBasicMaterial({ map: subTex })
    );
    subScreen.position.set(2.8, 1.9, -10.2);
    subScreen.rotation.y = -0.35;
    locGroup.add(subScreen);

    this.registerInteractiveTarget(locGroup, 'localization', 'Localization Department', [0, 1.8, -9.5]);
    this.group.add(locGroup);
  }

  /**
   * SCENE 05 — Video Editing Bay
   * Right Side: X = +7.5m, Z = -14.5m
   * Editors working, cinematic timelines, motion graphics screens, before/after transitions, color grading monitors
   */
  private buildScene05VideoEditing() {
    const editGroup = new THREE.Group();

    // Dark cinematic suite divider
    const wallDiv = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.8, 6.0), this.materials.darkAcoustic);
    wallDiv.position.set(4.5, 1.9, -14.5);
    editGroup.add(wallDiv);

    // Master Editing & Color Grading Desk (X = 7.5m, Z = -14.5m)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.74, 1.2), this.materials.darkAcoustic);
    desk.position.set(7.5, 0.37, -14.5);
    editGroup.add(desk);

    // Dual Ultrawide curved screens with authentic DaVinci NLE canvas texture
    const nleTex = ScreenTextureFactory.createNleScreen();
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.75),
      new THREE.MeshBasicMaterial({ map: nleTex })
    );
    screenMesh.position.set(7.5, 1.25, -14.8);
    screenMesh.rotation.y = -Math.PI / 2;
    editGroup.add(screenMesh);

    // DaVinci Resolve Style Hardware Colorist Console Surface with 3 trackballs
    const consolePanel = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.9), this.materials.metalBlack);
    consolePanel.position.set(7.2, 0.77, -14.5);
    editGroup.add(consolePanel);

    for (const dz of [-0.25, 0, 0.25]) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), this.materials.gold);
      ball.position.set(7.2, 0.8, -14.5 + dz);
      editGroup.add(ball);
    }

    // BEFORE / AFTER SPLIT COLOR GRADING MONITOR (Mounted on Back Wall)
    const splitCanvas = document.createElement('canvas');
    splitCanvas.width = 1024;
    splitCanvas.height = 576;
    const sctx = splitCanvas.getContext('2d')!;

    // Left Half: Flat Log Footage (Muted desaturated grey-green)
    sctx.fillStyle = '#3a4440';
    sctx.fillRect(0, 0, 512, 576);
    sctx.fillStyle = '#8ea49d';
    sctx.font = 'bold 24px monospace';
    sctx.fillText('CAMERA RAW / S-LOG3', 40, 50);

    // Right Half: Rich 4K HDR Graded (ACEScct Film Emulation)
    const gGrad = sctx.createLinearGradient(512, 0, 1024, 576);
    gGrad.addColorStop(0, '#c76e3b');
    gGrad.addColorStop(0.5, '#4a2c1f');
    gGrad.addColorStop(1, '#0e1d24');
    sctx.fillStyle = gGrad;
    sctx.fillRect(512, 0, 512, 576);
    sctx.fillStyle = '#e5b875';
    sctx.font = 'bold 24px monospace';
    sctx.fillText('4K HDR MASTER / ACES', 560, 50);

    // Center divider line
    sctx.strokeStyle = '#ffffff';
    sctx.lineWidth = 4;
    sctx.beginPath();
    sctx.moveTo(512, 0);
    sctx.lineTo(512, 576);
    sctx.stroke();

    const splitTex = new THREE.CanvasTexture(splitCanvas);
    splitTex.colorSpace = THREE.SRGBColorSpace;
    const splitScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 1.35),
      new THREE.MeshBasicMaterial({ map: splitTex })
    );
    splitScreen.position.set(11.8, 2.2, -14.5);
    splitScreen.rotation.y = -Math.PI / 2;
    editGroup.add(splitScreen);

    // Live In-Suite Video Monitor running editing session
    this.createVideoMonitor(editGroup, 4.8, 1.4, -14.5, './assets/videos/editing-session.mp4', 'editing', -Math.PI / 2);

    this.createErgonomicChair(editGroup, 6.4, -14.5, Math.PI / 2);

    this.registerInteractiveTarget(editGroup, 'editing', 'Video Editing Bay', [6.8, 1.6, -14.5]);
    this.group.add(editGroup);
  }

  /**
   * SCENE 06 — Audio Mixing Theater
   * Left Side: X = -7.5m, Z = -19.5m
   * Dolby Atmos style environment, surround sound speakers, cinematic audio visualization, immersive audio production
   */
  private buildScene06AudioTheater() {
    const audioGroup = new THREE.Group();

    // Studio dividing wall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.8, 6.0), this.materials.darkAcoustic);
    wall.position.set(-4.5, 1.9, -19.5);
    audioGroup.add(wall);

    // Large Avid S6 Style Digital Mixing Console
    const consoleTable = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.75, 1.2), this.materials.metalBlack);
    consoleTable.position.set(-7.5, 0.38, -19.5);
    audioGroup.add(consoleTable);

    const dawTex = ScreenTextureFactory.createDawScreen();
    const dawScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.85),
      new THREE.MeshBasicMaterial({ map: dawTex })
    );
    dawScreen.position.set(-7.5, 1.15, -19.8);
    dawScreen.rotation.x = -0.15;
    audioGroup.add(dawScreen);

    // 7.1.4 DOLBY ATMOS SURROUND SOUND SPEAKER ARRAY
    const speakerCoords = [
      // Left, Center, Right Front
      { x: -6.0, y: 1.5, z: -21.5, ry: Math.PI / 3 },
      { x: -7.5, y: 1.7, z: -21.8, ry: 0 },
      { x: -9.0, y: 1.5, z: -21.5, ry: -Math.PI / 3 },
      // Surrounds & Rears
      { x: -5.0, y: 1.6, z: -19.5, ry: Math.PI / 2 },
      { x: -10.0, y: 1.6, z: -19.5, ry: -Math.PI / 2 },
      // Overhead 4 Ceiling Elevation Speakers
      { x: -6.2, y: 3.8, z: -18.5, ry: 0, rx: 0.3 },
      { x: -8.8, y: 3.8, z: -18.5, ry: 0, rx: 0.3 },
      { x: -6.2, y: 3.8, z: -20.5, ry: 0, rx: -0.3 },
      { x: -8.8, y: 3.8, z: -20.5, ry: 0, rx: -0.3 }
    ];

    speakerCoords.forEach(sc => {
      const spk = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.52, 0.32), this.materials.metalBlack);
      spk.position.set(sc.x, sc.y, sc.z);
      if (sc.ry) spk.rotation.y = sc.ry;
      if (sc.rx) spk.rotation.x = sc.rx;
      audioGroup.add(spk);

      // Gold woofer cone
      const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.04, 0.04, 16), this.materials.gold);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(sc.x, sc.y - 0.05, sc.z + 0.16);
      audioGroup.add(cone);
    });

    // CINEMATIC AUDIO-REACTIVE SOUNDFIELD RING (Pulsing waves in the room)
    for (let r = 0; r < 3; r++) {
      const waveRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.4 + r * 0.7, 0.025, 12, 48),
        new THREE.MeshBasicMaterial({
          color: r === 1 ? 0xe5b875 : 0x00d2ff,
          transparent: true,
          opacity: 0.75 - r * 0.2
        })
      );
      waveRing.rotation.x = Math.PI / 2;
      waveRing.position.set(-7.5, 2.2, -19.5);
      audioGroup.add(waveRing);
      this.atmosWaveRings.push(waveRing);
    }

    // Wooden Acoustic Quadratic Diffuser on back wall
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 3.4), this.materials.wood);
    diffuser.position.set(-11.8, 1.8, -19.5);
    audioGroup.add(diffuser);

    this.createErgonomicChair(audioGroup, -6.5, -19.5, -Math.PI / 2);

    this.registerInteractiveTarget(audioGroup, 'audio-mixing', 'Audio Mixing Theater', [-7.0, 1.6, -19.5]);
    this.group.add(audioGroup);
  }

  /**
   * SCENE 07 — AI Production Lab
   * Right Side: X = +7.5m, Z = -24.5m
   * AI dubbing, voice cloning, AI localization, AI video generation, real-time content automation
   */
  private buildScene07AiLab() {
    const aiGroup = new THREE.Group();

    // High-Tech Workstations Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.74, 1.2), this.materials.darkAcoustic);
    desk.position.set(7.5, 0.37, -24.5);
    aiGroup.add(desk);

    // Triple Panoramic Displays running AI Lab Screen (Higgsfield, Flow, Kling, Runway, ElevenLabs)
    const aiTex = ScreenTextureFactory.createAiLabScreen();
    const centerScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.85),
      new THREE.MeshBasicMaterial({ map: aiTex })
    );
    centerScreen.position.set(7.5, 1.25, -24.9);
    aiGroup.add(centerScreen);

    // ROTATING 3D HOLOGRAPHIC CHARACTER BUST / WIREFRAME AVATAR
    this.aiHoloBust = new THREE.Group();
    this.aiHoloBust.position.set(7.5, 1.9, -23.5);

    // Hologram Pedestal
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.1, 24), this.materials.gold);
    ped.position.y = -0.45;
    this.aiHoloBust.add(ped);

    // Wireframe Character Head & Shoulders
    const head = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.24, 2),
      new THREE.MeshBasicMaterial({ color: 0x00d2ff, wireframe: true, transparent: true, opacity: 0.85 })
    );
    head.position.y = 0.15;
    this.aiHoloBust.add(head);

    const torso = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.5, 6),
      new THREE.MeshBasicMaterial({ color: 0xe5b875, wireframe: true, transparent: true, opacity: 0.65 })
    );
    torso.position.y = -0.15;
    this.aiHoloBust.add(torso);

    aiGroup.add(this.aiHoloBust);

    // High-Density Neural Server Rack with Blinking Activity Lights
    const serverRack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.6, 1.0), this.materials.metalBlack);
    serverRack.position.set(11.2, 1.3, -25.5);
    aiGroup.add(serverRack);

    // Neon Cyan Accent Light Tube
    const aiLight = new THREE.PointLight(0x00d2ff, 16, 7);
    aiLight.position.set(11.0, 2.1, -25.5);
    aiGroup.add(aiLight);

    // Live AI Generation Video on auxiliary screen
    this.createVideoMonitor(aiGroup, 4.8, 1.4, -24.5, './assets/videos/microdrama-scene-02.mp4', 'ai-lab', -Math.PI / 2);

    this.createErgonomicChair(aiGroup, 7.5, -23.4, 0);

    this.registerInteractiveTarget(aiGroup, 'ai-lab', 'AI Production Lab', [7.5, 1.6, -24.5]);
    this.group.add(aiGroup);
  }

  /**
   * SCENE 08 — Production Floor & Soundstage
   * Left Side: X = -7.5m, Z = -29.5m
   * Cameras, lights, green screens, live production setups, crew activity
   */
  private buildScene08Soundstage() {
    const stageGroup = new THREE.Group();

    // Green Screen Infinity Cyclorama (Curved Corner Wall + Seamless Floor)
    const cycWall = new THREE.Mesh(new THREE.BoxGeometry(6.6, 4.2, 0.2), this.materials.greenScreen);
    cycWall.position.set(-7.5, 2.1, -32.5);
    stageGroup.add(cycWall);

    const cycSideWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 4.0), this.materials.greenScreen);
    cycSideWall.position.set(-10.8, 2.1, -30.5);
    stageGroup.add(cycSideWall);

    const cycFloor = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.02, 4.0), this.materials.greenScreen);
    cycFloor.position.set(-7.5, 0.01, -30.5);
    stageGroup.add(cycFloor);

    // FLOOR DOLLY TRACK RAILS (Metal rails running along Z)
    for (const dx of [-0.4, 0.4]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 6.0, 8), this.materials.chrome);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(-4.5 + dx, 0.03, -29.5);
      stageGroup.add(rail);
    }

    // MOTORIZED CINEMA CAMERA DOLLY RIG
    this.cameraDolly = new THREE.Group();
    this.cameraDolly.position.set(-4.5, 0, -28.0);

    const dollyBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 1.2), this.materials.metalBlack);
    dollyBase.position.y = 0.08;
    this.cameraDolly.add(dollyBase);

    // Dolly Wheels
    for (const wx of [-0.4, 0.4]) {
      for (const wz of [-0.45, 0.45]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), this.materials.metalBlack);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.06, wz);
        this.cameraDolly.add(wheel);
      }
    }

    // Cinema Camera Rig on Tripod (ARRI / RED Style)
    const tripodCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), this.materials.metalBlack);
    tripodCenter.position.y = 0.68;
    this.cameraDolly.add(tripodCenter);

    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.4), this.materials.metalBlack);
    camBody.position.set(0, 1.35, 0);
    this.cameraDolly.add(camBody);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16), this.materials.gold);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 1.35, -0.32);
    this.cameraDolly.add(lens);

    const matteBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.12), this.materials.metalBlack);
    matteBox.position.set(0, 1.35, -0.5);
    this.cameraDolly.add(matteBox);

    stageGroup.add(this.cameraDolly);

    // Studio Lighting Softbox on C-Stand
    const softbox = new THREE.Group();
    softbox.position.set(-9.2, 0, -28.0);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 2.8, 8), this.materials.metalBlack);
    pole.position.y = 1.4;
    softbox.add(pole);

    const softboxPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 1.4, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xfff0dd, roughness: 0.3, emissive: 0xffe2b8, emissiveIntensity: 0.6 })
    );
    softboxPanel.position.set(0, 2.6, 0);
    softboxPanel.rotation.x = 0.25;
    softbox.add(softboxPanel);

    const studioLight = new THREE.PointLight(0xffecd0, 30, 10);
    studioLight.position.set(0, 2.5, 0.4);
    softbox.add(studioLight);

    stageGroup.add(softbox);

    // Director's Playback Monitor on Rollable Cart playing live microdrama
    this.createVideoMonitor(stageGroup, -3.2, 1.5, -29.5, './assets/videos/microdrama-01.mp4', 'soundstage');

    this.registerInteractiveTarget(stageGroup, 'soundstage', 'Production Floor & Soundstage', [-5.8, 1.6, -29.5]);
    this.group.add(stageGroup);
  }

  /**
   * SCENE 09 — Final Showcase Hall
   * Z = -34.0m to -41.0m
   * Massive cinematic display wall. Show our best projects through large-scale immersive screens.
   * End with a powerful call-to-action: "Let's Create Something That Reaches The World."
   * Direct portals to WhatsApp and Google Drive.
   */
  private buildScene09ShowcaseHall() {
    const hallGroup = new THREE.Group();

    // Elevated Stage Dais (X = 0, Z = -38.5m)
    const stage = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.25, 6.0), this.materials.darkAcoustic);
    stage.position.set(0, 0.125, -38.5);
    hallGroup.add(stage);

    const stageGoldRim = new THREE.Mesh(new THREE.BoxGeometry(18.05, 0.05, 0.05), this.materials.gold);
    stageGoldRim.position.set(0, 0.25, -35.5);
    hallGroup.add(stageGoldRim);

    // MASSIVE 20-METER CURVED PANORAMIC CINEMA DISPLAY WALL (Z = -41.2m)
    // Cylinder segment for authentic curved LED stage feel
    const video = document.createElement('video');
    video.src = './assets/videos/creta-door-opening-animation.mp4';
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.play().catch(() => {});

    const videoTex = new THREE.VideoTexture(video);
    videoTex.colorSpace = THREE.SRGBColorSpace;

    const curvedGeo = new THREE.CylinderGeometry(14, 14, 4.2, 48, 1, true, -Math.PI / 4, Math.PI / 2);
    const curvedMat = new THREE.MeshBasicMaterial({ map: videoTex, side: THREE.BackSide });
    const curvedWall = new THREE.Mesh(curvedGeo, curvedMat);
    curvedWall.position.set(0, 2.3, -31.5);
    hallGroup.add(curvedWall);
    this.videoScreens.push({ mesh: curvedWall, video });

    // ILLUMINATED 3D MONUMENTAL CALL-TO-ACTION TYPOGRAPHY
    // "LET'S CREATE SOMETHING THAT REACHES THE WORLD."
    const ctaCanvas = document.createElement('canvas');
    ctaCanvas.width = 2048;
    ctaCanvas.height = 512;
    const cctx = ctaCanvas.getContext('2d')!;
    cctx.fillStyle = 'rgba(0, 0, 0, 0)';
    cctx.fillRect(0, 0, 2048, 512);

    cctx.fillStyle = '#e5b875';
    cctx.font = 'bold 78px "Segoe UI", sans-serif';
    cctx.textAlign = 'center';
    cctx.shadowColor = '#e5b875';
    cctx.shadowBlur = 24;
    cctx.fillText("LET'S CREATE SOMETHING THAT REACHES THE WORLD.", 1024, 200);

    cctx.shadowBlur = 0;
    cctx.fillStyle = '#ffffff';
    cctx.font = '34px "Segoe UI", sans-serif';
    cctx.fillText('Dubbing  ·  70+ Languages  ·  4K Editing  ·  Dolby Atmos  ·  AI Microdramas', 1024, 290);

    const ctaTex = new THREE.CanvasTexture(ctaCanvas);
    ctaTex.colorSpace = THREE.SRGBColorSpace;
    const ctaMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(12.0, 3.0),
      new THREE.MeshBasicMaterial({ map: ctaTex, transparent: true })
    );
    ctaMesh.position.set(0, 3.2, -36.5);
    hallGroup.add(ctaMesh);

    // Warm ceiling spot array shining on the stage
    for (const sx of [-4, 0, 4]) {
      const spot = new THREE.SpotLight(0xffdfba, 28, 12, Math.PI / 6, 0.4);
      spot.position.set(sx, 4.6, -35);
      spot.target.position.set(sx, 0.2, -38.5);
      hallGroup.add(spot);
      hallGroup.add(spot.target);
    }

    // TWO INTERACTIVE 3D KIOSKS / PORTALS (Left: Google Drive, Right: WhatsApp)
    // 1. Google Drive Portal Kiosk
    const driveKiosk = this.createInteractivePortalKiosk(
      -4.5,
      -36.5,
      'GOOGLE DRIVE ARCHIVE',
      'Open Full Master Portfolio ↗',
      '#4285F4',
      'https://drive.google.com/drive/folders/1RajqmMkmeoIZvNyE-Ar8KBrQRPGqwH8C'
    );
    hallGroup.add(driveKiosk);

    // 2. WhatsApp Direct Chat Portal Kiosk
    const waKiosk = this.createInteractivePortalKiosk(
      4.5,
      -36.5,
      'STUDIO WHATSAPP',
      'Direct WhatsApp Chat (+91 9068734941) ↗',
      '#25D366',
      'https://wa.link/mcjxfk'
    );
    hallGroup.add(waKiosk);

    this.registerInteractiveTarget(hallGroup, 'showcase-hall', 'Grand Showcase Hall', [0, 1.8, -36.5]);
    this.group.add(hallGroup);
  }

  /**
   * Helper: Create Interactive 3D Portal Kiosk
   */
  private createInteractivePortalKiosk(x: number, z: number, title: string, subtitle: string, accentColor: string, url: string): THREE.Group {
    const kiosk = new THREE.Group();
    kiosk.position.set(x, 0, z);

    // Pedestal Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.8), this.materials.darkAcoustic);
    base.position.y = 0.45;
    kiosk.add(base);

    const baseTrim = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.04, 0.84), this.materials.gold);
    baseTrim.position.y = 0.9;
    kiosk.add(baseTrim);

    // Glowing Sign Screen
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#101416';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(20, 20, 472, 216, 16);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 95);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px "Segoe UI", sans-serif';
    ctx.fillText(subtitle, 256, 165);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.7),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    screen.position.set(0, 1.35, 0);
    screen.rotation.x = -0.2;
    kiosk.add(screen);

    // PointLight glow
    const pLight = new THREE.PointLight(new THREE.Color(accentColor), 8, 4);
    pLight.position.set(0, 1.4, 0.3);
    kiosk.add(pLight);

    // Register interactive target for direct click
    this.interactiveTargets.push({
      mesh: screen,
      departmentId: 'showcase-hall',
      title: `${title} (${subtitle})`,
      type: 'portal',
      url
    });

    return kiosk;
  }

  /**
   * Animation Update Loop: Called every frame
   */
  public update(delta: number, elapsed: number, scrollProgress: number) {
    // 1. Exterior Moving Spotlight Beams
    if (this.exteriorLights.length >= 2) {
      this.exteriorLights[0].target.position.x = -2.0 + Math.sin(elapsed * 0.85) * 5.0;
      this.exteriorLights[1].target.position.x = 2.0 + Math.cos(elapsed * 0.85) * 5.0;
    }

    // 2. Sliding Glass Entrance Doors based on camera / scroll progress
    // Doors open smoothly between progress 0.06 and 0.18
    const doorProgress = Math.max(0, Math.min(1, (scrollProgress - 0.05) / 0.12));
    this.openDoors(doorProgress);

    // 3. Scene 4 Holographic World Globe Rotation
    if (this.holographicGlobe) {
      this.holographicGlobe.rotation.y += delta * 0.45;
    }

    // 4. Scene 6 Dolby Atmos Spatial Soundfield Wave Undulation
    this.atmosWaveRings.forEach((ring, idx) => {
      const scale = 1.0 + Math.sin(elapsed * 2.5 + idx * 1.2) * 0.12;
      ring.scale.set(scale, scale, 1);
    });

    // 5. Scene 7 AI Holographic Bust Rotation
    if (this.aiHoloBust) {
      this.aiHoloBust.rotation.y += delta * 0.65;
    }

    // 6. Scene 8 Motorized Camera Dolly Track Motion
    if (this.cameraDolly) {
      this.cameraDolly.position.z = -28.0 + Math.sin(elapsed * 0.5) * 1.8;
    }
  }

  /**
   * Helper: Animate Glass Entrance Doors based on visitor scroll / approach
   */
  public openDoors(progress: number) {
    const openAmount = Math.max(0, Math.min(1, progress));
    this.doors.forEach(d => {
      d.hinge.rotation.y = d.side * openAmount * 1.35;
    });
  }

  /**
   * Helper: Register Interactive Target for Click & Proximity Detection
   */
  private registerInteractiveTarget(parent: THREE.Group, departmentId: string, title: string, pos: [number, number, number]) {
    const hitGeo = new THREE.BoxGeometry(3.0, 2.5, 3.0);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.position.set(...pos);
    parent.add(hitMesh);

    this.interactiveTargets.push({
      mesh: hitMesh,
      departmentId,
      title,
      type: 'department'
    });
  }

  /**
   * Helper: Create Ergonomic Office Task Chair
   */
  private createErgonomicChair(parent: THREE.Group, x: number, z: number, yaw: number) {
    const chair = new THREE.Group();
    chair.position.set(x, 0, z);
    chair.rotation.y = yaw;

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), this.materials.chrome);
    stem.position.y = 0.25;
    chair.add(stem);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.52), this.materials.darkAcoustic);
    seat.position.y = 0.5;
    chair.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.08), this.materials.darkAcoustic);
    back.position.set(0, 0.88, -0.22);
    chair.add(back);

    parent.add(chair);
  }

  /**
   * Helper: Create Realistic Indoor Ficus Plant
   */
  private createIndoorPlant(parent: THREE.Group, x: number, z: number) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.55, 16), this.materials.wood);
    pot.position.set(x, 0.28, z);
    parent.add(pot);

    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.9, 7),
        new THREE.MeshStandardMaterial({ color: i % 2 ? 0x243e2e : 0x2e4f3a, roughness: 0.8 })
      );
      leaf.position.set(x + Math.sin(i * 5) * 0.22, 0.85 + (i % 3) * 0.12, z + Math.cos(i * 5) * 0.22);
      leaf.rotation.z = Math.sin(i) * 0.45;
      parent.add(leaf);
    }
  }

  /**
   * Helper: Create Computer Monitor Setup on Desk
   */
  private createMonitorSetup(parent: THREE.Group, x: number, y: number, z: number, yaw: number, kind: string) {
    const setup = new THREE.Group();
    setup.position.set(x, y, z);
    setup.rotation.y = yaw;

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.08, 0.35, 12), this.materials.metalBlack);
    stand.position.y = 0.18;
    setup.add(stand);

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.52, 0.04), this.materials.screenBezel);
    bezel.position.y = 0.45;
    setup.add(bezel);

    const scrMat = new THREE.MeshBasicMaterial({ color: 0x18242b });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.48), scrMat);
    screen.position.set(0, 0.45, 0.025);
    setup.add(screen);

    parent.add(setup);
  }

  /**
   * Helper: Create Live In-World Video Texture Monitor
   */
  private createVideoMonitor(parent: THREE.Group, x: number, y: number, z: number, videoSrc: string, depId: string, yaw: number = 0) {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.play().catch(() => {});

    const videoTex = new THREE.VideoTexture(video);
    videoTex.colorSpace = THREE.SRGBColorSpace;

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.9),
      new THREE.MeshBasicMaterial({ map: videoTex })
    );
    screenMesh.position.set(x, y, z);
    screenMesh.rotation.y = yaw;

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.98, 0.06), this.materials.screenBezel);
    bezel.position.set(x, y, z - 0.035);
    bezel.rotation.y = yaw;
    parent.add(bezel);

    parent.add(screenMesh);
    this.videoScreens.push({ mesh: screenMesh, video });

    this.interactiveTargets.push({
      mesh: screenMesh,
      departmentId: depId,
      title: `${depId.toUpperCase()} Monitor`,
      type: 'department'
    });
  }
}
