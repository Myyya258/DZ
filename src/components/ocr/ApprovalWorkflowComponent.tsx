import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from "@/components/common/SectionHeader";
import { Eye, Edit, ThumbsUp, ThumbsDown, ClipboardList, Search, Filter, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface ApprovalWorkflowProps {
  extractedData?: any;
  onApproval?: (approvedData: any) => void;
  onRejection?: (reason: string) => void;
}

interface WorkflowDocument {
  id: string;
  title: string;
  documentType: 'legal-text' | 'procedure';
  extractionDate: string;
  extractionConfidence: number;
  status: 'pending' | 'under_review' | 'approved' | 'needs_revision' | 'rejected';
  submittedBy: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export function ApprovalWorkflowComponent({ extractedData, onApproval, onRejection }: ApprovalWorkflowProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const workflowItems: WorkflowDocument[] = [
    {
      id: '1',
      title: 'Loi relative aux investissements',
      documentType: 'legal-text',
      extractionDate: '2025-01-12',
      extractionConfidence: 94,
      status: 'pending',
      submittedBy: 'Système OCR-IA',
      priority: 'high',
      category: 'Finance'
    },
    {
      id: '2',
      title: 'Décret exécutif modalités application',
      documentType: 'legal-text',
      extractionDate: '2025-01-11',
      extractionConfidence: 87,
      status: 'under_review',
      submittedBy: 'Système OCR-IA',
      assignedTo: 'Dr. Amina Khelifi',
      priority: 'medium',
      category: 'Justice'
    },
    {
      id: '3',
      title: 'Procédure création entreprise SARL',
      documentType: 'procedure',
      extractionDate: '2025-01-10',
      extractionConfidence: 91,
      status: 'approved',
      submittedBy: 'Système OCR-IA',
      assignedTo: 'M. Karim Benaissa',
      priority: 'medium',
      category: 'Commerce'
    },
    {
      id: '4',
      title: 'Arrêté ministériel normes environnementales',
      documentType: 'legal-text',
      extractionDate: '2025-01-09',
      extractionConfidence: 83,
      status: 'needs_revision',
      submittedBy: 'Système OCR-IA',
      assignedTo: 'Dr. Leila Mansouri',
      priority: 'low',
      category: 'Environnement'
    },
    {
      id: '5',
      title: 'Procédure demande passeport biométrique',
      documentType: 'procedure',
      extractionDate: '2025-01-08',
      extractionConfidence: 96,
      status: 'approved',
      submittedBy: 'Système OCR-IA',
      assignedTo: 'Mme. Fatima Benali',
      priority: 'high',
      category: 'Administration'
    },
    {
      id: '6',
      title: 'Ordonnance modifiant code commerce',
      documentType: 'legal-text',
      extractionDate: '2025-01-07',
      extractionConfidence: 89,
      status: 'rejected',
      submittedBy: 'Système OCR-IA',
      assignedTo: 'M. Ahmed Taleb',
      priority: 'medium',
      category: 'Commerce'
    }
  ];

  const filteredDocuments = workflowItems.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.assignedTo && doc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || doc.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const legalTexts = filteredDocuments.filter(item => item.documentType === 'legal-text');
  const procedures = filteredDocuments.filter(item => item.documentType === 'procedure');

  const getStatistics = () => {
    return {
      total: workflowItems.length,
      pending: workflowItems.filter(d => d.status === 'pending').length,
      underReview: workflowItems.filter(d => d.status === 'under_review').length,
      approved: workflowItems.filter(d => d.status === 'approved').length,
      needsRevision: workflowItems.filter(d => d.status === 'needs_revision').length,
      rejected: workflowItems.filter(d => d.status === 'rejected').length
    };
  };

  const stats = getStatistics();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800">En révision</Badge>;
      case 'needs_revision':
        return <Badge className="bg-orange-100 text-orange-800">À réviser</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const ItemCard = ({ item }: { item: WorkflowDocument }) => (
    <Card key={item.id} className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Soumis par {item.submittedBy}</span>
              <span>•</span>
              <span>{new Date(item.extractionDate).toLocaleDateString('fr-FR')}</span>
              <span>•</span>
              <span>Confiance: {item.extractionConfidence}%</span>
            </div>
            {item.assignedTo && (
              <div className="text-sm text-muted-foreground">
                Assigné à {item.assignedTo}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className={getPriorityColor(item.priority)}>
              {item.priority === 'high' ? 'Urgent' : item.priority === 'medium' ? 'Normal' : 'Faible'}
            </Badge>
            <Badge variant="secondary">{item.category}</Badge>
            {getStatusBadge(item.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Examiner
          </Button>
          {item.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approuver
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rejeter
              </Button>
            </>
          )}
          {item.status === 'under_review' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
              Réviser
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fil d'Approbation OCR-IA"
        description="Validation et approbation des documents traités par OCR-IA"
        icon={ClipboardList}
        iconColor="text-orange-600"
      />

      {/* Statistiques en haut */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-4 bg-gray-50">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-sm text-yellow-600">En attente</p>
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.underReview}</p>
            <p className="text-sm text-blue-600">En révision</p>
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            <p className="text-sm text-green-600">Approuvés</p>
          </div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-700">{stats.needsRevision}</p>
            <p className="text-sm text-orange-600">À réviser</p>
          </div>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            <p className="text-sm text-red-600">Rejetés</p>
          </div>
        </Card>
      </div>

      {/* Section principale avec filtres et contenu */}
      <div className="space-y-6">
        {/* Filtres */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Environnement">Environnement</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Justice">Justice</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="high">Urgent</SelectItem>
                  <SelectItem value="medium">Normal</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Onglets pour séparer les types */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Tout ({filteredDocuments.length})
            </TabsTrigger>
            <TabsTrigger value="legal-texts">
              Textes juridiques ({legalTexts.length})
            </TabsTrigger>
            <TabsTrigger value="procedures">
              Procédures ({procedures.length})
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Aucun élément en attente</h3>
                    <p className="text-muted-foreground">La file d'attente d'approbation est vide.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map(item => <ItemCard key={item.id} item={item} />)
            )}
          </TabsContent>
          
          <TabsContent value="legal-texts" className="space-y-4 mt-6">
            {legalTexts.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Aucun texte juridique en attente</h3>
                    <p className="text-muted-foreground">Tous les textes juridiques ont été traités.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              legalTexts.map(item => <ItemCard key={item.id} item={item} />)
            )}
          </TabsContent>
          
          <TabsContent value="procedures" className="space-y-4 mt-6">
            {procedures.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Aucune procédure en attente</h3>
                    <p className="text-muted-foreground">Toutes les procédures ont été traitées.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              procedures.map(item => <ItemCard key={item.id} item={item} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}