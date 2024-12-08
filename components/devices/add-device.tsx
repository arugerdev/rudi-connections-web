import { DeviceIdSchema } from "@/helpers/schemas";
import { DeviceIdFormType, LoginFormType } from "@/helpers/types";
import { createClient } from "@/utils/supabase/client";
import {
  Button,
  Input,
  InputProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import ReactInputMask from 'react-input-mask'
export const AddDevice = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const initialValues: DeviceIdFormType = {
    id: ''
  };


  const handleId = useCallback(
    async (values: DeviceIdFormType) => {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      const data = await supabase.from('devices').update({ owned_by: user.user?.id }).eq('key', values.id.toUpperCase().replaceAll('-', ''));
      if (data.error) {
        alert(data.error)
        throw data.error
      }
      window.location.reload()

      onOpenChange()
    },
    [router]
  )

  return (
    <div>
      <>
        <Button onPress={onOpen} color="primary">
          Añadir nuevo dispositivo
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Añadir nuevo dispositivo
                </ModalHeader>
                <Formik
                  initialValues={initialValues}
                  validationSchema={DeviceIdSchema}
                  onSubmit={handleId}>
                  {({ values, errors, touched, handleChange, handleSubmit }) => (
                    <form action="javascript:void(0)" className="w-full flex items-center justify-center flex-col" onSubmit={() => handleSubmit}>
                      <ModalBody>
                        <ReactInputMask mask='****-****-****-****'
                          type="text" onChange={handleChange("id")} maskChar={''} value={values.id.toUpperCase().replaceAll('-', '')}>
                          {(inputProps: InputProps) => (

                            <Input {...inputProps} isInvalid={!!errors.id && !!touched.id} errorMessage={errors.id} label="Id dispositivo" variant="bordered" placeholder="XXXX-XXXX-XXXX-XXXX" />
                          )}
                        </ReactInputMask>

                        <p className="text-slate-500 text-sm text-justify">Puedes encontrar el id del dispositivo en la pegatina en la parte trasera del mismo.</p>
                        <p className="text-slate-500 text-sm text-justify">Tambien puedes encontrarlo dentro de su panel de administración a traves de la web, indicando la dirección del dispositivo en la red local en un navegador.</p>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                          Cerrar
                        </Button>
                        <Button color="primary" onPress={() => handleSubmit()}
                          type="submit">
                          Añadir
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
    </div >
  );
};
