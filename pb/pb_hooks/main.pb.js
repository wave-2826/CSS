// Extending PocketBase with JS - @see https://pocketbase.io/docs/js-overview/

/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/vd/restart", (e) => {
    id_ip = e.body?.id_ip;
    if (!id_ip) {
        return 400, { error: "Missing id_ip" };
    }
    if (e.authModel?.expand?.container?.id_ip !== id_ip) {
        return 403, { error: "Forbidden" };
    }
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());

routerAdd("POST", "/api/vd/start", (e) => {
    id_ip = e.body?.id_ip;
    if (!id_ip) {
        return 400, { error: "Missing id_ip" };
    }
    if (e.authModel?.expand?.container?.id_ip !== id_ip) {
        return 403, { error: "Forbidden" };
    }
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());

routerAdd("POST", "/api/vd/stop", (e) => {
    id_ip = e.body?.id_ip;
    if (!id_ip) {
        return 400, { error: "Missing id_ip" };
    }
    if (e.authModel?.expand?.container?.id_ip !== id_ip) {
        return 403, { error: "Forbidden" };
    }
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());

routerAdd("POST", "/api/vd/create", (e) => {
    id_ip = $app.countRecords("containers") + 1;
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());

routerAdd("GET", "/api/vd/getIP", (e) => {
    id_ip = e.body?.id_ip;
    if (!id_ip) {
        return 400, { error: "Missing id_ip" };
    }
    if (e.authModel?.expand?.container?.id_ip !== id_ip) {
        return 403, { error: "Forbidden" };
    }
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());    