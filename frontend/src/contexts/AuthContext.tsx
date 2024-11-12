import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { User, AuthContextType } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
  
      if (response.data) {
        const { token, user } = response.data;
        
        // Plus besoin de transformer isAdmin, on garde le role tel quel
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${user.username} !`,
        });
  
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Email ou mot de passe incorrect",
      });
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
  
      if (response.data) {
        const { token, user } = response.data;
        
        // Sauvegarder le token et l'utilisateur
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Mettre à jour le state
        setUser(user);
        
        toast({
          title: "Inscription réussie",
          description: `Bienvenue sur FoodieShare !`,
        });
  
        navigate('/login');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé avec AuthProvider");
  }
  return context;
};