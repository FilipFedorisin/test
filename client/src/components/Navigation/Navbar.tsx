/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { useAppDispatch } from 'src/redux/hooks'
import { selectMenu } from 'src/redux/slices/modal'

import Auth from 'src/components/user/Auth'
import Menu from './Menu/Menu'

const Header = () => {
  const router = useRouter()

  const dispatch = useAppDispatch()

  const [menu, setMenu] = useState<React.ReactNode | null>()
  const [status, setStatus] = useState<String>('offline')

  useEffect(() => {
    let restore = localStorage.getItem('user')
    if (restore !== null) {
      if (JSON.parse(restore)?.status === 'online') {
        setStatus(JSON.parse(restore).status)
      }
    }
  }, [])

  const renderAvatar = () => {
    return (
      <button>
        {status === 'online' ? (
          <img
            src="/icons/user_account.svg"
            alt="Ikona hamburger menu"
            onClick={() => {
              router.push('/profile')
              setMenu(null)
            }}
          />
        ) : (
          <img
            src="/icons/user_account.svg"
            alt="Ikona hamburger menu"
            onClick={() => {
              // @ts-ignore
              if (menu?.type?.name === 'Auth') {
                setMenu(null)
              } else {
                setMenu(<Auth setMenu={setMenu} />)
              }
            }}
          />
        )}
      </button>
    )
  }

  return (
    <>
      {
        // @ts-ignore
        menu?.type?.name === 'Auth' ? (
          <div className="fixed left-0 top-0 z-[500] h-full w-full">
            <div className="flex h-full w-full items-center justify-center">
              <div className="z-[500] w-full md:w-[30rem]">{menu}</div>
              <div
                className="absolute z-40  h-full w-full cursor-pointer  backdrop-blur"
                onClick={() => setMenu(null)}
              />
            </div>
          </div>
        ) : null
      }

      <div className="fixed top-0 left-0 z-50 h-16 w-full bg-white shadow-md">
        <div className="row m-auto flex h-16 max-w-6xl items-center justify-between">
          <div className="relative flex gap-2">
            {
              // @ts-ignore
              menu?.type?.name === 'Menu' ? (
                <div className="absolute left-0 top-0 z-50 h-full w-full md:w-[30rem]">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="absolute top-[4rem]  z-50 w-full border  border-gray-300 ">
                      {menu}
                    </div>
                    <div
                      className="fixed top-0 left-0 z-40 h-full w-full cursor-pointer "
                      onClick={() => setMenu(null)}
                    />
                  </div>
                </div>
              ) : null
            }
            <button onClick={() => setMenu(<Menu setMenu={setMenu} />)}>
              <img src="/icons/hamburger_menu.svg" alt="Ikona hamburger menu" />
            </button>
            <button
              onClick={() => {
                dispatch(selectMenu('none'))
                router.push('/catalog')
              }}
            >
              <img src="/icons/search.svg" alt="Ikona vyhľadať menu" />
            </button>
          </div>
          <div className="flex ">
            <img src="/icons/sicko_mozne_1.svg" alt="Ikona hamburger menu" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (router.pathname !== '/checkout') {
                  dispatch(selectMenu('cart'))
                }
              }}
            >
              <img src="/icons/cart.svg" alt="Ikona košík menu" />
            </button>
            {renderAvatar()}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
