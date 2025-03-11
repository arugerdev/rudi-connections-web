"use client";
import { Input, Button, Checkbox, Select, addToast, Spinner, SelectItem } from "@heroui/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";

export const Settings = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    notifications: false,
    loaded: false,
    updateInterval: '10', // Valor por defecto en segundos
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error al obtener los datos del usuario", error);
      }

      if (data) {
        setUserData((prev) => ({
          ...prev,
          name: data.user?.user_metadata?.name ?? "",
          email: data.user?.email ?? "",
          notifications: data.user?.user_metadata?.notifications ?? false,
          updateInterval: data.user?.user_metadata?.updateInterval ?? '10',
          loaded: true,
        }));
      }
    };

    fetchUserData();

  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        name: userData.name,
        notifications: userData.notifications,
        updateInterval: userData.updateInterval,
      }
    });

    setLoading(false);
    if (error) {
      addToast({
        title: "Error al actualizar los datos",
        description: "Ocurrió un error al actualizar los datos, por favor intenta de nuevo",
        color: 'danger',
      });
    } else {
      addToast({
        title: "Cambios guardados",
        description: "Datos cambiados correctamente 🎉",
        color: 'success',
      });
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-1/2 flex flex-col gap-4">
      {userData.loaded && (
        <>
          <ul className="flex">
            <li className="flex gap-2">
              <HouseIcon />
              <Link href={"/"}>
                <span>Inicio</span>
              </Link>
              <span> / </span>
            </li>
            <li className="flex gap-2">
              <span> {" "} </span>
              <Link href={"/devices"}>
                <span> Configuración</span>
              </Link>
            </li>
          </ul>
          <div className="flex flex-col gap-4">
            <h1 className="mt-4 font-bold text-xl">Configuraciones de cuenta</h1>
            <Input
              label="Nombre de usuario"
              name="name"
              value={userData.name}
              placeholder={userData.name}
              onChange={handleChange}
            />
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={userData.email}
              placeholder={userData.email}
              disabled
            />

            <div className="flex flex-col gap-2">
              <h1 className="mt-4 font-bold text-xl">Configuraciones de dispositivos</h1>
              <label>Actualizar automáticamente los datos de la lista de los dispositivos (En segundos)</label>
              <Select
                selectionMode="single"
                selectedKeys={[userData.updateInterval]}
                onSelectionChange={(value) => setUserData((prev) => ({ ...prev, updateInterval: value.currentKey ?? '10' }))}
              >
                <SelectItem key={'realtime'} >Tiempo real (Alto costo, posibilidad error en datos)</SelectItem>
                <SelectItem key={'5'} >5s</SelectItem>
                <SelectItem key={'10'} >10s</SelectItem>
                <SelectItem key={'30'} >30s</SelectItem>
                <SelectItem key={'60'} >60s</SelectItem>
                <SelectItem key={'noupdate'} >No actualizar automaticamente</SelectItem>
              </Select>
            </div>

            <h1 className="mt-4 font-bold text-xl">Otras Configuraciones</h1>
            <div className="flex items-center gap-2">
              <Checkbox
                isSelected={userData.notifications}
                onValueChange={() => setUserData((prev) => ({
                  ...prev,
                  notifications: !prev.notifications,
                }))}
              />
              <label>Alertas de Acciones</label>
            </div>

            <Button color="primary" onPress={handleSave} isLoading={loading}>
              Guardar cambios
            </Button>
          </div>
        </>
      )
      }
      {!userData.loaded && <Spinner />}
    </div >
  );
};
