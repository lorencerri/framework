const db = require('quick.db');
module.exports = {
  generateKey: async function(type) {
    const init = new Promise(async resolve => {
      let valid = false,
          runs = 0,
          current = await db.fetch(type);
      if (!current) current = {};
      while (!valid && runs < 100) {
        runs++;
        let random = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
        if (!current[random]) resolve(random);
      }
    })
    return init;
  }
}