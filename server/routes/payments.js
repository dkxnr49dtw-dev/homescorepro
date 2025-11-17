const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/auth');
const { User, Subscription } = require('../database/models');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create payment intent for subscription
router.post('/create-intent', async (req, res) => {
  try {
    const { plan, priceId } = req.body;

    if (!plan || !priceId) {
      return res.status(400).json({ error: 'Plan and price ID are required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id.toString()
        }
      });
      customerId = customer.id;
      await user.update({ stripe_customer_id: customerId });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user.id.toString(),
        plan: plan
      }
    });

    // Save subscription to database
    await Subscription.create({
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      plan: plan,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    });

    res.json({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Get payment methods
router.get('/payment-methods', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.stripe_customer_id) {
      return res.json({ paymentMethods: [] });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripe_customer_id,
      type: 'card'
    });

    res.json({ paymentMethods: paymentMethods.data });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to get payment methods' });
  }
});

// Get payment history
router.get('/history', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.stripe_customer_id) {
      return res.json({ payments: [] });
    }

    const charges = await stripe.charges.list({
      customer: user.stripe_customer_id,
      limit: 50
    });

    res.json({ payments: charges.data });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

module.exports = router;


