var BaseTask = require('tasks.base');

function StockTask() {
    this.run = (creep) => {
        if(creep.isEmpty()) {
            return false;
        }
        var target = this.getTarget(creep, 
            () => creep.findStructures([STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER]),
            5, (struct) => {
                if(struct.energyCapacity) {
                    return struct.energy < struct.energyCapacity;
                } else if(struct.storeCapacity) {
                    return _.sum(struct.store) < struct.storeCapacity;
                }
                return false;
            },
            (a, b) => {
                var priorities = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
                return priorities.includes(b.structType) - priorities.includes(a.structType);
            }
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