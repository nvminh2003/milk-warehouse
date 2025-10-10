// ComponentIcon.jsx
import React from "react";
import { Icon } from "@iconify/react";

export const IconMap = [
  { keywords: ['milk'], icon: 'tdesign:milk-filled' },
  { keywords: ['category'], icon: 'mdi:category-plus-outline' },
  { keywords: ['unitMeasure'], icon: 'fontisto:unity' },
  { keywords: ['storageCondition'], icon: 'f7:thermometer-snowflake' },
  { keywords: ['partner'], icon: 'mdi:partnership' },
  { keywords: ['retailer'], icon: 'emojione-monotone:department-store' },
  { keywords: ['supplier'], icon: 'emojione-monotone:factory' },



  // có thể thêm nhiều icon khác ở đây
];

// component nhỏ để gọi icon theo keyword
export const ComponentIcon = ({ name, color = "white", size = 20, collapsed = false }) => {
  const found = IconMap.find(item => item.keywords.includes(name));
  if (!found) return null;

  // Đặc biệt xử lý cho milk và unitMeasure icon để căn chỉnh tốt hơn
  const isMilkIcon = name === 'milk';
  const isUnitMeasureIcon = name === 'unitMeasure';
  const isCategoryIcon = name === 'category';
  const isStorageCondition = name === 'storageCondition';
  const isPartnerIcon = name === 'partner';
  const isRetailerIcon = name === 'retailer';
  const isSupplierIcon =name === 'supplier';
  const needsSpecialAlignment = isMilkIcon || isUnitMeasureIcon || isCategoryIcon || isStorageCondition || isPartnerIcon || isRetailerIcon||isSupplierIcon;

  return (
    <Icon
      icon={found.icon}
      style={{
        color,
        fontSize: size,
        verticalAlign: needsSpecialAlignment ? 'baseline' : 'middle',
        display: 'inline-block',
        lineHeight: 1,
        marginTop: needsSpecialAlignment ? '-1px' : '0',
        marginRight: needsSpecialAlignment && !collapsed ? '8px' : '0',
        transform: needsSpecialAlignment ? 'translateY(1px)' : 'none'
      }}
    />
  );
};
