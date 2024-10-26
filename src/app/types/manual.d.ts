import { STATUS_MANUAL } from '@/app/constants/users.const';

interface Manual {
  processingStatus: string;
  id: string;
  title: string;
  visibilityStatus: STATUS_MANUAL | string;
  author: {
    id: string;
    name: string;
  };
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface Step {
  id: string;
  step: number;
  description: string;
  instruction: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  metadata?: { action?: string; target?: string };
}

interface ManualStepsEdit {
  title: string;
  steps: Partial<
    Omit<Step, 'imageUrl' | 'createdAt' | 'updatedAt'> & { imagePath: string }
  >[];
  deleteStepIds: string[];
}
interface SearchResultManual extends Manual {
  matchingSteps: Array<{ description: string }>;
  matchCount: number;
  score: number;
  documentContent: string;
}
