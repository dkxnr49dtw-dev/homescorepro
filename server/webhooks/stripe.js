const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User, Subscription, Payment } = require('../database/models');

const router = express.Router();

// Stripe webhook endpoint (raw body already parsed by app.js)
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  const [dbSubscription, created] = await Subscription.findOrCreate({
    where: { stripe_subscription_id: subscription.id },
    defaults: {
      user_id: parseInt(userId),
      stripe_customer_id: subscription.customer,
      plan: subscription.metadata?.plan || 'starter',
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end
    }
  });

  if (!created) {
    await dbSubscription.update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end
    });
  }

  // Update user subscription tier
  const user = await User.findByPk(userId);
  if (user && subscription.status === 'active') {
    await user.update({
      subscription_tier: dbSubscription.plan,
      subscription_status: 'active'
    });
  }
}

async function handleSubscriptionDeleted(subscription) {
  const dbSubscription = await Subscription.findOne({
    where: { stripe_subscription_id: subscription.id }
  });

  if (dbSubscription) {
    await dbSubscription.update({ status: 'canceled' });

    // Update user to free tier
    const user = await User.findByPk(dbSubscription.user_id);
    if (user) {
      await user.update({
        subscription_tier: 'free',
        subscription_status: 'inactive'
      });
    }
  }
}

async function handlePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await Subscription.findOne({
    where: { stripe_subscription_id: subscriptionId }
  });

  if (subscription) {
    await Payment.create({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency.toUpperCase(),
      status: 'succeeded',
      payment_method: invoice.payment_method_types[0]
    });
  }
}

async function handlePaymentFailed(invoice) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await Subscription.findOne({
    where: { stripe_subscription_id: subscriptionId }
  });

  if (subscription) {
    await Payment.create({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_due / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'failed',
      payment_method: invoice.payment_method_types[0]
    });
  }
}

module.exports = router;

