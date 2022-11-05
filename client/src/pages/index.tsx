/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import ProductCard from 'src/components/Product/ProductCard'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
const Home: NextPage = () => {
  const router = useRouter()
  return (
    <div>
      <Head>
        <title>Šicko Možne</title>
        <meta name={` na SickoMozne.sk`} content={` plus pridať nejaké SEO tagy`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-24 " />
        <div className="m-auto flex h-full max-w-6xl items-center justify-center">
          <ProductCard
            thumbnail=""
            rating={80}
            name="This is the products name is is the product is is the product is is the product is is the product"
            id="randomid"
            description="This is the products name is is the product is is the product is is the product is is the product This is the products name is is the product is is the product is is the product is is the product"
          />
        </div>
        <div className="h-24 " />
        {/*
          <div className="m-auto h-full max-w-6xl flex-col items-center justify-between">
          <Carousel
            showThumbs={false}
            infiniteLoop={true}
            interval={3000}
            autoPlay={true}
            statusFormatter={(item, total) => {
              return `${item} z ${total}`
            }}
          >
            <div className="flex h-[30rem] flex-col justify-between rounded-xl bg-blue-300 p-8">
              <div className="z-10">
                <h2 className="text-left text-2xl font-semibold">Názov Produktu</h2>
                <p className="w-72 text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus maxime natus
                  omnis voluptate sequi laborum facilis porro. Nostrum, vel tempore.
                </p>
              </div>
              <div className="z-10">
                <p className=" text-left">
                  <span className=" text-3xl font-bold">120€</span>
                  <span className="text-2xl"> s DPH</span>
                </p>
                <p className="text-left">
                  <span className="text-base">100€</span>
                  <span className="text-sm"> bez DPH</span>
                </p>
                <button className="mt-4 mb-4 flex bg-main p-2 pl-6 pr-6">
                  <Image width="32" height="30" src="/icons/basket.svg" alt="Ikona košík menu" />
                  <span className="pl-2 text-2xl font-bold text-white">DO KOŠÍKA</span>
                </button>
              </div>
              <div className="absolute right-0 top-[-2rem] z-0 h-full">
                <img className="object-fit relative z-0" src="banner_image_temporary_1.png" />
              </div>
            </div>
            <div className="flex h-[30rem] flex-col justify-between rounded-xl bg-red-300 p-8">
              <div className="z-10">
                <h2 className="text-left text-2xl font-semibold">Názov Produktu</h2>
                <p className="w-72 text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus maxime natus
                  omnis voluptate sequi laborum facilis porro. Nostrum, vel tempore.
                </p>
              </div>
              <div className="z-10">
                <p className=" text-left">
                  <span className=" text-3xl font-bold">120€</span>
                  <span className="text-2xl"> s DPH</span>
                </p>
                <p className="text-left">
                  <span className="text-base">100€</span>
                  <span className="text-sm"> bez DPH</span>
                </p>
                <button className="mt-4 mb-4 flex bg-main p-2 pl-6 pr-6">
                  <Image width="32" height="30" src="/icons/basket.svg" alt="Ikona košík menu" />
                  <span className="pl-2 text-2xl font-bold text-white">DO KOŠÍKA</span>
                </button>
              </div>
              <div className="absolute right-0 top-[-2rem] z-0 h-full">
                <img className="object-fit relative z-0" src="banner_image_temporary_1.png" />
              </div>
            </div>
            <div className="flex h-[30rem] flex-col justify-between rounded-xl bg-green-300 p-8">
              <div className="z-10">
                <h2 className="text-left text-2xl font-semibold">Názov Produktu</h2>
                <p className="w-72 text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus maxime natus
                  omnis voluptate sequi laborum facilis porro. Nostrum, vel tempore.
                </p>
              </div>
              <div className="z-10">
                <p className=" text-left">
                  <span className=" text-3xl font-bold">120€</span>
                  <span className="text-2xl"> s DPH</span>
                </p>
                <p className="text-left">
                  <span className="text-base">100€</span>
                  <span className="text-sm"> bez DPH</span>
                </p>
                <button className="mt-4 mb-4 flex bg-main p-2 pl-6 pr-6">
                  <Image width="32" height="30" src="/icons/basket.svg" alt="Ikona košík menu" />
                  <span className="pl-2 text-2xl font-bold text-white">DO KOŠÍKA</span>
                </button>
              </div>
              <div className="absolute right-0 top-[-2rem] z-0 h-full">
                <img className="object-fit relative z-0" src="banner_image_temporary_1.png" />
              </div>
            </div>
          </Carousel>
          <h2 className="mt-8 text-xl">Populárne produkty</h2>
          <Swiper
            slidesPerView={5}
            slidesPerGroup={5}
            loop={true}
            loopFillGroupWithBlank={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div
                className="mb-8 flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
          <h2 className="mt-8 text-xl">Zľavnené produkty</h2>
          <Swiper
            slidesPerView={5}
            slidesPerGroup={5}
            loop={true}
            loopFillGroupWithBlank={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div
                className="mb-8 flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="flex w-56 flex-col items-start justify-evenly rounded-md border border-gray-300 p-4"
                onClick={() => {
                  router.push(`/product/randomid`)
                }}
              >
                <h3 className="text-lg font-semibold">Názov produktu</h3>
                <img
                  alt="fotka produktu"
                  src="/banner_image_temporary_1.png"
                  width="100px"
                  height="100px"
                />
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, magni.
                </p>
                <p className="font-bold">50€</p>
                <button className="mt-4 mb-4 flex w-full bg-main p-2 text-center ">
                  <span className="text-md w-full pl-2 text-center font-bold text-white">
                    DO KOŠÍKA
                  </span>
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="h-24 " />
          */}
      </main>
    </div>
  )
}

export default Home
