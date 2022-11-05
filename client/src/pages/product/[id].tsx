import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import ImageGallery from 'react-image-gallery'

import { useAppDispatch } from 'src/redux/hooks'
import { addItem } from 'src/redux/slices/cart'
import { fakeProducts } from 'src/utils/products'

export const getStaticPaths = async () => {
  /* paths to all routes
  const response = await fetch('https://sickomozne.loumadev.eu/api/v1/product/dump', {
    headers: {
      Authorization: 'Bearer ' + process.env.PRODUCTS_DUMP_TOKEN,
    },
  });
  const data = await response.json();
  const paths = data.products.map((item: any) => {
    return {
      params: {
        id: item.id.toString(),
      },
    };
  });
  */
  const paths = fakeProducts.map((item) => {
    return {
      params: {
        id: item.id.toString(),
      },
    }
  })
  return {
    paths,
    fallback: false,
  }
}
export const getStaticProps = async (context: any) => {
  /* props for one product
  const id = context.params.id;
  const res = await fetch('https://sickomozne.loumadev.eu/api/v1/product/' + id + '/info');
  const data = await res.json();
  */
  return {
    props: {
      product: fakeProducts.find((item) => item.id === context.params.id),
    },
  }
}

const ProductPage: NextPage = ({ ...props }: any) => {
  const [selectedMenu, setSelectedMenu] = useState<number>(0)
  const dispatch = useAppDispatch()

  const detailMenuOptions = ['Popis', 'Parametre', 'Recenzie', 'Príslušenstvo']

  function renderDetailsDescription(details) {
    return <div className="mt-2">{ReactHtmlParser(details)}</div>
  }

  function renderDetailsParameters(parameters) {
    return (
      <table className="mt-4 border-none">
        <thead className="border-none bg-white">
          <tr>
            <th className="text-start">Parameter</th>
            <th className="text-start">Hodnota</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((item, i) => {
            return (
              <tr key={'parameters' + i} className={`  ${i % 2 == 0 ? 'bg-main-weak  ' : 'p-2'}`}>
                <td className="p-2">{item.name}</td>
                <td>{item.value}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

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

  function handleGetQuantity() {
    return props.product.quantity
  }

  function handleAddToCart() {
    dispatch(
      addItem({
        id: props.product.id,
        name: props.product.name,
        unit_price: props.product.unit_price,
        quantity: 1,
        vat: props.product.vat,
        thumbnail: props.product.thumbnail,
      })
    )
  }

  function handleImageDownload() {
    const gallery: any = []
    if (props.product.gallery) {
      props.product.gallery.map((item: any) => {
        gallery.push({
          original: item.url,
          thumbnail: item.url,
          sizes: '640px',
        })
        /* 
        gallery.push({
          original: `${process.env.NEXT_PUBLIC_SERVER}/media/images/${item.id}/640.jpg`,
          thumbnail: `${process.env.NEXT_PUBLIC_SERVER}/media/images/${item.id}/160.jpg`,
          sizes: '500px',
        })
        */
      })
    }
    return gallery
  }

  return (
    <div>
      <Head>
        <title>{props.product.name}</title>
        <meta
          name={`${props.product.name} na SickoMozne.sk`}
          content={`${props.product.description} plus pridať nejaké SEO tagy`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-24 " />
        <div className="m-auto h-full max-w-6xl flex-col items-center justify-between">
          <div className="md:flex md:gap-4">
            <div className="w-auto md:w-1/2">
              <ImageGallery items={handleImageDownload()} />
            </div>
            <div className="relative h-auto w-auto flex-col items-end justify-between overscroll-none p-4 md:h-[576px] md:w-1/2 md:p-0">
              <div>
                <h1 className="text-3xl">{props.product.name}</h1>
                <p className="mb-8 text-base">{props.product.description}</p>
              </div>
              <div className="self-end">
                <span>skladom {handleGetQuantity()} ks</span>
                <p>
                  <span className="text-3xl font-bold">{props.product.unit_price}€</span>
                  <span className="text-2xl"> s DPH</span>
                </p>
                <p>
                  <span className="text-base">
                    {props.product.unit_price -
                      (props.product.unit_price * props.product.vat) / 100}
                    €
                  </span>
                  <span className="text-sm"> bez DPH</span>
                </p>
                <button className="mt-4 mb-4 flex bg-main p-2 pl-6 pr-6">
                  <Image width="32" height="30" src="/icons/basket.svg" alt="Ikona košík menu" />
                  <span
                    className="pl-2 text-2xl font-bold text-white"
                    onClick={() => handleAddToCart()}
                  >
                    {' '}
                    DO KOŠÍKA
                  </span>
                </button>
                <p>potrebujem poradiť</p>
              </div>
            </div>
          </div>
        </div>
        <div className="m-auto  h-full max-w-6xl flex-col items-center justify-between">
          <div className="w-full flex-row justify-between p-4 md:p-0">
            {detailMenuOptions.map((item, i) => {
              return (
                <button
                  key={'details_' + item + '_' + i}
                  className={`${'w-[25%] rounded-none p-2'} ${
                    selectedMenu == i ? ' bg-main ' : 'bg-blur'
                  }`}
                  onClick={() => setSelectedMenu(i)}
                >
                  {item}
                </button>
              )
            })}
          </div>
          <div className="p-4 md:p-0">
            {selectedMenu == 0 ? renderDetailsDescription(props.product.details) : null}
            {selectedMenu == 1 ? renderDetailsParameters(props.product.parameters) : null}
            {selectedMenu == 2 ? renderDetailsReviews() : null}
            {selectedMenu == 3 ? renderDetailsAccessories() : null}
          </div>
        </div>
        <div className="h-[80rem]"></div>
      </main>
    </div>
  )
}

export default ProductPage
