import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Toggle } from '../toggle.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  searchText = '';

  /** Shown on the notification bell badge. */
  notificationCount = 5;

  /** Current signed-in user, shown as the header avatar. */
  user = {
    name: 'Saran', // Updated to match your design image
    role: 'Admin',          // Added role
    avatarUrl: 'assets/profile-3.jpg',
  };

  isToggled = false;
  isProfileMenuOpen = false; // Track dropdown state


  constructor(
    private toggleService: Toggle,
    private router: Router
  ) {
    this.toggleService.isToggled$.subscribe(v => this.isToggled = v);
  }

  /** Toggle the sidebar (from the burger). */
  toggleSidebar(): void {
    this.toggleService.toggle();
  }
 toggleProfileMenu(event: Event): void {
    event.stopPropagation(); // Prevent the click from bubbling to document
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  /** Close dropdown when clicking outside */
  @HostListener('document:keydown.escape')
  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // If the click is NOT inside the profile wrapper, close the menu
    if (!target.closest('.profile-wrapper')) {
      this.isProfileMenuOpen = false;
    }
  }

  openHistory(): void {
    this.router.navigateByUrl('home/activity-log');
  }

  openHelp(): void {
    this.router.navigateByUrl('home/support-ticket');
  }

  openNotifications(): void {
    this.router.navigateByUrl('home/notifications');
  }

  openProfile(): void {
    this.router.navigateByUrl('home/profile');
  }

  logout(): void {
    this.isProfileMenuOpen = false;
    // Add your actual logout logic here (e.g., clearing tokens)
    this.router.navigateByUrl('/login'); 
  }

  clearSearch(): void {
    this.searchText = '';
  }
}