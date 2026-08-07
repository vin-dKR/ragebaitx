"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountTab } from "./account-tab";
import { AutomationTab } from "./automation-tab";
import { ModelsTab } from "./models-tab";
import { SourcingTab } from "./sourcing-tab";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Every dial on the engine — account, models, sourcing, automation. Changes apply immediately."
      />
      <Tabs defaultValue="account" className="gap-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-4">
          <AccountTab />
        </TabsContent>
        <TabsContent value="models" className="space-y-4">
          <ModelsTab />
        </TabsContent>
        <TabsContent value="sourcing" className="space-y-4">
          <SourcingTab />
        </TabsContent>
        <TabsContent value="automation" className="space-y-4">
          <AutomationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
