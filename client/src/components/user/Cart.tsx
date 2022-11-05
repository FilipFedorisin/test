/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import {
  addItem,
  deleteItem,
  removeItem,
  selectCart,
  setCartItemQuantity,
} from 'src/redux/slices/cart'
import { selectMenu } from 'src/redux/slices/modal'

const SVGarrowUp = (
  <svg width="14" height="14" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.1842 0H14.8158C14.6053 0 14.5 0.111111 14.5 0.333333V14H0.848837C0.616279 14 0.5 14.1053 0.5 14.3158V16.6842C0.5 16.8947 0.616279 17 0.848837 17H14.5V29.6667C14.5 29.8889 14.6053 30 14.8158 30H17.1842C17.3947 30 17.5 29.8889 17.5 29.6667V17H30.1512C30.3837 17 30.5 16.8947 30.5 16.6842V14.3158C30.5 14.1053 30.3837 14 30.1512 14H17.5V0.333333C17.5 0.111111 17.3947 0 17.1842 0Z"
      fill="black"
    />
  </svg>
)

const SVGarrowDown = (
  <svg width="14" height="14" viewBox="0 0 30 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30.1739 0H0.826087C0.646739 0 0.5 0.125387 0.5 0.278638V2.36842C0.5 2.52167 0.646739 2.64706 0.826087 2.64706H30.1739C30.3533 2.64706 30.5 2.52167 30.5 2.36842V0.278638C30.5 0.125387 30.3533 0 30.1739 0Z"
      fill="black"
    />
  </svg>
)

const Cart: React.FC<any> = () => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(selectCart)

  const router = useRouter()

  function handleAddToCart(id) {
    dispatch(
      addItem({
        id,
      })
    )
  }

  function handleDeleteFromCart(id) {
    dispatch(deleteItem({ id }))
  }

  function handleRemoveFromCart(id) {
    dispatch(removeItem({ id }))
  }

  function renderCartContent() {
    return (
      <div className="w-full bg-transparent">
        {cart.items.map((item, i) => {
          return (
            <div
              key={item.name + i + 'košíka'}
              className="flex w-full flex-col items-center justify-between border-b-2 py-1 md:flex-row"
            >
              <div className="flex w-full items-center justify-between ">
                <div className="w-16">
                  <div className="h-[55px] w-[55px] ">
                    <img width={55} height={55} src="/banner_image_temporary_1.png" alt="sds" />
                  </div>
                </div>
                <div className="mx-2 w-full self-start">
                  <span>{item.name}</span>
                </div>
                <div>
                  <div className="w-22 mr-1 flex h-[40px] items-center rounded-lg border-2 border-gray-300 pr-1">
                    <div className="flex h-full w-16 items-center justify-start ">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          console.log(e.target.value)
                          // @ts-ignore
                          if (e.target.value < 1) {
                            if (confirm('Press a button!')) {
                              console.log(e.target.value)
                            } else {
                              console.log(e.target.value)
                            }
                          }

                          dispatch(setCartItemQuantity({ id: item.id, quantity: e.target.value }))
                        }}
                        className="rounded-none border-transparent bg-transparent focus:border-transparent focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full  items-center justify-between ">
                <div className="w-full pl-[63px] md:pl-0">
                  <span>{item.unit_price}€ / ks</span>
                </div>
                <div className="w-full text-start">
                  <span className="text-center">Spolu {item.unit_price * item.quantity}€</span>
                </div>
                <div className="mr-1 w-12">
                  <button
                    onClick={() => handleDeleteFromCart(item.id)}
                    className="flex h-[32px] w-[32px] items-center justify-center bg-red-300"
                  >
                    <img width={24} height={24} src="/icons/trash.svg" alt="sds" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function handleTotalPrice() {
    let total = 0
    cart.items.map((item) => {
      total += item.unit_price * item.quantity
    })
    return <span className="text-xl font-semibold">{total}</span>
  }

  return (
    <div className="flex-col bg-gray-100">
      <div className="m-auto h-[50vh] w-[100vw] p-1 md:p-8 lg:max-w-6xl">
        <h2 className="mb-4 text-xl">Nákupný košík</h2>
        {renderCartContent()}
        <div className="h-[1px] w-full bg-gray-300"></div>
        <div className="my-2 flex justify-between">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block whitespace-nowrap">Zľavový kód:</span>
            <input
              className="inline-block whitespace-nowrap rounded-none p-1"
              type="text"
              placeholder="XX-00-YY-0000"
            />
          </div>
          <div>
            <p>Spolu {handleTotalPrice()}€</p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <Link href="/checkout">
          <button
            className="mt-4 mb-4 flex bg-main p-2 pl-6 pr-6 font-semibold text-white"
            onClick={() => dispatch(selectMenu('none'))}
          >
            ZAPLATIŤ
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Cart

/*
    <div className="h-auto flex-col rounded-md bg-white p-2 shadow-md md:h-2/4 md:min-w-[46rem] md:p-8">
      {router.asPath == '/checkout' ? null : <h2 className="text-xl">Nákupný košík</h2>}
      <div>{renderCart()}</div>
      {router.asPath == '/checkout' ? null : (
        <div className="flex w-full items-center justify-center">
          <Link href="/checkout">
            <button
              className="mt-4 mb-4 flex bg-main p-2 pl-6 pr-6 font-semibold text-white"
              onClick={() => dispatch(selectMenu('none'))}
            >
              ZAPLATIŤ
            </button>
          </Link>
        </div>
      )}
    </div>

    {cart.items.length > 0 ? (
        <table className="border-none">
          <thead className="border-none bg-white">
            <tr>
              <th></th>
              <th></th>
              <th className="pl-2 text-left">Názov</th>
              <th>Počet</th>
              <th>Cena kus</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => {
              return (
                <tr key={item.id + item.name + 'Zoznam košíka'}>
                  <td className="w-[1%] whitespace-nowrap px-2">
                    <button
                      onClick={() => handleDeleteFromCart(item.id)}
                      className="mx-2 flex h-[32px] w-[32px] items-center justify-center bg-red-300"
                    >
                      <Image width={24} height={24} src="/icons/trash.svg" alt="sds" />
                    </button>
                  </td>
                  <td className="w-[1%] whitespace-nowrap px-2">
                    <div className="h-[50px] w-[50px] ">
                      <Image width={64} height={64} src="/banner_image_temporary_1.png" alt="sds" />
                    </div>
                  </td>
                  <td className="px-2">
                    <h3 className="bold text-lg">{item.name}</h3>
                  </td>
                  <td className="mt-5 flex justify-center px-2">
                    <div className="flex h-full items-center">
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="h-5 w-5 rounded-none "
                      >
                        <svg
                          width="20"
                          height="3"
                          viewBox="0 0 31 3"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M30.1739 0H0.826087C0.646739 0 0.5 0.125387 0.5 0.278638V2.36842C0.5 2.52167 0.646739 2.64706 0.826087 2.64706H30.1739C30.3533 2.64706 30.5 2.52167 30.5 2.36842V0.278638C30.5 0.125387 30.3533 0 30.1739 0Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                      <p className="px-2">{item.quantity} Ks</p>
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="h-5 w-5 rounded-none "
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 31 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.1842 0H14.8158C14.6053 0 14.5 0.111111 14.5 0.333333V14H0.848837C0.616279 14 0.5 14.1053 0.5 14.3158V16.6842C0.5 16.8947 0.616279 17 0.848837 17H14.5V29.6667C14.5 29.8889 14.6053 30 14.8158 30H17.1842C17.3947 30 17.5 29.8889 17.5 29.6667V17H30.1512C30.3837 17 30.5 16.8947 30.5 16.6842V14.3158C30.5 14.1053 30.3837 14 30.1512 14H17.5V0.333333C17.5 0.111111 17.3947 0 17.1842 0Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="w-[1%] whitespace-nowrap px-2">
                    <span>{item.unit_price}€</span>
                  </td>
                  <td className="w-16 ">
                    <p className="text-center">{item.unit_price * item.quantity}€</p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : null}
*/
