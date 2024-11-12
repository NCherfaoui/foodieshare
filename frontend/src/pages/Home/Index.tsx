import { FeaturedRecipes } from './components/FeaturedRecipes';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur FoodieShare</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez et partagez de délicieuses recettes
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Recettes à la une</h2>
          <FeaturedRecipes />
        </section>
      </main>
    </div>
  );
};

export default HomePage;