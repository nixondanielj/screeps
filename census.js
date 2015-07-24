var age;

module.exports = function Census(roomMemory){
  var mem = roomMemory;
  var census = mem.census;
  if(!mem.init){
    init(mem);
  }

  age = Game.time - census.age;
  if(age >= 10){
    cleanCensus();
  }

  this.birth = function(creep){
    if(creep.memory.born){
      return;
    }
    if(!census[creep.memory.role]){
      census[creep.memory.role] = {};
    }
    census.roles[creep.memory.role][creep.id] = Game.time;
    cleanCensus();
    creep.memory.born = true;
  };

  this.getCountByRole = function(role){
    if(!census.roles || !census.roles[role]){
      return 0;
    }
    return census.roles[role].length;
  };
}

function cleanCensus(){
  for(var role in census.roles){
    for(var creep in census.roles[role]){
      if(!Game.getObjectById(creep)){
        delete census.roles[role][creep];
      }
    }
  }
  age = 0;
}

function init(mem){
  mem.census = { roles: {}, age: Game.time };
  census = mem.census;
  mem.init = true;
}
