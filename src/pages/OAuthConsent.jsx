import React, { useEffect, useState } from "react";
import { appParams } from "@/lib/app-params";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const OPERATION_VERBS = { read: "view", create: "create", update: "edit", delete: "delete" };
const COLLAPSED_DATA_ROWS = 6;

function groupTools(tools) {
  const operationsByEntity = new Map();
  const agents = [];
  const actions = [];
  for (const tool of tools) {
    if (tool.kind === "entity" && tool.entity) {
      if (!operationsByEntity.has(tool.entity)) operationsByEntity.set(tool.entity, []);
      operationsByEntity.get(tool.entity).push(tool.operation);
    } else if (tool.kind === "agent") {
      agents.push(tool);
    } else {
      actions.push(tool);
    }
  }
  const data = [...operationsByEntity].map(([entity, operations]) => ({
    entity,
    operations: Object.keys(OPERATION_VERBS).filter((op) => operations.includes(op)),
  }));
  return { data, agents, actions };
}

const humanize = (name) =>
  name.split(/[_-]+/).filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ") || name;

function OperationSummary({ operations }) {
  return (
    <>
      {operations.map((op, i) => {
        const verb = OPERATION_VERBS[op];
        const separator = i === 0 ? "" : i === operations.length - 1 ? " and " : ", ";
        return (
          <React.Fragment key={op}>
            {separator}
            <span className={op === "delete" ? "font-medium text-destructive" : undefined}>
              {i === 0 ? verb[0].toUpperCase() + verb.slice(1) : verb}
            </span>
          </React.Fragment>
        );
      })}{" "}
      records
    </>
  );
}

function ToolSection({ title, children }) {
  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">{title}</h3>
      <ul className="divide-y divide-border rounded-lg border border-border">{children}</ul>
    </section>
  );
}

function ToolRow({ title, children }) {
  return (
    <li className="flex flex-col gap-0.5 px-3 py-2">
      <span className="font-medium text-foreground">{title}</span>
      {children && <span className="text-muted-foreground">{children}</span>}
    </li>
  );
}

export default function OAuthConsent() {
  const ctx = new URLSearchParams(window.location.search).get("ctx");
  const [info, setInfo] = useState(null);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [decided, setDecided] = useState("");
  const [error, setError] = useState("");
  const [reconnect, setReconnect] = useState("");
  const [showAllData, setShowAllData] = useState(false);

  useEffect(() => {
    (async () => {
      let redirecting = false;
      try {
        if (!ctx) {
          setError("This authorization link is invalid or has expired.");
          return;
        }
        const infoHeaders = {};
        if (appParams.token) infoHeaders.Authorization = "Bearer " + appParams.token;
        const res = await fetch(
          `/api/apps/${appParams.appId}/mcp/consent-info?handle=${encodeURIComponent(ctx)}`,
          { credentials: "include", headers: infoHeaders },
        );
        if (!res.ok) {
          setError("This authorization link is invalid or has expired.");
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          const returnTo =
            window.location.pathname + "?ctx=" + encodeURIComponent(ctx);
          const encoded = encodeURIComponent(returnTo);
          redirecting = true;
          window.location.href =
            (data.login_path || "/login") + "?returnTo=" + encoded + "&from_url=" + encoded;
          return;
        }
        setInfo(data);
      } catch (e) {
        setError("Could not load this authorization request. Please try again.");
      } finally {
        if (!redirecting) setChecking(false);
      }
    })();
  }, [ctx]);

  const respond = async (action) => {
    setSubmitting(true);
    setError("");
    try {
      const headers = { "Content-Type": "application/json" };
      if (appParams.token) headers.Authorization = "Bearer " + appParams.token;
      const res = await fetch(`/api/apps/${appParams.appId}/mcp/authorize-grant`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ ctx, action }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          const returnTo = window.location.pathname + "?ctx=" + encodeURIComponent(ctx);
          const encoded = encodeURIComponent(returnTo);
          window.location.href =
            ((info && info.login_path) || "/login") + "?returnTo=" + encoded + "&from_url=" + encoded;
          return;
        }
        if ([400, 403, 404, 409].includes(res.status)) {
          let detail = "";
          try { detail = (await res.json()).detail; } catch (_) { /* keep default */ }
          setReconnect(detail || "This authorization can no longer be completed. Reconnect from your AI client to try again.");
          setSubmitting(false);
          return;
        }
        throw new Error("Could not complete authorization. Please try again.");
      }
      const data = await res.json();
      window.location.href = data.redirect_url;
      if (!/^https?:/i.test(data.redirect_url)) {
        setDecided(action);
        setSubmitting(false);
      }
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <AuthLayout icon={ShieldCheck} title="Authorize access">
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
          Loading…
        </div>
      </AuthLayout>
    );
  }

  const client = (info && info.client_name) || "An AI client";
  const appName = (info && info.app_name) || "this app";

  if (decided) {
    return (
      <AuthLayout
        icon={ShieldCheck}
        title={decided === "approve" ? "Access granted" : "Access denied"}
        subtitle={`You can return to ${client} and close this window.`}
      />
    );
  }

  if (reconnect) {
    return (
      <AuthLayout icon={ShieldCheck} title="Reconnect required">
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {reconnect}
        </div>
      </AuthLayout>
    );
  }

  if (error && !info) {
    return (
      <AuthLayout icon={ShieldCheck} title="Authorize access">
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      </AuthLayout>
    );
  }

  const tools = Array.isArray(info.tools) ? info.tools : [];
  const { data, agents, actions } = groupTools(tools);

  return (
    <AuthLayout
      icon={ShieldCheck}
      title="Authorize access"
      subtitle={`${client} wants to access ${appName} on your behalf`}
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <p className="text-sm font-medium text-foreground mb-3">
        {tools.length ? `${client} will be able to:` : "No tools requested"}
      </p>
      {tools.length > 0 && (
        <div className="space-y-4 text-sm mb-6">
          {data.length > 0 && (
            <ToolSection title={`Data (${data.length})`}>
              {(showAllData ? data : data.slice(0, COLLAPSED_DATA_ROWS)).map(({ entity, operations }) => (
                <ToolRow key={entity} title={entity}>
                  <OperationSummary operations={operations} />
                </ToolRow>
              ))}
              {data.length > COLLAPSED_DATA_ROWS && (
                <li className="px-3 py-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => setShowAllData((shown) => !shown)}
                  >
                    {showAllData ? "Show less" : `Show all ${data.length}`}
                  </button>
                </li>
              )}
            </ToolSection>
          )}
          {agents.length > 0 && (
            <ToolSection title="Agents">
              {agents.map((tool) => (
                <ToolRow key={tool.name} title={tool.agent ? humanize(tool.agent) : tool.title || tool.name}>
                  {tool.description}
                </ToolRow>
              ))}
            </ToolSection>
          )}
          {actions.length > 0 && (
            <ToolSection title="Actions">
              {actions.map((tool) => (
                <ToolRow key={tool.name} title={tool.title || tool.name}>
                  {tool.description}
                </ToolRow>
              ))}
            </ToolSection>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 font-medium"
          disabled={submitting}
          onClick={() => respond("deny")}
        >
          Deny
        </Button>
        <Button
          className="flex-1 h-12 font-medium"
          disabled={submitting}
          onClick={() => respond("approve")}
        >
          {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Approve
        </Button>
      </div>
    </AuthLayout>
  );
}
