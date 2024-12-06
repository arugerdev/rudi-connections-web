
import { LoginSchema } from "@/helpers/schemas";
import { ConfigFormType } from "@/helpers/types";
import { createClient } from "@/utils/supabase/client";
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Form, Formik } from "formik";
import router from "next/router";
import { useState, useEffect, useCallback } from "react";
import { signInWithEmail } from "../auth/supabase-auth";
import { InputsArray } from "../inputs/InputsArray";

export const ConfigureDeviceButtonModal = ({ device, resetList = () => { } }: { device: { id: number, config: ConfigFormType }, resetList: CallableFunction }) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const supabase = createClient()
    const [config, setConfig] = useState<ConfigFormType>(device?.config)
    const [loading, setLoading] = useState(false)
    const initialValues: ConfigFormType = {
        ...device?.config,

    };


    useEffect(() => {
        if (!isOpen) return
        supabase.from('devices').select('config').eq('id', device?.id).single().then((data) => setConfig(data?.data?.config))
    }, [isOpen])


    const handleConfigSubmit = useCallback(
        async (values: ConfigFormType) => {
            setLoading(true)

            //CAMBIA CONFIGURACIÓN A BASE DE DATOS
            const { data, error } = await supabase.from('devices').update({ config: values }).eq('id', device?.id)
            setLoading(false)
            if (!error) {
                onClose()
                resetList()
            }
        },
        [router]
    );

    return (<>
        <Button color="secondary" className="cursor-pointer" variant="flat" onClick={onOpen}>
            Configurar
        </Button >


        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton
            isDismissable={false}
            placement="bottom-center"
            scrollBehavior="inside"
            size="5xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleConfigSubmit}>
                            {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                                <form action="javascript:void(0)" className="w-full flex flex-col" onSubmit={() => handleSubmit}>

                                    <ModalHeader className="flex flex-col gap-1">Configuración de dispositivo - {config.deviceName}</ModalHeader>
                                    <ModalBody>
                                        < div className='flex flex-col w-full gap-4 mb-4'>
                                            <Input
                                                labelPlacement='outside'
                                                label="Nombre del dispositivo"
                                                name="deviceName"
                                                placeholder={config.deviceName}
                                                variant="bordered"
                                                onChange={handleChange("deviceName")}
                                                isRequired
                                                required={true}
                                                defaultValue={config.deviceName}
                                            />
                                            <section className="flex flex-col mt-4 gap-2">
                                                <h1 className="font-bold">Configuración de red</h1>
                                                <p className="text-danger text-sm">Por favor cambie los valores solo de las configuraciones que entienda, estas pueden hacer perder la conexión del dispositivo a internet y tener que reiniciarlo físicamente.</p>
                                                <Input
                                                    labelPlacement='outside'
                                                    label="IP Local del dispositivo"
                                                    name="networkConfig.ipAddress"
                                                    placeholder={config.networkConfig.ipAddress}
                                                    variant="bordered"
                                                    onChange={handleChange("networkConfig.ipAddress")}
                                                    isRequired
                                                    required={true}
                                                    defaultValue={config.networkConfig.ipAddress}

                                                />
                                                <Input
                                                    labelPlacement='outside'
                                                    label="Puerta de enlace"
                                                    name="networkConfig.gateway"
                                                    placeholder={config.networkConfig.gateway}
                                                    variant="bordered"
                                                    onChange={handleChange("networkConfig.gateway")}
                                                    isRequired
                                                    required={true}
                                                    defaultValue={config.networkConfig.gateway}

                                                />
                                                <h1 className="font-semibold">DNS{<span className="text-danger select-none	">*</span>
                                                }</h1>
                                                <InputsArray className=""
                                                    placeholders='0.0.0.0'
                                                    initialValues={config.networkConfig.dns}
                                                    min={1}
                                                    max={4}
                                                    color="default"
                                                    onValueChange={(value: any) => setFieldValue('networkConfig.dns', value)}
                                                />
                                            </section>

                                        </div>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                            Cancelar
                                        </Button>
                                        <Button color="primary"
                                            type="submit"
                                            isLoading={loading}
                                            onPress={() => handleSubmit()}>
                                            Guardar Configuración
                                        </Button>
                                    </ModalFooter>
                                </form >
                            )}
                        </Formik >
                    </>
                )}
            </ModalContent>
        </Modal>

    </>
    )
}