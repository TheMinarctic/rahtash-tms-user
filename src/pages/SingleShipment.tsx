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

      <div className="flex-1 flex flex-col bg-gradient-to-r from-gray-800 to-gray-600">
        <div className="md:hidden">
          {/* <Header /> */}
        </div>

        <div className="flex-1  p-5 min-h-screen">
       
          <Shipment id={id} />
        </div>
      </div>
    </div>
  );
}