import type { Metadata } from 'next'
import GalleryClient from './GalleryClient'

export const metadata: Metadata = {
  title: 'Papikondalu Photo Gallery | Godavari River, Temples & Waterfalls',
  description:
    '37 photographs of Papikondalu hills, Godavari river gorges, Bhadrachalam temple, Maredumilli waterfalls, Parnasala and Sirivaka riverside camp. See what awaits on your Papikondalu tour.',
  keywords: [
    'Papikondalu photos', 'Papikondalu gallery', 'Godavari river pictures',
    'Bhadrachalam temple photos', 'Maredumilli waterfalls photos', 'Sirivaka camp photos',
    'Papikondalu tourism images',
  ],
  alternates: { canonical: 'https://www.papikondalutourism.com/gallery' },
  openGraph: {
    title: 'Papikondalu Photo Gallery | Godavari River, Temples & Waterfalls',
    description: '37 photographs of Papikondalu hills, Godavari gorges, temples and riverside camps.',
    url: 'https://www.papikondalutourism.com/gallery',
  },
}

export default function GalleryPage() {
  return <GalleryClient />
}
