
import { ConfigFormType } from "@/helpers/types";
import { Button, Link } from "@heroui/react";

export const ConfigureDeviceButtonModal = ({ device, resetList = () => { } }: {
    device: {
        status: string;
        key: string; id: number, config: ConfigFormType, type: string | null
    }, resetList: CallableFunction
}) => {

    return (
        <Button as={Link} isDisabled={!device.config?.tailscale?.public_ip || device.config?.tailscale?.public_ip == '' || device.status !== 'running'} rel="noopener noreferrer" target="_blank" href={`http://${device.config?.tailscale?.public_ip ?? 'rud1.es'}`} color="secondary" className="cursor-pointer" variant="flat">
            Configurar
        </Button >
    )
}