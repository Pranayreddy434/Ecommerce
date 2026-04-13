import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="page-shell footer">
      <div>
        <strong>ShopVerse</strong>
        <p class="muted">A portfolio-ready Angular + Spring Boot commerce experience with a polished retail feel.</p>
      </div>
      <div class="footer-links">
        <span>Fast checkout</span>
        <span>Responsive layout</span>
        <span>JWT secured APIs</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin: 48px auto 24px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      border-top: 1px solid var(--border);
      color: var(--muted);
    }

    .footer p {
      margin-bottom: 0;
      max-width: 460px;
    }

    .footer-links {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .footer {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
