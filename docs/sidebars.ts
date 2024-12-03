import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'installation',
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      link: {
        type: 'generated-index',
      },
      items: [
        {
          type: 'doc',
          id: 'api/properties',
          label: 'Properties',
        },
        {
          type: 'doc',
          id: 'api/events',
          label: 'Events',
        },
        {
          type: 'doc',
          id: 'api/methods',
          label: 'Methods',
        },
        {
          type: 'doc',
          id: 'api/styles',
          label: 'Styles',
        },
      ],
    },
  ],
};

export default sidebars;
