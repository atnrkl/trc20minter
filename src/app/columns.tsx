"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "./page";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "txid",
    header: "Txid",
  },
];
