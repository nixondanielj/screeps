var HarvesterRole = require('role.harvester');
var BuilderRole = require('role.builder');
var UpgraderRole = require('role.upgrader');

module.exports = (name) => {
    switch(name) {
        case "harvester":
            return new HarvesterRole();
        case "builder":
            return new BuilderRole();
        case "upgrader":
            return new UpgraderRole();
    }
    console.log('warning - no role set for creep, factory making a harvester');
    return new HarvesterRole();
};