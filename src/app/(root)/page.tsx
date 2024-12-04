/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { app } from '@config'
import { RootLayout } from '@/layouts'

const Page = () => {
  const technologies = [
    {
      title: 'TypeScript',
      link: 'https://www.typescriptlang.org/',
    },
    {
      title: 'Next.js',
      link: 'https://nextjs.org/',
    },
    {
      title: 'Tailwind',
      link: 'https://tailwindcss.com/',
    },
    {
      title: 'Auth.js',
      link: 'https://authjs.dev/',
    },
    {
      title: 'tRPC',
      link: 'https://trpc.io/',
    },
    {
      title: 'Prisma',
      link: 'https://www.prisma.io/',
    },
    {
      title: 'MongoDB',
      link: 'https://www.mongodb.com/',
    },
    {
      title: 'Redis',
      link: 'https://redis.io/',
    },
    {
      title: 'AWS S3',
      link: 'https://aws.amazon.com/s3/',
    },
  ]

  return (
    <RootLayout>
      <div className='relative flex w-screen flex-col items-center justify-center bg-gradient-to-r from-white to-[#f7eeff] to-70% pt-24 dark:from-[#272727] dark:to-[#131313] md:h-screen md:pt-0'>
        <div className='z-10 w-full px-6 pb-24 md:px-12 md:pb-0 lg:max-w-5xl xl:px-0'>
          <section className='mr-auto pb-6 el:pb-10'>
            <h6 className='text-xl uppercase el:text-3xl'>Introducing to</h6>
            <h1 className='text-6xl font-black text-[#501ea0] dark:text-[#dab9ff] el:text-8xl'>
              ARCH Framework
            </h1>
            <h2 className='text-base font-light el:text-xl'>
              <span className='opacity-80'>
                Scalability | Modularity | Full-stack typesafety
              </span>
            </h2>
          </section>
          <section>
            <div className='flex w-3/4 flex-wrap'>
              <p>
                Unleash Limitless Scalability and Type-Safe Mastery: Harness the
                Power of{' '}
              </p>
              {technologies.map((value, index) => (
                <Button
                  {...value}
                  key={value.title}
                  separator=','
                  index={index}
                />
              ))}
              <p>in Your Elite Full-Stack Framework.</p>
            </div>
          </section>
          <section className='pt-6 el:pt-10'>
            <div className='flex w-3/4 flex-wrap'>
              <p>1. Get started by editing</p>
              <Button title='src/app/(root)/page.tsx' link='' />
            </div>
            <p>2. Save and see your change instantly</p>
          </section>
          <section className='pt-6 el:pt-10'>
            <h6 className='mb-2 font-bold'>Folders structure</h6>
            <ul className='space-y-1 [&>li]:relative [&>li]:ml-2 [&>li]:flex [&>li]:flex-wrap [&>li]:space-x-1 [&>li]:pl-4 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-1/2 [&>li]:before:h-2 [&>li]:before:w-2 [&>li]:before:-translate-y-1/2 [&>li]:before:rounded-[2px] [&>li]:before:bg-[#a269ff] [&>li]:before:content-[""]'>
              <li>
                <Button title='src' link='' />
                <p>Source project</p>
              </li>
              <li>
                <Button title='backend' link='' />
                <p>tRPC, api, and authentication</p>
              </li>
              <li>
                <Button title='global' link='' />
                <p>Global config, constants, and environments</p>
              </li>
              <li>
                <Button title='arch' link='' />
                <p>Core package, plug-ins, and extensions</p>
              </li>
              <li>
                <Button title='scripts' link='' />
                <p>Utility scripts for app</p>
              </li>
              <li>
                <Button title='prod' link='' />
                <p>CI/CD, Docker, and production deployment</p>
              </li>
            </ul>
          </section>
        </div>
        <div className='fixed bottom-3 right-0 h-[100vw] w-[100vw] md:absolute md:bottom-0 xl:h-[100vh] xl:w-[100vh]'>
          <Logo />
        </div>
      </div>
      <Footer />
    </RootLayout>
  )
}

const Button = ({
  title,
  link,
  index,
  separator,
}: {
  title: string
  link: string
  index?: number
  separator?: string
}) => {
  return (
    <>
      {index !== 0 && separator}
      <Link
        href={link}
        target='_blank'
        className='Anim-1 ml-1 rounded-sm bg-primary/20 px-1 hover:bg-primary hover:text-white dark:bg-primary/40 dark:hover:bg-primary'
      >
        <button className='rounded-md focus:no-underline active:no-underline'>
          {title}
        </button>
      </Link>
    </>
  )
}

const Logo = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='#7c29ff'>
    <path d='M345.5,212.31l-125.44,212.36c-18.16,30.76-51.23,49.64-86.96,49.64H10.62c-8.2,0-13.29-8.89-9.15-15.96L245.46,42.38c3.66-6.24,12.68-6.26,16.35-.01l83.72,142.32c5.01,8.53,5.01,19.11-.03,27.63Z' />
    <path d='M501.94,474.31h-118.37c-59.26,0-95.1-65.52-63.11-115.42l60.55-94.45c3.83-5.98,12.61-5.78,16.17.34l113.43,194.45c3.91,6.69-.92,15.09-8.67,15.09Z' />
  </svg>
)

const Footer = () => {
  return (
    <footer className='dark:to-[#131313/0 fixed bottom-0 left-0 z-20 flex w-dvw justify-center bg-gradient-to-t from-white to-white/0 dark:from-[#131313] md:bg-none'>
      <div className='lg:px:0 z-50 flex h-20 w-full flex-col items-center justify-end pb-2 text-xs md:h-auto md:max-w-5xl md:flex-row md:justify-between md:px-8 md:text-base lg:px-0'>
        <p>
          <span className='opacity-40'>Developed by</span>{' '}
          <Link
            href='https://theiceji.com'
            className='Anim font-bold md:opacity-60 md:hover:opacity-100'
          >
            TheIceJi
          </Link>
        </p>

        <p>
          <span className='opacity-40'>Associate with</span>{' '}
          <Link
            href='https://nexellab.com/'
            className='Anim font-bold md:opacity-60 md:hover:opacity-100'
          >
            Nexel
          </Link>
        </p>
        {/* <br className='block lg:hidden' /> */}
        <p className='hidden lg:block'>
          <span className='opacity-40'>Build</span>{' '}
          <Link
            href='https://github.com/Nexel-Lab/Arch-Framework'
            className='Anim font-bold md:opacity-60 md:hover:opacity-100'
          >
            {app.VERSION}
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Page
