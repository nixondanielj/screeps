var ECreep = require('enhanced-creep');

var normalizePriorities = (priorities) => {
    var sum = 0;
    for(var k in priorities) {
        sum += priorities[k];
    }
    for(var k in priorities) {
        priorities[k] = priorities[k] / sum;
    }
    return priorities;
}

module.exports = function Coordinator() {
    var census = {};
    var creeps = {};

    this.doWork = () => {
        for(var creepName in creeps) {
            var creep = creeps[creepName];
            try {
                creep.doWork();
            } catch(err) {
                console.log('error from ' + creepName + ':');
                console.log(err);
                console.log(err.stack);
                creep.clean();
            }
        }
    };

    this.reallocate = (priorities) => {
        priorities = normalizePriorities(priorities);
        var creepCount = Object.keys(creeps).length;
        var deltas = {};
        for(var role in priorities) {
            var target = Math.ceil(priorities[role] * creepCount);
            if(!census[role] || !census[role].length) {
                census[role] = [];
            }
            var current = census[role].length;
            var delta = current - target;
            deltas[role] = delta;
        }

        for(var fromRole in deltas) {
            var surplus = deltas[fromRole];
            var fromPool = census[fromRole];
            if(surplus <= 0 || !fromPool.length) continue;

            for(var toRole in deltas) {
                var needed = -deltas[toRole];
                if(fromRole == toRole || needed <= 0) continue;
                var idx = 0;
                while(idx < fromPool.length && surplus > 0 && needed > 0) {
                    if(fromPool[idx].tryReallocate(toRole)) {
                        surplus--;
                        needed--;
                    }
                    idx++;
                }
                deltas[toRole] = -needed;
            }
            deltas[fromRole] = surplus;
        }
        rebuildCensus();
    };

    var rebuildCensus = () => {
        census = {};
        for(var creepName in Game.creeps) {
            var creep = new ECreep(creepName);
            var role = creep.getRole();
            if(!role || !role.name) {
                if(!creep.tryReallocate('harvester')) {
                    if(!creep.tryReallocate('guard')) {
                        console.log('unassignable creep');
                        continue;
                    }
                }
                role = creep.getRole();
            }
            creeps[creepName] = creep;
            if(!census[role.name]) {
                census[role.name] = [];
            }
            census[role.name].push(creep);
        }
        Memory.census = census;
    };
    rebuildCensus();
};