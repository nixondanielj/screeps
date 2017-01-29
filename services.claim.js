var stateSvc = require('services.state');
var utils = require('utils');

const EXPIRY = 5;

module.exports = function ClaimService() {
    var claims = stateSvc.getState('claims');

    var cleanClaims = (key) => {
        if(!claims[key] || !claims[key].length) {
            claims[key] = [];
        }
        var tick = Game.time;
        claims[key] = claims[key].filter(c => tick - c.refreshed < EXPIRY);
        return claims[key];
    };

    this.getLeastClaimed = (resources, max=5) => {
        var leastClaims = max + 1;
        var result = null;
        for(var i = 0; i < resources.length; i++) {
            var resource = resources[i];
            var num_claims = this.getClaims(resource.id).length;
            if(num_claims < leastClaims) {
                leastClaims = num_claims;
                result = resource;
            }
        }
        return result;
    };

    this.addClaim = (claimant, resource) => {
        if(claims[resource]) {
            cleanClaims(resource)
        } else {
            claims[resource] = [];
        }
        var claim = {
            refreshed: Game.time,
            claimant: claimant
        };
        claims[resource].push(claim);
    };

    this.getClaims = (resource) => {
        return cleanClaims(resource);
    };

    var tryRefreshClaim = (claimant, resource) => {
        if(!claims[resource] || !claims[resource].length) {
            return false;
        }
        for(var i = 0; i < claims[resource].length; i++) {
            if(claims[resource][i].claimant === claimant) {
                claims[resource][i].refreshed = Game.time;
                return true;
            }
        }
        return false;
    };

    this.refreshClaim = (claimant, resource) => {
        if(!tryRefreshClaim(claimant, resource)) {
            this.addClaim(claimant, resource);
        }
    };
}