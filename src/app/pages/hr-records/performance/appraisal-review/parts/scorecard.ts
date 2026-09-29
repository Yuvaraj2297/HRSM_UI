import { Component, input } from '@angular/core';
import { Appraisal, fmtDate } from '../appraisal.model';

/** The final merit scorecard — shown in the employee portal (stage 5) and the scorecard modal */
@Component({
  selector: 'app-appraisal-scorecard',
  standalone: true,
  template: `
    @let a = appraisal();
    @if (a.mgr; as m) {
      <section class="card-custom">
        <header class="card-custom-header">
          <div>
            <h3 class="card-custom-title scorecard-brand">GHARUDA HRMS</h3>
            <small class="text-muted">Merit Performance Scorecard · FY 2025-26</small>
          </div>
          <span class="status-pill status-success gap-1"><i class="bi bi-patch-check-fill"></i> Completed</span>
        </header>
        <div class="card-custom-body">

        <div class="scorecard-who">
          <div><span>Employee</span><strong>{{ a.name }}</strong><small>{{ a.id }}</small></div>
          <div><span>Role</span><strong>{{ a.role }}</strong></div>
          <div><span>Department</span><strong>{{ a.dept }}</strong></div>
        </div>

        <ol class="scorecard-trail" aria-label="Rating trail">
          <li><span>Self</span><strong>{{ a.self.rating.toFixed(1) }}</strong></li>
          <li><span>Team Lead</span><strong>{{ a.tl?.rating?.toFixed(1) }}</strong></li>
          <li><span>HR</span><strong>{{ a.hr?.rating?.toFixed(1) }}</strong></li>
          <li class="is-final"><span>Manager (final)</span><strong>{{ m.rating.toFixed(1) }}</strong></li>
        </ol>

        <blockquote class="review-card-remarks">
          <strong>Manager's note</strong> — “{{ m.remarks }}”
        </blockquote>

        <div class="scorecard-outcome">
          <div><span>Salary increment</span><strong>{{ m.hike }}%</strong></div>
          <div><span>Promotion</span><strong>{{ m.promotion || 'None this cycle' }}</strong></div>
          <div><span>Signed off</span><strong>{{ fmtDate(m.date) }}</strong><small>{{ m.by }}</small></div>
        </div>
        </div>
      </section>
    }
  `,
  styleUrl: './parts.scss',
})
export class Scorecard {
  readonly appraisal = input.required<Appraisal>();
  readonly fmtDate = fmtDate;
}
