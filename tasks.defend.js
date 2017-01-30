var BaseTask = require('tasks.base');

function DefendTask() {
    this.run = (creep) => {
        if(!creep.hasActiveParts([ATTACK])) {
            return false;
        }
        var enemy = creep.findClosestEnemy();
        if(!enemy) {
            return false;
        }
        if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    }
}

DefendTask.prototype = new BaseTask();

module.exports = DefendTask;