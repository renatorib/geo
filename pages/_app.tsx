import "regenerator-runtime/runtime";
import "../src/styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>guess.li</title>
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <NotificationsProvider>
            <div className={`${inter.className} ${inter.variable}`}>
              <Component {...pageProps} />
            </div>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
