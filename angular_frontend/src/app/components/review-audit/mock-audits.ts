//This file is to test the frontend for the review audit page, delete this later when using the acutal database

export interface Audit {
  id: number;
  name: string;
  finalVerdict: string;
  imageUrl?: string[];
}

export const AUDITS: Audit[] = [
  {
    id: 12,
    name: 'Toyota Mattic',
    finalVerdict: 'Pending',
  },
  {
    id: 13,
    name: 'Gigantically Named Dealership Name',
    finalVerdict: 'Passed',
    imageUrl: [
      'https://www.cnet.com/a/img/resize/a4ffadf45a4f42ce90a542af0d558b4b62e1b3eb/hub/2022/03/30/e841545d-e55c-47fc-b24a-003bf14e58c8/oneplus-10-pro-cnet-review-12.jpg?auto=webp&fit=crop&height=675&width=1200',
      'https://www.cnet.com/a/img/resize/a4ffadf45a4f42ce90a542af0d558b4b62e1b3eb/hub/2022/03/30/e841545d-e55c-47fc-b24a-003bf14e58c8/oneplus-10-pro-cnet-review-12.jpg?auto=webp&fit=crop&height=675&width=1200',
      'https://www.cnet.com/a/img/resize/a4ffadf45a4f42ce90a542af0d558b4b62e1b3eb/hub/2022/03/30/e841545d-e55c-47fc-b24a-003bf14e58c8/oneplus-10-pro-cnet-review-12.jpg?auto=webp&fit=crop&height=675&width=1200',
      'https://www.cnet.com/a/img/resize/a4ffadf45a4f42ce90a542af0d558b4b62e1b3eb/hub/2022/03/30/e841545d-e55c-47fc-b24a-003bf14e58c8/oneplus-10-pro-cnet-review-12.jpg?auto=webp&fit=crop&height=675&width=1200',
      'https://www.cnet.com/a/img/resize/a4ffadf45a4f42ce90a542af0d558b4b62e1b3eb/hub/2022/03/30/e841545d-e55c-47fc-b24a-003bf14e58c8/oneplus-10-pro-cnet-review-12.jpg?auto=webp&fit=crop&height=675&width=1200',
      'https://www.cnet.com/a/img/resize/a4ffadf45a4f42ce90a542af0d558b4b62e1b3eb/hub/2022/03/30/e841545d-e55c-47fc-b24a-003bf14e58c8/oneplus-10-pro-cnet-review-12.jpg?auto=webp&fit=crop&height=675&width=1200',
    ],
  },
  { id: 14, name: 'Dealership C', finalVerdict: 'Failed' },
  { id: 15, name: 'Dealership D', finalVerdict: 'Pending' },
  { id: 16, name: 'Dealership E', finalVerdict: 'Pending' },
  { id: 17, name: 'Dealership F', finalVerdict: 'Pending' },
  { id: 18, name: 'Dealership G', finalVerdict: 'Failed' },
  { id: 19, name: 'Dealership H', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
  { id: 20, name: 'Dealership I', finalVerdict: 'Pending' },
];
