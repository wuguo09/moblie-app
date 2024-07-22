import { defineConfig } from "./build/defineConfig.js"
import {basePlugin} from './build/basePlugin.js'
import { fileURLToPath } from "url"

export default () => {
    return defineConfig({
        plugins:[basePlugin()],
        srcPath: fileURLToPath(new URL('./src', import.meta.url).href)
    })
}