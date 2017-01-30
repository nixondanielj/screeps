var BuilderTask = require('tasks.build');
var WithdrawTask = require('tasks.withdraw');
var HarvestTask = require('tasks.harvest');
var StockTask = require('tasks.stock');
var UpgradeTask = require('tasks.upgrade');
var RepairTask = require('tasks.repair');

var tasks = [
    new WithdrawTask(),
    new HarvestTask(),
    new BuilderTask(),
    new RepairTask(),
    new UpgradeTask()
];

module.exports = function BuilderRole() {
    this.getTasks = () => tasks;
    this.name = 'builder';
    this.isCapable = (creep) => {
        return creep.hasActiveParts([MOVE, WORK, CARRY]);
    };
};