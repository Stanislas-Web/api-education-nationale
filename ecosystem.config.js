module.exports = {
  apps : [{
    name: "app",
    script: "./index.js",
    instances: 1,
    max_memory_restart: "250M",
    exec_mode : "fork",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
