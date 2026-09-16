<script lang="ts">
  import { metadata } from "$lib/metadata";
  import { resolve } from "$app/paths";
  import { onNavigate } from "$app/navigation";
  import { authModel, client } from "$lib/pocketbase";
  import { goto } from '$app/navigation';
  import { page } from '$app/state';


  const { data, children } = $props();
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


let ip_address;

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

function launchContainer() {
    ip_address = "192.168.70." + container_id_ip
  window.open(`https://vdi-access.wave.glitchedblox.net/api/connect?hostname=${ip_address}&protocol=vnc&port=5901`, '_blank', `width=${window.outerWidth},height=${window.outerHeight},scrollbars=no`);
}

async function rebootContainer() {
  try {
    const response = await client.send<{ message: string }>(`/api/vd/restart`, {
      method: "POST",
      body: { id_ip: container_id_ip }
    });
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
  } catch (error) {
    const message = readableError(error);
    ot.toast(message, 'Error!', { variant: 'error' });
    console.error("Failed to start container", message);
  }
}
</script>

<button onclick={launchContainer}>Launch your container</button>
<button onclick={rebootContainer}>Reboot your container</button>
<button onclick={stopContainer}>Stop your container</button>
<button onclick={startContainer}>Start your container</button>
