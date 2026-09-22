import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: "Terms & Conditions | Saasu Maa's Food (सासू माँ का अचार)",
  description: "Terms and conditions governing order placement, pricing, payment, food safety, and customer services for Saasu Maa's Food, Bareilly, Uttar Pradesh.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Official terms governing orders, pricing, food standards, and customer agreements"
      activeTab="terms"
    >
      <section className="legal-section">
        <h2>1. Agreement to Terms</h2>
        <p>
          Welcome to <strong>Saasu Maa&apos;s Food</strong> (operated as <em>सासू माँ का अचार</em>, headquartered in Bareilly, Uttar Pradesh, India).
          By browsing our website (<strong>saasumaasfood.site</strong>), placing orders via our digital storefront, calling our concierge line, or ordering through WhatsApp (<strong>+91 8979319003</strong>),
          you agree to be bound by these Terms &amp; Conditions, our Privacy Policy, and our Refund &amp; Cancellation Policy.
        </p>
        <p>
          If you do not agree with any part of these terms, please refrain from using our website or placing orders through our services.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Authentic Homemade Pickles &amp; Product Characteristics</h2>
        <p>
          All pickles prepared and sold by Saasu Maa&apos;s Food are genuine artisanal homemade products prepared using traditional Indian recipes:
        </p>
        <ul className="legal-list">
          <li><strong>Pure Ingredients:</strong> Prepared in authentic wood-pressed mustard oil (कच्ची घानी सरसों का तेल), whole sun-dried spices, and zero synthetic preservatives or artificial food coloring.</li>
          <li><strong>Handcrafted Batches:</strong> Because our pickles are handcrafted in seasonal batches, slight natural variations in oil color, spice consistency, and texture may occur between seasons and batches. Such natural variations are characteristic of authentic homemade foods.</li>
          <li><strong>Packaging Sizes:</strong> Standard weights offered include <strong>250g</strong>, <strong>500g</strong>, and <strong>1kg</strong> food-grade sealed jars.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Pricing, Ordering &amp; Acceptance</h2>
        <p>
          All product prices listed on our website and official rate card are in <strong>Indian Rupees (INR ₹)</strong>.
        </p>
        <ul className="legal-list">
          <li><strong>Order Placement:</strong> Orders may be placed online via our website cart or directly via official WhatsApp and phone channels.</li>
          <li><strong>Order Confirmation:</strong> An order reference ID (e.g. <code>SM-XXXXXX</code>) is issued upon successful submission. A binding sales agreement is created once our kitchen team confirms product availability and initiates dispatch.</li>
          <li><strong>Order Modifications:</strong> Requests for address updates or item additions must be communicated via WhatsApp within 2 hours of placing the order.</li>
          <li><strong>Right to Refuse:</strong> We reserve the right to decline or cancel any order in the rare event of product unavailability, unserviceable courier pincodes, or pricing discrepancies caused by technical errors.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Payment Methods &amp; Idempotency Security</h2>
        <p>
          We offer secure payment channels for customer convenience:
        </p>
        <ul className="legal-list">
          <li><strong>Online &amp; UPI Payments:</strong> Instant verification via UPI apps (Google Pay, PhonePe, Paytm, BHIM) and authorized payment gateways.</li>
          <li><strong>Cash on Delivery (COD):</strong> Available for select pincodes and verified telephone orders.</li>
          <li><strong>Duplicate Transaction Protection:</strong> Our backend utilizes cryptographic idempotency keys to ensure customers are never charged twice for the same order reference.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Food Safety, Hygiene &amp; Storage Guidelines</h2>
        <div className="legal-highlight-box">
          <p>
            <strong>Storage Warning:</strong> To maintain freshness and longevity, always use a clean, dry spoon.
            Ensure the pickle remains immersed under a thin layer of pure mustard oil. Keep the jar tightly capped in a cool, dry place away from direct moisture.
          </p>
        </div>
        <p>
          Saasu Maa&apos;s Food adheres strictly to hygienic food handling and safe food-grade packaging standards. Once the jar seal is broken by the customer, shelf life depends on proper storage and moisture-free handling.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Intellectual Property</h2>
        <p>
          The brand name <strong>Saasu Maa&apos;s Food</strong>, the Hindi trademark <strong>सासू माँ का अचार</strong>, our logo artwork, jar labels, website copy, photographic creatives, and recipes are the exclusive intellectual property of Saasu Maa&apos;s Food. Unauthorized copying, commercial reproduction, or misrepresentation is strictly prohibited under Indian copyright and trademark laws.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Limitation of Liability</h2>
        <p>
          While we take immense care in selecting prime fruits, spices, and packaging, Saasu Maa&apos;s Food shall not be held liable for any indirect, incidental, or consequential damages resulting from customer storage negligence, allergic reactions to natural spices (such as mustard, garlic, or fenugreek), or courier transit delays beyond our reasonable control.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Governing Law &amp; Jurisdiction</h2>
        <p>
          These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, grievance, or claim arising out of these terms shall fall under the exclusive jurisdiction of the competent courts located in <strong>Bareilly, Uttar Pradesh, India</strong>.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Contact &amp; Grievance Redressal</h2>
        <p>
          For any questions regarding these Terms &amp; Conditions, please reach out to our team:
        </p>
        <div className="legal-contact-grid">
          <div className="legal-contact-item">
            <strong>Headquarters</strong>
            <span>Bareilly, Uttar Pradesh, India</span>
          </div>
          <div className="legal-contact-item">
            <strong>Customer Support</strong>
            <a href="mailto:support@saasumaasfood.site">support@saasumaasfood.site</a>
          </div>
          <div className="legal-contact-item">
            <strong>Order Inquiries</strong>
            <a href="mailto:query@saasumaasfood.site">query@saasumaasfood.site</a>
          </div>
          <div className="legal-contact-item">
            <strong>Phone / WhatsApp</strong>
            <a href="tel:8979319003">+91 8979319003</a>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
