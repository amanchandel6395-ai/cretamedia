import { PORTFOLIO_PROJECTS, PortfolioProject } from '../data/studioData';
import { audioEngine } from '../audio/AudioEngine';

export class ClientGalleryModal {
  private element: HTMLElement;
  private currentProject: PortfolioProject | null = null;
  public onRequestQuote?: (project: PortfolioProject) => void;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'gallery-modal-backdrop';
    this.element.id = 'galleryModal';
    document.body.appendChild(this.element);

    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  public open(projectId: string) {
    const proj = PORTFOLIO_PROJECTS.find(p => p.id === projectId) || PORTFOLIO_PROJECTS[0];
    this.currentProject = proj;
    audioEngine.playClick(620);
    this.render();
    this.element.classList.add('open');
  }

  public close() {
    audioEngine.playClick(440);
    this.element.classList.remove('open');
    // Pause any playing modal video
    const video = this.element.querySelector('video');
    if (video) video.pause();
  }

  public isOpen(): boolean {
    return this.element.classList.contains('open');
  }

  private render() {
    if (!this.currentProject) return;
    const p = this.currentProject;

    this.element.innerHTML = `
      <div class="gallery-modal-dialog">
        <div class="modal-header">
          <div class="modal-badge">${p.category.toUpperCase()} CASE STUDY</div>
          <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">✕</button>
        </div>

        <div class="modal-media-container">
          ${p.videoUrl ? `
            <video src="${p.videoUrl}" controls autoplay loop playsinline class="modal-video"></video>
          ` : `
            <img src="${p.thumbnail}" alt="${p.title}" class="modal-image" />
          `}
        </div>

        <div class="modal-body">
          <div class="modal-client-tag">${p.client}</div>
          <h2 class="modal-title">${p.title}</h2>
          <p class="modal-desc">${p.description}</p>

          <div class="modal-meta-grid">
            <div class="meta-item">
              <span class="meta-label">CRETA MEDIA Role</span>
              <span class="meta-val">${p.role}</span>
            </div>
            ${p.languages ? `
              <div class="meta-item">
                <span class="meta-label">Languages Produced</span>
                <span class="meta-val">${p.languages.join(' · ')}</span>
              </div>
            ` : ''}
            ${p.stats ? `
              <div class="meta-item">
                <span class="meta-label">Performance & Reach</span>
                <span class="meta-val highlight-val">${p.stats}</span>
              </div>
            ` : ''}
          </div>

          <div class="modal-related-projects">
            <div class="related-label">Other Featured Productions</div>
            <div class="related-thumbnails">
              ${PORTFOLIO_PROJECTS.map(item => `
                <button class="related-card ${item.id === p.id ? 'active' : ''}" data-project-id="${item.id}">
                  <img src="${item.thumbnail}" alt="${item.title}" />
                  <span>${item.title.split(' ')[0]} ${item.title.split(' ')[1] || ''}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-cta-btn" id="modalQuoteBtn">
            Request Similar Production Quote ↗
          </button>
        </div>
      </div>
    `;

    this.element.querySelector('#modalCloseBtn')?.addEventListener('click', () => this.close());

    this.element.querySelectorAll('.related-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.projectId!;
        this.open(id);
      });
    });

    this.element.querySelector('#modalQuoteBtn')?.addEventListener('click', () => {
      this.close();
      if (this.onRequestQuote && this.currentProject) {
        this.onRequestQuote(this.currentProject);
      }
    });
  }
}
