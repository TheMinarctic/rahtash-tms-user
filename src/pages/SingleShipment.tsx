import Shipment from "@/components/Shipment";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

export default function SingleShipment() {
  const { id } = useParams();

  return (
    <AppLayout>
      <Shipment id={id} />
    </AppLayout>
  );
}
