import Konva from 'konva';
import React, { useEffect, useRef } from 'react';
import { Transformer, Rect } from 'react-konva';

export type Shape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

interface SelectRectangleProps {
  shape: Shape;
  isSelected: boolean;
  onRemove: () => void;
  onSelect: () => void;
  onChange: (value: Shape) => void;
}

const SelectRectangle = ({
  shape,
  isSelected,
  onRemove,
  onSelect,
  onChange,
}: SelectRectangleProps) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && shapeRef.current && transformerRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()!.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shape}
        draggable
        fill="transparent"
        onDragEnd={(e) => {
          onChange({
            ...shape,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onDragStart={onSelect}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shape,
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          keepRatio={false}
          ref={transformerRef}
          rotateEnabled={false}
        />
      )}
    </>
  );
};

export default SelectRectangle;
