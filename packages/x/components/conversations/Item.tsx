import type { PropType, VNodeChild } from "vue";

import { EllipsisOutlined } from "@antdv-next/icons";
import { Dropdown, Typography } from "antdv-next";
import { computed, defineComponent } from "vue";

import type { DirectionType } from "../_utils/type";
import type {
  ConversationItemRenderInfo,
  ConversationItemType,
  ConversationsItemMenu,
  ConversationsProps,
} from "./interface";

import { hasRenderableNode } from "../_utils/vue";

export interface ConversationsItemProps {
  info: ConversationItemType;
  index: number;
  prefixCls?: string;
  direction?: DirectionType;
  menu?: ConversationsItemMenu;
  active?: boolean;
  labelRender?: ConversationsProps["labelRender"];
  iconRender?: ConversationsProps["iconRender"];
  labelRenderSlot?: (info: ConversationItemRenderInfo) => VNodeChild;
  iconRenderSlot?: (info: ConversationItemRenderInfo) => VNodeChild;
  classes?: any;
  style?: any;
  onClick?: ConversationsProps["onActiveChange"];
}

const stopPropagation = (event: Event) => {
  event.stopPropagation();
};

const renderWithPriority = (
  render: ConversationsProps["labelRender"],
  slotRender: ConversationsItemProps["labelRenderSlot"],
  info: ConversationItemRenderInfo,
) => {
  if (slotRender) return slotRender(info);

  if (render !== undefined) {
    return typeof render === "function" ? render(info.item, info) : render;
  }

  return info.originNode;
};

const ConversationsItem = defineComponent({
  name: "XConversationsItem",
  inheritAttrs: false,
  props: {
    info: {
      type: Object as PropType<ConversationItemType>,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    prefixCls: {
      type: String,
      default: "antd-conversations",
    },
    direction: {
      type: String as PropType<DirectionType>,
      default: "ltr",
    },
    menu: {
      type: Object as PropType<ConversationsItemMenu>,
      default: undefined,
    },
    active: {
      type: Boolean,
      default: false,
    },
    labelRender: {
      type: [String, Number, Object, Array, Function] as PropType<
        ConversationsItemProps["labelRender"]
      >,
      default: undefined,
    },
    iconRender: {
      type: [String, Number, Object, Array, Function] as PropType<
        ConversationsItemProps["iconRender"]
      >,
      default: undefined,
    },
    labelRenderSlot: {
      type: Function as PropType<ConversationsItemProps["labelRenderSlot"]>,
      default: undefined,
    },
    iconRenderSlot: {
      type: Function as PropType<ConversationsItemProps["iconRenderSlot"]>,
      default: undefined,
    },
    classes: {
      type: [String, Array, Object] as PropType<
        ConversationsItemProps["classes"]
      >,
      default: undefined,
    },
    style: {
      type: [String, Object, Array] as PropType<
        ConversationsItemProps["style"]
      >,
      default: undefined,
    },
    onClick: {
      type: Function as PropType<ConversationsProps["onActiveChange"]>,
      default: undefined,
    },
  },
  setup(props) {
    const mergedClasses = computed(() => {
      const disabled = props.info.disabled;
      return [
        props.classes,
        `${props.prefixCls}-item`,
        {
          [`${props.prefixCls}-item-active`]: props.active && !disabled,
          [`${props.prefixCls}-item-disabled`]: disabled,
        },
      ];
    });

    const menuProps = computed(() => {
      if (!props.menu) return undefined;

      const { trigger: _trigger, ...other } = props.menu;
      return other;
    });

    const renderMenuTrigger = (conversation: ConversationItemType) => {
      const originTriggerNode = (
        <EllipsisOutlined
          onClick={stopPropagation}
          class={`${props.prefixCls}-menu-icon`}
        />
      );

      if (!props.menu?.trigger) return originTriggerNode;

      return typeof props.menu.trigger === "function"
        ? props.menu.trigger(conversation, { originNode: originTriggerNode })
        : props.menu.trigger;
    };

    return () => {
      const disabled = props.info.disabled;
      const labelNode = renderWithPriority(
        props.labelRender,
        props.labelRenderSlot,
        {
          item: props.info,
          index: props.index,
          active: props.active,
          originNode: props.info.label,
        },
      );
      const iconNode = renderWithPriority(
        props.iconRender,
        props.iconRenderSlot,
        {
          item: props.info,
          index: props.index,
          active: props.active,
          originNode: props.info.icon,
        },
      );

      return (
        <li
          title={
            typeof props.info.label === "string" ? props.info.label : undefined
          }
          class={mergedClasses.value}
          style={props.style}
          onClick={() => {
            if (!disabled) props.onClick?.(props.info.key, props.info);
          }}
        >
          {hasRenderableNode(iconNode) && (
            <div class={`${props.prefixCls}-icon`}>{iconNode}</div>
          )}
          <Typography.Text class={`${props.prefixCls}-label`}>
            {labelNode}
          </Typography.Text>
          {!disabled && props.menu && (
            <div onClick={stopPropagation}>
              <Dropdown
                menu={menuProps.value}
                placement={
                  props.direction === "rtl" ? "bottomLeft" : "bottomRight"
                }
                trigger={["click"]}
                disabled={disabled}
                getPopupContainer={menuProps.value?.getPopupContainer}
              >
                {renderMenuTrigger(props.info)}
              </Dropdown>
            </div>
          )}
        </li>
      );
    };
  },
});

export default ConversationsItem;
