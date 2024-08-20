import "regenerator-runtime/runtime";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { Inter, Fira_Mono, Playfair_Display } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import React from "react";

import { cn } from "~/lib/styles";

const sans = Inter({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const serif = Playfair_Display({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const mono = Fira_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const fontsVars = cn(sans.variable, mono.variable, serif.variable);
const defaultFont = sans.className;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Geo - rena.to</title>
      </Head>

      <div className={cn(fontsVars, defaultFont, "color-context-slate")}>
        <Component {...pageProps} />
      </div>

      <Script src="https://accounts.google.com/gsi/client" />
    </>
  );
}

export default MyApp;
