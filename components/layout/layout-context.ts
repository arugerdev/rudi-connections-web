"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface SidebarContext {
  collapsed: boolean;
  setCollapsed: () => void;
}

interface VPNTopbarContext {
  opened: boolean;
  setOpen: () => void;
  deviceConnected: object | any | null;
  setDeviceConnected: Dispatch<SetStateAction<object | any | null>> | null;
}

export const SidebarContext = createContext<SidebarContext>({
  collapsed: false,
  setCollapsed: () => { },
});
export const VPNTopbarContext = createContext<VPNTopbarContext>({
  opened: false,
  setOpen: () => {
    console.error('oops, the default got used. Fix your bug!');
  },
  deviceConnected: {},
  setDeviceConnected: () => {
    console.error('oops, the default got used. Fix your bug!');
  },
},
);

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
export const useVPNTopbarContext = () => {
  return useContext(VPNTopbarContext);
};
