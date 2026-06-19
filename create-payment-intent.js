/* =============================================
   VELOURX — create-payment-intent.js
   Netlify Serverless Function
   This runs on Netlify's server, NEVER in the browser.
   It uses your Stripe SECRET key to securely create a charge.

   ⚠️ SETUP REQUIRED:
   1. In your Netlify site dashboard, go to:
      Site configuration → Environment variables
   2. Add a new variable:
      Key:   STRIPE_SECRET_KEY
      Value: sk_test_... (your Stripe secret key)
   3. Redeploy your site after adding it.

   This function is automatically available at:
   /.netlify/functions/create-payment-intent
   ============================================= */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, currency, email } = JSON.parse(event.body);

    // Basic validation
    if (!amount || amount < 50) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,                 // amount in cents
      currency: currency || 'usd',
      receipt_email: email || undefined,
      automatic_payment_methods: { enabled: true },
      metadata: {
        store: 'VELOURX',
        order_source: 'website_checkout'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret
      })
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

