import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ! product types
export type IproductCreate = {
  name: string
  description: string
  short_description: string
  category: string
  unit: string
  unit_price: number
  quantity: number
  vat: number
  thumbnail: string | undefined
  details: Array<Object>
  gallery: IproductImages | undefined
  parameters: IproductParameters | undefined
  variants: IproductVariants | undefined
}

//! Treba pridat SKU
//! Treba pridat Zlavu
//! Treba pridat Nakupnu cenu buying_price

export type Iproduct = {
  id: string
  name: string
  description: string
  short_description: string
  category: string
  unit: string
  unit_price: number
  quantity: number // change to units to be universal
  vat: number
  thumbnail: string | undefined
  gallery: IproductImages | undefined
  parameters: IproductParameters | undefined
  variants: IproductVariants | undefined
  reviews: IproductReviews | undefined
  created: Date | undefined
}
export type IproductImages = Array<IproductImage>
export type IproductImage = {
  created: Date
  filename: string
  id: string
  mimetype: string
  url: string
  versions: Array<{
    size: number
    url: string
  }>
}
export type IproductParameters = Array<IproductParameter>
export type IproductParameter = {
  name: string
  value: string
}
export type IproductVariants = Array<IproductVariant>
export type IproductVariant = {
  default: boolean
  sku: string
}

// ! product API
export type IproductApiDump = {
  status: string
  products: Array<Iproduct>
}

// ! review types
export type IproductReviews = Array<IproductReview>
export type IproductReview = {
  id: string
  user: string
  content: string
  rating: number
  cons: Array<string>
  pros: Array<string>
  likes: Array<string>
  is_liked: boolean
  updated: number
  created: Date
}

export const productApi = createApi({
  reducerPath: 'userApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER + '/product',
  }),

  endpoints: (builder) => ({
    productInfo: builder.query<{ status: string; product: Iproduct }, { id: string }>({
      query: ({ id }) => `/${id}/info`,
    }),
  }),
})

export const { useProductInfoQuery } = productApi
