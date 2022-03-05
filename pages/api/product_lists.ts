import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27"
});

const handler = async (req: any, res: any) => {
  if (req.method === 'GET') {
    try {
      // Return all products list in Stripe Dashboard
      const productLists = await stripe.products.list();

      res.status(200).json(productLists);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;
