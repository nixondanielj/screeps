var BaseTask = require('tasks.base');
var Communicator = require('services.communicator');

function HarvestTask() {
    var comm = new Communicator();
    this.run = (creep) => {
        if(creep.isFull()) {
            if(creep.getTaskMemory().requestedPickup) {
                comm.cancelPickup(creep.getId());
            }
            return false;
        }
        var target = this.getTarget(creep, () => creep.findSources());
        if(!target) {
            return false;
        }
        if(creep.getEnergy() >= 50) {
            comm.requestPickup(creep.getId());
            creep.getTaskMemory().requestedPickup = true;
        }
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    };
}

HarvestTask.prototype = new BaseTask();

module.exports = HarvestTask;