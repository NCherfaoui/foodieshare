import { useAuth } from "@/contexts/AuthContext";
import { UserInfo } from "./components/UserInfo";
import { UserRecipes } from "./components/UserRecipes";
import { UserFavorites } from "./components/UserFavorites";
import { useProfile } from "./hooks/useProfile";

export const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfile(user?.id);

  if (loading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto p-4">Profil non trouvé</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <UserInfo profile={profile} />
      <UserRecipes recipes={profile.recipes} />
      <UserFavorites favorites={profile.favorites} />
    </div>
  );
};

export default ProfilePage;