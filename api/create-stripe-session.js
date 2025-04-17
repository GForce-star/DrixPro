const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, plan } = req.body;

    const planPrices = {
        Basic: 1900,
        Standard: 4900,
        Premium: 9900
    };

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${plan} Plan Subscription`,
                        },
                        unit_amount: planPrices[plan],
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://drix-pro.vercel.app//success",
            cancel_url: "https://drix-pro.vercel.app//cancel",
            metadata: {
                name,
                plan,
            },
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ error: "Unable to create Stripe session" });
    }
}
