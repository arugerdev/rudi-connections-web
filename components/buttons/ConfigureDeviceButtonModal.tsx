
import { createClient } from "@/utils/supabase/client";
import { Button, Checkbox, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useState, useEffect } from "react";

export const ConfigureDeviceButtonModal = ({ device = null }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const supabase = createClient()
    const [config, setConfig] = useState<any>({})

    useEffect(() => {
        if (!isOpen) return
        supabase.from('devices').select('config').eq('id', device?.id).single().then((data) => setConfig(data.data.config))
    }, [isOpen])


    useEffect(() => {
        console.log(config)
    }, [config])
    return (<>
        <Button color="secondary" className="cursor-pointer" variant="flat" onClick={onOpen}>
            Configurar
        </Button >
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton
            isDismissable={false}
            placement="top-center"
            size="5xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Configuración de dispositivo - {device?.config?.config?.deviceName}</ModalHeader>
                        <ModalBody>
                            <Input
                                labelPlacement='outside'
                                label="Nombre del dispositivo"
                                placeholder={config.deviceName}
                                variant="bordered"
                            />
                            <div className="flex py-2 px-1 justify-between">
                                <Checkbox
                                    classNames={{
                                        label: "text-small",
                                    }}
                                >
                                    Remember me
                                </Checkbox>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Guardar Configuración
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
    )
}