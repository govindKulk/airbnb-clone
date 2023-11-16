import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import ToasterProvider from './providers/ToasterProvider'
import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import Modal from './components/modals/Modal'
import RegisterModal from './components/modals/RegisterModal'
import LoginModal from './components/modals/LoginModal'
import getCurrentUser from './actions/getCurrentUser'
import RentModal from './components/modals/RentModal'
import SearchModal from './components/modals/SearchModal'

const poppins = Poppins({ weight: ["100","300", "400", "500","600", "700", "900"],subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Airbnb Clone',
  description: 'Using Next Js',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();
  console.log(currentUser)
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientOnly>

        <ToasterProvider/>
        <SearchModal />
        <RentModal/>
        <LoginModal />
        <RegisterModal  />
        <Navbar currentUser={currentUser}/>

        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
      </body>
    </html>
  )
}
