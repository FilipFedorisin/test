import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/redux/hooks'

/* eslint-disable @next/next/no-img-element */
interface ProductCardProps {
  id: string
  rating: number
  name: string
  description: string
  thumbnail: string
}

function shorten(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

function renderRating(rating) {
  const ratingToWidth = `${rating}%`
  return (
    <div className="relative h-[20px] w-[105px]">
      <div className="absolute h-full w-full bg-gray-300"></div>
      <div className="absolute h-full bg-yellow-300" style={{ width: ratingToWidth }}></div>
      <img src="/assets/stars_overlay.png" className="absolute h-[20px]" alt="" />
    </div>
  )
}

const ProductCard = ({ ...props }: ProductCardProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  return (
    <>
      <div className="flex h-[500px] w-[250px] flex-col overflow-hidden rounded-md border border-gray-300 p-4">
        <div>
          <div className="h-[200px] w-full flex-shrink-0">
            <img
              className="cursor-pointer rounded-lg"
              src="/banner_image_temporary_1.png"
              alt="Woman paying for a purchase"
              onClick={() => router.push('/product/' + props.id)}
            />
          </div>
          {renderRating(43)}
          <h3 className="text-lg font-semibold">{shorten(props.name, 70)}</h3>
          <p className="text-left">{shorten(props.description, 80)}</p>
        </div>
        <div>
          <p className="font-bold">50€</p>
          <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
            <span className="text-md w-full pl-2 text-center font-bold text-white">DO KOŠÍKA</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductCard
