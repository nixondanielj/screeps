var strategyFactory = require('factories.strategy');
var utils = require('utils');

module.exports = function ECreep(name) {
    var _creep = Game.creeps[name];
    var _strategy = null;
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

    this.reallocate = (strategy) => {
        console.log('reallocating creep');
        strategy = strategyFactory(strategy);
        this.memory.strategy = strategy.name;
        _strategy = strategy;
        clearTask();
    };

    this.getStrategy = () => {
        if(!_strategy && this.memory.strategy) {
            _strategy = strategyFactory(this.memory.strategy);
            //_creep.say(_strategy.name);
        }
        return _strategy;
    };

    this.doWork = () => {
        var tasks = this.getStrategy().getTasks();
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