import * as THREE from 'three';
import gsap from 'gsap';
import { DEPARTMENTS, DepartmentInfo } from '../data/studioData';

export type NavigationMode = 'guided' | 'free';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public mode: NavigationMode = 'guided';
  public currentSceneIndex: number = 0;
  public onSceneChange?: (department: DepartmentInfo) => void;
  public onProgressChange?: (progress: number) => void;

  // Continuous Spline Engine
  public posSpline: THREE.CatmullRomCurve3;
  public lookAtSpline: THREE.CatmullRomCurve3;
  public currentProgress: number = 0;
  public targetProgress: number = 0;

  // Free roam state
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private isPointerDown = false;
  private prevMouseX = 0;
  private prevMouseY = 0;
  private yaw = 0;
  private pitch = 0;
  private walkTime = 0;

  // Collision limits in studio coordinates
  private minX = -10.5;
  private maxX = 10.5;
  private minZ = -38.5;
  private maxZ = 20.0;
  private eyeHeight = 1.7;

  // Touch tracking
  private touchStartY = 0;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;

    // 1. Build continuous 3D Catmull-Rom splines from the 9 waypoints
    const posPoints = DEPARTMENTS.map(d => new THREE.Vector3(...d.camera.position));
    const lookPoints = DEPARTMENTS.map(d => new THREE.Vector3(...d.camera.target));

    this.posSpline = new THREE.CatmullRomCurve3(posPoints, false, 'centripetal', 0.5);
    this.lookAtSpline = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal', 0.5);

    // Initial position
    const startPos = this.posSpline.getPointAt(0);
    const startLook = this.lookAtSpline.getPointAt(0);
    this.camera.position.copy(startPos);
    this.camera.lookAt(startLook);

    this.setupEventListeners(domElement);
  }

  public setMode(mode: NavigationMode) {
    if (this.mode === mode) return;
    this.mode = mode;

    if (mode === 'free') {
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      this.yaw = Math.atan2(-dir.x, -dir.z);
      this.pitch = Math.asin(Math.max(-0.99, Math.min(0.99, dir.y)));
    } else {
      // Re-align to current spline progress
      this.targetProgress = this.currentSceneIndex / (DEPARTMENTS.length - 1);
    }
  }

  public nextScene() {
    if (this.currentSceneIndex < DEPARTMENTS.length - 1) {
      this.jumpToScene(this.currentSceneIndex + 1);
    }
  }

  public prevScene() {
    if (this.currentSceneIndex > 0) {
      this.jumpToScene(this.currentSceneIndex - 1);
    }
  }

  public jumpToScene(index: number) {
    const clampedIndex = Math.max(0, Math.min(DEPARTMENTS.length - 1, index));
    const targetP = clampedIndex / (DEPARTMENTS.length - 1);

    gsap.to(this, {
      targetProgress: targetP,
      duration: 1.6,
      ease: 'power3.out'
    });
  }

  public setGuidedScene(index: number) {
    this.jumpToScene(index);
  }

  public update(delta: number) {
    if (this.mode === 'guided') {
      this.updateSplineScroll(delta);
    } else {
      this.updateFreeRoam(delta);
    }
  }

  /**
   * Continuous Scroll Interpolation along 3D Splines
   */
  private updateSplineScroll(delta: number) {
    // Critical damping for cinematic inertia
    this.currentProgress = THREE.MathUtils.damp(
      this.currentProgress,
      this.targetProgress,
      4.5,
      delta
    );

    const p = Math.max(0, Math.min(1, this.currentProgress));

    // Sample coordinates along the 3D curves
    const pos = this.posSpline.getPointAt(p);
    const look = this.lookAtSpline.getPointAt(p);

    this.camera.position.copy(pos);
    this.camera.lookAt(look);

    // Update active department indicator
    const sceneIdx = Math.min(
      DEPARTMENTS.length - 1,
      Math.floor(p * DEPARTMENTS.length)
    );

    if (sceneIdx !== this.currentSceneIndex) {
      this.currentSceneIndex = sceneIdx;
      if (this.onSceneChange) {
        this.onSceneChange(DEPARTMENTS[sceneIdx]);
      }
    }

    if (this.onProgressChange) {
      this.onProgressChange(p);
    }
  }

  /**
   * Free roam WASD controls
   */
  private updateFreeRoam(delta: number) {
    const moveSpeed = 4.2;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
    const moveDelta = new THREE.Vector3();

    if (this.moveForward) moveDelta.add(forward);
    if (this.moveBackward) moveDelta.sub(forward);
    if (this.moveRight) moveDelta.add(right);
    if (this.moveLeft) moveDelta.sub(right);

    if (moveDelta.lengthSq() > 0) {
      moveDelta.normalize().multiplyScalar(moveSpeed * delta);
      this.camera.position.add(moveDelta);
      this.walkTime += delta * 10;
      this.camera.position.y = this.eyeHeight + Math.sin(this.walkTime) * 0.025;
    }

    this.camera.position.x = Math.max(this.minX, Math.min(this.maxX, this.camera.position.x));
    this.camera.position.z = Math.max(this.minZ, Math.min(this.maxZ, this.camera.position.z));

    const lookTarget = new THREE.Vector3(
      this.camera.position.x - Math.sin(this.yaw) * Math.cos(this.pitch),
      this.camera.position.y + Math.sin(this.pitch),
      this.camera.position.z - Math.cos(this.yaw) * Math.cos(this.pitch)
    );
    this.camera.lookAt(lookTarget);
  }

  private setupEventListeners(domElement: HTMLElement) {
    // 1. Desktop Wheel Scroll: Controls continuous camera traversal through headquarters
    window.addEventListener('wheel', (e) => {
      if (this.mode !== 'guided') return;
      const normalizedDelta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 80) * 0.00065;
      this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + normalizedDelta));
    }, { passive: true });

    // 2. Touch Scroll for Mobile / Tablets
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.mode !== 'guided' || e.touches.length !== 1) return;
      const touchY = e.touches[0].clientY;
      const deltaY = this.touchStartY - touchY;
      this.touchStartY = touchY;

      const delta = deltaY * 0.0012;
      this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + delta));
    }, { passive: true });

    // 3. Pointer drag for Free Roam
    domElement.addEventListener('pointerdown', (e) => {
      if (this.mode === 'free') {
        this.isPointerDown = true;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.mode === 'free' && this.isPointerDown) {
        const deltaX = e.clientX - this.prevMouseX;
        const deltaY = e.clientY - this.prevMouseY;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;

        const sensitivity = 0.0022;
        this.yaw += deltaX * sensitivity;
        this.pitch -= deltaY * sensitivity;
        this.pitch = Math.max(-Math.PI / 2.6, Math.min(Math.PI / 2.6, this.pitch));
      }
    });

    window.addEventListener('pointerup', () => {
      this.isPointerDown = false;
    });

    // 4. Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (this.mode === 'guided') {
        if (e.code === 'ArrowDown' || e.code === 'PageDown' || e.code === 'KeyS') {
          this.targetProgress = Math.min(1, this.targetProgress + 0.08);
        } else if (e.code === 'ArrowUp' || e.code === 'PageUp' || e.code === 'KeyW') {
          this.targetProgress = Math.max(0, this.targetProgress - 0.08);
        } else if (e.code === 'Digit1') this.jumpToScene(0);
        else if (e.code === 'Digit2') this.jumpToScene(1);
        else if (e.code === 'Digit3') this.jumpToScene(2);
        else if (e.code === 'Digit4') this.jumpToScene(3);
        else if (e.code === 'Digit5') this.jumpToScene(4);
        else if (e.code === 'Digit6') this.jumpToScene(5);
        else if (e.code === 'Digit7') this.jumpToScene(6);
        else if (e.code === 'Digit8') this.jumpToScene(7);
        else if (e.code === 'Digit9') this.jumpToScene(8);
      } else {
        switch (e.code) {
          case 'KeyW': case 'ArrowUp': this.moveForward = true; break;
          case 'KeyS': case 'ArrowDown': this.moveBackward = true; break;
          case 'KeyA': case 'ArrowLeft': this.moveLeft = true; break;
          case 'KeyD': case 'ArrowRight': this.moveRight = true; break;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.moveForward = false; break;
        case 'KeyS': case 'ArrowDown': this.moveBackward = false; break;
        case 'KeyA': case 'ArrowLeft': this.moveLeft = false; break;
        case 'KeyD': case 'ArrowRight': this.moveRight = false; break;
      }
    });
  }
}
