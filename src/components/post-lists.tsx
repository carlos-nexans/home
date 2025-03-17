"use client";

import { BlogPost } from "@/content/utils";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const formatDate = (date: string, locale: string) => {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "2-digit",
  };

  // For Spanish: day month year (e.g., "15 ene '24")
  // For English: month day year (e.g., "Jan 15 '24")
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

export default function PostList({ posts }: { posts: BlogPost[] }) {
  const locale = useLocale();

  return (
    <div className="flex flex-col space-y-6">
      {posts.map((post) => (
        <div className="flex flex-col" key={post.metadata.slug}>
          <div className="flex flex-grow flex-wrap justify-between md:items-center">
            <Link
              href={`/${post.metadata.slug}`}
              className="transition-colors duration-300 hover:text-scooter-500"
            >
              <span className="font-bold m-0">{post.metadata.title}</span>
            </Link>
            <span className="text-gray-500">
              {formatDate(post.metadata.date, locale)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag: string) => (
              <span
                key={`${post.metadata.slug}-${tag}`}
                className="border rounded px-2 py-1 text-sm border-gray-400 border-b-blue-ribbon-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
