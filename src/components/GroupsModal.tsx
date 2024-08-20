import Link from "next/link";
import React from "react";

import { useSnapshot } from "valtio/react";

import { upperFirstLetter } from "~/lib/string";
import { store, storeActions } from "~/stores/store";

import { Button } from "./ui/Button";
import { Dialog } from "./ui/Dialog";

export const GroupsModal = () => {
  const snap = useSnapshot(store);

  return (
    <Dialog open={snap.open} onClose={() => storeActions.close()} width="md">
      <Dialog.CloseButton />

      <div className="flex items-center">
        {snap.selectedGame && (
          <div className="text-5xl pr-2 text-slate-600">
            {React.cloneElement(snap.selectedGame.icon as React.ReactElement)}
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
                <Link href={`/play/${snap.selectedGame?.id}/${group.id}`} onClick={() => storeActions.close()}>
                  <Button
                    color={isWorld ? "yellow" : "slate"}
                    variant={isWorld ? "filled" : "light"}
                    className="justify-center"
                    full
                  >
                    {upperFirstLetter(group.id)}
                  </Button>
                </Link>
              </div>
            );
          })}
      </div>
    </Dialog>
  );
};
