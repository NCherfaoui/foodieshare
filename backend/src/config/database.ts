import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Veuillez définir MONGODB_URI dans les variables d\'environnement');
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: true,
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
};

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB connecté: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`Erreur de connexion MongoDB: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB déconnecté');
    });

    // Gestion gracieuse de la fermeture
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Connexion MongoDB fermée suite à l\'arrêt de l\'application');
      process.exit(0);
    });

  } catch (error) {
    console.error(`Erreur de connexion: ${error}`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('Déconnexion MongoDB réussie');
  } catch (error) {
    console.error(`Erreur lors de la déconnexion: ${error}`);
    process.exit(1);
  }
};