import { Routes } from '@angular/router';

export const HR_ROUTES: Routes = [
  {
    path: 'joining-pipeline',
    data: {
      title: 'Joining Pipeline',
    },
    loadComponent: () =>
      import('./onboarding/joining-pipeline/joining-pipeline')
        .then(m => m.JoiningPipeline)
  },

   {
    path: 'document-verification',
    data: {
      title: 'Document Verification',
    },
    loadComponent: () =>
      import('./onboarding/document-verification/document-verification')
        .then(m => m.DocumentVerification)
  },

   {
    path: 'checklists',
    data: {
      title: 'Onboarding Checklists',
      parentTitle: 'Onboarding',
    },
    loadComponent: () =>
      import('./onboarding/checklist/checklist')
        .then(m => m.Checklist)
  },
 
  {
    path: 'asset-provisioning',
    data: {
      title: 'Asset Provisioning & Lifecycle Management',
      parentTitle: 'Onboarding',
    },
    loadComponent: () =>
      import('./onboarding/asset-provisioning/asset-provisioning')
        .then(m => m.AssetProvisioning)
  },

   {
    path: 'induction-orientation',
    data: {
      title: 'Asset Provisioning & Lifecycle Management',
      parentTitle: 'Onboarding',
    },
    loadComponent: () =>
      import('./onboarding/induction-orientation/induction-orientation')
        .then(m => m.InductionOrientation)
  },
{ path: '', redirectTo: 'job-opening', pathMatch: 'full' },

  {
    path: 'job-opening',
    data: { title: 'Job Opening', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./recuitment/job-opening/job-opening')
        .then(m => m.JobOpening)
  },
  {
    path: 'social-web-applicants',
    data: { title: 'Social And Candidate Applications', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./recuitment/social-webapp/social-webapp')
        .then(m => m.SocialWebapp)
  },
   {
    path: 'candidate-evaluation',
    data: { title: 'Candidate Evaluations & Scorecards', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./recuitment/tl-evaluation-scores/tl-evaluation-scores')
        .then(m => m.TlEvaluationScores)
  },
   {
    path: 'candidate-pipeline',
    data: { title: 'Candidate Pipeline', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./recuitment/cadidate-pipeline/cadidate-pipeline')
        .then(m => m.CadidatePipeline)
  },
  {
    path: 'offer-letter',
    data: { title: 'Offer Letter', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./recuitment/offer-letter/offer-letter')
        .then(m => m.OfferManagement)
  },
   {
    path: 'recruitment-reports',
    data: { title: 'Recruitment Reports', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./recuitment/recuitment-report/recuitment-report')
        .then(m => m.RecuitmentReport)
  },
  {
    path: 'appraisal-review',
    data: { title: 'Appraisal Reviews', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./performance/appraisal-review/appraisal-review')
        .then(m => m.AppraisalReview)
  },
   {
    path: 'performance-feedback',
    data: { title: 'Performance Feedback', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./performance/feedback/feedback')
        .then(m => m.Feedback)
  },
  {
    path: 'performance-report',
    data: { title: 'Performance Report', parentTitle: 'Recruitment' },
    loadComponent: () =>
      import('./performance/performance-report/performance-report')
        .then(m => m.PerformanceReport)
  }
]