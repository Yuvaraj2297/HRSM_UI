import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-import-leads-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import-leads-modal.html',
  styleUrl: './import-leads-modal.scss',
})
export class ImportLeadsModal implements AfterViewInit {
  @ViewChild('modalRoot') modalRoot!: ElementRef;
  private modalInstance: any;

  file: File | null = null;
  status = 'Lead';
  source = 'Indiamart';
  assignee = '';
  simulating = false;

  statusOptions = ['Lead', 'Quotation', 'Followup', 'Qualified', 'DIRECT', 'New Enquiry', 'New', 'Customer', 'Waiting for Response'];
  sourceOptions = ['Indiamart', 'Direct', 'Website Form', 'Facebook Ads', 'Google Ads', 'Referral', 'Exhibition', 'Walk-in', 'Cold Call'];
  assigneeOptions = ['GHRAUDA SOFTWARE', 'Harish D.', 'Divya A.', 'Karthik R.', 'Priya S.'];

  showAddStatus = false;
  showAddSource = false;
  newStatus = '';
  newSource = '';

  ngAfterViewInit(): void {
    this.modalInstance = bootstrap.Modal.getOrCreateInstance(this.modalRoot.nativeElement, { backdrop: 'static' });
  }

  open(): void {
    this.modalInstance?.show();
  }

  close(): void {
    this.modalInstance?.hide();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  saveNewStatus(): void {
    const val = this.newStatus.trim();
    if (!val) return;
    if (!this.statusOptions.some(o => o.toLowerCase() === val.toLowerCase())) this.statusOptions.push(val);
    this.status = val;
    this.newStatus = '';
    this.showAddStatus = false;
  }

  saveNewSource(): void {
    const val = this.newSource.trim();
    if (!val) return;
    if (!this.sourceOptions.some(o => o.toLowerCase() === val.toLowerCase())) this.sourceOptions.push(val);
    this.source = val;
    this.newSource = '';
    this.showAddSource = false;
  }

  downloadSample(): void {
    const csv = 'Name,Company,Phone,Email,Country,Product,Value,Tags,Profession\n' +
      'Arun Kumar,Vetri Constructions,9840012345,arun@example.com,India,ERP Software License,85000,Hot Lead,Builder\n' +
      'Meena Ramesh,Sri Lakshmi Traders,9884456789,meena@example.com,India,HRMS Annual Subscription,141629,Won,Retailer';
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leads-sample-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  doImport(): void {
    // TODO: call your import API here with this.file, this.status, this.source, this.assignee
    console.log('import', { file: this.file, status: this.status, source: this.source, assignee: this.assignee });
  }

  simulateImport(): void {
    if (!this.file) {
      alert('Please choose a CSV file first.');
      return;
    }
    this.simulating = true;
    setTimeout(() => {
      this.simulating = false;
      alert('✅ Simulation complete: 2 leads will be imported (0 errors, 0 duplicates).');
    }, 900);
  }
}
