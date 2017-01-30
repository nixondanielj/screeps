var HarvesterRole = require('roles.harvester');
var BuilderRole = require('roles.builder');
var UpgraderRole = require('roles.upgrader');
var GuardRole = require('roles.guard');

module.exports = (name) => {
    switch(name) {
        case "harvester":
            return new HarvesterRole();
        case "builder":
            return new BuilderRole();
        case "upgrader":
            return new UpgraderRole();
        case "guard":
            return new GuardRole();
    }
    console.log('warning - no role set for creep, factory making a harvester');
    return new HarvesterRole();
};