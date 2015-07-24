module.exports = function(creep){
    if(!creep.memory.sourceId){
       setTarget(creep);
    }

    if(creep.energy < creep.energyCapacity){
        var source = Game.getObjectById(creep.memory.sourceId);
        creep.moveTo(source);
        creep.harvest(source);
    } else {
        var spawn;
        if(!creep.memory.closestSpawn){
            console.log(creep);
            spawn = creep.pos.findClosest(FIND_MY_SPAWNS) || Game.spawns.Spawn1;
            console.log(creep.room.find(FIND_MY_SPAWNS));
            creep.memory.closestSpawn = spawn.id;
        } else {
            spawn = Game.getObjectById(creep.memory.closestSpawn);
        }
        console.log(spawn);
        creep.moveTo(spawn);
        creep.transferEnergy(spawn);
    }
}

var config = {
    MAX_HARVESTERS_PER_SOURCE: 3
};

function setTarget(creep){
    var source = getTargetSource(creep.room);
    source.creeps.push(creep.id);
    creep.memory.sourceId = source.id;
}

function getTargetSource(room){
    // if room's memory for sources is empty, set it
    if(!room.memory.sources || !room.memory.sources.length){
        room.memory.sources = room.find(FIND_SOURCES).map(function(source){
            return { id: source.id, creeps: [] };
        });
    }

    // find next source with less than n creeps
    for(var i = 0; i < room.memory.sources.length; i++) {
        var source = room.memory.sources[i];
        if(source.creeps.length < config.MAX_HARVESTERS_PER_SOURCE){
            return source;
        }
    }
}
