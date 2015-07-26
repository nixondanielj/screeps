module.exports = function Census(roomMemory){
  var mem = roomMemory;
  if(!mem.init){
    init(mem);
  }

  var census = mem.census;
  if(Game.time - census.lastClean >= 10){
    cleanCensus();
  }

  this.birth = function(creep){
    if(creep.memory.born){
      return;
    }
    creep.memory.myId = creep.id;
    if(!census.roles[creep.memory.role]){
      census.roles[creep.memory.role] = {};
    }
    census.roles[creep.memory.role][creep.id] = Game.time;
    cleanCensus();
    cleanMemory();
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
}

function cleanMemory(){
  var toDel = [];
  for(var c in Memory.creeps){
    if(!(c in Game.creeps)){
      toDel.push(c);
    }
  }
  toDel.forEach(function(name){
    delete Memory.creeps[name];
  });
}

function init(mem){
  mem.census = { roles: {}, lastClean: Game.time };
  census = mem.census;
  mem.init = true;
}
