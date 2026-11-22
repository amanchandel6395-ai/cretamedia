import { CRETA_STUDIO_INFO, DEPARTMENTS, PORTFOLIO_PROJECTS } from '../data/studioData';
import { audioEngine } from '../audio/AudioEngine';

export class Accessible2DView {
  private element: HTMLElement;
  public onClose?: () => void;
  public onJumpTo3DDepartment?: (sceneIndex: number) => void;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'accessible-2d-view';
    this.element.id = 'accessible2DView';
    document.body.appendChild(this.element);

    this.render();
  }

  public open() {
    audioEngine.playClick(520);
    this.element.classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public close() {
    audioEngine.playClick(440);
    this.element.classList.remove('visible');
    if (this.onClose) this.onClose();
  }

  public isVisible(): boolean {
    return this.element.classList.contains('visible');
  }

  private render() {
    this.element.innerHTML = `
      <div class="view-2d-container">
        <!-- TOP BAR -->
        <header class="view-2d-header">
          <div class="brand">
            CRETA <span>MEDIA</span>
          </div>
          <div class="actions">
            <button class="switch-to-3d-btn" id="btnReturnTo3D">
              ← Return to 3D Virtual Studio
            </button>
          </div>
        </header>

        <!-- HERO SECTION -->
        <section class="section-2d hero-2d">
          <div class="eyebrow">${CRETA_STUDIO_INFO.tagline}</div>
          <h1>End-to-End Creative Production & Global Localisation Studio.</h1>
          <p class="lead-p">
            ${CRETA_STUDIO_INFO.positioning}
          </p>

          <div class="stats-row-2d">
            ${CRETA_STUDIO_INFO.stats.map(s => `
              <div class="stat-box">
                <span class="stat-num">${s.value}</span>
                <span class="stat-lbl">${s.label}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- DEPARTMENTS & SERVICES SECTION -->
        <section class="section-2d" id="departmentsSection">
          <div class="section-header-2d">
            <div class="eyebrow">OUR PRODUCTION ECOSYSTEM</div>
            <h2>9 Integrated Creative Departments</h2>
            <p>From the first screenplay beat to multi-language OTT broadcast masters.</p>
          </div>

          <div class="department-grid-2d">
            ${DEPARTMENTS.map(d => `
              <article class="dept-card-2d">
                <div class="card-top">
                  <span class="badge">${d.badge}</span>
                  <button class="jump-3d-link" data-scene-index="${d.sceneIndex}">
                    View in 3D ↗
                  </button>
                </div>
                <h3>${d.name}</h3>
                <div class="tagline">${d.tagline}</div>
                <p>${d.overview}</p>

                <div class="services-list-title">Key Services:</div>
                <ul class="services-mini-list">
                  ${d.services.slice(0, 4).map(s => `<li>${s}</li>`).join('')}
                </ul>

                <div class="gear-tag">
                  <strong>Equipped with:</strong> ${d.equipment[0] || 'Studio-grade hardware'}
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- CLIENT SHOWCASE PORTFOLIO -->
        <section class="section-2d" id="portfolioSection">
          <div class="section-header-2d">
            <div class="eyebrow">VERIFIED PRODUCTION TRACK RECORD</div>
            <h2>Stories for Platforms. Impact for Brands.</h2>
            <p>Work delivered for leading streaming apps, audio drama networks, and corporate brands.</p>
          </div>

          <div class="portfolio-grid-2d">
            ${PORTFOLIO_PROJECTS.map(p => `
              <div class="portfolio-card-2d">
                <div class="portfolio-thumb-wrap">
                  <img src="${p.thumbnail}" alt="${p.title}" loading="lazy" />
                  <span class="category-tag">${p.category}</span>
                </div>
                <div class="portfolio-info">
                  <small class="client">${p.client}</small>
                  <h4>${p.title}</h4>
                  <p>${p.description}</p>
                  <div class="role-box">
                    <strong>Role:</strong> ${p.role}
                  </div>
                  ${p.stats ? `<div class="perf-stats">★ ${p.stats}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- CLIENT TESTIMONIALS -->
        <section class="section-2d testimonials-2d">
          <div class="section-header-2d">
            <div class="eyebrow">CLIENT FEEDBACK</div>
            <h2>Trusted Across Continents</h2>
          </div>

          <div class="testimonials-grid-2d">
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <blockquote>“The voice-over editing and graphic design work have always been top-notch, with barely any need for corrections. The creativity and professionalism have played a huge role in our growth.”</blockquote>
              <cite>— David Dubai · Bluesky Ventures</cite>
            </div>
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <blockquote>“The creativity and strategy truly elevate a brand to the next level. Everything is handled professionally, with minimal need for corrections.”</blockquote>
              <cite>— Pran Food Limited</cite>
            </div>
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <blockquote>“The team is highly creative and strategic, delivering content that truly resonates with the audience. Everything is handled so professionally.”</blockquote>
              <cite>— Gaggi Canada · Brightsun</cite>
            </div>
          </div>
        </section>

        <!-- CONTACT & CONSULTATION FORM -->
        <section class="section-2d contact-2d" id="contactSection">
          <div class="contact-box-2d">
            <div class="contact-left">
              <div class="eyebrow">LET’S COLLABORATE</div>
              <h2>Ready to Bring Your Story to Life?</h2>
              <p>Contact our production desks directly in Kolkata or book an online virtual session.</p>

              <div class="contact-coords">
                <div>✉ <a href="mailto:${CRETA_STUDIO_INFO.contact.email}">${CRETA_STUDIO_INFO.contact.email}</a></div>
                <div>◉ <a href="${CRETA_STUDIO_INFO.contact.whatsapp}" target="_blank" rel="noreferrer">WhatsApp: ${CRETA_STUDIO_INFO.contact.phone}</a></div>
                <div>⌖ ${CRETA_STUDIO_INFO.contact.address}</div>
              </div>
            </div>

            <div class="contact-right">
              <form class="form-2d" id="form2d">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email Address" required />
                <select name="service">
                  <option value="Dubbing & Voice-over">Multi-Language Dubbing (70+ Languages)</option>
                  <option value="Vertical Drama Production">Vertical Drama & Microdrama Series</option>
                  <option value="Video Editing & Post">Video Editing & Color Grading</option>
                  <option value="AI Video Production">AI Video & Generative Production</option>
                  <option value="Audio Mixing & Mastering">Audio Mixing & Dolby Mastering</option>
                  <option value="Scriptwriting & Translation">Scriptwriting & Cultural Adaptation</option>
                </select>
                <textarea name="message" rows="4" placeholder="Tell us about your production..." required></textarea>
                <button type="submit" class="submit-2d-btn">Send Enquiry ↗</button>
              </form>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="footer-2d">
          <div>© ${new Date().getFullYear()} CRETA MEDIA · All Rights Reserved.</div>
          <div>Stories. Made to Travel.</div>
        </footer>
      </div>
    `;

    // Event listeners
    this.element.querySelector('#btnReturnTo3D')?.addEventListener('click', () => {
      this.close();
    });

    this.element.querySelectorAll('.jump-3d-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sceneIdx = parseInt((e.currentTarget as HTMLElement).dataset.sceneIndex!, 10);
        this.close();
        if (this.onJumpTo3DDepartment) {
          this.onJumpTo3DDepartment(sceneIdx);
        }
      });
    });

    this.element.querySelector('#form2d')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      const name = data.get('name');
      const email = data.get('email');
      const service = data.get('service');
      const message = data.get('message');

      const subject = encodeURIComponent(`[CRETA Website Enquiry] ${service} - ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`);
      window.location.href = `mailto:${CRETA_STUDIO_INFO.contact.email}?subject=${subject}&body=${body}`;
    });
  }
}
