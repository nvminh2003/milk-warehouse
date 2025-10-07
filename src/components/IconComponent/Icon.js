// ComponentIcon.jsx
import React from "react";
import { Icon } from "@iconify/react";

export const IconMap = [
  { keywords: ['milk'], icon: 'tdesign:milk-filled' },
  { keywords: ['category'], icon: 'mdi:category-plus-outline' },
  // có thể thêm nhiều icon khác ở đây
];

// component nhỏ để gọi icon theo keyword
export const ComponentIcon = ({ name, color = "white", size = 20, collapsed = false }) => {
  const found = IconMap.find(item => item.keywords.includes(name));
  if (!found) return null;
  
  // Đặc biệt xử lý cho milk icon để căn chỉnh tốt hơn
  const isMilkIcon = name === 'milk';
  
  return (
    <Icon 
      icon={found.icon} 
      style={{ 
        color, 
        fontSize: size,
        verticalAlign: isMilkIcon ? 'baseline' : 'middle',
        display: 'inline-block',
        lineHeight: 1,
        marginTop: isMilkIcon ? '-1px' : '0',
        marginRight: isMilkIcon && !collapsed ? '8px' : '0',
        transform: isMilkIcon ? 'translateY(1px)' : 'none'
      }} 
    />
  );
};
