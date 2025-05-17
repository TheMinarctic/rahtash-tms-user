import { z } from "zod";
import { validationErrorMessages } from "@/utils/errors/validation-error-messages";

export const upsetShipmentSchema = z.object({
  bill_of_lading_number_id: z.string().min(1, validationErrorMessages.requiredField),
  contains_dangerous_good: z.boolean().optional().nullable(),
  date_of_loading: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  carrier_company: z.number().optional().nullable(),
  forward_company: z.number().optional().nullable(),
  driver: z.number().optional().nullable(),
  step: z.number().optional().nullable(),
  port_loading: z.number().optional().nullable(),
  port_discharge: z.number().optional().nullable(),
  place_delivery: z.number().optional().nullable(),
  creator: z.number().optional().nullable(),
});

export type UpsetShipmentFormValues = z.infer<typeof upsetShipmentSchema>;
