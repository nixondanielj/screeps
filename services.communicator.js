var ClaimService = require('services.claim');
var stateSvc = require('services.state');

function Communicator() {
    var claimSvc = new ClaimService();

    this.requestPickup = (id) => {
        if(!claimSvc.refreshClaim(id, 'comm.requests.pickup')) {
            claimSvc.addClaim(id, 'comm.requests.pickup');
        }
    };

    this.getOpenPickups = () => {
        return claimSvc.getClaims('comm.requests.pickup')
            .map(c => 'requests.pickup.' + c.claimant);
    };

    this.isPickupOpen = (p) => {
        return this.getOpenPickups().includes(p);
    };

    this.requestTransfer = (requester, target) => {
        var inbox = this.getInbox(target);
        if(!inbox.transfers || !inbox.transfers.length) {
            inbox.transfers = [];
        }
        inbox.transfers.push(requester);
    };

    this.getInbox = (ownerId) => {
        return stateSvc.getState('mail.' + ownerId);
    };

    this.cancelPickup = (id) => {
        var reqs = claimSvc.getClaims('comm.requests.pickup');
        for(var i = 0; i < reqs.length; i++) {
            if(reqs[i].claimant === id) {
                reqs.splice(i, 1);
                return true;
            }
        }
        return false;
    };
}

module.exports = Communicator;