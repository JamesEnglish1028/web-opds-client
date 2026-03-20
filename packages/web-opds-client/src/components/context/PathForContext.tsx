import * as React from "react";
import { PathFor } from "../../interfaces";

/**
 * Provides the pathFor function to all descendants via modern React context.
 * CatalogLink and Root read this via useContext(PathForContext).
 */
export const PathForContext = React.createContext<PathFor | undefined>(
  undefined
);

export type PathForProps = {
  pathFor: PathFor;
  children: React.ReactChild;
};

export default function PathForProvider({ pathFor, children }: PathForProps) {
  return (
    <PathForContext.Provider value={pathFor}>
      {children}
    </PathForContext.Provider>
  );
}

export function usePathFor() {
  const context = React.useContext(PathForContext);
  if (typeof context === "undefined") {
    throw new Error("usePathFor must be used within a PathForProvider");
  }
  return context;
}
