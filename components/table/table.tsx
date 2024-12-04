import {
  Button,
  CircularProgress,
  Link,
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

export const TableWrapper = ({ filter = '', select = true }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const supabase = createClient()

  const filterDevices = (devices: Array<any>) => {
    if (!filter || filter === '') return devices
    let filteredDevices: Array<any> = []

    filteredDevices = devices.filter((device: any) =>
      device?.name?.toLowerCase().includes(filter.toLowerCase())
      ||
      device?.public_ip?.includes(filter)
      ||
      device?.status?.toLowerCase().includes(filter.toLowerCase()))


    return filteredDevices
  }

  let list = useAsyncList({
    async load() {
      let dataDevices: any = []
      await getDevices().then((data) => {
        dataDevices = data.data;
      }).finally(() => setLoading(false))

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
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'devices' },
        () => {
          list.reload()
        }
      )
      .subscribe()
  }, [])

  function handleRemoveMultipleDevices(): void {
    const supabase = createClient()
    if (selectedKeys === 'all') {
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
          <p>Dispositivos seleccionados: {(selectedKeys === 'all' ? list.items.length : selectedKeys.size)}</p>
          <Tooltip
            content="Borrar dispositivo"
            color="danger"
          >
            <Button isDisabled={selectedKeys.size <= 0} isIconOnly variant='light' onClick={() => handleRemoveMultipleDevices()}>
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
        <TableBody emptyContent={loading ? 'Cargando...' : 'No hay dispositivos conectados a su cuenta actualmente, por favor, añade uno.'}
          isLoading={loading}
          loadingContent={<Spinner label="" />}
          loadingState={loading ? 'loading' : 'idle'}
          items={(filterDevices(list.items))}>
          {(item) => (
            <TableRow key={item.id}>
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
