// src/components/SeoServicesA.jsx
import axios from "axios";
import React, { useEffect, useMemo, useState, useCallback } from "react";

const SeoServicesA = () => {
  const baseURL = "https://dmcalculator.dentalguru.software";

  // data / state
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // add client
  const [newClientName, setNewClientName] = useState("");
  const [newClientWebsite, setNewClientWebsite] = useState("");
  const [addingClient, setAddingClient] = useState(false);

  // per-client keyword input
  const [keywordTextMap, setKeywordTextMap] = useState({});
  const [addingKeywordForClient, setAddingKeywordForClient] = useState(null);

  // edit client state
  const [editingClientId, setEditingClientId] = useState(null);
  const [editNameMap, setEditNameMap] = useState({});
  const [editWebsiteMap, setEditWebsiteMap] = useState({});
  const [savingEditForClient, setSavingEditForClient] = useState(null);

  // delete keyword state (stores currently deleting keyword id)
  const [deletingKeywordId, setDeletingKeywordId] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Helper: normalize rows returned by API into array of clients w/ keywords
  const normalizeRowsToClients = useCallback((rows) => {
    if (!Array.isArray(rows)) return [];

    const looksNested =
      rows.length && rows[0] && Array.isArray(rows[0].keywords);
    if (looksNested) {
      return rows.map((c) => ({
        id: c.id,
        name: c.name,
        website: c.website,
        keywords: Array.isArray(c.keywords)
          ? c.keywords.map((k) => ({
              id: k.id ?? k.keyword_id ?? null,
              keyword: k.keyword,
              created_at: k.created_at ?? k.keyword_created_at ?? null,
            }))
          : [],
      }));
    }

    const map = new Map();
    rows.forEach((r) => {
      const id = r.client_id ?? r.id ?? r.clientId ?? null;
      const clientKey =
        id !== null && id !== undefined
          ? `id:${id}`
          : `nm:${r.name || ""}|ws:${r.website || ""}`;
      if (!map.has(clientKey)) {
        map.set(clientKey, {
          id: id,
          name: r.name,
          website: r.website,
          keywords: [],
        });
      }
      if (r.keyword) {
        map.get(clientKey).keywords.push({
          id: r.keyword_id ?? r.keywordId ?? null,
          keyword: r.keyword,
          created_at: r.keyword_created_at || r.created_at || null,
        });
      }
    });
    return Array.from(map.values());
  }, []);

  // Fetch clients
  async function fetchClients(signal) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${baseURL}/auth/api/calculator/getSeoClientsWithKeywords`,
        { signal }
      );
      if (!res.ok) {
        let msg = `Server returned ${res.status}`;
        try {
          const js = await res.json();
          if (js && js.message) msg = js.message;
        } catch {
          console.log("catch");
        }
        throw new Error(msg);
      }
      const json = await res.json();
      const rows = json && json.data ? json.data : json;
      const grouped = normalizeRowsToClients(rows || []);
      setClients(grouped);

      const totalPages = Math.max(1, Math.ceil(grouped.length / pageSize));
      if (currentPage > totalPages) setCurrentPage(totalPages);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("fetchClients error:", err);
      setError(err.message || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  }

  // effect: initial fetch (with AbortController)
  useEffect(() => {
    const ac = new AbortController();
    fetchClients(ac.signal);
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset to first page when pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // Add client
  async function handleAddClient(e) {
    e.preventDefault();
    const name = (newClientName || "").trim();
    const website = (newClientWebsite || "").trim();
    if (!name || !website) return alert("Name & Website required");

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlRegex.test(website))
      return alert("Website must include http/https");

    try {
      setAddingClient(true);
      const res = await fetch(
        `${baseURL}/auth/api/calculator/seoClientsDetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, website }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Server ${res.status}`);

      setNewClientName("");
      setNewClientWebsite("");
      await fetchClients();
      setCurrentPage(1);
    } catch (err) {
      console.error("Add client error:", err);
      alert(err.message || "Failed to add client");
    } finally {
      setAddingClient(false);
    }
  }

  // Add keyword for client
  async function handleAddKeyword(e, clientId) {
    e.preventDefault();
    const keywordText = (keywordTextMap[clientId] || "").trim();
    if (!keywordText) return alert("Keyword required");

    try {
      setAddingKeywordForClient(clientId);
      const res = await fetch(
        `${baseURL}/auth/api/calculator/seoWebsiteKeyword/${clientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: keywordText }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Server ${res.status}`);

      setKeywordTextMap((prev) => ({ ...prev, [clientId]: "" }));
      await fetchClients();
    } catch (err) {
      console.error("Add keyword error:", err);
      alert(err.message || "Failed to add keyword");
    } finally {
      setAddingKeywordForClient(null);
    }
  }

  // Edit flows
  function handleEditClick(client) {
    if (!client || !client.id) {
      return alert("Cannot edit this client (missing id). Refresh list.");
    }
    setEditingClientId(client.id);
    setEditNameMap((p) => ({ ...p, [client.id]: client.name || "" }));
    setEditWebsiteMap((p) => ({ ...p, [client.id]: client.website || "" }));
  }

  function handleCancelEdit(clientId) {
    setEditingClientId((cur) => (cur === clientId ? null : cur));
    setEditNameMap((p) => {
      const copy = { ...p };
      delete copy[clientId];
      return copy;
    });
    setEditWebsiteMap((p) => {
      const copy = { ...p };
      delete copy[clientId];
      return copy;
    });
  }

  async function handleSaveEdit(e, clientId) {
    if (e && e.preventDefault) e.preventDefault();
    const name = (editNameMap[clientId] || "").trim();
    const website = (editWebsiteMap[clientId] || "").trim();
    if (!name || !website) return alert("Name & Website are required");

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlRegex.test(website))
      return alert("Website must include http/https");

    try {
      setSavingEditForClient(clientId);
      const res = await fetch(
        `${baseURL}/auth/api/calculator/updateSeoClient/${clientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, website }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Server ${res.status}`);

      setClients((prev) =>
        prev.map((c) => (c.id === clientId ? { ...c, name, website } : c))
      );
      setEditingClientId(null);
      setEditNameMap((p) => {
        const copy = { ...p };
        delete copy[clientId];
        return copy;
      });
      setEditWebsiteMap((p) => {
        const copy = { ...p };
        delete copy[clientId];
        return copy;
      });
    } catch (err) {
      console.error("Save edit error:", err);
      alert(err.message || "Failed to update client");
    } finally {
      setSavingEditForClient(null);
    }
  }

  // Delete keyword handler
  async function handleDeleteKeyword(keywordId, clientId) {
    console.log(keywordId, clientId);

    if (!keywordId) {
      return alert("Cannot delete keyword (missing id).");
    }
    const ok = window.confirm(
      "Delete this keyword? This action cannot be undone."
    );
    if (!ok) return;

    try {
      setDeletingKeywordId(keywordId);
      const res = await fetch(
        `${baseURL}/auth/api/calculator/deleteSeoKeyword/${keywordId}`,
        { method: "DELETE" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Server ${res.status}`);

      // remove from local state (optimistic update confirmed)
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? { ...c, keywords: c.keywords.filter((k) => k.id !== keywordId) }
            : c
        )
      );
    } catch (err) {
      console.error("Delete keyword error:", err);
      alert(err.message || "Failed to delete keyword");
    } finally {
      setDeletingKeywordId(null);
    }
  }

  // Open search in new tab
  function openSearch(keyword) {
    if (!keyword) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(
      keyword
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Pagination computed values
  const totalItems = clients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return clients.slice(start, start + pageSize);
  }, [clients, currentPage, pageSize]);

  console.log(paginatedClients);

  // Helper to render page numbers compacted
  function renderPageNumbers() {
    const pages = [];
    const maxButtons = 7;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);
      pages.push(1);
      if (left > 2) pages.push("left-ellipsis");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("right-ellipsis");
      pages.push(totalPages);
    }

    return pages.map((p, idx) => {
      if (p === "left-ellipsis" || p === "right-ellipsis")
        return (
          <span key={p + idx} className="px-2">
            ...
          </span>
        );
      return (
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className={`px-3 py-1 rounded ${
            p === currentPage ? "bg-blue-600 text-white" : "border bg-white"
          }`}
        >
          {p}
        </button>
      );
    });
  }

  const handleDeleteClient = async (clientID) => {
    try {
      const ok = window.confirm(
        "Are you Sure, Do you want to Delete this Client?"
      );
      if (!ok) return;
      const res = await axios.delete(
        `${baseURL}/auth/api/calculator/deleteSeoClient/${clientID}`
      );
      console.log(res.data);
      if (res.data.status === "Success") {
        alert(`${res.data.message}` || "Client Deleted Successfully");
        fetchClients();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleOpenPagespeedPdf(client) {
    if (!client || !client.website) {
      return alert("Client website not available");
    }
    const pdfUrl = `${baseURL}/auth/api/calculator/pagespeedReportpdf?url=${encodeURIComponent(
      client.website
    )}&strategy=desktop`;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-5xl mx-auto">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">
              SEO Dashboard — Clients & Keywords
            </h1>
            <div className="text-sm text-gray-600">
              API: <code>{baseURL}</code>
            </div>
          </header>

          <section className="mb-6 bg-white p-4 rounded shadow">
            <h2 className="font-medium mb-2">Add new client</h2>
            <form onSubmit={handleAddClient} className="flex gap-2 flex-wrap">
              <input
                className="px-3 py-2 border rounded w-60"
                placeholder="Client name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
              <input
                className="px-3 py-2 border rounded w-96"
                placeholder="Website (https://...)"
                value={newClientWebsite}
                onChange={(e) => setNewClientWebsite(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={addingClient}
              >
                {addingClient ? "Adding..." : "Add Client"}
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">
              Tip: Website must be unique (per DB constraint).
            </p>
          </section>

          <section className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> -{" "}
              <strong>{Math.min(currentPage * pageSize, totalItems)}</strong> of{" "}
              <strong>{totalItems}</strong> clients
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Per page</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </section>

          <section className="mb-6">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : error ? (
              <div className="p-6 bg-red-50 text-red-600 rounded">{error}</div>
            ) : clients.length === 0 ? (
              <div className="p-6 text-gray-600">No clients found.</div>
            ) : (
              <>
                {paginatedClients.map((client) => (
                  <div
                    key={client.id ?? `${client.name}-${client.website}`}
                    className="mb-4 bg-white p-4 rounded shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        {editingClientId === client.id ? (
                          <form
                            onSubmit={(e) => handleSaveEdit(e, client.id)}
                            className="flex flex-col gap-2"
                          >
                            <input
                              className="px-3 py-2 border rounded w-72"
                              value={editNameMap[client.id] ?? ""}
                              onChange={(e) =>
                                setEditNameMap((prev) => ({
                                  ...prev,
                                  [client.id]: e.target.value,
                                }))
                              }
                            />
                            <input
                              className="px-3 py-2 border rounded w-96"
                              value={editWebsiteMap[client.id] ?? ""}
                              onChange={(e) =>
                                setEditWebsiteMap((prev) => ({
                                  ...prev,
                                  [client.id]: e.target.value,
                                }))
                              }
                            />
                            <div className="mt-1 flex gap-2">
                              <button
                                type="submit"
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                disabled={savingEditForClient === client.id}
                              >
                                {savingEditForClient === client.id
                                  ? "Saving..."
                                  : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelEdit(client.id)}
                                className="px-3 py-1 border rounded"
                                disabled={savingEditForClient === client.id}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="text-lg font-semibold">
                              {client.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {client.website}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-3 text-sm text-gray-500">
                        <div>Keywords: {client.keywords.length}</div>

                        {editingClientId !== client.id && client.id && (
                          <button
                            onClick={() => handleEditClick(client)}
                            className="px-3 py-1 border rounded text-sm"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => handleOpenPagespeedPdf(client)}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Download Report
                        </button>

                        {/* <button
                          onClick={async () => {
                            const res = await fetch(
                              `http://localhost:5555/auth/api/calculator/pagespeedReportpdf?url=${client.website}`
                            );
                            const blob = await res.blob();
                            const link = document.createElement("a");
                            link.href = window.URL.createObjectURL(blob);
                            link.download = "seo-report.pdf";
                            link.click();
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Download SEO Report
                        </button> */}
                      </div>
                    </div>

                    <div className="mt-3">
                      <form
                        onSubmit={(e) => handleAddKeyword(e, client.id)}
                        className="flex gap-2"
                      >
                        <input
                          className="flex-1 px-3 py-2 border rounded"
                          placeholder="Add keyword for this client"
                          value={keywordTextMap[client.id] || ""}
                          onChange={(e) =>
                            setKeywordTextMap((prev) => ({
                              ...prev,
                              [client.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="px-4 py-2 bg-green-600 text-white rounded"
                          disabled={addingKeywordForClient === client.id}
                        >
                          {addingKeywordForClient === client.id
                            ? "Adding..."
                            : "Add"}
                        </button>
                      </form>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {client.keywords.map((k) => (
                        <div
                          key={k.id ?? k.keyword}
                          className="flex items-center gap-2 border rounded px-3 py-2"
                        >
                          <button
                            onClick={() => openSearch(k.keyword)}
                            className="text-sm hover:underline"
                          >
                            🔎 {k.keyword}
                          </button>
                          <span className="text-xs text-gray-400">
                            {k.created_at
                              ? new Date(k.created_at).toLocaleString()
                              : ""}
                          </span>

                          {/* Delete keyword button */}
                          <button
                            onClick={() => handleDeleteKeyword(k.id, client.id)}
                            className="ml-2 text-sm px-2 py-1 border rounded"
                            disabled={deletingKeywordId === k.id}
                            title="Delete keyword"
                          >
                            {deletingKeywordId === k.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Note: To open results in <strong>incognito</strong>{" "}
                      automatically you need a browser extension / Electron
                      helper. This dashboard opens search in a new normal tab.
                    </div>
                  </div>
                ))}

                {/* Pagination controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <div className="flex items-center gap-1">
                      {renderPageNumbers()}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Last
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </>
            )}
          </section>

          <footer className="text-center text-sm text-gray-500 mt-6">
            Built quick — update <code>API_BASE</code> at top if your backend
            path differs.
          </footer>
        </div>
      </div>
    </>
  );
};

export default SeoServicesA;
