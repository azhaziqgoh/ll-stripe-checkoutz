import Stripe from 'stripe';
import { IItem } from '../../interface';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27"
});


const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      const { checkout_session_data } = req.body;

      const line_items = checkout_session_data.map((item: IItem) => {
        return {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: item.price.id,
          quantity: 1,
        }
      })

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        line_items,
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      
      res.status(200).json(session);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;