"use client";
import { Input } from "@heroui/react";
import Link from "next/link";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import React, { useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { AddDevice } from "./add-device";

export const Devices = () => {
  const [filter, setFilter] = useState('')
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Inicio</span>
          </Link>
          <span> / </span>
        </li>

        <li className="flex gap-2">
          <span> {" "} </span>
          <Link href={"/devices"}>
            <span> Dispositivos</span>
          </Link>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Todos los dispositivos</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            onChange={(e) => setFilter(e.target.value)}
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Buscar dispositivo"
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddDevice />

        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper filter={filter.toLowerCase()} />
      </div>
    </div>
  );
};
