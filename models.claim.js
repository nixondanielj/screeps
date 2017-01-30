module.exports = function Claim(claimant, expiry) {
    this.claimant = claimant;
    this.expiry = expiry;
    this.refreshed = Game.time;
};