import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/sixtel/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using Sixtel Rewards and this site (draft placeholder).",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalSection heading="Acceptance of Terms">
        <p>
          By using the Sixtel Rewards program and this site, you agree to these
          terms.
        </p>
      </LegalSection>

      <LegalSection heading="Eligibility">
        <p>
          You must be 21 years of age or older to join Sixtel Rewards,
          consistent with Alabama law for businesses that sell alcohol.
        </p>
      </LegalSection>

      <LegalSection heading="The Rewards Program">
        <p>
          Points and rewards are tracked through our point-of-sale system.
          Program details, earning rates, and rewards may change over time.
        </p>
      </LegalSection>

      <LegalSection heading="Text Messaging">
        <p>
          Enrollment in SMS marketing is optional and requires your explicit
          consent. Reply STOP to opt out; message and data rates may apply.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable Use">
        <p>
          Please do not misuse the site or attempt to interfere with its normal
          operation.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to These Terms">
        <p>
          We may update these terms from time to time. Continued use of the
          program means you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of Liability">
        <p>
          The program and this site are provided on an &ldquo;as is&rdquo; basis
          to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Reach us in Enterprise, Alabama, or through the links in the footer.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
