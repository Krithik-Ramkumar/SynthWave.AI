
'use client';

import { Suspense } from 'react';
import CreationClient from '@/components/app/creation-client';

export default function CreationPage() {
  return (
    <Suspense>
      <CreationClient />
    </Suspense>
  );
}