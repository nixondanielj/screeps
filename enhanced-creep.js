var roleFactory = require('factories.role');
var utils = require('utils');

module.exports = function ECreep(name) {
    var _creep = Game.creeps[name];
    var _role = null;
    this.memory = _creep.memory;
    this.room = _creep.room;

    this.isFull = () => {
        return _.sum(_creep.carry) == _creep.carryCapacity;
    }

    this.isEmpty = (res) => {
        if(res) {
            return !!_creep.carry[res];
        }
        return _.sum(_creep.carry) === 0;
    }

    this.reallocate = (role) => {
        console.log('reallocating creep');
        role = roleFactory(role);
        this.memory.role = role.name;
        _role = role;
        clearTask();
    };

    this.getRole = () => {
        if(!_role && this.memory.role) {
            _role = roleFactory(this.memory.role);
            //_creep.say(_role.name);
        }
        return _role;
    };

    this.doWork = () => {
        var tasks = this.getRole().getTasks();
        var task = utils.setDefault(this.memory, 'task', {});
        if((task.idx || task.idx === 0) && tasks[task.idx].run(this)) {
            return true;
        }
        task = clearTask();
        for(var i = 0; i < tasks.length; i++) {
            if(tasks[i].run(this)) {
                task.idx = i;
                return true;
            }
        }
        return false;
    };

    this.getTaskMemory = () => {
        var mem = utils.setDefault(this.memory, 'task.mem', {});
        return mem;
    };

    this.xferEnergy = (target) => _creep.transfer(target, RESOURCE_ENERGY);

    this.findSources = () => {
        return this.room.find(FIND_SOURCES);
    };

    this.findStructures = (types) => {
        return _creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return types.includes(structure.structureType);
            }
        });
    }

    this.clean = () => clearTask();

    this.harvest = (target) => _creep.harvest(target);
    this.moveTo = (target) => _creep.moveTo(target);
    this.getId = () => _creep.id;
    this.upgradeController = (controller) => _creep.upgradeController(controller);
    this.findController = () => _creep.room.controller;
    this.getCapacity = () => _creep.carryCapacity;
    this.withdrawEnergy = (target) => _creep.withdraw(target, RESOURCE_ENERGY);
    this.find = (args) => _creep.room.find(args);
    this.build = (target) => _creep.build(target);

    var clearTask = () => {
        delete this.memory.task;
        return utils.setDefault(this.memory, 'task', {});
    }
};