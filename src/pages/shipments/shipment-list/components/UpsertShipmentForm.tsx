import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { mutate } from "swr";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectV2 from "@/components/ui/select/select-v2";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { UpsetShipmentFormValues, upsetShipmentSchema } from "../../schema/upset-shipment-schema";
import EditShipmentFormFields from "./EditShipmentFormFields";

const UpsertShipmentForm = ({
  initialData,
  setIsOpen,
}: {
  initialData?: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [searchParams] = useSearchParams();

  const form = useForm<UpsetShipmentFormValues>({
    resolver: zodResolver(upsetShipmentSchema),
    defaultValues: {
      bill_of_lading_number_id: initialData?.bill_of_lading_number_id || "",
      contains_dangerous_good: initialData?.contains_dangerous_good || false,
      date_of_loading: initialData?.date_of_loading,
      note: initialData?.note || "",
      step: initialData?.step?.id,
      driver: initialData?.driver?.id,
      creator: initialData?.creator?.id,
      place_delivery: initialData?.place_delivery?.id,
      port_discharge: initialData?.port_discharge?.id,
      port_loading: initialData?.port_loading?.id,
      carrier_company: initialData?.carrier_company?.id,
      forward_company: initialData?.forward_company?.id,
    },
  });
  const { handleSubmit, register, control, formState } = form;
  const { isSubmitting, errors } = formState;

  const onSubmit = async (data: UpsetShipmentFormValues) => {
    // CREATE
    if (!initialData) {
      await axios
        .post("/en/api/v1/shipment/create/", data)
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/list?${searchParams.toString()}`);
          setIsOpen(false);
        })
        .catch((err) => {
          return serverErrorToast(err);
        });
    }

    // UPDATE
    else {
      await axios
        .patch(`/en/api/v1/shipment/update/${initialData.id}/`, data)
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/list?${searchParams.toString()}`);
          setIsOpen(false);
        })
        .catch((err) => {
          return serverErrorToast(err);
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={control}
              name="bill_of_lading_number_id"
              render={({ field }) => (
                <FormItem>
                  <Label isRequired>Bill of Lading Number</Label>

                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="date_of_loading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Loading</FormLabel>

                  <DatePicker
                    date={field.value}
                    setDate={(v) => {
                      field.onChange(v.toISOString());
                    }}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center">
              <FormField
                control={control}
                name="contains_dangerous_good"
                render={({ field }) => (
                  <FormItem>
                    <div className="center">
                      <FormControl>
                        <Checkbox
                          id="contains_dangerous_good"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="contains_dangerous_good" className="ms-2 block">
                        Contains Dangerous Goods
                      </Label>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* IF TRUE EDIT MODE, SHOWING SOME EXTRA FIELDS */}
            {initialData && <EditShipmentFormFields initialData={initialData} />}

            <div className="md:col-span-2">
              <Label className="mb-2 block">Notes</Label>
              <Textarea {...register("note")} error={errors?.note?.message} />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {initialData ? "Edit Shipment" : "Create Shipment"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpsertShipmentForm;
