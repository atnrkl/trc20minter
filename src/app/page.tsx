"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { DataTable } from "./dataTable";
import { columns } from "./columns";

// Define the Payment type
export type Payment = {
  id: string;
  txid: string;
  status: "pending" | "processing" | "success" | "failed" | "tsx sent";
};

const Home = () => {
  const [PK, setPK] = useState("");
  const [memo, setMemo] = useState("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<Payment[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pKey: PK.trim(),
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
        <p>Your P.K</p>
        <Input
          placeholder=""
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
