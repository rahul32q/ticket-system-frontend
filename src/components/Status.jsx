const LABELS = {
  open: 'Open',
  in_progress: 'In progress',
  closed: 'Closed',
}

export default function Status({ value }) {
  return (
    <span className={`status status--${value}`}>
      <span className="status__dot" />
      {LABELS[value] || value}
    </span>
  )
}
