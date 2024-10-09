import Layout from "@/components/Layout/Layout";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "@/pages/router";

export default function Providers() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error: unknown) => {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError.message ||
          "Что-то пошло не так";
        toast.error(message);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
        <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
