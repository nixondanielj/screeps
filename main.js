// Your code goes here...
var builder = require('builder'),
    guard = require('guard'),
    harvester = require('harvester'),
    spawn = require('spawn');

for(var prop in Game.spawns){
    if(!Game.spawns[prop].spawning){
        spawn(Game.spawns[prop]);
    }
}

for(var prop in Game.creeps){
    var creep = Game.creeps[prop];
    if(!creep.spawning){
        var role = creep.memory.role;
        if(!creep.memory.born){
            birth(creep);
        }
        switch(creep.memory.role){
            case 'builder': builder(creep); break;
            case 'guard': guard(creep); break;
            default: harvester(creep); break;
        }
    }
}

function birth(creep) {
    var census = creep.room.memory.census;
    // add birth to census
    census[creep.memory.role].push(Game.time);
    creep.memory.born = true;

    // clean up deaths from census
    for(var role in census){
        census[role] = census[role].filter(function(birth){
            return birth > Game.time - 1800;
        });
    }
}
