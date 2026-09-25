import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { WhatsappChat } from './whatsapp-chat';

describe('WhatsappChat', () => {
  let component: WhatsappChat;
  let fixture: ComponentFixture<WhatsappChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappChat],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
