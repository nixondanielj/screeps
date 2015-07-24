var roles = {
    harvester: {
        body: [CARRY, WORK, MOVE, MOVE, CARRY],
        name: 'harvester'
    },
    guard: {
        body: [TOUGH, ATTACK, MOVE],
        name: 'guard'
    },
    builder: {
        body: [CARRY, WORK, MOVE],
        name: 'builder'
    }
};

var config = {
    MIN_HARVESTERS: 4
};

var _ = require('lodash');

Spawn.prototype.create = function(role, options){
    options = options || {};
    options.born = false;
    options.role = role.name
    var status = this.canCreateCreep(role.body, null, options);
    if(status === OK){
        status = this.createCreep(role.body, null, options);
    } else if (status === ERR_NOT_ENOUGH_ENERGY) {
        //this.memory.forceHarvester = true;
    }
    return status;
};

Spawn.prototype.createHarvester = function(){
    var status = this.create(roles.harvester);
    if(_.isString(status)){
        this.memory.forceHarvester = false;
    }
};

Spawn.prototype.createGuard = function(){
    return this.create(roles.guard);
};

Spawn.prototype.createBuilder = function(){
    return this.create(roles.builder);
}

module.exports = function(spawn){
    var census = spawn.room.memory.census || initializeCensus();
    if(census[roles.harvester.name].length < config.MIN_HARVESTERS) {
        spawn.createHarvester();
    } else if (spawn.memory.forceHarvester) {
        spawn.createHarvester();
    } else {
        var guards = census[roles.guard.name].length;
        var harvesters = census[roles.harvester.name].length;
        var builders = census[roles.builder.name].length;
        console.log(JSON.stringify(census));
        if(!guards || harvesters / guards > 2) {
            spawn.createGuard();
        } else if (!builders || harvesters / builders > 8) {
            spawn.createBuilder();
        } else {
            spawn.createHarvester();
        }
    }
};

function initializeCensus(){
    // initialize census
    var census = {};
    for(var role in roles){
        census[role] = [];
    }
    for(var room in Game.rooms){
        Game.rooms[room].memory.census = census;
    }
    return census;
}
