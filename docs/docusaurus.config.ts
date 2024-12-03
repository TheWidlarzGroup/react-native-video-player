import { themes as prismThemes } from 'prism-react-renderer';
import type { Config, ThemeConfig } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'React Native Video Player',
  favicon: 'img/favicon.png',
  // Set the production url of your site here
  url: 'https://docs.thewidlarzgroup.com',
  baseUrl: '/react-native-video-player/',

  organizationName: 'TheWidlarzGroup', // Usually your GitHub org/user name.
  projectName: 'react-native-video-player', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/TheWidlarzGroup/react-native-video-player/tree/master/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-image.png',
    navbar: {
      title: '🎥 React Native Video Player',
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          'href':
            'https://github.com/TheWidlarzGroup/react-native-video-player',
          // label: 'GitHub',
          'position': 'right',
          'className': 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oceanicNext,
    },
  } satisfies ThemeConfig,
};

export default config;
