/* Input OTP docs with a preview for each length and grouping */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Input OTP",
  description: "A row of boxes for a one time code.",
}

export default function InputOTPPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Input OTP" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Input OTP"
            description="A row of boxes for a one time code."
          />
          <Preview className="min-h-60">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </Preview>
        </div>

        <Example
          title="Length"
          description={
            <>
              Set <code>maxLength</code> and render one{" "}
              <code>InputOTPSlot</code> for each character, by index.
            </>
          }
        >
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Example>

        <Example
          title="With Separator"
          description={
            <>
              Split the slots into two groups and put an{" "}
              <code>InputOTPSeparator</code> between them.
            </>
          }
        >
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              {[0, 1, 2].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {[3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Example>

        <Example
          title="Digits Only"
          description={
            <>
              Set <code>{'inputMode="numeric"'}</code> and a{" "}
              <code>pattern</code> so the phone keyboard opens and letters are
              rejected.
            </>
          }
        >
          <InputOTP maxLength={6} inputMode="numeric" pattern="^\d*$">
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Example>

        <Example
          title="In a Field"
          description={
            <>
              Put it in a <code>Field</code> with a label and help text. Set{" "}
              <code>disabled</code> while the code is being checked.
            </>
          }
        >
          <Field className="w-full max-w-sm">
            <FieldLabel>Verification code</FieldLabel>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              We sent a code to your email. It expires in 10 minutes.
            </FieldDescription>
          </Field>
        </Example>
      </DashboardContainer>
    </>
  )
}
