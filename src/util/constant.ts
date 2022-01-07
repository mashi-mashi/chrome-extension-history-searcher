export const MessageTasks = {
  openApp: 'open-app',
  changeTab: 'change-tab',
} as const;

export type MessageTasksType = typeof MessageTasks[keyof typeof MessageTasks];
