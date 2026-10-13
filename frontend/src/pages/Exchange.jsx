

import { useCallback, useEffect, useMemo, useState } from "react";

import API from "../services/api";

import "./Exchange.css";



const FILTERS = ["All", "Pending", "Accepted", "Rejected", "Completed"];



function getId(value) {

  if (!value) return "";

  if (typeof value === "string") return value;

  return value._id || value.id || "";

}



function getCurrentUserId() {

  const directId = localStorage.getItem("userId");

  if (directId) return directId;



  try {

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return getId(user);

  } catch {

    return "";

  }

}



function Exchange() {

  const [requests, setRequests] = useState([]);

  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionId, setActionId] = useState("");

  const [notice, setNotice] = useState("");



  const currentUserId = getCurrentUserId();



  const fetchRequests = useCallback(async () => {

    setLoading(true);

    setError("");



    try {

      const token = localStorage.getItem("token");



      if (!token) {

        setError("Please log in to view exchange requests.");

        return;

      }



      const response = await API.get("/exchanges", {

        headers: { Authorization: `Bearer ${token}` },

      });



      const data = response.data;

      setRequests(Array.isArray(data) ? data : data.requests || []);

    } catch (err) {

      setError(

        err.response?.data?.message ||

          "Could not load exchange requests. Please try again."

      );

    } finally {

      setLoading(false);

    }

  }, []);



  useEffect(() => {
    let cancelled = false;

    const loadRequests = async () => {
      setError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          if (!cancelled) {
            setError("Please log in to view exchange requests.");
            setLoading(false);
          }
          return;
        }

        const response = await API.get("/exchanges", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) {
          const data = response.data;
          setRequests(Array.isArray(data) ? data : data.requests || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Could not load exchange requests. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      cancelled = true;
    };
  }, []);



  const filteredRequests = useMemo(() => {

    if (activeFilter === "All") return requests;



    return requests.filter(

      (request) =>

        request.status?.toLowerCase() === activeFilter.toLowerCase()

    );

  }, [requests, activeFilter]);



  const counts = useMemo(() => {

    const result = { All: requests.length };



    FILTERS.slice(1).forEach((status) => {

      result[status] = requests.filter(

        (request) =>

          request.status?.toLowerCase() === status.toLowerCase()

      ).length;

    });



    return result;

  }, [requests]);



  const handleAction = async (request, action) => {

    const requestId = request._id;

    setActionId(`${requestId}-${action}`);

    setError("");

    setNotice("");



    try {

      const token = localStorage.getItem("token");



      await API.patch(

        `/exchanges/${requestId}/${action}`,

        {},

        { headers: { Authorization: `Bearer ${token}` } }

      );



      const messages = {

        accept: "Exchange request accepted successfully.",

        reject: "Exchange request rejected.",

        complete: "Exchange marked as completed!",

      };



      setNotice(messages[action]);

      await fetchRequests();

    } catch (err) {

      setError(

        err.response?.data?.message ||

          "Action failed. Please try again."

      );

    } finally {

      setActionId("");

    }

  };



  if (loading) {

    return (

      <main className="exchange-page">

        <div className="exchange-loading">

          <span className="exchange-spinner" />

          <p>Loading your exchange requests...</p>

        </div>

      </main>

    );

  }



  return (

    <main className="exchange-page">

      <section className="exchange-container">

        <header className="exchange-header">

          <div>

            <span className="exchange-eyebrow">

              <span>🌿</span> ECOLOOP MARKETPLACE

            </span>

            <h1>Exchange Requests</h1>

            <p>

              Manage your requests and give pre-loved items a new life.

            </p>

          </div>



          <button

            className="exchange-refresh"

            onClick={fetchRequests}

            disabled={loading || Boolean(actionId)}

          >

            ↻ Refresh

          </button>

        </header>



        <section className="exchange-summary">

          <div className="summary-icon">♻</div>

          <div>

            <strong>{requests.length} requests</strong>

            <p>Every exchange is a step towards less waste.</p>

          </div>

        </section>



        {notice && (

          <div className="exchange-alert success" role="status">

            <span>✓</span> {notice}

            <button onClick={() => setNotice("")} aria-label="Dismiss">

              ×

            </button>

          </div>

        )}



        {error && (

          <div className="exchange-alert error" role="alert">

            <span>!</span> {error}

            <button onClick={() => setError("")} aria-label="Dismiss">

              ×

            </button>

          </div>

        )}



        <nav className="exchange-filters" aria-label="Filter requests">

          {FILTERS.map((filter) => (

            <button

              key={filter}

              className={`exchange-filter ${

                activeFilter === filter ? "active" : ""

              }`}

              onClick={() => setActiveFilter(filter)}

            >

              {filter}

              <span>{counts[filter]}</span>

            </button>

          ))}

        </nav>



        {filteredRequests.length === 0 ? (

          <section className="exchange-empty">

            <div className="empty-icon">🌱</div>

            <h2>

              {activeFilter === "All"

                ? "No exchange requests yet"

                : `No ${activeFilter.toLowerCase()} requests`}

            </h2>

            <p>

              {activeFilter === "All"

                ? "When someone requests an exchange for your item, or you request another item's exchange, it will appear here."

                : "Try another filter to see your exchange requests."}

            </p>



            {activeFilter !== "All" && (

              <button

                className="exchange-primary-btn"

                onClick={() => setActiveFilter("All")}

              >

                View all requests

              </button>

            )}

          </section>

        ) : (

          <section className="exchange-grid">

            {filteredRequests.map((request) => {

              const ownerId = getId(request.owner);

              const requesterId = getId(request.requester);

              const item = request.item || {};

              const isOwner =

                Boolean(currentUserId) && ownerId === currentUserId;
              console.log("EXCHANGE DEBUG:", {
  currentUserId,
  owner: request.owner,
  ownerId,
  requester: request.requester,
  requesterId,
  status: request.status,
});

              const isRequester =

                Boolean(currentUserId) && requesterId === currentUserId;

              const status = request.status || "Pending";

              const busy = actionId.startsWith(`${request._id}-`);



              return (

                <article className="exchange-card" key={request._id}>

                  <div className="exchange-card-top">

                    <span className="exchange-type">♻ Item Exchange</span>

                    <span

                      className={`exchange-status status-${status.toLowerCase()}`}

                    >

                      <span className="status-dot" />

                      {status}

                    </span>

                  </div>



                  <div className="exchange-item">

                    {item.image ? (

                      <img

                        className="exchange-item-image"

                        src={item.image}

                        alt={item.title || "Exchange item"}

                      />

                    ) : (

                      <div className="exchange-item-placeholder">🌿</div>

                    )}



                    <div className="exchange-item-info">

                      <h2>{item.title || "Item unavailable"}</h2>

                      <p>{item.category || "General item"}</p>

                      {item.status && (

                        <span className="item-availability">

                          Item: {item.status}

                        </span>

                      )}

                    </div>

                  </div>



                  <div className="exchange-people">

                    <div className="person-row">

                      <span className="person-avatar">👤</span>

                      <div>

                        <small>Requested by</small>

                        <strong>

                          {request.requester?.name || "User"}

                          {isRequester ? " (You)" : ""}

                        </strong>

                      </div>

                    </div>



                    <div className="person-row">

                      <span className="person-avatar">🏡</span>

                      <div>

                        <small>Item owner</small>

                        <strong>

                          {request.owner?.name || "Item owner"}

                          {isOwner ? " (You)" : ""}

                        </strong>

                      </div>

                    </div>

                  </div>



                  <div className="exchange-message">

                    <span>Message</span>

                    <p>{request.message || "No message added."}</p>

                  </div>



                  <div className="exchange-card-footer">

                    <span className="exchange-date">

                      {request.createdAt

                        ? new Date(request.createdAt).toLocaleDateString(

                            "en-IN",

                            {

                              day: "numeric",

                              month: "short",

                              year: "numeric",

                            }

                          )

                        : "Recent request"}

                    </span>



                    {isOwner && status === "Pending" && (

                      <div className="exchange-actions">

                        <button

                          className="exchange-primary-btn"

                          disabled={busy || Boolean(actionId)}

                          onClick={() => handleAction(request, "accept")}

                        >

                          {actionId === `${request._id}-accept`

                            ? "Accepting..."

                            : "✓ Accept"}

                        </button>

                        <button

                          className="exchange-reject-btn"

                          disabled={busy || Boolean(actionId)}

                          onClick={() => handleAction(request, "reject")}

                        >

                          {actionId === `${request._id}-reject`

                            ? "Rejecting..."

                            : "✕ Reject"}

                        </button>

                      </div>

                    )}



                    {(isOwner || isRequester) && status === "Accepted" && (

                      <button

                        className="exchange-primary-btn"

                        disabled={busy || Boolean(actionId)}

                        onClick={() => handleAction(request, "complete")}

                      >

                        {actionId === `${request._id}-complete`

                          ? "Completing..."

                          : "✓ Mark Completed"}

                      </button>

                    )}



                    {status === "Completed" && (

                      <span className="completed-label">

                        ✓ Exchange completed

                      </span>

                    )}



                    {status === "Rejected" && (

                      <span className="rejected-label">

                        Request declined

                      </span>

                    )}

                  </div>

                </article>

              );

            })}

          </section>

        )}



        <footer className="exchange-footer">

          <span>🌍</span>

          Small exchanges, meaningful impact. Thank you for reusing.

        </footer>

      </section>

    </main>

  );

}



export default Exchange;
