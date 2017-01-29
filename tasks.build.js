var BaseTask = require('tasks.base');

function BuildTask() {
    this.run = (creep) => {
        if(creep.isEmpty()) {
            return false;
        }
        var targets = creep.find(FIND_CONSTRUCTION_SITES);
        if(!targets || !targets.length) {
            return false;
        }
        targets.sort((a, b) => b.progress - a.progress);
        var target = targets[0];
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    };
}

BuildTask.prototype = new BaseTask();

module.exports = BuildTask;