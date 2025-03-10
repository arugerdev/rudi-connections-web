import { Image } from "@heroui/react";
import { Divider } from "@heroui/divider";

interface Props {
  children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
  return (
    <div className='flex h-screen'>
      <header className="md:hidden flex flex-row gap-6 absolute top-0 p-4 w-full ">
        <Image
          className='w-full h-full '
          width={64}
          src='/icon_300x300.png'
          alt='gradient'
        />
        <section className="flex flex-col">
          <h1 className="font-bold text-[24px]">Rud1</h1>
          <h2>Panel de administración</h2>
        </section>
      </header>
      <div className='flex-1 w-full flex-col flex items-center justify-center p-6'>
        {children}
      </div>

      <div className='hidden my-10 md:block'>
        <Divider orientation='vertical' />
      </div>

      <div className='hidden md:flex flex relative flex-col items-center justify-center p-6'>
        <div className='flex items-start justify-center z-0'>
          <Image
            className='w-full h-full '
            width={86}
            src='/icon_300x300.png'
            alt='gradient'
          />
        </div>

        <div className='flex w-full flex-col items-center justify-center gap-16 px-4 z-10'>
          <section className="flex flex-col items-center justify-center gap-4">
            <h1 className='font-bold text-[24px] xl:text-[38px]'>Rud1 - Panel de administración</h1>
            <p className='font-light text-slate-400 max-w-prose text-[14px] xl:text-[18px]'>
              Panel de administración para tus dispostivos Rud1, puedes añadir, configurar, enceder, apagar, probar o conectarte a tus dispostivos desde aquí. Inicia sesión o crea una cuenta para empezar.
            </p>
          </section>
          <iframe className="rounded-xl" width={560} height={315} src="https://www.youtube.com/embed/GqrLummFWPc?si=Cixm-EcDuwnkejaA&amp;controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};
