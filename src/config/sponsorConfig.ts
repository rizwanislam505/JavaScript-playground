/**
 * Developer Affiliate Sponsor Banner Configuration
 * 
 * Edit these values directly to update or activate your affiliate banner ad
 * without needing to modify component code.
 */

export interface SponsorConfig {
  /** Set to true to show the banner ad at the bottom of the playground */
  enabled: boolean;
  /** Brand Name (e.g., "Adsterra", "Supabase", "Neon") */
  name: string;
  /** Logo Image URL or relative asset path (e.g., "/assets/images/image_366554e8.png") */
  logoUrl: string;
  /** Banner headline / offering description */
  title: string;
  /** Call-to-action button/link text (e.g., "Join Adsterra") */
  actionText: string;
  /** Destination affiliate / referral link URL */
  actionUrl: string;
}

export const sponsorConfig: SponsorConfig = {
  enabled: true,
  name: 'Adsterra',
  logoUrl: '/assets/images/image_366554e8.png',
  title: 'Monetize your web traffic with high eCPMs & instant payouts.',
  actionText: 'Join Adsterra',
  actionUrl: 'https://beta.publishers.adsterra.com/referral/FubRx1gR7F',
};
