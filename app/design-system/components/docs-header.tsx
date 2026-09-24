/* Title and description at the top of a design system page */

type Props = {
  title: string
  description: string
}

export default function DocsHeader({ title, description }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
