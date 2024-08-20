import mitt from "mitt";

import { Entity } from "~/games";

type Node<T extends Entity> = {
  entity: T;
  id: T["id"];
  checked: boolean;
};

/**
 * This class is responsible for carrying all the guessing logic.
 * The idea is to be adaptable to various types of game modes, either one by one, or all at once.
 */
export class Guesser<T extends Entity> {
  emitter = mitt();

  /**
   * All nodes of the instance.
   * Nodes are a wrapper to entity to track checked & maybe other future states.
   */
  nodes: Node<T>[];

  /**
   * Node that is selected.
   * Used to know which entity to display/highlight and which target the guess will test.
   * Not used in guessAll modes.
   */
  selectedNode: Node<T>;

  constructor(props: { data: T[] }) {
    this.nodes = entitiesToNodes(props.data);
    this.selectedNode = this.nodes[0];
  }

  selectNode(node: Node<T>) {
    const previous = this.selectedNode;
    this.selectedNode = node;
    this.emitter.emit("select-node", { previous, current: node });
  }

  guess() {}
}

function entitiesToNodes<T extends Entity>(entities: T[]): Node<T>[] {
  return entities.map(entityToNode);
}

function entityToNode<T extends Entity>(entity: T): Node<T> {
  return { entity, id: entity.id, checked: false };
}
