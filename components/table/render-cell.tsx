import { User, Tooltip, Chip, Button, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { CopyIcon } from "../icons/table/copy-icon";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { ConfigureDeviceButtonModal } from "../buttons/ConfigureDeviceButtonModal";
import Link from "next/link";

interface Props {
  device: any;
  columnKey: string | React.Key;
  resetList: CallableFunction;
  isElectron: boolean | null;
}

export const RenderCell = ({ device, columnKey, resetList = () => { }, isElectron = false }: Props) => {

  const handleRemoveDevice = async () => {
    console.log('Delete device')
    const supabase = createClient()

    const data = await supabase.from('devices').update({ owned_by: null }).eq('id', device?.id);
    if (data.error) {
      throw data.error
    }

    resetList()
  }

  // @ts-ignore
  const cellValue = device[columnKey];
  switch (columnKey) {

    case "name":
      return (
        <strong>{device?.config.deviceName}</strong>
      );
    case "public_ip":
      return (
        <div className="flex flex-row gap-2 items-center">
          <p className={(device?.public_ip != '' ? 'font-base text-foreground' : 'font-bold text-slate-500')}>{(device?.public_ip != '' ? device.public_ip : 'No tiene ip publica actualmente')}{' '}</p>
          {device.public_ip &&

            <Tooltip content="Copiar IP Pública">
              <button onClick={() => { navigator.clipboard.writeText(device.public_ip); toast.success(`IP Pública copiada correctamente \n ${device?.config?.config?.deviceName}: ${device.public_ip}`) }}>
                <CopyIcon size={24} fill="#979797" />
              </button>
            </Tooltip>
          }
        </div >
      );
    case "status":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={
            cellValue === "active" || cellValue === 'running'
              ? "success"
              : cellValue === "stopped"
                ? "danger"
                : "warning"
          }
        >
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      );

    case "actions":


      return (
        <div className="flex items-center flex-row justify-end gap-8">
          <section className="flex items-center justify-center flex-row gap-2">

            <div>
              <Tooltip content="Ver detalles">
                <Button isDisabled isIconOnly variant='light' onClick={() => console.log("Ver detalles", device?.id)}>
                  <EyeIcon size={20} fill="#979797" />
                </Button>
              </Tooltip>
            </div>
            {/* <div>
              <Tooltip content="Editar Dispositivo">
                <Button isDisabled isIconOnly variant='light' onClick={() => console.log("Editar", device?.id)}>
                  <EditIcon size={20} fill="#979797" />
                </Button>
              </Tooltip>
            </div> */}
            <div>
              <Tooltip
                content="Borrar dispositivo"
                color="danger"
              >
                <Button isIconOnly variant='light' onClick={() => handleRemoveDevice()}>
                  <DeleteIcon size={20} fill="#FF0080" />
                </Button>
              </Tooltip>
            </div>
          </section>
          <section className="flex flex-row gap-4">
            <div>
              <ConfigureDeviceButtonModal device={device} resetList={resetList} />
            </div>
            {isElectron &&
              <div>
                <Tooltip
                  content={(!device.public_ip || device.public_ip === '') ? 'Necesita tener una ip publica para conectarse, por favor conecte el dispositivo a internet' : "Conectar al dispositivo a traves de la VPN"}
                  color="primary"
                >
                  <Button onClick={() => window.api.ipc('connect-vpn')} color="primary" isDisabled={!device.public_ip || device.public_ip === '' || device.status !== 'running'} className="cursor-pointer" variant="ghost">
                    Conectar
                  </Button >

                </Tooltip>
              </div>
            }
          </section>
        </div>
      );
    default:
      return cellValue;
  }
};
