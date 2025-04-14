/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_BASE_URL: string;
   // add more VITE_ variables if needed
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}
