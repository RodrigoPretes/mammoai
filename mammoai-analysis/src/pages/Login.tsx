import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao sistema de análise"
      });
      navigate('/dashboard/analysis');
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error.detail ?? "Erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRegister = async () => {
    navigate('/register');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sistema de Análise</CardTitle>
          <CardDescription>
            Análise de Mamografia com GNNs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Nome de Usuário</Label>
              <Input
                id="email"
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className=''>

            </div>
          </form>
        </CardContent>
        <CardContent>
          <CardDescription className="space-y-1 text-center">
            Não possui cadastro ? Clique em Cadastre-se
          </CardDescription>
            <Button
              type='submit'
              className='w-full'
              variant='secondary'
              onClick={handleSubmitRegister}
              >
              Cadastre-se
            </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
