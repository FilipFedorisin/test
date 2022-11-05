/* eslint-disable @next/next/no-img-element */
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import type { IuserCreate, IuserLogin } from 'src/redux/services/users'
import { syncKeyVal } from 'src/utils/State'

const RenderPassword: React.FC<any> = ({ syncUserCred, pass, setPass }: any) => {
  return (
    <div>
      <label className="text-sm text-gray-500">Heslo</label>
      <br />
      <div className="flex w-full">
        <input
          className=" rounded-none border-gray-400 p-1 py-2"
          type={pass ? 'text' : 'password'}
          minLength={8}
          required
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          maxLength={100}
          onChange={(e) => syncKeyVal('password', e.target.value, syncUserCred)}
          placeholder="••••••"
        />
        <div className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center">
          <div className="h-[24px] w-[24px]" onClick={() => setPass(!pass)}>
            {pass ? (
              <img src="/icons/icons8-uchiha-eyes-24.png" width={24} height={24} alt="add alt" />
            ) : (
              <img src="/icons/icons8-closed-eye-24.png" width={24} height={24} alt="add alt" />
            )}
          </div>
        </div>
      </div>

      <br />
      <label className="text-sm text-gray-500">8 Znakov, Veľké písmeno, Špeciálny znak</label>
    </div>
  )
}

const LoginUser: React.FC<any> = ({ setForm, setMenu }: any) => {
  const router = useRouter()
  const [showPass, setShowPass] = useState<boolean>(false)
  const [loginCredentials, setLoginCredentials] = useState<IuserLogin>({
    email: '',
    password: '',
  })

  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    await axios
      .post('http://localhost:8085/api/v1/user/login', loginCredentials)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify({ status: 'online' }))
          setMenu(null)
          router.reload()
        }
      })
      .catch((err) => {
        let errName = err.response?.data?.message
        if (errName == 'User not found') {
          setError('Email sa nenašiel')
        } else if (errName == 'Incorrect password') {
          setError('Zadali ste nesprávne heslo')
        }
      })
  }

  return (
    <form onSubmit={(e) => handleLogin(e)} className="z-20 w-full border border-gray-300 bg-white">
      <h1 className="mt-8 text-center">Prihlásenie</h1>
      <div className="flex flex-col gap-2 p-4 md:p-8">
        <div onMouseOver={() => setError(null)}>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="text"
              minLength={1}
              required
              maxLength={100}
              onChange={(e) => syncKeyVal('email', e.target.value, setLoginCredentials)}
              placeholder="email@email.com"
            />
          </div>
          <RenderPassword
            syncUserCred={setLoginCredentials}
            pass={showPass}
            setPass={setShowPass}
          />

          <button
            className="bg-none"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            Zabudol som heslo
          </button>
        </div>
        <span className="m-auto text-red-600">{error}</span>
        <button
          className="m-auto mt-8 cursor-pointer border border-main p-2 font-semibold text-main"
          type="submit"
        >
          Prihlásiť sa
        </button>
        <button
          className="m-auto mt-8 cursor-pointer  p-2 font-semibold text-main"
          onClick={() => setForm(<RegisterUser setForm={setForm} setMenu={setMenu} />)}
          type="reset"
        >
          Zaregistrovať sa
        </button>
      </div>
    </form>
  )
}

const RegisterUser: React.FC<any> = ({ setForm, setMenu }: any) => {
  const router = useRouter()
  const [userCredentials, setUserCredentials] = useState<IuserCreate>({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    privacy: true,
    password: '',
  })
  const [showPass, setShowPass] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e) => {
    e.preventDefault()
    await axios
      .post('http://localhost:8085/api/v1/user/signup', userCredentials)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify({ status: 'online' }))
          setMenu(null)
          router.reload()
        }
      })
      .catch((err) => {
        let errName = err.response.data.status
        console.log(errName)
        if (errName == 'ALREADY_EXISTS') {
          setError('Používaťeľ s týmto emailom už existuje.')
        }
      })
  }

  return (
    <form
      onSubmit={(e) => handleSignup(e)}
      className="z-20 w-full border border-gray-300 bg-white "
    >
      <h1 className="mt-8 text-center">Registrácia</h1>
      <div className="flex flex-col gap-2 p-4 md:p-8">
        <div>
          <label className="text-sm text-gray-500">Meno</label>
          <br />
          <input
            className="w-full rounded-none border-gray-400 p-1 py-2"
            type="text"
            minLength={1}
            required
            maxLength={100}
            onChange={(e) => syncKeyVal('firstname', e.target.value, setUserCredentials)}
            placeholder="Meno"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Priezvisko</label>
          <br />
          <input
            className="w-full rounded-none border-gray-400 p-1 py-2"
            type="text"
            minLength={1}
            required
            maxLength={100}
            onChange={(e) => syncKeyVal('lastname', e.target.value, setUserCredentials)}
            placeholder="Priezvisko"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Tel. číslo</label>
          <br />
          <input
            className="w-full rounded-none border-gray-400 p-1 py-2"
            type="text"
            minLength={1}
            required
            maxLength={100}
            onChange={(e) => syncKeyVal('mobile', e.target.value, setUserCredentials)}
            placeholder="+421 444 444 444"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <br />
          <input
            className="w-full rounded-none border-gray-400 p-1 py-2"
            type="text"
            minLength={6}
            required
            maxLength={100}
            onChange={(e) => syncKeyVal('email', e.target.value, setUserCredentials)}
            placeholder="email@email.com"
          />
        </div>

        <RenderPassword syncUserCred={setUserCredentials} pass={showPass} setPass={setShowPass} />
        <span className="m-auto mt-4 text-red-600">{error}</span>

        <button
          className="m-auto  cursor-pointer border border-main p-2 font-semibold text-main"
          type="submit"
        >
          Zaregistrovať
        </button>
        <p
          className="m-auto cursor-pointer  p-2 font-semibold text-main"
          onClick={() => setForm(<LoginUser setForm={setForm} />)}
        >
          Prihlásenie
        </p>
      </div>
    </form>
  )
}

const Auth: React.FC<any> = ({ setMenu }: any) => {
  const [form, setForm] = useState<React.ReactNode | null>(null)
  return (
    <div className="">
      {form === null ? <LoginUser setForm={setForm} setMenu={setMenu} /> : form}
      <div className="mt-16 mb-2 flex w-full justify-center"></div>
    </div>
  )
}

export default Auth
