module.exports = function dotenvJSON(envConfig) {
    
    try {
     
      for (const key in envConfig) {
        process.env[key] = envConfig[key];
      }
    } catch (err) {
      console.error(err);
    }
  };
  