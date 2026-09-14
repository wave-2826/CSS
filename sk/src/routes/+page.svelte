<!-- basic login page for when the user is not logged in -->
<script lang="ts">
    import { onMount } from "svelte";
    import { client, providerLogin, authModel } from "$lib/pocketbase";
    import { goto } from '$app/navigation';

    const authCollection = "users";
    const collection = client.collection(authCollection);

    let authMethods: Awaited<ReturnType<typeof collection.listAuthMethods>> | null = null;
    let authMethodsError = "";

    onMount(async () => {
        try {
            authMethods = await collection.listAuthMethods({ $autoCancel: false });
        } catch (error) {
            authMethodsError = error instanceof Error ? error.message : "Unable to load sign-in methods.";
        }
        if ($authModel?.expand?.container?.id_ip) {
            goto("/" + $authModel.expand?.container?.id_ip);
        }
    });
</script>

<main class="container" style="display: absolute; inset: 0; place-items: center; display: grid;">
    {#if authMethodsError}
        <p>{authMethodsError}</p>
    {:else if authMethods}
    <h1>Auth Providers:</h1>
        {#each authMethods.oauth2.providers as method}
            <button type="button" onclick={() => providerLogin(method, collection)}>{method.displayName}</button>
        {/each}
    {/if}
</main>