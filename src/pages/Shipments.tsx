import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Shipment {
  id: number;
  shipment_name: string;
  number_of_containers: number;
  contains_dangerous_goods: boolean;
  port_of_loading: string;
  port_of_discharge: string;
  place_of_delivery: string;
  bill_of_lading_document?: string;
}

const ShipmentForm = ({ 
  onSubmit, 
  initialData = null,
  onClose 
}: { 
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Shipment | null;
  onClose: () => void;
}) => {
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      onClose();
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="shipment_name">Shipment Name</Label>
        <Input
          id="shipment_name"
          name="shipment_name"
          defaultValue={initialData?.shipment_name}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number_of_containers">Number of Containers</Label>
        <Input
          id="number_of_containers"
          name="number_of_containers"
          type="number"
          defaultValue={initialData?.number_of_containers}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="contains_dangerous_goods"
          name="contains_dangerous_goods"
          defaultChecked={initialData?.contains_dangerous_goods}
        />
        <Label htmlFor="contains_dangerous_goods">Contains Dangerous Goods</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="port_of_loading">Port of Loading</Label>
        <Input
          id="port_of_loading"
          name="port_of_loading"
          defaultValue={initialData?.port_of_loading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="port_of_discharge">Port of Discharge</Label>
        <Input
          id="port_of_discharge"
          name="port_of_discharge"
          defaultValue={initialData?.port_of_discharge}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="place_of_delivery">Place of Delivery</Label>
        <Input
          id="place_of_delivery"
          name="place_of_delivery"
          defaultValue={initialData?.place_of_delivery}
          required
        />
      </div>
      {!initialData && (
        <div className="space-y-2">
          <Label htmlFor="bill_of_lading_document">Bill of Lading Document</Label>
          <Input
            id="bill_of_lading_document"
            name="bill_of_lading_document"
            type="file"
            accept=".pdf,.doc,.docx"
          />
        </div>
      )}
      <Button type="submit" className="w-full">
        {initialData ? "Update Shipment" : "Create Shipment"}
      </Button>
    </form>
  );
};

const Shipments = () => {
  const { accessToken, logout } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const fetchShipments = async () => {
    try {
      const response = await fetch("https://api.rahtash-tms.ir/api/v1/shipments/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setShipments(data.data);
      } else {
        toast.error("Failed to fetch shipments");
      }
    } catch (error) {
      toast.error("An error occurred while fetching shipments");
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [accessToken]);

  const handleCreate = async (formData: FormData) => {
    try {
      const response = await fetch("https://api.rahtash-tms.ir/api/v1/shipments/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Shipment created successfully");
        fetchShipments();
      } else {
        toast.error("Failed to create shipment");
      }
    } catch (error) {
      toast.error("An error occurred while creating the shipment");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!selectedShipment) return;

    try {
      const response = await fetch(`https://api.rahtash-tms.ir/api/v1/shipments/${selectedShipment.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Shipment updated successfully");
        fetchShipments();
      } else {
        toast.error("Failed to update shipment");
      }
    } catch (error) {
      toast.error("An error occurred while updating the shipment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Shipments</h1>
          <div className="space-x-4">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Shipment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                </DialogHeader>
                <ShipmentForm onSubmit={handleCreate} onClose={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <Card key={shipment.id} className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{shipment.shipment_name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedShipment(shipment);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-semibold">Containers:</span> {shipment.number_of_containers}</p>
                  <p><span className="font-semibold">Loading Port:</span> {shipment.port_of_loading}</p>
                  <p><span className="font-semibold">Discharge Port:</span> {shipment.port_of_discharge}</p>
                  <p><span className="font-semibold">Delivery Place:</span> {shipment.place_of_delivery}</p>
                  {shipment.contains_dangerous_goods && (
                    <p className="text-red-500">Contains Dangerous Goods</p>
                  )}
                  {shipment.bill_of_lading_document && (
                    <a
                      href={shipment.bill_of_lading_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Bill of Lading
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Shipment</DialogTitle>
            </DialogHeader>
            {selectedShipment && (
              <ShipmentForm
                initialData={selectedShipment}
                onSubmit={handleUpdate}
                onClose={() => setIsEditOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Shipments;