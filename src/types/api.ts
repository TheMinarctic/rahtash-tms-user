/* eslint-disable @typescript-eslint/no-namespace */
export declare namespace ApiResponse {
  interface Shipment {
    id: number;
    carrier_company?: CarrierCompany;
    forward_company?: ForwardCompany;
    driver?: Driver;
    step?: Step;
    port_loading?: PortLoading;
    port_discharge?: PortDischarge;
    place_delivery?: PlaceDelivery;
    creator?: Creator;
    bill_of_lading_number_id: string;
    contains_dangerous_good: boolean;
    date_of_loading: string;
    date_of_loading_jalali: string;
    note: string;
    status?: number;
    created_at: string;
    updated_at: string;
  }

  interface CarrierCompany {
    id: number;
    name: string;
    logo: string;
    status: number;
    category: Category;
    owner: Owner;
  }

  interface Category {
    id: number;
    title: string;
    status: number;
    order: number;
  }

  interface Owner {
    id: number;
    email: string;
  }

  interface ForwardCompany {
    id: number;
    name: string;
    logo: string;
    status: number;
    category: Category2;
    owner: Owner2;
  }

  interface Category2 {
    id: number;
    title: string;
    status: number;
    order: number;
  }

  interface Owner2 {
    id: number;
    email: string;
  }

  interface Driver {
    id: number;
    title: string;
    status: number;
    type: number;
    rating: number;
    image: string;
    user: User;
    category: Category3;
  }

  interface User {
    id: number;
    email: string;
  }

  interface Category3 {
    id: number;
    title: string;
    status: number;
    order: number;
  }

  interface Step {
    id: number;
    title: string;
    status: number;
    order: number;
  }

  interface PortLoading {
    id: number;
    title: string;
    status: number;
    country: number;
  }

  interface PortDischarge {
    id: number;
    title: string;
    status: number;
    country: number;
  }

  interface PlaceDelivery {
    id: number;
    title: string;
    status: number;
    country: number;
  }

  interface Creator {
    id: number;
    email: string;
  }
}
