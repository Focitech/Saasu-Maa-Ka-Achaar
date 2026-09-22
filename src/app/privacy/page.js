import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: "Privacy Policy | Saasu Maa's Food (सासू माँ का अचार)",
  description: "Privacy policy explaining how Saasu Maa's Food collects, safeguards, and processes customer information in compliance with Indian data protection laws.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we respect, safeguard, and handle your personal information and order records"
      activeTab="privacy"
    >
      <section className="legal-section">
        <h2>1. Commitment to Customer Privacy</h2>
        <p>
          At <strong>Saasu Maa&apos;s Food</strong> (<em>सासू माँ का अचार</em>, Bareilly, UP), we value the trust you place in us when sharing your contact and delivery details.
          This Privacy Policy outlines our transparent practices regarding data collection, use, protection, and retention in accordance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Information We Collect</h2>
        <p>
          We only collect data strictly necessary to fulfill your orders, provide account security, and communicate delivery milestones:
        </p>
        <ul className="legal-list">
          <li><strong>Contact Identifiers:</strong> Your full name, telephone / WhatsApp mobile number, and email address.</li>
          <li><strong>Delivery Address:</strong> Complete delivery address including street name, landmark, locality, city, state, and postal pincode.</li>
          <li><strong>Authentication Credentials:</strong> Secure, cryptographically hashed passwords (using salted <code>scrypt</code>) or temporary 6-digit email OTPs. Plaintext passwords are never visible or stored in our database.</li>
          <li><strong>Order &amp; Transaction Details:</strong> Item selections, pickle jar sizes (250g, 500g, 1kg), total amounts, payment methods, transaction timestamps, and unique order reference IDs.</li>
          <li><strong>Technical Metadata:</strong> IP address, device browser type, and anonymous session cookies to keep your shopping basket active and prevent CSRF attacks.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. How We Use Your Information</h2>
        <p>Your information is utilized solely for lawful commerce and customer fulfillment:</p>
        <ul className="legal-list">
          <li><strong>Order Dispatch &amp; Doorstep Delivery:</strong> Sharing your delivery address and phone number with courier logistics partners to deliver your pickles safely.</li>
          <li><strong>Real-time Order Updates:</strong> Sending order confirmations, parcel dispatch tracking links, and delivery notices via WhatsApp and email.</li>
          <li><strong>Security &amp; Fraud Prevention:</strong> Validating login sessions, preventing duplicate charges via idempotency checks, and protecting customer accounts.</li>
          <li><strong>Customer Concierge:</strong> Resolving customer inquiries, feedback, and special packaging requests.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Zero Third-Party Data Selling</h2>
        <div className="legal-highlight-box">
          <p>
            <strong>Our Strict Guarantee:</strong> Saasu Maa&apos;s Food <strong>NEVER</strong> sells, trades, rents, or licenses your personal information, mobile numbers, or email addresses to third-party telemarketers or external advertising networks.
          </p>
        </div>
      </section>

      <section className="legal-section">
        <h2>5. Essential Service Partners</h2>
        <p>
          We partner exclusively with verified infrastructure providers who adhere to strict data security standards:
        </p>
        <ul className="legal-list">
          <li><strong>Supabase:</strong> Encrypted PostgreSQL cloud database hosted with enterprise-grade Row Level Security (RLS).</li>
          <li><strong>Resend:</strong> Secure transactional email delivery service used exclusively for dispatching 6-digit authentication codes.</li>
          <li><strong>Cloudinary:</strong> Content delivery network used to optimize and serve high-resolution product photography.</li>
          <li><strong>National Courier Partners:</strong> Trusted logistics services (e.g. India Post, Delhivery, BlueDart, DTDC) provided only with necessary delivery information.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Cookies &amp; Local Storage</h2>
        <p>
          Our web application utilizes minimal, privacy-respecting cookies:
        </p>
        <ul className="legal-list">
          <li><code>sasumaa_auth_session</code>: An HTTP-only, secure, SameSite cookie used solely to authenticate signed-in customers and store owners.</li>
          <li><strong>Local Storage:</strong> Temporary browser cache to maintain your selected pickle jar sizes and quantities in the cart before checkout.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>7. Your Privacy Rights</h2>
        <p>
          Under Indian data protection laws, you possess full rights regarding your personal records:
        </p>
        <ul className="legal-list">
          <li><strong>Right to Access:</strong> You may view your stored account details anytime by visiting your <a href="/account" style={{ color: 'var(--gold-accent)' }}>/account</a> dashboard.</li>
          <li><strong>Right to Rectification:</strong> You can update incorrect contact details or addresses by contacting support.</li>
          <li><strong>Right to Erasure:</strong> You can request complete deletion of your account and personal records by emailing our team.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>8. Data Protection Officer &amp; Grievance Redressal</h2>
        <p>
          In accordance with the Information Technology Act and DPDP Act 2023, questions or grievances regarding your privacy may be directed to our designated grievance officer:
        </p>
        <div className="legal-contact-grid">
          <div className="legal-contact-item">
            <strong>Grievance Officer</strong>
            <span>Ayush Sharma / Sandhya</span>
          </div>
          <div className="legal-contact-item">
            <strong>Privacy Email</strong>
            <a href="mailto:support@saasumaasfood.site">support@saasumaasfood.site</a>
          </div>
          <div className="legal-contact-item">
            <strong>Help Desk</strong>
            <a href="mailto:help@saasumaasfood.site">help@saasumaasfood.site</a>
          </div>
          <div className="legal-contact-item">
            <strong>Direct Phone</strong>
            <a href="tel:8979319003">+91 8979319003</a>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
