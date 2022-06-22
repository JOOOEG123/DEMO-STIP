export const NavBar = [
  {
    title: 'HOME',
    url: '/home',
    icon: 'home',
  },
  {
    title: 'ABOUT',
    url: '/about',
    icon: 'info',
    dropdown: [
      {
        title: 'About movement',
        url: '/about/movement',
        icon: 'info',
      },
      {
        title: 'Projects Overview',
        url: '/about/team',
        icon: 'envelope',
      },
      {
        title: 'Resources',
        url: '/about/resources',
        icon: 'envelope',
      },
    ],
  },
  {
    title: 'BROWSE',
    url: '/browse',
    icon: 'home',
    dropdown: [
      {
        title: 'Archive',
        url: '/browse/main',
        icon: 'home',
      },
      {
        title: 'Gallery',
        url: '/browse/gallery',
        icon: 'home',
      },
    ],
  },
];
