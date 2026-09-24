/* Attachment docs with a preview for each size, orientation, and state */
import type { Metadata } from "next"
import { FileText, ImageIcon, X } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Attachment",
  description: "A file attached to a message or a form.",
}

export default function AttachmentPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Attachment" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Attachment"
            description="A file attached to a message or a form."
          />
          <Preview className="min-h-60">
            <Attachment>
              <AttachmentMedia>
                <FileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
                <AttachmentDescription>2.4 MB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label="Remove">
                  <X />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Preview>
        </div>

        <Example
          title="State"
          description={
            <>
              Set <code>state</code> to <code>idle</code>,{" "}
              <code>uploading</code>, <code>processing</code>,{" "}
              <code>error</code>, or <code>done</code>. The title shimmers while
              it uploads, and the border turns red on an error.
            </>
          }
        >
          <div className="flex flex-col gap-3">
            <Attachment state="uploading">
              <AttachmentMedia>
                <Spinner />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>photo.png</AttachmentTitle>
                <AttachmentDescription>Uploading</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment state="error">
              <AttachmentMedia>
                <ImageIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>photo.png</AttachmentTitle>
                <AttachmentDescription>
                  The file is over 5 MB
                </AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment state="idle">
              <AttachmentMedia>
                <ImageIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>Drop a file</AttachmentTitle>
              </AttachmentContent>
            </Attachment>
          </div>
        </Example>

        <Example
          title="Size"
          description={
            <>
              Set <code>{'size="sm"'}</code> or <code>{'size="xs"'}</code>. The
              media and the radius shrink with it.
            </>
          }
        >
          <div className="flex flex-col gap-3">
            <Attachment size="xs">
              <AttachmentMedia>
                <FileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>notes.txt</AttachmentTitle>
              </AttachmentContent>
            </Attachment>
            <Attachment size="sm">
              <AttachmentMedia>
                <FileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>notes.txt</AttachmentTitle>
              </AttachmentContent>
            </Attachment>
          </div>
        </Example>

        <Example
          title="Vertical"
          description={
            <>
              Set <code>{'orientation="vertical"'}</code> for a tile. Use{" "}
              <code>{'variant="image"'}</code> on the media for a thumbnail.
            </>
          }
        >
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <ImageIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>cover.jpg</AttachmentTitle>
              <AttachmentDescription>1.1 MB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </Example>

        <Example
          title="Group"
          description={
            <>
              Put several attachments in an <code>AttachmentGroup</code>. It
              scrolls sideways and snaps to each item.
            </>
          }
        >
          <AttachmentGroup className="max-w-sm">
            {["deck.pdf", "budget.xlsx", "logo.svg", "notes.txt"].map(
              (name) => (
                <Attachment key={name} size="sm">
                  <AttachmentMedia>
                    <FileText />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{name}</AttachmentTitle>
                  </AttachmentContent>
                </Attachment>
              )
            )}
          </AttachmentGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
