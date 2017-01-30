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
    var spawnLimit = 17;
    var build = [MOVE, ATTACK, CARRY, MOVE, WORK, CARRY, MOVE, ATTACK, WORK, CARRY, MOVE];
    if(Object.keys(Game.creeps).length < spawnLimit) {
        var spawn = Game.spawns['Spawn1'];
        while(spawn.canCreateCreep(build) !== OK && build.length) {
            build = build.splice(1);
        }
        if(build.length) {
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
            builder: 3,
            upgrader: 1,
            guard: 3
        });
        utils.cleanMemory();
        Memory.lastReallocation = Game.time;
    }
    coordinator.doWork();
}