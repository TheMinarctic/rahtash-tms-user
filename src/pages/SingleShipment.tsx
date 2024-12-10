import { useState } from "react";
// import Header from "../Components/Header";
import Sidebar from "@/components/Sidebar";

import Shipment from "@/components/Shipment";
import { useParams } from "react-router-dom";

export default function SingleShipment() {
  const [open, setOpen] = useState(true);
  const {id} = useParams();

  return (
    <div dir="ltr" className="flex">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col bg-gradient-to-r from-zinc-100 to-zinc-100">
        <div className="md:hidden">
          {/* <Header /> */}
        </div>

        <div className="flex-1  min-h-screen">
       
          <Shipment id={id} />
        </div>
      </div>
    </div>
  );
}