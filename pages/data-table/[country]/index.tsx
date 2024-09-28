import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";

import { NoSSR, AppLayout } from "~/components";
import { countries, Country } from "~/data-sources/countries";
import { getViewboxOfPath } from "~/lib/svg";

export const getStaticPaths: GetStaticPaths = () => {
  const codes = countries.map((c) => c.id.toLowerCase());

  return {
    paths: codes.map((code) => ({ params: { country: code } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ country: Country }, { country: string }> = ({ params }) => {
  const code = params?.country;
  const country = countries.find((c) => c.id.toLowerCase() === code);

  if (!country) {
    return {
      notFound: true,
    };
  }

  return {
    revalidate: 60,
    props: { country },
  };
};

const DataTableCountryPage = (props: { country: Country }) => {
  return (
    <AppLayout contained={false}>
      <NoSSR fallback={<span>Loading...</span>}>
        {() => {
          const shapeViewbox = getViewboxOfPath(props.country.shape, { aspectRatio: 45 / 30, margin: 0.1 });
          const size = Math.max(shapeViewbox.viewboxHeight, shapeViewbox.viewboxWidth);
          return (
            <div className="w-full flex flex-col items-center p-7">
              <h1 className="text-2xl">{props.country.name.en}</h1>
              <div className="w-full">
                <svg viewBox={shapeViewbox.viewbox}>
                  <path d={props.country.shape} fill="#666" strokeWidth={size * 0.002} stroke="black" />
                </svg>
              </div>
            </div>
          );
        }}
      </NoSSR>
    </AppLayout>
  );
};

export default DataTableCountryPage;
