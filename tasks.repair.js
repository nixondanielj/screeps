var BaseTask = require('tasks.base');

function RepairTask() {
    this.run = (creep) => {
        if(creep.isEmpty() || !creep.hasActiveParts([MOVE, WORK, CARRY])) {
            return false;
        }
        var target = this.getTarget(creep, 
            () => creep.findStructures(),
            0,
            (struct) => struct.hits < struct.hitsMax,
            (a, b) => a.hits - b.hits);
        if(!target) {
            return false;
        }
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    };
}

RepairTask.prototype = new BaseTask();

module.exports = RepairTask;