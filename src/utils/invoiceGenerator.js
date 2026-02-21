import logoicon from "./Images/logo.svg";

export async function generateOrderInvoice(order) {
    console.log(order);
    const logoBase64 = await toBase64(logoicon);

    function toBase64(url) {
        return fetch(url)
            .then((res) => res.blob())
            .then(
                (blob) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
            );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const itemsHTML = order.items && order.items.length > 0 && order.items
        .map(
            (item) => `
        <tr>
          <td>${item.productId?.name||""}</td>
          <td>${item.quantity ||"" }</td>
          <td>₹${item.price ||"" }</td>
          <td><strong>₹${(item?.quantity||0) * (item?.price||0) ||""}</strong></td>
        </tr>
      `
        )
        .join("")||"";

    const invoiceHTML = `
    <html>
      <head>
        <title>Invoice - ${order._id}</title>

        <style>
          body {
            margin: 0;
            font-family: "Poppins", sans-serif;
            background: #f1f1f1;
          }

          .invoice-box {
            width: 800px;
            margin: 20px auto;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, #fb9c2fff, #7052FF);
            color: white;
            padding: 25px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-left h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 600;
          }

          .header-left p {
            margin: 5px 0 0 0;
            font-size: 14px;
          }

          .header img {
            height: 70px;
          }

          /* Section */
          .section {
            padding: 30px 40px;
            border-bottom: 1px solid #eee;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #fb9c2fff;
            margin-bottom: 10px;
          }

          .info p {
            margin: 5px 0;
            font-size: 14px;
            color: #333;
          }

          /* Table */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 14px;
          }

          th {
            background: #fb9c2fff;
            color: white;
            padding: 10px;
            text-align: left;
          }

          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }

          /* Total Box */
          .total-box {
            margin-top: 20px;
            font-size: 16px;
            text-align: right;
          }

          .total-box p {
            margin: 4px 0;
          }

          .total-box strong {
            font-size: 18px;
            color: #fb9c2fff;
          }

          /* Footer */
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
          }

          @media print {
            body { background: white; }
            .invoice-box { box-shadow: none; margin: 0; width: 100%; }
          }
        </style>
      </head>

      <body>
        <div class="invoice-box">

          <!-- HEADER -->
          <div class="header">
            <div class="header-left">
              <h1>ORDER INVOICE</h1>
              <p>Order ID: ${order._id.slice(-8).toUpperCase()}</p>
              <p>Date: ${formattedDate}</p>
            </div>

            <img src="${logoBase64}" alt="Logo" />
          </div>

          <!-- CUSTOMER DETAILS -->
          <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="info">
              <p><strong>Name:</strong> ${order.userId?.name||""}</p>
              <p><strong>Email:</strong> ${order.userId?.email||""}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase()||""}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus||""}</p>
            </div>
          </div>

          <!-- SHIPPING ADDRESS -->
          <div class="section">
            <div class="section-title">Shipping Address</div>
            <div class="info">
              <p>${order?.shippingAddress?.fullName ||""}</p>
              <p>${order?.shippingAddress?.addressLine1 ||""}, ${order?.shippingAddress?.addressLine2 ||""}</p>
              <p>${order?.shippingAddress?.city ||""}, ${order?.shippingAddress?.state ||""}</p>
              <p>${order?.shippingAddress?.postalCode ||""}, ${order?.shippingAddress?.country ||""}</p>
              <p><strong>Mobile:</strong> ${order?.shippingAddress?.mobile ||""}</p>
            </div>
          </div>

          <!-- ORDER ITEMS -->
          <div class="section">
            <div class="section-title">Order Items</div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="total-box">
              <p>Subtotal: ₹${order?.totalAmount ||"" }</p>
              <p>Discount: ₹${order?.discount || 0 }</p>
              <p><strong>Grand Total: ₹${order?.finalAmount ||0 }</strong></p>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            Thank you for shopping with us!
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
}
