import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectV2 from "@/components/ui/select/select-v2";
import { ContainerTypeEnum } from "@/enums/container-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContainerSizeEnum } from "@/enums/container-size";
import { ContainerStatusEnum } from "@/enums/container-status";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { validationErrorMessages } from "@/utils/errors/validation-error-messages";

interface Props {
  shipmentId: string | number;
  mutate: () => void;
  initialData?: ApiResponse.Container;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpsertContainerForm = ({ initialData, setIsOpen, mutate, shipmentId }: Props) => {
  const [sizeType, setSizeType] = useState<"select" | "custom">("select");

  const form = useForm<FormValues>({
    defaultValues: {
      order: initialData?.order,
      size: initialData?.size,
      status: initialData?.status,
      type: initialData?.type,
      track_number: initialData?.track_number,
    },
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit, control, formState } = form;

  const onSubmit = async (data: FormValues) => {
    if (!initialData) {
      await axios
        .post("/en/api/v1/shipment/container/create/", { ...data, shipment: shipmentId })
        .then((res: AxiosResponse<ApiRes>) => {
          mutate();
          toast.success(res.data.message);
          setIsOpen(false);
        })
        .catch((err) => serverErrorToast(err));
    } else {
      await axios
        .patch(`/en/api/v1/shipment/container/update/${initialData.id}/`, {
          ...data,
          shipment: shipmentId,
        })
        .then((res) => {
          mutate();
          toast.success(res.data.message);
          setIsOpen(false);
        })
        .catch((err) => serverErrorToast(err));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-4">
            {/* TRACK NUMBER */}
            <FormField
              control={control}
              name="track_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Track Number</FormLabel>

                  <FormControl>
                    <Input {...field} className="w-full" placeholder="Enter track number" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SIZE */}
            <FormField
              control={control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Size</FormLabel>

                  <FormControl>
                    <SelectV2
                      value={field.value}
                      onValueChange={(v) => {
                        if (v === "custom") {
                          setSizeType("custom");
                          field.onChange(v);
                        } else {
                          setSizeType("select");
                          field.onChange(parseInt(String(v), 10));
                        }
                      }}
                      items={[
                        ...Object.entries(ContainerSizeEnum).map(([key, value]) => ({
                          name: value,
                          value: Number(key),
                        })),
                        { value: "custom", name: "Custom Size" },
                      ]}
                    />
                  </FormControl>

                  {sizeType === "custom" ||
                    (form.watch("size") &&
                      !Object.entries(ContainerSizeEnum).find(
                        ([key]) => form.watch("size") === Number(key)
                      ) && (
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      ))}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Type</FormLabel>

                  <FormControl>
                    <SelectV2
                      value={field.value}
                      onValueChange={field.onChange}
                      items={Object.entries(ContainerTypeEnum).map(([key, value]) => ({
                        name: value,
                        value: Number(key),
                      }))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STATUS */}
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>

                  <FormControl>
                    <SelectV2
                      value={field.value}
                      onValueChange={field.onChange}
                      items={Object.entries(ContainerStatusEnum).map(([key, value]) => ({
                        name: value,
                        value: Number(key),
                      }))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ORDER */}
            <FormField
              control={control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Order</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="w-full"
                      placeholder="Enter loading order"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button loading={formState.isSubmitting} disabled={formState.isSubmitting}>
            {initialData ? "Edit container" : "Add container"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpsertContainerForm;

const formSchema = z.object({
  track_number: z.string().min(1, validationErrorMessages.requiredField),
  order: z.number().min(1, validationErrorMessages.requiredField),
  type: z.number(),
  size: z
    .number({ invalid_type_error: validationErrorMessages.requiredField })
    .min(1, validationErrorMessages.requiredField),
  status: z.number().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;
