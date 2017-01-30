var DefendTask = require('tasks.defend');

var tasks = [
    new DefendTask()
];

module.exports = function GuardRole() {
    this.getTasks = () => tasks;
    this.name = 'guard';
    this.isCapable = (creep) => {
        return creep.hasActiveParts([MOVE, ATTACK]) ||
            creep.hasActiveParts([MOVE, RANGED_ATTACK]);
    };
};