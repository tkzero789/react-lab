/* Table docs with a preview for each part of a data table */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Table",
  description: "Rows and columns of data.",
}

const deploys = [
  { id: "dpl_921", branch: "main", state: "Ready", time: "42s" },
  { id: "dpl_920", branch: "fix/login", state: "Failed", time: "12s" },
  { id: "dpl_919", branch: "main", state: "Ready", time: "38s" },
]

export default function TablePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Table" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Table"
            description="Rows and columns of data."
          />
          <Preview className="min-h-60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deployment</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deploys.map((deploy) => (
                  <TableRow key={deploy.id}>
                    <TableCell className="font-medium">{deploy.id}</TableCell>
                    <TableCell>{deploy.branch}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          deploy.state === "Failed" ? "destructive" : "muted"
                        }
                      >
                        {deploy.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {deploy.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Preview>
        </div>

        <Example
          title="Caption and Footer"
          description={
            <>
              Add <code>TableCaption</code> to name the table, and{" "}
              <code>TableFooter</code> for a total row.
            </>
          }
        >
          <Table>
            <TableCaption>Invoices for the last quarter.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV-041</TableCell>
                <TableCell className="text-right tabular-nums">
                  $250.00
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV-042</TableCell>
                <TableCell className="text-right tabular-nums">
                  $180.00
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell className="text-right tabular-nums">
                  $430.00
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Example>

        <Example
          title="Selected Rows"
          description={
            <>
              Set <code>{'data-state="selected"'}</code> on the row. A cell with
              a checkbox loses its right padding on its own.
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox aria-label="Select all" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow data-state="selected">
                <TableCell>
                  <Checkbox defaultChecked aria-label="Select row" />
                </TableCell>
                <TableCell>Anna Bell</TableCell>
                <TableCell>Owner</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Checkbox aria-label="Select row" />
                </TableCell>
                <TableCell>Chris Doe</TableCell>
                <TableCell>Member</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Example>

        <Example
          title="Alignment"
          description={
            <>
              Numbers read better on the right with <code>tabular-nums</code>,
              so the digits line up between rows.
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Errors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Frankfurt</TableCell>
                <TableCell className="text-right tabular-nums">
                  1,204,800
                </TableCell>
                <TableCell className="text-right tabular-nums">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Singapore</TableCell>
                <TableCell className="text-right tabular-nums">
                  98,120
                </TableCell>
                <TableCell className="text-right tabular-nums">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Example>
      </DashboardContainer>
    </>
  )
}
