module.exports = {
  apps: [
    {
      name: 'AK-photography-websites-backend',
      script: '/home2/chgqkclj/public_html/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
