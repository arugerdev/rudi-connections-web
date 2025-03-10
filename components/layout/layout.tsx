"use client";

import React, { useEffect } from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext, VPNTopbarContext } from "./layout-context";
import { useIsElectron } from "../hooks/useIsElectron";
import { VPNTopbar } from "../vpn/topbar";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  const [vpnTopbarOpen, setVPNTopbarOpen] = React.useState(false);
  const [_vpn, setVpnLocked] = useLockedBody(false);
  const handleToggleVPNTopbar = () => {
    setVPNTopbarOpen(true);
    setVpnLocked(true);
  };

  const isElectron = useIsElectron();

  const [deviceConnected, setDeviceConnected] = React.useState({});

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}>
      <VPNTopbarContext.Provider
        value={{
          opened: vpnTopbarOpen,
          setOpen: handleToggleVPNTopbar,
          deviceConnected,
          setDeviceConnected,
        }}>

        {isElectron &&
          <VPNTopbar />
        }
        <section className='flex'>
          <SidebarWrapper />
          <NavbarWrapper>{children}</NavbarWrapper>
        </section>
      </VPNTopbarContext.Provider>
    </SidebarContext.Provider>
  );
};
