import './SplitHoverText.css';

const SplitHoverText = ({
  text,
  className = '',
  height = '19.2px',
  distance = '17px',
}) => (
  <span
    className={`split-hover-text flex overflow-hidden ${className}`.trim()}
    aria-label={text}
    style={{
      '--split-hover-height': height,
      '--split-hover-distance': distance,
    }}
  >
    {text.split('').map((char, index) => (
      <span
        key={`${char}-${index}`}
        className="split-hover-text__char relative block overflow-hidden"
        style={{ transitionDelay: `${index * 28}ms` }}
        aria-hidden="true"
      >
        <span
          className="split-hover-text__track block transition-transform duration-[600ms] ease-[cubic-bezier(0.87,0,0.13,1)]"
          style={{ transitionDelay: `${index * 28}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
        <span
          className="split-hover-text__track split-hover-text__track--clone absolute left-0 block transition-transform duration-[600ms] ease-[cubic-bezier(0.87,0,0.13,1)]"
          style={{ transitionDelay: `${index * 28}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    ))}
  </span>
);

export default SplitHoverText;
