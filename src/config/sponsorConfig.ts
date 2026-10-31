/**
 * Developer Affiliate Sponsor Banner Configuration
 * 
 * Edit these values directly to update or activate your affiliate banner ad
 * without needing to modify component code.
 */

export interface SponsorConfig {
  /** Set to true to show the banner ad at the bottom of the playground */
  enabled: boolean;
  /** Brand Name (e.g., "Supabase", "Neon") */
  name: string;
  /** Logo Image URL or relative asset path (e.g., "/assets/images/logo.png") */
  logoUrl: string;
  /** Banner headline / offering description */
  title: string;
  /** Call-to-action button/link text (e.g., "Try for free") */
  actionText: string;
  /** Destination affiliate link URL */
  actionUrl: string;
}

export const sponsorConfig: SponsorConfig = {
  enabled: false, // Set to true when you want to display your affiliate banner
  name: 'Supabase',
  logoUrl: '/assets/images/logo.png',
  title: 'Build full-stack web apps faster with serverless Postgres, Auth & Realtime.',
  actionText: 'Try for free',
  actionUrl: 'https://supabase.com',
};
