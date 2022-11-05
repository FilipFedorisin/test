import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="min-h-64 w-full bg-dark">
      <p className="pt-4 text-center  text-white">
        Zdieľajte svoj nákup s priateľmi na sociálnych sieťach!
      </p>
      <div className="m-auto flex max-w-6xl flex-wrap  gap-24 pt-14 pb-16 text-white md:flex-nowrap">
        <div className="flex w-full items-center justify-center p-4 md:w-1/2 md:justify-end">
          <div className="flex-col text-center md:text-start">
            <p>O nás</p>
            <p>Kontakt</p>
            <p>Spôsoby doručenia</p>
            <p></p>
            <p>Všeobecné obchodné podmienky</p>
            <p>Reklamačný poriadok</p>
            <p>Ochrana osobných údajov GDPR</p>
            <p>Formulár ku odstúpeniu od zmluvy</p>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', width: '1px' }} className="md:display-none" />
        <div className="flex w-full items-center justify-center p-4 md:w-1/2  md:justify-start">
          <div className="flex-col  text-center md:text-start">
            <Link href="/" className="z-10">
              <button>
                <Image src="/logo/aksim_logo.svg" width={180} height={88} alt="Logo Aksim Nine" />
              </button>
            </Link>
            <p>aksim nine s. r. o.</p>
            <p>Tichá 251/20</p>
            <p>11 Trstené pri Hornáde</p>
            <p>IČO: 54595487</p>
            <p>DIČ: 2121726915</p>
          </div>
        </div>
      </div>
      <p className="pb-4 text-center text-white">
        Powered by{' '}
        <Link href="https://www.kreado.io">
          <button className="text-green-500">Kreado</button>
        </Link>
      </p>
    </div>
  )
}

export default Footer
