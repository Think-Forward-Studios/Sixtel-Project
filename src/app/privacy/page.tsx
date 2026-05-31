import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/sixtel/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sixtel Rewards collects and uses your information (draft placeholder).",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection heading="Information We Collect">
        <p>
          Sixtel Rewards collects the mobile number you provide at signup, and
          optionally your name and birthday. Payment details are not collected
          on this site — purchases are handled in-store through our
          point-of-sale provider.
        </p>
      </LegalSection>

      <LegalSection heading="How We Use Your Information">
        <p>
          To operate the rewards program (track points and member status), to
          send account and marketing messages you have opted into, and to
          improve the experience.
        </p>
      </LegalSection>

      <LegalSection heading="Text Messaging (SMS)">
        <p>
          If you opt in, we send recurring automated marketing texts through our
          messaging provider. Message and data rates may apply. Reply STOP to
          opt out at any time, or HELP for help.
        </p>
      </LegalSection>

      <LegalSection heading="How We Share Information">
        <p>
          We share data with the service providers that run the program (such as
          our point-of-sale and messaging vendors). We do not sell your personal
          information.
        </p>
      </LegalSection>

      <LegalSection heading="Data Retention & Security">
        <p>
          We retain member data while your account is active and as required by
          law, and use reasonable measures to protect it.
        </p>
      </LegalSection>

      <LegalSection heading="Your Choices">
        <p>
          You can opt out of marketing texts at any time, and request access to
          or deletion of your information, by contacting us.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions? Visit us in Enterprise, Alabama, or reach out through the
          channels listed in the footer.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
