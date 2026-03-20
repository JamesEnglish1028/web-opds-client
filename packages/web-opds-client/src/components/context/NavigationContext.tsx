import * as React from "react";

export type NavigateFn = (path: string) => void;

/**
 * Modern replacement for the legacy react-router v3 context.router.push contract.
 * Provided by the host application (e.g. circulation-admin) via a
 * NavigationContext.Provider wrapping OPDSCatalog. Consumed by CatalogLink
 * and Root to navigate without requiring a v3 router in context.
 */
export const NavigationContext = React.createContext<NavigateFn | undefined>(
  undefined
);

export function useNavigation(): NavigateFn | undefined {
  return React.useContext(NavigationContext);
}
