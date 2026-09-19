<script lang="ts">
  import { Chip, Microchip, Disc, Stop, Play, ArrowOutUpRightCircle, RotateCw} from "@boxicons/svelte";
  import { metadata } from "$lib/metadata";
  import { resolve } from "$app/paths";
  import { onNavigate } from "$app/navigation";
  import { authModel, client } from "$lib/pocketbase";
  import { goto } from '$app/navigation';
  import { page } from '$app/state';


  const { data } = $props();
  const config = $derived(data.config ?? {});
  let menuOpen = $state(false);

  $effect(() => {
    if (page.error) {
      $metadata.title = page.error.message;
    }
  });

  $effect(() => {
    page.url.pathname;
    menuOpen = false;
  });

  onNavigate((navigation) => {
    // @ts-ignore -- View Transitions API
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      // @ts-ignore
      document.startViewTransition(() => {
        resolve();
      });
    });
  });

const container_id_ip = page.params.id_ip;

metadata.set({
  title: "Container " + container_id_ip,
  headline: "Container " + container_id_ip + " | CSS",
  description: "Container management page."
});

if ($authModel?.expand?.container?.id_ip != container_id_ip) {
  goto("/");
}


let ip_address = $state<string | null>(null);
let rustguac_url = $state<string | null>(null);
let containerStatus = $state<ContainerStatus | null>(null);

type ContainerStatus = {
  cpu?: number;
  cpus?: number;
  disk?: number;
  maxdisk?: number;
  mem?: number;
  maxmem?: number;
  status?: "stopped" | "running" | string;
  uptime?: number;
};

type ProxmoxResponse<T> = {
  data?: T;
};

function readableError(error: unknown): string {
  const value = error as {
    response?: { data?: Record<string, unknown> };
    data?: Record<string, unknown>;
    error?: unknown;
    message?: unknown;
  };
  const values = [
    value.response?.data?.error,
    value.response?.data?.message,
    value.data?.error,
    value.data?.message,
    value.error,
    value.message,
    error instanceof Error ? error.message : String(error)
  ];

  const candidate = values.find((item) => item !== undefined && item !== null && item !== "");
  const raw = Array.isArray(candidate)
    ? candidate.join(",")
    : String(candidate ?? "Something went wrong while processing your request.");
  const encoded = raw.match(/\d+(?:,\d+)+/);

  const text = encoded
    ? new TextDecoder().decode(new Uint8Array(encoded[0].split(",").map(Number)))
    : raw;

  try {
    const parsed = JSON.parse(text);
    return parsed.message?.trim() || parsed.error?.trim() || text;
  } catch {
    return text.trim() || raw;
  }
}

function decodeResponse<T>(encoded: string): T {
  const decoded = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(decoded)) as T;
}

function percentage(value?: number, maximum?: number): number {
  if (!value || !maximum) return 0;
  return Math.min(100, Math.max(0, (value / maximum) * 100));
}

function formatBytes(value?: number): string {
  if (!value) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** unitIndex).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatUptime(seconds?: number): string {
  if (!seconds) return "0 minutes";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || !parts.length) parts.push(`${minutes}m`);
  return parts.join(" ");
}

async function launchContainer() {
    ip_address = await getContainerIp();
    rustguac_url = await getRustGuacUrl();
  window.open(`${rustguac_url}/api/connect?hostname=${ip_address}&protocol=vnc&port=5901`, '_blank', `width=${window.screen.width},height=${window.screen.height},scrollbars=no`);
}

async function getRustGuacUrl() {
  try {
    const response = await client.send<{ data: string }>(`/api/getRustguac`, {
      method: "POST",
    });
    return response.data;
  } catch (error) {
    const message = readableError(error);
    ot.toast(message, 'Error!', { variant: 'error' });
    console.error("Failed to get RustGuac URL", message);
    return null;
  }
}

async function rebootContainer() {
  try {
    const response = await client.send<{ message: string }>(`/api/vd/restart`, {
      method: "POST",
      body: { id_ip: container_id_ip }
    });
    ot.toast("Container rebooted successfully", 'Success!', { variant: 'success' });
    console.log(response);
  } catch (error) {
    const message = readableError(error);
    ot.toast(message, 'Error!', { variant: 'error' });
    console.error("Failed to restart container", message);
  }
}

async function stopContainer() {
  try {
    const response = await client.send<{ message: string }>(`/api/vd/stop`, {
      method: "POST",
      body: { id_ip: container_id_ip }
    });
    console.log(response);
    ot.toast("Container stopped successfully", 'Success!', { variant: 'success' });
  } catch (error) {
    const message = readableError(error);
    ot.toast(message, 'Error!', { variant: 'error' });
    console.error("Failed to stop container", message);
  }
}

async function startContainer() {
  try {
    const response = await client.send<{ message: string }>(`/api/vd/start`, {
      method: "POST",
      body: { id_ip: container_id_ip }
    });
    console.log(response);
    ot.toast("Container started successfully", 'Success!', { variant: 'success' });
  } catch (error) {
    const message = readableError(error);
    ot.toast(message, 'Error!', { variant: 'error' });
    console.error("Failed to start container", message);
  }
}

async function getContainerIp() {
  try {
    const response = await client.send<{ data: string }>(`/api/vd/ip`, {
      method: "POST",
      body: { id_ip: container_id_ip }
    });
    const payload = decodeResponse<{
      data?: Array<{ name?: string; inet?: string }>;
    }>(response.data);
    ip_address = payload.data?.find((networkInterface) => networkInterface.name === "eth0")?.inet ?? null;
    ip_address = ip_address?.split("/")[0] ?? null;
    if (!ip_address) {
      throw new Error("Container interface did not include an inet address");
    }
    return ip_address;
  } catch (error) {
    const message = readableError(error);
    ot.toast(message, 'Error!', { variant: 'error' });
    console.error("Failed to get container IP", message);
    return null;
  }
}

async function getContainerStatus() {
  try {
    const response = await client.send<{ data: string }>(`/api/vd/status`, {
      method: "POST",
      body: { id_ip: container_id_ip }
    });
    containerStatus = decodeResponse<ProxmoxResponse<ContainerStatus>>(response.data).data ?? null;
  } catch (error) {
    const message = readableError(error);
    ot.toast(message, 'Error!', { variant: 'error' });
    console.error("Failed to get container status", message);
    containerStatus = null;
  }
}

const statusInterval = setInterval(getContainerStatus, 5000);
getContainerStatus();

client.authStore.onChange(() => {
  clearInterval(statusInterval);
});

</script>

<section class="container-header">
  <div>
    <h1>Container {container_id_ip}</h1>
  </div>
  <span class:running={containerStatus?.status === "running"} class="status-badge">
    {#if containerStatus?.status === "stopped"}
      <Stop />
      Stopped
    {:else if containerStatus?.status === "running"}
      <Play />
      Running
    {:else}
      {containerStatus?.status ?? "Loading..."}
    {/if}
  </span>
</section>

<section class="metrics" aria-label="Container resource usage">
  <div class="metric">
    <div class="metric-label"><span><Chip />CPU</span><strong>{percentage(containerStatus?.cpu, containerStatus?.cpus).toFixed(1)}%</strong></div>
    <progress value={percentage(containerStatus?.cpu, containerStatus?.cpus)} max="100"></progress>
    <small>{containerStatus?.cpu?.toFixed(2) ?? "-"} / {containerStatus?.cpus ?? "-"} CPUs</small>
  </div>
  <div class="metric">
    <div class="metric-label"><span><Microchip />RAM</span><strong>{percentage(containerStatus?.mem, containerStatus?.maxmem).toFixed(1)}%</strong></div>
    <progress value={percentage(containerStatus?.mem, containerStatus?.maxmem)} max="100"></progress>
    <small>{formatBytes(containerStatus?.mem)} / {formatBytes(containerStatus?.maxmem)}</small>
  </div>
  <div class="metric">
    <div class="metric-label"><span><Disc />Disk</span><strong>{percentage(containerStatus?.disk, containerStatus?.maxdisk).toFixed(1)}%</strong></div>
    <progress value={percentage(containerStatus?.disk, containerStatus?.maxdisk)} max="100"></progress>
    <small>{formatBytes(containerStatus?.disk)} / {formatBytes(containerStatus?.maxdisk)}</small>
  </div>
</section>

<p class="uptime">Uptime <strong>{formatUptime(containerStatus?.uptime)}</strong></p>

<button onclick={launchContainer} disabled={!containerStatus || containerStatus.status !== "running"}><ArrowOutUpRightCircle />Launch your container</button>
<button onclick={rebootContainer} disabled={!containerStatus || containerStatus.status !== "running"}><RotateCw /> Reboot your container</button>
<button onclick={stopContainer} disabled={!containerStatus || containerStatus.status !== "running"}><Stop /> Stop your container</button>
<button onclick={startContainer} disabled={!containerStatus || containerStatus.status !== "stopped"}><Play />Start your container</button>

<style>
  .container-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-block: 2rem 1.5rem;
  }
  
  h1 {
    font-size: clamp(1.5rem, 4vw, 2.4rem);
    margin: 0.25rem 0 0;
  }

  .status-badge {
    align-items: center;
    background: var(--accent);
    border-radius: 999px;
    display: inline-flex;
    gap: 0.35rem;
    padding: 0.4rem 0.75rem;
    text-transform: capitalize;
    background: color-mix(in srgb, #ff0000 18%, transparent);
    color: #ff0000;
  }

  .status-badge :global(svg) {
    height: 1em;
    width: 1em;
  }

  .status-badge.running {
    background: color-mix(in srgb, var(--success) 18%, transparent);
    color: var(--success);
  }

  .metrics {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-bottom: 1rem;
  }

  .metric {
    background: var(--accent);
    border-radius: 8px;
    padding: 1rem;
  }

  .metric-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .metric-label > span {
    align-items: center;
    display: inline-flex;
    gap: 0.35rem;
  }

  .metric-label :global(svg) {
    display: block;
    height: 1em;
    width: 1em;
  }

  progress {
    accent-color: var(--primary);
    display: block;
    height: 0.65rem;
    width: 100%;
  }

  small {
    color: var(--accent-foreground);
    display: block;
    margin-top: 0.6rem;
  }

  .uptime {
    margin-block: 1rem 1.5rem;
  }

  @media (max-width: 700px) {
    .container-header,
    .metrics {
      grid-template-columns: 1fr;
    }

    .container-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>