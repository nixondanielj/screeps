var HarvesterStrategy = require('strategies.harvester');
var BuilderStrategy = require('strategies.builder');
var UpgraderStrategy = require('strategies.upgrader');

module.exports = (name) => {
    switch(name) {
        case "harvester":
            return new HarvesterStrategy();
        case "builder":
            return new BuilderStrategy();
        case "upgrader":
            return new UpgraderStrategy();
    }
    return new HarvesterStrategy();
};