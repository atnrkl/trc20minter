"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Define the Payment type
export type Payment = {
  id: string;
  txid: string;
  status: "pending" | "processing" | "success" | "failed" | "tsx sent";
};

// Define the columns
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "txid",
    header: "txid",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

// Create DataTableProps interface
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

// Implement the DataTable component
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-[700px]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Example component that uses DataTable
const Home = () => {
  const [PK, setPK] = useState("");
  const [memo, setMemo] = useState("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<Payment[]>([]);

  /*const data: Payment[] = [
     {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    }, 
  ];*/

  const fetchData = async () => {
    try {
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privateKey: PK.trim(),
          memo: memo.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Process your response here
      const res: any = await response.json();

      const newTx: Payment = {
        id: res.txid,
        txid: res.txid,
        status: "tsx sent", // or other status
      };

      setData((currentData) => [...currentData, newTx]);
      console.log(data);
    } catch (error) {
      console.error("Fetching data failed:", error);
    }
  };

  const startFetching = () => {
    if (!intervalId) {
      const id = setInterval(fetchData, 3000);
      setIntervalId(id);
    }
  };

  const stopFetching = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="w-full space-y-10 min-h-screen flex-col flex items-center justify-center">
      <div>
        <Input
          placeholder="Private key"
          onChange={(e) => setPK(e.target.value)}
          className="w-96 rounded-md text-gray-900"
        />
      </div>
      <div>
        <Input
          placeholder="Data"
          onChange={(e) => setMemo(e.target.value)}
          className="w-96 rounded-md text-gray-900"
        />
      </div>
      <div className="flex flex-row space-x-20">
        <Button onClick={startFetching} variant={"outline"}>
          Start
        </Button>
        <Button onClick={stopFetching} variant={"outline"}>
          Stop
        </Button>
      </div>
      <DataTable<Payment> columns={columns} data={data} />
    </div>
  );
};

export default Home;
