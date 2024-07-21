import path from "path";
import { fileURLToPath } from "url";

export function basePlugin(options) {
  const baseOptions = {
    name:'基础插件',
    srcPath: fileURLToPath(new URL('../src', import.meta.url).href),
    pages: ["pages/login/login"],
    files: ['control','static','api/user.api.ts'],
  };
  const _options = {
    ...baseOptions,
    ...options,
  };
  return _options
}
