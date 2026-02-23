import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditEvent } from "@shared/schema";

export default function CrmAdminAudit() {
  const { data: events = [], isLoading } = useQuery<AuditEvent[]>({ queryKey: ["/api/crm/admin/audit"] });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="crm-admin-audit">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Log</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left p-3 font-medium text-slate-500">Action</th>
                  <th className="text-left p-3 font-medium text-slate-500">Entity</th>
                  <th className="text-left p-3 font-medium text-slate-500 hidden md:table-cell">User ID</th>
                  <th className="text-left p-3 font-medium text-slate-500">Time</th>
                  <th className="text-left p-3 font-medium text-slate-500 hidden lg:table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">No audit events yet</td></tr>
                ) : events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-slate-50/50" data-testid={`row-audit-${event.id}`}>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        event.action.includes("create") ? "bg-green-100 text-green-700" :
                        event.action.includes("update") ? "bg-blue-100 text-blue-700" :
                        event.action.includes("reassign") ? "bg-purple-100 text-purple-700" :
                        event.action.includes("delete") ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {event.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {event.entityType} #{event.entityId}
                    </td>
                    <td className="p-3 hidden md:table-cell text-slate-500">
                      User #{event.actorUserId}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {new Date(event.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      {event.afterJson ? (
                        <details className="cursor-pointer">
                          <summary className="text-xs text-blue-600">View changes</summary>
                          <pre className="mt-1 text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded max-w-xs overflow-auto max-h-32">
                            {JSON.stringify(event.afterJson, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
