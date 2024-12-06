import  { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Shipments from "@/components/Shipments";


export default function ShipmentPage() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-screen"> {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col h-[1100px] md:h-screen bg-gradient-to-r from-gray-800 to-gray-600">
        <div className="md:hidden">
          {/* <Header /> */}
        </div>

        <div className="flex-1 p-5 "> {/* Change min-h-full to min-h-0 */}
          <Shipments />
        </div>
      </div>
    </div>
  );
}