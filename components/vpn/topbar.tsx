import {
    Button, Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure
} from "@heroui/react"
import { useVPNTopbarContext } from "../layout/layout-context";
import { useEffect, useState } from "react";
import { receiveFromElectron, sendToElectron } from "@/utils/electronjs";

export const VPNTopbar = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { opened, setOpen } = useVPNTopbarContext();
    useEffect(() => {
        if (opened) {
            onOpen()
        }
        else {
            onClose()
        }
    }, [opened])


    const [storedDevice, setStoredDevice] = useState<any>(typeof (window) === 'undefined' ? {} : (JSON.parse(localStorage.getItem('deviceConnected') ?? '{}')));
    const [status, setStatus] = useState<{ status: String | null, ip: String | null, deviceConnected: object | any }>({ status: 'desconocido', ip: null, deviceConnected: {} });
    useEffect(() => {

        setInterval(() => {

            setStoredDevice(typeof (window) === 'undefined' ? {} : (JSON.parse(localStorage.getItem('deviceConnected') ?? '{}')));
            sendToElectron('tailscale-status');
            receiveFromElectron('tailscale-status-reply', (response: any) => {
                setStatus(response);
            });
        }, 1000);

    }, []);
    const handleDisconnect = () => {
        sendToElectron('tailscale-down');
        receiveFromElectron('tailscale-down-reply', (response: any) => {
            setStatus(response);
        });
    };

    return (

        <>
            <div className="flex flex-wrap gap-3">
                <Button className="absolute bottom-0 left-[45.5%] z-[98] mb-2" variant="shadow" color="secondary" onPress={onOpen}>
                    Abrir configuración de la VPN
                </Button>
            </div >
            <Drawer isOpen={isOpen} placement={'bottom'} backdrop="blur" className="absolute z-[999]" onOpenChange={onOpenChange}>
                <DrawerContent className="absolute z-[999]">
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold">Configuración de VPN</h1>
                            </DrawerHeader>
                            <DrawerBody>
                                <section className="flex flex-row gap-4 items-center justify-start">
                                    <div className="flex flex-row gap-2 items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-foreground-400 font-semibold">Estado:</span>
                                            <div className={` ${status.status === 'activo' ? 'bg-success' : status.status === 'desconocido' ? 'bg-warning' : 'bg-danger'} w-3 h-3 rounded-full `}></div>
                                            <span className={`text-sm ${status.status === 'activo' ? 'text-success' : status.status === 'desconocido' ? 'text-warning' : 'text-danger'} font-semibold`}>{status.status}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-2 items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-foreground-400 font-semibold">Mi IP VPN: {status.ip}</span>
                                        </div>
                                    </div>
                                    {storedDevice?.config &&
                                        <div className="flex flex-row gap-2 items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-foreground-400 font-semibold">Dispositivo: {storedDevice?.config?.deviceName}</span>
                                                <span className="text-sm text-foreground-400 font-semibold">IP del dispositivo: {storedDevice?.config?.tailscale?.public_ip}</span>
                                            </div>
                                        </div>
                                    }


                                </section>
                            </DrawerBody>
                            <DrawerFooter>
                                <div className="flex flex-row gap-2 items-center">
                                    <Button className="font-bold" color="danger" onPress={handleDisconnect}>Desconectar VPN</Button>
                                </div>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>



        // <section className="flex flex-col w-full gap-4 p-4 m-0 bg-background-300 bg-[#222]">
        //     <div className="flex flex-row justify-between items-center">
        //         <h1 className="text-2xl font-bold">Configuración de VPN</h1>
        //     </div>
        //     <section className="flex flex-row gap-4 items-center justify-between">

        //         {/* Status Desc and dot with color */}
        //         <div className="flex flex-row gap-2 items-center">
        //             <div className="flex items-center gap-2">
        //                 <span className="text-sm text-foreground-400 font-semibold">Estado:</span>
        //                 <div className="w-3 h-3 rounded-full bg-success"></div>
        //                 <span className="text-sm text-success font-semibold">Activo</span>
        //             </div>
        //         </div>

        //         {/* VPN Details */}
        //         <div className="flex flex-row gap-2 items-center">
        //             <div className="flex items-center gap-2">
        //                 <span className="text-sm text-foreground-400 font-semibold">IP Pública:</span>
        //             </div>
        //         </div>

        //         {/* Desconectar Vpn */}
        //         <div className="flex flex-row gap-2 items-center">
        //             <button className="text-sm text-danger font-semibold">Desconectar VPN</button>
        //         </div>
        //     </section>
        // </section>
    );
}