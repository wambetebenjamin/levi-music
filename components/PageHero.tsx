export function PageHero({
  eyebrow,
  title,
  image,
  small = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  image: string;
  small?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`breadcumb-area bg-img bg-overlay levi-breadcrumb ${small ? "levi-breadcrumb-sm" : ""}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="bradcumbContent">
        {eyebrow && <p>{eyebrow}</p>}
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}
