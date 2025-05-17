import useSWR from "swr";
import { useFormContext } from "react-hook-form";
import { Combobox } from "@/components/ui/combobox";
import { UpsetShipmentFormValues } from "../schema/upset-shipment-schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const EditShipmentFormFields = ({ initialData }: { initialData?: any }) => {
  const form = useFormContext<UpsetShipmentFormValues>();
  const { control } = form;

  // SOME QUERIES IN EDIT MODE
  const users = useSWR<ApiRes<any[]>>(!initialData ? null : `/en/api/v1/user/list/`);
  const drivers = useSWR<ApiRes<any[]>>(!initialData ? null : `/en/api/v1/driver/list/`);
  const ports = useSWR<ApiRes<any[]>>(!initialData ? null : `/en/api/v1/shipment/port/list/`);
  const steps = useSWR<ApiRes<any[]>>(!initialData ? null : `/en/api/v1/shipment/step/list/`);
  const companies = useSWR<ApiRes<any[]>>(!initialData ? null : `/en/api/v1/company/list/`);

  return (
    <>
      <FormField
        control={control}
        name="carrier_company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Carrier Company</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                loading={companies.isLoading}
                items={
                  companies.data?.data?.map((item) => ({
                    name: item.name,
                    value: item.id,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="forward_company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Forward Company</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                loading={companies.isLoading}
                onValueChange={field.onChange}
                items={
                  companies.data?.data?.map((item) => ({
                    name: item.name,
                    value: item.id,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="driver"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Driver</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                loading={drivers.isLoading}
                items={
                  drivers.data?.data?.map((item) => ({
                    name: item.title,
                    value: item.id,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="step"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Step</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                loading={steps.isLoading}
                items={
                  steps.data?.data?.map((item) => ({
                    name: item.title,
                    value: item.id,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="port_loading"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port Loading</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                loading={ports.isLoading}
                items={
                  ports.data?.data?.map((item) => ({
                    name: item.title,
                    value: item.id,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="port_discharge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port Discharge</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                loading={ports.isLoading}
                items={
                  ports.data?.data?.map((item) => ({
                    name: item.title,
                    value: item.id,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="place_delivery"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Place Delivery</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                loading={ports.isLoading}
                items={
                  ports.data?.data?.map((item) => ({
                    name: item.title,
                    value: item.id,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="creator"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Creator</FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                loading={users.isLoading}
                items={
                  users.data?.data?.map((item) => ({
                    value: item.id,
                    name: `${item.first_name ? item.first_name : ""} ${item.last_name ? item.last_name : ""}`,
                  })) || []
                }
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default EditShipmentFormFields;
