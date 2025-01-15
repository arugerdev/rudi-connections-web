import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/auth-js";
import toast from "react-hot-toast";

export const UserDropdown = () => {
  const supabase = createClient()
  const router = useRouter();
  const [user, setUser] = useState<User | null>()


  useEffect(() => {
    getUserData().then((data) => setUser(data.data.user))
  }, [])

  const getUserData = async () => {
    return await supabase.auth.getUser()
  }

  const handleLogout = useCallback(async () => {
    supabase.auth.signOut()
    router.replace("/login");
    toast.success('Sesión cerrada correctamente')
  }, [router]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as='button'
            color='primary'
            size='md'
            src={(user?.user_metadata.pic ?? '')}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label='User menu actions'
        onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem
          key='profile'
          className='flex flex-col justify-start w-full items-start'>
          <p>Sesión iniciada como:</p>
          <p>{user?.email}</p>
        </DropdownItem>
        <DropdownItem isDisabled key='settings'>Ajustes - EN DESARROLLO 🚧</DropdownItem>
        <DropdownItem isDisabled key='analytics'>Analíticas - EN DESARROLLO 🚧</DropdownItem>
        <DropdownItem isDisabled key='help_and_feedback'>Ayuda - EN DESARROLLO 🚧</DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          onPress={handleLogout}>
          Cerrar Sesión
        </DropdownItem>
        <DropdownItem key='switch'>
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
