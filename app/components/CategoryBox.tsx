"use client"

import React, { useCallback } from 'react'
import { IconType } from 'react-icons';

import qs from 'query-string'
import { useSearchParams,useRouter } from 'next/navigation';


interface CategoryBoxProps {
    label: string,
    icon: IconType,
    selected?: boolean;
} 

const CategoryBox: React.FC<CategoryBoxProps> = ({
    label,
    icon: Icon,
    selected
}) => {

    const params = useSearchParams();
    const router = useRouter();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if(params){
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        if(params?.get('category') === label){
            delete updatedQuery.category;
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, {skipNull: true})

        router.push(url)
        
    }, [params,label,router])
    

  return (
    <div
    onClick={handleClick}
    className={`
      flex 
      flex-col 
      items-center 
      justify-center 
      gap-2
      p-3
      border-b-2
      hover:text-neutral-800
      transition
      cursor-pointer
      ${selected ? 'border-b-neutral-800' : 'border-transparent'}
      ${selected ? 'text-neutral-800' : 'text-neutral-500'}
    `}
  >
    <Icon size={26} />
    <div className="font-medium text-sm">
      {label}
    </div>
  </div>
  )
}

export default CategoryBox
