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
                creep.clean();
            }
        }
    };

    this.reallocate = (priorities) => {
        priorities = normalizePriorities(priorities);
        var creepCount = Object.keys(creeps).length;
        var needsStaff = {};
        var unemployed = census['laborer'] || [];
        var allocatable = [];
        for(var role in priorities) {
            var target = Math.ceil(priorities[role] * creepCount);
            if(!census[role] || !census[role].length) {
                census[role] = [];
            }
            var current = census[role].length;
            var delta = current - target;
            for(var i = 0; i < delta; i++) {
                // laborer is a catchall bucket handled separately
                if(role !== 'laborer') {
                    // mark surplus creeps as allocatable
                    allocatable.push(census[role][i]);
                }
            }
            if(delta < 0) {
                // -delta is number of creeps needed to hit target
                needsStaff[role] = -delta;
            }
        }

        for(var role in needsStaff) {
            var needed = needsStaff[role];
            // try staffing from unemployed first
            while(needed > 0 && unemployed.length) {
                unemployed.splice(0, 1)[0].reallocate(role);
                needed--;
            }
            // finally, pull staff from overstaffed priorities
            while(needed > 0 && allocatable.length) {
                allocatable.splice(0, 1)[0].reallocate(role);
                needed--;
            }
        }
        rebuildCensus();
    };

    var rebuildCensus = () => {
        census = {};
        for(var creepName in Game.creeps) {
            var creep = new ECreep(creepName);
            var role = creep.getRole();
            creeps[creepName] = creep;
            if(!role || !role.name) {
                creep.reallocate('laborer');
                role = creep.getRole();
            }
            if(!census[role.name]) {
                census[role.name] = [];
            }
            census[role.name].push(creep);
        }
    };
    rebuildCensus();
};