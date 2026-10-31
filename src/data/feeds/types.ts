export type FeedImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

export type FeedVideo = {
  provider: "youtube";
  id: string;
  title?: string;
};

export type FeedLink = {
  text: string;
  href: string;
};

export type FeedPost = {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  excerpt: string;
  content: string[];
  image?: FeedImage;
  video?: FeedVideo;
  links?: FeedLink[];
  tags?: string[];
};
