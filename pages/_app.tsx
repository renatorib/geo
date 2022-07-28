import "regenerator-runtime/runtime";
import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { RouterTransition } from "~/components/RouterTransition";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Guess the Flag</title>
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <RouterTransition />
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
