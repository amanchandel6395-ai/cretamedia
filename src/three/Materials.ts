import * as THREE from 'three';

export class StudioMaterials {
  public floor: THREE.MeshStandardMaterial;
  public wall: THREE.MeshStandardMaterial;
  public darkAcoustic: THREE.MeshStandardMaterial;
  public wood: THREE.MeshStandardMaterial;
  public gold: THREE.MeshStandardMaterial;
  public glass: THREE.MeshPhysicalMaterial;
  public metalBlack: THREE.MeshStandardMaterial;
  public chrome: THREE.MeshStandardMaterial;
  public foam: THREE.MeshStandardMaterial;
  public screenBezel: THREE.MeshStandardMaterial;
  public greenScreen: THREE.MeshStandardMaterial;
  public ceiling: THREE.MeshStandardMaterial;

  constructor() {
    const floorTex = this.createFloorTexture();
    const wallTex = this.createWallTexture();
    const woodTex = this.createWoodTexture();
    const foamTex = this.createFoamTexture();

    this.floor = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: floorTex,
      bumpMap: floorTex,
      bumpScale: 0.02,
      roughness: 0.45,
      metalness: 0.08
    });

    this.wall = new THREE.MeshStandardMaterial({
      color: 0x1f2322,
      map: wallTex,
      bumpMap: wallTex,
      bumpScale: 0.025,
      roughness: 0.88,
      metalness: 0.05
    });

    this.darkAcoustic = new THREE.MeshStandardMaterial({
      color: 0x141716,
      roughness: 0.92,
      metalness: 0.1
    });

    this.wood = new THREE.MeshStandardMaterial({
      color: 0xd8c2a8,
      map: woodTex,
      bumpMap: woodTex,
      bumpScale: 0.02,
      roughness: 0.38,
      metalness: 0.04
    });

    this.gold = new THREE.MeshStandardMaterial({
      color: 0xe5b875,
      roughness: 0.28,
      metalness: 0.82
    });

    this.glass = new THREE.MeshPhysicalMaterial({
      color: 0xb5d4cb,
      roughness: 0.08,
      metalness: 0.12,
      transmission: 0.88,
      opacity: 0.32,
      transparent: true,
      ior: 1.52,
      side: THREE.DoubleSide
    });

    this.metalBlack = new THREE.MeshStandardMaterial({
      color: 0x111313,
      roughness: 0.42,
      metalness: 0.65
    });

    this.chrome = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.18,
      metalness: 0.92
    });

    this.foam = new THREE.MeshStandardMaterial({
      color: 0x222625,
      map: foamTex,
      bumpMap: foamTex,
      bumpScale: 0.04,
      roughness: 0.95,
      metalness: 0.02
    });

    this.screenBezel = new THREE.MeshStandardMaterial({
      color: 0x08090a,
      roughness: 0.35,
      metalness: 0.5
    });

    this.greenScreen = new THREE.MeshStandardMaterial({
      color: 0x00c853,
      roughness: 0.9,
      metalness: 0.0
    });

    this.ceiling = new THREE.MeshStandardMaterial({
      color: 0x111312,
      roughness: 0.9,
      metalness: 0.1
    });
  }

  private createFloorTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Polished concrete base with subtle micro-noise
    ctx.fillStyle = '#424543';
    ctx.fillRect(0, 0, 1024, 1024);

    for (let i = 0; i < 12000; i++) {
      const v = Math.random() > 0.5 ? 255 : 0;
      const alpha = 0.01 + Math.random() * 0.03;
      ctx.fillStyle = `rgba(${v},${v},${v},${alpha})`;
      const s = 1 + Math.random() * 3;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, s, s);
    }

    // Modern studio floor tile lines (2m grids)
    ctx.strokeStyle = '#2b2d2c';
    ctx.lineWidth = 3;
    for (let x = 0; x <= 1024; x += 256) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += 256) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 16);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createWallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#222524';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 8000; i++) {
      const v = Math.floor(Math.random() * 255);
      ctx.fillStyle = `rgba(${v},${v},${v},0.025)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 6);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createWoodTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Warm architectural walnut
    ctx.fillStyle = '#563e2d';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 280; i++) {
      const y = Math.random() * 512;
      const alpha = 0.04 + Math.random() * 0.12;
      ctx.strokeStyle = `rgba(189, 148, 107, ${alpha})`;
      ctx.lineWidth = 0.5 + Math.random() * 2.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        150, y + (Math.random() * 16 - 8),
        360, y + (Math.random() * 14 - 7),
        512, y + (Math.random() * 8 - 4)
      );
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createFoamTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1c1f1e';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#0f1110';
    ctx.lineWidth = 6;
    for (let x = -512; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 512, 512);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
}
