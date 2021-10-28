import React from 'react'
/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ className, children, id }: { className?: string, children?: React.ReactNode, id?: string }) {
  return <div className={`app-body ${className}`} id={id}>{children}</div>
}
