import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ClipboardList } from "lucide-react";
import { useUnifiedModals } from '@/components/modals/unified/UnifiedModalProvider';

interface ApprovalWorkflowProps {
  extractedData?: any;
  onApproval?: (approvedData: any) => void;
  onRejection?: (reason: string) => void;
}

export function ApprovalWorkflowComponent({ extractedData, onApproval, onRejection }: ApprovalWorkflowProps) {
  const { openModal } = useUnifiedModals();

  const handleOpenOCRApproval = () => {
    openModal('ocrApproval');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fil d'Approbation OCR-IA"
        description="Validation et approbation des documents traités par OCR-IA"
        icon={ClipboardList}
        iconColor="text-orange-600"
      />

      <Card>
        <CardHeader>
          <CardTitle>File d'Attente d'Approbation OCR-IA</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Gérez les documents extraits par OCR-IA qui nécessitent une validation avant publication.
          </p>
          <Button onClick={handleOpenOCRApproval} className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Ouvrir la File d'Approbation OCR-IA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}