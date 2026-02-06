export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white text-black rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    {children}
  </div>
);
