import Image from 'next/image'
import ViewMap from '../../components/map'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ViewMap/>
    </main>
  )
}
