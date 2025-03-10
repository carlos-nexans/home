import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BlogPostCardProps {
  title: string
  date: string
  tags: string[]
  url: string
}

export function BlogPostCard({ title, date, tags, url }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={url}>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{date}</p>
        </CardContent>
      </Link>
    </Card>
  )
}

