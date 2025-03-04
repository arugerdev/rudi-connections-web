import { Card, CardBody } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { getDevices } from "../table/data";
import { createClient } from "@/utils/supabase/client";

export const CardAllDevices = () => {
  const [devices, setDevices] = useState<any | null>()

  useEffect(() => {
    getDevices().then((data) => setDevices(data.data))

    const supabase = createClient()

    supabase
      .channel('schema-allDevices-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'devices' },
        () => {
          getDevices().then((data) => setDevices(data.data))

        }
      )
      .subscribe()
  }, [])

  return (
    <Card className="xl:max-w-sm bg-[#eee] rounded-xl shadow-md  w-full ">
      <CardBody className="overflow-hidden">
        <div className="flex">
          <span className="text-xl text-black">Todos los dispositivos</span>
        </div>
        <div className="flex items-end justify-end h-full">
          <span className="text-4xl font-semibold text-black">{(devices ? devices.length : 0)}</span>
        </div>
      </CardBody>
    </Card>
  );
};
