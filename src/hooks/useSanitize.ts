'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';

export function useSanitize(input: string): string {
  return useMemo(() => DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }), [input]);
}

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html);
}
