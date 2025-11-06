import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /server by default
  redirect('/server');

  return null;
}
