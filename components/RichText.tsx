'use client'
import {PortableText, PortableTextComponents} from '@portabletext/react'
import Image from 'next/image'
import {urlFor} from '@/lib/image'

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      const url = urlFor(value).width(1200).url()
      return <Image src={url} alt="" width={1200} height={800} className="rounded-md" />
    },
  },
}

export default function RichText({value}:{value:any}) {
  return <PortableText value={value} components={components} />
}
    