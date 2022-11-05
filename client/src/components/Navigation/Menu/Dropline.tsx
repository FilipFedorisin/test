import { useState } from 'react'

interface IDropline {
  name: string
  children: React.ReactNode
}

const Dropline = (props: IDropline) => {
  const [visibility, setVisibility] = useState<boolean>(false)
  return (
    <div className="relative w-full pl-4">
      {visibility ? (
        <button
          className=" w-full rounded-sm   bg-white  text-start text-main hover:shadow-none"
          onClick={() => setVisibility(!visibility)}
        >
          {props.name}
        </button>
      ) : (
        <button
          className=" w-full rounded-sm text-start font-bold  hover:shadow-none"
          onClick={() => setVisibility(!visibility)}
        >
          {props.name}
        </button>
      )}

      {visibility ? <div className="z-40 flex flex-col">{props.children}</div> : null}
    </div>
  )
}

export default Dropline
