// ShipmentList.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import useSWR from "swr";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import { objectToQueryString } from "@/utils/object-to-query-string";
import { ModuleCardData } from "@/components/common/module-card-data";
import { ColumnDef } from "@tanstack/react-table";
import TableV2 from "@/components/ui/table/table-v2";
import ShipmentStatusBadge from "@/components/common/shipment-status-badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UpsertShipmentForm from "./components/UpsertShipmentForm";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { serverErrorToast } from "@/utils/errors/server-error-toast";

export default function ShipmentList() {
  const navigate = useNavigate();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [isOpenUpsertShipmentModal, setIsOpenUpsertShipmentModal] = useState(false);
  const [isOpenDeleteShipmentModal, setIsOpenDeleteShipmentModal] = useState(false);

  const [searchParams] = useSearchParams();
  const { data, error, isLoading, mutate } = useSWR<ApiRes<any[]>>(
    `/en/api/v1/shipment/list?${searchParams.toString()}`,
  );

  const handleViewDetails = (shipmentId) => {
    navigate(`/shipments/${shipmentId}`);
  };

  const handleCreate = () => {
    setInitialData(null);
    setIsOpenUpsertShipmentModal(true);
  };

  const handleEdit = (initialData: any) => {
    setInitialData(initialData);
    setIsOpenUpsertShipmentModal(true);
  };

  const handleDelete = (initialData: any) => {
    setInitialData(initialData);
    setIsOpenDeleteShipmentModal(true);
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id" },
    {
      header: "B/L number",
      accessorKey: "bill_of_lading_number_id",
      cell: ({ row: { original } }) => original?.bill_of_lading_number_id || "N/A",
    },
    { header: "carrier", cell: ({ row: { original } }) => original.carrier_company?.name || "N/A" },
    {
      header: "loading port",
      cell: ({ row: { original } }) => original.port_loading?.title || "N/A",
    },
    {
      header: "discharge port",
      cell: ({ row: { original } }) => original.port_discharge?.title || "N/A",
    },
    {
      header: "status",
      cell: ({ row: { original } }) => <ShipmentStatusBadge status={original.status} />,
    },
    {
      header: "created at",
      cell: ({ row: { original } }) => new Date(original.created_at).toLocaleDateString(),
    },
    {
      header: "actions",
      cell: ({ row: { original } }) => (
        <div className="center">
          <Button size="icon" variant="ghost" onClick={() => handleViewDetails(original.id)}>
            <Eye />
          </Button>

          <Button size="icon" variant="ghost" onClick={() => handleEdit(original)}>
            <Edit className="mb-0.5 !size-4" />
          </Button>

          <Button size="icon" variant="ghost" onClick={() => handleDelete(original)}>
            <Trash className="mb-0.5 !size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shipments</h1>

        <Button onClick={handleCreate}>
          Add New
          <Plus className="ms-2" />
        </Button>
      </div>

      <ModuleCardData isLoading={isLoading} error={error} isDataEmpty={!data?.data.length}>
        <TableV2 columns={columns} data={data?.data || []} />

        {/* Pagination */}
        <DynamicPaginator
          page_now={data?.page_now}
          per_page={data?.per_page}
          total_results={data?.total_results}
        />
      </ModuleCardData>

      {/* MODALS */}
      {/* ADD / EDIT SHIPMENT */}
      <Dialog open={isOpenUpsertShipmentModal} onOpenChange={setIsOpenUpsertShipmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit shipment" : "Create shipment"}</DialogTitle>
          </DialogHeader>

          <UpsertShipmentForm initialData={initialData} setIsOpen={setIsOpenUpsertShipmentModal} />
        </DialogContent>
      </Dialog>

      {/* DELETE SHIPMENT */}
      <Dialog open={isOpenDeleteShipmentModal} onOpenChange={setIsOpenDeleteShipmentModal}>
        <ConfirmDialog
          loading={deleteLoading}
          title="Delete shipment"
          onSubmit={async () => {
            setDeleteLoading(true);

            await axios
              .delete(`/en/api/v1/shipment/delete/${initialData?.id}/`)
              .then((res: AxiosResponse<ApiRes>) => {
                mutate();
                toast.success(res.data.message);
                setIsOpenDeleteShipmentModal(false);
              })
              .catch((err) => {
                return serverErrorToast(err);
              })
              .finally(() => setDeleteLoading(false));
          }}
        />
      </Dialog>
    </AppLayout>
  );
}
