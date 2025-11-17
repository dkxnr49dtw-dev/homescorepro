const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/auth');
const { User, Subscription } = require('../database/models');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get current subscription
router.get('/current', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    if (!subscription) {
      return res.json({ 
        subscription: null,
        tier: 'free',
        status: 'inactive'
      });
    }

    // Get latest subscription data from Stripe
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
      
      // Update local subscription data
      await subscription.update({
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end
      });

      // Update user subscription tier
      const user = await User.findByPk(req.user.id);
      if (stripeSubscription.status === 'active') {
        await user.update({
          subscription_tier: subscription.plan,
          subscription_status: 'active'
        });
      }
    } catch (error) {
      console.error('Error fetching Stripe subscription:', error);
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { 
        user_id: req.user.id,
        status: 'active'
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel at period end in Stripe
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true }
    );

    await subscription.update({
      cancel_at_period_end: true
    });

    res.json({ 
      message: 'Subscription will be canceled at the end of the billing period',
      subscription: canceledSubscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Reactivate subscription
router.post('/reactivate', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { 
        user_id: req.user.id,
        cancel_at_period_end: true
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found to reactivate' });
    }

    // Reactivate in Stripe
    const reactivatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: false }
    );

    await subscription.update({
      cancel_at_period_end: false
    });

    res.json({ 
      message: 'Subscription reactivated',
      subscription: reactivatedSubscription
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

// Update payment method
router.put('/payment-method', async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID is required' });
    }

    const subscription = await Subscription.findOne({
      where: { user_id: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    // Update default payment method in Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      default_payment_method: paymentMethodId
    });

    res.json({ message: 'Payment method updated successfully' });
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
});

module.exports = router;


