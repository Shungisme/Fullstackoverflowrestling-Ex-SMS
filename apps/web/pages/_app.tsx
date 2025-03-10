import { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "../src/components/Layout";
import { Toaster } from "../src/components/Toast";
import { ToastProvider } from "../src/context/toast-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </ToastProvider>
  );
}

export default MyApp;
