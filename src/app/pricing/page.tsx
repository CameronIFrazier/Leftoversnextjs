import { redirect } from 'next/navigation';

// Pricing removed — redirect to home because the app is freeware.
export default function PricingPage() {
  redirect('/');
}