import * as React from "react";
import { CompanyName, SupportEmail } from "@branda/ui/lib/constants";
import { PageLayout } from "@branda/ui/components/ui/pageLayout";
import { cn } from "@branda/ui/lib/utils";

export interface DataUsageProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName?: string;
  contactEmail?: string;
  lastUpdated?: string;
}

export function DataUsage({
  companyName = CompanyName,
  contactEmail = SupportEmail,
  lastUpdated = new Date().toLocaleDateString(),
  className,
  ...props
}: DataUsageProps) {
  return (
    <PageLayout className={cn(className)} {...props}>
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Data Usage Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-base leading-7 text-foreground/90">
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">1. Overview</h2>
            <p>
              This Data Usage Policy explains how {companyName} handles, processes, and utilizes the data
              generated or provided through your use of our services. Transparency is our priority, and we
              want you to understand exactly what happens to your data.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">2. Core Principles</h2>
            <p>
              Our data usage is guided by the following principles:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li><strong>Minimization:</strong> We only collect the data we strictly need.</li>
              <li><strong>Purpose Limitation:</strong> Data is only used for the purposes explicitly stated to you.</li>
              <li><strong>Transparency:</strong> You always have the right to know what data we possess about you.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">3. Analytics and Tracking</h2>
            <p>
              We use aggregated and anonymized data to improve our services. This includes analyzing user journeys,
              identifying bottlenecks in our applications, and measuring the performance of our features.
              This data cannot be used to identify you personally.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">4. Third-Party Sharing</h2>
            <p>
              We do not sell your data to third parties. We only share necessary data with trusted service providers
              (such as cloud hosting and payment processors) who are bound by strict confidentiality agreements and
              only process your data on our instructions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">5. Managing Your Data</h2>
            <p>
              You have the right to request a copy of your data, ask for corrections, or request complete deletion
              of your information from our systems. To exercise these rights, please contact us at:{" "}
              <a href={`mailto:${contactEmail}`} className="font-medium text-primary hover:underline">
                {contactEmail}
              </a>
            </p>
          </section>
        </div>
      </PageLayout>
  );
}
