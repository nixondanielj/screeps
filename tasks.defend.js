var BaseTask = require('tasks.base');

function DefendTask() {
    this.run = (creep) => {
        if(!creep.hasActiveParts([ATTACK])) {
            return false;
        }
        creep.report();
        var enemy = creep.findClosestEnemy();
        if(!enemy) {
            var tower = Game.getObjectById('588e43a495d4334807315b45');
            if(tower) {
                creep.moveTo(tower);
            }
        }
        if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    }
}

DefendTask.prototype = new BaseTask();

module.exports = DefendTask;