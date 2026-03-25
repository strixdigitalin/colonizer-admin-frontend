import { useState, useMemo } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentScanner } from "@mui/icons-material";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import SearchIcon from "@mui/icons-material/Search";

/* A plot is considered "updated" if any of these key fields are filled */
const isPlotUpdated = (p) =>
  (p.plotArea && p.plotArea !== "—") ||
  (p.plotSize && p.plotSize !== "—") ||
  (p.facing && p.facing !== "—") ||
  (p.pricePerSqft && p.pricePerSqft !== "—");

const FILTER_TABS = [
  { key: "all",         label: "All" },
  { key: "updated",     label: "Updated" },
  { key: "not_updated", label: "Not Updated" },
  { key: "available",   label: "Available" },
  { key: "hold",        label: "Hold" },
  { key: "sold",        label: "Sold" },
];

const PlotTable = ({ data, isLoading, onEdit, onDocuments, onBulkUpdate }) => {
  const [selected, setSelected]       = useState(new Set());
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortKey, setSortKey]         = useState("index");
  const [sortDir, setSortDir]         = useState("asc");
  const [page, setPage]               = useState(1);
  // const PAGE_SIZE = 15;
  const PAGE_SIZE = 100;

  /* ── Tab counts ── */
  const counts = useMemo(() => ({
    all:         data.length,
    updated:     data.filter(isPlotUpdated).length,
    not_updated: data.filter((p) => !isPlotUpdated(p)).length,
    available:   data.filter((p) => p.status === "available").length,
    hold:        data.filter((p) => p.status === "hold").length,
    sold:        data.filter((p) => p.status === "sold").length,
  }), [data]);

  /* ── Filter by tab then search ── */
  const filtered = useMemo(() => {
    let base = data;
    if (activeFilter === "updated")     base = data.filter(isPlotUpdated);
    if (activeFilter === "not_updated") base = data.filter((p) => !isPlotUpdated(p));
    if (activeFilter === "available")   base = data.filter((p) => p.status === "available");
    if (activeFilter === "hold")        base = data.filter((p) => p.status === "hold");
    if (activeFilter === "sold")        base = data.filter((p) => p.status === "sold");

    const q = search.toLowerCase();
    return base.filter(
      (p) =>
        !q ||
        String(p.plotNumber).toLowerCase().includes(q) ||
        String(p.plotAreaDisplay).toLowerCase().includes(q) ||
        String(p.facingDisplay).toLowerCase().includes(q) ||
        String(p.status).toLowerCase().includes(q)
    );
  }, [data, search, activeFilter]);

  /* ── Sort ── */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData   = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Checkbox logic ── */
  const pageIds        = pageData.map((p) => p._id);
  const allPageChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someSelected   = selected.size > 0;

  const toggleAll = () => {
    if (allPageChecked) {
      setSelected((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  /* Select every plot in the current filtered view (all pages) */
  const selectAllFiltered = () => {
    setSelected(new Set(filtered.map((p) => p._id)));
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((p) => selected.has(p._id));

  const selectedPlots = data.filter((p) => selected.has(p._id));

  /* ── Sort toggle ── */
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortArrow = ({ col }) =>
    sortKey === col ? (
      <span className="ml-1 text-blue-500">{sortDir === "asc" ? "↑" : "↓"}</span>
    ) : (
      <span className="ml-1 text-gray-300">↕</span>
    );

  const headers = [
    { label: "S.NO",        key: "index" },
    { label: "Plot No.",    key: "plotNumber" },
    { label: "Status",      key: "status" },
    { label: "Shape",       key: null },
    { label: "Area",        key: "plotAreaDisplay" },
    { label: "Size (sqft)", key: "plotSizeDisplay" },
    { label: "Facing",      key: "facingDisplay" },
    { label: "₹/sqft",     key: "pricePerSqftDisplay" },
    { label: "Total Price", key: "totalPriceDisplay" },
    { label: "Created",     key: "createdAt" },
    { label: "Actions",     key: null },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading plots…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
        {FILTER_TABS.map(({ key, label }) => {
          const active = activeFilter === key;
          const tabColors = {
            all:         active ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600 hover:border-gray-400",
            updated:     active ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-200 text-gray-600 hover:border-emerald-400",
            not_updated: active ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-400",
            available:   active ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-400",
            hold:        active ? "bg-yellow-500 text-white border-yellow-500" : "border-gray-200 text-gray-600 hover:border-yellow-400",
            sold:        active ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600 hover:border-red-400",
          };
          return (
            <button
              key={key}
              onClick={() => { setActiveFilter(key); setPage(1); clearSelection(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${tabColors[key]}`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Search */}
        <div className="relative">
          <SearchIcon
            fontSize="small"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search plots…"
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Select all filtered */}
          {filtered.length > 0 && (
            <button
              onClick={allFilteredSelected ? clearSelection : selectAllFiltered}
              className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition"
            >
              {allFilteredSelected
                ? `Deselect all ${filtered.length}`
                : `Select all ${filtered.length}`}
            </button>
          )}

          {/* Bulk action bar */}
          {someSelected && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
              <span className="text-sm font-semibold text-blue-700">
                {selected.size} selected
              </span>
              <button
                onClick={() => onBulkUpdate(selectedPlots)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                <SystemUpdateAltIcon fontSize="inherit" />
                Bulk Update
              </button>
              <button
                onClick={clearSelection}
                className="text-xs text-blue-500 hover:text-blue-700 underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {/* Checkbox column */}
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allPageChecked}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  title="Select all on this page"
                />
              </th>
              {headers.map(({ label, key }) => (
                <th
                  key={label}
                  onClick={() => key && handleSort(key)}
                  className={`px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap
                    ${key ? "cursor-pointer hover:text-gray-700 select-none" : ""}`}
                >
                  {label}
                  {key && <SortArrow col={key} />}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="text-center py-14 text-gray-400">
                  No plots found.
                </td>
              </tr>
            ) : (
              pageData.map((plot) => {
                const isChecked = selected.has(plot._id);
                return (
                  <tr
                    key={plot._id}
                    className={`transition-colors ${isChecked ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                  >
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRow(plot._id)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">{plot.index}</td>
                    <td className="px-3 py-2.5 font-semibold text-gray-800">{plot.plotNumber || "—"}</td>
                    <td className="px-3 py-2.5">{plot.statusBadge}</td>
                    <td className="px-3 py-2.5">{plot.shapeTypeBadge}</td>
                    <td className="px-3 py-2.5 text-gray-600">{plot.plotAreaDisplay}</td>
                    <td className="px-3 py-2.5 text-gray-600">{plot.plotSizeDisplay}</td>
                    <td className="px-3 py-2.5 text-gray-600">{plot.facingDisplay}</td>
                    <td className="px-3 py-2.5 text-gray-600">{plot.pricePerSqftDisplay}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-700">{plot.totalPriceDisplay}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{plot.createdAt}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(plot)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => onDocuments(plot)}
                          title="Documents"
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <DocumentScanner fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500 pt-1">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded-lg border transition ${
                      page === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlotTable;
