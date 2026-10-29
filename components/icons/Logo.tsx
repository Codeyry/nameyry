
type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
    >
      <rect
        width="64"
        height="64"
        rx="14"
        fill="#57d5c5"
      />
      <text
        x="32"
        y="46"
        fontFamily="system-ui, sans-serif"
        fontWeight={800}
        fontSize={40}
        fill="#000"
        textAnchor="middle"
      >
        N
      </text>
    </svg>
  );
}
