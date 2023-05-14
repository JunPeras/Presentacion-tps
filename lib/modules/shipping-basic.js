const domesticShippingAmount = 10;
const workShippingAmount = 20;
const internationalShippingAmount = 25;
const freeThreshold = 100;
const freeFourhold = 150;
const shippingFromCountry = 'Australia';
const maxProducts = 3;

const calculateShipping = (amount, quantity, config, req) => {
    // If a subscription, remove shipping
    if (req.session.cartSubscription) {
        req.session.shippingMessage = 'FREE shipping';
        req.session.totalCartShipping = 0;
        req.session.totalCartAmount = req.session.totalCartAmount + 0;
        return;
    }

    // Calculate free threshold -> When amount is 150 Euro or higher -> Shipping Cost = Free
    if (amount >= freeFourhold||quantity >= maxProducts) {
        req.session.shippingMessage = 'FREE shipping';
        req.session.totalCartShipping = 0;
        req.session.totalCartAmount = req.session.totalCartAmount + 0;
        return;
    }

    // Calculate when amount is between 100 Euro and 149 Euro -> Shipping Cost = 10 Euro
    if (amount >= freeThreshold && amount < freeFourhold) {
        req.session.shippingMessage = 'Normal shipping';
        req.session.totalCartShipping = domesticShippingAmount;
        req.session.totalCartAmount = amount + domesticShippingAmount;
        return;
    }

    // Calculate when amount is lower than 100 Euro -> Shipping Cost = 20 Euro
    if(amount < freeThreshold){
        req.session.shippingMessage = 'Ultra shipping';
        req.session.totalCartShipping = workShippingAmount;
        req.session.totalCartAmount = amount + workShippingAmount;
        return;
    }

    

    // If there is no country set, we estimate shipping
    if (!req.session.customerCountry) {
        req.session.shippingMessage = 'Estimated shipping';
        req.session.totalCartShipping = domesticShippingAmount;
        req.session.totalCartAmount = amount + domesticShippingAmount;
        return;
    }

    // Check for international
    if (req.session.customerCountry.toLowerCase() !== shippingFromCountry.toLowerCase()) {
        req.session.shippingMessage = 'International shipping';
        req.session.totalCartShipping = internationalShippingAmount;
        req.session.totalCartAmount = amount + internationalShippingAmount;
        return;
    }

    // Domestic shipping
    req.session.shippingMessage = 'Domestic shipping';
    req.session.totalCartShipping = domesticShippingAmount;
    req.session.totalCartAmount = amount + domesticShippingAmount;
};

module.exports = {
    calculateShipping
};
