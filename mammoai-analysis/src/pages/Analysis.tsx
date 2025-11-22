import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAnalysisStore } from '@/store/analysisStore';
import { analyzeImage } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Analysis = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [superpixels, setSuperpixels] = useState<number>(50);
  const [tipoLesao, setTipoLesao] = useState<'CALC' | 'MASS'>('CALC');
  const { currentAnalysis, isLoading, setLoading, addToHistory } = useAnalysisStore();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione uma imagem",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeImage(selectedImage, superpixels, tipoLesao);
      addToHistory(result);
      toast({
        title: "Análise concluída!",
        description: "Os resultados foram processados com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Não foi possível processar a imagem",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Análise de Mamografia</h1>
        <p className="text-muted-foreground mt-2">
          Faça upload de uma imagem e configure os parâmetros para análise
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload da Imagem</CardTitle>
              <CardDescription>
                Selecione a imagem de mamografia para análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageSelected={setSelectedImage}
                selectedImage={selectedImage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Segmentação</CardTitle>
              <CardDescription>
                Escolha a quantidade de superpixels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={superpixels.toString()}
                onValueChange={(value) => setSuperpixels(Number(value))}
              >
                {[25, 50, 100, 200].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value.toString()} id={`sp-${value}`} />
                    <Label htmlFor={`sp-${value}`} className="cursor-pointer">
                      {value} superpixels
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6 space-y-2">
                <Label>Tipo de Lesão</Label>
                <RadioGroup
                  value={tipoLesao}
                  onValueChange={(value) => setTipoLesao(value as 'CALC' | 'MASS')}
                  className="grid grid-cols-2 gap-2"
                >
                  {['CALC', 'MASS'].map((value) => (
                    <div key={value} className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value={value} id={`lesao-${value}`} />
                      <Label htmlFor={`lesao-${value}`} className="cursor-pointer">
                        {value === 'CALC' ? 'Calcificação' : 'Massa'}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                className="w-full mt-6"
                onClick={handleAnalyze}
                disabled={!selectedImage || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  'Enviar para Análise'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div>
          {currentAnalysis ? (
            <AnalysisResults result={currentAnalysis} />
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Os resultados aparecerão aqui após a análise
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
