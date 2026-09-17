<!-- basic login page for when the user is not logged in -->
<script lang="ts">
    import { onMount } from "svelte";
    import { client, providerLogin, authModel } from "$lib/pocketbase";
    import { goto } from '$app/navigation';
    import { metadata } from "$lib/metadata";

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
            goto("/vd/" + $authModel.expand?.container?.id_ip);
        }
    });

    client.authStore.onChange(() => {
        if ($authModel?.expand?.container?.id_ip) {
            goto("/vd/" + $authModel.expand?.container?.id_ip);
        } else {
            createContainerForUser();
        }
    });

    metadata.set({
        title: "Login",
        headline: "Login | CSS",
        description: "A login page."
    });

    async function createContainerForUser() {
        if (!$authModel) return;
        try {
            const response = await client.send("/api/vd/create", {
                method: "POST",
                body: JSON.stringify({ userId: $authModel.id }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await response;
            console.log(response);
            if (data.id_ip) {
                console.log("Container created with ID:", data.id_ip);
                await client.collection('users').authRefresh({ expand: "container" });
                const containerId = client.authStore.record?.expand?.container?.id_ip ?? data.id_ip;
                goto("/vd/" + containerId);
            } else {
                console.error("Failed to create container:", data);
            }
        } catch (error) {
            console.error("Error creating container:", error);
        }
    }
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