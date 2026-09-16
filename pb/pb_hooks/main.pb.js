// Extending PocketBase with JS - @see https://pocketbase.io/docs/js-overview/

// @ts-check
/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/vd/restart", (e) => {
    const body = e.requestInfo().body;
    const id_ip = body?.id_ip;
    const authId = e.auth?.id;
    const authRecord = $app.findRecordById("users", authId);
    const container_record = $app.findRecordById("containers", authRecord.getString("container"));
    const container_id_ip = container_record.getString("id_ip");
    if (!id_ip) {
        return e.json(400, { error: "Missing id_ip" });
    }
    if (container_id_ip !== id_ip) {
        return e.json(403, { error: "Forbidden", id_ip: container_id_ip, authId: authId });
    }
    const res = $http.send({
        url: `${process.env.PVE_URL}/api2/json/nodes/${process.env.PVE_NODE}/lxc/${id_ip}/status/reboot`,
        method: "POST",
        headers: {
            "Authorization": `PVEAPIToken=${process.env.PVE_TOKEN}`
        }
    });
    if (res.status !== 200) {
        return e.json(res.status, { error: res.data?.error || "Failed to restart container" });
    }
    return e.json(200, { message: "Container restarted successfully" });
}, $apis.requireAuth());

routerAdd("POST", "/api/vd/start", (e) => {
    const id_ip = e.request.body?.id_ip;
    if (!id_ip) {
        return 400, { error: "Missing id_ip" };
    }
    if (e.authModel?.expand?.container?.id_ip !== id_ip) {
        return 403, { error: "Forbidden" };
    }
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());

routerAdd("POST", "/api/vd/stop", (e) => {
    const id_ip = e.request.body?.id_ip;
    if (!id_ip) {
        return 400, { error: "Missing id_ip" };
    }
    if (e.authModel?.expand?.container?.id_ip !== id_ip) {
        return 403, { error: "Forbidden" };
    }
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());

routerAdd("POST", "/api/vd/create", (e) => {
    const id_ip = $app.countRecords("containers") + 1;
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());

routerAdd("GET", "/api/vd/getIP", (e) => {
    const id_ip = e.request.body?.id_ip;
    if (!id_ip) {
        return 400, { error: "Missing id_ip" };
    }
    if (e.authModel?.expand?.container?.id_ip !== id_ip) {
        return 403, { error: "Forbidden" };
    }
    return 501, { error: "Not Implemented" };
}, $apis.requireAuth());    