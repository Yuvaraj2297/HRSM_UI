import { Component, inject } from '@angular/core';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { STEPS } from './induction.model';
import { InductionStore } from './induction.store';
import { CertificateModal } from './modals/certificate-modal';
import { InviteModal } from './modals/invite-modal';
import { ProgressModal } from './modals/progress-modal';
import { ScheduleModal } from './modals/schedule-modal';
import { ClearancePanel } from './parts/clearance-panel';
import { SessionsPanel } from './parts/sessions-panel';

/**
 * Induction & Orientation — page shell.
 *   KPIs · 11-step workflow bar · Sessions / Clearance tabs · modals
 * State lives in InductionStore (provided here, shared by every child).
 */
@Component({
  selector: 'app-induction-orientation',
  standalone: true,
  imports: [AppStatCard, SessionsPanel, ClearancePanel, ScheduleModal, ProgressModal, InviteModal, CertificateModal],
  providers: [InductionStore],
  templateUrl: './induction-orientation.html',
  styleUrl: './induction-orientation.scss',
})
export class InductionOrientation {
  readonly store = inject(InductionStore);
  readonly steps = STEPS;
}
