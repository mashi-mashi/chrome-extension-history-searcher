export const ManifestCommands = {
  runApp: 'run-searcher',
  listTabs: 'list-tabs',
};

export type ManifestCommandsType = typeof ManifestCommands[keyof typeof ManifestCommands];

export const MessageTasks = {
  openApp: 'open-app',
  changeTab: 'change-tab',
  listTabs: 'list-tabs',
} as const;

export type MessageTasksType = typeof MessageTasks[keyof typeof MessageTasks];
