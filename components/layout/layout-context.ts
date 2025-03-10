"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface SidebarContext {
  collapsed: boolean;
  setCollapsed: () => void;
}

interface VPNTopbarContext {
  opened: boolean;
  setOpen: () => void;
  deviceConnected: object | any;
  setDeviceConnected: Dispatch<SetStateAction<{}>>;
}

export const SidebarContext = createContext<SidebarContext>({
  collapsed: false,
  setCollapsed: () => { },
});
export const VPNTopbarContext = createContext<VPNTopbarContext>({
  opened: false,
  setOpen: () => { },
  deviceConnected: {},
  setDeviceConnected: () => { },
},
);

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
export const useVPNTopbarContext = () => {
  return useContext(VPNTopbarContext);
};
