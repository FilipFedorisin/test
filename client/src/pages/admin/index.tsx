import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Admin: NextPage = () => {
  const router = useRouter()
  return (
    <div className="m-auto max-w-6xl">
      <div className="h-24" />
      <h1 className="font-normal">Admin Systém pre Šicko Možné</h1>
      <div className="h-4" />
      <div className="flex w-full gap-4">
        <div className="h-36 w-1/3 cursor-pointer rounded-sm border border-gray-300 p-4 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Používatelia</h2>
          <div className="my-1 h-[1px] bg-gray-300" />
          <p>Edituj práva používateľov a ich profily.</p>
        </div>
        <div
          className="h-36 w-1/3 cursor-pointer rounded-sm border border-gray-300 p-4 hover:shadow-lg"
          onClick={() => router.push('/admin/products')}
        >
          <h2 className="text-lg font-semibold">Produkty / Sklad</h2>
          <div className="my-1 h-[1px] bg-gray-300" />
          <p>Umožnuje vytvoriť a editovať produkty. Taktiež zadať zľavu na produkt.</p>
        </div>
        <div className="h-36 w-1/3 cursor-pointer rounded-sm border border-gray-300 p-4 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Objednávky</h2>
          <div className="my-1 h-[1px] bg-gray-300" />
          <p>Edituj práva používateľov a ich profily.</p>
        </div>
      </div>
      <div className="h-4" />
      <div className="flex w-full gap-4">
        <div className="h-36 w-1/3 cursor-pointer rounded-sm border border-gray-300 p-4 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Hromadný Email</h2>
          <div className="my-1 h-[1px] bg-gray-300" />
          <p>Edituj práva používateľov a ich profily.</p>
        </div>
        <div className="h-36 w-1/3 cursor-pointer rounded-sm border border-gray-300 p-4 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Banner</h2>
          <div className="my-1 h-[1px] bg-gray-300" />
          <p>Edituj práva používateľov a ich profily.</p>
        </div>
        <div className="h-36 w-1/3 cursor-pointer rounded-sm border border-gray-300 p-4 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Odporučané produkty</h2>
          <div className="my-1 h-[1px] bg-gray-300" />
          <p>Edituj práva používateľov a ich profily.</p>
        </div>
      </div>
      <div className="h-24" />
    </div>
  )
}

export default Admin
