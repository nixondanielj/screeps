var BaseTask = require('tasks.base');
var Communicator = require('services.communicator');
var ClaimService = require('services.claim');

function PickupTask() {
    var comm = new Communicator();
    var getTarget = (creep) => {
        var claimSvc = new ClaimService();
        var mem = creep.getTaskMemory();
        if(mem.target && comm.isPickupOpen(mem.target)) {
            var p = mem.target.split('.');
            var target = Game.getObjectById(p[p.length - 1]);
            if(target && claimSvc.refreshClaim(creep.getId(), mem.target)) {
                return target;
            }
        }

        var targets = comm.getOpenPickups();
        if(targets && targets.length) {
            var target = claimSvc.getLeastClaimed(targets, 0);
            if(target) {
                var fpath = target;
                target = this.lookupObject(target);
                if(target) {
                    claimSvc.addClaim(creep.getId(), fpath);
                    mem.target = fpath;
                    return target;
                }
            }
        }
        return null;
    }
    this.run = (creep) => {
        if(!creep.isEmpty()) {
            return false;
        }
        var target = getTarget(creep);
        if(!target) {
            return false;
        }
        if(creep.isAdjacent(target)) {
            console.log('requesting transfer');
            comm.requestTransfer(creep.getId(), target.id);
        } else {
            creep.moveTo(target);
        }
        return true;
    };
}

PickupTask.prototype = new BaseTask();

module.exports = PickupTask;