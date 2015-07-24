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

var Census = require('census');
var _ = require('lodash');

module.exports = function(spawn){
  var census = new Census(spawn.room);
  var harvesters = census.getCountByRole(roles.harvester.name),
      guards = census.getCountByRole(roles.guard.name),
      builders = census.getCountByRole(roles.builders.name);
    if(harvesters < config.MIN_HARVESTERS) {
        spawn.createHarvester();
    } else if (spawn.memory.forceHarvester) {
        spawn.createHarvester();
    } else {
        if(!guards || harvesters / guards > 2) {
            spawn.createGuard();
        } else if (!builders || harvesters / builders > 8) {
            spawn.createBuilder();
        } else {
            spawn.createHarvester();
        }
    }
};

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
