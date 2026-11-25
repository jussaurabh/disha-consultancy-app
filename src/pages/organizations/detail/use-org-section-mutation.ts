import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orgsApi, type UpdateOrgBody } from "@/api/orgs";
import { SECTION_COPY, type SectionId } from "./sections";

export type ApiError = { response?: { data?: { message?: string } } };

export function getMutationErrorMessage(error: unknown) {
  return (error as ApiError)?.response?.data?.message ?? "Failed to save changes";
}

export function useOrgSectionMutation({
  orgId,
  section,
  onEditClose,
}: {
  orgId: string;
  section: SectionId;
  onEditClose: () => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: UpdateOrgBody) =>
      orgsApi.updateOrg(orgId, values).then((r) => r.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", orgId], updated);
      toast.success(SECTION_COPY[section].success);
      onEditClose();
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });
}