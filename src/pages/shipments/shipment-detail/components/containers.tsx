import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { GoContainer } from "react-icons/go";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpsertContainerForm from "./upsert-container-form";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { ModuleCardData } from "@/components/common/module-card-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse } from "@/types/api";
import { ContainerTypeEnum } from "@/enums/container-type";
import { ContainerStatusEnum } from "@/enums/container-status";

const ShipmentDetailContainers = ({ id }: { id: string | number }) => {
  const [deleteContainerLoading, setDeleteContainerLoading] = useState(false);

  const [initialData, setInitialData] = useState<ApiResponse.Container | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<ApiResponse.Container[]>>(
    `/en/api/v1/shipment/container/list/?shipment=${id}`
  );

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
          <CardTitle className="flex items-center gap-2">
            <GoContainer className="h-5 w-5" />
            <span>Containers ({data?.data ? data?.data?.length : null})</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ModuleCardData
            error={error}
            isLoading={isLoading}
            isValidating={isValidating}
            isDataEmpty={!data?.data?.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.data?.map((container) => (
                <div
                  key={container.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-200">
                        <GoContainer className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-medium">#{container.track_number}</p>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <Badge variant="outline">{container.size}ft</Badge>
                          <Badge variant="outline">{ContainerTypeEnum[container.type]}</Badge>
                          <Badge variant={container.status === 2 ? "destructive" : "outline"}>
                            {ContainerStatusEnum[container.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="center gap-2">
                      <Button
                        onClick={() => {
                          setInitialData(container);
                          setIsAddContainerModalOpen(true);
                        }}
                        title="Edit"
                        size="icon"
                        variant="muted"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        onClick={() => {
                          setInitialData(container);
                          setIsDeleteModalOpen(true);
                        }}
                        size="icon"
                        title="Delete"
                        variant="destructive"
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      Order: {container.order || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ModuleCardData>
        </CardContent>

        {data?.data?.length > 0 ? (
          <CardFooter className="flex justify-end">
            <Button
              onClick={() => {
                setInitialData(null);
                setIsAddContainerModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Container
            </Button>
          </CardFooter>
        ) : null}
      </Card>

      {/* MODALS */}
      {/* Add / Edit Container Modal */}
      <Dialog open={isAddContainerModalOpen} onOpenChange={setIsAddContainerModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit container" : "Add container"}</DialogTitle>
          </DialogHeader>

          <UpsertContainerForm
            shipmentId={id}
            mutate={mutate}
            initialData={initialData}
            setIsOpen={setIsAddContainerModalOpen}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Container Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ConfirmDialog
          title="Delete Container"
          loading={deleteContainerLoading}
          onSubmit={async () => {
            setDeleteContainerLoading(true);
            await axios
              .delete(`/en/api/v1/shipment/container/delete/${initialData?.id}/`)
              .then((res: AxiosResponse<ApiRes>) => {
                mutate();
                toast.success(res.data.message);
                setIsDeleteModalOpen(false);
              })
              .catch((err) => serverErrorToast(err))
              .finally(() => setDeleteContainerLoading(false));
          }}
        />
      </Dialog>
    </>
  );
};

export default ShipmentDetailContainers;
