// Store for metadata
import { writable } from "svelte/store";

// Create a writable store for metadata
export const metadata = writable({
  title: "Cloud Software Service (CSS)",
  headline: "Cloud Software Service (CSS)",
  description: "Container based cloud computing.",
});
