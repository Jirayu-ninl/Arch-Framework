import { createEnv } from '@t3-oss/env-nextjs'
import { serverSchema } from './server.schema'
import { clientSchema } from './client.schema'
import { runtimeEnv } from './runtime.env'

// TODO: (Optional 1) - update app env

export const env = createEnv({
  server: serverSchema,
  client: clientSchema,
  runtimeEnv: runtimeEnv,
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
