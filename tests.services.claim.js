var ClaimService = require('services.claim');

console.log('Claims Tests');

var svc = new ClaimService();

var claimant = 'testclaimant';
var resource = 'testresource';
var cplxResource = 'test.complex.resource';

var test = (resource) => {
    console.log(!svc.refreshClaim(claimant, resource));
    svc.addClaim(claimant, resource);
    var claims = svc.getClaims(resource);
    console.log(claims.length === 1);
    console.log(claims[0].claimant === claimant);
    console.log(svc.refreshClaim(claimant, resource));
    svc.removeResource(resource);
    claims = svc.getClaims(resource);
    console.log(claims.length === 0);
    svc.removeResource(resource);
};

test(resource);
test(cplxResource);