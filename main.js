// Your code goes here...
var builder = require('builder'),
    guard = require('guard'),
    harvester = require('harvester'),
    spawn = require('spawn'),
    Census = require('census');

for(var prop in Game.spawns){
  if(!Game.spawns[prop].spawning){
    spawn(Game.spawns[prop]);
  }
}

for(var prop in Game.creeps){
  var creep = Game.creeps[prop];
  var census = new Census(creep.room);
  if(!creep.spawning){
    var role = creep.memory.role;
    if(!creep.memory.born){
      census.birth(creep);
    }
    switch(creep.memory.role){
      case 'builder': builder(creep); break;
      case 'guard': guard(creep); break;
      case 'harvester': harvester(creep); break;
    }
  }
}
