import "regenerator-runtime/runtime";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "../src/styles/globals.css";

import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";

import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

const theme = createTheme({
  fontFamily: `${inter.style.fontFamily}, sans-serif`,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Geo - rena.to</title>
      </Head>

      <MantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider>
          <Notifications position="bottom-center" />
          <div className={`${inter.className} ${inter.variable} color-context-slate`}>
            <Component {...pageProps} />
          </div>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
