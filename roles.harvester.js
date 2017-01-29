var HarvestTask = require('tasks.harvest');
var StockTask = require('tasks.stock');
var UpgradeTask = require('tasks.upgrade');
var BuildTask = require('tasks.build');

var tasks = [
    new HarvestTask(),
    new StockTask(),
    new BuildTask(),
    new UpgradeTask()
];

module.exports = function HarvesterRole() {
    this.getTasks = () => tasks;
    this.name = 'harvester';
};