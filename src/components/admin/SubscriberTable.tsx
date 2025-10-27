import { Badge } from "@/components/ui/badge";
import type { Subscriber } from "@/app/admin/(protected)/DashboardPage";

interface SubscriberTableProps {
  subscribers: Subscriber[];
  sortField: keyof Subscriber;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Subscriber) => void;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (id: string) => void;
}

export function SubscriberTable({
  subscribers,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete
}: SubscriberTableProps) {
  const SortIcon = ({ field }: { field: keyof Subscriber }) => {
    if (sortField !== field) {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-30"
        >
          <path
            d="M8 9L12 5L16 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 15L12 19L16 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 9L12 5L16 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 15L12 19L16 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Active
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            Unpaid
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            Paused
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Cancelled
          </span>
        );
      default:
        return <Badge tone="ink">{status}</Badge>;
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-ink)]/10">
              <th className="text-left py-4 px-3">
                <button
                  onClick={() => onSort("name")}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  Name
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left py-4 px-3">
                <button
                  onClick={() => onSort("email")}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  Email
                  <SortIcon field="email" />
                </button>
              </th>
              <th className="text-left py-4 px-3">
                <button
                  onClick={() => onSort("plan")}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  Plan
                  <SortIcon field="plan" />
                </button>
              </th>
              <th className="text-left py-4 px-3">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left py-4 px-3">
                <button
                  onClick={() => onSort("mrr")}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  MRR
                  <SortIcon field="mrr" />
                </button>
              </th>
              <th className="text-left py-4 px-3">
                <button
                  onClick={() => onSort("nextBillingDate")}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  Next Billing
                  <SortIcon field="nextBillingDate" />
                </button>
              </th>
              <th className="text-left py-4 px-3">
                <button
                  onClick={() => onSort("startDate")}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  Start Date
                  <SortIcon field="startDate" />
                </button>
              </th>
              <th className="text-right py-4 px-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber, index) => (
              <tr
                key={subscriber.id}
                className={`border-b border-[var(--color-ink)]/5 hover:bg-[var(--color-porcelain)]/30 transition-colors ${
                  index === subscribers.length - 1 ? "border-0" : ""
                }`}
              >
                <td className="py-4 px-3">
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {subscriber.name}
                  </p>
                </td>
                <td className="py-4 px-3">
                  <p className="text-sm text-[var(--color-ink)]/70">{subscriber.email}</p>
                </td>
                <td className="py-4 px-3">
                  <p className="text-sm text-[var(--color-ink)]">{subscriber.planName}</p>
                </td>
                <td className="py-4 px-3">{getStatusBadge(subscriber.status)}</td>
                <td className="py-4 px-3">
                  <p className="text-sm font-medium text-[var(--color-accent)]">
                    ${subscriber.mrr}
                  </p>
                </td>
                <td className="py-4 px-3">
                  <p className="text-sm text-[var(--color-ink)]/70">
                    {new Date(subscriber.nextBillingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </td>
                <td className="py-4 px-3">
                  <p className="text-sm text-[var(--color-ink)]/70">
                    {new Date(subscriber.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(subscriber)}
                      className="p-2 text-[var(--color-accent)] hover:bg-[var(--color-porcelain)] rounded-lg transition-colors"
                      title="Edit subscriber"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(subscriber.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete subscriber"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 6H5H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {subscribers.map(subscriber => (
          <div
            key={subscriber.id}
            className="bg-[var(--color-porcelain)]/30 rounded-xl p-5 border border-[var(--color-ink)]/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-base font-medium text-[var(--color-ink)] mb-1">
                  {subscriber.name}
                </p>
                <p className="text-sm text-[var(--color-ink)]/60">{subscriber.email}</p>
              </div>
              {getStatusBadge(subscriber.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1">
                  Plan
                </p>
                <p className="text-sm text-[var(--color-ink)]">{subscriber.planName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1">
                  MRR
                </p>
                <p className="text-sm font-medium text-[var(--color-accent)]">
                  ${subscriber.mrr}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1">
                  Next Billing
                </p>
                <p className="text-sm text-[var(--color-ink)]/70">
                  {new Date(subscriber.nextBillingDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1">
                  Started
                </p>
                <p className="text-sm text-[var(--color-ink)]/70">
                  {new Date(subscriber.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-[var(--color-ink)]/10">
              <button
                onClick={() => onEdit(subscriber)}
                className="flex-1 bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-accent)]/90 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(subscriber.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {subscribers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--color-ink)]/60 text-base">No subscribers found</p>
        </div>
      )}
    </>
  );
}

