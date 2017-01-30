var HarvestTask = require('tasks.harvest');
var UpgradeTask = require('tasks.upgrade');

var tasks = [
    new HarvestTask(),
    new UpgradeTask()
];

module.exports = function UpgraderRole() {
    this.getTasks = () => tasks;
    this.name = 'upgrader';
    this.isCapable = (creep) => {
        return creep.hasActiveParts([MOVE, WORK, CARRY]);
    };
};