import { useRouter } from 'next/router'
import Dropline from './Dropline'

const Menu: React.FC<any> = ({ setMenu }: any) => {
  const router = useRouter()
  return (
    <div className="flex w-full flex-col justify-start gap-2 bg-white">
      <button
        className="flex items-center justify-start p-4"
        onClick={() => router.push('/profile')}
      >
        Profil
      </button>
      <button className="flex items-center justify-start p-4" onClick={() => router.push('/')}>
        Domov
      </button>

      <button
        className="flex items-center justify-start p-4"
        onClick={() => router.push('/catalog')}
      >
        Katalóg
      </button>
      <Dropline name="Admin">
        <div className="flex">
          <div className="mr-2 h-[42px] w-[2px] bg-main"></div>
          <button
            className="flex items-center justify-start"
            onClick={() => router.push('/admin/products')}
          >
            Produkty / Sklad
          </button>
        </div>
        <div className="flex">
          <div className="mr-2 h-[42px] w-[2px] bg-main"></div>
          <button
            className="flex items-center justify-start"
            onClick={() => router.push('/admin/products/create')}
          >
            Pridať Produkt
          </button>
        </div>
      </Dropline>
      <div className="mt-2"></div>
    </div>
  )
}

export default Menu
