/* Avatar docs with a preview for each size and composition */
import type { Metadata } from "next"
import { Check } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Avatar",
  description: "A picture of a user, with a fallback when no picture loads.",
}

export default function AvatarPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Avatar" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Avatar"
            description="A picture of a user, with a fallback when no picture loads."
          />
          <Preview className="min-h-60">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Preview>
        </div>

        <Example
          title="Size"
          description={
            <>
              Set <code>{'size="sm"'}</code> or <code>{'size="lg"'}</code>. Omit{" "}
              <code>size</code> for the default.
            </>
          }
        >
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </Example>

        <Example
          title="Fallback"
          description={
            <>
              Always add <code>AvatarFallback</code>. It shows while the picture
              loads, and stays if the picture fails.
            </>
          }
        >
          <Avatar>
            <AvatarImage src="/does-not-exist.png" alt="Missing" />
            <AvatarFallback>TT</AvatarFallback>
          </Avatar>
        </Example>

        <Example
          title="Badge"
          description={
            <>
              Add <code>AvatarBadge</code> for a status dot. It takes its size
              from the avatar.
            </>
          }
        >
          <Avatar size="lg">
            <AvatarFallback>ON</AvatarFallback>
            <AvatarBadge>
              <Check />
            </AvatarBadge>
          </Avatar>
          <Avatar>
            <AvatarFallback>ON</AvatarFallback>
            <AvatarBadge />
          </Avatar>
        </Example>

        <Example
          title="Group"
          description={
            <>
              Wrap the avatars in <code>AvatarGroup</code>. Use{" "}
              <code>AvatarGroupCount</code> for the rest.
            </>
          }
        >
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>EF</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
