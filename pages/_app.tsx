import "regenerator-runtime/runtime";
import "../src/styles/globals.css";
import "@mantine/core/styles.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GeoMemo - rena.to</title>
      </Head>

      <MantineProvider>
        <ModalsProvider>
          <Notifications />
          <div className={`${inter.className} ${inter.variable}`}>
            <Component {...pageProps} />
          </div>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
