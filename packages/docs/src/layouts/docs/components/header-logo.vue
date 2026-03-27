<script setup lang="ts">
import { createStyles } from "antdv-style";

import logoUrl from "@/assets/x.png";
import { clsx } from "@/utils";

import type { DocHeaderSharedProps } from "./header-shared";

defineProps<DocHeaderSharedProps>();

const useStyles = createStyles(({ token, css }) => ({
  root: css`
    margin: 0;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  `,
  logo: css`
    height: 80px;
    line-height: 80px;
    padding-inline-start: ${token.paddingXL}px;
    overflow: hidden;
    color: ${token.colorTextHeading};
    font-weight: 400;
    font-size: 20px;
    font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    letter-spacing: -0.18px;
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    column-gap: ${token.marginSM}px;

    &:hover {
      color: ${token.colorTextHeading};
    }

    img {
      width: 32px;
      height: 32px;
      display: inline-block;
      vertical-align: middle;
    }

    @media only screen and (max-width: 767.99px) {
      padding-inline-start: 0;
      padding-inline-end: 0;
    }
  `,
  title: css`
    line-height: 32px;
  `,
  mobile: css`
    padding-inline-start: 0 !important;
    font-size: 16px !important;
    color: ${token.colorTextHeading} !important;
    column-gap: 4px;

    img {
      width: 24px !important;
      height: 24px !important;
    }
  `,
}));

const styleState = useStyles();
</script>

<template>
  <h1 :class="styleState.styles.root">
    <router-link
      to="/"
      :class="
        clsx(
          styleState.styles.logo,
          (isMobile || isMini) && styleState.styles.mobile,
        )
      "
    >
      <img :src="logoUrl" draggable="false" alt="logo" />
      <span :class="styleState.styles.title">Antdv Next X</span>
    </router-link>
  </h1>
</template>
