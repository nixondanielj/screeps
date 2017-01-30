var BaseTask = require('tasks.base');

function CleanupTask() {
    this.run = (creep) => {
        if(creep.isFull() || !creep.hasActiveParts([CARRY, MOVE])) {
            return false;
        }
        // max claims 0, don't want it if someone else has claimed it
        var target = this.getTarget(creep, () => creep.find(FIND_DROPPED_ENERGY), 0);
        if(!target) {
            console.log('no target for pickup');
            return false;
        }
        console.log(target);
        if(creep.pickup(target == ERR_NOT_IN_RANGE)) {
            creep.moveTo(target);
        }
        return true;
    };
}

CleanupTask.prototype = new BaseTask();

module.exports = CleanupTask;