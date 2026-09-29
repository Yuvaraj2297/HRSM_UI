import {
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

/**
 * Option equality: '', null and undefined all mean "nothing picked" (forms here start
 * empty as either), and object values match by content — so a form patched with a
 * copy of an option object still shows it selected.
 */
export function sameOption(a: unknown, b: unknown): boolean {
  if (Object.is(a, b) || (isEmpty(a) && isEmpty(b))) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * The app's dropdown: Bootstrap `form-select` look + search box + clear (✕) button.
 * Works with formControlName, formControl and [(ngModel)] like any input.
 *
 *   <app-select formControlName="dept" [options]="deptOptions"
 *               optionLabel="label" optionValue="value" placeholder="All departments" />
 *
 * - options without optionLabel/optionValue are used as-is (strings, numbers)
 * - optionSub shows a second, muted line per option (e.g. employee ID • role)
 * - the options panel is moved to <body>, so modals and scrolling tables never clip it
 */
@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './app-select.html',
  styleUrl: './app-select.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AppSelect), multi: true }],
  host: {
    class: 'app-select',
    '[class.is-open]': 'open()',
    '[class.is-disabled]': 'disabled()',
    '[class.is-sm]': "size() === 'sm'",
  },
})
export class AppSelect implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);

  // ---------------------------------------------------------------- inputs
  readonly options = input<readonly any[] | null | undefined>([]);
  readonly optionLabel = input<string>();
  readonly optionValue = input<string>();
  readonly optionSub = input<string>();
  readonly placeholder = input('Select');
  /** show the search box */
  readonly filter = input(true);
  /** show the ✕ button when something is picked */
  readonly showClear = input(true);
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly size = input<'sm' | 'md'>('md');
  readonly emptyMessage = input('No results');

  // ---------------------------------------------------------------- state
  readonly listId = `app-select-list-${++nextId}`;
  readonly value = signal<unknown>(null);
  readonly disabled = signal(false);
  readonly open = signal(false);
  readonly query = signal('');
  readonly active = signal(0);
  readonly dropUp = signal(false);
  readonly pos = signal({ top: 0, left: 0, width: 0 });

  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');

  private onChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  // ---------------------------------------------------------------- derived
  readonly items = computed(() => (this.options() ?? []).map((o) => ({
    raw: o,
    value: this.optionValue() ? o?.[this.optionValue()!] : o,
    label: String(this.optionLabel() ? o?.[this.optionLabel()!] ?? '' : o ?? ''),
    sub: this.optionSub() ? String(o?.[this.optionSub()!] ?? '') : '',
  })));

  readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((i) => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q));
  });

  readonly selected = computed(() => this.items().find((i) => sameOption(i.value, this.value())) ?? null);
  readonly hasValue = computed(() => this.selected() !== null);

  constructor() {
    // keep the panel in <body> while open (escapes modal transforms / overflow clipping)
    effect(() => {
      const el = this.panel()?.nativeElement;
      if (el && el.parentElement !== this.doc.body) this.doc.body.appendChild(el);
    });

    const onDocDown = (e: Event) => {
      if (!this.open()) return;
      const t = e.target as Node;
      if (this.host.nativeElement.contains(t) || this.panel()?.nativeElement.contains(t)) return;
      this.close(false);
    };
    const onReflow = (e: Event) => {
      if (!this.open()) return;
      // scrolling inside the panel's own list must not move it
      if (this.panel()?.nativeElement.contains(e.target as Node)) return;
      this.place();
    };
    this.doc.addEventListener('mousedown', onDocDown, true);
    this.doc.defaultView?.addEventListener('resize', onReflow);
    this.doc.addEventListener('scroll', onReflow, true);

    inject(DestroyRef).onDestroy(() => {
      this.doc.removeEventListener('mousedown', onDocDown, true);
      this.doc.defaultView?.removeEventListener('resize', onReflow);
      this.doc.removeEventListener('scroll', onReflow, true);
      this.panel()?.nativeElement.remove();
    });
  }

  // ---------------------------------------------------------------- ControlValueAccessor
  writeValue(v: unknown): void {
    this.value.set(v);
  }

  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(d: boolean): void {
    this.disabled.set(d);
    if (d) this.close(false);
  }

  // ---------------------------------------------------------------- open / close
  toggle(): void {
    if (this.open()) this.close();
    else this.show();
  }

  show(): void {
    if (this.disabled() || this.open()) return;
    this.query.set('');
    const sel = this.selected();
    this.active.set(Math.max(0, sel ? this.items().indexOf(sel) : 0));
    this.place();
    this.open.set(true);
    // focus the search box (or keep focus on the trigger) once the panel exists
    queueMicrotask(() => {
      this.search()?.nativeElement.focus();
      this.scrollActive();
    });
  }

  close(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.onTouched();
    if (refocus) this.trigger().nativeElement.focus();
  }

  /** fixed position under (or above) the trigger */
  private place(): void {
    const r = this.trigger().nativeElement.getBoundingClientRect();
    const view = this.doc.defaultView!;
    const below = view.innerHeight - r.bottom;
    const up = below < 280 && r.top > below;
    this.dropUp.set(up);
    this.pos.set({ top: up ? r.top - 4 : r.bottom + 4, left: r.left, width: Math.max(r.width, 200) });
  }

  // ---------------------------------------------------------------- choosing
  choose(item: { value: unknown }): void {
    this.commit(item.value);
    this.close();
  }

  clear(e: Event): void {
    e.stopPropagation();
    this.commit(null);
    this.close(false);
    this.trigger().nativeElement.focus();
  }

  private commit(v: unknown): void {
    if (sameOption(v, this.value())) return;
    this.value.set(v);
    this.onChange(v);
    this.onTouched();
  }

  isSelected(item: { value: unknown }): boolean {
    return this.hasValue() && sameOption(item.value, this.value());
  }

  // ---------------------------------------------------------------- keyboard
  onSearch(q: string): void {
    this.query.set(q);
    this.active.set(0);
  }

  onTriggerKey(e: KeyboardEvent): void {
    if (!this.open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        this.show();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && this.showClear() && this.hasValue()) {
        e.preventDefault();
        this.commit(null);
      }
      return;
    }
    this.onListKey(e);
  }

  onListKey(e: KeyboardEvent): void {
    const n = this.visible().length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (n) this.active.set((this.active() + 1) % n);
        this.scrollActive();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (n) this.active.set((this.active() - 1 + n) % n);
        this.scrollActive();
        break;
      case 'Home':
        e.preventDefault();
        this.active.set(0);
        this.scrollActive();
        break;
      case 'End':
        e.preventDefault();
        this.active.set(Math.max(0, n - 1));
        this.scrollActive();
        break;
      case 'Enter': {
        e.preventDefault();
        const item = this.visible()[this.active()];
        if (item) this.choose(item);
        break;
      }
      case 'Escape':
        e.preventDefault();
        e.stopPropagation(); // don't close a surrounding modal
        this.close();
        break;
      case 'Tab':
        this.close(false);
        break;
    }
  }

  private scrollActive(): void {
    queueMicrotask(() => {
      this.panel()?.nativeElement.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
    });
  }
}
