var utils = require('utils');

module.exports = {
    getState: (path, dflt) => {
        return utils.setDefault(Memory, path, dflt || {});
    }
};