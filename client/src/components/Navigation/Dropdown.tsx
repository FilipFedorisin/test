import { useState } from 'react'

interface IDropdown {
  children: React.ReactNode
}

const Dropdown = (props: IDropdown) => {
  const [visibility, setVisibility] = useState<boolean>(false)
  return (
    <div className="relative w-full">
      <button
        className="h-[42px] w-full rounded-sm border border-gray-400 bg-white pl-2 text-start text-gray-400 hover:shadow-none"
        onClick={() => setVisibility(!visibility)}
      >
        Zvoliť kategórie
      </button>
      {visibility ? <div className=" top-[42px] left-0 z-40 w-full">{props.children}</div> : null}
    </div>
  )
}

export default Dropdown
