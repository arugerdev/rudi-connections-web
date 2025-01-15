import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { columns, getDevices } from "./data";
import { RenderCell } from "./render-cell";
import { createClient } from "@/utils/supabase/client";
import { useAsyncList } from "@react-stately/data";
import { DeleteIcon } from "../icons/table/delete-icon";
import { Selection } from '@nextui-org/react';
import { Database } from "@/helpers/database.types";

export const TableWrapper = ({ filter = '', select = true }) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [page, setPage] = useState(1);

  const supabase = createClient()
  const filterDevices = (devices: Array<any>) => {
    if (!filter || filter === '') return devices
    let filteredDevices: Array<any> = []

    filteredDevices = devices.filter((device: any) =>
      device?.config?.deviceName?.toLowerCase().includes(filter.toLowerCase())
      ||
      device?.public_ip?.includes(filter)
      ||
      device?.status?.toLowerCase().includes(filter.toLowerCase()))


    return filteredDevices
  }

  let list = useAsyncList<Database["public"]["Tables"]["devices"]["Row"]>({
    async load() {
      let dataDevices: any = []
      await getDevices().then((data) => {
        dataDevices = data.data;
      })

      return {
        items: dataDevices,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    const taskListener = supabase
      .channel("devices-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "devices" },
        (payload) => {

          if (findDifference(payload.new, payload.old).filter((key) => key !== 'last_updated' && key !== 'config').length > 0) {
            list.reload();
          }
        }
      )
      .subscribe();

  }, []);


  function findDifference(obj1: any, obj2: any) {
    const diffKeys = [];
    for (const key in obj1) {
      if (!(key in obj2) ||
        obj1[key] !== obj2[key]) {
        diffKeys.push(key);
      }
    }
    for (const key in obj2) {
      if (!(key in obj1) ||
        obj1[key] !== obj2[key]) {
        if (!diffKeys.includes(key)) {
          diffKeys.push(key);
        }
      }
    }
    return diffKeys;
  }

  function handleRemoveMultipleDevices(): void {
    const supabase = createClient()
    if (selectedKeys == 'all') {
      list.items.forEach(async (item) => {
        const data = await supabase.from('devices').update({ owned_by: null }).eq('id', item?.id);
        if (data.error) {
          throw data.error
        }
      })
      setSelectedKeys(new Set([]))
      return
    }

    selectedKeys.forEach(async (item) => {
      const data = await supabase.from('devices').update({ owned_by: null }).eq('id', item);
      if (data.error) {
        throw data.error
      }
    })
    setSelectedKeys(new Set([]))
  }

  return (
    <div className=" w-full flex flex-col gap-2">
      {select &&
        <section className="flex flex-row gap-2 items-center justify-between text-foreground-400 font-semibold text-sm">
          <p>Dispositivos seleccionados: {(selectedKeys == 'all' ? list.items.length : selectedKeys.size)}</p>
          <Tooltip
            content="Borrar varios dispositivos"
            color="danger"
          >
            <Button isDisabled={(selectedKeys == 'all' ? false : selectedKeys.size <= 0)} isIconOnly variant='light' onClick={() => handleRemoveMultipleDevices()}>
              <DeleteIcon size={20} fill="#FF0080" />
            </Button>
          </Tooltip>
        </section>
      }
      <Table
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        selectionMode={select ? "multiple" : 'none'}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        color={'primary'}

      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={list.isLoading ? 'Cargando...' : 'No hay dispositivos conectados a su cuenta actualmente, por favor, añade uno.'}
          isLoading={list.isLoading}
          loadingContent={<Spinner label="" />}
          loadingState={list.isLoading ? 'loading' : 'idle'}
          items={(filterDevices(list.items))}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ device: item, columnKey: columnKey, resetList: list.reload })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
