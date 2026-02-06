"use client"

import { useProductsData } from "../../../../hooks/products-hook";

export default function ProductsPage(){
    const {data, isError, error} = useProductsData(1);
    console.log(data);
    return <div>products</div>
}