export default function PrivacyPolicy() {
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
      <h1>Privacy Policy</h1>
      <p style={{ opacity: 0.7 }}>Last updated: August 3, 2026</p>

      <p>
        This policy explains what information Doosetrain collects, why, and how
        it's used. We collect only what's needed to run the store and
        communicate with you.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>
          <strong>Account information</strong> — email address and, if provided,
          name, when you create an account or sign in.
        </li>
        <li>
          <strong>Order information</strong> — shipping address, contact email,
          and order contents, needed to fulfill and communicate about your
          purchase.
        </li>
        <li>
          <strong>Payment information</strong> — handled entirely by Stripe. We
          never see or store your full card number.
        </li>
        <li>
          <strong>Chat messages</strong> — messages you post in the showroom
          chat are public and stored to display the chat feature.
        </li>
        <li>
          <strong>Email subscription</strong> — if you sign up for stream
          notifications, we store your email address for that sole purpose.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>
          Process and fulfill your orders, including calculating shipping and
          applicable sales tax
        </li>
        <li>Send order confirmations and status updates (e.g. shipped)</li>
        <li>Notify you when you've opted in to stream-live alerts</li>
        <li>Operate and moderate the public chat feature</li>
        <li>Respond to support requests</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2>3. Who we share information with</h2>
      <p>
        We share limited information with the following service providers, only
        as needed to operate the store:
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> — payment processing
        </li>
        <li>
          <strong>Firebase (Google)</strong> — account authentication, database,
          and file storage
        </li>
        <li>
          <strong>Printful</strong> (or similar print-on-demand partner) — your
          shipping address, for merchandise orders they fulfill directly
        </li>
        <li>
          <strong>Resend</strong> (or similar email service) — sending order and
          stream-notification emails
        </li>
      </ul>
      <p>
        These providers only receive the information necessary to perform their
        specific function and are not permitted to use it for other purposes.
      </p>

      <h2>4. Data retention</h2>
      <p>
        We retain order records as needed for tax, accounting, and legal
        purposes. You may request deletion of your account and associated
        personal data at any time, subject to records we're legally required to
        keep (such as sales tax records).
      </p>

      <h2>5. Your choices</h2>
      <ul>
        <li>
          You can unsubscribe from stream-live emails at any time by contacting
          us.
        </li>
        <li>
          You can request a copy of, correction to, or deletion of your personal
          data by contacting us.
        </li>
      </ul>

      <h2>6. Security</h2>
      <p>
        We use industry-standard providers (Firebase, Stripe) that maintain
        their own security certifications. No online service can guarantee
        absolute security, but we take reasonable steps to protect your
        information, including restricting who can access order and customer
        data.
      </p>

      <h2>7. Children's privacy</h2>
      <p>
        This site is not directed at children under 13, and we do not knowingly
        collect personal information from children under 13.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes
        will be reflected by updating the "Last updated" date above.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this policy, or want to exercise a data request? Contact
        us at doosetrain@gmail.com.
      </p>
    </div>
  );
}
