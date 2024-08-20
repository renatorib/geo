import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";

import { NoSSR } from "~/components";
import { AppLayout2 } from "~/components/AppLayout2";
import { CardsGrid, Cards1x1, WorldMap1x1 } from "~/components/game-types";
import { Button, ButtonProps } from "~/components/ui/Button";
import { Switch } from "~/components/ui/Switch";
import { games, findGameByUrl } from "~/games";
import { cn } from "~/lib/styles";

const types = ["Map", "Cards"];

const MapForm = () => {
  const [group, setGroup] = React.useState("world");
  const [oneByOne, setOneByOne] = React.useState(true);
  const [hideBorders, setHideBorders] = React.useState(false);
  const [hideUnchecked, setHideUnchecked] = React.useState(false);

  const [play, setPlay] = React.useState(false);

  const bindGroup = (itemGroup: string) => {
    const selected = group === itemGroup;

    return {
      onClick: () => setGroup(itemGroup),
      color: "stone",
      variant: selected ? "filled" : "light",
    } satisfies React.ComponentProps<typeof Button>;
  };

  if (play) {
    const game = findGameByUrl("map-1x1/" + group);
    if (game) {
      return <WorldMap1x1 game={game} oneByOne={oneByOne} hideBorders={hideBorders} hideUnchecked={hideUnchecked} />;
    }
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button {...bindGroup("world")}>World</Button>
        <Button {...bindGroup("africa")}>Africa</Button>
        <Button {...bindGroup("america")}>America</Button>
        <Button {...bindGroup("asia")}>Asia</Button>
        <Button {...bindGroup("europe")}>Europe</Button>
        <Button {...bindGroup("oceania")}>Oceania</Button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <Switch color="lime" checked={oneByOne} onChange={(ev) => setOneByOne(ev.currentTarget.checked)} /> Guess one
          by one
        </label>

        <label className="flex items-center gap-2">
          <Switch color="lime" checked={hideBorders} onChange={(ev) => setHideBorders(ev.currentTarget.checked)} /> Hide
          borders
        </label>

        <label className="flex items-center gap-2">
          <Switch color="lime" checked={hideUnchecked} onChange={(ev) => setHideUnchecked(ev.currentTarget.checked)} />{" "}
          Hide unchecked countries
        </label>
      </div>

      <div>
        <Button onClick={() => setPlay(true)}>Play</Button>
      </div>
    </div>
  );
};

const PlayForm = () => {
  const [type, setType] = React.useState("");
  const [groupId, setGroupId] = React.useState("");

  return <MapForm />;

  return null;
};

const Play = () => {
  return (
    <AppLayout2>
      <PlayForm />
    </AppLayout2>
  );
};

export default Play;
