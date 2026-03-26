// Article Class
export class Article {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  url: string;
  readTime: string;
  likes: number;

  constructor(
    id: number,
    title: string,
    category: string,
    description: string,
    author: string,
    url: string,
    readTime: string = '5 min',
    likes: number = 0,
  ) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.description = description;
    this.author = author;
    this.url = url;
    this.readTime = readTime;
    this.likes = likes;
  }

  incrementLikes(): void {
    this.likes += 1;
  }

  copyWith(
    updates: Partial<{
      readTime: string;
      likes: number;
    }>,
  ): Article {
    return new Article(
      this.id,
      this.title,
      this.category,
      this.description,
      this.author,
      this.url,
      updates.readTime ?? this.readTime,
      updates.likes ?? this.likes,
    );
  }
}