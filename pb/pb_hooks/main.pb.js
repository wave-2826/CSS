// Extending PocketBase with JS - @see https://pocketbase.io/docs/js-overview/

// @ts-check
/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/vd/restart", (e) => {
    try {
        const config = JSON.parse(toString($os.readFile("pb_data/config.json")));
        const body = e.requestInfo().body;
        const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
        const id_ip = parsedBody && String(parsedBody.id_ip);
        const authId = e.auth && e.auth.id;

        if (!id_ip) {
            return e.json(400, { error: "Missing id_ip" });
        }

        if (!authId) {
            return e.json(401, { error: "Unauthorized" });
        }
        // These will throw if not found - wrap in try/catch or check first
        const authRecord = $app.findRecordById("users", authId);
        const containerRef = authRecord.getString("container");

        if (!containerRef) {
            return e.json(400, { error: "User has no assigned container" });
        }

        const container_record = $app.findRecordById("containers", containerRef);
        const container_id_ip = container_record.getString("id_ip");

        if (container_id_ip !== id_ip) {
            return e.json(403, { error: "Forbidden", id_ip: container_id_ip });
        }

        const pveUrl = config.pveUrl;
        const pveNode = config.pveNode;
        const pveToken = config.pveToken;
        const rangeStart = config.rangeStart;

        if (!pveUrl || !pveNode || !pveToken) {
            return e.json(500, { error: "Server configuration error" });
        }

        try {
            const res = $http.send({
                url: `${pveUrl}/api2/json/nodes/${pveNode}/lxc/${rangeStart + parseInt(id_ip)}/status/reboot`,
                method: "POST",
                headers: {
                    "Authorization": `PVEAPIToken=${pveToken}`
                }
            });

            if (res.statusCode !== 200) {
                return e.json(res.statusCode, { error: String(res.body || "Failed to restart container") });
            }
        } catch (error) {
            return e.json(502, { error: String(error) });
        }
        return e.json(200, { message: "Container restarted successfully" });
    } catch (error) {
        return e.json(500, { error: String(error) });
    }
    }, $apis.requireAuth());

routerAdd("POST", "/api/vd/start", (e) => {
    try {
        const config = JSON.parse(toString($os.readFile("pb_data/config.json")));
        const body = e.requestInfo().body;
        const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
        const id_ip = parsedBody && String(parsedBody.id_ip);
        const authId = e.auth && e.auth.id;

        if (!id_ip) {
            return e.json(400, { error: "Missing id_ip" });
        }

        if (!authId) {
            return e.json(401, { error: "Unauthorized" });
        }
        // These will throw if not found - wrap in try/catch or check first
        const authRecord = $app.findRecordById("users", authId);
        const containerRef = authRecord.getString("container");

        if (!containerRef) {
            return e.json(400, { error: "User has no assigned container" });
        }

        const container_record = $app.findRecordById("containers", containerRef);
        const container_id_ip = container_record.getString("id_ip");

        if (container_id_ip !== id_ip) {
            return e.json(403, { error: "Forbidden", id_ip: container_id_ip });
        }

        const pveUrl = config.pveUrl;
        const pveNode = config.pveNode;
        const pveToken = config.pveToken;
        const rangeStart = config.rangeStart;

        if (!pveUrl || !pveNode || !pveToken) {
            return e.json(500, { error: "Server configuration error" });
        }

        try {
            const res = $http.send({
                url: `${pveUrl}/api2/json/nodes/${pveNode}/lxc/${rangeStart + parseInt(id_ip)}/status/start`,
                method: "POST",
                headers: {
                    "Authorization": `PVEAPIToken=${pveToken}`
                }
            });

            if (res.statusCode !== 200) {
                return e.json(res.statusCode, { error: String(res.body || "Failed to start container") });
            }
        } catch (error) {
            return e.json(502, { error: String(error) });
        }
        return e.json(200, { message: "Container started successfully" });
    } catch (error) {
        return e.json(500, { error: String(error) });
    }
    }, $apis.requireAuth());

routerAdd("POST", "/api/vd/stop", (e) => {
    try {
        const config = JSON.parse(toString($os.readFile("pb_data/config.json")));
        const body = e.requestInfo().body;
        const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
        const id_ip = parsedBody && String(parsedBody.id_ip);
        const authId = e.auth && e.auth.id;

        if (!id_ip) {
            return e.json(400, { error: "Missing id_ip" });
        }

        if (!authId) {
            return e.json(401, { error: "Unauthorized" });
        }
        // These will throw if not found - wrap in try/catch or check first
        const authRecord = $app.findRecordById("users", authId);
        const containerRef = authRecord.getString("container");

        if (!containerRef) {
            return e.json(400, { error: "User has no assigned container" });
        }

        const container_record = $app.findRecordById("containers", containerRef);
        const container_id_ip = container_record.getString("id_ip");

        if (container_id_ip !== id_ip) {
            return e.json(403, { error: "Forbidden", id_ip: container_id_ip });
        }

        const pveUrl = config.pveUrl;
        const pveNode = config.pveNode;
        const pveToken = config.pveToken;
        const rangeStart = config.rangeStart;

        if (!pveUrl || !pveNode || !pveToken) {
            return e.json(500, { error: "Server configuration error" });
        }

        try {
            const res = $http.send({
                url: `${pveUrl}/api2/json/nodes/${pveNode}/lxc/${rangeStart + parseInt(id_ip)}/status/stop`,
                method: "POST",
                headers: {
                    "Authorization": `PVEAPIToken=${pveToken}`
                }
            });

            if (res.statusCode !== 200) {
                return e.json(res.statusCode, { error: String(res.body || "Failed to stop container") });
            }
        } catch (error) {
            return e.json(502, { error: String(error) });
        }
        return e.json(200, { message: "Container stopped successfully" });
    } catch (error) {
        return e.json(500, { error: String(error) });
    }
    }, $apis.requireAuth());

routerAdd("POST", "/api/vd/create", (e) => {
    try {
        const config = JSON.parse(toString($os.readFile("pb_data/config.json")));
        const authId = e.auth && e.auth.id;
        if (!authId) {
            return e.json(401, { error: "Unauthorized" });
        }

        const allContainers = $app.findAllRecords("containers");
        /** @type {Record<string, boolean>} */
        const usedIds = {};
        for (let i = 0; i < allContainers.length; i++) {
            const container = allContainers[i];
            if (!container) continue;
            const id_ip = parseInt(container.getString("id_ip"));
            if (id_ip >= 1 && id_ip <= 200) usedIds[String(id_ip)] = true;
        }

        let newIdIp = null;
        for (let candidate = 1; candidate <= 200; candidate++) {
            if (!usedIds[String(candidate)]) {
                newIdIp = candidate;
                break;
            }
        }

        if (newIdIp === null) {
            return e.json(409, { error: "No container IDs are available" });
        }

        let newContainer = new Record($app.findCollectionByNameOrId("containers"));
        newContainer.set("id_ip", String(newIdIp));
        $app.save(newContainer);

        const user = $app.findRecordById("users", authId);
        user.set("container", newContainer.id);
        $app.save(user);

        const pveUrl = config.pveUrl;
        const pveNode = config.pveNode;
        const pveToken = config.pveToken;
        const templateId = config.templateId;

        if (!pveUrl || !pveNode || !pveToken || !templateId) {
            return e.json(500, { error: "Server configuration error" });
        }

        $http.send({
            url: `${pveUrl}/api2/json/nodes/${pveNode}/lxc/${templateId}/clone`,
            method: "POST",
            headers: {
                "Authorization": `PVEAPIToken=${pveToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "newid": String(config.rangeStart + newIdIp),
                "hostname": `vdi-${newIdIp}`,
                "full": false
            })
        });

        sleep(1000)

        $http.send({
            url: `${pveUrl}/api2/json/nodes/${pveNode}/lxc/${config.rangeStart + newIdIp}/config`,
            method: "PUT",
            headers: {
                "Authorization": `PVEAPIToken=${pveToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "net0": `name=eth0,bridge=vmbr0,ip=${config.ipBase}${newIdIp}/${config.CIDR},gw=${config.gateway}`
            })
        });

        return e.json(200, { message: "Container created successfully", id_ip: newIdIp });
    } catch (error) {
        return e.json(500, { error: String(error) });
    }
}, $apis.requireAuth());

routerAdd("POST", "/api/vd/ip", (e) => {
    try {
        const config = JSON.parse(toString($os.readFile("pb_data/config.json")));
        const body = e.requestInfo().body;
        const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
        const id_ip = parsedBody && String(parsedBody.id_ip);
        const authId = e.auth && e.auth.id;

        if (!id_ip) {
            return e.json(400, { error: "Missing id_ip" });
        }

        if (!authId) {
            return e.json(401, { error: "Unauthorized" });
        }
        // These will throw if not found - wrap in try/catch or check first
        const authRecord = $app.findRecordById("users", authId);
        const containerRef = authRecord.getString("container");

        if (!containerRef) {
            return e.json(400, { error: "User has no assigned container" });
        }

        const container_record = $app.findRecordById("containers", containerRef);
        const container_id_ip = container_record.getString("id_ip");

        if (container_id_ip !== id_ip) {
            return e.json(403, { error: "Forbidden", id_ip: container_id_ip });
        }

        const pveUrl = config.pveUrl;
        const pveNode = config.pveNode;
        const pveToken = config.pveToken;
        const rangeStart = config.rangeStart;

        if (!pveUrl || !pveNode || !pveToken) {
            return e.json(500, { error: "Server configuration error" });
        }

        let res;
        try {
            res = $http.send({
                url: `${pveUrl}/api2/json/nodes/${pveNode}/lxc/${rangeStart + parseInt(id_ip)}/interfaces`,
                method: "GET",
                headers: {
                    "Authorization": `PVEAPIToken=${pveToken}`
                }
            });

            if (res.statusCode !== 200) {
                return e.json(res.statusCode, { error: String(res.body || "Failed to get container interfaces") });
            }
        } catch (error) {
            return e.json(502, { error: String(error) });
        }
        return e.json(200, { data: res.body });
    } catch (error) {
        return e.json(500, { error: String(error) });
    }
    }, $apis.requireAuth());

routerAdd("POST", "/api/vd/status", (e) => {
    try {
        const config = JSON.parse(toString($os.readFile("pb_data/config.json")));
        const body = e.requestInfo().body;
        const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
        const id_ip = parsedBody && String(parsedBody.id_ip);
        const authId = e.auth && e.auth.id;

        if (!id_ip) {
            return e.json(400, { error: "Missing id_ip" });
        }

        if (!authId) {
            return e.json(401, { error: "Unauthorized" });
        }
        // These will throw if not found - wrap in try/catch or check first
        const authRecord = $app.findRecordById("users", authId);
        const containerRef = authRecord.getString("container");

        if (!containerRef) {
            return e.json(400, { error: "User has no assigned container" });
        }

        const container_record = $app.findRecordById("containers", containerRef);
        const container_id_ip = container_record.getString("id_ip");

        if (container_id_ip !== id_ip) {
            return e.json(403, { error: "Forbidden", id_ip: container_id_ip });
        }
        
        const pveUrl = config.pveUrl;
        const pveNode = config.pveNode;
        const pveToken = config.pveToken;
        const rangeStart = config.rangeStart;

        if (!pveUrl || !pveNode || !pveToken) {
            return e.json(500, { error: "Server configuration error" });
        }

        let res;
        try {
            res = $http.send({
                url: `${pveUrl}/api2/json/nodes/${pveNode}/lxc/${rangeStart + parseInt(id_ip)}/status/current`,
                method: "GET",
                headers: {
                    "Authorization": `PVEAPIToken=${pveToken}`
                }
            });

            if (res.statusCode !== 200) {
                return e.json(res.statusCode, { error: String(res.body || "Failed to get container status") });
            }
        } catch (error) {
            return e.json(502, { error: String(error) });
        }
        return e.json(200, { data: res.body });
    } catch (error) {
        return e.json(500, { error: String(error) });
    }
    }, $apis.requireAuth());

routerAdd("POST", "/api/getRustguac", (e) => {
    try {
        const config = JSON.parse(toString($os.readFile("pb_data/config.json")));

        e.json(200, { data: config.rustguacUrl });
    }
    catch (error) {
        return e.json(500, { error: String(error) });
    }
    }, $apis.requireAuth());