import { toast } from "sonner";
import { AxiosError } from "axios";

export const serverErrorToast = (res: AxiosError<any>) => {
  return toast.error(
    typeof res.response?.data?.error === "object"
      ? (Object.values(res.response.data.error)[0] as string)
      : res.message || "An error occurred!",
  );
};
