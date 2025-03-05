import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Appointments() {
  // Donnu00e9es fictives pour les rendez-vous
  const appointments = [
    {
      id: 1,
      clientName: "Amina Benzahra",
      date: "2025-03-15T10:00:00",
      duration: 60,
      type: "Coaching spirituel",
      status: "Confirmu00e9",
      notes: "Session de suivi sur le travail au coeur",
    },
    {
      id: 2,
      clientName: "Fatima El Amrani",
      date: "2025-03-15T13:30:00",
      duration: 45,
      type: "Diagnostic",
      status: "Confirmu00e9",
      notes: "Premier diagnostic, exploration des attentes",
    },
    {
      id: 3,
      clientName: "Leila Mansouri",
      date: "2025-03-16T11:00:00",
      duration: 90,
      type: "Coaching complet",
      status: "En attente",
      notes: "Session avec lu00e9gu00e8re anxiety face au changement",
    },
    {
      id: 4,
      clientName: "Samira Tazi",
      date: "2025-03-16T15:00:00",
      duration: 30,
      type: "Coaching rapide",
      status: "Confirmu00e9",
      notes: "Suivi des exercices spirituels quotidiens",
    },
    {
      id: 5,
      clientName: "Nadia Kaddouri",
      date: "2025-03-17T09:30:00",
      duration: 60,
      type: "Coaching spirituel",
      status: "Confirmu00e9",
      notes: "Apru00e8s deux semaines de pratique regu00e9liu00e8re",
    },
  ];

  // Fonction pour formater l'heure
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmu00e9":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "En attente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Annulu00e9":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  // Fonction pour obtenir la couleur du type de rendez-vous
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Coaching spirituel":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300";
      case "Diagnostic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Coaching complet":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Coaching rapide":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  // Regrouper les rendez-vous par date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as { [key: string]: typeof appointments });

  // Trier les dates
  const sortedDates = Object.keys(appointmentsByDate).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Rendez-vous</h1>
        <div className="flex space-x-2">
          <Button variant="primary" size="md">
            Nouveau rendez-vous
          </Button>
          <Button variant="outline" size="md">
            Synchroniser l'agenda
          </Button>
        </div>
      </div>

      {/* Vue du jour */}
      <Card>
        <Card.Header className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Aujourd'hui</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString([], {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              &lt; Pru00e9cu00e9dent
            </Button>
            <Button variant="outline" size="sm">
              Suivant &gt;
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-col space-y-6">
            {appointmentsByDate[sortedDates[0]]?.length > 0 ? (
              appointmentsByDate[sortedDates[0]]
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
                  >
                    <div className="sm:w-24 text-center py-2 px-4 rounded-md bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300">
                      <div className="text-xl font-bold">
                        {formatTime(appointment.date)}
                      </div>
                      <div className="text-sm">
                        {appointment.duration} min
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {appointment.clientName}
                        </h3>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(
                            appointment.type
                          )}`}
                        >
                          {appointment.type}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {appointment.notes}
                      </p>
                    </div>

                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <Button variant="outline" size="sm">
                        Notes
                      </Button>
                      <Button variant="primary" size="sm">
                        Du00e9marrer
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Aucun rendez-vous aujourd'hui
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Calendrier de la semaine */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Cette semaine</h2>
        </Card.Header>
        <div className="overflow-x-auto">
          <div className="p-6 min-w-[800px]">
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const date = new Date();
                date.setDate(date.getDate() - date.getDay() + dayIndex);
                const dateStr = date.toISOString().split("T")[0];
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={dayIndex}
                    className={`rounded-lg border ${isToday ? "border-primary-500 dark:border-primary-400" : "border-gray-200 dark:border-gray-700"} h-full`}
                  >
                    <div
                      className={`text-center p-2 font-medium ${isToday ? "bg-primary-50 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300" : "bg-gray-50 dark:bg-gray-800"} rounded-t-lg`}
                    >
                      <div className="text-sm">
                        {date.toLocaleDateString([], { weekday: "short" })}
                      </div>
                      <div
                        className={`text-lg ${isToday ? "font-bold" : ""}`}
                      >
                        {date.getDate()}
                      </div>
                    </div>
                    <div className="p-2 space-y-2">
                      {appointmentsByDate[dateStr]?.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`p-2 rounded text-xs ${getTypeColor(appointment.type)} hover:opacity-90 cursor-pointer`}
                        >
                          <div className="font-medium">
                            {formatTime(appointment.date)}
                          </div>
                          <div className="truncate">
                            {appointment.clientName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Liste des prochains rendez-vous */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Prochains rendez-vous</h2>
        </Card.Header>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Client</th>
                <th className="py-3 px-4 text-left font-medium">Date & Heure</th>
                <th className="py-3 px-4 text-left font-medium">Type</th>
                <th className="py-3 px-4 text-left font-medium">Duru00e9e</th>
                <th className="py-3 px-4 text-left font-medium">Statut</th>
                <th className="py-3 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">
                    {appointment.clientName}
                  </td>
                  <td className="py-4 px-4">
                    <div>{formatDate(appointment.date)}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatTime(appointment.date)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(
                        appointment.type
                      )}`}
                    >
                      {appointment.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">{appointment.duration} minutes</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="primary" size="sm">
                        Du00e9tails
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
