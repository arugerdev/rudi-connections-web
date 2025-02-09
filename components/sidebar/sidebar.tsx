import React from "react";
import { Sidebar } from "./sidebar.styles";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { DevicesIcon } from "../icons/devices/devices-icon";
export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const theme = useTheme()
  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >

        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              className="flex items-center justify-center"
              childClassName="flex items-center justify-center"
              title=""
              onHover={false}
              icon={<Image src={theme.theme === 'light' ? '/icon_rudi_300x300.png' : theme.theme === 'dark' ? '/icon_rudi_light_300x300.png' : '/icon_rudi_300x300.png'} width={48} height={48} alt={""} />}
              href="/"
            />
            <SidebarItem
              title="Inicio"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Menú Principal">
              <SidebarItem
                isActive={pathname === "/devices"}
                title="Dispositivos"
                icon={<DevicesIcon />}
                href="devices"
              />
              <SidebarItem
                isActive={pathname === "/analitycs"}
                title="Analíticas"
                icon={<ReportsIcon />}
              // href="analitycs"
              />
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Configuración"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>

          </div>
          {/* <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>

          </div> */}
        </div>
      </div>
    </aside>
  );
};
