import {
  IconHome,
  IconPoint,
  IconApps,
  IconClipboard,
  IconFileDescription,
  IconBorderAll,
  IconAlertCircle,
  IconSettings,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconZoomCode,
  IconShoppingCart,
  IconMenuOrder,
  IconForklift,
  IconReportMoney,
  IconShoppingCartDiscount,
  IconUsers,
  IconUserCircle

} from '@tabler/icons';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconShoppingCart,
    href: '/dashboards/ecommerce',
  },
  {
    id: uniqueId(),
    title: 'Manage Orders',
    icon: IconMenuOrder,
    href: '/apps/ecommerce/shop',
    children: [
      {
        id: uniqueId(),
        title: 'Pending Orders',
        icon: IconPoint,
        href: '/pendingOrders',
      },
      {
        id: uniqueId(),
        title: 'Dispatched Orders',
        icon: IconPoint,
        href: '/dispatchedOrders',
      },
      {
        id: uniqueId(),
        title: 'Delivered Orders',
        icon: IconPoint,
        href: '/deliveredOrders',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Inventory',
    icon: IconForklift,
    href: '/apps/ecommerce/detail/1',
    children: [
      {
        id: uniqueId(),
        title: 'Add/Edit products',
        icon: IconPoint,
        href: '/manageProducts',
      },
      {
        id: uniqueId(),
        title: 'Update Quantity',
        icon: IconPoint,
        href: '/updateQuantity',
      },
      {
        id: uniqueId(),
        title: 'Disable product',
        icon: IconPoint,
        href: '/disableProduct',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Sales',
    icon: IconReportMoney,
    href: '/apps/ecommerce/detail/1',
    children: [
      {
        id: uniqueId(),
        title: 'Amount',
        icon: IconPoint,
        href: '/amountSales',
      },
      {
        id: uniqueId(),
        title: 'Product',
        icon: IconPoint,
        href: '/productSales',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Offers',
    icon: IconShoppingCartDiscount,
    href: '/apps/ecommerce/detail/1',
    children: [
      {
        id: uniqueId(),
        title: 'Create Offer',
        icon: IconPoint,
        href: '/createOffer',
      },
      {
        id: uniqueId(),
        title: 'Offers Analytics',
        icon: IconPoint,
        href: '/offerAnalytics',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Customer',
    icon: IconUsers,
    href: '/apps/ecommerce/detail/1',
    children: [
      {
        id: uniqueId(),
        title: 'New Customers',
        icon: IconPoint,
        href: '/newCustomers',
      },
      {
        id: uniqueId(),
        title: 'Customer Stats',
        icon: IconPoint,
        href: '/customersStats',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUserCircle,
    href: '/user-profile',
    children: [
      {
        id: uniqueId(),
        title: 'Add Users',
        icon: IconPoint,
        href: '/addUser',
      },
      // {
      //   id: uniqueId(),
      //   title: 'Roll Base Access',
      //   icon: IconLockAccess,
      //   href: '/pages/casl',
      // },
    ],
  },
  {
    id: uniqueId(),
    title: 'Account Setting',
    icon: IconSettings,
    href: '/pages/account-settings',
  },
];
export default Menuitems;
