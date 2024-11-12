import { UserProfile } from '../types';

interface UserInfoProps {
  profile: UserProfile;
}

export const UserInfo = ({ profile }: UserInfoProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Informations</h2>
      <div className="p-4 border rounded-lg">
        <p className="mb-2">
          <span className="font-medium">Nom d'utilisateur:</span> {profile.username}
        </p>
        <p>
          <span className="font-medium">Email:</span> {profile.email}
        </p>
      </div>
    </div>
  );
};