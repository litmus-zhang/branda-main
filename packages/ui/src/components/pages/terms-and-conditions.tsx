import * as React from "react";
import { cn } from "@branda/ui/lib/utils";
import { CompanyName, SupportEmail } from "@branda/ui/lib/constants";
import { Navbar } from "@branda/ui/components/navbar";
import { Footer } from "@branda/ui/components/footer";


export interface TermsAndConditionsProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName?: string;
  contactEmail?: string;
  lastUpdated?: string;
}

export function TermsAndConditions({
  companyName = CompanyName,
  contactEmail = SupportEmail,
  lastUpdated = new Date().toLocaleDateString(),
  className,
  ...props
}: TermsAndConditionsProps) {
  return (
    <>
      <Navbar />
      <div className={cn("mx-auto max-w-4xl px-4 pt-24 py-12 sm:px-6 lg:px-8", className)} {...props}>
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Terms and Conditions</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-base leading-7 text-foreground/90">
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement made between you and {companyName},
              concerning your access to and use of our website and services. You agree that by accessing the site,
              you have read, understood, and agree to be bound by all of these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality,
              software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content")
              and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">3. User Representations</h2>
            <p>
              By using the Site, you represent and warrant that:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">4. Privacy Policy</h2>
            <p>
              We care about data privacy and security. Please review our Privacy Policy. By using the Site, you agree to be bound
              by our Privacy Policy, which is incorporated into these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">5. Contact Us</h2>
            <p>
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site,
              please contact us at:{" "}
              <a href={`mailto:${contactEmail}`} className="font-medium text-primary hover:underline">
                {contactEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
