module.exports = function StockTask() {

    var getTarget = (creep) => {
        var targets = creep.findStructures([STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER]);
        targets = targets.filter(s => s.energy < s.energyCapacity);
        if(!targets.length) {
            return null;
        }
        // TODO: add prioritization
        return targets[0];
    };

    this.run = (creep) => {
        var acted = false;
        if(!creep.isEmpty()) {
            var target = getTarget(creep);
            if(target) {
                if(creep.xferEnergy(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                acted = true;
            }
        }
        return acted;
    }
};