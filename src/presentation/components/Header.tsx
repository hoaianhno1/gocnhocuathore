/** @format */

interface HeaderProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionPath: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {/* <Link className="ghost-btn" to={actionPath}>
        {actionLabel}
      </Link> */}
    </header>
  );
}
