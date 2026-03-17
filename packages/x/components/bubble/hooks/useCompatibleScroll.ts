import type { Ref } from "vue";

import { onBeforeUnmount, watch } from "vue";

function isReverse(scrollDom: HTMLElement) {
  return getComputedStyle(scrollDom).flexDirection === "column-reverse";
}

export function useCompatibleScroll(
  scrollDomRef: Ref<HTMLElement | undefined>,
  contentDomRef: Ref<HTMLElement | undefined>,
) {
  let sentinelDom: HTMLElement | null = null;
  const sentinelHeight = 10;
  let isAtBottom = true;
  let shouldLock = false;
  let lockedScrollBottomPos = 0;
  let scrolling: ReturnType<typeof setTimeout> | undefined;
  let callOnScrollNotNative = false;
  let isScrollToBottom = false;
  let intersectionObserver: IntersectionObserver | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let boundScrollDom: HTMLElement | undefined;

  const clearTimer = () => {
    if (!scrolling) return;
    clearTimeout(scrolling);
    scrolling = undefined;
  };

  const setTimer = () => {
    clearTimer();
    scrolling = setTimeout(() => {
      clearTimer();
      isScrollToBottom = false;
    }, 50);
  };

  const enforceScrollLock = () => {
    const scrollDom = scrollDomRef.value;
    if (!scrollDom) return;

    const targetScroll = lockedScrollBottomPos - scrollDom.scrollHeight;
    scrollDom.scrollTop = targetScroll;
    callOnScrollNotNative = true;
  };

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!isReverse(target)) return;

    lockedScrollBottomPos = target.scrollHeight + target.scrollTop;

    if (callOnScrollNotNative) {
      callOnScrollNotNative = false;
      return;
    }

    setTimer();
  };

  const teardown = () => {
    intersectionObserver?.disconnect();
    intersectionObserver = undefined;

    resizeObserver?.disconnect();
    resizeObserver = undefined;

    if (boundScrollDom) {
      boundScrollDom.removeEventListener("scroll", handleScroll, {
        capture: true,
      });
      boundScrollDom = undefined;
    }

    if (sentinelDom?.parentNode) {
      sentinelDom.parentNode.removeChild(sentinelDom);
    }
    sentinelDom = null;

    clearTimer();
  };

  watch(
    [scrollDomRef, contentDomRef],
    ([scrollDom, contentDom]) => {
      teardown();
      if (!scrollDom || !contentDom) return;

      const sentinel = document.createElement("div");
      sentinel.style.bottom = "0";
      sentinel.style.flexShrink = "0";
      sentinel.style.pointerEvents = "none";
      sentinel.style.height = `${sentinelHeight}px`;
      sentinel.style.visibility = "hidden";
      scrollDom.insertBefore(sentinel, scrollDom.firstChild);
      sentinelDom = sentinel;

      if (typeof IntersectionObserver !== "undefined") {
        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            isAtBottom = entry?.isIntersecting ?? false;
            shouldLock = !isAtBottom;
          },
          { root: scrollDom, threshold: 0.0 },
        );
        intersectionObserver.observe(sentinel);
      }

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          const currentScrollDom = scrollDomRef.value;
          if (!currentScrollDom) return;

          if (scrolling) {
            if (isScrollToBottom) {
              requestAnimationFrame(() => {
                currentScrollDom.scrollTo({
                  top: isReverse(currentScrollDom)
                    ? 0
                    : currentScrollDom.scrollHeight,
                  behavior: "instant",
                });
              });
            }
            return;
          }

          if (isReverse(currentScrollDom) && shouldLock) {
            enforceScrollLock();
          }
        });
        resizeObserver.observe(contentDom);
      }

      scrollDom.addEventListener("scroll", handleScroll, { capture: true });
      boundScrollDom = scrollDom;
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    teardown();
  });

  const scrollTo = (
    option?: ScrollToOptions & {
      intoView?: ScrollIntoViewOptions;
      intoViewDom?: HTMLElement;
    },
  ) => {
    const scrollDom = scrollDomRef.value;
    const contentDom = contentDomRef.value;
    if (!scrollDom || !contentDom) return;

    const { top, intoView, intoViewDom } = option || {};

    if (isReverse(scrollDom)) {
      if (top !== undefined && top >= -sentinelHeight) {
        isScrollToBottom = true;
      } else if (intoViewDom && intoView?.block === "end") {
        isScrollToBottom = contentDom.lastElementChild === intoViewDom;
      } else {
        isScrollToBottom = false;
      }
    } else if (
      top !== undefined &&
      top >= scrollDom.scrollHeight - scrollDom.clientHeight - sentinelHeight
    ) {
      isScrollToBottom = true;
    } else if (intoViewDom && intoView?.block === "end") {
      isScrollToBottom = contentDom.lastElementChild === intoViewDom;
    } else {
      isScrollToBottom = false;
    }

    if (!scrolling) {
      setTimer();
    }

    if (intoViewDom) {
      intoViewDom.scrollIntoView(intoView);
      return;
    }

    scrollDom.scrollTo(option);
  };

  return { scrollTo };
}
