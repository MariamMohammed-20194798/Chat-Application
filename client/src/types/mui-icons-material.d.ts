declare module '@mui/icons-material/CheckCircleOutline' {
  import { SvgIconProps } from '@mui/material/SvgIcon';
  const CheckCircleOutlineIcon: React.ComponentType<SvgIconProps>;
  export default CheckCircleOutlineIcon;
}

declare module '@mui/icons-material/*' {
  import { SvgIconProps } from '@mui/material/SvgIcon';
  const icon: React.ComponentType<SvgIconProps>;
  export default icon;
}
