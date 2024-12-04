"use client";
import React from "react";
import { TableWrapper } from "../table/table";
import { CardActivesDevices } from "./card-activeDevices";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { CardInactivesDevices } from "./card-inactiveDevices";
import { CardAllDevices } from "./card-allDevices";

export const Content = () => (
  <div className="h-full lg:px-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
      <div className="mt-6 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Estadísticas</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
            <CardActivesDevices />
            <CardInactivesDevices />
            <CardAllDevices />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
      <div className="flex  flex-wrap justify-between">
        <h3 className="text-center text-xl font-semibold">Últimos Dispositivos</h3>
        <Link
          href="/devices"
          as={NextLink}
          color="primary"
          className="cursor-pointer"
        >
          Ver todos
        </Link>
      </div>
      <TableWrapper select={false} />
    </div>
  </div>
);
