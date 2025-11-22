import { useState } from 'react';
import { useAnalysisStore } from '@/store/analysisStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnalysisResults } from '@/components/AnalysisResults';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CheckCircle2, FileImage } from 'lucide-react';

const History = () => {
  const { history } = useAnalysisStore();
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  if (history.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Histórico de Análises</h1>
        <Card className="flex items-center justify-center min-h-[400px]">
          <CardContent className="text-center">
            <FileImage className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Nenhuma análise realizada</p>
            <p className="text-muted-foreground">
              As análises aparecerão aqui após serem processadas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Histórico de Análises</h1>
        <p className="text-muted-foreground mt-2">
          {history.length} {history.length === 1 ? 'análise realizada' : 'análises realizadas'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((analysis) => (
          <Card
            key={analysis.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedAnalysis(analysis)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">
                  {format(new Date(analysis.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </CardTitle>
                {analysis.hasCancer ? (
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <img
                src={analysis.superpixelImageUrl || analysis.imageUrl}
                alt="Análise"
                className="w-full h-32 object-cover rounded-md border border-border"
              />
              <div className="space-y-2">
                <Badge
                  variant={analysis.hasCancer ? 'destructive' : 'default'}
                  className={!analysis.hasCancer ? 'bg-success hover:bg-success/90' : ''}
                >
                  {analysis.diagnosis?.prediction}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Confiança: {Math.round(analysis.confidence * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {analysis.superpixels} superpixels
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAnalysis} onOpenChange={() => setSelectedAnalysis(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes da Análise
            </DialogTitle>
          </DialogHeader>
          {selectedAnalysis && <AnalysisResults result={selectedAnalysis} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
