import {
  CircularProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { columns, getDevices } from "./data";
import { RenderCell } from "./render-cell";

export const TableWrapper = ({ filter = '' }) => {
  const [devices, setDevices] = useState<any | null>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getDevices().then((data) => setDevices(data.data)).finally(() => setLoading(false))
  }, [])

  const filterDevices = (devices: Array<any>) => {
    if (!filter || filter === '') return devices
    let filteredDevices: Array<any> = []

    filteredDevices = devices.filter((device: object) =>
      device?.name?.toLowerCase().includes(filter.toLowerCase())
      ||
      device?.public_ip?.includes(filter)
      ||
      device?.status?.toLowerCase().includes(filter.toLowerCase()))


    return filteredDevices
  }

  return (
    <div className=" w-full flex flex-col gap-4">
      <Table >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={loading ? 'Cargando...' : 'No hay dispositivos conectados a su cuenta actualmente, por favor, añade uno.'}
          isLoading={loading}
          loadingContent={<CircularProgress />}
          loadingState={loading ? 'loading' : 'idle'}
          items={(devices ? filterDevices(devices) : [])}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ device: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
