import * as React from "react";
import { LinkData } from "../interfaces";

export interface EntryPointButtonsProps {
  /** Navigation links from collectionData, may include entry points */
  navigationLinks?: LinkData[];
  /** Current collection URL to highlight active button */
  currentUrl?: string;
  /** Callback fired when user selects an entry point */
  onSelectEntry: (url: string, label: string) => void;
}

/**
 * Renders entry point filter buttons (All Books, Books, Audiobooks, etc.)
 * Extracts these from navigationLinks and displays them as a horizontal button group.
 * Only renders if at least one entry point link is found.
 */
export default function EntryPointButtons({
  navigationLinks = [],
  currentUrl = "",
  onSelectEntry
}: EntryPointButtonsProps) {
  // Filter for entry point links:
  // - rel="collections" and type="application/atom+xml" OR
  // - standard entry point titles (case-insensitive)
  const entryPointLinks = navigationLinks.filter(link => {
    if (!link.url) return false;
    const isCollectionLink = (link.type?.includes("atom+xml") || false);
    const knownTitles = ["All Books", "Books", "Audiobooks", "All", "Ebooks", "E-books"];
    const titleMatch = link.text && knownTitles.some(
      known => link.text!.toLowerCase().includes(known.toLowerCase())
    );
    return isCollectionLink || titleMatch;
  });

  if (entryPointLinks.length === 0) {
    return null;
  }

  return (
    <div className="entry-point-buttons" role="group" aria-label="Entry points">
      {entryPointLinks.map((link, idx) => {
        const label = link.text || "Collection";
        const isActive = currentUrl === link.url;
        return (
          <button
            key={idx}
            className={`entry-point-button ${isActive ? "active" : ""}`}
            onClick={() => onSelectEntry(link.url, label)}
            aria-pressed={isActive}
            title={`Show ${label}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
