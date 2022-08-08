import "regenerator-runtime/runtime";
import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>guess.li</title>
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
