import Konva from 'konva';
import React, { useEffect, useRef } from 'react';
import { Image, Group } from 'react-konva';

type Shape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface BlurShapeProps {
  shape: Shape;
  imageElement?: HTMLImageElement;
  imageWidth: number;
  imageHeight: number;
  filterKind?: 'blur' | 'pixelate';
  filterSize?: number;
}

const BlurShape = ({
  shape,
  imageWidth,
  imageHeight,
  imageElement,
  filterKind = 'blur',
  filterSize = 50,
}: BlurShapeProps) => {
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    if (imageElement) {
      imageRef.current?.cache();
    }
  }, [imageElement]);

  if (!imageElement) return null;

  const getClip = () => {
    let x = shape.x;
    let y = shape.y;
    let height = shape.height;
    let width = shape.width;

    if (height < 0) {
      height *= -1;
      y = y - height;
    }
    if (width < 0) {
      width *= -1;
      x = x - width;
    }

    return {
      x,
      y,
      height,
      width,
    };
  };

  const clip = getClip();

  const getFilterProps = () => {
    if (filterKind === 'pixelate') {
      return {
        filters: [Konva.Filters.Pixelate],
        pixelSize: filterSize,
      };
    }
    if (filterKind === 'blur') {
      return {
        filters: [Konva.Filters.Blur],
        blurRadius: filterSize,
      };
    }
    return {};
  };

  return (
    <Group clip={clip} key={shape.id}>
      <Image
        {...getFilterProps()}
        height={imageHeight}
        image={imageElement}
        ref={imageRef}
        width={imageWidth}
        x={0}
        y={0}
      />
    </Group>
  );
};

export default BlurShape;
