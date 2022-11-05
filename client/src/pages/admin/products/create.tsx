import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { IproductCreate } from 'src/redux/services/product'
import { syncKeyVal } from 'src/utils/State'

import { useRouter } from 'next/router'
import SlateEditor from 'src/components/SlateEditor/Editor'

function renderDetailsReviews() {
  return (
    <div>
      <p>Hello</p>
    </div>
  )
}

function renderDetailsAccessories() {
  return (
    <div>
      <p>Hello</p>
    </div>
  )
}

const AdminProductCreate: NextPage = ({ id }: any) => {
  const router = useRouter()
  const [sluzba, setSluzba] = useState<any>({ list: [{ name: '', value: 0 }] })
  const [newSluzba, setNewSluzba] = useState<any>({
    name: '',
    value: 0,
  })
  const [selectedMenu, setSelectedMenu] = useState<number>(0)
  const detailMenuOptions = ['Detaily', 'Parametre', 'Recenzie', 'Príslušenstvo']
  const [newProduct, setNewProduct] = useState<IproductCreate>({
    name: '',
    details: [
      {
        type: 'paragaph',
        children: [{ text: 'First line of text in Slate JS. ' }],
      },
    ],
    description: '',
    short_description: '',
    category: '',
    unit: '',
    unit_price: 0,
    quantity: 0,
    vat: 0,
    thumbnail: '',
    gallery: undefined,
    parameters: [{ name: '', value: '' }],
    variants: undefined,
  })
  const [calculator, setCalculator] = useState({
    buying_price: 0,
    discount: 0,
  })

  function renderDetails() {
    return (
      <>
        <SlateEditor
          value={newProduct.details}
          setter={(newDetails) =>
            setNewProduct((prevValue) => ({
              ...prevValue,
              details: newDetails,
            }))
          }
        />
      </>
    )
  }

  function renderParameters() {
    return (
      <div className="mb-2 mt-4">
        <div>
          <div>
            {newProduct.parameters
              ? newProduct.parameters.map((item: any, i: number) => {
                  return (
                    <div key={item.id}>
                      <div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const { value } = e.target
                            let newList = newProduct.parameters?.slice()
                            if (newList !== undefined) {
                              newList[i].name = value
                            }
                            setNewProduct((prevState: any) => ({
                              ...prevState,
                              parameters: newList,
                            }))
                          }}
                        />
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) => {
                            const { value } = e.target
                            let newList = newProduct.parameters?.slice()
                            if (newList !== undefined) {
                              newList[i].value = value
                            }
                            setNewProduct((prevState: any) => ({
                              ...prevState,
                              parameters: newList,
                            }))
                          }}
                        />
                        <button
                          onClick={() => {
                            let newList = newProduct.parameters?.slice()
                            if (newList !== undefined) {
                              newList.splice(i, 1)
                            }
                            setNewProduct((prevState: any) => ({
                              ...prevState,
                              parameters: newList,
                            }))
                          }}
                        >
                          ❌
                        </button>
                        <button
                          onClick={() => {
                            let newList = newProduct.parameters?.slice()
                            if (newList !== undefined) {
                              if (newList[i - 1]) {
                                let buffer = newList[i - 1]
                                newList[i - 1] = newList[i]
                                newList[i] = buffer
                                setNewProduct((prevState: any) => ({
                                  ...prevState,
                                  parameters: newList,
                                }))
                              }
                            }
                          }}
                        >
                          🔼
                        </button>
                        <button
                          onClick={() => {
                            let newList = newProduct.parameters?.slice()
                            if (newList !== undefined) {
                              if (newList[i + 1]) {
                                let buffer = newList[i + 1]
                                newList[i + 1] = newList[i]
                                newList[i] = buffer
                                setNewProduct((prevState: any) => ({
                                  ...prevState,
                                  parameters: newList,
                                }))
                              }
                            }
                          }}
                        >
                          🔽
                        </button>
                      </div>
                    </div>
                  )
                })
              : null}
            <label>Pridať službu</label>
            <div>
              <input
                type="text"
                placeholder={newSluzba.name}
                value={newSluzba.name}
                onChange={(e) => {
                  const { value } = e.target
                  setNewSluzba((prevState: any) => ({
                    ...prevState,
                    name: value,
                  }))
                }}
              />
              <input
                type="number"
                placeholder={newSluzba.value}
                value={newSluzba.value}
                onChange={(e) => {
                  const { value } = e.target
                  setNewSluzba((prevState: any) => ({
                    ...prevState,
                    value: value,
                  }))
                }}
              />
              <button
                onClick={() => {
                  let newList = newProduct.parameters?.slice()
                  if (newList === undefined) {
                    setNewProduct((prevState: any) => ({
                      ...prevState,
                      parameters: [newSluzba],
                    }))
                  } else {
                    newList.push(newSluzba)
                    setNewProduct((prevState: any) => ({
                      ...prevState,
                      parameters: newList,
                    }))
                  }

                  setNewSluzba({
                    name: 'Názov položky',
                    value: 0,
                  })
                }}
              >
                Pridaj
              </button>
            </div>
            <div>
              <button onClick={() => {}}>Ulož Zmeny</button>
              <button onClick={() => {}}>Zahoď Zmeny</button>
              <button onClick={() => console.log(sluzba)}>Logger</button>
            </div>
          </div>
        </div>
        <table className="border-none ">
          <thead className="border-none bg-white">
            <tr>
              <th className="text-start">Parameter</th>
              <th className="text-start">Hodnota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Názov Produktu
                </label>
                <br />
                <input
                  type="text"
                  name="name"
                  className="rounded-sm border-gray-400 p-1 py-2"
                  onChange={(e) => syncKeyVal('name', e.target.value, setNewProduct)}
                />
              </td>
              <td>
                <div className="h-full w-8 bg-red-500">
                  <p>Help me</p>
                </div>
                <label htmlFor="name" className="text-sm text-gray-500">
                  Názov Produktu
                </label>
                <br />
                <input
                  type="text"
                  name="name"
                  className="rounded-sm border-gray-400 p-1 py-2"
                  onChange={(e) => syncKeyVal('name', e.target.value, setNewProduct)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Nový Produkt</title>
        <meta
          name={`neindexuj toto na SickoMozne.sk`}
          content={`oof plus pridať nejaké SEO tagy`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="m-auto  max-w-6xl ">
          <div className="h-24 " />
          <div className="flex">
            <div className="w-1/2">
              <h1 className="font-normal">Nový Produkt</h1>
            </div>
            <div className="flex w-1/2 justify-end">
              <button
                className="ml-2 h-[42px] w-48 rounded-sm bg-main text-white"
                onClick={() => router.push('/admin/products')}
              >
                Späť
              </button>
            </div>
          </div>
          <div className="h-4" />
          <div className="flex gap-4 ">
            <div className="w-1/2">
              <div className="mb-2 mt-4">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Názov Produktu
                </label>
                <br />
                <input
                  type="text"
                  name="name"
                  className="rounded-sm border-gray-400 p-1 py-2"
                  onChange={(e) => syncKeyVal('name', e.target.value, setNewProduct)}
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm text-gray-500">
                  Popis produktu
                </label>
                <br />
                <textarea
                  name="description"
                  className="w-full rounded-sm border border-gray-400 p-1 py-2"
                  onChange={(e) => syncKeyVal('description', e.target.value, setNewProduct)}
                />
              </div>
              <div className="flex w-full gap-4">
                <div className="w-1/2">
                  <div className="mb-4 ">
                    <label htmlFor="quantity" className="text-sm text-gray-500">
                      Počet Kusov
                    </label>
                    <br />
                    <input
                      type="number"
                      name="quantity"
                      className="rounded-sm border-gray-400 p-1 py-2"
                      onChange={(e) => syncKeyVal('quantity', e.target.value, setNewProduct)}
                    />
                  </div>
                </div>

                <div className="w-1/2">
                  <div className="mb-4 ">
                    <label htmlFor="password" className="text-sm text-gray-500">
                      Merná Jednotka (ks, kg ...)
                    </label>
                    <br />
                    <input
                      type="text"
                      name="unit"
                      className="rounded-sm border-gray-400 p-1 py-2"
                      onChange={(e) => syncKeyVal('unit', e.target.value, setNewProduct)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex w-full gap-4">
                <div className="w-1/2">
                  <div className="mb-4 mt-4">
                    <label htmlFor="unit_price" className="text-sm text-gray-500">
                      Cena za kus
                    </label>
                    <br />
                    <input
                      type="number"
                      name="unit_price"
                      className="rounded-sm border-gray-400 p-1 py-2"
                      onChange={(e) => syncKeyVal('unit_price', e.target.value, setNewProduct)}
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="mb-4 mt-4">
                    <label htmlFor="password" className="text-sm text-gray-500">
                      Nákupná cena
                    </label>
                    <br />
                    <input
                      type="number"
                      name="buying_price"
                      className="rounded-sm border-gray-400 p-1 py-2"
                      onChange={(e) => syncKeyVal('buying_price', e.target.value, setCalculator)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex w-full">
                <div className="w-1/2">
                  <span className="text-base">
                    Marža:{' '}
                    {((newProduct.unit_price - calculator.buying_price) / newProduct.unit_price) *
                      100}
                    %
                  </span>
                </div>
                <div className="flex w-1/2 justify-end">
                  <span className="text-end">
                    Prirážka:{' '}
                    {((newProduct.unit_price - calculator.buying_price) / calculator.buying_price) *
                      100}
                    %
                  </span>
                </div>
              </div>
              <div className="mb-4 mt-4">
                <label htmlFor="password" className="text-sm text-gray-500">
                  Rabat v %
                </label>
                <br />
                <input
                  type="number"
                  name="discount"
                  className="rounded-sm border-gray-400 p-1 py-2"
                  onChange={(e) => syncKeyVal('discount', e.target.value, setCalculator)}
                />
              </div>
              <p>
                <span className="text-base">
                  Rabat: {(calculator.discount / 100) * newProduct.unit_price}€
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="m-auto max-w-6xl">
          <div className="mt-2 w-full flex-row justify-between py-4">
            {detailMenuOptions.map((item, i) => {
              return (
                <button
                  key={'details_' + item + '_' + i}
                  className={`w-[25%] rounded-none p-2 ${
                    selectedMenu == i
                      ? ' border border-gray-300 bg-main text-white'
                      : 'border border-gray-300 bg-transparent text-gray-400 hover:bg-[#bdedf0] hover:text-gray-500 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedMenu(i)}
                >
                  {item}
                </button>
              )
            })}
          </div>
          <div className="border border-gray-300 ">
            {selectedMenu == 0 ? renderDetails() : null}
            {selectedMenu == 1 ? renderParameters() : null}
            {selectedMenu == 2 ? renderDetailsReviews() : null}
            {selectedMenu == 3 ? renderDetailsAccessories() : null}
          </div>
        </div>
        <div className="h-[80rem]"></div>
      </main>
    </div>
  )
}

export default AdminProductCreate
