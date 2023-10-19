import NextImage from "next/image";
import React from "react";

import { AspectRatio, Box, Table, HoverCard } from "@mantine/core";

import { NoSSR, AppLayout } from "~/components";
import { countries } from "~/data-sources/countries";
import { LangSelectorMenu, useSettings } from "~/features/settings";

const Th = ({ width, children }: { width?: number; children: React.ReactNode }) => {
  return (
    <th style={{ width }}>
      <Box style={{ display: "flex", gap: 5, alignItems: "center" }}>{children}</Box>
    </th>
  );
};

const WikiLink = ({
  href,
  children,
  name,
  lang,
}: {
  href: string;
  children: React.ReactNode;
  name: string;
  lang: string;
}) => {
  lang;
  const [opened, setOpened] = React.useState(false);

  return (
    <HoverCard
      withinPortal
      withArrow
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      openDelay={1000}
      closeDelay={500}
    >
      <HoverCard.Target>
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        {opened ? <iframe src={`/api/wiki?name=${name}`} style={{ border: "none", width: 350, height: 400 }} /> : null}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

const DataTablePage = () => {
  const { lang } = useSettings();

  return (
    <AppLayout contained={false}>
      <Box p="md">
        <NoSSR fallback={<span>Loading...</span>}>
          {() => (
            <>
              <Box style={{ maxWidth: "100%", overflowX: "auto", margin: "0 auto" }}>
                <Table striped={true}>
                  <thead>
                    <tr>
                      <Th width={30}>N</Th>
                      <Th width={80}>Flag</Th>
                      <Th width={60}>Emoji</Th>
                      <Th width={50}>ID</Th>
                      <Th width={300}>
                        Name <LangSelectorMenu />
                      </Th>
                      <Th width={200}>
                        Capital <LangSelectorMenu />
                      </Th>
                      <Th width={80}>Domain</Th>
                      <Th width={100}>Region</Th>
                      <Th width={100}>Independent</Th>
                      <Th width={40}>Shape</Th>
                      <Th width={100}>ISO Alpha2</Th>
                      <Th width={100}>ISO Alpha3</Th>
                      <Th>Links</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((c, index) => {
                      const aliasText = (a: string[]) =>
                        a.length ? (
                          <>
                            <br />
                            <em style={{ fontSize: 10 }}>Aliases: {a.join(", ")}</em>
                          </>
                        ) : null;

                      return (
                        <tr key={c.id} id={`row-of-${c.id}`}>
                          <td>{index + 1}</td>
                          <td>
                            <AspectRatio ratio={45 / 30}>
                              {c.flag ? (
                                <NextImage
                                  src={c.flag}
                                  alt=""
                                  fill
                                  sizes="100vw"
                                  style={{
                                    objectFit: "contain",
                                  }}
                                />
                              ) : (
                                <Box style={{ border: "1px solid red", color: "red", fontSize: 30 }}>?</Box>
                              )}
                            </AspectRatio>
                          </td>
                          <td>{c.emoji}</td>
                          <td>{c.id}</td>
                          <td>
                            <strong>{c.name[lang.property]}</strong>
                            {aliasText(c.alias[lang.property])}
                          </td>
                          <td>
                            <strong>{c.capital[lang.property]}</strong>
                            {aliasText(c.capitalAlias[lang.property])}
                          </td>
                          <td>{c.domain}</td>
                          <td>{c.region}</td>
                          <td>
                            {c.independent ? "Yes" : "No"}
                            {c.disputed ? " (Disputed)" : null}
                            {c.sovereignty ? (
                              <>
                                <br />
                                <em style={{ fontSize: 10 }}>
                                  Sovereignty: <a href={`#row-of-${c.sovereignty}`}>{c.sovereignty}</a>
                                </em>
                              </>
                            ) : null}
                          </td>
                          <td>{c.shape ? "Yes" : <Box style={{ background: "red", color: "white" }}>No</Box>}</td>
                          <td>{c.alpha2}</td>
                          <td>{c.alpha3}</td>
                          <td>
                            <WikiLink href={`https://en.wikipedia.org/wiki/${c.name.en}`} name={c.name.en} lang="en">
                              Wiki
                            </WikiLink>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Box>
            </>
          )}
        </NoSSR>
      </Box>
    </AppLayout>
  );
};

export default DataTablePage;
