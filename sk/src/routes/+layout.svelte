<script lang="ts">
  import "../app.scss";
  import { page } from "$app/state";
  import LoginBadge from "$lib/components/LoginBadge.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { metadata } from "$lib/metadata";
  import { resolve } from "$app/paths";
  import { onNavigate } from "$app/navigation";
  import { authModel, logout } from "$lib/pocketbase";
  import { goto } from '$app/navigation';

  
  if (!$authModel && page.url.pathname !== "/") {
    goto("/");
  } 
  if ($authModel && page.url.pathname === "/" && $authModel?.expand?.container?.id_ip) {
    goto("/vd/" + $authModel.expand?.container?.id_ip);
  }

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

  function logoutToRoot() {
    logout();
    goto("/");
  }

</script>

<svelte:head>
  <title>{$metadata.title} | CSS</title>
</svelte:head>

<nav data-topnav>
  <div class="container hstack" style:gap="var(--space-3)" style:justify-content="space-between">
    <a href={resolve("/")} class="logo">
      <img src={resolve("/favicon.ico")} alt="" width="24" height="24" />
    </a>
    <p>{$metadata.headline ?? $metadata.title}</p>
    {#if $authModel}
    <ot-dropdown>
    <button popovertarget="avatar-dropdown" class="ghost">
      <figure data-variant="avatar" aria-label="Oat">
        <abbr title={$authModel.name}>{$authModel.name.split(' ').map(n => n[0]).join('')}</abbr>
      </figure>
    </button>
      <menu popover id="avatar-dropdown">
        <li><button onclick={logoutToRoot} role="menuitem" class="ghost">Logout</button></li>
      </menu>
    </ot-dropdown>
    {/if}
  </div>
</nav>

<main class="container">
  {@render children()}
</main>

<style>
  main {
    flex-grow: 1;
    padding-block: var(--space-6);
  }
  footer {
    padding-block: var(--space-4);
    border-block-start: 1px solid var(--border);
  }
  .logo {
    display: flex;
    align-items: center;
  }

  /* Bottom hamburger toggle — mobile only */
  .mobile-menu-toggle {
    display: none;
    position: fixed;
    bottom: var(--space-4);
    right: var(--space-4);
    z-index: 10;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--background);
    box-shadow: var(--shadow-medium);
    cursor: pointer;
    align-items: center;
    justify-content: center;
    padding: 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }
  .mobile-menu-toggle:hover {
    box-shadow: var(--shadow-large);
  }

  .mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 8;
    background: rgb(0 0 0 / 0.4);
  }

  .mobile-menu {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background: var(--background);
    border-block-start: 1px solid var(--border);
    box-shadow: var(--shadow-large);
    padding-block: var(--space-3);
    padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
    animation: slide-up 0.2s ease-out;
  }

  @keyframes slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .mobile-menu-toggle {
      display: flex;
    }
    .mobile-overlay {
      display: block;
    }
    .mobile-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }
    :global(nav[data-topnav]) {
      display: none;
    }
  }
</style>
