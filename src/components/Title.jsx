// Заголовок в стиле сайта: первая буква — рукописный инициал, остальное — тонкий капслок.
// Текст в DOM остаётся целым словом, поэтому читалки и поиск видят обычный заголовок.
export default function Title({ as = 'h2', id, text, className = '' }) {
  const Tag = as;
  const first = text.slice(0, 1);
  const rest = text.slice(1);
  return (
    <Tag id={id} className={`title ${className}`.trim()}>
      <span className="title__initial">{first}</span>
      {rest}
    </Tag>
  );
}
