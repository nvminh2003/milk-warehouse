// ComponentIcon.jsx
import React from "react";
import { Icon } from "@iconify/react";

export const IconMap = [
  { keywords: ['milk'], icon: 'tdesign:milk-filled' },
  // có thể thêm nhiều icon khác ở đây
];

// component nhỏ để gọi icon theo keyword
export const ComponentIcon = ({ name, color = "white", size = 20 }) => {
  const found = IconMap.find(item => item.keywords.includes(name));
  if (!found) return null;
  return <Icon icon={found.icon} style={{ color, fontSize: size }} />;
};
