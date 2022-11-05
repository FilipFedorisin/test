import { useRouter } from 'next/router'
import { useState } from 'react'
import { syncKeyVal } from 'src/utils/State'

const RenderAddress: React.FC<any> = ({ address, count }: any) => {
  const [edit, setEdit] = useState(false)
  const handleEdit = () => {
    setEdit(!edit)
  }
  const handleDelete = () => {
    //! HANDLE address deletion
  }
  return (
    <>
      {edit ? (
        <div className="fixed left-0 top-0 z-50 h-full w-full">
          <div className="flex h-full w-full items-center justify-center">
            <EditAddress address={address} count={count} setEdit={setEdit} />
            <div
              className="absolute z-10 h-full w-full cursor-pointer backdrop-blur"
              onClick={() => setEdit(!edit)}
            />
          </div>
        </div>
      ) : null}
      <div className="p-2">
        <p className="font-semibold ">Adresa {count}</p>
        <p>{address.firstName}</p>
        <p>{address.lastName}</p>
        <p>{address.street + ' ' + address.number}</p>
        <p>{address.city + ' ' + address.psc}</p>
      </div>
      <div className="flex justify-between p-2">
        <button
          className="border- lg cursor-pointer rounded border border-gray-200 p-2 font-semibold text-main"
          onClick={() => handleEdit()}
        >
          Edituj
        </button>
        <button
          className="border- cursor-pointer border border-red-200 p-2 font-semibold text-red-400"
          onClick={() => handleEdit()}
        >
          Zmaž
        </button>
      </div>
    </>
  )
}

const EditAddress: React.FC<any> = ({ address, count, setEdit }: any) => {
  const [newAddress, setNewAddress] = useState(address)
  const handleSave = (e) => {
    //! handle address save
    e.preventDefault()
    setEdit(false)
    console.log('oof')
    console.log(newAddress)
  }
  const handleExit = () => {
    setEdit(false)
  }
  return (
    <>
      <form
        onSubmit={(e) => handleSave(e)}
        className="z-20  w-full border border-gray-300 bg-white md:w-[40rem]"
      >
        <div className="flex flex-col gap-2 p-4 md:p-8">
          <h1>Adresa {count !== 0 ? count : 'hlavná'}</h1>
          <div>
            <label className="text-sm text-gray-500">Krstné Meno</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="text"
              minLength={1}
              required
              maxLength={100}
              onChange={(e) => syncKeyVal('firstName', e.target.value, setNewAddress)}
              value={newAddress.firstName}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Priezvysko</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="text"
              minLength={1}
              required
              maxLength={100}
              onChange={(e) => syncKeyVal('lastName', e.target.value, setNewAddress)}
              value={newAddress.lastName}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Ulica</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="text"
              minLength={1}
              required
              maxLength={100}
              onChange={(e) => syncKeyVal('street', e.target.value, setNewAddress)}
              value={newAddress.street}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Popisné číslo</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="string"
              minLength={1}
              required
              maxLength={10}
              onChange={(e) => syncKeyVal('number', e.target.value, setNewAddress)}
              value={newAddress.number}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">PSČ</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="string"
              minLength={1}
              required
              maxLength={10}
              onChange={(e) => syncKeyVal('psc', e.target.value, setNewAddress)}
              value={newAddress.psc}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Mesto</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="string"
              minLength={1}
              required
              maxLength={10}
              onChange={(e) => syncKeyVal('city', e.target.value, setNewAddress)}
              value={newAddress.city}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Tel. číslo</label>
            <br />
            <input
              className="w-full rounded-none border-gray-400 p-1 py-2"
              type="string"
              minLength={1}
              required
              maxLength={50}
              onChange={(e) => syncKeyVal('phone', e.target.value, setNewAddress)}
              value={newAddress.phone}
            />
          </div>
          <div className="flex justify-between">
            <button
              className="cursor-pointer border border-red-400  p-2 font-semibold text-red-400 "
              onClick={() => handleExit()}
            >
              Zrušiť
            </button>
            <button
              className="cursor-pointer border border-main  p-2 font-semibold  text-main"
              onClick={() => handleExit()}
              type="submit"
            >
              Uložiť
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
const Address: React.FC<any> = ({ addresses, selectedAddress, setAddress }: any) => {
  const router = useRouter()
  return (
    <div className="h-full w-full ">
      <div className="flex h-full w-full flex-wrap gap-2">
        {addresses
          ? addresses.map((item, i) => {
              return (
                <div
                  key={item.firstName + i}
                  style={
                    selectedAddress
                      ? selectedAddress.id == item.id
                        ? { border: '4px #00afb9 solid' }
                        : {}
                      : {}
                  }
                  className="w-full cursor-pointer border border-gray-300 bg-white first-letter:border md:w-[16rem]"
                  onClick={() => {
                    if (router.pathname !== '/profile') {
                      setAddress(item)
                    }
                  }}
                >
                  <RenderAddress address={item} count={i} />
                </div>
              )
            })
          : null}
      </div>
    </div>
  )
}

export default Address
