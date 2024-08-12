'use client'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  data: { name: string; link: string }[]
  currentPage: string
}

export function ReBreadCrumbs({ data, currentPage }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data.map(({ name, link }, ind) => (
          <>
            <BreadcrumbItem key={ind}>
              <BreadcrumbLink asChild className={cn(currentPage)}>
                <Link href={link}>{name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {ind < data.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
