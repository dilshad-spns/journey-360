'use client';

import React from 'react';

/**
 * Embed Layout - Minimal layout for embedding forms in other applications
 * No navigation, no extra UI - just the content
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
