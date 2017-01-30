var BaseTask = require('tasks.base');

function StockTask() {
    this.run = (creep) => {
        if(creep.isEmpty()) {
            return false;
        }
        var target = this.getTarget(creep, 
            () => creep.findStructures([STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER]),
            5, (struct) => struct.energy < struct.energyCapacity
        );
        if(!target) {
            return false;
        }
        if(creep.xferEnergy(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    }
};

StockTask.prototype = new BaseTask();

module.exports = StockTask;