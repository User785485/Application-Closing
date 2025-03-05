"use client";

import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Scripts() {
  // Donnu00e9es fictives pour les scripts
  const scripts = [
    {
      id: 1,
      name: "Script de vente Elite - My Muqabala 3.0",
      version: "3.1",
      lastUpdated: "2025-02-15",
      conversionRate: 68,
      category: "Vente principale",
      stages: [
        "Pru00e9paration",
        "Connexion",
        "Cadre",
        "Motivations",
        "Diagnostic",
        "Forces",
        "Acceptation",
        "Pru00e9sentation",
        "Du00e9tails",
        "Offre Premium",
        "Offre Intermu00e9diaire",
        "Offre Essentielle",
        "Objections",
        "Clu00f4ture",
        "Onboarding",
      ],
    },
    {
      id: 2,
      name: "Script de suivi - Ru00e9activation",
      version: "1.4",
      lastUpdated: "2025-01-28",
      conversionRate: 45,
      category: "Suivi",
      stages: [
        "Introduction",
        "Rappel valeur",
        "Nouveau bu00e9nu00e9fice",
        "Tu00e9moignage",
        "Offre limitu00e9e",
        "Clu00f4ture",
      ],
    },
    {
      id: 3,
      name: "Script de diagnostic - Analyse initiale",
      version: "2.0",
      lastUpdated: "2025-03-01",
      conversionRate: 72,
      category: "Diagnostic",
      stages: [
        "Accueil",
        "Cadre",
        "Questions clu00e9s",
        "Analyse",
        "Recommandation",
        "Invitation",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scripts de vente</h1>
        <div className="flex space-x-2">
          <Button variant="primary" size="md">
            Cru00e9er un script
          </Button>
          <Button variant="outline" size="md">
            Importer
          </Button>
        </div>
      </div>

      {/* Aperu00e7u du script principal */}
      <Card className="bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/30 dark:to-slate-800 border-l-4 border-primary-500">
        <Card.Body className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300">
                Script de vente Elite - My Muqabala 3.0
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Script optimisu00e9 avec une approche en 15 blocs pour maximiser les
                conversions. Taux de conversion actuel: 68%
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {scripts[0].stages.slice(0, 5).map((stage, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
                  >
                    {stage}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  +{scripts[0].stages.length - 5} u00e9tapes
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="md">
                u00c9diter
              </Button>
              <Button variant="outline" size="md">
                Utiliser
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Liste des scripts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scripts.map((script) => (
          <Card key={script.id} className="h-full">
            <Card.Header className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{script.name}</h3>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Version {script.version} - Mis u00e0 jour le{" "}
                  {new Date(script.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  script.conversionRate >= 60
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : script.conversionRate >= 40
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {script.conversionRate}% conversion
              </span>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {script.category}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Structure du script</h4>
                <div className="flex items-center mb-4">
                  {script.stages.map((stage, index) => (
                    <div
                      key={index}
                      className="relative flex-1"
                    >
                      <div className="h-2 bg-primary-200 dark:bg-primary-900/30">
                        <div
                          className="h-2 bg-primary-500"
                          style={{
                            width: `${(index + 1) / script.stages.length * 100}%`,
                          }}
                        ></div>
                      </div>
                      {index === 0 || index === script.stages.length - 1 || index === Math.floor(script.stages.length / 2) ? (
                        <div className="absolute -bottom-6 text-xs transform -translate-x-1/2" style={{ left: `${index === 0 ? 0 : index === script.stages.length - 1 ? 100 : 50}%` }}>
                          {stage}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="flex justify-between">
              <Button variant="outline" size="sm">
                Voir les du00e9tails
              </Button>
              <Button variant="primary" size="sm">
                u00c9diter
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* u00c9tapes du script actif */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Flow du script actif</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4 overflow-x-auto py-4">
            {scripts[0].stages.map((stage, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 p-4 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {index === 0 ? "Du00e9but" : index === scripts[0].stages.length - 1 ? "Fin" : ""}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{stage}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {index === 0 && "Analyse du diagnostic et pru00e9paration stratu00e9gique"}
                  {index === 1 && "Cru00e9er un lien de confiance authentique"}
                  {index === 2 && "u00c9tablir le cadre de la conversation"}
                  {index === 3 && "Explorer les motivations profondes"}
                  {index === scripts[0].stages.length - 1 && "Planification de l'onboarding client"}
                </p>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
