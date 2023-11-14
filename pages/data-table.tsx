import NextImage from "next/image";
import React from "react";

import { AspectRatio, Box, Table, HoverCard } from "@mantine/core";

import { NoSSR, AppLayout } from "~/components";
import { countries } from "~/data-sources/countries";
import { LangSelectorMenu, useSettings } from "~/features/settings";

const Th = ({ width, children }: { width?: number; children: React.ReactNode }) => {
  return (
    <Table.Th style={{ width }}>
      <div className="flex items-center gap-1">{children}</div>
    </Table.Th>
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
      openDelay={0}
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
      <div className="p-3 mx-auto">
        <NoSSR fallback={<span>Loading...</span>}>
          {() => (
            <>
              <div className="max-w-full overflow-x-auto mx-auto">
                <Table striped={true}>
                  <Table.Thead>
                    <Table.Tr>
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
                      <Th width={60}>Shape</Th>
                      <Th width={100}>ISO Alpha2</Th>
                      <Th width={100}>ISO Alpha3</Th>
                      <Th>Links</Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {countries.map((c, index) => {
                      const aliasText = (a: string[]) =>
                        a.length ? (
                          <>
                            <br />
                            <em style={{ fontSize: 10 }}>Aliases: {a.join(", ")}</em>
                          </>
                        ) : null;

                      return (
                        <Table.Tr key={c.id} id={`row-of-${c.id}`}>
                          <Table.Td>{index + 1}</Table.Td>
                          <Table.Td>
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
                          </Table.Td>
                          <Table.Td>{c.emoji}</Table.Td>
                          <Table.Td>{c.id}</Table.Td>
                          <Table.Td>
                            <strong>{c.name[lang.property]}</strong>
                            {aliasText(c.alias[lang.property])}
                          </Table.Td>
                          <Table.Td>
                            <strong>{c.capital[lang.property]}</strong>
                            {aliasText(c.capitalAlias[lang.property])}
                          </Table.Td>
                          <Table.Td>{c.domain}</Table.Td>
                          <Table.Td>{c.region}</Table.Td>
                          <Table.Td>
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
                          </Table.Td>
                          <Table.Td>{c.shape ? "Yes" : <div className="bg-red-500 text-white">No</div>}</Table.Td>
                          <Table.Td>{c.alpha2}</Table.Td>
                          <Table.Td>{c.alpha3}</Table.Td>
                          <Table.Td>
                            <WikiLink href={`https://en.wikipedia.org/wiki/${c.name.en}`} name={c.name.en} lang="en">
                              Wiki
                            </WikiLink>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            </>
          )}
        </NoSSR>
      </div>
    </AppLayout>
  );
};

export default DataTablePage;
