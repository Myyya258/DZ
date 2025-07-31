import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, CheckCircle, XCircle, Search, Filter, ClipboardList } from 'lucide-react';

interface PendingOCRItem {
  id: string;
  type: 'legal-text' | 'procedure';
  title: string;
  submittedBy: string;
  submittedDate: string;
  extractionDate: string;
  extractionConfidence: number;
  status: 'pending' | 'under_review' | 'approved' | 'needs_revision' | 'rejected';
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  data: Record<string, unknown>;
}

interface OCRApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveItem: (item: PendingOCRItem, comment?: string) => void;
  onRejectItem: (item: PendingOCRItem, reason: string) => void;
  onViewItem: (item: PendingOCRItem) => void;
  filterType?: 'all' | 'legal-text' | 'procedure';
}

export function OCRApprovalModal({ 
  isOpen, 
  onClose, 
  onApproveItem, 
  onRejectItem, 
  onViewItem,
  filterType = 'all'
}: OCRApprovalModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Données OCR-IA de démonstration
  const [pendingItems] = useState<PendingOCRItem[]>([
    {
      id: '1',
      type: 'legal-text',
      title: 'Loi relative aux investissements',
      submittedBy: 'Système OCR-IA',
      submittedDate: '2025-01-12',
      extractionDate: '2025-01-12',
      extractionConfidence: 94,
      status: 'pending',
      priority: 'high',
      category: 'Finance',
      data: { textType: 'Loi', sector: 'Finance' }
    },
    {
      id: '2',
      type: 'legal-text',
      title: 'Décret exécutif modalités application',
      submittedBy: 'Système OCR-IA',
      submittedDate: '2025-01-11',
      extractionDate: '2025-01-11',
      extractionConfidence: 87,
      status: 'under_review',
      assignedTo: 'Dr. Amina Khelifi',
      priority: 'medium',
      category: 'Justice',
      data: { textType: 'Décret exécutif', sector: 'Justice' }
    },
    {
      id: '3',
      type: 'procedure',
      title: 'Procédure création entreprise SARL',
      submittedBy: 'Système OCR-IA',
      submittedDate: '2025-01-10',
      extractionDate: '2025-01-10',
      extractionConfidence: 91,
      status: 'approved',
      assignedTo: 'M. Karim Benaissa',
      priority: 'medium',
      category: 'Commerce',
      data: { category: 'Commerce', institution: 'Ministère du Commerce' }
    },
    {
      id: '4',
      type: 'legal-text',
      title: 'Arrêté ministériel normes environnementales',
      submittedBy: 'Système OCR-IA',
      submittedDate: '2025-01-09',
      extractionDate: '2025-01-09',
      extractionConfidence: 83,
      status: 'needs_revision',
      assignedTo: 'Dr. Leila Mansouri',
      priority: 'low',
      category: 'Environnement',
      data: { textType: 'Arrêté ministériel', sector: 'Environnement' }
    },
    {
      id: '5',
      type: 'procedure',
      title: 'Procédure demande passeport biométrique',
      submittedBy: 'Système OCR-IA',
      submittedDate: '2025-01-08',
      extractionDate: '2025-01-08',
      extractionConfidence: 96,
      status: 'approved',
      assignedTo: 'Mme. Fatima Benali',
      priority: 'high',
      category: 'Administration',
      data: { category: 'Administration', institution: 'Ministère de l\'Intérieur' }
    }
  ]);

  const filteredItems = pendingItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesType;
  });

  const legalTexts = filteredItems.filter(item => item.type === 'legal-text');
  const procedures = filteredItems.filter(item => item.type === 'procedure');

  const getStatistics = () => {
    return {
      total: pendingItems.length,
      pending: pendingItems.filter(d => d.status === 'pending').length,
      underReview: pendingItems.filter(d => d.status === 'under_review').length,
      approved: pendingItems.filter(d => d.status === 'approved').length,
      needsRevision: pendingItems.filter(d => d.status === 'needs_revision').length,
      rejected: pendingItems.filter(d => d.status === 'rejected').length
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

  const ItemCard = ({ item }: { item: PendingOCRItem }) => (
    <Card key={item.id} className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Soumis par {item.submittedBy}</span>
              <span>•</span>
              <span>{new Date(item.submittedDate).toLocaleDateString('fr-FR')}</span>
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
            onClick={() => onViewItem(item)}
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
                onClick={() => onApproveItem(item)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approuver
              </Button>
              <Button
                onClick={() => onRejectItem(item, 'Motif à préciser')}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rejeter
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-orange-600" />
            Fil d'Approbation OCR-IA
            <Badge variant="secondary">{filteredItems.length} éléments en attente</Badge>
          </DialogTitle>
          <DialogDescription>
            Validation et approbation des documents traités par OCR-IA avant leur publication dans la base de données.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statistiques OCR-IA */}
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

          {/* Onglets pour séparer les types - seulement si pas de filtre spécifique */}
          {filterType === 'all' ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  Tout ({filteredItems.length})
                </TabsTrigger>
                <TabsTrigger value="legal-texts">
                  Textes juridiques ({legalTexts.length})
                </TabsTrigger>
                <TabsTrigger value="procedures">
                  Procédures ({procedures.length})
                </TabsTrigger>
              </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-6">
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Aucun élément en attente</h3>
                      <p className="text-muted-foreground">La file d'attente d'approbation OCR-IA est vide.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map(item => <ItemCard key={item.id} item={item} />)
              )}
            </TabsContent>
            
            <TabsContent value="legal-texts" className="space-y-4 mt-6">
              {legalTexts.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Aucun texte juridique en attente</h3>
                      <p className="text-muted-foreground">Tous les textes juridiques OCR-IA ont été traités.</p>
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
                      <p className="text-muted-foreground">Toutes les procédures OCR-IA ont été traitées.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                procedures.map(item => <ItemCard key={item.id} item={item} />)
              )}
            </TabsContent>
          </Tabs>
          ) : (
            // Affichage direct des éléments filtrés
            <div className="space-y-4 mt-6">
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Aucun élément en attente</h3>
                      <p className="text-muted-foreground">
                        {filterType === 'legal-text' ? 'Aucun texte juridique OCR-IA en attente.' : 'Aucune procédure OCR-IA en attente.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map(item => <ItemCard key={item.id} item={item} />)
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}