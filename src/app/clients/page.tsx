import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Clients() {
  // Données fictives pour les clients
  const clients = [
    {
      id: 1,
      name: "Amina Benzahra",
      email: "amina.b@gmail.com",
      phone: "+33 6 12 34 56 78",
      status: "Onboarding",
      lastContact: "2025-03-01",
      progress: 80,
    },
    {
      id: 2,
      name: "Fatima El Amrani",
      email: "fatima.ea@gmail.com",
      phone: "+33 6 23 45 67 89",
      status: "Conversion",
      lastContact: "2025-03-03",
      progress: 60,
    },
    {
      id: 3,
      name: "Leila Mansouri",
      email: "leila.m@gmail.com",
      phone: "+33 6 34 56 78 90",
      status: "Objections",
      lastContact: "2025-03-04",
      progress: 40,
    },
    {
      id: 4,
      name: "Samira Tazi",
      email: "samira.t@gmail.com",
      phone: "+33 6 45 67 89 01",
      status: "Exécution",
      lastContact: "2025-03-02",
      progress: 30,
    },
    {
      id: 5,
      name: "Nadia Kaddouri",
      email: "nadia.k@gmail.com",
      phone: "+33 6 56 78 90 12",
      status: "Préparation",
      lastContact: "2025-03-05",
      progress: 10,
    },
  ];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Préparation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Exécution":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Objections":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Conversion":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Onboarding":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients CRM</h1>
        <div className="flex space-x-2">
          <Button variant="primary" size="md">
            Ajouter un client
          </Button>
          <Button variant="outline" size="md">
            Importer
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <Card.Body className="flex flex-wrap gap-4">
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="mb-1 text-sm font-medium">Recherche</label>
            <input
              type="text"
              placeholder="Nom, email ou téléphone"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[150px]">
            <label className="mb-1 text-sm font-medium">Statut</label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700">
              <option value="">Tous les statuts</option>
              <option value="preparation">Préparation</option>
              <option value="execution">Exécution</option>
              <option value="objections">Objections</option>
              <option value="conversion">Conversion</option>
              <option value="onboarding">Onboarding</option>
            </select>
          </div>
          <div className="flex flex-col flex-1 min-w-[150px]">
            <label className="mb-1 text-sm font-medium">Date de contact</label>
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div className="flex flex-col justify-end flex-1 min-w-[120px]">
            <Button variant="secondary" size="md" fullWidth>
              Filtrer
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Tableau des clients */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 font-medium">Client</th>
                <th className="py-3 px-4 font-medium">Contact</th>
                <th className="py-3 px-4 font-medium">Statut</th>
                <th className="py-3 px-4 font-medium">Dernier contact</th>
                <th className="py-3 px-4 font-medium">Progression</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {client.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>{client.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {client.phone}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        client.status
                      )}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {new Date(client.lastContact).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-2 bg-primary-500 rounded-full"
                          style={{ width: `${client.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{client.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                      <Button variant="primary" size="sm">
                        Contacter
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Card.Footer className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de 1 à 5 sur 5 clients
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
