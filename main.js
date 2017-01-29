var Coordinator = require('services.coordinator');

module.exports.loop = function () {
    var spawnLimit = 11;
    var bigBuild = [WORK, MOVE, MOVE, MOVE, CARRY, WORK, MOVE, CARRY]
    var build = [WORK, MOVE, CARRY];
    if(Object.keys(Game.creeps).length < spawnLimit) {
        var spawn = Game.spawns['Spawn1'];
        if(spawn.canCreateCreep(bigBuild) == OK) {
            spawn.createCreep(bigBuild);
        } else if(spawn.canCreateCreep(build) == OK) {
            spawn.createCreep(build);
        }
    }
    var coordinator = new Coordinator();
    if(!Memory.lastReallocation) {
        Memory.lastReallocation = 0;
    }
    if(Game.time - Memory.lastReallocation > 5) {
        coordinator.reallocate({
            harvester: 6,
            builder: 3,
            upgrader: 1
        });
        Memory.lastReallocation = Game.time;
    }
    coordinator.doWork();
}