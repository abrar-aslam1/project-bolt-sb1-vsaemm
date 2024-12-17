import type { Metadata } from 'next';

declare module 'next' {
  interface PageProps {
    params?: Record<string, string>;
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}

export {};