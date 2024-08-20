import Link from "next/link";
import React from "react";

import { RiArrowLeftSLine, RiArrowRightSLine, RiEarthLine, RiFlagLine } from "react-icons/ri";
import { TrackViewportUnits, useRootVars } from "react-use-vars";

import { SettingsMenu } from "~/features/settings";
import { useViewportSize } from "~/hooks";
import { useMediaQuery } from "~/hooks/use-media-query";
import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

import { GroupsModal } from "./GroupsModal";
import { ButtonIcon } from "./ui/ButtonIcon";

const Logo = () => {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group hover:-rotate-12 transition-all"
    >
      <circle cx="17.5" cy="17.5" r="17.5" className="group-hover:fill-[#115FF5] fill-transparent transition-colors" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.46 4.72633L29.4583 4.72473V4.73929L24.5766 3.951C25.0648 4.47653 25.4391 5.13344 25.6994 5.92172C25.9923 6.67717 26.1388 7.61327 26.1388 8.72998C26.1388 10.4051 25.7157 11.8503 24.8695 13.0656C24.0559 14.248 22.9494 15.1677 21.5499 15.8246C20.183 16.4487 18.6535 16.7607 16.9611 16.7607H16.1312C15.4804 16.7607 14.862 16.7115 14.2762 16.6129C13.9182 17.0071 13.6578 17.4176 13.4951 17.8446C13.3324 18.2387 13.2511 18.6164 13.2511 18.9778C13.2511 20.1273 13.9833 20.7021 15.4478 20.7021H21.4035C23.6491 20.7021 25.4553 21.2934 26.8222 22.4757C28.2216 23.6254 28.9213 25.2676 28.9213 27.4025C28.9213 29.0861 28.5043 30.5329 27.6702 31.743C24.8039 33.7934 21.2929 35 17.5 35C7.83503 35 0 27.165 0 17.5C0 7.83503 7.83503 0 17.5 0C22.1251 0 26.3311 1.79424 29.46 4.72466V4.72633ZM19.5972 11.0949C18.8487 11.7847 17.97 12.1295 16.9611 12.1295H16.1312C15.0898 12.1295 14.1785 11.7847 13.3975 11.0949C12.6489 10.4052 12.2747 9.40332 12.2747 8.08956C12.2747 6.77572 12.6489 5.77394 13.3975 5.08419C14.1785 4.39444 15.0898 4.04956 16.1312 4.04956H16.9611C17.97 4.04956 18.8487 4.39444 19.5972 5.08419C20.3783 5.77394 20.7688 6.77572 20.7688 8.08956C20.7688 9.40332 20.3783 10.4052 19.5972 11.0949Z"
        className="group-hover:fill-[#9EF511] fill-stone-200 transition-colors"
      />
    </svg>
  );
};

export const AppLayout2 = (props: { children: React.ReactNode }) => {
  const { width, height } = useViewportSize();
  const [sidebarHide, setSidebarHide] = React.useState(false);
  const smallScreen = useMediaQuery("(max-width: 920px)");
  const sidebarWidth = smallScreen ? 180 : 280;

  useRootVars(
    {
      "--sidebar-width": `${sidebarWidth}px`,
      "--main-width": `${sidebarHide ? width : width - sidebarWidth}px`,
      "--main-height": `${height}px`,
    },
    [sidebarWidth, width, height, sidebarHide],
  );

  return (
    <>
      <TrackViewportUnits />
      <GroupsModal />

      <div className="flex bg-stone-900 text-white min-100dvh dark">
        <aside
          className={cn(
            "bg-stone-950/20 w-[var(--sidebar-width)] shrink-0 border-r border-solid border-stone-800 transition-all",
            sidebarHide && "absolute z-10 -translate-x-[var(--sidebar-width)] h-full",
          )}
        >
          <div className="p-4 flex justify-between items-start">
            <Link href="/" className="inline-flex">
              <Logo />
            </Link>

            <div className="flex gap-2">
              <SettingsMenu />
              <ButtonIcon
                variant="ghost"
                color="stone"
                onClick={() => setSidebarHide((h) => !h)}
                className={cn(sidebarHide && "translate-x-14 z-30")}
              >
                {sidebarHide ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
              </ButtonIcon>
            </div>
          </div>
          <nav className="flex flex-col">
            <SidebarButton selected={true}>
              <RiFlagLine /> Flags
            </SidebarButton>
            <SidebarButton>
              <RiEarthLine className="group-hover:text-lime-400" /> Map
            </SidebarButton>
          </nav>
        </aside>

        <main className="flex w-auto grow relative">{props.children}</main>
      </div>
    </>
  );
};

const SidebarButton = fr<{ selected?: boolean }, "button">(({ selected, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "group inline-flex items-center gap-2",
        "px-4 py-3 -mt-px text-left bg-stone-950/20 border-y border-x-0 border-solid border-stone-800 text-stone-100",
        selected && "bg-stone-950",
        !selected && "bg-stone-950/20 hover:bg-stone-950/80",
      )}
    />
  );
});
