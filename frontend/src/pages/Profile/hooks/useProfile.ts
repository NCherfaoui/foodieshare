import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { UserProfile } from '../types';

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}/profile`);
        console.log(response.data);
        
        if (response.data?.data) {
          setProfile(response.data.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le profil"
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, toast]);

  return { profile, loading };
};