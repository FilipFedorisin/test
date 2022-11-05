import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type Iuser = {
  created: Date
  email: string
  firstname: string
  id: string
  lastname: string
  mobile: string
  role: number
  type: number
}

export type IuserResponse = {
  status: string
  user: {
    created: Date
    email: string
    firstname: string
    id: string
    lastname: string
    mobile: string
    role: number
    type: number
  }
}

export type IuserLogin = {
  email: string
  password: string
}

export type IuserCreate = {
  firstname: string
  lastname: string
  email: string
  mobile: string
  privacy: boolean
  password: string
}

export type IuserEdit = {
  _id: string
  firstname: string
  lastname: string
  email: string
}

export type IuserEditAnother = {
  _id: string
  firstname: string
  lastname: string
  email: string
}

export const userApi = createApi({
  reducerPath: 'userApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8085/api/v1' + '/user',
  }),

  endpoints: (builder) => ({
    userInfo: builder.query<IuserResponse, void>({
      query: () => '/info',
    }),

    userLogout: builder.mutation<IuserResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),

    userLogin: builder.mutation<IuserResponse, IuserLogin>({
      query: (payload) => ({
        url: '/login',
        method: 'POST',
        body: payload,
      }),
    }),

    userEdit: builder.mutation<IuserResponse, IuserEdit>({
      query: (payload) => ({
        url: '/edit',
        method: 'POST',
        body: payload,
      }),
    }),

    //! with advanced permission

    userInfoAnother: builder.query<IuserResponse, void>({
      query: () => '/info',
    }),

    userEditAnother: builder.mutation<void, IuserEditAnother>({
      query: ({ _id, ...payload }) => ({
        url: `/${_id}/edit`,
        method: 'POST',
        body: payload,
      }),
    }),

    /* //? Delete bude ?
    userDelete: builder.mutation({
      query: (_id) => ({
        url: `/delete/${_id}`,
        method: 'POST',
      }),
    }),
    */
  }),
})

export const {
  useUserInfoQuery,
  useUserLogoutMutation,
  useUserLoginMutation,
  useUserEditMutation,
  useUserInfoAnotherQuery,
  useUserEditAnotherMutation,
} = userApi
