import React from 'react';
import Layout from './Layout';

/**
 * AdminLayout wraps the generic admin Layout component.
 * It can be used to provide a consistent layout for all admin pages.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
