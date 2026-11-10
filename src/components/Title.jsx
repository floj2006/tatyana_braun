// Заголовок секции: тонкий капслок. Рукописный шрифт в заголовках не используется:
// на нём инициалы наползали на текст.
export default function Title({ as = 'h2', id, text, className = '' }) {
  const Tag = as;
  return (
    <Tag id={id} className={`title ${className}`.trim()}>
      {/* внутренняя строка для анимации «выезжает из-под линии» при появлении раздела */}
      <span className="title__in">{text}</span>
    </Tag>
  );
}
