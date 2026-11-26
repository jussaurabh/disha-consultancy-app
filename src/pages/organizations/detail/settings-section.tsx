import { Button } from "@/components/ui/button";
import { DetailSection } from "@/components/ui/detail-section";
import type { Organization } from "@/api/orgs";
import { DetailRow, DetailRowValue } from "./detail-shared";

export function SettingsSection({
  org,
  canDelete,
  onDelete,
}: {
  org: Organization;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <DetailSection title="Settings" description="Organization settings and administration">
      <DetailRow label="Organization">
        <DetailRowValue>{org.company_name}</DetailRowValue>
      </DetailRow>
      <DetailRow label="Danger zone">
        <Button type="button" variant="destructive" size="sm" disabled={!canDelete} onClick={onDelete}>
          Delete organization
        </Button>
      </DetailRow>
    </DetailSection>
  );
}