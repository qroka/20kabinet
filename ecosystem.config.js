module.exports = {
  apps: [
    {
      name: 'computer-lab-frontend',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'computer-lab-websocket',
      script: 'server.js',
      cwd: './server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    },
    {
      name: 'computer-lab-telegram',
      script: 'bot.js',
      cwd: './telegram-bot',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};
