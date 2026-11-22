import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export interface CharacterInstance {
  root: THREE.Group;
  mixer?: THREE.AnimationMixer;
  role: string;
  departmentId: string;
  mode: 'idle' | 'sit' | 'walk';
}

interface ArticulatedPerson {
  group: THREE.Group;
  headGroup: THREE.Group;
  torso: THREE.Mesh;
  torsoBaseY: number;
  phase: number;
  baseHeadYaw: number;
  arms: {
    shoulder: THREE.Group;
    elbow: THREE.Group;
    hand: THREE.Mesh;
    baseElbowRotX: number;
    baseHandY: number;
  }[];
}

export class CharacterManager {
  public group: THREE.Group;
  public characters: CharacterInstance[] = [];
  public isLoaded: boolean = false;
  private articulatedPeople: ArticulatedPerson[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildArticulatedStaff();
  }

  /**
   * Hand-crafted articulated 3D team members with natural human proportions,
   * realistic wardrobe, tailored poses, and per-frame idle breathing/gestures.
   */
  private buildArticulatedStaff() {
    const staffList = [
      // Receptionist at front desk
      {
        x: 0, z: 1.8, ry: 0,
        pose: 'stand', arm: 'counter',
        top: '#7a4a3a', bottom: '#2c3438', hair: '#191410', bun: true, skin: '#c98d63',
        role: 'Studio Host & Producer'
      },
      // Client waiting in entrance lounge on phone
      {
        x: -4.5, z: 3.8, ry: -Math.PI / 4,
        pose: 'sit', arm: 'phone',
        top: '#31404c', bottom: '#26282c', hair: '#0f0d0b', skin: '#8a5a3b',
        role: 'Visiting Producer'
      },
      // Voice Actor inside Dubbing Booth
      {
        x: -7.2, z: -3.4, ry: Math.PI / 2,
        pose: 'stand', arm: 'script',
        top: '#8a4b38', bottom: '#25292e', hair: '#241a12', beard: '#3a2a1a', skin: '#c98d63',
        role: 'Lead Voice Artist'
      },
      // Dubbing Sound Engineer at Console
      {
        x: -3.2, z: -2.6, ry: -Math.PI / 2,
        pose: 'sit', arm: 'type',
        top: '#364d42', bottom: '#282b29', hair: '#4a4a4a', skin: '#d99a6c',
        role: 'Dubbing Director'
      },
      // Video Editor 1 in Editing Suite
      {
        x: 6.4, z: -2.0, ry: Math.PI / 2,
        pose: 'sit', arm: 'type',
        top: '#2c3338', bottom: '#1f2427', hair: '#171310', skin: '#b87d57',
        role: 'Lead Video Editor'
      },
      // Video Editor 2 (Colorist / Assistant)
      {
        x: 6.4, z: -4.4, ry: Math.PI / 2,
        pose: 'sit', arm: 'type',
        top: '#8c704b', bottom: '#2c3438', hair: '#171310', bun: true, skin: '#e8b48c',
        role: 'Senior Colorist'
      },
      // Senior Audio Engineer in Audio Mastering Suite
      {
        x: -6.5, z: -11.0, ry: -Math.PI / 2,
        pose: 'sit', arm: 'type',
        top: '#25292e', bottom: '#20242a', hair: '#221a12', beard: '#241a12', skin: '#c98d63',
        role: 'Mastering Audio Engineer'
      },
      // Screenwriter at Scriptwriting Desk
      {
        x: 6.2, z: -11.0, ry: Math.PI / 2,
        pose: 'sit', arm: 'type',
        top: '#5a3d31', bottom: '#3a3f45', hair: '#241a12', skin: '#b87d57',
        role: 'Screenwriter'
      },
      // Localisation Specialist
      {
        x: 8.8, z: -11.0, ry: -Math.PI / 2,
        pose: 'sit', arm: 'type',
        top: '#394e50', bottom: '#2c3438', hair: '#171310', bun: true, skin: '#d99a6c',
        role: 'Language Adapter'
      },
      // Film Director on Film Set
      {
        x: -3.2, z: -19.5, ry: -Math.PI / 3,
        pose: 'stand', arm: 'vf',
        top: '#6a513b', bottom: '#26282c', hair: '#241a12', beard: '#3a2a1a', skin: '#c98d63',
        role: 'Film Director'
      },
      // Camera Operator on Film Set
      {
        x: -4.5, z: -17.2, ry: -Math.PI / 6,
        pose: 'stand', arm: 'vf',
        top: '#1c1f21', bottom: '#1f2427', hair: '#171310', skin: '#8a5a3b',
        role: 'Director of Photography'
      },
      // Actor on mark on Green Screen stage
      {
        x: -7.5, z: -22.0, ry: Math.PI / 3,
        pose: 'stand', arm: 'hang',
        top: '#a85f4a', bottom: '#2c3438', hair: '#0f0d0b', bun: true, skin: '#e8b48c',
        role: 'Actor'
      },
      // AI Creative Technologist in AI Lab
      {
        x: 7.5, z: -19.4, ry: 0,
        pose: 'sit', arm: 'type',
        top: '#1d3944', bottom: '#1f2427', hair: '#171310', skin: '#b87d57',
        role: 'AI Technologist'
      },
      // Executive Producer in Conference Room
      {
        x: 1.2, z: -38.2, ry: 0,
        pose: 'sit', arm: 'type',
        top: '#222831', bottom: '#26282c', hair: '#241a12', beard: '#241a12', skin: '#8a5a3b',
        role: 'Managing Producer'
      }
    ];

    staffList.forEach((s) => {
      this.createArticulatedPerson(s);
    });
  }

  private createArticulatedPerson(cfg: any) {
    const root = new THREE.Group();
    root.position.set(cfg.x, 0, cfg.z);
    root.rotation.y = cfg.ry || 0;

    const skinMat = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.55 });
    const topMat = new THREE.MeshStandardMaterial({ color: cfg.top, roughness: 0.78 });
    const bottomMat = new THREE.MeshStandardMaterial({ color: cfg.bottom, roughness: 0.85 });
    const hairMat = new THREE.MeshStandardMaterial({ color: cfg.hair, roughness: 0.92 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111313, roughness: 0.5 });

    const isSit = cfg.pose === 'sit';
    const hipY = isSit ? 0.62 : 0.94;

    // Hips
    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.22), bottomMat);
    hips.position.y = hipY - 0.08;
    hips.castShadow = true;
    root.add(hips);

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.56, 0.24), topMat);
    torso.position.set(0, hipY + 0.35, -0.01);
    torso.rotation.x = isSit ? 0.08 : 0.02;
    torso.castShadow = true;
    root.add(torso);

    // Legs
    for (const side of [-1, 1]) {
      if (isSit) {
        // Thigh
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.38, 8), bottomMat);
        thigh.rotation.x = Math.PI / 2;
        thigh.position.set(side * 0.11, hipY - 0.04, 0.18);
        thigh.castShadow = true;
        root.add(thigh);

        // Shin
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.42, 8), bottomMat);
        shin.position.set(side * 0.11, 0.25, 0.36);
        shin.castShadow = true;
        root.add(shin);

        // Shoe
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.22), blackMat);
        shoe.position.set(side * 0.11, 0.035, 0.42);
        root.add(shoe);
      } else {
        // Thigh & Shin
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.05, 0.88, 8), bottomMat);
        leg.position.set(side * 0.11, 0.46, 0.01);
        leg.castShadow = true;
        root.add(leg);

        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.24), blackMat);
        shoe.position.set(side * 0.11, 0.035, 0.06);
        root.add(shoe);
      }
    }

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.048, 0.1, 8), skinMat);
    neck.position.set(0, hipY + 0.65, -0.02);
    root.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, hipY + 0.72, -0.02);
    root.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.112, 16, 12), skinMat);
    head.scale.set(0.94, 1.15, 1.02);
    head.position.y = 0.08;
    head.castShadow = true;
    headGroup.add(head);

    // Hair cap
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
    hair.scale.set(0.96, 1.1, 1.04);
    hair.position.y = 0.09;
    headGroup.add(hair);

    if (cfg.bun) {
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), hairMat);
      bun.position.set(0, 0.15, -0.12);
      headGroup.add(bun);
    }

    if (cfg.beard) {
      const beardMat = new THREE.MeshStandardMaterial({ color: cfg.beard, roughness: 0.95 });
      const beard = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.06), beardMat);
      beard.position.set(0, 0.01, 0.09);
      beard.rotation.x = 0.15;
      headGroup.add(beard);
    }

    // Arms & Hands
    const armInstances: any[] = [];
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.21, hipY + 0.58, -0.01);
      root.add(shoulder);

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.28, 8), topMat);
      upperArm.position.set(side * 0.02, -0.14, 0.01);
      upperArm.castShadow = true;
      shoulder.add(upperArm);

      const elbow = new THREE.Group();
      elbow.position.set(side * 0.02, -0.26, 0.01);
      shoulder.add(elbow);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.034, 0.26, 8), skinMat);
      forearm.position.set(0, -0.13, 0.08);
      forearm.rotation.x = isSit ? 0.45 : 0.1;
      forearm.castShadow = true;
      elbow.add(forearm);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skinMat);
      hand.position.set(0, -0.25, 0.15);
      elbow.add(hand);

      // Arm pose customization
      if (cfg.arm === 'type') {
        shoulder.rotation.x = -0.4;
        elbow.rotation.x = -0.35;
      } else if (cfg.arm === 'counter') {
        shoulder.rotation.x = -0.8;
        elbow.rotation.x = -0.8;
      } else if (cfg.arm === 'phone' && side === 1) {
        shoulder.rotation.x = -0.6;
        elbow.rotation.x = -1.4;
        elbow.rotation.y = -0.3;
      } else if (cfg.arm === 'script') {
        shoulder.rotation.x = -0.6;
        elbow.rotation.x = -0.5;
      } else if (cfg.arm === 'vf') {
        shoulder.rotation.x = -0.7;
        elbow.rotation.x = -1.1;
      }

      armInstances.push({
        shoulder,
        elbow,
        hand,
        baseElbowRotX: elbow.rotation.x,
        baseHandY: hand.position.y
      });
    }

    this.group.add(root);
    this.articulatedPeople.push({
      group: root,
      headGroup,
      torso,
      torsoBaseY: torso.position.y,
      phase: Math.random() * Math.PI * 2,
      baseHeadYaw: 0,
      arms: armInstances
    });
  }

  public async loadCharacters(modelUrl: string = './assets/models/creta-team-character.glb'): Promise<void> {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          this.setupStaffMembers(gltf);
          this.isLoaded = true;
          resolve();
        },
        undefined,
        (err) => {
          console.warn('GLTF team character model deferred, using articulated procedural cast.', err);
          resolve();
        }
      );
    });
  }

  private setupStaffMembers(gltf: any) {
    const baseScene = gltf.scene;
    const animations = gltf.animations;

    const placements = [
      {
        role: 'Studio Executive',
        departmentId: 'reception',
        pos: [2.5, 0, 1.8],
        rotY: -Math.PI / 4,
        mode: 'idle' as const,
        outfitColor: '#2b3a4a',
        scale: 1.02
      },
      {
        role: 'Creative Director',
        departmentId: 'writing',
        pos: [7.8, 0, -11.0],
        rotY: -Math.PI / 2,
        mode: 'sit' as const,
        outfitColor: '#5a3d31',
        scale: 1.02
      }
    ];

    placements.forEach((p) => {
      const charRoot = new THREE.Group();
      charRoot.position.set(p.pos[0], p.pos[1], p.pos[2]);
      charRoot.rotation.y = p.rotY;

      const clone = SkeletonUtils.clone(baseScene);
      clone.scale.setScalar(p.scale);
      charRoot.add(clone);

      clone.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material = child.material.clone();
            if (child.material.name === 'Outfit' || child.material.name.toLowerCase().includes('shirt') || child.material.name.toLowerCase().includes('body')) {
              child.material.color = new THREE.Color(p.outfitColor);
              child.material.roughness = 0.75;
            }
          }
        }
      });

      const mixer = new THREE.AnimationMixer(clone);
      const clipPattern = p.mode === 'sit' ? /sit idle/i : /idle/i;
      const targetClip = animations.find((c: any) => clipPattern.test(c.name)) || animations[0];

      if (targetClip) {
        const action = mixer.clipAction(targetClip);
        action.time = Math.random() * targetClip.duration;
        action.play();
      }

      this.group.add(charRoot);
      this.characters.push({
        root: charRoot,
        mixer,
        role: p.role,
        departmentId: p.departmentId,
        mode: p.mode
      });
    });
  }

  public update(delta: number) {
    // 1. Update GLTF character animations if loaded
    for (let i = 0; i < this.characters.length; i++) {
      if (this.characters[i].mixer) {
        this.characters[i].mixer!.update(delta);
      }
    }

    // 2. Update procedural articulated people (breathing, subtle head turning & typing micro-gestures)
    const now = performance.now();
    for (let i = 0; i < this.articulatedPeople.length; i++) {
      const p = this.articulatedPeople[i];
      // Subtle head turning
      p.headGroup.rotation.y = p.baseHeadYaw + Math.sin(now * 0.0004 + p.phase) * 0.14;
      p.headGroup.rotation.x = Math.sin(now * 0.0006 + p.phase * 1.5) * 0.04;

      // Natural breathing
      p.torso.position.y = p.torsoBaseY + Math.sin(now * 0.0012 + p.phase) * 0.006;

      // Arm / typing micro motions
      for (let j = 0; j < p.arms.length; j++) {
        const arm = p.arms[j];
        arm.elbow.rotation.x = arm.baseElbowRotX + Math.sin(now * 0.01 + p.phase + j * 1.8) * 0.02;
        arm.hand.position.y = arm.baseHandY + Math.sin(now * 0.015 + p.phase + j * 2.2) * 0.006;
      }
    }
  }
}

