import type { PropType } from "vue";

import { LeftOutlined, RightOutlined } from "@antdv-next/icons";
import { Carousel } from "antdv-next";
import { defineComponent, nextTick, ref, watch } from "vue";

import type {
  SourcesItem,
  SourcesItemSlotInfo,
  SourcesProps,
} from "../interface";

const hasRenderableNode = (node: unknown): boolean => {
  if (Array.isArray(node))
    return node.some(
      item => item !== null && item !== undefined && item !== false,
    );

  return node !== null && node !== undefined && node !== false;
};

export interface CarouselCardProps {
  activeKey?: SourcesProps["activeKey"];
  prefixCls: string;
  items?: SourcesProps["items"];
  classes?: any;
  style?: any;
  onClick?: (item: SourcesItem) => void;
  iconRenderSlot?: (info: SourcesItemSlotInfo) => any;
  titleRenderSlot?: (info: SourcesItemSlotInfo) => any;
  descriptionSlot?: (info: SourcesItemSlotInfo) => any;
}

const CarouselCard = defineComponent({
  name: "XSourcesCarouselCard",
  props: {
    activeKey: {
      type: [String, Number] as PropType<CarouselCardProps["activeKey"]>,
      default: undefined,
    },
    prefixCls: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<SourcesItem[]>,
      default: undefined,
    },
    classes: {
      type: [String, Array, Object] as PropType<CarouselCardProps["classes"]>,
      default: undefined,
    },
    style: {
      type: [String, Object, Array] as PropType<CarouselCardProps["style"]>,
      default: undefined,
    },
    onClick: {
      type: Function as PropType<CarouselCardProps["onClick"]>,
      default: undefined,
    },
    iconRenderSlot: {
      type: Function as PropType<CarouselCardProps["iconRenderSlot"]>,
      default: undefined,
    },
    titleRenderSlot: {
      type: Function as PropType<CarouselCardProps["titleRenderSlot"]>,
      default: undefined,
    },
    descriptionSlot: {
      type: Function as PropType<CarouselCardProps["descriptionSlot"]>,
      default: undefined,
    },
  },
  setup(props) {
    const compCls = `${props.prefixCls}-carousel`;
    const slide = ref(0);
    const carouselRef = ref<InstanceType<typeof Carousel>>();

    watch(
      [() => props.activeKey, () => props.items],
      () => {
        void nextTick(() => {
          if (carouselRef.value) {
            const current = Math.max(
              0,
              props.items?.findIndex(({ key }) => key === props.activeKey) ?? 0,
            );
            slide.value = current;
            (carouselRef.value as any).goTo(current, false);
          }
        });
      },
      { immediate: true },
    );

    const handleClick = (item: SourcesItem) => {
      if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
      props.onClick?.(item);
    };

    const renderWithSlot = (
      slotRender: ((info: SourcesItemSlotInfo) => any) | undefined,
      item: SourcesItem,
      index: number,
      originNode: any,
    ) => {
      if (slotRender) {
        return slotRender({
          item,
          index,
          originNode,
        });
      }

      return originNode;
    };

    return () => (
      <div style={props.style} class={[`${compCls}-wrapper`, props.classes]}>
        <div class={`${compCls}-title`}>
          <div class={`${compCls}-btn-wrapper`}>
            <span
              class={[
                `${compCls}-btn`,
                `${compCls}-left-btn`,
                { [`${compCls}-btn-disabled`]: slide.value === 0 },
              ]}
              onClick={() => (carouselRef.value as any)?.prev()}
            >
              <LeftOutlined />
            </span>
            <span
              class={[
                `${compCls}-btn`,
                `${compCls}-right-btn`,
                {
                  [`${compCls}-btn-disabled`]:
                    slide.value === (props.items?.length || 1) - 1,
                },
              ]}
              onClick={() => (carouselRef.value as any)?.next()}
            >
              <RightOutlined />
            </span>
          </div>
          <div class={`${compCls}-page`}>
            {`${slide.value + 1}/${props.items?.length || 1}`}
          </div>
        </div>
        <Carousel
          class={compCls}
          ref={carouselRef}
          arrows={false}
          infinite={false}
          dots={false}
          afterChange={(current: number) => {
            slide.value = current;
          }}
          beforeChange={(_: number, nextSlide: number) => {
            slide.value = nextSlide;
          }}
        >
          {props.items?.map((item, index) =>
            (() => {
              const iconNode = renderWithSlot(
                props.iconRenderSlot,
                item,
                index,
                item.icon,
              );
              const titleNode = renderWithSlot(
                props.titleRenderSlot,
                item,
                index,
                item.title,
              );
              const descriptionNode = renderWithSlot(
                props.descriptionSlot,
                item,
                index,
                item.description,
              );

              return (
                <div
                  key={item.key ?? index}
                  class={`${compCls}-item`}
                  onClick={() => handleClick(item)}
                >
                  <div class={`${compCls}-item-title-wrapper`}>
                    {hasRenderableNode(iconNode) && (
                      <span class={`${compCls}-item-icon`}>{iconNode}</span>
                    )}
                    <span class={`${compCls}-item-title`}>{titleNode}</span>
                  </div>
                  {hasRenderableNode(descriptionNode) && (
                    <div class={`${compCls}-item-description`}>
                      {descriptionNode}
                    </div>
                  )}
                </div>
              );
            })(),
          )}
        </Carousel>
      </div>
    );
  },
});

export default CarouselCard;
