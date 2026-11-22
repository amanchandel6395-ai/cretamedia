export interface DepartmentInfo {
  id: string;
  sceneIndex: number;
  name: string;
  tagline: string;
  badge: string;
  overview: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  };
  services: string[];
  workflow: { step: string; title: string; description: string }[];
  deliverables: string[];
  equipment: string[];
  sceneMedia?: {
    type: 'video' | 'image';
    src: string;
    caption: string;
  };
}

export const CRETA_STUDIO_INFO = {
  brand: 'CRETA MEDIA',
  tagline: 'Where Cinematic Craft Meets Technology.',
  positioning: 'Creative production, localisation in 70+ languages, and practical business technology.',
  stats: [
    { value: '6+', label: 'Years of Experience' },
    { value: '400+', label: 'Projects Delivered' },
    { value: '300+', label: 'Happy Clients Worldwide' },
    { value: '70+', label: 'Languages Supported' }
  ],
  verifiedClients: [
    { name: 'David Dubai', company: 'Bluesky Ventures', role: 'Global Partner' },
    { name: 'Pran Food Limited', company: 'Pran Group', role: 'Corporate Media' },
    { name: 'Gaggi Canada', company: 'Brightsun', role: 'Media Lead' }
  ],
  contact: {
    email: 'cretamediaofficial@gmail.com',
    phone: '+91 9068734941',
    whatsapp: 'https://wa.link/mcjxfk',
    address: 'Kolkata, West Bengal, India',
    portfolioDrive: 'https://drive.google.com/drive/folders/1RajqmMkmeoIZvNyE-Ar8KBrQRPGqwH8C'
  }
};

/**
 * EXACT 9 SCENES REQUESTED BY CREATIVE DIRECTION
 */
export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'exterior',
    sceneIndex: 0,
    name: 'Exterior Night Arrival',
    tagline: 'Where Cinematic Craft Meets Tech',
    badge: 'SCENE 01 / EXTERIOR',
    overview: 'Welcome to CRETA MEDIA headquarters. Night-time architectural environment with illuminated company signage, moving light beams, and subtle atmospheric mist.',
    camera: {
      position: [0, 2.0, 18.0],
      target: [0, 2.2, 8.5],
      fov: 55
    },
    services: [
      'Creative Production & Direction',
      'Multilingual Localisation (70+ Languages)',
      'AI-Powered Microdramas & Films',
      'Practical Business Technology & SaaS'
    ],
    workflow: [
      { step: '01', title: 'Arrival', description: 'Step into our physical-digital studio headquarters.' },
      { step: '02', title: 'Continuous Tour', description: 'Scroll to walk seamlessly through each specialized department.' },
      { step: '03', title: 'Collaboration', description: 'Connect directly with our creative leadership.' }
    ],
    deliverables: ['Broadcast Master Stems', 'Multilingual Releases', 'Turnkey Production'],
    equipment: ['Architectural Lighting Rig', 'Glass Facade Portal', 'Atmospheric Fog Diffusers']
  },
  {
    id: 'lobby',
    sceneIndex: 1,
    name: 'Lobby & Glass Entrance Portal',
    tagline: 'Stories for Platforms. Impact for Brands.',
    badge: 'SCENE 02 / LOBBY',
    overview: 'Automatic sliding glass doors open smoothly as you enter the central reception. Polished Italian terrazzo, minimalist reception desk, authentic partner plaques (Bluesky Ventures Dubai, Pran Food, Brightsun Canada), and studio milestones.',
    camera: {
      position: [0, 1.8, 6.0],
      target: [0, 1.6, 1.5],
      fov: 52
    },
    services: [
      'Client Onboarding & Creative Discovery',
      'Multi-Territory Project Coordination',
      'Agile Production Milestone Scheduling'
    ],
    workflow: [
      { step: '01', title: 'Brief & Discovery', description: 'Review scripts, assets, target languages, and platform requirements.' },
      { step: '02', title: 'Approval Milestones', description: 'Pre-production treatments and casting sign-offs before roll.' }
    ],
    deliverables: ['Project Treatment Bibles', 'Budget & Timeline Milestone Schedule'],
    equipment: ['Italian Terrazzo Floor', 'Smoked Walnut Desk', 'Partner Recognition Plaque']
  },
  {
    id: 'dubbing',
    sceneIndex: 2,
    name: 'Dubbing Department',
    tagline: 'Expressive Voices Across 70+ Languages',
    badge: 'SCENE 03 / DUBBING',
    overview: 'Professional acoustic dubbing isolation suite. Suspended gold condenser microphones, acoustic walnut diffusers, recording booth glass, and live waveform sync monitors.',
    camera: {
      position: [-4.2, 1.7, -3.2],
      target: [-7.5, 1.6, -3.2],
      fov: 50
    },
    services: [
      'Native Voice Casting & Directed Dubbing',
      'Lip-Sync Character Adaptation',
      'Dialogue Editing, Cleaning & Stems',
      'Linguistic & Cultural Quality Control'
    ],
    workflow: [
      { step: '01', title: 'Casting', description: 'Voice auditions matching age, character and tone.' },
      { step: '02', title: 'Directed Session', description: 'Directors guide native artists through recording and pickups.' },
      { step: '03', title: 'Dialogue Sync', description: 'Cleaning, balance with music/effects, and sync lock.' }
    ],
    deliverables: ['Isolated Dialogue Stems (24-bit/96kHz)', 'M&E Stems', 'QC Approved Audio'],
    equipment: ['Neumann Style Condenser Mic', 'Acoustic Walnut Slat Diffusers', 'Sync Monitor Screen'],
    sceneMedia: {
      type: 'video',
      src: './assets/videos/dubbing-session.mp4',
      caption: 'Live Multilingual Dubbing Session'
    }
  },
  {
    id: 'localization',
    sceneIndex: 3,
    name: 'Localization Department',
    tagline: 'One Coordinated Pipeline for 70+ Languages',
    badge: 'SCENE 04 / LOCALIZATION',
    overview: 'Global content transcreation hub. Interactive holographic world globe, glowing data arcs connecting international release hubs, subtitle conform pipelines, and cultural adaptation workflows.',
    camera: {
      position: [0, 1.9, -9.5],
      target: [0, 1.8, -12.0],
      fov: 54
    },
    services: [
      '70+ Languages Translation & Transcreation',
      'Cultural & Humor Adaptation (No Literal Machine Errors)',
      'Time-Coded Multilingual Subtitles (.SRT / .VTT / Burned-in)',
      'International Platform Loudness Compliance'
    ],
    workflow: [
      { step: '01', title: 'Translation', description: 'Native specialists translate meaning, emotion, and timing.' },
      { step: '02', title: 'Subtitles', description: 'Time-coded captions and on-screen text adaptation.' },
      { step: '03', title: 'QC & Packaging', description: 'Multi-territory subtitle and audio stem bundles.' }
    ],
    deliverables: ['Timed Subtitles in 70+ Languages', 'Localised Graphics', 'Linguistic QC Reports'],
    equipment: ['3D Holographic World Data Sphere', 'Language Flight Arcs', 'Conform Monitors']
  },
  {
    id: 'editing',
    sceneIndex: 4,
    name: 'Video Editing Bay',
    tagline: 'Human-Led Finishing Enhanced with AI',
    badge: 'SCENE 05 / EDITING',
    overview: 'Cinematic post-production bay. Dual 32-inch OLED reference displays, hardware color grading panels, multi-track timelines, and real-time Before/After log-to-graded color transitions.',
    camera: {
      position: [4.2, 1.7, -14.5],
      target: [7.5, 1.6, -14.5],
      fov: 50
    },
    services: [
      '4K HDR DaVinci Resolve Color Grading',
      'AI Dialogue Cleanup & Transcript-based Cuts',
      'Rotoscoping, Object Removal & Generative Inserts',
      'Motion Graphics, Title Sequences & Social Cutdowns'
    ],
    workflow: [
      { step: '01', title: 'Rough Cut', description: 'Pacing, narrative arc, and emotional rhythm.' },
      { step: '02', title: 'Color & Conform', description: 'ACEScct HDR grading on calibrated OLED panels.' },
      { step: '03', title: 'Master Finishing', description: 'ProRes 4444 XQ and platform-ready deliveries.' }
    ],
    deliverables: ['4K HDR Masters', 'Social & Trailer Cutdowns', 'Color Graded Stems'],
    equipment: ['Dual OLED Reference Monitors', 'Color Grading Panel', 'DaVinci Timeline Engine'],
    sceneMedia: {
      type: 'video',
      src: './assets/videos/editing-session.mp4',
      caption: 'Real-time DaVinci Video Finishing Suite'
    }
  },
  {
    id: 'audio-mixing',
    sceneIndex: 5,
    name: 'Audio Mixing Theater',
    tagline: 'Dolby Atmos Spatial Depth & Immersion',
    badge: 'SCENE 06 / AUDIO THEATER',
    overview: 'Subterranean Dolby Atmos style mixing auditorium. Stepped acoustic ceiling, surround sound speaker array, bass traps, and cinematic audio particle soundfield undulating in the room.',
    camera: {
      position: [-4.2, 1.7, -19.5],
      target: [-7.5, 1.6, -19.5],
      fov: 52
    },
    services: [
      'Dolby Atmos 7.1.4 Immersive Spatial Mix',
      'Dialogue Spectral Cleanup & De-noising',
      'Foley & Sound Design Architecture',
      'Broadcast Loudness Leveling (-24 LKFS / -27 LUFS)'
    ],
    workflow: [
      { step: '01', title: 'Track Cleanup', description: 'Dialogue restoration and noise floor removal.' },
      { step: '02', title: 'Spatial Placement', description: 'Positioning audio objects in 3D hemispherical space.' },
      { step: '03', title: 'Print Masters', description: 'Atmos ADM BWF and stereo fold-down deliverables.' }
    ],
    deliverables: ['Dolby Atmos Master ADM Files', '5.1 / 7.1 Surround Mixes', 'Broadcast Stereo Stems'],
    equipment: ['Digital Mixing Console', 'Surround Acoustic Monitors', 'Spatial Soundfield Ring']
  },
  {
    id: 'ai-lab',
    sceneIndex: 6,
    name: 'AI Production Lab',
    tagline: 'AI-Powered. Human-Directed.',
    badge: 'SCENE 07 / AI LAB',
    overview: 'Futuristic research and production cleanroom. Obsidian glass surfaces, glowing cyan/gold neural conduits, rotating holographic wireframe character, voice cloning spectrum, and real-time generative video pipelines.',
    camera: {
      position: [4.2, 1.8, -24.5],
      target: [7.5, 1.6, -24.5],
      fov: 52
    },
    services: [
      'AI Micro Drama Production (Higgsfield, Kling, Runway)',
      'Character Latent Consistency Engines',
      'Consent-Based Voice Cloning (ElevenLabs)',
      'AI Video Inpainting & Autonomous Business SaaS'
    ],
    workflow: [
      { step: '01', title: 'Visual Bible', description: 'Character references and consistent latent seeds.' },
      { step: '02', title: 'Shot Generation', description: 'Motion directing and multi-angle scene generation.' },
      { step: '03', title: 'Human Finishing', description: 'Frame-by-frame editorial review and retouching.' }
    ],
    deliverables: ['Vertical Microdrama Episodes', 'Character Bibles', 'AI Video Cutdowns'],
    equipment: ['Neural Diffusion Cluster', 'Voice Spectrogram Display', 'Holographic Character Bust'],
    sceneMedia: {
      type: 'video',
      src: './assets/videos/microdrama-scene-02.mp4',
      caption: 'Generative AI Character & Video R&D'
    }
  },
  {
    id: 'soundstage',
    sceneIndex: 7,
    name: 'Production Floor & Soundstage',
    tagline: 'Live Cinema Craft on Studio Sets',
    badge: 'SCENE 08 / SOUNDSTAGE',
    overview: 'Double-height film production floor. Green screen infinity cyclorama, cinema camera rig on motorized tracking dolly, overhead high-CRI softbox lighting grid, and 9:16 vertical microdrama sets.',
    camera: {
      position: [-4.2, 2.0, -29.5],
      target: [-7.5, 1.8, -29.5],
      fov: 55
    },
    services: [
      'Vertical 9:16 Microdrama Live-Action Filming',
      'Green Screen & Virtual Production Cyclorama',
      'Cinematic Commercials & Branded Content',
      'Multi-Camera Lighting & Soundstage Sets'
    ],
    workflow: [
      { step: '01', title: 'Stage Setup', description: 'Lighting grid calibration and camera tracking.' },
      { step: '02', title: 'Filming', description: 'Live actor direction with instant sync playback.' },
      { step: '03', title: 'Wrap & Ingest', description: 'High-speed SAN ingest for same-day editorial.' }
    ],
    deliverables: ['Raw 4K Cinema Footage', 'Plate Composites', 'Vertical Microdrama Takes'],
    equipment: ['Cinema Camera on Motorized Dolly', 'High-CRI Softbox Lights', 'Infinity Cyclorama Wall'],
    sceneMedia: {
      type: 'video',
      src: './assets/videos/microdrama-01.mp4',
      caption: 'Live Microdrama Soundstage Production'
    }
  },
  {
    id: 'showcase-hall',
    sceneIndex: 8,
    name: 'Grand Showcase Hall',
    tagline: "Let's Create Something That Reaches The World.",
    badge: 'SCENE 09 / SHOWCASE',
    overview: 'Monumental presentation hall. Massive 20-meter curved panoramic LED wall cycling verified production reels, floating infinity platform, volumetric golden light beams, and direct interactive portals to connect with the studio.',
    camera: {
      position: [0, 2.0, -35.0],
      target: [0, 2.2, -39.2],
      fov: 54
    },
    services: [
      'Global Production Commissioning',
      'Direct Studio WhatsApp Connect',
      'Full Portfolio Google Drive Access'
    ],
    workflow: [
      { step: '01', title: 'Select Service', description: 'Microdramas, 70+ Dubbing, Video Editing or AI.' },
      { step: '02', title: 'Instant Brief', description: 'Connect directly with studio head on WhatsApp.' },
      { step: '03', title: 'Launch', description: 'From concept treatment to global release.' }
    ],
    deliverables: ['Production Partnership', 'Direct Studio Access'],
    equipment: ['Curved Panoramic LED Display Wall', 'Volumetric Spotlight Array', 'Infinity Platform'],
    sceneMedia: {
      type: 'video',
      src: './assets/videos/creta-door-opening-animation.mp4',
      caption: 'CRETA Studio Master Production Reel'
    }
  }
];

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  role: string;
  stats?: string;
  thumbnail: string;
  videoSrc?: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'project-dubbing-multilingual',
    title: 'Multilingual Dubbing & Lip-Sync',
    client: 'David Dubai · Bluesky Ventures',
    category: 'Dubbing & Localization',
    description: 'Full voiceover editing, native character casting, and dialogue lip-sync adaptation across international markets with zero corrections.',
    role: 'Voice Casting, Directed Dubbing, Dialogue Stems & QC',
    stats: '99.8% Client Approval · Multi-Territory Delivery',
    thumbnail: './assets/images/creta-voice-studio.png',
    videoSrc: './assets/videos/dubbing-session.mp4'
  },
  {
    id: 'project-corporate-media',
    title: 'Corporate Media & Brand Film',
    client: 'Pran Food Limited · Pran Group',
    category: 'Creative Production & Post',
    description: 'High-impact commercial video production, dynamic narrative pacing, ACEScct HDR 4K color grading, and broadcast sound design.',
    role: 'Editorial Finishing, DaVinci Color Grading, Audio Stems',
    stats: 'Delivered for Multi-Channel Corporate Distribution',
    thumbnail: './assets/images/creta-edit-suite.png',
    videoSrc: './assets/videos/editing-session.mp4'
  },
  {
    id: 'project-broadcast-creative',
    title: 'Strategic Content & Digital Campaign',
    client: 'Gaggi Canada · Brightsun',
    category: 'Campaign & Strategy',
    description: 'Highly creative and strategic media campaign resonating across diverse audience demographics with professional execution.',
    role: 'Creative Direction, Transcreation & Multilingual Packaging',
    stats: 'Zero-Correction Delivery · Full Broadcast Compliance',
    thumbnail: './assets/images/creta-social-floor.png',
    videoSrc: './assets/videos/creta-door-opening-animation.mp4'
  },
  {
    id: 'project-vertical-microdrama',
    title: 'AI-Powered Vertical Microdrama',
    client: 'CRETA Original Production',
    category: 'AI Microdramas',
    description: '9:16 mobile-first episodic drama leveraging cutting-edge latent engines: Higgsfield, Kling, Runway Gen-3, and ElevenLabs voice cloning.',
    role: 'Generative AI Pipeline, Direction, Character Latent Consistency',
    stats: 'Multi-Million Engagement Pacing · 24-48h Rapid Stems',
    thumbnail: './assets/images/creta-studio-hero-concept.png',
    videoSrc: './assets/videos/microdrama-01.mp4'
  }
];
