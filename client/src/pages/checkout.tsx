import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useState } from 'react'
import Address from 'src/components/user/Address'
const Cart = dynamic(() => import('src/components/user/Cart'), { ssr: false })

const fakeAdresy = [
  {
    id: 'asfjnjdfsa',
    firstName: 'Adam',
    lastName: 'Durica',
    street: 'Majerská',
    number: '221',
    psc: '154 24',
    city: 'Dunajská Streda',
    phone: '+421 955 044 055',
  },
  {
    id: 'asfjfagnsa',
    firstName: 'Eva',
    lastName: 'Sofrankova',
    street: 'Jeseterová',
    number: '271',
    psc: '154 48',
    city: 'Dunajsky štvrtok',
    phone: '+421 955 044 047',
  },
  {
    id: 'asfjnhfdsa',
    firstName: 'Miroslava',
    lastName: 'Piatacká',
    street: 'Andersenová',
    number: '71',
    psc: '144 24',
    city: 'Dunajské Piatky',
    phone: '+421 755 044 055',
  },
]

function renderProgress(progress, setProgress) {
  let steps = ['Košík', 'Doručenie', 'Platba']
  return (
    <div className="flex w-full justify-between ">
      {steps.map((item, i) => {
        return (
          <div
            key={item + i}
            className="flex cursor-pointer"
            style={progress == item ? { filter: 'opacity(1)' } : { filter: 'opacity(0.5)' }}
            onClick={() => setProgress(item)}
          >
            <div className="mr-2 flex w-8 items-center justify-center rounded-[50%] bg-main">
              <span className="text-xl font-semibold text-white ">{i + 1}</span>
            </div>
            <h1>{item}</h1>
          </div>
        )
      })}
    </div>
  )
}

function renderCart(setProgress) {
  return (
    <>
      <Cart />
      <div className="flex w-full justify-end">
        <button className="mt-4 border-2 border-main-light p-2 pl-8 pr-8">
          <span className="text-main-dark" onClick={() => setProgress('Doručenie')}>
            Pokračovať
          </span>
        </button>
      </div>
    </>
  )
}

function renderAddress(setProgress) {
  return (
    <>
      <div className=" w-full ">
        <div className="my-4 h-[1px] w-full bg-gray-300"></div>
        <h2 className="mt-4 text-lg ">Fakturačné údaje</h2>
        <div className="mb-4 flex gap-4">
          <input
            className="w-1/2 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="Krstné meno"
          />
          <input
            className="w-1/2 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="Priezvisko"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <input
            className="w-3/4 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="Názov ulice"
          />
          <input
            className="w-1/4 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="Číslo"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <input
            className="w-1/3 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="PSČ"
          />
          <input
            className="w-1/3 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="Mesto"
          />
          <input
            className="w-1/3 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="Krajina"
          />
        </div>
        <div className=" flex gap-4">
          <input
            className="w-1/2 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="+421 000 000 000"
          />
          <input
            className="w-1/2 rounded-none border-gray-400 p-1 py-2"
            type="text"
            placeholder="Email"
          />
        </div>
      </div>
      <div className="my-4 h-[1px] w-full bg-gray-300"></div>
      <h2 className="mt-4 text-lg ">Spôsob doručenia</h2>
      <div>
        <div className="mb-2 flex items-center justify-between border-[1px] border-gray-300 bg-white p-2 hover:bg-blur-dark">
          <div>
            <h3 className="font-semibold">Doručenie na adresu</h3>
            <p>
              DHL {'('}1-2 pracovné dni{')'}
            </p>
          </div>
          <div>
            <p>2,80€</p>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between border-[1px] border-gray-300 bg-white p-2 hover:bg-blur-dark">
          <div>
            <h3 className="font-semibold">Doručenie na adresu</h3>
            <p>
              Slovenská pošta {'('}1-4 pracovné dni{')'}
            </p>
          </div>
          <div>
            <p>2,80€</p>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between border-[1px] border-gray-300 bg-white p-2 hover:bg-blur-dark">
          <div>
            <h3 className="font-semibold">Vyzdvihnute na Packeta</h3>
            <p>
              Packeta {'('}1-2 pracovné dni{')'}
            </p>
          </div>
          <div>
            <p>2,80€</p>
          </div>
        </div>
      </div>
      <div className="my-4 h-[1px] w-full bg-gray-300"></div>
      <h2 className="mt-4 text-lg">Spôsob platby</h2>
      <div>
        <div className="mb-2 flex items-center justify-between border-[1px] border-gray-300 bg-white p-2 hover:bg-blur-dark">
          <div>
            <h3 className="font-semibold">Dobierka</h3>
            <p>Kartou alebo v hotovosti</p>
          </div>
          <div>
            <p>0€</p>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between border-[1px] border-gray-300 bg-white p-2 hover:bg-blur-dark">
          <div>
            <h3 className="font-semibold">Online</h3>
            <p>Platba kartou</p>
          </div>
          <div>
            <p>0€</p>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <button className="mt-4 border-2 border-main-light p-2 pl-8 pr-8">
            <span className="text-main-dark" onClick={() => setProgress('Platba')}>
              Pokračovať
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

const Checkout: NextPage = () => {
  const [newOrder, setNewOrder] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    houseNumber: '',
    city: '',
    PSC: 0,
  })

  const [progress, setProgress] = useState<'Košík' | 'Doručenie' | 'Platba'>('Košík')
  const [testAddress, setTestAddress] = useState()
  return (
    <div>
      <Head>
        <title>Platba</title>
        <meta name={` na SickoMozne.sk`} content={` plus pridať nejaké SEO tagy`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="m-auto max-w-6xl">
        <div className="h-24" />

        {renderProgress(progress, setProgress)}

        <div className="h-8" />

        {progress == 'Košík' ? (
          <>{renderCart(setProgress)}</>
        ) : progress == 'Doručenie' ? (
          <Address
            addresses={fakeAdresy}
            selectedAddress={testAddress}
            setAddress={setTestAddress}
          />
        ) : null}

        <div className="h-24" />
        <div className="h-24" />
        <div className="h-24" />
      </main>
    </div>
  )
}

export default Checkout
