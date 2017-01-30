var ClaimService = require('services.claim');

function BaseTask() {
    this.lookupObject = (rpath) => {
        return Game.getObjectById(rpath.split('.').splice(-1));
    };
    this.getTarget = (creep, sourceFn, maxClaims=5, filterFn=false, sortFn=false) => {
        var claimSvc = new ClaimService();
        var memory = creep.getTaskMemory();
        if(memory.target) {
            var memTarg = Game.getObjectById(memory.target);
            if(!filterFn || filterFn(memTarg)) {
                if(claimSvc.refreshClaim(creep.getId(), memory.target)) {
                    return memTarg;
                }
            }
        }
        var sources = sourceFn();
        if(filterFn) {
            sources = sources.filter(filterFn);
        }
        if(sortFn) {
            sources.sort(sortFn);
        }
        var target = claimSvc.getLeastClaimed(sources, maxClaims);
        if(target) {
            memory.target = target.id;
            claimSvc.addClaim(creep.getId(), target.id);
        }
        return target;
    }
}

module.exports = BaseTask;