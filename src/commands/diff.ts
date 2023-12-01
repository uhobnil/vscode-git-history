import { commands } from "vscode";

import { container } from "../container/inversify.config";
import { ChangeTreeDataProvider } from "../views/changes/ChangeTreeDataProvider";
import { getDiffUriPair } from "../git/utils";

import { FileNode } from "../git/changes/tree";

export const DIFF_DIFF = "git-history.history.diff";
export const DIFF_DIFF_PREV = "git-history.history.diff.prev";
export const DIFF_DIFF_NEXT = "git-history.history.diff.next";

export function getDiffCommandsDisposable() {
	const changeTreeDataProvider = container.get(ChangeTreeDataProvider);

	return [
		commands.registerCommand(DIFF_DIFF, async (...args) => {
			changeTreeDataProvider.setCurrentFilePath(args[0].path);
			commands.executeCommand("vscode.diff", ...args);
		}),
		commands.registerCommand(DIFF_DIFF_PREV, async () => {
			const currentFileIdex =
				changeTreeDataProvider.fileNodeList.findIndex(
					(item: FileNode) => {
						return (
							item.uri.path ===
							changeTreeDataProvider.currentFilePath
						);
					}
				);
			if (currentFileIdex === -1) {
				return;
			}
			const prevFile: FileNode =
				changeTreeDataProvider.fileNodeList[currentFileIdex - 1];
			if (prevFile) {
				const args = getDiffUriPair(prevFile);
				changeTreeDataProvider.setCurrentFilePath(prevFile.uri.path);
				commands.executeCommand("vscode.diff", ...args);
			}
		}),
		commands.registerCommand(DIFF_DIFF_NEXT, async () => {
			const currentFileIdex =
				changeTreeDataProvider.fileNodeList.findIndex(
					(item: FileNode) => {
						return (
							item.uri.path ===
							changeTreeDataProvider.currentFilePath
						);
					}
				);
			if (currentFileIdex === -1) {
				return;
			}
			const nextFile: FileNode =
				changeTreeDataProvider.fileNodeList[currentFileIdex + 1];
			if (nextFile) {
				const args = getDiffUriPair(nextFile);
				changeTreeDataProvider.setCurrentFilePath(nextFile.uri.path);
				commands.executeCommand("vscode.diff", ...args);
			}
		}),
	];
}
