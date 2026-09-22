import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: "Refund, Return & Cancellation Policy | Saasu Maa's Food (सासू माँ का अचार)",
  description: "Official refund, return, and order cancellation policy for homemade pickles, damaged jar replacements, and reimbursement timelines at Saasu Maa's Food.",
};

export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear, fair terms regarding food safety, damaged transit replacements, and order cancellations"
      activeTab="refund"
    >
      <section className="legal-section">
        <h2>1. Food Safety &amp; Perishable Item Policy</h2>
        <p>
          At <strong>Saasu Maa&apos;s Food</strong>, we prioritize the health, hygiene, and safety of every customer.
          Because Indian homemade pickles (<em>अचार</em>) are edible, perishable food products prepared without chemical preservatives:
        </p>
        <div className="legal-highlight-box">
          <p>
            <strong>Hygiene Rule:</strong> For health and food safety reasons under the <em>Food Safety and Standards Act (FSSAI)</em> and <em>Consumer Protection (E-Commerce) Rules, 2020</em>,
            <strong> opened or unsealed pickle jars cannot be returned or restocked once delivered</strong>.
          </p>
        </div>
      </section>

      <section className="legal-section">
        <h2>2. 100% Transit Damage &amp; Leakage Guarantee</h2>
        <p>
          We pack our jars with heavy industrial bubble cushioning and tamper-proof seals. However, if your package experiences rough handling during courier transit and arrives damaged:
        </p>
        <ul className="legal-list">
          <li><strong>What We Cover:</strong> Broken glass/PET jars, leaked inner seals, missing items, or delivery of an incorrect pickle variety.</li>
          <li><strong>Your Remedy:</strong> We will immediately provide either a <strong>100% Free Replacement Parcel</strong> dispatched via express courier, or a <strong>Full Refund</strong> of the purchase amount.</li>
          <li><strong>How to Claim (Within 48 Hours):</strong> Please take clear photos or a short video showing the courier outer box label and the damaged/leaked jar, and send it to our team via WhatsApp (<strong>+91 8979319003</strong>) or email (<strong>support@saasumaasfood.site</strong>).</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Order Cancellation Terms</h2>
        <p>
          We understand circumstances can change. We offer flexible cancellation before parcel handover:
        </p>
        <ul className="legal-list">
          <li><strong>Before Dispatch (Free Cancellation):</strong> Orders can be cancelled with a 100% refund if requested within <strong>2 to 4 hours</strong> of placement, or prior to parcel handover to our courier logistics partner.</li>
          <li><strong>After Dispatch:</strong> Once your order has been packaged, assigned a tracking number, and handed to the courier partner, cancellations cannot be processed mid-transit.</li>
          <li><strong>How to Cancel:</strong> Call or WhatsApp our concierge immediately at <strong>+91 8979319003</strong> with your Order Reference ID (e.g. <code>SM-XXXXXX</code>).</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Refund Modes &amp; Bank Timelines</h2>
        <p>
          Once your refund request is approved by our team:
        </p>
        <ul className="legal-list">
          <li><strong>Approval Time:</strong> Verification and refund initiation take place within <strong>24 hours</strong> of receiving your damage evidence.</li>
          <li><strong>UPI / Google Pay / PhonePe:</strong> Credited back to your UPI linked bank account within <strong>24 to 48 hours</strong>.</li>
          <li><strong>Credit / Debit Cards &amp; Net Banking:</strong> Reflected in your bank statement within <strong>5 to 7 business days</strong> as per standard RBI banking clearing cycles.</li>
          <li><strong>Cash on Delivery (COD) Orders:</strong> In case of COD issues, refunds are transferred directly via UPI or IMPS bank transfer upon customer account details confirmation.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Undelivered Packages &amp; Wrong Address</h2>
        <p>
          Customers are responsible for providing complete, accurate street addresses and functioning mobile numbers:
        </p>
        <ul className="legal-list">
          <li>If a delivery attempt fails due to customer unavailability, incorrect door number, or repeated unresponsiveness to courier calls, the package may return to our kitchen.</li>
          <li>Re-dispatch charges may apply if re-shipping is requested following an incorrect address submission.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Contact For Refund Assistance</h2>
        <p>
          Our family kitchen team is dedicated to your complete satisfaction:
        </p>
        <div className="legal-contact-grid">
          <div className="legal-contact-item">
            <strong>WhatsApp Concierge (Fastest)</strong>
            <a href="https://wa.me/918979319003" target="_blank" rel="noopener noreferrer">+91 8979319003</a>
          </div>
          <div className="legal-contact-item">
            <strong>Refund Support Email</strong>
            <a href="mailto:support@saasumaasfood.site">support@saasumaasfood.site</a>
          </div>
          <div className="legal-contact-item">
            <strong>Help Desk</strong>
            <a href="mailto:help@saasumaasfood.site">help@saasumaasfood.site</a>
          </div>
          <div className="legal-contact-item">
            <strong>Kitchen Location</strong>
            <span>Bareilly, Uttar Pradesh, India</span>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
