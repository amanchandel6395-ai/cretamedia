import { CRETA_STUDIO_INFO } from '../data/studioData';
import { audioEngine } from '../audio/AudioEngine';

export class ContactModal {
  private element: HTMLElement;
  private defaultSubject: string = 'Production Enquiry';

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'contact-modal-backdrop';
    this.element.id = 'contactModal';
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

  public open(subject: string = 'Production Enquiry', prefilledNote: string = '') {
    this.defaultSubject = subject;
    audioEngine.playClick(650);
    this.render(prefilledNote);
    this.element.classList.add('open');
  }

  public close() {
    audioEngine.playClick(440);
    this.element.classList.remove('open');
  }

  public isOpen(): boolean {
    return this.element.classList.contains('open');
  }

  private render(prefilledNote: string = '') {
    this.element.innerHTML = `
      <div class="contact-modal-dialog">
        <div class="modal-header">
          <div class="modal-badge">START A PRODUCTION</div>
          <button class="modal-close-btn" id="contactCloseBtn" aria-label="Close modal">✕</button>
        </div>

        <div class="contact-hero">
          <h2>Let’s Create Something Together.</h2>
          <p>Tell us about your project, target platforms, or localisation needs. We respond within 24 hours.</p>
        </div>

        <div class="direct-contact-bar">
          <a href="mailto:${CRETA_STUDIO_INFO.contact.email}" class="direct-link">
            ✉ ${CRETA_STUDIO_INFO.contact.email}
          </a>
          <a href="${CRETA_STUDIO_INFO.contact.whatsapp}" target="_blank" rel="noreferrer" class="direct-link whatsapp-link">
            ◉ WhatsApp: ${CRETA_STUDIO_INFO.contact.phone}
          </a>
        </div>

        <form class="contact-form" id="studioEnquiryForm">
          <div class="form-row">
            <div class="form-group">
              <label>Your Name *</label>
              <input type="text" name="name" required placeholder="Director / Producer name" />
            </div>
            <div class="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" required placeholder="producer@platform.com" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Company / Platform</label>
              <input type="text" name="company" placeholder="e.g. OTT Platform, Studio, Brand" />
            </div>
            <div class="form-group">
              <label>Service Category</label>
              <select name="service">
                <option value="Dubbing & Voice-over">Multi-Language Dubbing (70+ Languages)</option>
                <option value="Vertical Drama Production">Vertical Drama & Micro-Series Production</option>
                <option value="AI Film & Video Production">AI Film & Generative Production</option>
                <option value="Video Editing & Post-Production">Video Editing & DaVinci Color Grading</option>
                <option value="Audio Mixing & Mastering">Audio Mixing, Foley & Mastering</option>
                <option value="Translation & Localisation">Scriptwriting, Transcreation & Localisation</option>
                <option value="TV Commercials & Ads">Commercial & TVC Production</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Project Details & Scope *</label>
            <textarea name="message" rows="4" required placeholder="Describe your storyline, target languages, episode counts, or timeline expectations...">${prefilledNote}</textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">
              Submit Production Enquiry ↗
            </button>
            <span class="form-note">Prepares ready-to-send brief directly to our production desk.</span>
          </div>
        </form>
      </div>
    `;

    this.element.querySelector('#contactCloseBtn')?.addEventListener('click', () => this.close());

    this.element.querySelector('#studioEnquiryForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const data = new FormData(form);

      const name = data.get('name');
      const email = data.get('email');
      const company = data.get('company') || 'N/A';
      const service = data.get('service');
      const message = data.get('message');

      const subject = encodeURIComponent(`[CRETA Studio Enquiry] ${service} - ${name} (${company})`);
      const body = encodeURIComponent(
        `Hello CRETA MEDIA Production Team,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company/Platform: ${company}\n` +
        `Service: ${service}\n\n` +
        `Project Brief:\n${message}\n\n` +
        `Sent via CRETA MEDIA Virtual Studio Experience`
      );

      window.location.href = `mailto:${CRETA_STUDIO_INFO.contact.email}?subject=${subject}&body=${body}`;
      this.close();
    });
  }
}
