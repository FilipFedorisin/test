/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Range } from 'react-range'

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

const CatalogPage: NextPage = ({ catalog }: any) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<any>({
    page: 1,
    pageSize: 20,
    keyword: '',
    keywordKeys: ['name', 'description', 'id'],
    priceRange: {
      max: 10000,
      min: 0,
      values: [10000],
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

  function logME() {
    console.log(searchQuery, searchResult, catalog)
  }

  return (
    <div>
      <Head>
        <title>Katalóg</title>
        <meta name={`Katalóg na SickoMozne.sk`} content="Katalóg produktov" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-24 " />
        <span onClick={() => logME()}>Log</span>
        <div className="m-auto max-w-6xl">
          <div className="m-0 flex-row gap-4 md:flex">
            <div className="w-full md:max-w-[20%]">
              <>
                <span>Kľučové slovo</span>
                <input
                  type="text"
                  name="keyword"
                  value={searchQuery.keyword}
                  onChange={(e) => syncKeyVal('keyword', e.target.value, setSearchQuery)}
                />
                <span>Strana výsledkov</span>
                <input
                  type="number"
                  name="page"
                  value={searchQuery.page}
                  onChange={(e) => syncKeyVal('page', e.target.value, setSearchQuery)}
                />
                <button
                  className="mt-4 mb-4 flex bg-main p-2 pl-6 pr-6"
                  onClick={() => handleSearch(searchQuery.page)}
                >
                  <span className="text-base font-bold text-white">Zobraziť</span>
                </button>
                <div>
                  <p>Cena</p>
                  <>
                    {searchQuery.priceRange.values ? (
                      <Range
                        step={1}
                        min={0}
                        max={10000}
                        values={searchQuery.priceRange.values}
                        onChange={(values) => {
                          console.log(values)
                          setSearchQuery((prevState) => ({
                            ...prevState,
                            priceRange: {
                              ...prevState.priceRange,
                              values,
                            },
                          }))
                        }}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            style={{
                              ...props.style,
                              height: '6px',
                              width: '100%',
                              backgroundColor: '#ccc',
                            }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div
                            {...props}
                            style={{
                              ...props.style,
                              height: '25px',
                              width: '25px',
                              borderRadius: '50%',
                              backgroundColor: '#999',
                            }}
                          />
                        )}
                      />
                    ) : null}
                  </>
                </div>
                <div className="flex-col">
                  <span>Kategórie</span>
                  <div>
                    <input
                      className="inline-block w-5"
                      type="checkbox"
                      id="coding"
                      name="interest"
                      value="coding"
                    />
                    <span className="inline-block">Kuchyňa</span>
                  </div>

                  <div>
                    <input
                      className="inline-block w-5"
                      type="checkbox"
                      id="coding"
                      name="interest"
                      value="coding"
                    />
                    <span className="inline-block">Náradie</span>
                  </div>

                  <div>
                    <input
                      className="inline-block w-5"
                      type="checkbox"
                      id="coding"
                      name="interest"
                      value="coding"
                    />
                    <span className="inline-block">Záhrada</span>
                  </div>

                  <div>
                    <input
                      className="inline-block w-5"
                      type="checkbox"
                      id="coding"
                      name="interest"
                      value="coding"
                    />
                    <span className="inline-block">Nábytok</span>
                  </div>
                </div>
              </>
            </div>
            <div className="product__wrapper relative  pt-6 pb-20">
              <div className="absolute top-[-5px]  w-full ">{handlePaginator()}</div>
              {searchResult.page.map((product: any) => {
                return (
                  <div
                    key={product.id + 'catalog_card'}
                    className="product__card"
                    onClick={() => {
                      router.push(`/product/${product.id}`)
                    }}
                  >
                    <h3>{product.name}</h3>
                    <img
                      alt={product.thumbnail}
                      src="/banner_image_temporary_1.png"
                      width="100px"
                      height="100px"
                    />
                    <p>{product.description}</p>
                    <p className="font-bold">{product.unit_price} €</p>
                    <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                      <span className="text-md w-full  pl-2 text-center font-bold text-white">
                        DO KOŠÍKA
                      </span>
                    </button>
                  </div>
                )
              })}
              <div className="absolute bottom-[40px] w-full">{handlePaginator()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CatalogPage
