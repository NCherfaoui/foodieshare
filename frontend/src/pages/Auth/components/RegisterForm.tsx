import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RegisterFormProps } from "../types";

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(username, email, password);
  };
  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Inscription</h1>
        <p className="text-muted-foreground">Créez votre compte FoodieShare</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Nom d'utilisateur
          </label>
          <Input
            id="username"
            type="text"
            placeholder="john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <p className="text-xs text-muted-foreground">
            Minimum 6 caractères
          </p>
        </div>

        <Button type="submit" className="w-full">
          S'inscrire
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Déjà un compte ?</span>{" "}
        <Link to="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </div>
    </Card>
  );
};