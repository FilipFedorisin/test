import axios from 'axios'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Address from 'src/components/user/Address'

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

function renderMenu(menu, setMenu) {
  return (
    <div className="flex w-full bg-white">
      <div
        className="flex w-1/3 cursor-pointer border border-gray-300 p-2 font-semibold"
        style={menu == 'Adresy' ? { filter: 'opacity(1)' } : { filter: 'opacity(0.5)' }}
        onClick={() => setMenu('Adresy')}
      >
        <p>Adresy</p>
      </div>
      <div
        className="flex  w-1/3 cursor-pointer border border-gray-300 p-2 font-semibold"
        style={menu == 'Objednávky' ? { filter: 'opacity(1)' } : { filter: 'opacity(0.5)' }}
        onClick={() => setMenu('Objednávky')}
      >
        <p>Objednávky</p>
      </div>
      <div
        className="flex  w-1/3 cursor-pointer border border-gray-300 p-2 font-semibold"
        style={menu == 'Účet' ? { filter: 'opacity(1)' } : { filter: 'opacity(0.5)' }}
        onClick={() => setMenu('Účet')}
      >
        <p>Účet</p>
      </div>
    </div>
  )
}

const Profile: NextPage = () => {
  const [testAddress, setTestAddress] = useState()
  const router = useRouter()
  const [menu, setMenu] = useState<'Adresy' | 'Objednávky' | 'Účet'>('Adresy')

  useEffect(() => {
    let restore = localStorage.getItem('user')
    if (restore !== null) {
      if (JSON.parse(restore)?.status === 'offline') {
        router.push('/')
      }
    }
  }, [router])

  const handleLogout = async () => {
    await axios.post('http://localhost:8085/api/v1/user/logout').then((res) => {
      console.log(res.data.status)
      if (res.data.status === 'OK') {
        localStorage.setItem('user', JSON.stringify({ status: 'offline' }))
        location.reload()
      }
    })
  }

  return (
    <>
      <Head>
        <title>Platba</title>
        <meta name={` na SickoMozne.sk`} content={` plus pridať nejaké SEO tagy`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-24 " />
        <div className="m-auto max-w-6xl">
          {renderMenu(menu, setMenu)}
          <div className="h-8" />
          <Address
            addresses={fakeAdresy}
            selectedAddress={testAddress}
            setAddress={setTestAddress}
          />
          <div onClick={() => handleLogout()}>
            <h1>LOGOUT</h1>
          </div>
        </div>
        <div className="h-24 " />
      </main>
    </>
  )
}

export default Profile
