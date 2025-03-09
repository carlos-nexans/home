import {notFound} from 'next/navigation';
 
export default async function Page({params}: {params: {locale: string}}) {
  const {locale} = await params;
 
  try {
    const Content = (await import(`./${locale}.mdx`)).default;
    return <Content />;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}