import { Card, CardBody } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { getDevices } from "../table/data";
import { createClient } from "@/utils/supabase/client";

export const CardInactivesDevices = () => {
  const [devices, setDevices] = useState<any | null>()

  useEffect(() => {
    getDevices().then((data) => setDevices(data.data))

    const supabase = createClient()

    supabase
      .channel('schema-inactiveDevices-db-changes')
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
    <Card className="xl:max-w-sm bg-danger rounded-xl shadow-md  w-full ">
      <CardBody className="overflow-hidden">
        <div className="flex">
          <span className="text-white text-xl">Dispositivos inactivos</span>
        </div>
        <div className="flex items-end justify-end h-full">
          <span className="text-white text-4xl font-semibold">{(devices ? devices.filter((d: any) => d.status !== 'active' && d.status !== 'running').length : 0)}</span>
        </div>
      </CardBody>
    </Card>
  );
};
