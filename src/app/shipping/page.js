import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: "Shipping & Delivery Policy | Saasu Maa's Food (सासू माँ का अचार)",
  description: "Shipping timelines, Bareilly local delivery, packaging safety standards, and pan-India courier coverage for Saasu Maa's Food homemade pickles.",
};

export default function ShippingPage() {
  return (
    <LegalLayout
      title="Shipping & Delivery Policy"
      subtitle="Estimated transit timelines, packaging safety standards, and delivery coverage across India"
      activeTab="shipping"
    >
      <section className="legal-section">
        <h2>1. Fresh Batch Preparation &amp; Packaging Standard</h2>
        <p>
          Unlike commercial factory pickles that sit on supermarket shelves for months, pickles from <strong>Saasu Maa&apos;s Food</strong> are prepared fresh in authentic wood-pressed mustard oil with whole sun-dried spices.
        </p>
        <div className="legal-highlight-box">
          <p>
            <strong>Triple-Layer Protective Packaging:</strong> Every jar is sealed with an airtight foil induction liner, capped securely, wrapped in multi-layered impact-resistant bubble cushioning, and packed into heavy-grade corrugated boxes to ensure 100% leak-proof transit.
          </p>
        </div>
      </section>

      <section className="legal-section">
        <h2>2. Delivery Timelines &amp; Coverage Zones</h2>
        <p>
          We ship daily from our primary kitchen facility in <strong>Bareilly, Uttar Pradesh</strong> to households across India:
        </p>
        <ul className="legal-list">
          <li><strong>Bareilly Local City:</strong> Same-day or next-day direct doorstep delivery (within 12 to 24 hours).</li>
          <li><strong>Uttar Pradesh Major Hubs:</strong> Lucknow, Kanpur, Agra, Prayagraj, Varanasi, Moradabad, Meerut, Aligarh, Rampur, and surrounding cities — delivered within <strong>2 to 3 business days</strong>.</li>
          <li><strong>Delhi NCR, Haryana, Punjab &amp; Rajasthan:</strong> Delivered within <strong>3 to 4 business days</strong>.</li>
          <li><strong>Rest of India (Metro &amp; Tier-1/2 Cities):</strong> Mumbai, Bengaluru, Kolkata, Hyderabad, Pune, Ahmedabad, Chennai, etc. — delivered within <strong>4 to 6 business days</strong>.</li>
          <li><strong>Remote &amp; North-East / Island Pincodes:</strong> 6 to 8 business days depending on regional logistics connectivity.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Order Dispatch &amp; Live Tracking</h2>
        <p>
          Transparency is central to our service:
        </p>
        <ul className="legal-list">
          <li><strong>Order Reference:</strong> You immediately receive an order code (e.g. <code>SM-XXXXXX</code>) upon order confirmation.</li>
          <li><strong>Courier Tracking:</strong> Once your package is scanned at the logistics hub, an automated tracking link is shared with you via WhatsApp and email.</li>
          <li><strong>Dispatch Window:</strong> Orders placed before 1:00 PM are typically packed and dispatched the very same business day. Orders placed after 1:00 PM or on Sundays are dispatched the next business morning.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Shipping Charges &amp; Free Delivery Promotions</h2>
        <p>
          Shipping rates are calculated fairly based on package weight (250g, 500g, 1kg jars) and delivery distance:
        </p>
        <ul className="legal-list">
          <li>Standard shipping rates are displayed transparently in your cart summary prior to final confirmation.</li>
          <li>Special promotional offers (e.g., Free Shipping on orders above a specified threshold or multi-jar festive bundles) are highlighted on the main storefront.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Delivery Protocol &amp; Customer Availability</h2>
        <p>
          To ensure smooth package handover:
        </p>
        <ul className="legal-list">
          <li>Courier delivery agents make up to <strong>3 delivery attempts</strong> before returning a parcel.</li>
          <li>An OTP or delivery call is made to your registered mobile number prior to doorstep delivery.</li>
          <li>If you are temporarily away from your residence, please inform the courier executive or our WhatsApp support team to schedule delivery for an alternate time slot.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Delivery Support &amp; Concierge</h2>
        <p>
          Need urgent tracking updates or express dispatch for a wedding, family function, or festival? Contact us directly:
        </p>
        <div className="legal-contact-grid">
          <div className="legal-contact-item">
            <strong>Dispatch Kitchen</strong>
            <span>Bareilly, Uttar Pradesh, India</span>
          </div>
          <div className="legal-contact-item">
            <strong>Live Delivery Help</strong>
            <a href="https://wa.me/918979319003" target="_blank" rel="noopener noreferrer">+91 8979319003</a>
          </div>
          <div className="legal-contact-item">
            <strong>Logistics Email</strong>
            <a href="mailto:support@saasumaasfood.site">support@saasumaasfood.site</a>
          </div>
          <div className="legal-contact-item">
            <strong>General Queries</strong>
            <a href="mailto:query@saasumaasfood.site">query@saasumaasfood.site</a>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
