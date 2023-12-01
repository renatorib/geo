import "regenerator-runtime/runtime";
import "../src/styles/globals.css";

import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Geo - rena.to</title>
      </Head>

      <div className={`${inter.className} ${inter.variable} color-context-slate`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
