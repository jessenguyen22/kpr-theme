import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";

interface ParagraphData {
  text: string;
  color: string;
  size: "small" | "medium" | "large";
  alignment: "left" | "center" | "right";
}

type ParagraphProps = HydrogenComponentProps & ParagraphData;

export let schema = createSchema({
  type: "hero-paragraph",
  title: "Paragraph",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "textarea",
          name: "text",
          label: "Text",
          defaultValue: "Discover our amazing products and services",
        },
        {
          type: "select",
          name: "size",
          label: "Size",
          defaultValue: "medium",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ],
          },
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "color",
          name: "color",
          label: "Color",
          defaultValue: "#ffffff",
        },
        {
          type: "select",
          name: "alignment",
          label: "Alignment",
          defaultValue: "center",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
        },
      ],
    },
  ],
});

const sizeClasses = {
  small: "text-base md:text-lg",
  medium: "text-lg md:text-xl",
  large: "text-xl md:text-2xl",
};

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const HeroParagraph = forwardRef<HTMLParagraphElement, ParagraphProps>((props, ref) => {
  const {
    text = "Discover our amazing products and services",
    color = "#ffffff",
    size = "medium",
    alignment = "center",
    className,
  } = props;

  return (
    <p
      ref={ref}
      className={clsx(
        sizeClasses[size],
        alignmentClasses[alignment],
        className
      )}
      style={{ color }}
    >
      {text}
    </p>
  );
});

export default HeroParagraph; 