const CronJob = require('cron').CronJob;
import { scheduler } from './../controller/serviceCtrl';

module.exports = {
  /**
   * Method to run daily cron job “At 00:00 AM”
   */
  dailyCron:  () => {
    new CronJob('0 8 * * *',  () => {
      console.log('Cron running');
      scheduler();
      }, function () {
    }, true);
  }
};
