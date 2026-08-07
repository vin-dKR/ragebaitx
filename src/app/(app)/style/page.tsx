import { PageHeader } from "@/components/shared/page-header";
import { AddRuleDialog } from "./add-rule-dialog";
import { ExampleBank } from "./example-bank";
import { FeedbackLog } from "./feedback-log";
import { LearnedSummary } from "./learned-summary";
import { RulesList } from "./rules-list";

export default function StyleProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Style Profile"
        description="The rules and references every draft is written against."
      >
        <AddRuleDialog />
      </PageHeader>
      <LearnedSummary />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RulesList />
        </div>
        <div className="lg:col-span-2">
          <ExampleBank />
        </div>
      </div>
      <FeedbackLog />
    </div>
  );
}
