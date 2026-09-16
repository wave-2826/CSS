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

if ($authModel?.expand?.container?.id_ip != container_id_ip) {
  goto("/");
}


let ip_address;

function launchContainer() {
    ip_address = "192.168.70." + container_id_ip
  window.open(`https://vdi-access.wave.glitchedblox.net/api/connect?hostname=${ip_address}&protocol=vnc&port=5901`, '_blank', `width=${window.outerWidth},height=${window.outerHeight},scrollbars=no`);
}

async function rebootContainer() {
  await client.send(`/api/vd/restart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: { id_ip: container_id_ip }
  });
}
</script>

<button onclick={launchContainer}>Launch your container</button>
<button onclick={rebootContainer}>Reboot your container</button>