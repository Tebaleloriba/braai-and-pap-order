import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderEmailRequest {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  specialInstructions?: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerName, 
      customerPhone, 
      customerAddress, 
      specialInstructions, 
      items, 
      total,
      paymentMethod 
    }: OrderEmailRequest = await req.json();

    // Generate order items HTML
    const orderItemsHtml = items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; text-align: left;">${item.name}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">R${item.price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right;">R${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Order - Braai & Grill</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #d97706; text-align: center; margin-bottom: 30px;">🔥 New Order Received!</h1>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #374151; margin-bottom: 15px;">Customer Details</h2>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Phone:</strong> ${customerPhone}</p>
              <p><strong>Address:</strong> ${customerAddress}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
              ${specialInstructions ? `<p><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ''}
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
              <h2 style="color: #374151; margin: 0; padding: 20px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
              </table>
            </div>

            <div style="background: #d97706; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; font-size: 24px;">Order Total: R${total.toFixed(2)}</h3>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px;">
              <p style="margin: 0; text-align: center; color: #92400e;">
                <strong>🍖 Braai & Grill - Authentic South African Cuisine</strong>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Braai & Grill <onboarding@resend.dev>",
      to: ["tebaleloriba1129@gmail.com"],
      subject: `🔥 New Order from ${customerName} - R${total.toFixed(2)}`,
      html: emailHtml,
    });

    console.log("Order email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);