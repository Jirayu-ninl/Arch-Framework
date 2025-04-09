module.exports = {
  apps: [
    {
      name: 'arch-app',
      script: 'server.js',
      exec_mode: 'cluster', // Enables multi-threading
      // instances: '2',
      // max_memory_restart: '850M',
      interpreter: 'bun', // Bun interpreter
      env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
      },
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      output: '/dev/stdout',
      error: '/dev/stderr',
    },
  ],
}
