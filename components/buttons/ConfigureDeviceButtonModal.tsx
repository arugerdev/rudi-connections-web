
import { LoginSchema } from "@/helpers/schemas";
import { ConfigFormType } from "@/helpers/types";
import { createClient } from "@/utils/supabase/client";
import { Button, Select, SelectItem, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Accordion, AccordionItem, Switch, Link } from "@heroui/react";
import { Form, Formik } from "formik";
import router from "next/router";
import { useState, useEffect, useCallback } from "react";
import { signInWithEmail } from "../auth/supabase-auth";
import { InputsArray } from "../inputs/InputsArray";
import toast from "react-hot-toast";

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