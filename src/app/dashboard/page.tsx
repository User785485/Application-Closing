"use client";

import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex space-x-2">
          <Button variant="primary" size="md">
            Nouveau client
          </Button>
          <Button variant="outline" size="md">
            Exporter les statistiques
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Clients actifs" 
          value="47" 
          change="+12%" 
          changeType="positive" 
          icon={<UserIcon />}
          color="primary"
        />
        <StatCard 
          title="Taux de conversion" 
          value="68%" 
          change="+5%" 
          changeType="positive" 
          icon={<ChartIcon />}
          color="success"
        />
        <StatCard 
          title="Appels u00e0 venir" 
          value="12" 
          change="-3" 
          changeType="negative" 
          icon={<CalendarIcon />}
          color="secondary"
        />
        <StatCard 
          title="Objections gu00e9ru00e9es" 
          value="86%" 
          change="+2%" 
          changeType="positive" 
          icon={<ShieldIcon />}
          color="danger"
        />
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <h2 className="text-xl font-semibold">Performance des scripts par u00e9tape</h2>
          </Card.Header>
          <Card.Body>
            <div className="h-80 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-gray-500 dark:text-gray-400">Graphique des performances par u00e9tape du script</p>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Clients ru00e9cents</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((id) => (
                <div key={id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">SC</span>
                    </div>
                    <div>
                      <p className="font-medium">Sara Client {id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">u00c9tape: Pru00e9paration</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Voir</Button>
                </div>
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant="ghost" fullWidth>
              Voir tous les clients
            </Button>
          </Card.Footer>
        </Card>
        
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Appels u00e0 venir</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((id) => (
                <div key={id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <p className="font-medium">Appel de du00e9couverte {id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(Date.now() + id * 24 * 60 * 60 * 1000).toLocaleDateString()} - 14:00
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Pru00e9parer</Button>
                </div>
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant="ghost" fullWidth>
              Voir tous les rendez-vous
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success" | "danger";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, color }) => {
  const getChangeColorClass = () => {
    switch (changeType) {
      case "positive":
        return "text-success-600 dark:text-success-400";
      case "negative":
        return "text-danger-600 dark:text-danger-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getBackgroundColorClass = () => {
    switch (color) {
      case "primary":
        return "bg-primary-50 dark:bg-primary-900/20";
      case "secondary":
        return "bg-secondary-50 dark:bg-secondary-900/20";
      case "success":
        return "bg-success-50 dark:bg-success-900/20";
      case "danger":
        return "bg-danger-50 dark:bg-danger-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-800";
    }
  };

  const getIconColorClass = () => {
    switch (color) {
      case "primary":
        return "text-primary-600 dark:text-primary-400";
      case "secondary":
        return "text-secondary-600 dark:text-secondary-400";
      case "success":
        return "text-success-600 dark:text-success-400";
      case "danger":
        return "text-danger-600 dark:text-danger-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
            <p className={`mt-1 text-sm ${getChangeColorClass()}`}>
              {change} {changeType === "positive" ? "↑" : changeType === "negative" ? "↓" : ""}
            </p>
          </div>
          <div className={`${getBackgroundColorClass()} p-3 rounded-full`}>
            <div className={`h-6 w-6 ${getIconColorClass()}`}>{icon}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);
