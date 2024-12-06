import {
  Button,
  CircularProgress,
  Link,
  Pagination,
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
import { ConfigFormType, DeviceIdFormType } from "@/helpers/types";

export const TableWrapper = ({ filter = '', select = true }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
  const [page, setPage] = useState(1);

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

  let list = useAsyncList<DeviceIdFormType>({
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
    // Función para obtener los datos más recientes desde la base de datos
    const fetchCurrentData = async (id: any) => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('id', id) // Asegúrate de poner la id adecuada
        .single();

      if (error) {
        console.error('Error fetching current data:', error);
        return null;
      }
      return data;
    };

    // Suscribirse a los cambios
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'devices' },
        async (value) => {
          // Verificar que sea un cambio en la tabla devices
          const newData = value.new;

          // Excluir 'last_update' y 'status' de la comparación
          const { last_update, status, public_ip, ...relevantNewData } = newData;

          // Consultar la base de datos para obtener el estado actual
          const currentData = await fetchCurrentData(newData?.id);

          // Si no pudimos obtener los datos actuales, no hacemos nada
          if (!currentData) return;

          // Excluir también last_update y status del objeto de datos actual
          const { last_update: currentLastUpdate, status: currentStatusm, public_ip: currePublicIp, ...relevantCurrentData } = currentData;

          // Comparar los datos relevantes (sin last_update ni status)
          const hasChanges = Object.keys(relevantNewData).some(
            (key) => relevantNewData[key] !== relevantCurrentData[key]
          );

          if (hasChanges) {
            console.log('Detected relevant changes: ', relevantNewData);
            // Aquí puedes realizar la acción que necesites, como recargar los datos
            list.reload(); // Lógica para recargar los datos si es necesario
          } else {
            console.log('Change in last_update or status, ignoring...');
          }
        }
      )
      .subscribe();

    // Cleanup del efecto (desuscripción cuando el componente se desmonta)
    return () => {
      subscription.unsubscribe();
    };
  }, []);


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
            content="Borrar dispositivo"
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
        onSelectionChange={(keys: Selection) => {
          setSelectedKeys(keys)
          console.log(keys)
          console.log(selectedKeys)
        }}
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
