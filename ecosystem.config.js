module.exports = {
  apps: [{
    name: 'mitchelljones.com',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '54.183.150.19',
      key: 'C:/keys/key1.pem',
      ref: 'origin/master',
      repo: 'https://github.com/MitchTJones/mitchelljones.com',
      path: '/home/ubuntu/mitchelljones.com',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}