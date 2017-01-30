module.exports = {
    setDefault: (memory, rpath, dflt) => {
        if(!rpath) {
            return memory || dflt;
        }
        var loc = memory;
        var segments = rpath.split('.');
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
    },
    cleanMemory: () => {
        for(var cname in Memory.creeps) {
            if(!Game.creeps[cname]) {
                console.log('deleting creep');
                delete Memory.creeps[cname];
            }
        }
        for(var claim in Memory.claims) {
            if(!Memory.claims[claim] || !Memory.claims[claim].length) {
                delete Memory.claims[claim];
            }
        }
    }
};