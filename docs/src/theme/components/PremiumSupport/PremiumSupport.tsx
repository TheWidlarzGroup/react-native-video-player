import Link from '@docusaurus/Link';
import './PremiumSupport.style.css';

export const PremiumSupport = () => {
  return (
    <div className="premium-support__container">
      <span className="premium-support__text">We are TheWidlarzGroup</span>
      <Link
        target="_blank"
        href="https://www.thewidlarzgroup.com/?utm_source=rnvp&utm_medium=docs#Contact"
        className="premium-support__link"
        rel="noreferrer"
      >
        Premium support →
      </Link>
    </div>
  );
};
