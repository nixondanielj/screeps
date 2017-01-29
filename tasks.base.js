var ClaimService = require('services.claim');

function BaseTask() {
    this.getTarget = (creep, sourceFn) => {
        var claimSvc = new ClaimService();
        var memory = creep.getTaskMemory();
        if(memory.target) {
            claimSvc.refreshClaim(creep.getId(), memory.target);
            return Game.getObjectById(memory.target);
        }
        var target = claimSvc.getLeastClaimed(sourceFn());
        if(target) {
            memory.target = target.id;
            claimSvc.addClaim(creep.getId(), target.id);
        }
        return target;
    }
}

module.exports = BaseTask;