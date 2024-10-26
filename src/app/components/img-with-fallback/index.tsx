'use client';
import React, { forwardRef, useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Image } from '@nextui-org/react';

export interface ImgProps {
  src: string;
  fallbackSrc: string;
}

const ImageWithFallback = forwardRef<HTMLImageElement, ImgProps>(
  ({ fallbackSrc, src, ...rest }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      setImgSrc(src);
      setIsError(false);
    }, [src]);

    return (
      <Image
        className="rounded-none"
        ref={ref}
        {...rest}
        as={NextImage}
        width={isError ? 200 : 958}
        height={isError ? 200 : 589}
        alt="img-step"
        src={imgSrc}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsError(true);
        }}
      />
    );
  },
);

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;
