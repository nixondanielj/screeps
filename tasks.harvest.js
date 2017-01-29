var BaseTask = require('tasks.base');

function HarvestTask() {
    this.run = (creep) => {
        if(creep.isFull()) {
            return false;
        } else {
            var target = this.getTarget(creep, () => creep.findSources());
            if(!target) {
                return false;
            }
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        return true;
    };
}

HarvestTask.prototype = new BaseTask();

module.exports = HarvestTask;