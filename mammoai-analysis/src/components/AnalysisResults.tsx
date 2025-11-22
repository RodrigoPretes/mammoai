import { AnalysisResult } from '@/store/analysisStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const confidencePercent = Math.round((result.confidence ?? 0) * 100);
  const malignantPercent = Math.round((result.diagnosis?.confidence_malignant ?? result.confidence ?? 0) * 100);
  const benignPercent = Math.round((result.diagnosis?.confidence_benign ?? 0) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Imagem Original</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={result.imageUrl}
              alt="Imagem original"
              className="w-full rounded-lg border border-border bg-muted"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagem com Superpixels</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={result.superpixelImageUrl || result.segmentedImage || result.imageUrl}
              alt="Imagem segmentada"
              className="w-full rounded-lg border border-border bg-muted"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {result.superpixels} superpixels detectados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis */}
      <Card className={result.hasCancer ? 'border-destructive' : 'border-success'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.hasCancer ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-success" />
            )}
            Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Resultado</p>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge
                variant={result.hasCancer ? 'destructive' : 'default'}
                className={!result.hasCancer ? 'bg-success hover:bg-success/90' : ''}
              >
                {result.diagnosis.prediction}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Confiança total</span>
                <span className="font-semibold">{confidencePercent}%</span>
              </div>
              <Progress value={confidencePercent} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prob. Maligno</span>
                <span className="font-semibold">{malignantPercent}%</span>
              </div>
              <Progress value={malignantPercent} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prob. Benigno</span>
                <span className="font-semibold">{benignPercent}%</span>
              </div>
              <Progress value={benignPercent} className="h-2" />
            </div>
          </div>

          {result.message && (
            <p className="text-xs text-muted-foreground">
              {result.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
