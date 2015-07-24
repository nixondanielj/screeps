module.exports = function(creep){
     if(creep.energy){
         var site;
         if(!creep.memory.site){
            site = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
            if(!site) {
                site = getLowestController(creep);
            }
            creep.memory.site = site.id;
         } else {
             site = Game.getObjectById(creep.memory.site);
         }
         creep.moveTo(site);
         if(site.structureType !== STRUCTURE_CONTROLLER) {
            creep.build(site);
         } else {
             console.log('builder xferring e to ' + JSON.stringify(site));
            creep.upgradeController(site);
         }
     } else {
        var spawn;
        if(!creep.memory.closestSpawn){
            spawn = creep.pos.findClosest(FIND_MY_SPAWNS);
            creep.memory.closestSpawn = spawn.id;
        } else {
            spawn = Game.getObjectById(creep.memory.closestSpawn);
        }
        creep.moveTo(spawn);
        spawn.transferEnergy(creep);
     }
 }

 function getLowestController(creep){
    var controllers = creep.room.find(FIND_MY_STRUCTURES, {
        filter: function(str){
            return str.structureType === STRUCTURE_CONTROLLER
        }
    });
    var result = controllers[0];
    for(var i = 1; i < controllers.length; i++){
        if(controllers[i].level < result.level){
            result = controllers[i];
        }
    }
    return result;
 }
