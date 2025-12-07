"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { IoNavigate } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ProductCardProps = {
  data: {
    id: string;
    name: string;
    price: number | string;
    quantity: number;
    createdAt: string;
    images?: Array<{
      id: string;
      imageUrl: string;
      productId: string;
    }>;
    seller: {
      id: string;
      username: string;
      email: string;
      profilePhotoUrl?: string | null;
    };
  };
};

const IDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function ProductCard({ data }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const createdAt = new Date(data.createdAt);
  const [hover, setHover] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link
      href={`/products/${data.id}`}
      className={`group flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out hover:border-slate-300 hover:shadow-md hover:-translate-y-1 overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Image Container */}
      <div
        className="relative w-full h-[170px] bg-gray-100"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {imageError || !data?.images?.[0]?.imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <Image
            src={data.images[0].imageUrl}
            alt={data?.name || "Product"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        <div
          className={`absolute inset-0 flex justify-center gap-2 items-center text-white font-semibold bg-black/50 transition-all duration-300 ease-in-out ${hover ? "opacity-100 visible" : "opacity-0 invisible"}`}
        >
          <span>Cek sekarang</span>
          <IoNavigate />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4 gap-y-2">
        {/* Product Name */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-green-500 line-clamp-2 transition-colors duration-300">
          {data.name}
        </h3>

        {/* Date Added */}
        {/*<p className="text-xs text-slate-500">
          {createdAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>*/}
        <div className="flex justify-start items-center gap-2">
          <Avatar>
            <AvatarImage src={data.seller.profilePhotoUrl || undefined} />
            <AvatarFallback>{data.seller.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <p>{data.seller.username}</p>
        </div>
        {/* Price and Stock - Push to bottom */}
        <div className="mt-auto pt-2 space-y-1 text-sm text-slate-600 border-t border-slate-100 flex flex-col">
          <span>{IDR.format(Number(data.price))}</span>
          <span className="text-red-500">sisa {data.quantity}</span>
        </div>
      </div>
    </Link>
  );
}
