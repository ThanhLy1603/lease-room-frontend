import {
  Snowflake,
  Layers,
  Fingerprint,
  ParkingMeter,
  Wifi,
  Shirt,
  Refrigerator,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

export const getAmenityIcon = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    snowflake: Snowflake,
    layers: Layers,
    fingerprint: Fingerprint,
    parking: ParkingMeter,
    wifi: Wifi,
    'washing-machine': Shirt,
    refrigerator: Refrigerator,
  };

  return iconMap[iconName] || CheckCircle2;
};