/// <reference types="vite/client" />

// Declare the build-time constant injected by vite.config.ts
declare const __API_BASE_URL__: string

// Allow CSS module imports
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
