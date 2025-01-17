import { dirname, resolve } from "pathe";
import { fileURLToPath } from "url";
import { defineNuxtModule, addTemplate, addPluginTemplate } from '@nuxt/kit'

import type {
  InMemoryCache,
  ApolloClientOptions,
} from '@apollo/client/core'
// @ts-expect-error #app resolved by Nuxt3
import { NuxtApp } from '#app'

export interface ApolloModuleOptions {
  default: Partial<ApolloClientOptions<any>>,
  [name: string]: Partial<ApolloClientOptions<any>>
}
export default defineNuxtModule<ApolloModuleOptions>({
  
  meta: {
    name: '@nuxt3/apollo-module',
    configKey: 'apollo',
  },
  setup(options, nuxt) {
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push('@apollo/client', 'ts-invariant/process')

    const __dirname__ = dirname(fileURLToPath(import.meta.url));

    // save options to apollo.options.mjs
    addTemplate({
      filename: 'apollo.options.mjs',
      getContents: () => `export default ${JSON.stringify(options)}`,
    })

    // add apollo plugin ( see plugin.ts ) to server and client 
    addPluginTemplate({
      src: resolve(__dirname__, "./plugin.mjs"),
      mode: 'all'
    });

  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    apollo?: ApolloModuleOptions
  }
  interface NuxtOptions {
    apollo?: ApolloModuleOptions
  }
}