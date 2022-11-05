import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import Footer from 'src/components/Navigation/Footer'

import Modal from 'src/components/Navigation/Modal'
import Navbar from 'src/components/Navigation/Navbar'

import store from 'src/redux/store'

import 'src/styles/gallery.scss'
import 'src/styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Navbar />
      <Modal />
      <Component {...pageProps} />
      <Footer />
    </Provider>
  )
}

export default MyApp
