// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  const ot: {
    toast(message: string, title: string, options?: { duration?: number, variant?: 'info' | 'success' | 'error' | 'warning', duration?: number }): void;
  };

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      selected: any;
    }
    // interface Platform {}
  }
}

export {};
