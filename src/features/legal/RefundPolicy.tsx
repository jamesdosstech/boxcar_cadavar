export default function RefundPolicy() {
  return (
    <div
      style={{
        padding: "2rem",
        color: "white",
        maxWidth: 760,
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      <h1>Refund &amp; Return Policy</h1>
      <p style={{ opacity: 0.7 }}>Last updated: August 3, 2026</p>

      <p>
        Because we sell three different kinds of products, this policy is split
        by product type. Your order confirmation email will tell you which
        category each item falls under if you're unsure.
      </p>

      <h2>1. Original artwork</h2>
      <p>
        Original paintings are one-of-a-kind.{" "}
        <strong>All sales of original artwork are final</strong> — we do not
        accept returns or offer refunds for change of mind. If your piece
        arrives damaged in transit, see Section 4 below.
      </p>

      <h2>2. Prints (sold and shipped by us directly)</h2>
      <p>
        For prints we produce and ship ourselves (not through a print-on-demand
        partner), we accept returns within 14 days of delivery if the print is
        unused and in its original packaging. To start a return, contact us at
        doosetrain@gmail.com with your order number. Return shipping costs are
        the buyer's responsibility unless the item arrived damaged or defective.
      </p>

      <h2>
        3. Merchandise &amp; prints fulfilled by a print-on-demand partner
      </h2>
      <p>
        Items such as shirts, stickers, and some posters are produced and
        shipped by our print-on-demand partner (currently Printful) only after
        you order — nothing is pre-made or held in stock. Because each item is
        produced specifically for you:
      </p>
      <ul>
        <li>We're unable to accept returns for size/preference changes.</li>
        <li>
          If an item arrives damaged, misprinted, or defective, contact us
          within 30 days of delivery with photos of the issue, and we'll arrange
          a replacement or refund through our partner at no cost to you.
        </li>
      </ul>

      <h2>4. Damaged in transit (all product types)</h2>
      <p>
        If any item — original, print, or merchandise — arrives visibly damaged
        from shipping, contact us within 7 days of delivery with photos of the
        damage and packaging. We'll work with you on a repair, replacement, or
        refund depending on the situation and the extent of the damage.
      </p>

      <h2>5. Order cancellations</h2>
      <p>
        Original artwork orders can be cancelled for a full refund only if the
        order hasn't yet shipped. Once an order has shipped, standard return
        terms for that product type apply.
      </p>

      <h2>6. How refunds are issued</h2>
      <p>
        Approved refunds are issued to your original payment method through
        Stripe. Please allow 5–10 business days for the refund to appear,
        depending on your bank or card issuer.
      </p>

      <h2>7. Questions</h2>
      <p>
        Not sure which category your item falls under, or have a situation not
        covered above? Contact us at doosetrain@gmail.com with your order number
        and we'll sort it out.
      </p>
    </div>
  );
}
