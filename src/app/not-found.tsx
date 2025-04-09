import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <div className='flex h-screen w-screen flex-col items-center justify-center'>
        <h4 className='font-thin text-10xl text-primary'>404</h4>
        <h2 className='pt-16 font-bold text-5xl uppercase'>Not Found</h2>
        <p className='font-light'>Could not find requested resource</p>
        <Link
          className='Anim mt-6 rounded-md border border-primary-0 bg-primary-0/20 px-3 py-1 text-xs hover:bg-primary hover:text-black'
          href='/home'
        >
          Comeback home
        </Link>
      </div>
    </>
  )
}
