var ECreep = require('enhanced-creep');
var HarvesterStrategy = require('strategies.harvester');

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
        for(var strategy in priorities) {
            var target = Math.ceil(priorities[strategy] * creepCount);
            if(!census[strategy] || !census[strategy].length) {
                census[strategy] = [];
            }
            var current = census[strategy].length;
            var delta = current - target;
            for(var i = 0; i < delta; i++) {
                // laborer is a catchall bucket handled separately
                if(strategy !== 'laborer') {
                    // mark surplus creeps as allocatable
                    allocatable.push(census[strategy][i]);
                }
            }
            if(delta < 0) {
                // -delta is number of creeps needed to hit target
                needsStaff[strategy] = -delta;
            }
        }

        for(var strategy in needsStaff) {
            var needed = needsStaff[strategy];
            // try staffing from unemployed first
            while(needed > 0 && unemployed.length) {
                unemployed.splice(0, 1)[0].reallocate(strategy);
                needed--;
            }
            // finally, pull staff from overstaffed priorities
            while(needed > 0 && allocatable.length) {
                allocatable.splice(0, 1)[0].reallocate(strategy);
                needed--;
            }
        }
        rebuildCensus();
    };

    var rebuildCensus = () => {
        census = {};
        for(var creepName in Game.creeps) {
            var creep = new ECreep(creepName);
            var strat = creep.getStrategy();
            creeps[creepName] = creep;
            if(!strat || !strat.name) {
                creep.reallocate('laborer');
                strat = creep.getStrategy();
            }
            if(!census[strat.name]) {
                census[strat.name] = [];
            }
            census[strat.name].push(creep);
        }
    };
    rebuildCensus();
};