// Article Class
export class Article {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  url: string;
  private _readTime: string;
  private _likes: number;

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
    this._readTime = readTime;
    this._likes = likes;
  }

  get readTime(): string {
    return this._readTime;
  }

  get likes(): number {
    return this._likes;
  }
  set likes(value: number) {
    this._likes = value;
  }

  getFormattedLikes(): string {
    return `👍 ${this._likes.toLocaleString()}`;
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
      updates.readTime ?? this._readTime,
      updates.likes ?? this._likes,
    );
  }
}