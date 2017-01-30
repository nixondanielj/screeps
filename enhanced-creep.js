var roleFactory = require('factories.role');
var utils = require('utils');
var Communicator = require('services.communicator');

module.exports = function ECreep(name) {
    var _creep = Game.creeps[name];
    var _role = null;
    this.memory = _creep.memory;
    this.room = _creep.room;

    this.isFull = () => {
        return _.sum(_creep.carry) == _creep.carryCapacity;
    };

    this.isEmpty = (res) => {
        if(res) {
            return !!_creep.carry[res];
        }
        return _.sum(_creep.carry) === 0;
    };

    this.getEnergy = () => _creep.carry.energy;

    this.tryReallocate = (role) => {
        role = roleFactory(role);
        if(!role.isCapable(this)) {
            return false;
        }
        console.log('reallocating creep');
        this.memory.role = role.name;
        _role = role;
        clearTask();
        return true;
    };

    this.isAdjacent = (target) => {
        console.log('checking range: ' + target.id);
        return _creep.pos.inRangeTo(target, 1);
    };

    this.getRole = () => {
        if(!_role && this.memory.role) {
            _role = roleFactory(this.memory.role);
        }
        return _role;
    };

    this.report = (message) => {
        message = this.getRole().name + ": " + message;
        _creep.say(message);
    };

    this.doWork = () => {
        if(processRequests()) {
            return true;
        }
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

    this.findSources = () => this.room.find(FIND_SOURCES);

    this.findStructures = (types) => {
        return _creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                if(!types || !types.length) {
                    return true;
                }
                return types.includes(structure.structureType);
            }
        });
    }

    this.hasActiveParts = (parts) => {
        if(!parts.length) {
            parts = [parts];
        }
        for(var i = 0; i < parts.length; i++) {
            if(!_creep.getActiveBodyparts(parts[i])) {
                return false;
            }
        }
        return true;
    };

    var clearTask = () => {
        delete this.memory.task;
        return utils.setDefault(this.memory, 'task', {});
    }

    var processRequests = () => {
        var comm = new Communicator();
        var reqs = comm.getInbox(this.getId());
        while(reqs.transfers && reqs.transfers.length) {
            if(this.xferEnergy(reqs.transfers.pop()) === OK) {
                return true;
            }
        }
        return false;
    };

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
    this.findClosestEnemy = () => _creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    this.attack = (target) => _creep.attack(target);
    this.pickup = (target) => _creep.pickup(target);
    this.repair = (target) => _creep.repair(target);
};