const runtimeEnv =
  (globalThis as Record<string, any> | undefined)?.["__env"] ||
  (globalThis as { __env?: Record<string, any> })?.__env;
const runtimeApiBase =
  (runtimeEnv && runtimeEnv.API_BASE_URL) || "http://127.0.0.1:8000";

export const appEnvironment = {
  apiBaseUrl: runtimeApiBase
};
