import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <Component {...pageProps} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
