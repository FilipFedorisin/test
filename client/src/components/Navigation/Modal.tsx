/* eslint-disable no-unreachable */
/* eslint-disable @next/next/no-img-element */

import Menu from 'src/components/Navigation/Menu/Menu'
import Auth from 'src/components/user/Auth'
import Cart from 'src/components/user/Cart'

import { useAppSelector } from 'src/redux/hooks'
import { selectModal } from 'src/redux/slices/modal'

const Modal = () => {
  const modal = useAppSelector(selectModal)

  const renderComponent = () => {
    if (modal.selected === 'cart') {
      return <Cart />
    } else if (modal.selected === 'user') {
      return <Auth />
    } else if (modal.selected === 'menu') {
      return (
        <>
          <div className="absolute z-0 h-full w-full cursor-pointer "></div>
          <Menu />
        </>
      )
    }
  }

  return (
    <>
      {modal.selected !== 'none' ? (
        <div>
          <div className="relative">
            <div className="fixed top-16 left-0  z-20 h-full w-full">{renderComponent()}</div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Modal
