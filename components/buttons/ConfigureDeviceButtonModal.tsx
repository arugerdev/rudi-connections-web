
import { LoginSchema } from "@/helpers/schemas";
import { ConfigFormType } from "@/helpers/types";
import { createClient } from "@/utils/supabase/client";
import { Button, Select, SelectItem, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Accordion, AccordionItem, Switch, Link } from "@nextui-org/react";
import { Form, Formik } from "formik";
import router from "next/router";
import { useState, useEffect, useCallback } from "react";
import { signInWithEmail } from "../auth/supabase-auth";
import { InputsArray } from "../inputs/InputsArray";
import toast from "react-hot-toast";

export const ConfigureDeviceButtonModal = ({ device, resetList = () => { } }: {
    device: {
        status: string;
        secret_key: string; key: string; id: number, config: ConfigFormType, type: string | null
    }, resetList: CallableFunction
}) => {

    return (
        <Button as={Link} isDisabled={!device.config?.tailscale?.website || device.config?.tailscale?.website == '' || device.status !== 'running'} rel="noopener noreferrer" href={`//${device.config?.tailscale?.website ?? 'rud1.es'}?key=${device?.secret_key ?? 'error'}&device=${device.key ?? 'error'}`} color="secondary" className="cursor-pointer" variant="flat">
            Configurar
        </Button >
    )
}