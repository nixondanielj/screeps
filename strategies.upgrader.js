var HarvestTask = require('tasks.harvest');
var UpgradeTask = require('tasks.upgrade');

var tasks = [
    new HarvestTask(),
    new UpgradeTask()
];

module.exports = function UpgraderStrategy() {
    this.getTasks = () => tasks;
    this.name = 'upgrader';
};