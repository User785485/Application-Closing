"use client";

import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Resources() {
  // Donnu00e9es fictives pour les catégories de ressources
  const resourceCategories = [
    {
      id: 1,
      name: "Guides spirituels",
      count: 12,
      icon: "📚",
      color: "primary",
    },
    {
      id: 2,
      name: "Exercices quotidiens",
      count: 28,
      icon: "🧘",
      color: "green",
    },
    {
      id: 3,
      name: "Méditations guidées",
      count: 15,
      icon: "🎧",
      color: "purple",
    },
    {
      id: 4,
      name: "Articles et blog",
      count: 23,
      icon: "📝",
      color: "blue",
    },
    {
      id: 5,
      name: "Matériels de vente",
      count: 8,
      icon: "📊",
      color: "yellow",
    },
    {
      id: 6,
      name: "Cours et webinaires",
      count: 6,
      icon: "🎓",
      color: "indigo",
    },
  ];

  // Donnu00e9es fictives pour les ressources récentes
  const recentResources = [
    {
      id: 1,
      title: "Guide de méditation: Découvrir le coeur",
      category: "Guides spirituels",
      createdAt: "2025-03-01",
      format: "PDF",
      size: "2.4 MB",
      downloads: 128,
      forClientLevel: "Tous",
    },
    {
      id: 2,
      title: "Exercice quotidien: Routine matinale d'intention",
      category: "Exercices quotidiens",
      createdAt: "2025-03-03",
      format: "PDF",
      size: "1.1 MB",
      downloads: 97,
      forClientLevel: "Débutant",
    },
    {
      id: 3,
      title: "Méditation guidée: Connecter avec son moi profond",
      category: "Méditations guidées",
      createdAt: "2025-03-05",
      format: "MP3",
      size: "18.5 MB",
      downloads: 65,
      forClientLevel: "Intermédiaire",
    },
    {
      id: 4,
      title: "Article: L'implémentation des pratiques spirituelles au quotidien",
      category: "Articles et blog",
      createdAt: "2025-03-07",
      format: "PDF",
      size: "3.2 MB",
      downloads: 43,
      forClientLevel: "Avancé",
    },
    {
      id: 5,
      title: "Présentation: Parcours complet My Muqabala 3.0",
      category: "Matériels de vente",
      createdAt: "2025-03-10",
      format: "PPTX",
      size: "5.7 MB",
      downloads: 32,
      forClientLevel: "Interne",
    },
  ];

  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 border-primary-200 dark:border-primary-800/30";
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800/30";
      case "purple":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800/30";
      case "blue":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800/30";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30";
      case "indigo":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 border-gray-200 dark:border-gray-800/30";
    }
  };

  // Fonction pour obtenir la couleur du format de fichier
  const getFormatColor = (format: string) => {
    switch (format) {
      case "PDF":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "MP3":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "PPTX":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "DOCX":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "MP4":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  // Fonction pour obtenir la couleur du niveau client
  const getClientLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Intermédiaire":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Avancé":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Interne":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "Tous":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ressources</h1>
        <div className="flex space-x-2">
          <Button variant="primary" size="md">
            Ajouter une ressource
          </Button>
          <Button variant="outline" size="md">
            Importer
          </Button>
        </div>
      </div>

      {/* Catégories de ressources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceCategories.map((category) => (
          <Card
            key={category.id}
            className={`border-l-4 ${getCategoryColor(category.color)}`}
          >
            <Card.Body className="flex items-center p-6">
              <div className="flex-shrink-0 mr-4 text-3xl">{category.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {category.count} ressources
                </p>
              </div>
              <Button variant="outline" size="sm">
                Parcourir
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Recherche et filtres */}
      <Card>
        <Card.Body className="flex flex-wrap gap-4">
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="mb-1 text-sm font-medium">Recherche</label>
            <input
              type="text"
              placeholder="Titre, catégorie ou mot-clé"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[150px]">
            <label className="mb-1 text-sm font-medium">Catégorie</label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700">
              <option value="">Toutes les catégories</option>
              {resourceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1 min-w-[150px]">
            <label className="mb-1 text-sm font-medium">Format</label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700">
              <option value="">Tous les formats</option>
              <option value="pdf">PDF</option>
              <option value="mp3">MP3</option>
              <option value="pptx">PPTX</option>
              <option value="docx">DOCX</option>
              <option value="mp4">MP4</option>
            </select>
          </div>
          <div className="flex flex-col justify-end flex-1 min-w-[120px]">
            <Button variant="secondary" size="md" fullWidth>
              Rechercher
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Ressources récentes */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Ressources récentes</h2>
        </Card.Header>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Titre</th>
                <th className="py-3 px-4 text-left font-medium">Catégorie</th>
                <th className="py-3 px-4 text-left font-medium">Format</th>
                <th className="py-3 px-4 text-left font-medium">Taille</th>
                <th className="py-3 px-4 text-left font-medium">Pour</th>
                <th className="py-3 px-4 text-left font-medium">Téléch.</th>
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentResources.map((resource) => (
                <tr
                  key={resource.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{resource.title}</td>
                  <td className="py-4 px-4">{resource.category}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getFormatColor(
                        resource.format
                      )}`}
                    >
                      {resource.format}
                    </span>
                  </td>
                  <td className="py-4 px-4">{resource.size}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getClientLevelColor(
                        resource.forClientLevel
                      )}`}
                    >
                      {resource.forClientLevel}
                    </span>
                  </td>
                  <td className="py-4 px-4">{resource.downloads}</td>
                  <td className="py-4 px-4">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                      <Button variant="primary" size="sm">
                        Télécharger
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ressources recommandées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Pour les clients en onboarding</h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            {recentResources.slice(0, 3).map((resource) => (
              <div
                key={resource.id}
                className="flex items-start p-3 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="flex-shrink-0 h-12 w-12 rounded flex items-center justify-center text-2xl mr-4">
                  {resource.format === "PDF" && "📄"}
                  {resource.format === "MP3" && "🎵"}
                  {resource.format === "PPTX" && "📊"}
                  {resource.format === "DOCX" && "📝"}
                  {resource.format === "MP4" && "🎬"}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{resource.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex space-x-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getFormatColor(
                          resource.format
                        )}`}
                      >
                        {resource.format}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {resource.size}
                      </span>
                    </div>
                    <Button variant="outline" size="xs">
                      Télécharger
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Pour l'équipe</h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            {recentResources.slice(2, 5).map((resource) => (
              <div
                key={resource.id}
                className="flex items-start p-3 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="flex-shrink-0 h-12 w-12 rounded flex items-center justify-center text-2xl mr-4">
                  {resource.format === "PDF" && "📄"}
                  {resource.format === "MP3" && "🎵"}
                  {resource.format === "PPTX" && "📊"}
                  {resource.format === "DOCX" && "📝"}
                  {resource.format === "MP4" && "🎬"}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{resource.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex space-x-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getFormatColor(
                          resource.format
                        )}`}
                      >
                        {resource.format}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {resource.size}
                      </span>
                    </div>
                    <Button variant="outline" size="xs">
                      Télécharger
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
