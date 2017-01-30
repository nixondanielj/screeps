var Coordinator = require('services.coordinator');
var utils = require('utils');

module.exports.loop = function () {
    //require('tests.services.claim');
    //require('tests.services.communicator');
    var tower = Game.getObjectById('588e43a495d4334807315b45');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    var spawnLimit = 15;
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
            harvester: 10,
            builder: 4,
            upgrader: 1
        });
        utils.cleanMemory();
        Memory.lastReallocation = Game.time;
    }
    coordinator.doWork();
}