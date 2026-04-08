import type { PropType, TransitionProps, VNodeChild } from "vue";

import { RightOutlined } from "@antdv-next/icons";
import { computed, defineComponent, Transition } from "vue";

import type {
  GroupInfoType,
  GroupLabelRenderInfo,
  GroupLabelRender,
} from "./interface";

import { hasRenderableNode } from "../_utils/vue";

export interface GroupTitleProps {
  prefixCls?: string;
  groupInfo: GroupInfoType;
  groupLabelRender?: GroupLabelRender;
  groupLabelRenderSlot?: (info: GroupLabelRenderInfo) => VNodeChild;
  classes?: any;
  enableCollapse?: boolean;
  expandedKeys?: string[];
  onItemExpand?: (curKey: string) => void;
  collapseTransition?: TransitionProps;
}

const GroupTitle = defineComponent({
  name: "XConversationsGroupTitle",
  props: {
    prefixCls: {
      type: String,
      default: "antd-conversations",
    },
    groupInfo: {
      type: Object as PropType<GroupInfoType>,
      required: true,
    },
    groupLabelRender: {
      type: [String, Number, Object, Array, Function] as PropType<
        GroupTitleProps["groupLabelRender"]
      >,
      default: undefined,
    },
    groupLabelRenderSlot: {
      type: Function as PropType<GroupTitleProps["groupLabelRenderSlot"]>,
      default: undefined,
    },
    classes: {
      type: [String, Array, Object] as PropType<GroupTitleProps["classes"]>,
      default: undefined,
    },
    enableCollapse: {
      type: Boolean,
      default: true,
    },
    expandedKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    onItemExpand: {
      type: Function as PropType<GroupTitleProps["onItemExpand"]>,
      default: undefined,
    },
    collapseTransition: {
      type: Object as PropType<TransitionProps>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const mergeCollapsible = computed(() => {
      return props.groupInfo.collapsible && props.enableCollapse;
    });

    const groupOpen = computed(() => {
      if (!mergeCollapsible.value) return true;

      return props.expandedKeys?.includes(props.groupInfo.name);
    });

    const labelNode = computed(() => {
      const { label, name } = props.groupInfo;
      const originNode =
        typeof label === "function"
          ? label(name, { groupInfo: props.groupInfo })
          : label || name;
      const renderInfo: GroupLabelRenderInfo = {
        group: name,
        groupInfo: props.groupInfo,
        originNode,
      };

      if (props.groupLabelRenderSlot) {
        return props.groupLabelRenderSlot(renderInfo);
      }

      if (props.groupLabelRender !== undefined) {
        return typeof props.groupLabelRender === "function"
          ? props.groupLabelRender(name, renderInfo)
          : props.groupLabelRender;
      }

      return originNode;
    });

    return () => (
      <li class={props.classes}>
        <div
          class={[
            `${props.prefixCls}-group-title`,
            {
              [`${props.prefixCls}-group-title-collapsible`]:
                mergeCollapsible.value,
            },
          ]}
          onClick={() => {
            if (mergeCollapsible.value)
              props.onItemExpand?.(props.groupInfo.name);
          }}
        >
          {hasRenderableNode(labelNode.value) && (
            <div class={`${props.prefixCls}-group-label`}>
              {labelNode.value}
            </div>
          )}
          {mergeCollapsible.value && (
            <div
              class={[
                `${props.prefixCls}-group-collapse-trigger`,
                `${props.prefixCls}-group-collapse-trigger-${groupOpen.value ? "open" : "close"}`,
              ]}
            >
              <RightOutlined />
            </div>
          )}
        </div>
        <Transition {...(props.collapseTransition ?? {})}>
          {mergeCollapsible.value ? (
            groupOpen.value ? (
              <div>{slots.default?.()}</div>
            ) : null
          ) : (
            <div>{slots.default?.()}</div>
          )}
        </Transition>
      </li>
    );
  },
});

export default GroupTitle;
