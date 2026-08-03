import { Link } from "react-router-dom";
export default function TermsOfService() {
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
      <h1>Terms of Service</h1>
      <p style={{ opacity: 0.7 }}>Last updated: August 3, 2026</p>

      <p>
        Welcome to Doosetrain ("we," "us," "our"). By accessing or using this
        site, including browsing the shop, purchasing artwork or merchandise, or
        participating in the live chat, you agree to these Terms of Service.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Doosetrain is operated by James A. Doss, a sole proprietor based in
        Texas, USA. Original paintings, prints, and merchandise sold on this
        site are created and/or fulfilled by us or by our print-on-demand
        partners (see Section 4).
      </p>

      <h2>2. Products</h2>
      <p>We offer three general categories of products:</p>
      <ul>
        <li>
          <strong>Original artwork</strong> — one-of-a-kind physical paintings.
        </li>
        <li>
          <strong>Prints</strong> — reproductions of original artwork, produced
          either by us in limited runs or through a print-on-demand partner.
        </li>
        <li>
          <strong>Merchandise</strong> — apparel, stickers, and similar items
          produced through a print-on-demand partner.
        </li>
      </ul>
      <p>
        Product descriptions, images, and pricing are accurate to the best of
        our knowledge but are not guaranteed to be error-free. We reserve the
        right to correct pricing or availability errors, including after an
        order is placed, and will contact you before completing an order
        affected by such an error.
      </p>

      <h2>3. Orders &amp; payment</h2>
      <p>
        Payments are processed securely through Stripe. We do not store your
        full payment card details on our servers. Sales tax is calculated and
        collected where legally required. By placing an order, you confirm that
        the payment information provided is accurate and that you are authorized
        to use the payment method.
      </p>

      <h2>4. Shipping</h2>
      <p>
        We currently ship to addresses within the United States only. Shipping
        costs are calculated at checkout based on your order. Estimated delivery
        times are provided where available but are not guaranteed, as they
        depend on carriers outside our control.
      </p>
      <p>
        Some merchandise items are fulfilled through a print-on-demand partner
        (such as Printful). These items may ship separately from original
        artwork or other items in the same order, and may be subject to the
        partner's own production and shipping timelines.
      </p>

      <h2>5. Returns &amp; refunds</h2>
      <p>
        See our <Link to="/refund-policy">Refund &amp; Return Policy</Link> for
        full details, as return terms differ between original artwork, prints,
        and print-on-demand merchandise.
      </p>

      <h2>6. Chat &amp; community conduct</h2>
      <p>
        Our showroom chat is a public space. You agree not to post content that
        is unlawful, harassing, hateful, or infringes on others' rights. We
        reserve the right to remove content or restrict access for violations of
        this policy.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        All artwork, images, and site content are the property of Doosetrain
        unless otherwise noted, and are protected by copyright. Purchasing a
        physical piece of art or a print does not transfer reproduction rights —
        you may not reproduce, distribute, or create derivative works from
        purchased artwork without our written permission.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Doosetrain is not liable for
        indirect, incidental, or consequential damages arising from your use of
        this site or your purchase of any product.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these Terms of Service from time to time. Continued use of
        the site after changes are posted constitutes acceptance of the updated
        terms.
      </p>

      <h2>10. Contact</h2>
      <p>Questions about these terms? Contact us at doosetrain@gmail.com.</p>
    </div>
  );
}
