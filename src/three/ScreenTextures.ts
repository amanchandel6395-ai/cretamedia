import * as THREE from 'three';

export class ScreenTextureFactory {
  /**
   * Video Editing Bay: DaVinci NLE Timeline & Color Wheels
   */
  public static createNleScreen(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    // Dark NLE theme
    ctx.fillStyle = '#0f1317';
    ctx.fillRect(0, 0, 1024, 640);

    // Top menu bar
    ctx.fillStyle = '#181e24';
    ctx.fillRect(0, 0, 1024, 38);
    ctx.fillStyle = '#e5b875';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('CRETA EDIT SUITE — 4K DAVINCI RESOLVE COLOR & CONFORM', 20, 25);
    ctx.fillStyle = '#7a8885';
    ctx.font = '12px monospace';
    ctx.fillText('24.000 fps  |  ACEScct HDR10+  |  ProRes 4444 XQ', 660, 25);

    // Preview monitor area
    ctx.fillStyle = '#07090b';
    ctx.fillRect(180, 50, 480, 320);

    // Simulated cinematic shot preview
    const grad = ctx.createLinearGradient(180, 50, 660, 370);
    grad.addColorStop(0, '#78432a');
    grad.addColorStop(0.5, '#42332c');
    grad.addColorStop(1, '#1b2a33');
    ctx.fillStyle = grad;
    ctx.fillRect(190, 60, 460, 300);

    // Playback timecode
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(215, 80, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('REC  00:14:28:16', 228, 85);

    // Color wheels panel on right
    ctx.fillStyle = '#141a20';
    ctx.fillRect(670, 50, 340, 320);
    ctx.fillStyle = '#9cb1ac';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('COLOR GRADING & VECTORSCOPES', 685, 75);

    const wheels = [
      { name: 'LIFT', x: 740, color: '#e07a5f' },
      { name: 'GAMMA', x: 840, color: '#81b29a' },
      { name: 'GAIN', x: 940, color: '#3d85c6' }
    ];
    wheels.forEach(w => {
      ctx.beginPath();
      ctx.arc(w.x, 150, 35, 0, Math.PI * 2);
      ctx.strokeStyle = '#2b3640';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = w.color;
      ctx.beginPath();
      ctx.arc(w.x + 4, 150 - 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8a9b97';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(w.name, w.x, 205);
    });
    ctx.textAlign = 'left';

    // Timeline tracks area
    ctx.fillStyle = '#12171c';
    ctx.fillRect(0, 380, 1024, 260);

    const tracks = ['V2 [OVERLAY]', 'V1 [MAIN 4K CUT]', 'A1 [DIALOGUE]', 'A2 [SFX]', 'A3 [DOLBY STEMS]'];
    tracks.forEach((t, i) => {
      const y = 390 + i * 48;
      ctx.fillStyle = i % 2 === 0 ? '#182026' : '#141b21';
      ctx.fillRect(0, y, 1024, 44);

      ctx.fillStyle = '#7a8c88';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(t, 12, y + 26);

      const clipColors = ['#4d7a70', '#8a5f45', '#4d6378', '#9a6a48', '#6a4d78'];
      ctx.fillStyle = clipColors[i % clipColors.length];
      ctx.beginPath();
      ctx.roundRect(140 + i * 60, y + 4, 240 + (i * 45) % 180, 36, 4);
      ctx.fill();

      ctx.fillStyle = '#1b262d';
      ctx.beginPath();
      ctx.roundRect(460 + i * 40, y + 4, 180, 36, 4);
      ctx.fill();
    });

    // Playhead indicator
    ctx.strokeStyle = '#f2b561';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(380, 380);
    ctx.lineTo(380, 640);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * Audio Mixing Theater: Dolby Atmos Spatial Console Screen
   */
  public static createDawScreen(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0e1215';
    ctx.fillRect(0, 0, 1024, 640);

    ctx.fillStyle = '#181f25';
    ctx.fillRect(0, 0, 1024, 38);
    ctx.fillStyle = '#e5b875';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('CRETA DOLBY ATMOS THEATER — 7.1.4 SPATIAL BED & AUDIO OBJECTS', 20, 25);

    const channels = ['LEAD VO', 'DUB HIN', 'DUB BEN', 'FOLEY L/R', 'AMBIENCE 3D', 'SCORE 7.1', 'ATMOS MASTER'];
    const colWidth = 1024 / channels.length;

    channels.forEach((ch, i) => {
      const x = i * colWidth;
      ctx.fillStyle = i % 2 === 0 ? '#13191f' : '#10151a';
      ctx.fillRect(x, 40, colWidth - 2, 590);

      ctx.fillStyle = i === channels.length - 1 ? '#e5b875' : '#889e99';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(ch, x + 12, 70);

      // Level meter ladder
      const meterX = x + 25;
      for (let led = 0; led < 24; led++) {
        const ledY = 480 - led * 16;
        const isActive = led < 15 + Math.sin(i * 1.5) * 6;
        if (isActive) {
          ctx.fillStyle = led > 20 ? '#ff4d4d' : led > 16 ? '#f2b561' : '#32d796';
        } else {
          ctx.fillStyle = '#1c242c';
        }
        ctx.fillRect(meterX, ledY, 18, 11);
      }

      // Fader slot & handle
      const faderX = x + colWidth - 36;
      ctx.fillStyle = '#0a0d10';
      ctx.fillRect(faderX + 6, 120, 6, 360);

      const faderY = 220 + (i * 28) % 160;
      ctx.fillStyle = '#e2e9e6';
      ctx.beginPath();
      ctx.roundRect(faderX, faderY, 18, 30, 3);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * Localization Department: Global Transcreation Pipeline
   */
  public static createLocalizationScreen(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0b1016';
    ctx.fillRect(0, 0, 1024, 640);

    ctx.fillStyle = '#151d27';
    ctx.fillRect(0, 0, 1024, 42);
    ctx.fillStyle = '#e5b875';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('CRETA GLOBAL LOCALISATION PIPELINE — 70+ LANGUAGES WORLDWIDE', 20, 27);

    // Left Panel: Multi-territory status
    ctx.fillStyle = '#121820';
    ctx.fillRect(20, 60, 480, 550);
    ctx.fillStyle = '#4a90e2';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('ACTIVE REGIONAL HUBS & STATUS', 40, 95);

    const regions = [
      { name: 'Indian Regional (Hindi, Bengali, Tamil, Telugu)', status: 'ACTIVE IN DUBBING', color: '#32d796' },
      { name: 'North America (English Neutral, US/CA)', status: 'MASTER CONFORM', color: '#32d796' },
      { name: 'Latin America (Spanish Neutral, Brazilian Portuguese)', status: 'LIP-SYNC QC', color: '#f2b561' },
      { name: 'European Union (French, German, Italian, Polish)', status: 'ADAPTATION LOCKED', color: '#32d796' },
      { name: 'Middle East & Gulf (Arabic Modern Standard)', status: 'VOICE CASTING', color: '#f2b561' },
      { name: 'East & Southeast Asia (Japanese, Korean, Indonesian)', status: 'SUBTITLE QC', color: '#32d796' }
    ];

    regions.forEach((r, idx) => {
      const y = 135 + idx * 75;
      ctx.fillStyle = '#18222d';
      ctx.beginPath();
      ctx.roundRect(40, y - 20, 440, 60, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12.5px sans-serif';
      ctx.fillText(r.name, 55, y);

      ctx.fillStyle = r.color;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`● ${r.status}`, 55, y + 24);
    });

    // Right Panel: Dual Transcreation Script
    ctx.fillStyle = '#121820';
    ctx.fillRect(520, 60, 480, 550);
    ctx.fillStyle = '#e5b875';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('LIP-SYNC TRANSCREATION & SUBTITLE CONFORM', 540, 95);

    const lines = [
      'ORIGINAL (EN): "Every second counts. Deliver the cut."',
      'HINDI DUB: "हर एक सेकंड कीमती है। फाइनल कट लॉक करो।"',
      'BENGALI DUB: "প্রতিটি সেকেন্ড গুরুত্বপূর্ণ। ফাইনাল কাট ডেলিভার করো।"',
      'SPANISH LATAM: "Cada segundo cuenta. Entrega el corte final."',
      'ARABIC DUB: "كل ثانية لها قيمتها. قم بتسليم النسخة النهائية."',
      'QC AUDIT: Sync Deviation < 0.04s [PASSED]'
    ];
    lines.forEach((l, i) => {
      ctx.fillStyle = i === lines.length - 1 ? '#32d796' : '#d5dedb';
      ctx.font = i === lines.length - 1 ? 'bold 12px monospace' : '12px sans-serif';
      ctx.fillText(l, 540, 145 + i * 55);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * AI Production Lab: Latent Consistency & Generative Engine
   */
  public static createAiLabScreen(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0c1015';
    ctx.fillRect(0, 0, 1024, 640);

    ctx.fillStyle = '#141c24';
    ctx.fillRect(0, 0, 1024, 40);
    ctx.fillStyle = '#00d2ff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('CRETA AI LAB — LATENT CHARACTER CONSISTENCY & VIDEO DIFFUSION', 20, 26);

    ctx.fillStyle = '#11171f';
    ctx.fillRect(20, 60, 420, 550);
    ctx.fillStyle = '#00d2ff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('WORKFLOW: HIGGSFIELD + KLING + RUNWAY GEN-3', 36, 95);

    ctx.fillStyle = '#8ea4ad';
    ctx.font = '12px monospace';
    const params = [
      'PROMPT: Cinematic vertical 9:16 drama shot,',
      'dramatic Rembrandt lighting, rain drops,',
      '35mm anamorphic cinema lens, 4k raw',
      '',
      'VOICE PIPELINE: ElevenLabs Consent Clone',
      'LATENT SEED: 948201948201',
      'TEMPORAL COHERENCE: 98.4%',
      'LORA 01: Character_Consistency [0.88]',
      'LORA 02: Cinematic_Lighting [0.72]',
      'FRAME INTERPOLATION: 24 -> 60 FPS',
      '',
      'STATUS: BATCH COMPLETED [24 / 24 SCENES]'
    ];
    params.forEach((p, idx) => {
      ctx.fillText(p, 36, 135 + idx * 24);
    });

    // Right panel: 4 Generated Frame Grid
    ctx.fillStyle = '#11171f';
    ctx.fillRect(460, 60, 540, 550);

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = 480 + col * 260;
        const y = 80 + row * 260;

        const g = ctx.createLinearGradient(x, y, x + 240, y + 230);
        g.addColorStop(0, '#1a334d');
        g.addColorStop(0.5, '#78432a');
        g.addColorStop(1, '#0c1a24');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(x, y, 240, 230, 6);
        ctx.fill();

        ctx.fillStyle = '#00d2ff';
        ctx.font = '11px sans-serif';
        ctx.fillText(`FRAME #${row * 2 + col + 1} — 100% SEED MATCH`, x + 10, y + 20);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
}
