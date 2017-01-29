var utils = require('utils');

module.exports = {
    getState: (path) => {
        return utils.setDefault(Memory, path, {});
    }
};