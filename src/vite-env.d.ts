/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OR_A: string;
  readonly VITE_OR_B: string;
  readonly VITE_OR_C: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
