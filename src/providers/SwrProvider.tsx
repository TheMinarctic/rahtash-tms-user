import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { axios } from "@/lib/axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const SwrProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SwrProvider;
