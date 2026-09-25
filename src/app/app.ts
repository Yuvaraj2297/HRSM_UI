import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TabScrollService } from './common/tab-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('human-resource');

  constructor() {
    inject(TabScrollService).init();
  }
}
