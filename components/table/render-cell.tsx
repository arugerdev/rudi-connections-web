import { User, Tooltip, Chip, Button } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { CopyIcon } from "../icons/table/copy-icon";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

interface Props {
  device: any;
  columnKey: string | React.Key;
}

export const RenderCell = ({ device, columnKey }: Props) => {

  const handleRemoveDevice = async () => {
    console.log('Delete device')
    const supabase = createClient()

    const data = await supabase.from('devices').update({ owned_by: null }).eq('id', device?.id);
    if (data.error) {
      throw data.error
    }
    window.location.reload()
  }

  // @ts-ignore
  const cellValue = device[columnKey];
  switch (columnKey) {
    case "name":
      return (
        <strong>{device?.name}</strong>
      );
    case "ip":
      return (
        <div className="flex flex-row gap-2 items-center">
          <p className={(device?.public_ip != '' ? 'font-base text-foreground' : 'font-bold text-slate-500')}>{(device?.public_ip != '' ? device.public_ip : 'No tiene ip publica actualmente')}{' '}</p>
          {device.public_ip &&

            <Tooltip content="Copiar IP Pública">
              <button onClick={() => { navigator.clipboard.writeText(device.public_ip); toast.success(`IP Pública copiada correctamente \n ${device.name}: ${device.public_ip}`) }}>
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
              : cellValue === "stoped"
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
          <section className="flex items-center justify-center flex-row gap-4">

            <div>
              <Tooltip content="Ver detalles">
                <button onClick={() => console.log("Ver detalles", device?.id)}>
                  <EyeIcon size={20} fill="#979797" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="Editar Dispositivo">
                <button onClick={() => console.log("Editar", device?.id)}>
                  <EditIcon size={20} fill="#979797" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip
                content="Borrar dispositivo"
                color="danger"
              >
                <button onClick={() => handleRemoveDevice()}>
                  <DeleteIcon size={20} fill="#FF0080" />
                </button>
              </Tooltip>
            </div>
          </section>
          <section>
            <div>
              <Tooltip
                content="Conectar al dispositivo a traves de la VPN"
                color="primary"
              >
                <Button color="primary" variant="ghost" onClick={() => console.log("Conectar", device?.id)}>Conectar
                </Button >
              </Tooltip>
            </div>
          </section>
        </div>
      );
    default:
      return cellValue;
  }
};
