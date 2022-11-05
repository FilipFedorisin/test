import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getTrackBackground, Range } from 'react-range'

import Dropdown from 'src/components/Navigation/Dropdown'
import { fakeProducts } from 'src/utils/products'
import { syncKeyVal } from 'src/utils/State'

export const getStaticProps = async () => {
  /* 
  const response = await fetch('https://sickomozne.loumadev.eu/api/v1/product/dump', {
    headers: {
      Authorization: 'Bearer ' + process.env.PRODUCTS_DUMP_TOKEN,
    },
  })
  const data = await response.json()
  const catalog = data.products
  */
  return {
    props: {
      catalog: fakeProducts,
    },
  }
}

const AdminProducts: NextPage = ({ catalog }: any) => {
  const router = useRouter()
  const [priceValues, setPriceValues] = useState<any>([0, 2000])
  const [searchQuery, setSearchQuery] = useState<any>({
    page: 1,
    pageSize: 20,
    keyword: '',
    keywordKeys: ['name', 'description', 'id'],
    priceRange: {
      max: 2000,
      min: 0,
    },
  })
  const [searchResult, setSearchResult] = useState<any>({
    page: [],
    results: 0,
    pages: 0,
  })

  useEffect(() => {
    let rawData = localStorage.getItem('storedQuery')
    if (rawData != null && rawData != undefined) {
      let raw = JSON.parse(rawData)
      raw = {
        query: JSON.parse(raw.query),
        result: JSON.parse(raw.result),
      }
      setSearchQuery(raw.query)
      setSearchResult(raw.result)
      console.log(raw)
    }
  }, [])

  function handleSearch(showPage) {
    const result = catalog.filter((product: any) =>
      Object.keys(product).some((key) => {
        if (typeof product[key] === 'string' || product[key] instanceof String) {
          if (searchQuery.keywordKeys.some((keywordKey) => key == keywordKey)) {
            if (
              product.unit_price > searchQuery.priceRange.min &&
              product.unit_price < searchQuery.priceRange.max
            )
              return product[key].includes(searchQuery.keyword)
          }
        }
        return null
      })
    )
    let results = result.length
    let pages = Math.ceil(results / searchQuery.pageSize)
    const page = result.slice(
      (showPage - 1) * searchQuery.pageSize,
      showPage * searchQuery.pageSize
    )

    let storedQueries = {
      result: JSON.stringify({
        page,
        results,
        pages,
      }),
      query: JSON.stringify(searchQuery),
    }
    localStorage.setItem('storedQuery', JSON.stringify(storedQueries))
    handlePaginator()
    setSearchResult({
      page,
      results,
      pages,
    })
  }

  function handlePaginator() {
    return (
      <div className="flex w-full items-center justify-center gap-2 ">
        <button
          onClick={() => {
            if (searchQuery.page > 1) {
              setSearchQuery((prevState: any) => ({
                ...prevState,
                page: searchQuery.page - 1,
              }))
              handleSearch(searchQuery.page - 1)
            }
          }}
        >
          {'<'}
        </button>
        {searchQuery.page >= 2 ? (
          <button
            onClick={() => {
              setSearchQuery((prevState: any) => ({
                ...prevState,
                page: searchQuery.page - 1,
              }))
              handleSearch(searchQuery.page - 1)
            }}
          >
            {searchQuery.page - 1}
          </button>
        ) : null}
        <span className="font-semibold">{searchQuery.page}</span>
        {searchResult.pages > searchQuery.page ? (
          <button
            onClick={() => {
              setSearchQuery((prevState: any) => ({
                ...prevState,
                page: searchQuery.page + 1,
              }))
              handleSearch(searchQuery.page + 1)
            }}
          >
            {searchQuery.page + 1}
          </button>
        ) : null}
        <button
          onClick={() => {
            if (searchQuery.page < searchResult.pages) {
              setSearchQuery((prevState: any) => ({
                ...prevState,
                page: searchQuery.page + 1,
              }))
              handleSearch(searchQuery.page + 1)
            }
          }}
        >
          {'>'}
        </button>
      </div>
    )
  }

  return (
    <div className="m-auto max-w-6xl">
      <div className="h-24" />
      <h1 className="font-normal">Produkty / Sklad</h1>
      <div className="h-4" />
      <>
        <div className="flex gap-4">
          <div className="w-1/2">
            <div className="mb-4 mt-4">
              <label htmlFor="unit_price" className="text-sm text-gray-500">
                Kľučové slovo
              </label>
              <br />
              <input
                type="text"
                name="keyword"
                className=" rounded-sm border-gray-400 p-1 py-2"
                placeholder="Názov / SKU"
                onChange={(e) => syncKeyVal('keyword', e.target.value, setSearchQuery)}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="mb-4 mt-4">
              <label htmlFor="unit_price" className="text-sm text-gray-500">
                Kategória
              </label>
              <br />
              <Dropdown>
                <div className="flex items-center justify-start border border-gray-400 bg-white p-2">
                  <input
                    type="checkbox"
                    name=""
                    className=" h-[20px] w-[28px] rounded-sm border-gray-400 p-1 py-2 "
                    placeholder="Názovssssss / SKU"
                    onClick={() => console.log('hey')}
                  />
                  <span className="pl-2">Záhrada</span>
                </div>
                <div className="flex items-center justify-start border border-gray-400 bg-white p-2">
                  <input
                    type="checkbox"
                    name=""
                    className=" h-[20px] w-[28px] rounded-sm border-gray-400 p-1 py-2 "
                    placeholder="Názovssssss / SKU"
                    onClick={() => console.log('hey')}
                  />
                  <span className="pl-2">Kuchyňa</span>
                </div>
                <div className="flex items-center justify-start border border-gray-400 bg-white p-2">
                  <input
                    type="checkbox"
                    name=""
                    className=" h-[20px] w-[28px] rounded-sm border-gray-400 p-1 py-2 "
                    placeholder="Názovssssss / SKU"
                    onClick={() => console.log('hey')}
                  />
                  <span className="pl-2">Náradie</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="w-28">
              <label htmlFor="unit_price" className="text-sm text-gray-500">
                Min €
              </label>
              <br />
              <input
                type="number"
                value={priceValues[0]}
                className=" rounded-sm border-gray-400 p-1 py-2"
                onChange={(e) => setPriceValues([e.target.value, priceValues[1]])}
              />
            </div>
            <div className="">
              <label htmlFor="unit_price" className="text-sm text-gray-500">
                Max €
              </label>
              <br />
              <input
                type="number"
                value={priceValues[1]}
                className="w-28 rounded-sm border-gray-400 p-1 py-2"
                onChange={(e) => setPriceValues([priceValues[0], e.target.value])}
              />
            </div>
          </div>
          <div className="my-2 px-[14px]">
            <Range
              values={priceValues}
              step={1}
              min={searchQuery.priceRange.min}
              max={searchQuery.priceRange.max}
              onChange={(values) => {
                console.log(values)
                setPriceValues(values)
              }}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: '50px',
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: '5px',
                      width: '100%',
                      borderRadius: '4px',
                      alignSelf: 'center',
                      background: getTrackBackground({
                        values: priceValues,
                        colors: ['#ccc', '#00afb9', '#ccc'],
                        min: searchQuery.priceRange.min,
                        max: searchQuery.priceRange.max,
                      }),
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '30px',
                    width: '28px',
                    borderRadius: '4px',
                    backgroundColor: '#FFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 2px 6px #AAA',
                  }}
                >
                  <div
                    style={{
                      height: '16px',
                      width: '5px',
                      backgroundColor: isDragged ? '#548BF4' : '#CCC',
                    }}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </>
      <div className="flex w-full justify-between">
        <button
          className=" h-[42px] w-16 rounded-sm bg-main text-white"
          onClick={() => handleSearch(1)}
        >
          Filter
        </button>
        <button
          className=" h-[42px] w-48 rounded-sm bg-main text-white"
          onClick={() => router.push('/admin/products/create')}
        >
          Pridať Produkt
        </button>
      </div>
      <div className="h-4" />
      <div className=" w-full ">{handlePaginator()}</div>
      {searchResult.page ? (
        <table className="border-collapse border-none">
          <thead className="border-none bg-transparent ">
            <tr className="border-b-[1px] border-gray-300  text-sm font-semibold text-gray-400">
              <td className="w-80 py-4 pr-2 text-start">NÁZOV</td>
              <td className="px-2 text-start">SKU</td>
              <td className="text-end">JEDN. CENA (NÁKUP)</td>
              <td className="text-end">JEDN. CENA (PREDAJ)</td>
              <td className="text-end">SKLADOM</td>
            </tr>
          </thead>
          <tbody>
            {searchResult.page.map((product, i) => {
              return (
                <tr
                  key={product.id + i + 'zoznam produktov'}
                  className={`cursor-pointer border-b-[1px]  hover:bg-gray-300 ${
                    i % 2 == 0 ? 'bg-gray-200' : ''
                  }`}
                >
                  <td className="py-4 pr-2 text-start text-sm text-main-dark hover:text-main ">
                    {product.name}
                  </td>
                  <td className="px-2 text-start text-sm">{product.id}</td>
                  <td className="px-2 text-end">{product.unit_price} €</td>
                  <td className="px-2 text-end">{product.unit_price} €</td>
                  <td className="pl-2 text-end">
                    {product.quantity}
                    {product.unit}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : null}

      <div className="h-24" />
    </div>
  )
}

export default AdminProducts
