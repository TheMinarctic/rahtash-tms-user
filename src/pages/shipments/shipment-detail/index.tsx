// ShipmentDetail.tsx
import useSWR from "swr";
import { ReactNode } from "react";
import { ApiResponse } from "@/types/api";
import { DateFormat } from "@/utils/date";
import { Button } from "@/components/ui/button";
import ShipmentDetailSteps from "./components/steps";
import AppLayout from "@/components/layout/AppLayout";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ShipmentDetailContainers from "./components/containers";
import { ModuleCardData } from "@/components/common/module-card-data";
import ShipmentStatusBadge from "@/components/common/shipment-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShipmentPortStatusBadge from "@/components/common/shipment-port-status-badge";

export default function ShipmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isValidating, error } = useSWR<ApiRes<ApiResponse.Shipment>>(
    `/en/api/v1/shipment/detail/${id}/`
  );

  const shipment = data?.data;

  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shipment Details</CardTitle>

            <Button variant="outline" onClick={() => navigate("/shipments")}>
              <ArrowLeft className="!me-1.5 !ms-0" />
              Back to Shipments
            </Button>
          </div>
        </CardHeader>

        <ModuleCardData isLoading={isLoading} error={error} isValidating={isValidating}>
          <CardContent>
            <div className="flex flex-col gap-8">
              {/* SHIPMENT DETAILS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x">
                <div className="space-y-4 pe-2.5 lg:pe-5 xl:pe-10">
                  <RowDetail title="ID" value={shipment?.id} />

                  <RowDetail
                    title="Bill of Lading Number"
                    value={shipment?.bill_of_lading_number_id || "N/A"}
                  />

                  <RowDetail
                    title="Contains Dangerous Goods"
                    value={
                      shipment?.contains_dangerous_good ? (
                        <div className="center gap-2">
                          <AlertTriangle className="text-orange-600 dark:text-orange-400" />
                          <span>Yes</span>
                        </div>
                      ) : (
                        "No"
                      )
                    }
                  />

                  <RowDetail
                    title="Date of Loading"
                    value={
                      shipment?.date_of_loading
                        ? `${DateFormat.YYYY_MM_DD(
                            shipment?.date_of_loading
                          )} | ${DateFormat.YYYY_MM_DD(shipment?.date_of_loading, {
                            locale: "fa",
                          })}`
                        : "N/A"
                    }
                  />
                </div>

                <div className="space-y-4 ps-2.5 lg:ps-5 xl:ps-10">
                  <RowDetail
                    title="Status"
                    value={<ShipmentStatusBadge status={shipment?.status} />}
                  />

                  <RowDetail
                    title="Created At"
                    value={DateFormat.YYYY_MM_DD(shipment?.created_at)}
                  />

                  <RowDetail
                    title="Updated At"
                    value={DateFormat.YYYY_MM_DD(shipment?.updated_at)}
                  />

                  <RowDetail title="Notes" value={shipment?.note || "N/A"} />
                </div>
              </div>

              <hr />

              {/* STEPS */}
              <ShipmentDetailSteps shipment={shipment} />

              <hr />

              {/* CONTAINERS */}
              <ShipmentDetailContainers id={id} />
              <hr />

              {/* Related entities */}
              <Card className="grid grid-cols-1 gap-5 bg-muted p-5 lg:grid-cols-2 2xl:grid-cols-3">
                <RelatedEntity
                  title="Carrier Company"
                  showEmptyText={!shipment?.carrier_company}
                  items={[
                    { title: "name", value: shipment?.carrier_company?.name },
                    {
                      title: "category",
                      value: shipment?.carrier_company?.category?.title || "N/A",
                    },
                    { title: "owner", value: shipment?.carrier_company?.owner?.email || "N/A" },
                  ]}
                />

                <RelatedEntity
                  title="Forward Company"
                  showEmptyText={!shipment?.forward_company}
                  items={[
                    { title: "name", value: shipment?.forward_company?.name },
                    {
                      title: "category",
                      value: shipment?.forward_company?.category?.title || "N/A",
                    },
                    { title: "owner", value: shipment?.forward_company?.owner?.email || "N/A" },
                  ]}
                />

                <RelatedEntity
                  title="Driver"
                  showEmptyText={!shipment?.driver}
                  items={[
                    { title: "name", value: shipment?.driver?.title },
                    { title: "category", value: shipment?.driver?.category?.title || "N/A" },
                    { title: "owner", value: shipment?.driver?.user?.email || "N/A" },
                  ]}
                />

                <RelatedEntity
                  title="Current Step"
                  showEmptyText={!shipment?.step}
                  emptyText="No step assigned"
                  items={[
                    { title: "title", value: shipment?.step?.title },
                    { title: "order", value: shipment?.step?.order },
                    {
                      title: "status",
                      value: <ShipmentPortStatusBadge status={shipment?.step?.status} />,
                    },
                  ]}
                />

                <RelatedEntity
                  title="Loading Port"
                  showEmptyText={!shipment?.port_loading}
                  emptyText="No loading port assigned"
                  items={[
                    { title: "title", value: shipment?.port_loading?.title },
                    { title: "country", value: shipment?.port_loading?.country },
                  ]}
                />

                <RelatedEntity
                  title="Discharge Port"
                  showEmptyText={!shipment?.port_discharge}
                  emptyText="No discharge port assigned"
                  items={[
                    { title: "title", value: shipment?.port_discharge?.title },
                    { title: "country", value: shipment?.port_discharge?.country },
                  ]}
                />

                <RelatedEntity
                  title="Place of Delivery"
                  showEmptyText={!shipment?.place_delivery}
                  items={[
                    { title: "title", value: shipment?.place_delivery?.title },
                    { title: "country", value: shipment?.place_delivery?.country },
                  ]}
                />
              </Card>
            </div>
          </CardContent>
        </ModuleCardData>
      </Card>
    </AppLayout>
  );
}

const RowDetail = ({ title, value }: { title: ReactNode; value: ReactNode }) => {
  return (
    <div className="flex items-center justify-between gap-5">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p>{value}</p>
    </div>
  );
};

const RelatedEntity = ({
  title,
  items,
  emptyText,
  showEmptyText = true,
}: {
  title: string;
  emptyText?: string;
  showEmptyText?: boolean;
  items: { title: string; value: ReactNode }[];
}) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="py-4">
        {!showEmptyText ? (
          <div>
            {items.map((item, index) => (
              <div
                key={item.title + index}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-1 text-accent-foreground first:pt-0 last:pb-0 even:bg-muted"
              >
                <h6 className="font-medium capitalize">{item.title}</h6>

                <div className="line-clamp-1">{item.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{emptyText || `No ${title} assigned`}</p>
        )}
      </CardContent>
    </Card>
  );
};
