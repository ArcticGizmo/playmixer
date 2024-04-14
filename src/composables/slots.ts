import { Component, computed, useSlots, Fragment, Comment, VNode } from 'vue';

type ComponentFilter = string | Component;

const flattenNodes = (nodes: VNode[]): VNode[] => {
  return nodes.map(flattenNode).flat();
};

const flattenNode = (node: VNode) => {
  // Remove comment nodes
  if (node.type === Comment) {
    return [];
  }
  if (node.type === Fragment) {
    const children = (node.children || []) as VNode[];
    return flattenNodes(children);
  }

  return [node];
};

export const useFilteredSlots = (key: 'default' | string, types?: ComponentFilter[]) => {
  const slots = useSlots();

  return computed(() => {
    const childNodes = slots[key]?.() || [];
    const flatNodes = flattenNodes(childNodes);

    if (!types || !types.length) {
      return flatNodes;
    }

    return flatNodes.filter(n => types.includes(n.type as any));
  });
};
