import Image from 'next/image'
import MapView from '../../components/map'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <MapView/>
    </main>
  )
}
