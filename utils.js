//var ClaimService = require('services.claim');

module.exports = {
    setDefault: (memory, path, dflt) => {
        var loc = memory;
        var segments = path.split('.');
        for(var segIdx = 0; segIdx < segments.length; segIdx++) {
            var segment = segments[segIdx];
            if(loc[segment] == undefined) {
                if(segIdx + 1 == segments.length && dflt) {
                    loc[segment] = dflt;
                } else {
                    loc[segment] = {};
                }
            }
            loc = loc[segment];
        }
        return loc;
    }
};