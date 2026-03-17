export interface XLocale {
  locale: string;
  Conversations?: {
    create: string;
  };
  Actions?: {
    feedbackLike: string;
    feedbackDislike: string;
    audio: string;
    audioRunning: string;
    audioError: string;
    audioLoading: string;
  };
  Sender?: {
    stopLoading: string;
    speechRecording: string;
  };
  Bubble?: {
    editableOk: string;
    editableCancel: string;
  };
  Mermaid?: {
    zoomIn: string;
    zoomOut: string;
    zoomReset: string;
    download: string;
    code: string;
    image: string;
  };
  Folder?: {
    selectFile: string;
    loadError: string;
    noService: string;
    loadFailed: string;
  };
}

export type Locale = XLocale & Record<string, any>;

export type LocaleComponentName = Exclude<keyof XLocale, "locale">;
