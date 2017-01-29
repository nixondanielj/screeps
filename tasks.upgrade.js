module.exports = function UpgradeTask() {
    this.run = (creep) => {
        if(creep.isEmpty()) {
            return false;
        }
        var controller = creep.findController();
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
        return true;
    }
};