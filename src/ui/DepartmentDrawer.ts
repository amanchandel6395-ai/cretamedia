import { DepartmentInfo } from '../data/studioData';
import { audioEngine } from '../audio/AudioEngine';

export class DepartmentDrawer {
  private element: HTMLElement;
  private currentDept: DepartmentInfo | null = null;
  private activeTab: 'overview' | 'services' | 'workflow' | 'equipment' = 'overview';
  public onStartProject?: (dept: DepartmentInfo) => void;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'department-drawer';
    this.element.id = 'departmentDrawer';
    document.body.appendChild(this.element);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  public open(dept: DepartmentInfo) {
    this.currentDept = dept;
    audioEngine.playClick(640);
    this.render();
    this.element.classList.add('open');
  }

  public close() {
    audioEngine.playClick(440);
    this.element.classList.remove('open');
  }

  public isOpen(): boolean {
    return this.element.classList.contains('open');
  }

  private render() {
    if (!this.currentDept) return;
    const d = this.currentDept;

    this.element.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-badge">${d.badge}</div>
        <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close drawer">✕</button>
      </div>

      <div class="drawer-hero">
        <h2 class="drawer-title">${d.name}</h2>
        <div class="drawer-tagline">${d.tagline}</div>
      </div>

      <div class="drawer-tabs">
        <button class="drawer-tab ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
        <button class="drawer-tab ${this.activeTab === 'services' ? 'active' : ''}" data-tab="services">Services</button>
        <button class="drawer-tab ${this.activeTab === 'workflow' ? 'active' : ''}" data-tab="workflow">Workflow</button>
        <button class="drawer-tab ${this.activeTab === 'equipment' ? 'active' : ''}" data-tab="equipment">Tech & Gear</button>
      </div>

      <div class="drawer-content">
        ${this.renderTabContent()}
      </div>

      <div class="drawer-footer">
        <button class="drawer-cta-btn" id="drawerStartProjectBtn">
          Start a Project with ${d.name.split('&')[0].trim()} ↗
        </button>
      </div>
    `;

    // Event listeners
    this.element.querySelector('#drawerCloseBtn')?.addEventListener('click', () => this.close());

    this.element.querySelectorAll('.drawer-tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).dataset.tab as any;
        this.activeTab = tab;
        audioEngine.playClick(580);
        this.render();
      });
    });

    this.element.querySelector('#drawerStartProjectBtn')?.addEventListener('click', () => {
      audioEngine.playClick(720);
      this.close();
      if (this.onStartProject && this.currentDept) {
        this.onStartProject(this.currentDept);
      }
    });
  }

  private renderTabContent(): string {
    if (!this.currentDept) return '';
    const d = this.currentDept;

    switch (this.activeTab) {
      case 'overview':
        return `
          <div class="tab-pane">
            <p class="drawer-body-copy">${d.overview}</p>
            
            ${d.media ? `
              <div class="drawer-media-box">
                ${d.media.type === 'video' ? `
                  <video src="${d.media.src}" controls loop muted playsinline autoplay></video>
                ` : `
                  <img src="${d.media.src}" alt="${d.name}" />
                `}
                <span class="drawer-media-caption">${d.media.caption}</span>
              </div>
            ` : ''}

            <div class="drawer-section-title">Department Personnel</div>
            <div class="drawer-personnel-list">
              ${d.characters.map(c => `
                <div class="drawer-personnel-item">
                  <div class="personnel-role">● ${c.role}</div>
                  <div class="personnel-task">${c.task}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'services':
        return `
          <div class="tab-pane">
            <div class="drawer-section-title">Core Capabilities</div>
            <ul class="drawer-bullet-list">
              ${d.services.map(s => `<li>${s}</li>`).join('')}
            </ul>

            <div class="drawer-section-title">Final Deliverables</div>
            <div class="drawer-pills">
              ${d.deliverables.map(del => `<span class="deliverable-pill">✓ ${del}</span>`).join('')}
            </div>
          </div>
        `;

      case 'workflow':
        return `
          <div class="tab-pane">
            <div class="drawer-section-title">Production Pipeline (Step-by-Step)</div>
            <div class="drawer-workflow-stepper">
              ${d.workflow.map(wf => `
                <div class="workflow-step">
                  <div class="step-num">${wf.step}</div>
                  <div class="step-info">
                    <h4>${wf.title}</h4>
                    <p>${wf.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'equipment':
        return `
          <div class="tab-pane">
            <div class="drawer-section-title">Studio Hardware & Architecture</div>
            <ul class="drawer-bullet-list">
              ${d.equipment.map(eq => `<li>${eq}</li>`).join('')}
            </ul>
            <div class="gear-assurance-box">
              <strong>Calibrated Quality Assurance:</strong>
              <p>All studio rooms are acoustically isolated and certified to international OTT broadcast standards (Netflix, Amazon Prime, Pocket FM, EBU R128).</p>
            </div>
          </div>
        `;
    }
  }
}
