import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CookieProvider } from "@/context/CookieContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookieProvider>
      <Component {...pageProps} />
    </CookieProvider>
  );
}
