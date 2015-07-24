module.exports = function(creep){
    var enemy = creep.pos.findClosest(FIND_HOSTILE_CREEPS);
    if(enemy && enemy.owner.username !== 'Source Keeper') {
        creep.moveTo(enemy);
        creep.attack(enemy);
    }
    if(creep.getActiveBodyparts(ATTACK) === 0 && !creep.memory.kia) {
        creep.room.memory.census[creep.role].unshift();
        creep.memory.kia = true;
    }
}
