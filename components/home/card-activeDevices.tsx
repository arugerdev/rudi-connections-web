import { Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { getDevices } from "../table/data";

export const CardActivesDevices = () => {
  const [devices, setDevices] = useState<any | null>()

  useEffect(() => {
    getDevices().then((data) => setDevices(data.data))
  }, [])

  return (
    <Card className="xl:max-w-sm bg-[#494] rounded-xl shadow-md  w-full">
      <CardBody className="overflow-hidden">
        <div className="flex">
          <span className="text-white text-xl">Dispositivos activos</span>
        </div>
        <div className="flex items-end justify-end h-full">
          <span className="text-white text-4xl font-semibold">{(devices ? devices?.filter((d: any) => d.status === 'active' || d.status === 'running').length : 0)}</span>
        </div>
      </CardBody>
    </Card>
  );
};
