import  { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Shipments from "@/components/Shipments";


export default function ShipmentPage() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-full "> {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col  md:h-screen bg-gradient-to-r from-zinc-100 to-zinc-100">
        <div className="md:hidden">
          {/* <Header /> */}
        </div>

        <div className="flex-1 p-5 h-screen "> {/* Change min-h-full to min-h-0 */}
          <Shipments />
        </div>
      </div>
    </div>
  );
}