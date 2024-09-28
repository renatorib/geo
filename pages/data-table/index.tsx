import NextImage from "next/image";
import React from "react";

import { NoSSR, AppLayout } from "~/components";
import { AspectRatio } from "~/components/ui/AspectRatio";
import { countries } from "~/data-sources/countries";
import { LangSelectorMenu, useSettings } from "~/features/settings";
import { cn } from "~/lib/styles";
import { getViewboxOfPath } from "~/lib/svg";

const Th = ({ width, children }: { width?: number; children: React.ReactNode }) => {
  return (
    <th style={{ width }} className="border-b border-slate-200 text-sm px-2 py-2">
      <div className="flex items-center gap-1">{children}</div>
    </th>
  );
};

const Td = ({ width, children }: { width?: number; children: React.ReactNode }) => {
  return (
    <td style={{ width }} className="border-b border-slate-200 text-sm px-2 py-0.5">
      {children}
    </td>
  );
};

const Tr = ({
  children,
  striped,
  ...props
}: { children: React.ReactNode; striped?: boolean } & React.ComponentProps<"tr">) => {
  return (
    <tr {...props} className={cn("hover:bg-gray-100", striped && "odd:bg-gray-50")}>
      {children}
    </tr>
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
  name;
  // const [opened, setOpened] = React.useState(false);
  // <iframe src={`/api/wiki?name=${name}`} style={{ border: "none", width: 350, height: 400 }} />

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
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
                <table>
                  <thead>
                    <Tr>
                      <Th width={30}>N</Th>
                      <Th width={80}>Flag</Th>
                      <Th width={80}>Shape</Th>
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
                      <Th width={100}>ISO Alpha2</Th>
                      <Th width={100}>ISO Alpha3</Th>
                      <Th>Links</Th>
                    </Tr>
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

                      const shapeViewbox = getViewboxOfPath(c.shape, {
                        aspectRatio: 45 / 30,
                        margin: 0.1,
                      });

                      return (
                        <Tr key={c.id} id={`row-of-${c.id}`} striped={true}>
                          <Td>{index + 1}</Td>
                          <Td>
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
                                <div className="text-red-400 text-xl">?</div>
                              )}
                            </AspectRatio>
                          </Td>
                          <Td>
                            {c.shape && (
                              <svg viewBox={shapeViewbox.viewbox}>
                                <path d={c.shape} fill="#999" />
                              </svg>
                            )}
                          </Td>
                          <Td>{c.emoji}</Td>
                          <Td>{c.id}</Td>
                          <Td>
                            <a
                              href={`/data-table/${c.id.toLowerCase()}`}
                              lang="en"
                              className="text-sky-600 hover:underline"
                            >
                              <strong>{c.name[lang.property]}</strong>
                            </a>
                            {aliasText(c.alias[lang.property])}
                          </Td>
                          <Td>
                            <strong>{c.capital[lang.property]}</strong>
                            {aliasText(c.capitalAlias[lang.property])}
                          </Td>
                          <Td>{c.domain}</Td>
                          <Td>{c.region}</Td>
                          <Td>
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
                          </Td>
                          <Td>{c.alpha2}</Td>
                          <Td>{c.alpha3}</Td>

                          <Td>
                            <WikiLink href={`https://en.wikipedia.org/wiki/${c.name.en}`} name={c.name.en} lang="en">
                              Wiki
                            </WikiLink>
                          </Td>
                        </Tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </NoSSR>
      </div>
    </AppLayout>
  );
};

export default DataTablePage;
