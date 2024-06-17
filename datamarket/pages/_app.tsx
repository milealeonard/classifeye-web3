import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <Component {...pageProps} />
    </div>
  );
}
