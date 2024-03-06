import { Tree, getWorkspaceLayout } from '@nx/devkit';

export function getPrimitivePath(tree: Tree, primitive: string): string {
  const { libsDir } = getWorkspaceLayout(tree);
  return `${libsDir}/${primitive}`;
}

export function getPrimitiveIndex(tree: Tree, primitive: string): string {
  return `${getPrimitivePath(tree, primitive)}/src/index.ts`;
}

export function addExportToIndex(tree: Tree, primitive: string, exportStatement: string) {
  const indexPath = getPrimitiveIndex(tree, primitive);
  const indexContent = tree.read(indexPath).toString('utf-8');
  const newContent = `${indexContent}\n${exportStatement}`;
  tree.write(indexPath, newContent);
}