import * as React from "react";
import { PathForContext } from "./context/PathForContext";
import { NavigationContext } from "./context/NavigationContext";

export interface CatalogLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  collectionUrl?: string | null;
  bookUrl?: string | null;
}

/**
 * Shows a link to another collection or book in the same OPDS catalog.
 * Uses modern React context (PathForContext + NavigationContext) instead of
 * the legacy react-router v3 contextTypes API.
 */
export default function CatalogLink({
  collectionUrl = null,
  bookUrl = null,
  ref,
  onClick,
  children,
  ...props
}: CatalogLinkProps) {
  const pathFor = React.useContext(PathForContext);
  const navigate = React.useContext(NavigationContext);

  if (!pathFor) {
    // No PathForContext provided — render an inert anchor
    return <a onClick={onClick} {...props}>{children}</a>;
  }

  const href = pathFor(collectionUrl, bookUrl);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (onClick) onClick(e as any);
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      if (navigate) navigate(href);
    }
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
