var stateSvc = require('services.state');
var Claim = require('models.claim');
var utils = require('utils');

module.exports = function ClaimService() {

    var cleanClaims = (key) => {
        var claims = getResource(key);
        var tick = Game.time;
        for(var i = claims.length - 1; i >= 0; i--) {
            var c = claims[i];
            if(tick - c.refreshed > c.expiry) {
                claims.splice(i, 1);
            }
        }
        return claims;
    };

    var getResource = (rpath) => {
        return utils.setDefault(stateSvc.getState('claims'), rpath, []);
    };

    this.getLeastClaimed = (resources, max=5) => {
        var leastClaims = max + 1;
        var result = null;
        for(var i = 0; i < resources.length; i++) {
            var resource = resources[i];
            var num_claims;
            if(resource.id) {
                num_claims = this.getClaims(resource.id).length;
            } else {
                num_claims = this.getClaims(resource).length;
            }
            if(num_claims < leastClaims) {
                leastClaims = num_claims;
                result = resource;
            }
        }
        return result;
    };

    this.updatePayload = () => {
        console.log('update payload noop');
    }

    this.addClaim = (claimant, resource, expiry=5) => {
        getResource(resource).push(new Claim(claimant, expiry));
    };

    this.getClaims = (resource) => {
        return cleanClaims(resource);
    };

    this.refreshClaim = (claimant, resource) => {
        var claims = getResource(resource);
        for(var i = 0; i < claims.length; i++) {
            if(claims[i].claimant === claimant) {
                claims[i].refreshed = Game.time;
                return true;
            }
        }
        return false;
    };

    this.addResource = (rpath) => getResource(rpath);

    this.removeResource = (rpath) => {
        rpath = rpath.split('.');
        var key = rpath.splice(-1);
        var parent = getResource(rpath.join('.'));
        delete parent[key];
    };
}