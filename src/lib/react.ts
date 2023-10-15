import React from "react";

type Ref<T extends React.ElementType> = React.ComponentRef<T>;
type Props<T extends React.ElementType, P = {}> = Omit<React.ComponentProps<T>, keyof P> & P;
type Render<T extends React.ElementType, P = {}> = React.ForwardRefRenderFunction<Ref<T>, Props<T, P>>;

export function fr<T extends React.ElementType, P = {}>(render: Render<T, P>) {
  return React.forwardRef<Ref<T>, Props<T, P>>(render);
}

export function createStore<T>(s: T) {
  type Listener = (value: T) => any;
  let state = s;
  const listeners = new Set<Listener>();
  const fns = {
    getState() {
      return state;
    },
    setState(value: T) {
      state = value;
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return Object.assign(fns, {
    useState() {
      return React.useSyncExternalStore(fns.subscribe, fns.getState, fns.getState);
    },
  });
}
