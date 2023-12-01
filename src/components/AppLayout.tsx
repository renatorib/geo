import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

import { RiHome2Line, RiHeart2Fill, RiMenuFill } from "react-icons/ri";
import { TrackViewportUnits } from "react-use-vars";
import { useSnapshot } from "valtio";

import { Logo, RouterTransition } from "~/components";
import { SettingsMenu, LangSelectorMenu } from "~/features/settings";
import { TranscriptDialog } from "~/features/speech-recognition";
import { games } from "~/games";
import { fr } from "~/lib/react";
import { upperFirstLetter } from "~/lib/string";
import { cn, contextColors } from "~/lib/styles";
import { store, storeActions } from "~/stores/store";

import { Button } from "./ui/Button";
import { ButtonIcon } from "./ui/ButtonIcon";
import { Dialog } from "./ui/Dialog";
import { InlineIcon } from "./ui/InlineIcon";

const AppHeader = () => {
  const [navbarOpened, setNavbarOpened] = React.useState(false);

  return (
    <div>
      <header style={{ height: 50 }}>
        <div className="flex h-full items-center justify-between">
          <div className="m-3">
            <ButtonIcon variant="ghost" onClick={() => setNavbarOpened((op) => !op)}>
              <RiMenuFill />
            </ButtonIcon>
          </div>
          <NextLink href="/">
            <Logo size={22} color="#449966" />
          </NextLink>
          <div className="m-3">
            <div className="flex items-center gap-2 ml-auto">
              <LangSelectorMenu />
              <SettingsMenu />
            </div>
          </div>
        </div>
      </header>

      <RouterTransition />

      <Dialog title="Menu" open={navbarOpened} onClose={() => setNavbarOpened(false)} padding="md">
        <div>
          <div className="flex flex-col gap-2">
            <NavbarLink href="/" icon={<RiHome2Line />} color="green">
              Home
            </NavbarLink>

            <div className="mt-3">Games</div>

            {games
              .filter((g) => g.training === false)
              .map((game) => (
                <NavbarLink
                  key={game.id}
                  icon={game.icon}
                  color="yellow"
                  startsWith={`/play/${game.id}/`}
                  onClick={() => {
                    storeActions.open(game);
                    setNavbarOpened(false);
                  }}
                >
                  {game.name}
                </NavbarLink>
              ))}

            <div className="mt-3">Learn</div>

            {games
              .filter((g) => g.training === true)
              .map((game) => (
                <NavbarLink
                  key={game.id}
                  icon={game.icon}
                  color="slate"
                  startsWith={`/play/${game.id}/`}
                  onClick={() => {
                    storeActions.open(game);
                    setNavbarOpened(false);
                  }}
                >
                  {game.name}
                </NavbarLink>
              ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const AppFooter = () => {
  return (
    <div className="py-6">
      <div className="text-sm text-gray-600 text-center flex items-center justify-center gap-1">
        <span>Made with</span>
        <span style={{ verticalAlign: "middle" }}>
          <RiHeart2Fill size={10} color="red" />
        </span>
        <span>by</span>
        <a className="text-violet-700" href="https://rena.to" target="_blank" rel="noreferrer">
          rena.to
        </a>
      </div>
    </div>
  );
};

const NavbarLink = fr<
  { href?: string; startsWith?: string; icon?: React.ReactNode; color?: keyof typeof contextColors },
  "button"
>(({ href, startsWith, icon, color, ...props }, ref) => {
  const router = useRouter();
  const selected = (startsWith && router.asPath.startsWith(startsWith)) || router.asPath === href;

  let button = (
    <button
      {...props}
      ref={ref}
      aria-pressed={Boolean(selected)}
      className={cn(
        contextColors[color ?? "slate"],
        "group flex items-center p-2.5 gap-2 cursor-pointer border-none w-full rounded",
        "bg-slate-50 aria-pressed:bg-context-900 hover:bg-context-900 transition",
        props.className,
      )}
    >
      <InlineIcon className="text-context-600 group-aria-pressed:text-context-200 group-hover:text-context-200 transition">
        {icon}
      </InlineIcon>
      <span className="text-sm text-context-900 group-aria-pressed:text-context-50 group-hover:text-context-50 transition">
        {props.children}
      </span>
    </button>
  );

  if (href) {
    button = (
      <NextLink href={href} className="no-underline">
        {button}
      </NextLink>
    );
  }

  return button;
});

const GroupsModal = () => {
  const snap = useSnapshot(store);

  return (
    <Dialog open={snap.open} onClose={() => storeActions.close()} width="md">
      <Dialog.CloseButton />

      <div className="flex items-center">
        {snap.selectedGame && (
          <div className="text-5xl pr-2 text-slate-600">
            {React.cloneElement(snap.selectedGame.icon as ReactElement)}
          </div>
        )}
        <div>
          <Dialog.Title className="flex items-center gap-2">{snap.selectedGame?.name}</Dialog.Title>
          <div className="text-sm text-gray-700">Choose a group to play</div>
        </div>
      </div>

      <div className="mt-2" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {snap.selectedGame &&
          snap.selectedGame.groups.map((group) => {
            const isWorld = group.id === "world";
            return (
              <div key={group.id}>
                <NextLink href={`/play/${snap.selectedGame?.id}/${group.id}`} onClick={() => storeActions.close()}>
                  <Button
                    color={isWorld ? "yellow" : "slate"}
                    variant={isWorld ? "filled" : "light"}
                    className="justify-center"
                    full
                  >
                    {upperFirstLetter(group.id)}
                  </Button>
                </NextLink>
              </div>
            );
          })}
      </div>
    </Dialog>
  );
};

export const AppLayout = ({
  children,
  contained = true,
  showFooter = true,
  showTranscripter = true,
  showHeader = true,
}: {
  children?: React.ReactNode;
  contained?: boolean;
  showFooter?: boolean;
  showTranscripter?: boolean;
  showHeader?: boolean;
}) => {
  return (
    <>
      <TrackViewportUnits />

      <div className="flex flex-col">
        {showHeader && <AppHeader />}
        {showTranscripter && <TranscriptDialog />}

        <GroupsModal />

        <div
          className={cn("flex flex-col w-full min-100dvh", contained && "mx-auto px-4 max-w-5xl w-full")}
          style={{ "--offset-height": "53px" } as React.CSSProperties}
        >
          <main className="flex grow h-full">{children}</main>
          {showFooter && <AppFooter />}
        </div>
      </div>
    </>
  );
};
