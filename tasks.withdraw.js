var BaseTask = require('tasks.base');

function WithdrawTask() {
    this.run = (creep) => {
        if(creep.isFull()) {
            return false;
        }
        var target = this.getTarget(creep, () => {
            var structures = creep.findStructures([STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_CONTAINER]);
            return structures.filter(s => s.energy >= creep.getCapacity());
        });;
        if(!target) {
            return false;
        }
        if(creep.withdrawEnergy(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    }
}

WithdrawTask.prototype = new BaseTask();

module.exports = WithdrawTask;