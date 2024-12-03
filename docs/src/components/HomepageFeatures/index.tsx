import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Focus on Customization',
    Svg: require('@site/static/img/customization.svg').default,
    description: (
      <>
        With built-in, customizable UI components, you can quickly tailor the
        video player to match your app's design and style, allowing you to focus
        more on your app's core features and user experience.
      </>
    ),
  },
  {
    title: 'Powered by react-native-video',
    Svg: require('@site/static/img/rely-on-rnv.svg').default,
    description: (
      <>
        Built on the reliable <code>react-native-video</code> foundation, this
        library enhances functionality and reliability, while also giving you
        the flexibility to extend it further as needed.
      </>
    ),
  },
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/easy-to-use.svg').default,
    description: (
      <>
        react-native-video-player makes video integration simple with custom
        controls and support for all <code>react-native-video</code> props,
        letting you easily switch your existing <code>Video</code> components.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
