export {};

declare global {
  interface ApiRes<T = any> {
    total_results: number;
    per_page: number;
    page_now: number;
    next_link: string;
    status: boolean;
    message: string;
    data: T;
  }
}
