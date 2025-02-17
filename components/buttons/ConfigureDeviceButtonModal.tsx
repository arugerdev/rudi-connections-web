
import { LoginSchema } from "@/helpers/schemas";
import { ConfigFormType } from "@/helpers/types";
import { createClient } from "@/utils/supabase/client";
import { Button, Select, SelectItem, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Accordion, AccordionItem, Switch } from "@nextui-org/react";
import { Form, Formik } from "formik";
import router from "next/router";
import { useState, useEffect, useCallback } from "react";
import { signInWithEmail } from "../auth/supabase-auth";
import { InputsArray } from "../inputs/InputsArray";
import toast from "react-hot-toast";

export const ConfigureDeviceButtonModal = ({ device, resetList = () => { } }: { device: { id: number, config: ConfigFormType, type: string | null }, resetList: CallableFunction }) => {
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
                toast.success('Configuración guardada correctamente')
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


                        <ModalHeader className="flex flex-col gap-1">Configuración de dispositivo - {config.deviceName}</ModalHeader>
                        <ModalBody>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleConfigSubmit}>
                                {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                                    <form action="javascript:void(0)" className="w-full flex flex-col" onSubmit={() => handleSubmit}>
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
                                            <Accordion variant="shadow" selectionMode="multiple">
                                                <AccordionItem key="1" aria-label="Configuración de red" title="Configuración de red">
                                                    <section className="flex flex-col mt-4 gap-2">
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
                                                        <Accordion variant="shadow" selectionMode="multiple">
                                                            <AccordionItem key="1" aria-label="Configuración de Adapatadores" title="Configuración de Adapatadores">
                                                                <section className="flex flex-col md:flex-row justify-center items-start gap-16">
                                                                    {config.networkConfig.interfaces.map((inter, key) => {
                                                                        return (
                                                                            <section key={inter.name + '_' + inter.type + '_' + key} className="flex flex-col w-full">
                                                                                <h1 className="font-bold text-xl p-0">{inter.name}{<span className="text-danger select-none	"></span>
                                                                                }</h1>
                                                                                <h2 className="font-bold text-sm pb-4 p-0">{inter.type}</h2>
                                                                                <div className="flex flex-col gap-4">
                                                                                    {inter.type !== 'modem' &&
                                                                                        <>
                                                                                            <h3 className="font-semibold">Modo de IP</h3>
                                                                                            <Select
                                                                                                defaultSelectedKeys={[inter.method ?? 'static']}
                                                                                                onChange={handleChange(`networkConfig.interfaces[${key}].method`)}
                                                                                                isRequired label="Modo"
                                                                                            >
                                                                                                <SelectItem key={'static'}>Estatico</SelectItem>
                                                                                                <SelectItem key={'dhcp'}>DHCP4</SelectItem>
                                                                                            </Select>
                                                                                        </>
                                                                                    }
                                                                                    {inter.type === 'wifi' &&
                                                                                        <>
                                                                                            < Input
                                                                                                labelPlacement='outside'
                                                                                                label="SSID"
                                                                                                name={`networkConfig.interfaces[${key}].ssid`}
                                                                                                placeholder={inter.ssid}
                                                                                                variant="bordered"
                                                                                                onChange={handleChange(`networkConfig.interfaces[${key}].ssid`)}
                                                                                                isRequired
                                                                                                required={true}
                                                                                                defaultValue={inter.ssid}
                                                                                            />
                                                                                            <Input
                                                                                                labelPlacement='outside'
                                                                                                label="Contraseña"
                                                                                                name={`networkConfig.interfaces[${key}].password`}
                                                                                                placeholder={inter.password}
                                                                                                variant="bordered"
                                                                                                onChange={handleChange(`networkConfig.interfaces[${key}].password`)}
                                                                                                isRequired
                                                                                                required={true}
                                                                                                defaultValue={inter.password}
                                                                                            />
                                                                                        </>

                                                                                    }
                                                                                    {inter.type === 'modem' &&
                                                                                        <>
                                                                                            < Input
                                                                                                labelPlacement='outside'
                                                                                                label="Proveedor"
                                                                                                name={`networkConfig.interfaces[${key}].provider`}
                                                                                                placeholder={inter.provider}
                                                                                                variant="bordered"
                                                                                                onChange={handleChange(`networkConfig.interfaces[${key}].provider`)}
                                                                                                isRequired
                                                                                                required={true}
                                                                                                defaultValue={inter.provider}
                                                                                            />
                                                                                            <Input
                                                                                                labelPlacement='outside'
                                                                                                label="PIN"
                                                                                                name='simConfig.pin'
                                                                                                placeholder={config.simConfig.pin}
                                                                                                variant="bordered"
                                                                                                onChange={handleChange('simConfig.pin')}
                                                                                                isRequired
                                                                                                required={true}
                                                                                                defaultValue={config.simConfig.pin}
                                                                                            />
                                                                                        </>

                                                                                    }
                                                                                </div>

                                                                            </section>
                                                                        )
                                                                    })

                                                                    }
                                                                </section>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </section>
                                                </AccordionItem>

                                                <AccordionItem key="2" aria-label="Servicios" title="Servicios">
                                                    <Accordion variant="shadow" selectionMode="multiple">
                                                        <AccordionItem key="1" aria-label="Servicios" startContent={
                                                            <Switch onChange={handleChange("services.sumi.enabled")} name="services.sumi.enabled" defaultSelected={config?.services?.sumi?.enabled} aria-label="Sumi - Servicio Universal de Monitoreo Industrial" />
                                                        } title="Sumi - Servicio Universal de Monitoreo Industrial">
                                                            <section className="flex flex-col gap-4">
                                                                <Input
                                                                    labelPlacement='outside'
                                                                    label="URL"
                                                                    name="services.sumi.url"
                                                                    placeholder={'https://sumi.com'}
                                                                    variant="bordered"
                                                                    onChange={handleChange("services.sumi.url")}
                                                                    isRequired
                                                                    required={true}
                                                                    // defaultValue={config.services.sumi.url}
                                                                    defaultValue={'https://sumi.com'}
                                                                />
                                                                <Input
                                                                    labelPlacement='outside'
                                                                    label="API Key"
                                                                    name="services.sumi.apiKey"
                                                                    // placeholder={config.services.sumi.apiKey}
                                                                    placeholder={'********'}
                                                                    variant="bordered"
                                                                    onChange={handleChange("services.sumi.apiKey")}
                                                                    isRequired
                                                                    required={true}
                                                                    // defaultValue={config.services.sumi.apiKey}
                                                                    defaultValue={'********'}
                                                                />
                                                            </section>
                                                        </AccordionItem>


                                                    </Accordion>
                                                </AccordionItem>
                                            </Accordion>

                                        </div>


                                        <ModalFooter>
                                            <Button color="danger" variant="flat" onPress={onClose}>
                                                Cancelar
                                            </Button>
                                            <Button color="primary"
                                                type="submit"
                                                isLoading={loading}
                                                onPress={() => handleSubmit()}
                                            >
                                                Guardar Configuración
                                            </Button>
                                        </ModalFooter>
                                    </form >
                                )}
                            </Formik >
                        </ModalBody>


                    </>
                )}
            </ModalContent>
        </Modal >

    </>
    )
}