import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarDatepickerDirective } from '../../../../../common/directives/datepicker';
import { MODULES, Mode, Module, dmyToIso, fmtDate, isoToDmy, todayIso } from '../induction.model';
import { InductionStore } from '../induction.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** Steps 1–4: pick the joiner and module, schedule the session, notify */
@Component({
  selector: 'app-induction-schedule-modal',
  standalone: true,
  imports: [AppSelect, ReactiveFormsModule, CalendarDatepickerDirective],
  templateUrl: './schedule-modal.html',
  styleUrl: './modals.scss',
})
export class ScheduleModal {
  private readonly store = inject(InductionStore);
  private readonly fb = inject(FormBuilder);

  readonly employeeOptions = this.store.employees.map((e) => ({
    label: e.name,
    value: e.empId,
    sub: `${e.empId} • ${e.role}`,
  }));
  readonly moduleOptions = MODULES.map((m) => ({ label: m.value, value: m.value, sub: m.label, icon: m.icon }));
  readonly modeOptions = [
    { label: 'In-person', value: 'In-person' },
    { label: 'Online (Meet / Zoom)', value: 'Online' },
    { label: 'Hybrid', value: 'Hybrid' },
  ];

  private readonly preset = this.store.modal();

  readonly form = this.fb.nonNullable.group({
    empId: [this.preset?.kind === 'schedule' ? (this.preset.empId ?? '') : '', Validators.required],
    module: [
      (this.preset?.kind === 'schedule' ? this.preset.module : undefined) ?? ('General Company Induction' as Module),
      Validators.required,
    ],
    title: ['', Validators.required],
    trainer: ['', Validators.required],
    date: [isoToDmy(todayIso()), Validators.required], // DD/MM/YYYY from the calendar picker
    time: ['11:00 AM - 12:00 PM', Validators.required],
    mode: ['In-person' as Mode],
    venue: [''],
    notifyEmail: [true],
    notifyWhatsApp: [true],
  });

  error(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && c.touched;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const notified = v.notifyEmail || v.notifyWhatsApp;
    const session = this.store.addSession({
      empId: v.empId,
      module: v.module,
      title: v.title.trim(),
      trainer: v.trainer.trim(),
      mode: v.mode,
      venue: v.venue.trim(),
      date: dmyToIso(v.date),
      time: v.time.trim(),
      notified,
      conducted: false,
      attendance: 'Pending',
      materials: '',
      assessment: 'Pending',
      rating: null,
      feedback: '',
      status: 'Scheduled',
    });

    const who = this.store.employee(v.empId)?.name ?? v.empId;
    const via = [v.notifyEmail && 'email', v.notifyWhatsApp && 'WhatsApp'].filter(Boolean).join(' & ');
    this.store.notify(
      `Session ${session.ref} scheduled for ${who} on ${fmtDate(session.date)}` + (notified ? ` — notified via ${via}.` : '.'),
    );
    this.store.close();
  }

  close(): void {
    this.store.close();
  }
}
