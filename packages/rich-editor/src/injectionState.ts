import { createInjectionState } from "@vueuse/core";

import { RichEditorProps } from "./types";

const [useProvideBridgeStore, useBridgeStore] = createInjectionState(
  (opts: Pick<RichEditorProps, "imageUpload">) => {
    return opts;
  },
);

export { useProvideBridgeStore };

export { useBridgeStore };
