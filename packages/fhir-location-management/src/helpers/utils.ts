import { ChildNodeList, LocationHierarchyResource, ParsedHierarchyNode, TreeNode } from './types';
import { cloneDeep } from 'lodash';
import cycle from 'cycle';
import TreeModel from 'tree-model';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';

/** Parse the raw child hierarchy node map
 *
 * @param rawNodeMap - Object of raw hierarchy nodes
 * @returns Array of Parsed hierarchy nodes
 */
const parseFhirChildren = (rawNodeMap: ChildNodeList[]) => {
  return rawNodeMap.map((child) => {
    // standardize the parsedHierarchy node structure to be similar for both
    // root node and all other descendant nodes.
    const { treeNode } = child;
    const parsedNode: ParsedHierarchyNode = {
      ...treeNode,
      children: parseFhirChildren(treeNode.children ?? []) as ParsedHierarchyNode[],
    };
    return parsedNode;
  });
};

export const parseFHIRHierarchy = (fhirTree: LocationHierarchyResource) => {
  const rawClone: LocationHierarchyResource = cloneDeep(fhirTree);

  const { listOfNodes } = rawClone.LocationHierarchyTree.locationsHierarchy;
  const rawNode = listOfNodes.treeNode[0];

  const parsedNode = {
    ...rawNode,
    children: parseFhirChildren(rawNode.children ?? []),
  };
  return parsedNode;
};

export const generateFhirLocationTree = (rootNode: LocationHierarchyResource) => {
  const tree = new TreeModel();
  const hierarchy = parseFHIRHierarchy(rootNode);
  const root = tree.parse<ParsedHierarchyNode>(hierarchy);
  return root;
};

export const convertApiResToTree = (apiRes: IBundle) => {
  const rootNode = (apiRes.entry?.[0].resource as Resource) as
    | LocationHierarchyResource
    | undefined;
  if (!rootNode) {
    return;
  }
  return generateFhirLocationTree(rootNode);
};

/**
 * serialize tree due to circular dependencies
 *
 * @param trees - trees to be serialized
 */
export const serializeTree = (trees: TreeNode[]) => {
  return JSON.stringify(trees.map((tree) => JSON.stringify(cycle.decycle(tree))));
};
