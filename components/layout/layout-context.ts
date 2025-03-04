"use client";

import { createContext, useContext } from "react";

interface SidebarContext {
  collapsed: boolean;
  setCollapsed: () => void;
}

interface VPNTopbarContext {
  opened: boolean;
  setOpen: () => void;
}

export const SidebarContext = createContext<SidebarContext>({
  collapsed: false,
  setCollapsed: () => { },
});
export const VPNTopbarContext = createContext<VPNTopbarContext>({
  opened: false,
  setOpen: () => { },
},
);

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
export const useVPNTopbarContext = () => {
  return useContext(VPNTopbarContext);
};
