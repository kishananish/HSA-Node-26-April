'use strict';

var _serviceCtrl = require('./../controller/serviceCtrl');

var CronJob = require('cron').CronJob;


module.exports = {
  /**
   * Method to run daily cron job “At 00:00 AM”
   */
  dailyCron: function dailyCron() {
    new CronJob('0 8 * * *', function () {
      console.log('Cron running');
      (0, _serviceCtrl.scheduler)();
    }, function () {}, true);
  }
};