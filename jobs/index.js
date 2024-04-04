const cron = require('node-cron');

let SaveDailyOrders = cron.schedule('0 8 * * *', () => { 
  try {
    //Do something here
  } catch (error) {
    throw error;        
  }
});   

SaveDailyOrders.start();
