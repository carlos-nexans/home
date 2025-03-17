"use client";

import { BlogPost } from "@/content/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import PostList from "./post-lists";

export default function LatestPosts({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations('home');
  return (
    <div>
      <h1 className="text-[32px] font-bold">{t('latestPosts')}</h1>
      <PostList posts={posts} />
    </div>
  );
}
