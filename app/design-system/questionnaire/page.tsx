/* Questionnaire docs with a preview for each step and control */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Questionnaire",
  description: "A survey that shows one question at a time.",
}

export default function QuestionnairePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Questionnaire" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Questionnaire"
            description="A survey that shows one question at a time."
          />
          <Preview className="min-h-60">
            <Questionnaire className="max-w-sm">
              <QuestionnaireProgress />
              <QuestionnaireItem name="role" required>
                <QuestionnaireTitle>What is your role?</QuestionnaireTitle>
                <QuestionnaireDescription>
                  This helps us pick the right examples.
                </QuestionnaireDescription>
                <QuestionnaireChoices>
                  <QuestionnaireChoice value="engineer">
                    Engineer
                  </QuestionnaireChoice>
                  <QuestionnaireChoice value="designer">
                    Designer
                  </QuestionnaireChoice>
                  <QuestionnaireChoice value="other">Other</QuestionnaireChoice>
                </QuestionnaireChoices>
              </QuestionnaireItem>
              <QuestionnaireItem name="size">
                <QuestionnaireTitle>How large is the team?</QuestionnaireTitle>
                <QuestionnaireChoices>
                  <QuestionnaireChoice value="solo">
                    Just me
                    <QuestionnaireChoiceDescription>
                      One person, one project.
                    </QuestionnaireChoiceDescription>
                  </QuestionnaireChoice>
                  <QuestionnaireChoice value="small">
                    2 to 10
                  </QuestionnaireChoice>
                </QuestionnaireChoices>
              </QuestionnaireItem>
              <QuestionnaireActions>
                <QuestionnairePrevious>Back</QuestionnairePrevious>
                <QuestionnaireSkip>Skip</QuestionnaireSkip>
                <QuestionnaireNext>Next</QuestionnaireNext>
                <QuestionnaireSubmit>Finish</QuestionnaireSubmit>
              </QuestionnaireActions>
            </Questionnaire>
          </Preview>
        </div>

        <Example
          title="Items"
          description={
            <>
              Each <code>QuestionnaireItem</code> needs a <code>name</code>.
              Only the active item shows, and the component moves between them.
            </>
          }
        >
          <Questionnaire className="max-w-sm">
            <QuestionnaireItem name="plan" required>
              <QuestionnaireTitle>Which plan do you use?</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="free">Free</QuestionnaireChoice>
                <QuestionnaireChoice value="pro">Pro</QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnaireSubmit>Send</QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        </Example>

        <Example
          title="Multiple Answers"
          description={
            <>
              Set <code>multiple</code> on the item. The choice mark turns from
              a circle into a box.
            </>
          }
        >
          <Questionnaire className="max-w-sm">
            <QuestionnaireItem name="tools" multiple>
              <QuestionnaireTitle>Which tools do you use?</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="figma">Figma</QuestionnaireChoice>
                <QuestionnaireChoice value="vscode">
                  VS Code
                </QuestionnaireChoice>
                <QuestionnaireChoice value="terminal">
                  Terminal
                </QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnaireSubmit>Send</QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        </Example>

        <Example
          title="Free Text"
          description={
            <>
              Use <code>QuestionnaireInput</code> in place of the choices for an
              answer the user types.
            </>
          }
        >
          <Questionnaire className="max-w-sm">
            <QuestionnaireItem name="feedback">
              <QuestionnaireTitle>
                What would you improve first?
              </QuestionnaireTitle>
              <QuestionnaireInput placeholder="Write a short answer" />
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnaireSubmit>Send</QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        </Example>

        <Example
          title="Progress and Actions"
          description={
            <>
              <code>QuestionnaireProgress</code> prints the position in the set.
              The action buttons show only when they apply, so{" "}
              <code>Previous</code> hides on the first question.
            </>
          }
        >
          <Questionnaire className="max-w-sm">
            <QuestionnaireProgress />
            <QuestionnaireItem name="first">
              <QuestionnaireTitle>Question one</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="a">A</QuestionnaireChoice>
                <QuestionnaireChoice value="b">B</QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireItem name="second">
              <QuestionnaireTitle>Question two</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="c">C</QuestionnaireChoice>
                <QuestionnaireChoice value="d">D</QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnairePrevious>Back</QuestionnairePrevious>
              <QuestionnaireNext>Next</QuestionnaireNext>
              <QuestionnaireSubmit>Finish</QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        </Example>
      </DashboardContainer>
    </>
  )
}
